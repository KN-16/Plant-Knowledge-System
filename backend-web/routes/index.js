import express from 'express';
import taxonomyRoutes from './taxonomyRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
const router = express.Router();

// Auth
router.use('/auth', authRoutes);
router.use('/taxonomy', taxonomyRoutes);
router.use('/admin', adminRoutes);
export default router;