import { Router } from 'express';
import { generate, batch } from '../controllers/qrController.js';
import { demoLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Standard authenticated generation
router.post('/generate', generate);

// Public rate-limited demo endpoint for landing page playground
router.post('/demo', demoLimiter, generate);

// Parallel batch generation (1-25 items)
router.post('/batch', batch);

export default router;
