import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const zipFilePath = path.join(__dirname, 'uploads.zip'); // Tên file zip

try {
  if (fs.existsSync(zipFilePath)) {
    console.log(`📦 Bắt đầu giải nén file ${zipFilePath}...`);
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(__dirname, true); // true = ghi đè file cũ
    console.log(`✅ Giải nén thành công vào thư mục ${__dirname}`);
  } else {
    console.log(`⚠️ Không tìm thấy file ${zipFilePath}, bỏ qua bước giải nén.`);
  }
} catch (error) {
  console.error(`❌ Lỗi giải nén:`, error);
  process.exit(1); // Dừng build nếu giải nén thất bại
}