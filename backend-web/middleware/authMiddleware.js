// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import Account from '../models/Account.js';
import asyncHandler from 'express-async-handler';

const verifyToken = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Không có quyền truy cập (No Token)" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Account.findByPk(decoded.id);
        if (!req.user) throw new Error();
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Chỉ Admin mới có quyền này" });
    }
};

const requireAuth = asyncHandler(async (req, res, next) => {
  let token;

  // Read the JWT from the Authorization header
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      token = authHeader.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Find the user by ID from token
      // We check both collections, as either a reader or staff could be authenticated
      let user = await Account.findByPk(decoded.account_id);

      if (user) {
        req.user = {
          account_id: user.account_id,
          role: user.role, 
        };
        next();
      } else {
        res.status(401);
        throw new Error('User not found');
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { requireAuth, adminOnly, verifyToken};