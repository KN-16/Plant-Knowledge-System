import { Family, Genus, Species, Variety, PlantImage, Account, Province, Distribution } from '../models/index.js';
import sequelize from '../config/database.js';

export const getDashboardStats = async (req, res) => {
    try {
        // Chạy song song các query bằng Promise.all để tối ưu thời gian phản hồi
        const [
            families, genera, species, 
            varietiesCount, totalViewsData,
            totalSystemImages,
            totalImages, completedImages,
            provinces, distributions,
            totalUsers, activeUsers
        ] = await Promise.all([
            // Thực vật học
            Family.count(),
            Genus.count(),
            Species.count(),
            Variety.count(),
            // Lấy tổng lượt xem từ tất cả Variety
            Variety.sum('view_count'), 

            // Dữ liệu AI
            PlantImage.count(),
            PlantImage.count( { where: { is_standard: true } }),
            PlantImage.count({ where: { status: 'Completed', is_standard: true } }),

            // Địa lý
            Province.count(),
            Distribution.count(),

            // Người dùng
            Account.count(),
            Account.count({ where: { status: 'active' } })
        ]);

        const totalViews = isNaN(totalViewsData) ? 0 : totalViewsData;

        // Trả về cấu trúc JSON chuẩn xác khớp với Frontend
        return res.status(200).json({
            flora: {
                families,
                genera,
                species,
                varieties: varietiesCount,
                totalViews
            },
            ai: {
                totalSystemImages,
                totalImages,
                completedImages
            },
            geo: {
                provinces,
                distributions
            },
            users: {
                total: totalUsers,
                active: activeUsers
            }
        });

    } catch (error) {
        console.error("Lỗi lấy thống kê Dashboard:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ khi tải thống kê" });
    }
};