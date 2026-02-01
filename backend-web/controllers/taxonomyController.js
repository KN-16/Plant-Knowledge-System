// backend-web/controllers/taxonomyController.js

import { Family, Genus, Species, sequelize } from '../models/index.js';
import { Op } from 'sequelize';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import e from 'express';

// --- Helper: Lấy Model dựa trên type ---
const getModelByType = (type) => {
    switch (type) {
        case 'families': return Family;
        case 'genera': return Genus;
        case 'species': return Species;
        default: return null;
    }
};
const enableTransaction = process.env.ENABLE_TRANSACTION === 'true';
// --- API: Lấy danh sách (Có phân trang, search, sort) ---
export const getList = async (req, res, next) => {
    try {
        const { type } = req.params;
        const Model = getModelByType(type);
        if (!Model) return res.status(400).json({ message: "Invalid type" });

        const { page = 1, limit = 10, search = '', sort = 'createdAt', order = 'DESC' } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            where[Op.or] = [
                { scientific_name: { [Op.iLike]: `%${search}%` } },
                { code: { [Op.iLike]: `%${search}%` } }
            ];
            if (Model.rawAttributes.vietnamese_name) {
                where[Op.or].push({ vietnamese_name: { [Op.iLike]: `%${search}%` } });
            }
        }

        // Include quan hệ để hiển thị tên tham chiếu (VD: Loài thuộc Chi nào)
        let include = [];
        if (type === 'genera') include = [{ model: Family, attributes: ['family_id', 'scientific_name', 'code'] }];
        if (type === 'species') include = [{ model: Genus, attributes: ['genus_id', 'scientific_name'] }];

        const { count, rows } = await Model.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sort, order]]
        });

        res.json({
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// --- API: Tìm kiếm cho Select (Dropdown) ---
export const searchForSelect = async (req, res, next) => {
    try {
        const { type } = req.params;
        const { q = '' } = req.query;
        const Model = getModelByType(type);
        
        if (!Model) return res.status(400).json({ message: "Invalid type" });

        const data = await Model.findAll({
            where: {
                scientific_name: { [Op.iLike]: `%${q}%` }
            },
            limit: 20,
            attributes: ['family_id', 'genus_id', 'species_id', 'scientific_name', 'code'] // Lấy ID động sau
        });

        // Map data để frontend dễ dùng
        const result = data.map(item => {
            const id = item.family_id || item.genus_id || item.species_id;
            return {
                value: id,
                label: `${item.code} - ${item.scientific_name}`,
                details: item // Trả về để frontend disable field nếu cần
            };
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// --- API: Thêm mới ---
export const createItem = async (req, res, next) => {
    try {
        const { type } = req.params;
        const Model = getModelByType(type);
        
        const t = enableTransaction ? await sequelize.transaction() : null;
        try {
            const item = await Model.create(req.body, { transaction: t });
            return res.status(201).json({ message: "Tạo thành công", data: item });
        } catch (error) {
            throw error;
        }
    
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// --- API: Cập nhật ---
export const updateItem = async (req, res, next) => {
    try {
        const { type, id } = req.params;
        const Model = getModelByType(type);
        
        const item = await Model.findByPk(id);
        if (!item) return res.status(404).json({ message: "Không tìm thấy dữ liệu" });

        await item.update(req.body);
        res.json({ message: "Cập nhật thành công", data: item });
    } catch (error) {
        next(error);
    }
};

// --- API: Xóa ---
export const deleteItem = async (req, res, next) => {
    try {
        const { type, id } = req.params;
        const Model = getModelByType(type);
        const pk = Model.primaryKeyAttribute;

        await Model.destroy({ where: { [pk]: id } });
        res.json({ message: "Xóa thành công" });
    } catch (error) {
        next(error);
    }
};

// Fetch family/genus/species list without pagination (for dropdowns, etc.)
export const fetchAllItems = async (req, res, next) => {
    try {
        const { type } = req.params;
        const Model = getModelByType(type);
        if (!Model) return res.status(400).json({ message: "Invalid type" });

        const items = await Model.findAll({
            order: [['scientific_name', 'ASC']]
        });

        res.json(items);
    } catch (error) {
        next(error);
    }
};

// Genus
// --- API: Thêm mới ---
export const createGenus = async (req, res, next) => {
    try {
        const Model = getModelByType("genera");
        
        const t = enableTransaction ? await sequelize.transaction() : null;
        try {
            const fam=(req.body.family_id === "new") ? await Family.create(req.body.new_family, { transaction: t }) : await Family.findByPk(req.body.family_id);
            if (!fam) return res.status(404).json({ message: "Không tìm thấy dữ liệu họ thực vật" });
            delete req.body.new_family;
            // Trim dữ liệu string
            for (const key in req.body) {
                if (typeof req.body[key] === 'string') req.body[key] = req.body[key].trim();
            }
            req.body.family_id = fam.family_id;
            const item = await Model.create({ ...req.body}, { transaction: t });
            return res.status(201).json({ message: "Tạo thành công", data: item });
        } catch (error) {
            throw error;
        }
    
    } catch (error) {
        console.error(error);
        next(error);
    }
};
// Cap nhat Genus
export const updateGenus = async (req, res, next) => {
    try {
            const { id } = req.params;
            const Model = getModelByType("genera");
            
            const item = await Model.findByPk(id);
            if (!item) return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
            const t = enableTransaction ? await sequelize.transaction() : null;
        try {
            const fam=(req.body.family_id === "new") ? await Family.create(req.body.new_family, { transaction: t }) : await Family.findByPk(req.body.family_id);
            if (!fam) return res.status(404).json({ message: "Không tìm thấy dữ liệu họ thực vật" });
            delete req.body.new_family;
            // Trim dữ liệu string
            for (const key in req.body) {
                if (typeof req.body[key] === 'string') req.body[key] = req.body[key].trim();
            }
            req.body.family_id = fam.family_id;
            await item.update(req.body, { transaction: t });
            return res.status(201).json({ message: "Tạo thành công", data: item });
        } catch (error) {
            throw error;
        }
    }  catch (error) {
        console.error(error);
        next(error);
    }
}

// --- API: Import Excel (Xử lý lỗi từng dòng) ---
export const importExcel = async (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: "Vui lòng tải file lên" });

    const { type } = req.params;
    const Model = getModelByType(type);
    
    // Logic Mapping cột Excel -> Database Field (Ví dụ)
    // Cần chuẩn hóa file excel mẫu trước
    
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    let success = 0;
    let fail = 0;
    const errorRows = [];

    for (const row of rows) {
        const t = await sequelize.transaction();
        try {
            // Logic xử lý riêng cho từng bảng (Ví dụ Species cần tìm Genus ID)
            let payload = { ...row };
            
            if (type === 'species') {
                const genusName = row['Genus']; // Cột trong Excel
                if (genusName) {
                    const genus = await Genus.findOne({ where: { scientific_name: genusName } });
                    if (!genus) throw new Error(`Không tìm thấy Chi: ${genusName}`);
                    payload.genus_id = genus.genus_id;
                }
            }
            // Tương tự cho Genus -> Family

            await Model.create(payload, { transaction: t });
            await t.commit();
            success++;
        } catch (err) {
            await t.rollback();
            fail++;
            errorRows.push({ ...row, Error: err.message });
        }
    }

    // Tạo file báo cáo lỗi nếu có
    let errorFileUrl = null;
    if (errorRows.length > 0) {
        const newWb = xlsx.utils.book_new();
        const newWs = xlsx.utils.json_to_sheet(errorRows);
        xlsx.utils.book_append_sheet(newWb, newWs, "Errors");
        const fileName = `errors_${Date.now()}.xlsx`;
        xlsx.writeFile(newWb, path.join('uploads/format-excel-data', fileName));
        errorFileUrl = `/uploads/format-excel-data/${fileName}`;
    }

    // Xóa file temp
    fs.unlinkSync(req.file.path);

    res.json({
        success,
        fail,
        total: rows.length,
        errorFileUrl
    });
};