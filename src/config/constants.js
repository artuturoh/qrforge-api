export const CONFIG = {
  SERVICE_NAME: 'qrforge-api',
  VERSION: '1.0.0',
  DEFAULT_PORT: 3000,
  
  PAYLOAD_TYPES: [
    'url',
    'text',
    'wifi',
    'whatsapp',
    'vcard',
    'email',
    'sms',
    'crypto',
    'event'
  ],

  DEFAULTS: {
    TYPE: 'url',
    FORMAT: 'svg',
    WIDTH: 400,
    MARGIN: 2,
    DARK_COLOR: '#0F172A',
    LIGHT_COLOR: '#FFFFFF',
    ERROR_CORRECTION_LEVEL: 'M',
    MAX_BADGE_LENGTH: 6
  },

  LIMITS: {
    MIN_WIDTH: 128,
    MAX_WIDTH: 2048,
    MIN_MARGIN: 0,
    MAX_MARGIN: 10,
    MAX_BATCH_SIZE: 25,
    MAX_BADGE_CHARS: 6,
    DEMO_RATE_LIMIT_WINDOW_MS: 60 * 1000,
    DEMO_RATE_LIMIT_MAX: 15,
    GLOBAL_RATE_LIMIT_WINDOW_MS: 60 * 1000,
    GLOBAL_RATE_LIMIT_MAX: 120
  },

  REGEX: {
    HEX_COLOR: /^#[0-9A-Fa-f]{6}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },

  ALLOWED_FORMATS: ['svg', 'png'],
  ALLOWED_ECL: ['L', 'M', 'Q', 'H']
};
