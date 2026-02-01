import express from 'express';
import {
  loginUser,
  refreshToken,
  logoutUser,
  createInitialAdmin
} from '../controllers/authController.js';

import {
  loginValidator,
} from '../utils/validators.js';

import handleValidationErrors from '../middleware/validationMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post(
  '/login',
  authLimiter,
  loginValidator,
  handleValidationErrors,
  loginUser
);
router.post('/refresh', refreshToken);
router.post('/logout', requireAuth, logoutUser);
router.post('/create-initial-admin', createInitialAdmin);

export default router;