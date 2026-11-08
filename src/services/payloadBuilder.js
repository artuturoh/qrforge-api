export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

/**
 * Escapes characters for Wi-Fi strings per ZXing spec:
 * Special characters \ ; , : " should be escaped with a backslash.
 */
function escapeWifi(str = '') {
  return String(str).replace(/([\\;,":])/g, '\\$1');
}

/**
 * Formats a Date or date string to iCalendar UTC timestamp: YYYYMMDDTHHmmssZ
 */
function formatCalendarDate(dateInput) {
  if (!dateInput) return '';
  if (typeof dateInput === 'string' && /^\d{8}(T\d{6}Z?)?$/.test(dateInput)) {
    return dateInput.endsWith('Z') || dateInput.length === 8 ? dateInput : `${dateInput}Z`;
  }
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new ValidationError(`Invalid date format for calendar event: "${dateInput}"`);
  }
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Builds smart payload string based on type and input data
 * @param {string} type - Payload type
 * @param {any} data - Raw payload data
 * @returns {string} Formatted QR code payload string
 */
export function buildPayload(type = 'url', data) {
  if (!data && data !== 0) {
    throw new ValidationError(`Missing payload data for type "${type}"`);
  }

  const normalizedType = String(type).toLowerCase().trim();

  switch (normalizedType) {
    case 'url':
    case 'text': {
      let rawText = '';
      if (typeof data === 'string') {
        rawText = data.trim();
      } else if (typeof data === 'object' && data !== null) {
        rawText = (data.url || data.text || data.data || '').toString().trim();
      }
      if (!rawText) {
        throw new ValidationError(`Payload for type "${normalizedType}" must be a non-empty string or contain "url" / "text"`);
      }
      return rawText;
    }

    case 'wifi': {
      if (typeof data !== 'object' || data === null) {
        throw new ValidationError('Payload for "wifi" must be an object with at least "ssid"');
      }
      const { ssid, password = '', encryption = 'WPA', hidden = false } = data;
      if (!ssid || typeof ssid !== 'string' || !ssid.trim()) {
        throw new ValidationError('Wi-Fi SSID is required and must be a non-empty string');
      }

      const enc = (encryption || 'nopass').toUpperCase();
      const escapedSsid = escapeWifi(ssid.trim());
      const escapedPass = password ? escapeWifi(password) : '';
      const isHidden = Boolean(hidden);

      return `WIFI:T:${enc};S:${escapedSsid};P:${escapedPass};H:${isHidden};;`;
    }

    case 'whatsapp': {
      if (typeof data !== 'object' || data === null) {
        throw new ValidationError('Payload for "whatsapp" must be an object with "phone"');
      }
      const { phone, message = '' } = data;
      if (!phone) {
        throw new ValidationError('WhatsApp "phone" is required');
      }
      const cleanPhone = String(phone).replace(/\D/g, '');
      if (!cleanPhone) {
        throw new ValidationError('WhatsApp "phone" must contain valid international digits');
      }
      const trimmedMessage = String(message || '').trim();
      if (trimmedMessage) {
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(trimmedMessage)}`;
      }
      return `https://wa.me/${cleanPhone}`;
    }

    case 'vcard': {
      if (typeof data !== 'object' || data === null) {
        throw new ValidationError('Payload for "vcard" must be an object');
      }
      const {
        firstName = '',
        lastName = '',
        phone = '',
        email = '',
        org = '',
        title = '',
        url = ''
      } = data;

      const fnTrimmed = String(firstName).trim();
      const lnTrimmed = String(lastName).trim();
      const orgTrimmed = String(org).trim();

      if (!fnTrimmed && !lnTrimmed && !orgTrimmed) {
        throw new ValidationError('vCard requires at least "firstName", "lastName", or "org"');
      }

      const fullName = [fnTrimmed, lnTrimmed].filter(Boolean).join(' ') || orgTrimmed;
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${lnTrimmed};${fnTrimmed};;;`,
        `FN:${fullName}`
      ];

      if (orgTrimmed) lines.push(`ORG:${orgTrimmed}`);
      if (title) lines.push(`TITLE:${String(title).trim()}`);
      if (phone) lines.push(`TEL;TYPE=CELL:${String(phone).trim()}`);
      if (email) lines.push(`EMAIL:${String(email).trim()}`);
      if (url) lines.push(`URL:${String(url).trim()}`);

      lines.push('END:VCARD');
      return lines.join('\n');
    }

    case 'email': {
      if (typeof data !== 'object' || data === null) {
        throw new ValidationError('Payload for "email" must be an object with "to"');
      }
      const { to, subject = '', body = '' } = data;
      if (!to || typeof to !== 'string' || !to.trim()) {
        throw new ValidationError('Email recipient "to" is required');
      }
      const params = [];
      if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
      if (body) params.push(`body=${encodeURIComponent(body)}`);

      const query = params.length > 0 ? `?${params.join('&')}` : '';
      return `mailto:${to.trim()}${query}`;
    }

    case 'sms': {
      if (typeof data !== 'object' || data === null) {
        throw new ValidationError('Payload for "sms" must be an object with "phone"');
      }
      const { phone, message = '' } = data;
      if (!phone || !String(phone).trim()) {
        throw new ValidationError('SMS "phone" is required');
      }
      const cleanPhone = String(phone).trim();
      const msg = String(message || '').trim();
      return msg ? `SMSTO:${cleanPhone}:${msg}` : `SMSTO:${cleanPhone}`;
    }

    case 'crypto': {
      if (typeof data !== 'object' || data === null) {
        throw new ValidationError('Payload for "crypto" must be an object with "address"');
      }
      const { currency = 'bitcoin', address, amount = '', message = '' } = data;
      if (!address || typeof address !== 'string' || !address.trim()) {
        throw new ValidationError('Crypto "address" is required');
      }
      const scheme = String(currency || 'bitcoin').toLowerCase().trim();
      const cleanAddress = address.trim();
      const params = [];

      if (amount !== undefined && amount !== null && String(amount).trim() !== '') {
        params.push(`amount=${encodeURIComponent(String(amount).trim())}`);
      }
      if (message && String(message).trim() !== '') {
        params.push(`message=${encodeURIComponent(String(message).trim())}`);
      }

      const query = params.length > 0 ? `?${params.join('&')}` : '';
      return `${scheme}:${cleanAddress}${query}`;
    }

    case 'event': {
      if (typeof data !== 'object' || data === null) {
        throw new ValidationError('Payload for "event" must be an object with "title", "start", and "end"');
      }
      const { title, location = '', start, end, description = '' } = data;
      if (!title || typeof title !== 'string' || !title.trim()) {
        throw new ValidationError('Calendar event "title" is required');
      }
      if (!start) {
        throw new ValidationError('Calendar event "start" date is required');
      }
      if (!end) {
        throw new ValidationError('Calendar event "end" date is required');
      }

      const formattedStart = formatCalendarDate(start);
      const formattedEnd = formatCalendarDate(end);

      const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${String(title).trim()}`
      ];

      if (description) lines.push(`DESCRIPTION:${String(description).trim()}`);
      if (location) lines.push(`LOCATION:${String(location).trim()}`);
      lines.push(`DTSTART:${formattedStart}`);
      lines.push(`DTEND:${formattedEnd}`);
      lines.push('END:VEVENT');
      lines.push('END:VCALENDAR');

      return lines.join('\n');
    }

    default:
      throw new ValidationError(`Unsupported payload type "${type}". Supported types: url, text, wifi, whatsapp, vcard, email, sms, crypto, event`);
  }
}
