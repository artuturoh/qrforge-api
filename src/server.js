import app from './app.js';
import { CONFIG } from './config/constants.js';

const PORT = Number(process.env.PORT) || CONFIG.DEFAULT_PORT;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`⚡ [QRForge API] Microservice listening on http://${HOST}:${PORT}`);
  console.log(`🚀 Architecture: 100% In-Memory Deterministic Engine`);
  console.log(`🔒 RapidAPI Secret Enforced: ${Boolean(process.env.RAPIDAPI_PROXY_SECRET)}`);
});

// Graceful termination handling
process.on('SIGTERM', () => {
  console.log('⚡ [QRForge API] SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('⚡ [QRForge API] Process terminated.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('⚡ [QRForge API] SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('⚡ [QRForge API] Process terminated.');
    process.exit(0);
  });
});

export default server;
