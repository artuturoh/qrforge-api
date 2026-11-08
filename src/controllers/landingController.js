import { getLandingHtml } from '../views/landingHtml.js';
import { CONFIG } from '../config/constants.js';

export function getRoot(req, res) {
  const acceptHeader = req.headers.accept || '';

  // Content negotiation: return JSON if client explicitly prefers JSON and not HTML
  if (acceptHeader.includes('application/json') && !acceptHeader.includes('text/html')) {
    return res.status(200).json({
      service: 'QRForge API',
      tagline: 'Smart QR Code, Custom Branding & Payload Generator',
      version: CONFIG.VERSION,
      status: 'operational',
      engine: '100% In-Memory Deterministic Engine (< 5ms)',
      endpoints: {
        health: 'GET /health',
        generate: 'POST /v1/generate',
        demo: 'POST /v1/demo',
        batch: 'POST /v1/batch'
      },
      supportedTypes: CONFIG.PAYLOAD_TYPES,
      documentation: 'https://github.com/artuturoh/qrforge-api',
      rapidapi: 'https://rapidapi.com/artuturoh/api/qrforge-smart-qr-code-and-branded-payload-generator'
    });
  }

  // Browser access: serve interactive landing page with playground
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(getLandingHtml());
}

export function getHealth(req, res) {
  return res.status(200).json({
    status: 'ok',
    service: CONFIG.SERVICE_NAME,
    version: CONFIG.VERSION,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
}
