// controllers/authController.js

import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import Account from '../models/Account.js';

/* =====================================================
   TOKEN HELPERS
===================================================== */

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      account_id: user.account_id,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      account_id: user.account_id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES }
  );
};

/* =====================================================
   @desc    Login user
   @route   POST /api/auth/login
   @access  Public
===================================================== */
const loginUser = asyncHandler(async (req, res) => {
  try {
  const { identifier, password } = req.body;
  const user =
    (await Account.findOne({ where: { username: identifier } })) ||
    (await Account.findOne({ where: { email: identifier } }));

  if (!user || !(await user.checkPassword(password))) {
    return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
  }

  if (user.status !== 'active') {
    return res.status(403).json({ message: 'Tài khoản bị khóa' });
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Lưu refresh token vào cookie (httpOnly)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
  });
  
  res.status(200).json({
    accessToken,
    user: {
      account_id: user.account_id,
      code: user.code,
      username: user.username,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    },
  });
} catch (error) {
    console.error(error);
    throw error;
  }
});

/* =====================================================
   @desc    Refresh access token
   @route   POST /api/auth/refresh
   @access  Public (cookie refreshToken)
===================================================== */
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'Không có refresh token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await Account.findByPk(decoded.account_id);

    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'User không hợp lệ' });
    }

    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token không hợp lệ' });
  }
});

/* =====================================================
   @desc    Logout user
   @route   POST /api/auth/logout
   @access  Public
===================================================== */
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'strict',
  });

  res.status(200).json({
    success: true,
    message: 'Đăng xuất thành công',
  });
});

/* =====================================================
   API tạo Admin đầu tiên (chạy 1 lần)
===================================================== */
const createInitialAdmin = asyncHandler(async (req, res) => {
  const exists = await Account.findOne({ where: { username: 'admin' } });

  if (exists) {
    return res.status(400).json({ message: 'Admin đã tồn tại' });
  }

  await Account.create({
    username: 'admin',
    email: 'admin@system.com',
    password_hash: '123456', // hook sẽ hash
    role: 'admin',
    full_name: 'Super Admin',
    status: 'active',
  });

  res.status(201).json({ message: 'Admin created successfully' });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await Account.findByPk(req.user.account_id, {
    attributes: {exclude: ['password_hash', 'createdAt', 'updatedAt']}
  });

  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
  }

  res.json(user);
});

// 2. Tự sửa thông tin cá nhân
const updateMyProfile = async (req, res) => {
    try {
        const accountId = req.user.account_id;
        // Chỉ cho phép cập nhật những trường an toàn
        const { full_name, phone_number, address } = req.body;

        const account = await Account.findByPk(accountId);
        if (!account) return res.status(404).json({ success: false, message: "Tài khoản không tồn tại" });

        await account.update({ full_name, phone_number, address });
        
        return res.status(200).json({ success: true, message: "Cập nhật thông tin thành công" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// 3. Tự đổi mật khẩu của mình
const changeMyPassword = async (req, res) => {
    try {
        const accountId = req.user.account_id;
        const { old_password, new_password } = req.body;

        const account = await Account.findByPk(accountId);
        if (!account) return res.status(404).json({ success: false, message: "Tài khoản không tồn tại" });

        // Gọi method checkPassword đã định nghĩa ở Prototype của Model Account
        const isMatch = await account.checkPassword(old_password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Mật khẩu hiện tại không chính xác!" });
        }

        // Đổi pass mới, Sequelize Hook sẽ tự lo việc Hash
        account.password_hash = new_password; 
        await account.save();

        return res.status(200).json({ success: true, message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export {
  loginUser,
  refreshToken,
  logoutUser,
  createInitialAdmin,
  getMe,
  updateMyProfile,
  changeMyPassword
};
