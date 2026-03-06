import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initRabbitMQ } from './config/rabbitmq.js';

// 1. Cấu hình Đường dẫn (Path)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// 2. THUẬT TOÁN LOAD BIẾN MÔI TRƯỜNG (Đã phục hồi & Tối ưu)
// ============================================================
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.development';

// Load file env tương ứng từ thư mục root
dotenv.config({ path: path.resolve(__dirname, envFile) });

console.log(`✅ Loaded environment: ${envFile}`);
console.log(`✅ Database Config: ${process.env.DB_NAME} @ ${process.env.DB_HOST}`);

// ============================================================
// 3. XỬ LÝ THƯ MỤC UPLOADS (Tạo tự động cấu trúc chuẩn)
// ============================================================
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const IMG_DIR = path.join(UPLOAD_DIR, 'images');
const EXCEL_DIR = path.join(UPLOAD_DIR, 'format-excel-data');

const ensureDirectories = () => {
  [UPLOAD_DIR, IMG_DIR, EXCEL_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📂 Created directory: ${dir}`);
    }
  });
};
ensureDirectories();

// ============================================================
// 4. KHỞI TẠO APP (Dùng Async Function để Load DB sau khi có Env)
// ============================================================
const startServer = async () => {
  try {
    // --- Dynamic Import (QUAN TRỌNG) ---
    // Phải import ở đây để đảm bảo biến môi trường đã được load ở bước 2
    const { default: sequelize } = await import('./config/database.js');
    const { default: apiRoutes } = await import('./routes/index.js');
    const { notFound, errorHandler } = await import('./middleware/errorMiddleware.js');

    // Kết nối Database
    let dbConnected = false;
    while (!dbConnected) {
        try {
            await sequelize.authenticate();
            console.log('✅ Database connected successfully');
            dbConnected = true; // Kết nối thành công thì thoát vòng lặp
        } catch (dbError) {
            console.error(`❌ Database connection failed: ${dbError.message}`);
            console.log('⏳ Retrying Database connection in 5 seconds...');
            // Tạm dừng 5 giây rồi thử lại
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    // --- RabbitMQ ---
    await initRabbitMQ();

    const app = express();
    const PORT = process.env.PORT || 3000;

    // --- Middleware ---
    const corsOptions = {
      origin: [process.env.AI_ORIGIN, process.env.ORIGIN_FRONTEND, 'http://localhost:5173'],
      credentials: true,
    };
    
    app.use(cors(corsOptions));
    app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // --- Static Files (Phục vụ ảnh & file excel) ---
    // Link ảnh: http://localhost:3000/uploads/images/ten-anh.jpg
    // Link excel: http://localhost:3000/uploads/format-excel-data/mau.xlsx
    app.use('/uploads', express.static(UPLOAD_DIR));

    // --- Routes ---
    app.use('/api', apiRoutes);

    // --- Error Handling ---
    app.use(notFound);
    app.use(errorHandler);

    
    // --- Start ---
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`📂 Uploads served at: ${UPLOAD_DIR}`);
    });

  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();