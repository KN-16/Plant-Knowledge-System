import { body, param, query } from 'express-validator';

// --- Auth Validators ---
export const registerReaderValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('HoLot').notEmpty().withMessage('First name (HoLot) is required'),
  body('Ten').notEmpty().withMessage('Last name (Ten) is required'),
  body('DienThoai').notEmpty().withMessage('Phone number is required'),
  body('username').notEmpty().withMessage('Username is required'),
];

export const loginValidator = [
  body('identifier').notEmpty().withMessage('Identifier (email or username) is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// // --- Book Validators ---
// export const createBookValidator = [
//   body('TenSach').notEmpty().withMessage('Book Title (TenSach) is required'),
//   body('SoQuyen').isNumeric().withMessage('Quantity (SoQuyen) must be a number'),
//   body('SoQuyenConLai').isNumeric().withMessage('Available Quantity (SoQuyenConLai) must be a number'),
//   body('NamXuatBan')
//     .isNumeric()
//     .withMessage('Publication Year (NamXuatBan) must be a number'),
//   body('MaNXB')
//     .custom((value) => {
//     if (value === 'new') return true; // allow "new"
//     return mongoose.Types.ObjectId.isValid(value); // else validate MongoId
//   })
//   .withMessage('MaNXB must be either "new" or a valid Mongo ID'),
//   body('TenNXB')
//     .if(body('MaNXB').equals('new'))
//     .notEmpty()
//     .withMessage('Publisher Name (TenNXB) is required when MaNXB is "new"'),
//   body('DiaChi')
//     .if(body('MaNXB').equals('new'))
//     .notEmpty()
//     .withMessage('Address (DiaChi) is required when MaNXB is "new"'),
// ];
    
// export const updateBookValidator = [
//   param('id').isMongoId().withMessage('Invalid Book ID'),
//   body('TenSach').optional().notEmpty().withMessage('Book Title cannot be empty'),
//   body('SoQuyen')
//     .optional()
//     .isNumeric()
//     .withMessage('Quantity (SoQuyen) must be a number'),
//   body('SoQuyenConLai')
//     .optional()
//     .isNumeric()
//     .withMessage('Available Quantity (SoQuyenConLai) must be a number'),
//   body('NamXuatBan')
//     .optional()
//     .isNumeric()
//     .withMessage('Publication Year (NamXuatBan) must be a number'),
//   body('MaNXB')
//     .optional()
//     .custom((value) => {
//       if (value === 'new') return true; // allow "new"
//       return mongoose.Types.ObjectId.isValid(value); // else validate MongoId
//     })
//     .withMessage('MaNXB must be either "new" or a valid Mongo ID'),
//   body('TenNXB')
//     .if(body('MaNXB').equals('new'))
//     .notEmpty()
//     .withMessage('Publisher Name (TenNXB) is required when MaNXB is "new"'),
//   body('DiaChi')
//     .if(body('MaNXB').equals('new'))
//     .notEmpty()
//     .withMessage('Address (DiaChi) is required when MaNXB is "new"'),
//   body('pinnedHot')
//     .optional()
//     .isBoolean()
//     .withMessage('pinnedHot must be a boolean'),
// ];

// // --- Publisher Validators ---
// export const publisherValidator = [
//   body('TenNXB').notEmpty().withMessage('Publisher Name (TenNXB) is required'),
// ];

// // --- Borrow Validators ---
// export const borrowBookValidator = [
//   body('MaDocGia')
//     .isMongoId()
//     .withMessage('MaDocGia phải là một ID hợp lệ (Mongo ID)'),
//   body('ChiTietMuon')
//     .isArray({ min: 1 })
//     .withMessage('ChiTietMuon phải là một mảng và không được để trống'),
//   body('ChiTietMuon.*.MaSach')
//     .isMongoId()
//     .withMessage('Mỗi MaSach trong ChiTietMuon phải là một ID hợp lệ (Mongo ID)'),
//   body('ChiTietMuon.*.SoLuong')
//     .isInt({ min: 1 })
//     .withMessage('SoLuong phải là số nguyên >= 1'),
//   body('NgayMuon')
//     .isISO8601()
//     .toDate()
//     .withMessage('NgayMuon phải là ngày hợp lệ')
//     .custom((value) => {
//       const today = new Date();
//       today.setHours(0,0,0,0);
//       if (value < today) {
//         throw new Error('NgayMuon không được nhỏ hơn ngày hiện tại');
//       }
//       return true;
//     }),
//   body('NgayTraDuKien')
//     .isISO8601()
//     .toDate()
//     .withMessage('NgayTraDuKien phải là ngày hợp lệ')
//     .custom((value, { req }) => {
//       if (value < req.body.NgayMuon) {
//         throw new Error('NgayTraDuKien phải bằng hoặc sau NgayMuon');
//       }
//       return true;
//     }),
//   body('GhiChu')
//     .optional()
//     .isString()
//     .withMessage('GhiChu phải là chuỗi'),
//   body('status')
//     .isString()
//     .withMessage('Trạng thái phải là chuỗi')
//     .custom((value, { req }) => {
//       const role = req.user?.role;
//       // Reader
//       if (role === 'reader') {
//         if (value && value !== 'pending') {
//           throw new Error('Đọc giả chỉ có thể đặt trạng thái "pending"');
//         }
//         return true;
//       }
//       // Librarian + Admin
//       const allowed = ['pending', 'borrowed'];
//       if (value && !allowed.includes(value)) {
//         throw new Error(
//           `Trạng thái không hợp lệ, hợp lệ: ${allowed.join(', ')}`
//         );
//       }
//       return true;
//     }),
// ];

// export const borrowBookUpdateValidator= [
//   param('id').isMongoId().withMessage('ID không hợp lệ trong URL'),
//   body('status')
//     .isString()
//     .withMessage('Trạng thái phải là chuỗi')
//     .custom(value => {
//       const allowed = ['pending', 'borrowed', 'reject'];
//       if (value && !allowed.includes(value)) {
//         throw new Error(
//           `Trạng thái không hợp lệ, hợp lệ: ${allowed.join(', ')}`
//         );
//       }
//       return true;
//     }),
//   body('GhiChu')
//     .optional()
//     .isString()
//     .withMessage('GhiChu phải là chuỗi')
//     .custom((value, { req }) => {
//       if (req.body.status === 'reject' && !value) {
//         throw new Error('Trạng thái "reject" bắt buộc có GhiChu như lý do từ chối');
//       }
//       return true;
//     }),
//   //Optional
//   body('NgayMuon')
//     .optional()
//     .isISO8601()
//     .toDate()
//     .withMessage('NgayMuon phải là ngày hợp lệ')
//     .custom((value, { req }) => {
//       const NgayMuonBanDau= new Date(req.body.NgayMuonBanDau);
//       if (value < NgayMuonBanDau) {
//         throw new Error('NgayMuon mới phải bằng hoặc sau NgayMuonBanDau');
//       }
//       return true;
//     }),
//   body('NgayTraDuKien')
//     .optional()
//     .isISO8601()
//     .toDate()
//     .withMessage('NgayTraDuKien phải là ngày hợp lệ')
//     .custom((value, { req }) => {
//       if (value < req.body.NgayMuon) {
//         throw new Error('NgayTraDuKien phải bằng hoặc sau NgayMuon');
//       }
//       return true;
//     }),
//   body('ChiTietMuon')
//     .optional()
//     .isArray({ min: 1 })
//     .withMessage('ChiTietMuon phải là một mảng và không được seksi trống'),
//   body('ChiTietMuon.*.MaSach')
//     .isMongoId()
//     .withMessage('Mỗi MaSach trong ChiTietMuon phải là một ID hợp lệ (Mongo ID)'),
//   body('ChiTietMuon.*.SoLuong')
//     .isInt({ min: 1 })
//     .withMessage('SoLuong phải là số nguyên >= 1'),
// ];

// export const borrowBookReturnValidator=[
//   param('id').isMongoId().withMessage('ID không hợp lệ trong URL'),
//   body('GhiChu').optional().isString().withMessage('GhiChu của phiếu mượn phải là chuỗi'),
//   body('ChiTietTra')
//     .isArray({ min: 1 })
//     .withMessage('ChiTietTra phải là một mảng và không được seksi trống'),
//   body('ChiTietTra.*.MaSach')
//     .isMongoId()
//     .withMessage('Mỗi MaSach trong ChiTietTra phải là một ID hợp lệ (Mongo ID)'),
//   body('ChiTietTra.*.DaTra')
//     .isInt({ min: 1 })
//     .withMessage('DaTra phải là số nguyên >= 1'),
//   body('ChiTietTra.*.GhiChu').optional().isString().withMessage('GhiChu của sách mượn phải là chuỗi'),

// ]

// export const updateUserProfileValidator =
// [
//   body('HoLot').optional().isString().withMessage('HoLot phải là chuỗi'),
//   body('Ten').optional().isString().withMessage('Ten phải là chuỗi'),
//   body('email').optional().isEmail().withMessage('email phải là email hợp lệ'),
//   body('DienThoai').optional().isString().withMessage('DienThoai phải là chuỗi'),
//   body('NgaySinh').optional().isISO8601().toDate().withMessage('NgaySinh phải là ngày hợp lệ'),
//   body('Phai').optional().isString().withMessage('Phai phải là chuỗi').custom((value) => {
//     if (['Nam', 'Nữ', 'Khác'].includes(value)) {
//       return true;
//     }
//     throw new Error('Phai phải bằng "Nam", "Nữ" hoặc "Khác"');
//   }),
//   body('DiaChi').optional().isString().withMessage('DiaChi phải là chuỗi'),
//   body('currentPassword').optional().isString().withMessage('currentPassword phải là chuỗi'),
//   body('newPassword').optional().isString().withMessage('newPassword phải là chuỗi').custom((value, { req }) => {
//     if (value && req.body.currentPassword) {
//       return true;
//     }
//     throw new Error('newPassword không có khi currentPassword cũng không có');
//   })
// ]

// export const createBorrowFromWishlistValidator = [
//   body('selectedBookIds').isArray({ min: 1 }).withMessage('selectedBookIds phải là một mảng chứa MaSach'),
//   body('selectedBookIds.*').isMongoId().withMessage('Mỗi MaSach trong selectedBookIds phải là một ID hợp lệ (Mongo ID)'),
//   body('ngayMuon').isISO8601().toDate().withMessage('ngayMuon phải là ngày hợp lệ').custom((value) => {
//     if (value < new Date()) {
//       throw new Error('ngayMuon phải bằng hoặc sau ngày thực hiện');
//     }
//     return true;
//   }),
//   body('ngayTraDuKien').isISO8601().toDate().withMessage('ngayTraDuKien phải là ngày hợp lệ').custom((value, { req }) => {
//     if (value < req.body.ngayMuon) {
//       throw new Error('ngayTraDuKien phải bằng hoặc sau ngàyMuon');
//     }
//     return true;
//   })
// ]
// // --- General Param Validator ---
// export const idParamValidator = [
//   param('id').isMongoId().withMessage('Invalid ID in URL parameter'),
// ];