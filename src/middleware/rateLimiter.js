import rateLimit from 'express-rate-limit';
import { CONFIG } from '../config/constants.js';

export const globalLimiter = rateLimit({
  windowMs: CONFIG.LIMITS.GLOBAL_RATE_LIMIT_WINDOW_MS,
  max: CONFIG.LIMITS.GLOBAL_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests, please try again later.'
    }
  }
});

export const demoLimiter = rateLimit({
  windowMs: CONFIG.LIMITS.DEMO_RATE_LIMIT_WINDOW_MS,
  max: CONFIG.LIMITS.DEMO_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Demo rate limit exceeded (maximum 15 requests per minute). Connect via RapidAPI for unlimited throughput.'
    }
  }
});
