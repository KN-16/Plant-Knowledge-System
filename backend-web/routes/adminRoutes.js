import express from 'express';
import { getStats } from '../controllers/dashboardController.js';
import {requireRole } from '../middleware/roleMiddleware.js';
import { requireAuth} from '../middleware/authMiddleware.js';


const router = express.Router();
router.use(requireAuth);

router.get('/dashboard/stats', getStats);

export default router;