import { Op } from 'sequelize';
import { sequelize, Variety, PlantImage, 
    Species, Genus, Family, 
    MorphologyLeaf, MorphologyStem, MorphologyFlower, 
    Distribution, Province } from '../models/index.js';

export const getHomeData = async (req, res, next) => {
    try {
        const totalVarieties = await Variety.count();
        const totalSpecies = await Species.count();
        const totalImages = await PlantImage.count();

        // 1. Thứ & Giống Nổi bật (Nhiều lượt tra cứu nhất)
        const popularVarieties = await Variety.findAll({
            order: [['view_count', 'DESC']],
            limit: 10,
            include: [
                { model: Species, attributes: ['scientific_name', 'vietnamese_name'] },
                { model: PlantImage, where: { is_background: true }, required: false, limit: 1 }
            ]
        });

        // 2. Thứ & Giống có Bộ sưu tập hình ảnh phong phú nhất
        const richMediaVarieties = await Variety.findAll({
            attributes: {
                include: [
                    [
                        // SỬA Ở ĐÂY: Đổi "PlantImages" thành plant_images
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM plant_images AS pi
                            WHERE pi.variety_id = "Variety".variety_id
                        )`),
                        'image_count'
                    ]
                ]
            },
            order: [[sequelize.literal('image_count'), 'DESC']],
            limit: 10,
            include: [
                { model: Species, attributes: ['scientific_name', 'vietnamese_name'] },
                { model: PlantImage, where: { is_background: true }, required: false, limit: 1 }
            ]
        });

        const formatVarieties = (rows) => rows.map(v => {
            const data = v.toJSON();
            if (data.PlantImages && data.PlantImages.length > 0) {
                data.thumbnail = data.PlantImages[0].url; 
            } else {
                data.thumbnail = null;
            }
            delete data.PlantImages; 
            return data;
        });

        res.json({
            stats: { totalVarieties, totalSpecies, totalImages },
            popularVarieties: formatVarieties(popularVarieties),
            richMediaVarieties: formatVarieties(richMediaVarieties)
        });
    } catch (error) {
        next(error);
    }
};

export const getPublicVarietiesList = async (req, res, next) => {
    try {
        const { 
            page = 1, limit = 12, search = '', sort = 'image_count_desc',
            
            // Các nhóm filter
            has_leaf_filter, has_stem_filter, has_flower_filter, has_distribution_filter,
            
            // Phân loại học
            family_id, genus_id, species_id,
            
            // Đặc điểm sinh học
            life_form, is_flowering, is_fruiting,
            
            // Hình thái Lá
            leaf_type, leaf_shape, leaf_arrangement, leaf_margin, leaf_length_min, leaf_width_min, petiole_length_min,
            
            // Hình thái Thân
            stem_type, stem_surface, stem_color, stem_height_min,
            
            // Hình thái Hoa
            inflorescence, flower_color, flower_petal_count,
            
            // Phân bố
            dist_province_id, dist_status, dist_description
        } = req.query;
        
        const offset = (page - 1) * limit;

        // -------------------------------------------------------------
        // 1. ĐIỀU KIỆN TÌM KIẾM TEXT TỰ DO (SEARCH) KẾT HỢP LOGIC LOẠI TRỪ
        // -------------------------------------------------------------
        const whereCondition = {};
        
        // Thêm điều kiện sinh học trực tiếp vào Variety
        if (life_form) whereCondition.life_form = life_form;
        if (is_flowering ) whereCondition.is_flowering = is_flowering === 'true' ? true : false;
        if (is_fruiting ) whereCondition.is_fruiting = is_fruiting === 'true' ? true : false;

        if (search && search.trim() !== '') {
            const searchTerm = `%${search.trim()}%`;
            
            // Mặc định luôn tìm ở bảng Variety
            let searchConditions = [
                { variety_name: { [Op.iLike]: searchTerm } },
                { common_name: { [Op.iLike]: searchTerm } },
                { code: { [Op.iLike]: searchTerm } },
                { distinctive_feature: { [Op.iLike]: searchTerm } }
            ];

            // Loại trừ thông minh: Chỉ tìm ở cấp bậc chưa được chọn bởi Filter
            if (!species_id) {
                searchConditions.push(
                    { '$Species.scientific_name$': { [Op.iLike]: searchTerm } },
                    { '$Species.vietnamese_name$': { [Op.iLike]: searchTerm } },
                    { '$Species.synonyms$': { [Op.iLike]: searchTerm } },
                    { '$Species.other_names$': { [Op.iLike]: searchTerm } },
                    { '$Species.uses$': { [Op.iLike]: searchTerm } }
                );
            }

            if (!genus_id && !species_id) {  
                searchConditions.push(
                    { '$Species.Genus.scientific_name$': { [Op.iLike]: searchTerm } },
                    { '$Species.Genus.vietnamese_name$': { [Op.iLike]: searchTerm } }
                );
            }

            if (!family_id && !genus_id && !species_id) {
                searchConditions.push(
                    { '$Species.Genus.Family.scientific_name$': { [Op.iLike]: searchTerm } },
                    { '$Species.Genus.Family.vietnamese_name$': { [Op.iLike]: searchTerm } }
                );
            }

            whereCondition[Op.or] = searchConditions;
        }

        // -------------------------------------------------------------
        // 2. CẤU HÌNH INCLUDES & BỘ LỌC SÂU (DEEP FILTERS)
        // -------------------------------------------------------------
        const includeConfig = [
            { model: PlantImage, where: { is_background: true }, required: false, limit: 1 }
        ];

        // A. Lọc Taxonomy (Họ, Chi, Loài) - Luôn include để lấy dữ liệu hiển thị
        const speciesInclude = {
            model: Species,
            attributes: ['species_id', 'scientific_name', 'vietnamese_name'],
            where: {},
            include: [{
                model: Genus,
                attributes: ['genus_id', 'scientific_name'],
                where: {},
                include: [{ model: Family, attributes: ['family_id', 'scientific_name', 'vietnamese_name'], where: {} }]
            }]
        };
        if (species_id) speciesInclude.where.species_id = species_id;
        if (genus_id) speciesInclude.include[0].where.genus_id = genus_id;
        if (family_id) speciesInclude.include[0].include[0].where.family_id = family_id;
        includeConfig.push(speciesInclude);

        // B. Lọc Hình thái Lá
        if (has_leaf_filter === 'true') {
            const leafInclude = { model: MorphologyLeaf, where: {}, required: true };
            if (leaf_type) leafInclude.where.leaf_type = leaf_type;
            if (leaf_shape) leafInclude.where.shape = leaf_shape;
            if (leaf_arrangement) leafInclude.where.arrangement = leaf_arrangement;
            if (leaf_margin) leafInclude.where.margin = leaf_margin;
            const andConditions = [];
            if (leaf_length_min) {
                const value = parseFloat(leaf_length_min);

                andConditions.push({
                    [Op.or]: [
                        { length_max: { [Op.gte]: value } },
                        { length_min: { [Op.gte]: value } }
                    ]
                });
            }

            if (leaf_width_min) {
                const value = parseFloat(leaf_width_min);

                andConditions.push({
                    [Op.or]: [
                        { width_max: { [Op.gte]: value } },
                        { width_min: { [Op.gte]: value } }
                    ]
                });
            }

            // Gán vào where
            if (andConditions.length > 0) {
                leafInclude.where[Op.and] = andConditions;
            }
            if (petiole_length_min) leafInclude.where.petiole_length = { [Op.gte]: parseFloat(petiole_length_min) };
            
            includeConfig.push(leafInclude);
        }

        // C. Lọc Hình thái Thân
        if (has_stem_filter === 'true') {
            const stemInclude = { model: MorphologyStem, where: {}, required: true };
            if (stem_type) stemInclude.where.stem_type = stem_type;
            if (stem_surface) stemInclude.where.surface = stem_surface;
            if (stem_color) stemInclude.where.color = { [Op.iLike]: `%${stem_color.trim()}%` };
            if (stem_height_min)  { 
                const value = parseFloat(stem_height_min);
                stemInclude.where[Op.or] = [
                    { height_max: { [Op.gte]: value } },
                    { height_min: { [Op.gte]: value } }
                ];
            };
            
            includeConfig.push(stemInclude);
        }

        // D. Lọc Hình thái Hoa
        if (has_flower_filter === 'true') {
            const flowerInclude = { model: MorphologyFlower, where: {}, required: true };
            if (inflorescence) flowerInclude.where.inflorescence = inflorescence;
            if (flower_color) flowerInclude.where.color = { [Op.iLike]: `%${flower_color.trim()}%` };
            if (flower_petal_count) flowerInclude.where.petal_count = { [Op.gte]: parseInt(flower_petal_count) };
            
            includeConfig.push(flowerInclude);
        }

        // E. Lọc Phân bố Tỉnh thành
        if (has_distribution_filter === 'true') {
            const distInclude = { model: Distribution, where: {}, required: true };
            if (dist_province_id) distInclude.where.province_id = dist_province_id;
            if (dist_status) distInclude.where.status = dist_status;
            if (dist_description) distInclude.where.description = { [Op.iLike]: `%${dist_description.trim()}%` };
            
            includeConfig.push(distInclude);
        }

        const attributesConfig = {
            include: [
                [
                    sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM "plant_images" AS pi 
                        WHERE pi.variety_id = "Variety".variety_id
                    )`),
                    'image_count'
                ]
            ]
        };
        // -------------------------------------------------------------
        // 3. XỬ LÝ LOGIC SẮP XẾP (SORTING)
        // -------------------------------------------------------------
        let orderCondition = [['createdAt', 'DESC']]; // Mặc định
        
        switch (sort) {
            case 'name_asc':
                // nulls last để đẩy các cây không có common_name (null) xuống dưới cùng
                orderCondition = [['common_name', 'ASC NULLS LAST']];
                break;
            case 'name_desc':
                orderCondition = [['common_name', 'DESC NULLS LAST']];
                break;
            case 'view_count_desc':
                orderCondition = [['view_count', 'DESC']];
                break;
            case 'view_count_asc':
                orderCondition = [['view_count', 'ASC']];
                break;
            case 'image_count_desc':
                // Sắp xếp bằng SubQuery: Đếm số lượng PlantImage liên kết với Variety
                // LƯU Ý BẢO MẬT/LỖI: Tên bảng phải đúng với database PostgreSQL của bạn (thường là chữ thường và snake_case)
                orderCondition = [
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM "plant_images" AS pi 
                        WHERE pi.variety_id = "Variety".variety_id
                    )`), 'DESC']
                ];
                break;
            case 'image_count_asc':
                orderCondition = [
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM "plant_images" AS pi 
                        WHERE pi.variety_id = "Variety".variety_id
                    )`), 'ASC']
                ];
                break;
            case 'createdAt_desc':
            default:
                orderCondition = [['createdAt', 'DESC']];
                break;
        }

        // -------------------------------------------------------------
        // 4. THỰC THI QUERY VÀ PHÂN TRANG
        // -------------------------------------------------------------
        const { count, rows } = await Variety.findAndCountAll({
            where: whereCondition,
            include: includeConfig,
            attributes: attributesConfig,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: orderCondition,
            distinct: true // Rất quan trọng: Bắt buộc dùng khi có include 1-N (Leaf, Flower, Distribution) để count() không bị sai
        });

        // 5. Format dữ liệu trả về cho Frontend
        const formattedRows = rows.map(v => {
            const data = v.toJSON();
            data.thumbnail = data.PlantImages?.length > 0 ? data.PlantImages[0].url : null;
            data.image_count = parseInt(data.image_count, 10) || 0;
            delete data.PlantImages;
            return data;
        });

        res.json({
            data: formattedRows,
            pagination: { total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) }
        });

    } catch (error) {
        console.error("Lỗi khi fetch public varieties:", error);
        next(error);
    }
};

// --- LẤY DỮ LIỆU SO SÁNH ---
export const getCompareVarieties = async (req, res, next) => {
    try {
        const { ids } = req.body; // Expect mảng [1, 2, 3]
        if (!ids || ids.length === 0) return res.json([]);

        const varieties = await Variety.findAll({
            where: { variety_id: { [Op.in]: ids } },
            include: [
                { model: Species, include: [{ model: Genus, include: [Family] }] },
                MorphologyLeaf, MorphologyStem, MorphologyFlower,
                { model: PlantImage, where: { is_background: true }, required: false, limit: 1 }
            ]
        });

        res.json(varieties);
    } catch (error) {
        next(error);
    }
};

export const getTaxonomyTree = async (req, res, next) => {
    try {
        const { family_id, genus_id, species_id } = req.query;

        // Xây dựng điều kiện lọc cho từng cấp độ
        const familyWhere = {};
        if (family_id) familyWhere.family_id = family_id;

        const genusWhere = {};
        if (genus_id) genusWhere.genus_id = genus_id;

        const speciesWhere = {};
        if (species_id) speciesWhere.species_id = species_id;

        // Bật required (Inner Join) nếu cấp độ bên trong bị lọc
        const isSpeciesRequired = Object.keys(speciesWhere).length > 0;
        const isGenusRequired = Object.keys(genusWhere).length > 0 || isSpeciesRequired;

        const taxonomyTree = await Family.findAll({
            where: familyWhere,
            attributes: ['family_id', 'scientific_name', 'vietnamese_name'],
            order: [['scientific_name', 'ASC']],
            include: [{
                model: Genus,
                where: isGenusRequired ? genusWhere : undefined,
                required: isGenusRequired,
                attributes: ['genus_id', 'scientific_name', 'vietnamese_name'],
                include: [{
                    model: Species,
                    where: isSpeciesRequired ? speciesWhere : undefined,
                    required: isSpeciesRequired,
                    attributes: ['species_id', 'scientific_name', 'vietnamese_name'],
                    include: [{
                        model: Variety,
                        attributes: ['variety_id', 'common_name', 'variety_name', 'variant_type', 'code'],
                        include : [{ model: PlantImage, where: { is_background: true }, required: false, limit: 1, attributes: ['url'] }]
                    }]
                }]
            }]
        });

        res.status(200).json({ success: true, data: taxonomyTree });
    } catch (error) {
        console.error("Lỗi lấy cây phân loại:", error);
        next(error);
    }
};

// API Lấy chi tiết Biến thể
export const getVarietyDetail = async (req, res, next) => {
    try {
        const { id } = req.params;

        const variety = await Variety.findByPk(id, {
            include: [
                {
                    model: Species,
                    include: [{
                        model: Genus,
                        include: [{ model: Family }]
                    }]
                },
                { model: MorphologyLeaf },
                { model: MorphologyStem },
                { model: MorphologyFlower },
                { 
                    model: Distribution,
                    include: [{ model: Province, attributes: ['province_name', 'country'] }]
                },
                { model: PlantImage } // Lấy toàn bộ ảnh để Frontend tự chia theo part_type
            ]
        });

        if (!variety) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy dữ liệu' });
        }

        res.status(200).json({ success: true, data: variety });
    } catch (error) {
        console.error("Lỗi lấy chi tiết:", error);
        next(error);
    }
};

// API Tăng View Count (Chỉ gọi khi Session chưa có)
export const incrementViewCount = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Variety.increment('view_count', { by: 1, where: { variety_id: id } });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Lỗi khi fetch public varieties:", error);
        next(error);
    }
};

export const checkHealth = (req, res) => {
    return res.status(200).json({ success: true, message: 'Server is running smoothly.' });
};