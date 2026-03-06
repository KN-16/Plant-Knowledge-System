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

  // 1. Kiểm tra header
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Lấy token
      token = authHeader.split(' ')[1];

      // 2. Verify token (SỬA: Dùng đúng JWT_ACCESS_SECRET)
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      // 3. Tìm user trong DB (để chắc chắn user chưa bị xóa/ban)
      // Tối ưu: Chỉ select các trường cần thiết, không lấy password_hash
      const user = await Account.findByPk(decoded.account_id, {
        attributes: ['account_id', 'role', 'status', 'username'] 
      });

      if (user) {
        // 4. Kiểm tra xem tài khoản có bị khóa không (BỔ SUNG)
        if (user.status !== 'active') {
             res.status(403);
             throw new Error('Tài khoản đã bị vô hiệu hóa');
        }

        // Gán user vào req để dùng ở controller tiếp theo
        req.user = {
          account_id: user.account_id,
          username: user.username,
          role: user.role,
        };
        
        next();
      } else {
        res.status(401);
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Auth Error:', error.message);
      
      // Nếu token hết hạn, jwt.verify sẽ ném lỗi TokenExpiredError
      // Frontend cần mã 401 để kích hoạt cơ chế Refresh Token
      res.status(401);
      
      if (error.name === 'TokenExpiredError') {
          throw new Error('Token expired');
      } else {
          throw new Error('Not authorized, token failed');
      }
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});


export { requireAuth, adminOnly, verifyToken};