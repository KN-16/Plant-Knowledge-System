import { Family, Genus, Species, Account } from '../models/index.js';

export const getStats = async (req, res) => {
    try {
        const families = await Family.count();
        const genera = await Genus.count();
        const species = await Species.count();
        const users = await Account.count(); // Nếu bạn có model Account

        res.json({
            families,
            genera,
            species,
            users
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy thống kê" });
    }
};