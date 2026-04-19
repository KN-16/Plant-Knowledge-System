import { fileURLToPath } from "url";
import { 
    sequelize, 
    Account, 
    Province, 
    Family, 
    Genus, 
    Species, 
    Variety, 
    MorphologyLeaf, 
    MorphologyStem, 
    MorphologyFlower, 
    Distribution 
} from "./models/index.js";
import { provincesData, plantData } from "./seedData.js";

async function seedDatabase() {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected for seeding");

        await sequelize.sync({ "alter": true });
        // await sequelize.sync();
        console.log("✅ Database synced for seeding");

        // =====================================
        // 1. TẠO TÀI KHOẢN ADMIN
        // =====================================
        console.log("\n⏳ Đang kiểm tra tài khoản admin...");
        const [adminRecord, adminCreated] = await Account.findOrCreate({
            where: { username: 'admin' },
            defaults: {
                username: 'admin',
                email: 'admin@system.com',
                password_hash: '123456', 
                role: 'admin',
                full_name: 'Admin Full Name',
                status: 'active',
            }
        });
        if (adminCreated) console.log("✅ Tạo tài khoản admin thành công");
        else console.log("⏩ Tài khoản admin đã tồn tại");

        // =====================================
        // OBJECT THỐNG KÊ (STATS TRACKING)
        // =====================================
        const stats = {
            provinces: { total: provincesData.length, created: 0, existed: 0, failed: 0 },
            families: { total: plantData.length, created: 0, existed: 0, failed: 0 },
            genera: { total: plantData.length, created: 0, existed: 0, failed: 0 },
            species: { total: plantData.length, created: 0, existed: 0, failed: 0 },
            varieties: { total: 0, created: 0, existed: 0, failed: 0 },
            distributions: { total: 0, created: 0, existed: 0, skipped: 0 } // skipped: Tỉnh không khớp
        };

        // Tính toán trước tổng số varieties và distributions có trong JSON
        plantData.forEach(item => {
            if (item.varieties) {
                stats.varieties.total += item.varieties.length;
                item.varieties.forEach(v => {
                    if (v.distributions) stats.distributions.total += v.distributions.length;
                });
            }
        });

        console.log(`\n⏳ Bắt đầu nạp dữ liệu mẫu... (Tổng JSON: ${stats.families.total} Họ, ${stats.varieties.total} Thứ/Giống)`);
        
        const t = process.env.ENABLE_TRANSACTION === 'true' ? await sequelize.transaction() : null;
        let currentOperation = "Khởi tạo"; // Biến lưu vết thao tác đang chạy để báo lỗi

        try {
            // =====================================
            // 2. NẠP DỮ LIỆU TỈNH THÀNH (PROVINCES)
            // =====================================
            for (const p of provincesData) {
                currentOperation = `Nạp tỉnh/thành: ${p.province_name}`;
                const [record, created] = await Province.findOrCreate({
                    where: { province_name: p.province_name, country: p.country },
                    defaults: p,
                    transaction: t
                });
                if (created) stats.provinces.created++;
                else stats.provinces.existed++;
            }

            // =====================================
            // 3. NẠP DỮ LIỆU THỰC VẬT THEO CẤP BẬC
            // =====================================
            for (const item of plantData) {
                // 3.1 Nạp Họ (Family)
                currentOperation = `Nạp Họ (Family): ${item.family.scientific_name}`;
                const [familyRecord, familyCreated] = await Family.findOrCreate({
                    where: { scientific_name: item.family.scientific_name },
                    defaults: item.family,
                    transaction: t
                });
                if (familyCreated) stats.families.created++;
                else stats.families.existed++;

                // 3.2 Nạp Chi (Genus)
                currentOperation = `Nạp Chi (Genus): ${item.genus.scientific_name}`;
                const [genusRecord, genusCreated] = await Genus.findOrCreate({
                    where: { scientific_name: item.genus.scientific_name },
                    defaults: { ...item.genus, family_id: familyRecord.family_id },
                    transaction: t
                });
                if (genusCreated) stats.genera.created++;
                else stats.genera.existed++;

                // 3.3 Nạp Loài (Species)
                currentOperation = `Nạp Loài (Species): ${item.species.scientific_name}`;
                const [speciesRecord, speciesCreated] = await Species.findOrCreate({
                    where: { scientific_name: item.species.scientific_name },
                    defaults: { ...item.species, genus_id: genusRecord.genus_id },
                    transaction: t
                });
                if (speciesCreated) stats.species.created++;
                else stats.species.existed++;

                // 3.4 Nạp Thứ/Giống (Variety)
                if (item.varieties && item.varieties.length > 0) {
                    for (const v of item.varieties) {
                        currentOperation = `Nạp Giống (Variety): ${v.common_name}`;
                        const { morphology_leaf, morphology_stem, morphology_flower, distributions, ...varietyFields } = v;

                        const [varietyRecord, varietyCreated] = await Variety.findOrCreate({
                            where: { common_name: varietyFields.common_name, species_id: speciesRecord.species_id },
                            defaults: { ...varietyFields, species_id: speciesRecord.species_id },
                            transaction: t
                        });
                        
                        if (varietyCreated) stats.varieties.created++;
                        else stats.varieties.existed++;

                        const varietyId = varietyRecord.variety_id;

                        // --- Hình thái Lá ---
                        if (morphology_leaf) {
                            currentOperation = `Nạp Hình thái Lá cho: ${v.common_name}`;
                            await MorphologyLeaf.findOrCreate({
                                where: { variety_id: varietyId },
                                defaults: { ...morphology_leaf, variety_id: varietyId },
                                transaction: t
                            });
                        }

                        // --- Hình thái Thân ---
                        if (morphology_stem) {
                            currentOperation = `Nạp Hình thái Thân cho: ${v.common_name}`;
                            await MorphologyStem.findOrCreate({
                                where: { variety_id: varietyId },
                                defaults: { ...morphology_stem, variety_id: varietyId },
                                transaction: t
                            });
                        }

                        // --- Hình thái Hoa ---
                        if (morphology_flower) {
                            currentOperation = `Nạp Hình thái Hoa cho: ${v.common_name}`;
                            await MorphologyFlower.findOrCreate({
                                where: { variety_id: varietyId },
                                defaults: { ...morphology_flower, variety_id: varietyId },
                                transaction: t
                            });
                        }

                        // --- Khu vực Phân bố ---
                        if (distributions && distributions.length > 0) {
                            for (const dist of distributions) {
                                currentOperation = `Tìm tỉnh ${dist.province_name} để thêm phân bố cho ${v.common_name}`;
                                
                                const provinceRecord = await Province.findOne({
                                    where: { province_name: dist.province_name },
                                    transaction: t
                                });

                                if (provinceRecord) {
                                    currentOperation = `Nạp Phân bố: ${dist.province_name} - ${v.common_name}`;
                                    const [distRecord, distCreated] = await Distribution.findOrCreate({
                                        where: { 
                                            variety_id: varietyId, 
                                            province_id: provinceRecord.province_id, 
                                            status: dist.status 
                                        },
                                        defaults: { description: dist.description },
                                        transaction: t
                                    });
                                    if (distCreated) stats.distributions.created++;
                                    else stats.distributions.existed++;
                                } else {
                                    console.warn(`⚠️ CẢNH BÁO: Bỏ qua phân bố. Không tìm thấy tỉnh "${dist.province_name}" trong DB (Loài: ${v.common_name}).`);
                                    stats.distributions.skipped++;
                                }
                            }
                        }
                    }
                }
            }

            if (t) await t.commit();
            console.log("\n🎉 TOÀN BỘ DỮ LIỆU ĐÃ ĐƯỢC SEED THÀNH CÔNG!\n");
            
            // In bảng thống kê đẹp mắt ra console
            console.log("📊 BẢNG THỐNG KÊ KẾT QUẢ NẠP DỮ LIỆU:");
            console.table(stats);

        } catch (seedErr) {
            if (t) await t.rollback();
            console.error("\n❌ LỖI NGHIÊM TRỌNG TRONG QUÁ TRÌNH NẠP DỮ LIỆU!");
            console.error(`📍 Vị trí lỗi (Đang xử lý): ${currentOperation}`);
            console.error(`🔍 Chi tiết mã lỗi:`, seedErr.message || seedErr);
            // Có thể in thêm seedErr.errors nếu lỗi liên quan đến Validation của Sequelize
            if (seedErr.errors) {
                seedErr.errors.forEach(e => console.error(`   - ${e.message}`));
            }
            console.log("\n⚠️ Toàn bộ dữ liệu trong phiên này đã được Rollback (hoàn tác).\n");
        }

    } catch (error) {
        console.error("❌ Lỗi kết nối CSDL hoặc khởi tạo cấu trúc bảng:", error);
    }
}

// Chạy trực tiếp nếu file này được thực thi bằng lệnh 'node seed.js'
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    seedDatabase().then(() => process.exit(0));
    // await sequelize.sync({"alter":true});
}

export default seedDatabase;