// // file: backend/seed.js
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import { sequelize, Account } from "./models/index.js"; // Đảm bảo trỏ đúng đến file khởi tạo Sequelize của bạn

// async function seedDatabase() {
//     try {
//         await sequelize.authenticate();
//         console.log("✅ Database connected for seeding");

//         // Đồng bộ các bảng (chỉ tạo bảng mới nếu chưa có)
//         await sequelize.sync({ alter: true });
        
//         const exists = await Account.findOne({ where: { username: 'admin' } });
    
//         if (!exists) {
//             await Account.create({
//         username: 'admin',
//         email: 'admin@system.com',
//         password_hash: '123456', // hook sẽ hash
//         role: 'admin',
//         full_name: 'Super Admin',
//         status: 'active',
//         });
//         console.log("Tạo tài khoản admin thành công")
//         }
//         else {
//             console.log("Tài khoản admin đã tạo")
//         }
        
//         console.log("✅ Database seeded successfully");
//     } catch (error) {
//         console.error("❌ Error seeding database:", error);
//     }
// }

// // Chạy trực tiếp nếu file này được thực thi bằng lệnh 'node seed.js'
// if (process.argv[1] === fileURLToPath(import.meta.url)) {
//     seedDatabase().then(() => process.exit(0));
// }

// export default seedDatabase;


import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// Import đủ các Models cần thiết
import { sequelize, Account, Province, Family, Genus, Species, Variety } from "./models/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- DỮ LIỆU MẪU ĐỂ SEED ---

const provincesData = [
    { province_name: "Thành phố Hà Nội", country: "Việt Nam" },
    { province_name: "Cao Bằng", country: "Việt Nam" },
    { province_name: "Tuyên Quang", country: "Việt Nam" },
    { province_name: "Điện Biên", country: "Việt Nam" },
    { province_name: "Lai Châu", country: "Việt Nam" },
    { province_name: "Sơn La", country: "Việt Nam" },
    { province_name: "Lào Cai", country: "Việt Nam" },
    { province_name: "Thái Nguyên", country: "Việt Nam" },
    { province_name: "Lạng Sơn", country: "Việt Nam" },
    { province_name: "Quảng Ninh", country: "Việt Nam" },
    { province_name: "Bắc Ninh", country: "Việt Nam" },
    { province_name: "Phú Thọ", country: "Việt Nam" },
    { province_name: "Thành phố Hải Phòng", country: "Việt Nam" },
    { province_name: "Hưng Yên", country: "Việt Nam" },
    { province_name: "Ninh Bình", country: "Việt Nam" },
    { province_name: "Thanh Hóa", country: "Việt Nam" },
    { province_name: "Nghệ An", country: "Việt Nam" },
    { province_name: "Hà Tĩnh", country: "Việt Nam" },
    { province_name: "Quảng Trị", country: "Việt Nam" },
    { province_name: "Thành phố Huế", country: "Việt Nam" },
    { province_name: "Thành phố Đà Nẵng", country: "Việt Nam" },
    { province_name: "Quảng Ngãi", country: "Việt Nam" },
    { province_name: "Gia Lai", country: "Việt Nam" },
    { province_name: "Khánh Hòa", country: "Việt Nam" },
    { province_name: "Đắk Lắk", country: "Việt Nam" },
    { province_name: "Lâm Đồng", country: "Việt Nam" },
    { province_name: "Đồng Nai", country: "Việt Nam" },
    { province_name: "Thành phố Hồ Chí Minh", country: "Việt Nam" },
    { province_name: "Tây Ninh", country: "Việt Nam" },
    { province_name: "Đồng Tháp", country: "Việt Nam" },
    { province_name: "Vĩnh Long", country: "Việt Nam" },
    { province_name: "An Giang", country: "Việt Nam" },
    { province_name: "Thành phố Cần Thơ", country: "Việt Nam" },
    { province_name: "Cà Mau", country: "Việt Nam" }
];

const familiesData = [
    { scientific_name: "Araliaceae", vietnamese_name: "Họ Nhân sâm" },
    { scientific_name: "Rutaceae", vietnamese_name: "Họ Cửu lý hương (Họ Cam chanh)" },
    { scientific_name: "Fabaceae", vietnamese_name: "Họ Đậu" },
    { scientific_name: "Lamiaceae", vietnamese_name: "Họ Hoa môi" }
];

// Lưu ý: Các dữ liệu con (Genus, Species, Variety) không gán sẵn family_id/genus_id.
// Chúng ta sẽ lấy ID thực tế từ database sau khi insert dữ liệu cha thành công để đảm bảo tính toàn vẹn.
const generaData = [
    { scientific_name: "Polyscias", vietnamese_name: "Chi Đinh lăng", family_sc_name: "Araliaceae" },
    { scientific_name: "Panax", vietnamese_name: "Chi Nhân sâm", family_sc_name: "Araliaceae" },
    { scientific_name: "Citrus", vietnamese_name: "Chi Cam chanh", family_sc_name: "Rutaceae" },
    { scientific_name: "Glycine", vietnamese_name: "Chi Đậu nành", family_sc_name: "Fabaceae" }
];

const speciesData = [
    { scientific_name: "Polyscias fruticosa", vietnamese_name: "Đinh lăng", genus_sc_name: "Polyscias" },
    { scientific_name: "Panax ginseng", vietnamese_name: "Nhân sâm", genus_sc_name: "Panax" },
    { scientific_name: "Citrus maxima", vietnamese_name: "Bưởi", genus_sc_name: "Citrus" },
    { scientific_name: "Citrus reticulata", vietnamese_name: "Cam sành", genus_sc_name: "Citrus" },
    { scientific_name: "Glycine max", vietnamese_name: "Đậu nành", genus_sc_name: "Glycine" }
];

const varietiesData = [
    { 
        common_name: "Đinh lăng lá nhỏ", 
        variety_name: "var. plumata", 
        variant_type: "Variety", 
        life_form: "Shrub",
        species_sc_name: "Polyscias fruticosa"
    },
    { 
        common_name: "Đinh lăng lá to", 
        variety_name: "var. macrophylla", 
        variant_type: "Variety", 
        life_form: "Shrub",
        species_sc_name: "Polyscias fruticosa"
    },
    { 
        common_name: "Bưởi Năm Roi", 
        variety_name: "", 
        variant_type: "Cultivar", 
        life_form: "Tree",
        species_sc_name: "Citrus maxima"
    }
];


async function seedDatabase() {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected for seeding");

        // Đồng bộ cấu trúc bảng (Không xóa bảng cũ, chỉ cập nhật)
        await sequelize.sync({ alter: true });

        // =====================================
        // 1. TẠO TÀI KHOẢN ADMIN
        // =====================================
        console.log("⏳ Đang kiểm tra tài khoản admin...");
        const adminExists = await Account.findOne({ where: { username: 'admin' } });
    
        if (!adminExists) {
            await Account.create({
                username: 'admin',
                email: 'admin@system.com',
                password_hash: '123456', // hook sẽ tự hash
                role: 'admin',
                full_name: 'Super Admin',
                status: 'active',
            });
            console.log("✅ Tạo tài khoản admin thành công");
        } else {
            console.log("⏩ Tài khoản admin đã tồn tại");
        }

        // =====================================
        // KIỂM TRA ĐÃ SEED DỮ LIỆU THỰC VẬT CHƯA
        // =====================================
        const provinceCount = await Province.count();
        if (provinceCount > 0) {
            console.log("⏩ Database đã có dữ liệu mẫu. Bỏ qua tiến trình nạp (seed).");
            return; 
        }

        console.log("⏳ Bắt đầu nạp dữ liệu mẫu ban đầu...");
        // Dùng transaction để đảm bảo toàn vẹn dữ liệu
        const t = await sequelize.transaction();

        try {
            // =====================================
            // 2. NẠP DỮ LIỆU TỈNH THÀNH (PROVINCES)
            // =====================================
            // Sử dụng vòng lặp for..of kết hợp create để trigger hook generateCustomId sinh code tự động
            for (const p of provincesData) {
                await Province.findOrCreate({
                    where: { province_name: p.province_name, country: p.country },
                    defaults: p,
                    transaction: t
                });
            }
            console.log(`✅ Nạp thành công ${provincesData.length} tỉnh thành`);

            // =====================================
            // 3. NẠP DỮ LIỆU PHÂN LOẠI HỌC (TAXONOMY)
            // =====================================
            
            // --- Nạp HỌ (Family) ---
            const familyMap = {}; // Lưu lại id để cấp cho Genus
            for (const fam of familiesData) {
                const [record] = await Family.findOrCreate({
                    where: { scientific_name: fam.scientific_name },
                    defaults: fam,
                    transaction: t
                });
                familyMap[fam.scientific_name] = record.family_id;
            }
            console.log(`✅ Nạp thành công ${familiesData.length} Họ (Family)`);

            // --- Nạp CHI (Genus) ---
            const genusMap = {}; // Lưu lại id để cấp cho Species
            for (const gen of generaData) {
                const [record] = await Genus.findOrCreate({
                    where: { scientific_name: gen.scientific_name },
                    defaults: {
                        scientific_name: gen.scientific_name,
                        vietnamese_name: gen.vietnamese_name,
                        family_id: familyMap[gen.family_sc_name] // Map FK
                    },
                    transaction: t
                });
                genusMap[gen.scientific_name] = record.genus_id;
            }
            console.log(`✅ Nạp thành công ${generaData.length} Chi (Genus)`);

            // --- Nạp LOÀI (Species) ---
            const speciesMap = {}; // Lưu lại id để cấp cho Variety
            for (const sp of speciesData) {
                const [record] = await Species.findOrCreate({
                    where: { scientific_name: sp.scientific_name },
                    defaults: {
                        scientific_name: sp.scientific_name,
                        vietnamese_name: sp.vietnamese_name,
                        genus_id: genusMap[sp.genus_sc_name] // Map FK
                    },
                    transaction: t
                });
                speciesMap[sp.scientific_name] = record.species_id;
            }
            console.log(`✅ Nạp thành công ${speciesData.length} Loài (Species)`);

            // --- Nạp THỨ/GIỐNG (Variety) ---
            for (const v of varietiesData) {
                await Variety.findOrCreate({
                    // Tìm dựa trên tên thường gọi vì variety có thể ko có tên KH
                    where: { common_name: v.common_name, species_id: speciesMap[v.species_sc_name] },
                    defaults: {
                        common_name: v.common_name,
                        variety_name: v.variety_name,
                        variant_type: v.variant_type,
                        life_form: v.life_form,
                        species_id: speciesMap[v.species_sc_name] // Map FK
                    },
                    transaction: t
                });
            }
            console.log(`✅ Nạp thành công ${varietiesData.length} Thứ/Giống (Variety)`);

            await t.commit();
            console.log("🎉 TOÀN BỘ DỮ LIỆU ĐÃ ĐƯỢC SEED THÀNH CÔNG!");

        } catch (seedErr) {
            await t.rollback();
            console.error("❌ Lỗi trong quá trình insert data, đã rollback:", seedErr);
        }

    } catch (error) {
        console.error("❌ Lỗi kết nối CSDL hoặc khởi tạo:", error);
    }
}

// Chạy trực tiếp nếu file này được thực thi bằng lệnh 'node seed.js'
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    seedDatabase().then(() => process.exit(0));
}

export default seedDatabase;