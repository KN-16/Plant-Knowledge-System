// backend-web/controllers/taxonomyController.js

import { Family, Genus, Species, sequelize, Variety, PlantImage} from '../models/index.js';
import { Op } from 'sequelize';

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
        let searchConditions = []; // Mảng chứa tất cả các điều kiện OR
        let include = []; // Mảng chứa tất cả các bảng con

        // 1. Gom các điều kiện tìm kiếm của bảng hiện tại (bảng gốc)
        if (search) {
            searchConditions.push(
                { scientific_name: { [Op.iLike]: `%${search}%` } },
                { code: { [Op.iLike]: `%${search}%` } }
            );
            if (Model.rawAttributes.vietnamese_name) {
                searchConditions.push({ vietnamese_name: { [Op.iLike]: `%${search}%` } });
            }
        }
        // 2. Xây dựng Include và add thêm điều kiện OR cho bảng Genera (Chi)
        if (type === 'genera') {
            include = [
                { 
                    model: Family, 
                    attributes: ['family_id', 'scientific_name', 'code', 'vietnamese_name'] 
                }
            ];
            
            if (search) {
                searchConditions.push(
                    { '$Family.scientific_name$': { [Op.iLike]: `%${search}%` } }
                );
            if (Family.rawAttributes.vietnamese_name) {
                    searchConditions.push({ '$Family.vietnamese_name$': { [Op.iLike]: `%${search}%` } });
                }
            }
        }

        // 3. Xây dựng Include và add thêm điều kiện OR cho bảng Species (Loài)
        if (type === 'species') {
            include = [
                { 
                    model: Genus, 
                    attributes: ['genus_id', 'scientific_name', 'vietnamese_name', 'code'],
                    include: [{ 
                        model: Family, 
                        attributes: ['family_id', 'scientific_name', 'code', 'vietnamese_name'] 
                    }]  
                }
            ];
            
            if (search) {
                searchConditions.push(
                    { '$Genus.scientific_name$': { [Op.iLike]: `%${search}%` } }
                );
                if (Genus.rawAttributes.vietnamese_name) {
                    searchConditions.push({ '$Genus.vietnamese_name$': { [Op.iLike]: `%${search}%` } });
                }
            }
        }

        // 4. Chốt hạ: Gắn mảng OR khổng lồ vào biến where gốc
        if (search && searchConditions.length > 0) {
            where[Op.or] = searchConditions;
        }

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

// --- API: Thêm mới ---
export const createItem = async (req, res, next) => {
    const t = enableTransaction ? await sequelize.transaction() : null;
    try {
        const { type } = req.params;
        const Model = getModelByType(type);
        const item = await Model.create(req.body, { transaction: t });
        if (t) await t.commit();
        return res.status(201).json({ message: "Tạo thành công", data: item });
    } catch (error) {
        if (t) await t.rollback();
        next(error);
    }
};

// --- API: Cập nhật ---
export const updateItem = async (req, res, next) => {
    const t = enableTransaction ? await sequelize.transaction() : null;
    try {
        const { type, id } = req.params;
        const Model = getModelByType(type);
        const item = await Model.findByPk(id, { transaction: t });
        if (!item) {
            if (t) await t.rollback();
            return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
        }
        await item.update(req.body, { transaction: t });
        if (t) await t.commit();
        res.json({ message: "Cập nhật thành công", data: item });
    } catch (error) {
        if (t) await t.rollback();
        next(error);
    }
};

// --- API: Xóa ---
export const deleteItem = async (req, res, next) => {
    const t = enableTransaction ? await sequelize.transaction() : null;
    try {
        const { type, id } = req.params;
        const Model = getModelByType(type);
        
        // 1. Kiểm tra dữ liệu có tồn tại không
        const item = await Model.findByPk(id, { transaction: t });
        if (!item) {
            if (t) await t.rollback();
            return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu" });
        }

        // 2. THUẬT TOÁN MỚI: Quét kiểm tra dữ liệu cấp dưới (1 cấp)
        let hasChildren = false;
        let childName = "";

        // Dựa vào type để đếm số lượng bản ghi con
        // (Tùy thuộc vào cách bạn đặt tên biến type trên route là số ít hay số nhiều để điều chỉnh case cho đúng)
        if ( type === 'families') {
            const childCount = await Genus.count({ where: { family_id: id }, transaction: t });
            if (childCount > 0) { hasChildren = true; childName = "Chi (Genus)"; }
            
        } else if ( type === 'genera') {
            const childCount = await Species.count({ where: { genus_id: id }, transaction: t });
            if (childCount > 0) { hasChildren = true; childName = "Loài (Species)"; }
            
        } else if (type === 'species') {
            const childCount = await Variety.count({ where: { species_id: id }, transaction: t });
            if (childCount > 0) { hasChildren = true; childName = "Biến thể (Variety)"; }
        }

        // Nếu có con, chặn việc xóa và trả về lỗi 400 (Bad Request)
        if (hasChildren) {
            if (t) await t.rollback();
            return res.status(400).json({ 
                success: false, 
                message: `Không thể xóa! Dữ liệu này đang chứa ${childName} trực thuộc. Vui lòng xóa dữ liệu cấp dưới trước.` 
            });
        }

        // 3. Nếu an toàn (không có con), tiến hành xóa
        await item.destroy({ transaction: t });
        
        if (t) await t.commit();
        res.json({ success: true, message: "Xóa thành công" });
        
    } catch (error) {
        if (t) await t.rollback();
        next(error);
    }
};

// --- API: Thêm Genus ---
export const createGenus = async (req, res, next) => {
    const t = enableTransaction ? await sequelize.transaction() : null;
    try {
        const Model = getModelByType("genera");
        const fam = (req.body.family_id === "new") 
            ? await Family.create(req.body.new_family, { transaction: t }) 
            : await Family.findByPk(req.body.family_id, { transaction: t });
        
        if (!fam) {
            if (t) await t.rollback();
            return res.status(404).json({ message: "Không tìm thấy dữ liệu họ thực vật" });
        }

        const data = { ...req.body, family_id: fam.family_id };
        delete data.new_family;
        // Trim strings
        Object.keys(data).forEach(key => { if (typeof data[key] === 'string') data[key] = data[key].trim(); });

        const item = await Model.create(data, { transaction: t });
        if (t) await t.commit();
        return res.status(201).json({ message: "Tạo thành công", data: item });
    } catch (error) {
        if (t) await t.rollback();
        next(error);
    }
};

// --- API: Cập nhật Genus ---
export const updateGenus = async (req, res, next) => {
    const t = enableTransaction ? await sequelize.transaction() : null;
    try {
        const { id } = req.params;
        const Model = getModelByType("genera");
        const item = await Model.findByPk(id, { transaction: t });
        if (!item) {
            if (t) await t.rollback();
            return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
        }

        const fam = (req.body.family_id === "new") 
            ? await Family.create(req.body.new_family, { transaction: t }) 
            : await Family.findByPk(req.body.family_id, { transaction: t });
        
        if (!fam) {
            if (t) await t.rollback();
            return res.status(404).json({ message: "Không tìm thấy dữ liệu họ thực vật" });
        }

        const data = { ...req.body, family_id: fam.family_id };
        delete data.new_family;
        Object.keys(data).forEach(key => { if (typeof data[key] === 'string') data[key] = data[key].trim(); });

        await item.update(data, { transaction: t });
        if (t) await t.commit();
        return res.json({ message: "Cập nhật thành công", data: item });
    } catch (error) {
        if (t) await t.rollback();
        next(error);
    }
};

// --- API: Thêm Species ---
export const createSpecies = async (req, res, next) => {
    const t = enableTransaction ? await sequelize.transaction() : null;
    try {
        const Model = getModelByType("species");
        let genus_id = req.body.genus_id;

        if (genus_id === "new") {
            const fam = (req.body.new_genus.family_id === "new") 
                ? await Family.create(req.body.new_genus.new_family, { transaction: t }) 
                : await Family.findByPk(req.body.new_genus.family_id, { transaction: t });
            
            if (!fam) {
                if (t) await t.rollback();
                return res.status(404).json({ message: "Không tìm thấy họ thực vật" });
            }

            const genus = await Genus.create({ ...req.body.new_genus, family_id: fam.family_id }, { transaction: t });
            genus_id = genus.genus_id;
        } else {
            const genus = await Genus.findByPk(genus_id, { transaction: t });
            if (!genus) {
                if (t) await t.rollback();
                return res.status(404).json({ message: "Không tìm thấy dữ liệu chi" });
            }
        }

        const data = { ...req.body, genus_id };
        delete data.new_genus;
        const item = await Model.create(data, { transaction: t });
        if (t) await t.commit();
        return res.status(201).json({ message: "Tạo thành công", data: item });
    } catch (error) {
        if (t) await t.rollback();
        next(error);
    }
};

// --- API: Cập nhật Species ---
export const updateSpecies = async (req, res, next) => {
    const t = enableTransaction ? await sequelize.transaction() : null;
    try {
        const { id } = req.params;
        const Model = getModelByType("species");
        const item = await Model.findByPk(id, { transaction: t });
        if (!item) {
            if (t) await t.rollback();
            return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
        }

        let genus_id = req.body.genus_id;
        if (genus_id === "new") {
            const fam = (req.body.new_genus.family_id === "new") 
                ? await Family.create(req.body.new_genus.new_family, { transaction: t }) 
                : await Family.findByPk(req.body.new_genus.family_id, { transaction: t });
            
            if (!fam) {
                if (t) await t.rollback();
                return res.status(404).json({ message: "Không tìm thấy dữ liệu họ thực vật" });
            }
            const genus = await Genus.create({ ...req.body.new_genus, family_id: fam.family_id }, { transaction: t });
            genus_id = genus.genus_id;
        } else {
            const genus = await Genus.findByPk(genus_id, { transaction: t });
            if (!genus) {
                if (t) await t.rollback();
                return res.status(404).json({ message: "Không tìm thấy chi" });
            }
        }

        const data = { ...req.body, genus_id };
        delete data.new_genus;
        await item.update(data, { transaction: t });
        if (t) await t.commit();
        return res.json({ message: "Cập nhật thành công", data: item });
    } catch (error) {
        if (t) await t.rollback();
        next(error);
    }
};

export const fetchAllItems = async (req, res, next) => {
    try {
        const { type } = req.params;
        const Model = getModelByType(type);
        if (!Model) return res.status(400).json({ message: "Invalid type" });
        let includeConfig = [];

        if (type === 'species') {
            includeConfig = [{ model: Genus, attributes: ['genus_id', 'scientific_name', 'code', 'vietnamese_name'], include: [{ model: Family, attributes: ['family_id', 'scientific_name', 'code', 'vietnamese_name'] }] }];
        }
        if (type === 'genera') {
            includeConfig = [{ model: Family, attributes: ['family_id', 'scientific_name', 'code', 'vietnamese_name'] }];
        }

        const items = await Model.findAll({
            order: [['scientific_name', 'ASC']],
            include: includeConfig
        });

        res.json(items);
    } catch (error) {
        next(error);
    }
};

export const getTaxonomyTree = async (req, res) => {
    try {
        // Nhận 1 trong 4 tham số từ body (hoặc query)
        const { family_id, genus_id, species_id, variety_id } = req.query; 

        // Khởi tạo điều kiện rỗng
        let targetFamilyId = null;
        let targetGenusId = null;
        let targetSpeciesId = null;

        // Xử lý logic ngược từ dưới lên để xác định điểm neo (anchor)
        if (variety_id) {
            // Nếu là variety_id, tìm ra species_id của nó để lấy "các anh em chung loài"
            const variety = await Variety.findByPk(variety_id, { include: [{ model: Species, attributes: ['species_id'] }] });
            if (!variety) {
                return res.status(404).json({ success: false, message: "Không tìm thấy biến thể này." });
            }
            targetSpeciesId = variety.Species.species_id;
        } else if (species_id) {
            targetSpeciesId = species_id;
        } else if (genus_id) {
            targetGenusId = genus_id;
        } else if (family_id) {
            targetFamilyId = family_id;
        } else {
            return res.status(400).json({ success: false, message: "Vui lòng cung cấp ID hợp lệ." });
        }

        // Khởi tạo cấu trúc JOIN lồng nhau (Eager Loading) của Sequelize
        let includeHierarchy = [
            {
                model: Genus,
                required: !!(targetGenusId || targetSpeciesId),
                include: [
                    {
                        model: Species,
                        as: 'Species',
                        required: !!targetSpeciesId,
                        include: [
                            {
                                model: Variety,
                                as: 'Varieties',
                                include: [{ 
                                    model: PlantImage, 
                                    as: 'PlantImages', 
                                    attributes: ['url'], // Chỉ lấy url cho nhẹ
                                    limit: 1 // Lấy 1 ảnh làm thumbnail
                                }]
                            }
                        ]
                    }
                ]
            }
        ];

        // Ép điều kiện WHERE vào đúng cấp độ tương ứng
        let familyWhere = {};
        
        if (targetFamilyId) {
            familyWhere.family_id = targetFamilyId;
        } 
        if (targetGenusId) {
            includeHierarchy[0].where = { genus_id: targetGenusId };
        } 
        if (targetSpeciesId) {
            includeHierarchy[0].include[0].where = { species_id: targetSpeciesId };
        }

        // Truy vấn ra Cây (Tree)
        const treeData = await Family.findAll({
            where: familyWhere,
            include: includeHierarchy,
            order: [
                ['scientific_name', 'ASC'],
                [{ model: Genus }, 'scientific_name', 'ASC'],
                [{ model: Genus }, { model: Species, as: 'Species' }, 'scientific_name', 'ASC']
            ]
        });

        return res.status(200).json({
            success: true,
            data: treeData
        });

    } catch (error) {
        console.error("Lỗi lấy Taxonomy Tree:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
    }
};