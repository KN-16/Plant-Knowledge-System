import express from 'express';
import taxonomyRoutes from './taxonomyRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import publicRoutes from './publicRoutes.js';
const router = express.Router();

// Auth
router.use('/auth', authRoutes);
router.use('/taxonomy', taxonomyRoutes);
router.use('/admin', adminRoutes);
router.use('/public', publicRoutes);

export default router;