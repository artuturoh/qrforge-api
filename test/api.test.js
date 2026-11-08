import { test, describe, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

describe('QRForge API Test Suite', () => {
  // Ensure RAPIDAPI_PROXY_SECRET is unset by default for standard testing
  const originalEnvSecret = process.env.RAPIDAPI_PROXY_SECRET;

  beforeEach(() => {
    delete process.env.RAPIDAPI_PROXY_SECRET;
  });

  after(() => {
    if (originalEnvSecret) {
      process.env.RAPIDAPI_PROXY_SECRET = originalEnvSecret;
    } else {
      delete process.env.RAPIDAPI_PROXY_SECRET;
    }
  });

  describe('Health & Metadata Endpoints', () => {
    test('1. GET /health returns 200 with service status, uptime, and timestamp', async () => {
      const res = await request(app).get('/health');
      assert.equal(res.status, 200);
      assert.equal(res.body.status, 'ok');
      assert.equal(res.body.service, 'qrforge-api');
      assert.equal(res.body.version, '1.0.0');
      assert.equal(typeof res.body.uptime, 'number');
      assert.ok(Date.parse(res.body.timestamp));
    });

    test('2. GET / returns HTML landing page for browser requests (Accept: text/html)', async () => {
      const res = await request(app)
        .get('/')
        .set('Accept', 'text/html,application/xhtml+xml');
      assert.equal(res.status, 200);
      assert.match(res.headers['content-type'], /text\/html/);
      assert.ok(res.text.includes('QRForge API'));
      assert.ok(res.text.includes('Generator Studio'));
      assert.ok(res.text.includes('Live Preview'));
    });

    test('3. GET / returns JSON metadata for API clients (Accept: application/json)', async () => {
      const res = await request(app)
        .get('/')
        .set('Accept', 'application/json');
      assert.equal(res.status, 200);
      assert.match(res.headers['content-type'], /application\/json/);
      assert.equal(res.body.service, 'QRForge API');
      assert.equal(res.body.version, '1.0.0');
      assert.ok(res.body.endpoints);
      assert.ok(Array.isArray(res.body.supportedTypes));
    });
  });

  describe('Smart Payload Builders (POST /v1/generate)', () => {
    test('4. Generates standard URL payload', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'url',
          data: 'https://example.com'
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.type, 'url');
      assert.equal(res.body.data.payloadString, 'https://example.com');
      assert.equal(res.body.data.format, 'svg');
      assert.equal(res.body.data.mimeType, 'image/svg+xml');
      assert.match(res.body.data.svg, /<svg/);
      assert.match(res.body.data.dataUri, /^data:image\/svg\+xml;base64,/);
      assert.ok(res.body.meta.execution_time_ms >= 0);
    });

    test('5. Generates plain text payload from object { text: "..." }', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'text',
          data: { text: 'Hello QRForge Systems!' }
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.payloadString, 'Hello QRForge Systems!');
    });

    test('6. Generates Wi-Fi payload with standard escape formatting', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'wifi',
          data: {
            ssid: 'Office-WiFi;5G',
            password: 'pass;word:123',
            encryption: 'WPA',
            hidden: false
          }
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.type, 'wifi');
      // Special characters ; and : escaped with backslash
      assert.equal(res.body.data.payloadString, 'WIFI:T:WPA;S:Office-WiFi\\;5G;P:pass\\;word\\:123;H:false;;');
    });

    test('7. Generates WhatsApp direct payload with sanitized phone digits', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'whatsapp',
          data: {
            phone: '+1 (415) 555-2671',
            message: 'Hello QRForge!'
          }
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.payloadString, 'https://wa.me/14155552671?text=Hello%20QRForge!');
    });

    test('8. Generates vCard 3.0 contact payload', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'vcard',
          data: {
            firstName: 'Ada',
            lastName: 'Lovelace',
            phone: '+44 20 7946 0991',
            email: 'ada@computing.org',
            org: 'Analytical Engine Corp',
            title: 'Chief Architect'
          }
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      const payload = res.body.data.payloadString;
      assert.ok(payload.includes('BEGIN:VCARD'));
      assert.ok(payload.includes('VERSION:3.0'));
      assert.ok(payload.includes('N:Lovelace;Ada;;;'));
      assert.ok(payload.includes('FN:Ada Lovelace'));
      assert.ok(payload.includes('ORG:Analytical Engine Corp'));
      assert.ok(payload.includes('TEL;TYPE=CELL:+44 20 7946 0991'));
      assert.ok(payload.includes('EMAIL:ada@computing.org'));
      assert.ok(payload.includes('END:VCARD'));
    });

    test('9. Generates Email mailto payload with subject and body', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'email',
          data: {
            to: 'support@example.com',
            subject: 'Inquiry',
            body: 'Need API access'
          }
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.payloadString, 'mailto:support@example.com?subject=Inquiry&body=Need%20API%20access');
    });

    test('10. Generates SMS payload with phone and message', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'sms',
          data: {
            phone: '+15551234567',
            message: 'Verification Code: 994821'
          }
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.payloadString, 'SMSTO:+15551234567:Verification Code: 994821');
    });

    test('11. Generates Crypto payload in BIP21 standard format', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'crypto',
          data: {
            currency: 'bitcoin',
            address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            amount: '0.005',
            message: 'Invoice 104'
          }
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(
        res.body.data.payloadString,
        'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.005&message=Invoice%20104'
      );
    });

    test('12. Generates Calendar Event payload in iCalendar VEVENT format', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'event',
          data: {
            title: 'Q3 Architectural Review',
            location: 'Conference Room 4B',
            start: '2026-12-01T10:00:00Z',
            end: '2026-12-01T11:30:00Z',
            description: 'Microservice performance benchmarks'
          }
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      const payload = res.body.data.payloadString;
      assert.ok(payload.includes('BEGIN:VCALENDAR'));
      assert.ok(payload.includes('BEGIN:VEVENT'));
      assert.ok(payload.includes('SUMMARY:Q3 Architectural Review'));
      assert.ok(payload.includes('LOCATION:Conference Room 4B'));
      assert.ok(payload.includes('DTSTART:20261201T100000Z'));
      assert.ok(payload.includes('DTEND:20261201T113000Z'));
      assert.ok(payload.includes('END:VEVENT'));
    });
  });

  describe('Branding, Styling & Center Badging', () => {
    test('13. Applies custom 6-digit hex colors (darkColor and lightColor)', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'url',
          data: 'https://example.com/branding',
          options: {
            darkColor: '#1E293B',
            lightColor: '#F1F5F9'
          }
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.data.colors.dark, '#1E293B');
      assert.equal(res.body.data.colors.light, '#F1F5F9');
      assert.ok(res.body.data.svg.includes('#1E293B') || res.body.data.svg.includes('#1e293b'));
      assert.ok(res.body.data.svg.includes('#F1F5F9') || res.body.data.svg.includes('#f1f5f9'));
    });

    test('14. Applies custom width and margin', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'url',
          data: 'https://example.com',
          options: {
            width: 800,
            margin: 4
          }
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.data.width, 800);
      assert.equal(res.body.data.margin, 4);
      assert.ok(res.body.data.svg.includes('width="800"'));
    });

    test('15. Auto-upgrades errorCorrectionLevel to "H" when centerBadgeText is provided', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'url',
          data: 'https://example.com',
          options: {
            errorCorrectionLevel: 'L',
            centerBadgeText: 'SCAN'
          }
        });

      assert.equal(res.status, 200);
      // Auto-upgraded from 'L' to 'H'
      assert.equal(res.body.data.errorCorrectionLevel, 'H');
      assert.equal(res.body.data.hasCenterBadge, true);
    });

    test('16. Injects SVG center badge element with rounded rectangle and bold label', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'wifi',
          data: { ssid: 'GuestNet', password: 'guest' },
          options: {
            centerBadgeText: 'WIFI'
          }
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.data.hasCenterBadge, true);
      assert.ok(res.body.data.svg.includes('id="qrforge-center-badge"'));
      assert.ok(res.body.data.svg.includes('>WIFI</text>'));
      assert.ok(res.body.data.svg.includes('dominant-baseline="central"'));
    });

    test('17. Generates PNG format with valid base64 dataUri', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'url',
          data: 'https://example.com/png',
          options: {
            format: 'png',
            width: 300
          }
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.data.format, 'png');
      assert.equal(res.body.data.mimeType, 'image/png');
      assert.equal(res.body.data.svg, null);
      assert.match(res.body.data.dataUri, /^data:image\/png;base64,/);
    });
  });

  describe('Batch Generation (POST /v1/batch)', () => {
    test('18. Processes multiple items in parallel', async () => {
      const res = await request(app)
        .post('/v1/batch')
        .send({
          items: [
            { id: 'qr-1', type: 'url', data: 'https://example.com/1' },
            { id: 'qr-2', type: 'wifi', data: { ssid: 'Office' } },
            { id: 'qr-3', type: 'text', data: 'Batch item 3', options: { format: 'png' } }
          ]
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.count, 3);
      assert.equal(res.body.data.length, 3);
      assert.equal(res.body.data[0].id, 'qr-1');
      assert.equal(res.body.data[0].format, 'svg');
      assert.equal(res.body.data[1].id, 'qr-2');
      assert.equal(res.body.data[2].id, 'qr-3');
      assert.equal(res.body.data[2].format, 'png');
      assert.ok(res.body.meta.execution_time_ms >= 0);
    });

    test('19. Rejects empty items array (400 Bad Request)', async () => {
      const res = await request(app)
        .post('/v1/batch')
        .send({ items: [] });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'BAD_REQUEST');
      assert.match(res.body.error.message, /between 1 and 25 items/);
    });

    test('20. Rejects more than 25 items (400 Bad Request)', async () => {
      const items = Array.from({ length: 26 }, (_, i) => ({
        id: `qr-${i}`,
        type: 'url',
        data: `https://example.com/${i}`
      }));

      const res = await request(app)
        .post('/v1/batch')
        .send({ items });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.match(res.body.error.message, /exceeds the maximum allowed limit of 25 items/);
    });

    test('21. Rejects non-array items field (400 Bad Request)', async () => {
      const res = await request(app)
        .post('/v1/batch')
        .send({ items: 'not-an-array' });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.match(res.body.error.message, /must be an array/);
    });
  });

  describe('Validation & Error Handling', () => {
    test('22. Returns 400 Bad Request when payload data is missing', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({ type: 'url' });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'BAD_REQUEST');
      assert.match(res.body.error.message, /Missing payload data/);
    });

    test('23. Returns 400 Bad Request on invalid darkColor hex code', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'url',
          data: 'https://example.com',
          options: { darkColor: 'not-a-hex' }
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.match(res.body.error.message, /Invalid darkColor/);
    });

    test('24. Returns 400 Bad Request on invalid lightColor hex code', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'url',
          data: 'https://example.com',
          options: { lightColor: '#12345' } // only 5 chars
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.match(res.body.error.message, /Invalid lightColor/);
    });

    test('25. Returns 400 Bad Request on unsupported format', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'url',
          data: 'https://example.com',
          options: { format: 'gif' }
        });

      assert.equal(res.status, 400);
      assert.match(res.body.error.message, /Invalid format/);
    });

    test('26. Returns 400 Bad Request when width is out of bounds (< 128 or > 2048)', async () => {
      const resLow = await request(app)
        .post('/v1/generate')
        .send({
          type: 'url',
          data: 'https://example.com',
          options: { width: 64 }
        });
      assert.equal(resLow.status, 400);

      const resHigh = await request(app)
        .post('/v1/generate')
        .send({
          type: 'url',
          data: 'https://example.com',
          options: { width: 4096 }
        });
      assert.equal(resHigh.status, 400);
    });

    test('27. Returns 400 Bad Request when margin is out of bounds (< 0 or > 10)', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'url',
          data: 'https://example.com',
          options: { margin: 15 }
        });
      assert.equal(res.status, 400);
      assert.match(res.body.error.message, /Margin must be an integer between 0 and 10/);
    });

    test('28. Returns 400 Bad Request when centerBadgeText exceeds 6 characters', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'url',
          data: 'https://example.com',
          options: { centerBadgeText: 'TOOLONGTEXT' }
        });

      assert.equal(res.status, 400);
      assert.match(res.body.error.message, /centerBadgeText must not exceed 6 characters/);
    });

    test('29. Returns 400 Bad Request on unsupported payload type', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'unknown_type',
          data: 'foo'
        });

      assert.equal(res.status, 400);
      assert.match(res.body.error.message, /Unsupported payload type/);
    });

    test('30. Returns 400 Bad Request for Wi-Fi missing SSID', async () => {
      const res = await request(app)
        .post('/v1/generate')
        .send({
          type: 'wifi',
          data: { password: 'secret' }
        });

      assert.equal(res.status, 400);
      assert.match(res.body.error.message, /SSID is required/);
    });
  });

  describe('Security & RapidAPI Middleware', () => {
    test('31. Rejects with 401 Unauthorized when RAPIDAPI_PROXY_SECRET is set and header is missing', async () => {
      process.env.RAPIDAPI_PROXY_SECRET = 'secret-production-key-9988';

      const res = await request(app)
        .post('/v1/generate')
        .send({ type: 'url', data: 'https://example.com' });

      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'UNAUTHORIZED');
      assert.match(res.body.error.message, /X-RapidAPI-Proxy-Secret/);
    });

    test('32. Rejects with 401 Unauthorized when header is incorrect', async () => {
      process.env.RAPIDAPI_PROXY_SECRET = 'secret-production-key-9988';

      const res = await request(app)
        .post('/v1/generate')
        .set('X-RapidAPI-Proxy-Secret', 'wrong-secret')
        .send({ type: 'url', data: 'https://example.com' });

      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'UNAUTHORIZED');
    });

    test('33. Allows request with 200 OK when X-RapidAPI-Proxy-Secret matches', async () => {
      process.env.RAPIDAPI_PROXY_SECRET = 'secret-production-key-9988';

      const res = await request(app)
        .post('/v1/generate')
        .set('X-RapidAPI-Proxy-Secret', 'secret-production-key-9988')
        .send({ type: 'url', data: 'https://example.com' });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
    });

    test('34. Exemption: /v1/demo works without RapidAPI secret even when RAPIDAPI_PROXY_SECRET is set', async () => {
      process.env.RAPIDAPI_PROXY_SECRET = 'secret-production-key-9988';

      const res = await request(app)
        .post('/v1/demo')
        .send({
          type: 'url',
          data: 'https://github.com/artuturoh/qrforge-api'
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
    });

    test('35. Exemption: /health bypasses RapidAPI secret check', async () => {
      process.env.RAPIDAPI_PROXY_SECRET = 'secret-production-key-9988';

      const res = await request(app).get('/health');
      assert.equal(res.status, 200);
      assert.equal(res.body.status, 'ok');
    });

    test('36. Returns 404 for unknown endpoints', async () => {
      const res = await request(app).get('/v1/unknown-endpoint');
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'NOT_FOUND');
    });
  });
});
