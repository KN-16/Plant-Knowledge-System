// controllers/authController.js

import asyncHandler from 'express-async-handler';
import Account from '../models/Account.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;
    try {
        const user = await Account.findOne({ where: { username: identifier } }) ||
                     await Account.findOne({ where: { email: identifier } });
        
        if (user && (await user.checkPassword(password))) {
            if(user.status !== 'active') return res.status(403).json({message: "Tài khoản bị khóa"});
            const userData ={
            account_id: user.account_id,
            email: user.email,
            code: user.code,
            username: user.username,
            role: user.role,
            full_name: user.full_name,};
            res.json({
              token: generateToken(userData),
            });
        } else {
            res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logoutUser = asyncHandler(async (req, res) => {
  // Clear the httpOnly refresh token cookie
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0), // Set to a past date
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
});

/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/auth/refresh
 * @access  Public (requires valid refresh token cookie)
 */
const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401);
    throw new Error('Not authorized, no refresh token');
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user (check both collections)
    let user = await Account.findById(decoded._id);

    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Issue a new Access Token (Refresh token stays the same)
    const accessToken = jwt.sign(
      { _id: user.account_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, refresh token failed');
  }
});


// API tạo Admin đầu tiên (Chạy 1 lần rồi xóa hoặc comment lại)
const createInitialAdmin = async (req, res) => {
    try {
        const exists = await Account.findOne({ where: { username: 'admin' } });
        if(exists) return res.status(400).json({message: "Admin exist"});
        
        await Account.create({
            username: 'admin',
            email: 'admin@system.com',
            password_hash: '123456', // Sẽ được hash tự động
            role: 'admin',
            full_name: 'Super Admin'
        });
        res.json({message: "Admin created"});
    } catch (e) { res.status(500).json(e.message) }
}

export { loginUser, refreshToken, logoutUser, createInitialAdmin };


// import Docgia from '../models/Docgia.js';
// import NhanVien from '../models/NhanVien.js';
// import generateToken from '../utils/generateToken.js';
// import TheoDoiMuonSach from '../models/TheoDoiMuonSach.js';

// import jwt from 'jsonwebtoken';

// /**
//  * @desc    Login user (Reader or Staff) & get tokens
//  * @route   POST /api/auth/login
//  * @access  Public
//  */
// const login = asyncHandler(async (req, res) => {
//   const { identifier, password } = req.body;
//   let user=null;
 
//   // Try finding user as a Staff (by username or Email)
//   user=(await Account.findOne({ username: identifier })) ||
//     (await Account.findOne({ email: identifier }));
//   // Check user and password
//   if (user && (await user.matchPassword(password))) {
//     // Generate tokens
//     const accessToken = generateToken(res, user._id, user.role);
//     // Prepare user object to return (excluding sensitive data)
//       let isBanned=false;
//       let message_ban='';
//       let userResponse;
//       userResponse = {
//         _id: user._id,
//         MaDocGia: user.MaDocGia,
//         fullName: user.fullName,
//         email: user.email,
//         role: user.role,
//         username: user.username,
//         isBanned,
//         message_ban,
//         DiaChi: user.DiaChi,
//         SoDienThoai: user.SoDienThoai,
//       };

//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       user: userResponse,
//       accessToken,
//     });
//   } else {
//     res.status(401);
//     throw new Error('Invalid identifier or password');
//   }
// });




// /**
//  * @desc    Get current authenticated user's profile
//  * @route   GET /api/auth/profile
//  * @access  Private (requireAuth)
//  */
// const getUserProfile = asyncHandler(async (req, res) => {
//     // req.user is attached by requireAuth middleware
//     // We need to fetch the full profile based on the ID and role
    
//     let userProfile;
//     if (req.user.role === 'reader') {
//         userProfile = await Docgia.findById(req.user.id);
//     } else {
//         userProfile = await NhanVien.findById(req.user.id);
//     }

//     if (!userProfile) {
//         res.status(404);
//         throw new Error('User not found');
//     }

//     res.status(200).json({
//         success: true,
//         user: userProfile
//     });
// });

// /**
//  * @desc    Cập nhật thông tin cá nhân (Cho cả Admin/Staff & Reader)
//  * @route   PUT /api/auth/profile
//  * @access  Private
//  */
// const updateUserProfile = asyncHandler(async (req, res) => {
//   const userRole = req.user.role; // Lấy role từ middleware requireAuth
//   const userId = req.user.id;
  
//   let user;

//   if (userRole === 'reader') {
//     user = await Docgia.findById(userId);
//   }
//   else {
//     user = await NhanVien.findById(userId);
//   } 
//   if (user) {
//       user.HoLot = req.body.HoLot.trim() || user.HoLot;
//       user.Ten = req.body.Ten.trim() || user.Ten;
//       user.DiaChi = req.body.DiaChi.trim() || user.DiaChi;
//       user.DienThoai = req.body.DienThoai || user.DienThoai;
//       user.NgaySinh = req.body.NgaySinh || user.NgaySinh;
//       user.Phai = req.body.Phai.trim() || user.Phai;
//       user.email = req.body.email.trim() || user.email;

//       if (req.body.currentPassword && req.body.newPassword) {
//         if (await user.matchPassword(req.body.currentPassword.trim())) {
//           user.passwordHash = req.body.newPassword.trim();
//         }
//         else
//         {
//           res.status(400);
//           throw new Error('Current password is incorrect');
//         }
//       }
//   }
//   else 
//   {
//     res.status(404);
//     throw new Error('Không tìm thấy người dùng');
//   }
//   const updatedUser = await user.save();
//   // Trả về thông tin đã update (Bỏ password)
//   const responseUser = userRole === 'reader' ? {
//       MaDocGia: updatedUser.MaDocGia,
//   } : {
//       MSNV: updatedUser.MSNV,
//   };
//   responseUser._id = updatedUser._id
//   responseUser.HoLot= updatedUser.HoLot;
//   responseUser.Ten= updatedUser.Ten;
//   responseUser.DiaChi= updatedUser.DiaChi;
//   responseUser.DienThoai= updatedUser.DienThoai;
//   responseUser.NgaySinh=updatedUser.NgaySinh;
//   responseUser.Phai=updatedUser.Phai;
//   responseUser.username= updatedUser.username;
//   responseUser.email= updatedUser.email;
//   responseUser.role= updatedUser.role;

//   res.json({
//       success: true,
//       message: 'Cập nhật hồ sơ thành công',
//       user: responseUser
//     });
// });

// export { loginUser, refreshToken, logoutUser, getUserProfile, updateUserProfile };