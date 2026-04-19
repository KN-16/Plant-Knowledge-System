import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import {requireRole } from '../middleware/roleMiddleware.js';
import { requireAuth} from '../middleware/authMiddleware.js';
import {getAllAccounts, createAccount, updateAccount, 
    updatePassword, toggleStatus, deleteAccount} from '../controllers/accountController.js';

const router = express.Router();
router.use(requireAuth);

router.get('/dashboard/stats', getDashboardStats);
// Admin role
router.get('/accounts', requireRole('admin'), getAllAccounts);
router.post('/accounts', requireRole('admin') ,createAccount);
router.put('/accounts/:id', requireRole('admin'), updateAccount);
router.put('/accounts/:id/password', requireRole('admin'), updatePassword);
router.put('/accounts/:id/status', requireRole('admin'), toggleStatus);
router.delete('/accounts/:id', requireRole('admin'), deleteAccount);

export default router;