import { Router } from 'express';
import { getRoot, getHealth } from '../controllers/landingController.js';
import v1Routes from './v1.js';

const router = Router();

// Public metadata / Landing page
router.get('/', getRoot);

// Health check
router.get('/health', getHealth);

// API v1 routes
router.use('/v1', v1Routes);

export default router;
