// controllers/adminAccountController.js
import { Op } from 'sequelize';
import { Account } from '../models/index.js'; // Nhớ import đúng đường dẫn Model của bạn

// 1. Lấy danh sách tài khoản (Có phân trang, tìm kiếm)
export const getAllAccounts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {};
        if (search) {
            whereClause = {
                [Op.or]: [
                    { username: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } },
                    { full_name: { [Op.iLike]: `%${search}%` } },
                    { code: { [Op.iLike]: `%${search}%` } },
                    { phone_number: { [Op.iLike]: `%${search}%` } },
                ]
            };
        }

        const { count, rows } = await Account.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password_hash'] } 
        });

        // SỬA Ở ĐÂY: Trả về đúng định dạng có object pagination
        return res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                total: count, // useCrud sẽ đọc ở đây: res.data.pagination.total
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách tài khoản:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
};

// 2. Thêm mới tài khoản
export const createAccount = async (req, res) => {
    try {
        // Dữ liệu từ form gửi lên có chứa `password_hash` dạng plain text
        // Hook `beforeCreate` trong Model Account sẽ tự động Hash nó
        const newAccount = await Account.create(req.body);
        
        return res.status(201).json({ success: true, message: "Tạo tài khoản thành công!", data: newAccount });
    } catch (error) {
        // Bắt lỗi Unique (Trùng email/username) từ Sequelize
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ success: false, message: "Username hoặc Email đã tồn tại trong hệ thống." });
        }
        return res.status(400).json({ success: false, message: error.message });
    }
};

// 3. Sửa thông tin tài khoản (Không sửa pass, không sửa username)
export const updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, full_name, phone_number, address, role, status } = req.body;
        
        const account = await Account.findByPk(id);
        if (!account) {
            return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản" });
        }

        await account.update({ email, full_name, phone_number, address, role, status });
        
        return res.status(200).json({ success: true, message: "Cập nhật thông tin thành công" });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ success: false, message: "Email này đã được sử dụng bởi tài khoản khác." });
        }
        return res.status(400).json({ success: false, message: error.message });
    }
};

// 4. Đổi mật khẩu (Admin ép đổi)
export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { new_password } = req.body;
        
        const account = await Account.findByPk(id);
        if (!account) return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản" });

        // Gán pass mới, hook `beforeUpdate` sẽ tự động phát hiện thay đổi và Hash lại
        account.password_hash = new_password; 
        await account.save();

        return res.status(200).json({ success: true, message: "Đổi mật khẩu thành công" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// 5. Khóa/Mở khóa tài khoản (Cập nhật status)
export const toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const account = await Account.findByPk(id);
        if (!account) return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản" });

        account.status = status;
        await account.save();

        return res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// 6. Xóa tài khoản
export const deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await Account.findByPk(id);
        if (!account) return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản" });

        // Có thể thêm logic kiểm tra: Không cho tự xóa chính mình nếu id == req.user.account_id
        
        await account.destroy();
        return res.status(200).json({ success: true, message: "Đã xóa tài khoản thành công" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
