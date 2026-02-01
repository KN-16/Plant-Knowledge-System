// middleware/uploadMiddleware.js

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export default upload;

// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Tạo thư mục uploads nếu chưa có
// const uploadDir = path.join(__dirname, '..', 'uploads');
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// /* =========================================
//    CẤU HÌNH UPLOAD ẢNH (DiskStorage)
//    ========================================= */
// const imageStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         // Thêm timestamp để không bị trùng tên
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         cb(null, `img-${uniqueSuffix}${path.extname(file.originalname)}`);
//     },
// });

// const imageFilter = (req, file, cb) => {
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
//         return cb(new Error('Chỉ chấp nhận file ảnh!'), false);
//     }
//     cb(null, true);
// };

// // Export cấu hình gốc (chưa gọi .single hay .array)
// export const uploadImageConfig = multer({
//     storage: imageStorage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB/ảnh
//     fileFilter: imageFilter
// });

// /* =========================================
//    CẤU HÌNH UPLOAD EXCEL (MemoryStorage)
//    ========================================= */
// const excelStorage = multer.memoryStorage(); // Lưu RAM

// const excelFilter = (req, file, cb) => {
//     if (!file.originalname.match(/\.(xlsx|xls|csv)$/)) {
//         return cb(new Error('Chỉ chấp nhận file Excel!'), false);
//     }
//     cb(null, true);
// };

// export const uploadExcelConfig = multer({
//     storage: excelStorage,
//     limits: { fileSize: 10 * 1024 * 1024 },
//     fileFilter: excelFilter
// });