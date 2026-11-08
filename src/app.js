import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rapidapiAuth } from './middleware/rapidapiAuth.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// Trust reverse proxy headers (e.g., RapidAPI, Cloudflare, AWS ALB)
app.set('trust proxy', 1);

// Security Headers with CSP allowing inline styles/scripts and data: images for the playground
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// Cross-Origin Resource Sharing
app.use(cors());

// Global Rate Limiting
app.use(globalLimiter);

// In-Memory JSON Body Parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// RapidAPI Proxy Secret Verification & Demo Exemption
app.use(rapidapiAuth);

// Application Routes
app.use('/', routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`
    }
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
