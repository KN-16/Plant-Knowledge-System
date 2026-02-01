// routes/index.js

// import express from 'express';
// import { login, createInitialAdmin } from '../controllers/authController.js';
// import { verifyToken, adminOnly } from '../middleware/authMiddleware.js';
// import * as taxController from '../controllers/taxonomyController.js';
// import upload from '../middleware/uploadMiddleware.js';
// import { Family, Genus, Species } from '../models/index.js';

// const router = express.Router();

// // --- Auth Routes ---
// router.post('/auth/login', login);
// router.post('/auth/init', createInitialAdmin); // Chạy 1 lần để tạo admin

// // --- Config Generic CRUD Routes ---
// const setupCrud = (path, Model) => {
//     router.get(path, taxController.getList(Model));
//     router.get(`${path}/search`, taxController.searchOptions(Model)); // API cho dropdown
//     router.post(path, verifyToken, adminOnly, taxController.createOne(Model));
//     router.put(`${path}/:id`, verifyToken, adminOnly, taxController.updateOne(Model));
//     router.delete(`${path}/:id`, verifyToken, adminOnly, taxController.deleteOne(Model));
// };

// setupCrud('/families', Family);
// setupCrud('/genera', Genus);
// setupCrud('/species', Species); // Lưu ý: Riêng getList Species cần include Genus/Family nếu muốn hiện tên

// // --- Import Excel Route (Ví dụ cho Species) ---
// router.post('/species/import', verifyToken, adminOnly, upload.single('file'), taxController.importSpeciesExcel);

// export default router;


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