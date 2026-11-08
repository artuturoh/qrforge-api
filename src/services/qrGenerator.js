import QRCode from 'qrcode';
import { CONFIG } from '../config/constants.js';
import { buildPayload, ValidationError } from './payloadBuilder.js';
import { injectCenterBadge } from './badgeInjector.js';

/**
 * Validates and normalizes styling options
 */
export function validateOptions(rawOptions = {}) {
  const options = { ...rawOptions };

  // Format validation
  const format = options.format ? String(options.format).toLowerCase().trim() : CONFIG.DEFAULTS.FORMAT;
  if (!CONFIG.ALLOWED_FORMATS.includes(format)) {
    throw new ValidationError(`Invalid format "${format}". Allowed formats: ${CONFIG.ALLOWED_FORMATS.join(', ')}`);
  }

  // Width validation
  let width = options.width !== undefined ? Number(options.width) : CONFIG.DEFAULTS.WIDTH;
  if (!Number.isInteger(width) || width < CONFIG.LIMITS.MIN_WIDTH || width > CONFIG.LIMITS.MAX_WIDTH) {
    throw new ValidationError(`Width must be an integer between ${CONFIG.LIMITS.MIN_WIDTH} and ${CONFIG.LIMITS.MAX_WIDTH}`);
  }

  // Margin validation
  let margin = options.margin !== undefined ? Number(options.margin) : CONFIG.DEFAULTS.MARGIN;
  if (!Number.isInteger(margin) || margin < CONFIG.LIMITS.MIN_MARGIN || margin > CONFIG.LIMITS.MAX_MARGIN) {
    throw new ValidationError(`Margin must be an integer between ${CONFIG.LIMITS.MIN_MARGIN} and ${CONFIG.LIMITS.MAX_MARGIN}`);
  }

  // Colors validation
  const darkColor = options.darkColor ? String(options.darkColor).toUpperCase().trim() : CONFIG.DEFAULTS.DARK_COLOR;
  if (!CONFIG.REGEX.HEX_COLOR.test(darkColor)) {
    throw new ValidationError(`Invalid darkColor "${darkColor}". Must be a valid 6-digit hex color like "#0F172A"`);
  }

  const lightColor = options.lightColor ? String(options.lightColor).toUpperCase().trim() : CONFIG.DEFAULTS.LIGHT_COLOR;
  if (!CONFIG.REGEX.HEX_COLOR.test(lightColor)) {
    throw new ValidationError(`Invalid lightColor "${lightColor}". Must be a valid 6-digit hex color like "#FFFFFF"`);
  }

  // Center badge text validation
  let centerBadgeText = options.centerBadgeText !== undefined && options.centerBadgeText !== null
    ? String(options.centerBadgeText).trim()
    : null;

  if (centerBadgeText && centerBadgeText.length > CONFIG.LIMITS.MAX_BADGE_CHARS) {
    throw new ValidationError(`centerBadgeText must not exceed ${CONFIG.LIMITS.MAX_BADGE_CHARS} characters`);
  }
  if (centerBadgeText === '') {
    centerBadgeText = null;
  }

  // Error Correction Level
  let errorCorrectionLevel = options.errorCorrectionLevel
    ? String(options.errorCorrectionLevel).toUpperCase().trim()
    : CONFIG.DEFAULTS.ERROR_CORRECTION_LEVEL;

  if (!CONFIG.ALLOWED_ECL.includes(errorCorrectionLevel)) {
    throw new ValidationError(`Invalid errorCorrectionLevel "${errorCorrectionLevel}". Allowed levels: ${CONFIG.ALLOWED_ECL.join(', ')}`);
  }

  // Auto-upgrade to 'H' when center badge is requested to preserve 100% scannability
  if (centerBadgeText) {
    errorCorrectionLevel = 'H';
  }

  return {
    format,
    width,
    margin,
    darkColor,
    lightColor,
    errorCorrectionLevel,
    centerBadgeText
  };
}

/**
 * Generates QR Code SVG or PNG deterministically in-memory
 */
export async function generateQrCode({ type = 'url', data, options = {} }) {
  const validatedOptions = validateOptions(options);
  const payloadString = buildPayload(type, data);

  const qrOptions = {
    errorCorrectionLevel: validatedOptions.errorCorrectionLevel,
    margin: validatedOptions.margin,
    width: validatedOptions.width,
    color: {
      dark: validatedOptions.darkColor,
      light: validatedOptions.lightColor
    }
  };

  let svg = null;
  let dataUri = null;
  let hasCenterBadge = false;

  if (validatedOptions.format === 'svg') {
    const rawSvg = await QRCode.toString(payloadString, {
      ...qrOptions,
      type: 'svg'
    });

    if (validatedOptions.centerBadgeText) {
      svg = injectCenterBadge(rawSvg, validatedOptions.centerBadgeText, {
        dark: validatedOptions.darkColor,
        light: validatedOptions.lightColor
      });
      hasCenterBadge = true;
    } else {
      svg = rawSvg;
    }

    dataUri = `data:image/svg+xml;base64,${Buffer.from(svg, 'utf-8').toString('base64')}`;
  } else {
    // PNG format
    dataUri = await QRCode.toDataURL(payloadString, qrOptions);
    svg = null;
    hasCenterBadge = false;
  }

  return {
    type: String(type).toLowerCase().trim(),
    payloadString,
    format: validatedOptions.format,
    mimeType: validatedOptions.format === 'svg' ? 'image/svg+xml' : 'image/png',
    width: validatedOptions.width,
    margin: validatedOptions.margin,
    errorCorrectionLevel: validatedOptions.errorCorrectionLevel,
    colors: {
      dark: validatedOptions.darkColor,
      light: validatedOptions.lightColor
    },
    hasCenterBadge,
    svg,
    dataUri
  };
}
