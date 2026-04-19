import { sequelize, Variety, MorphologyLeaf, MorphologyStem, MorphologyFlower, Distribution, Province, PlantImage , Family, Genus, Species} from '../models/index.js';
import { pushToQueue } from '../config/rabbitmq.js';
import { deleteImage } from '../middleware/uploadMiddleware.js';
import { UI_MAPPINGS } from '../models/enums.js';
import { Op } from 'sequelize';

const enableTransaction = process.env.ENABLE_TRANSACTION === 'true';

// --- GET LIST ---
export const getVarieties = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        const whereCondition = {};
        if (search) {
            whereCondition[Op.or] = [
                { variety_name: { [Op.iLike]: `%${search}%` } },
                { common_name: { [Op.iLike]: `%${search}%` } },
                { code: { [Op.iLike]: `%${search}%` } },
                { '$Species.scientific_name$': { [Op.iLike]: `%${search}%` } },
                { '$Species.vietnamese_name$': { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Variety.findAndCountAll({
            where: whereCondition,
            include: [
                { model: Species, attributes: ['scientific_name', 'vietnamese_name'] 
                    ,include: [
                        {
                            model: Genus,
                            attributes: ['scientific_name'],
                            include: [
                                { model: Family, attributes: ['scientific_name'] }
                            ]
                        }
                    ]
                },
                { model: PlantImage, where: { is_background: true }, required: false, limit: 1 }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            distinct: true 
        });

        const formattedRows = rows.map(v => {
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
            data: formattedRows, 
            pagination: { total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) } 
        });
    } catch (error) { next(error); }
};

// --- GET DETAIL ---
export const getVarietyDetail = async (req, res, next) => {
    try {
        const variety = await Variety.findByPk(req.params.id, {
            include: [
                { 
                    model: Species,
                    include: [{ model: Genus, include: [Family] }] 
                }, 
                MorphologyLeaf, 
                MorphologyStem, 
                MorphologyFlower, 
                PlantImage,
                {
                    model: Distribution,
                    include: [Province]
                }
            ]
        });

        if (!variety) return res.status(404).json({ message: "Không tìm thấy" });

        const data = variety.toJSON();
        if (data.PlantImages) {
            data.PlantImages = data.PlantImages.map(img => ({
                ...img,
                full_url: img.url 
            }));
        }

        res.json(data);
    } catch (error) { next(error); }
};

// --- SAVE VARIETY (FIXED TRANSACTION) ---
export const saveVariety = async (req, res, next) => {
    const t = enableTransaction ? await sequelize.transaction() : null;

    try {
        const varietyIdParam = req.params.id; 
        const basicInfo = JSON.parse(req.body.basicInfo);
        const leafData = JSON.parse(req.body.leafData);
        const stemData = JSON.parse(req.body.stemData);
        const flowerData = JSON.parse(req.body.flowerData);
        const distributions = JSON.parse(req.body.distributions);
        const deletedImages = JSON.parse(req.body.deletedImages || '[]');
        const imageMetadata = JSON.parse(req.body.imageMetadata || '[]');
        const updatedExistingImages= JSON.parse(req.body.updatedExistingImages || '[]');
        const bgImageId = req.body.bgImageId; 
        
        const files = req.files || [];

        let varietyId;
        if (varietyIdParam && varietyIdParam !== 'undefined') {
            await Variety.update(basicInfo, { where: { variety_id: varietyIdParam }, transaction: t });
            varietyId = varietyIdParam;
        } else {
            const newVariety = await Variety.create(basicInfo, { transaction: t });
            varietyId = newVariety.variety_id;
        }

        const handleMorphology = async (Model, data, varietyId, transaction) => {
            if (data) {
                const existing = await Model.findOne({ where: { variety_id: varietyId }, transaction });
                if (existing) {
                    await existing.update(data, { transaction });
                } else {
                    await Model.create({ ...data, variety_id: varietyId }, { transaction });
                }
            } else {
                await Model.destroy({ where: { variety_id: varietyId }, transaction });
            }
        };

        await handleMorphology(MorphologyLeaf, leafData, varietyId, t);
        await handleMorphology(MorphologyStem, stemData, varietyId, t);
        await handleMorphology(MorphologyFlower, flowerData, varietyId, t);

        const currentDistIds = []; 
        for (const dist of distributions) {
            let finalProvinceId = dist.province_id;

            if (dist.distribution_id) {
                await Distribution.update(
                    { province_id: finalProvinceId, status: dist.status, description: dist.description },
                    { where: { distribution_id: dist.distribution_id }, transaction: t }
                );
                currentDistIds.push(dist.distribution_id);
            } else {
                const newDist = await Distribution.create({
                    variety_id: varietyId,
                    province_id: finalProvinceId,
                    status: dist.status,
                    description: dist.description
                }, { transaction: t });
                currentDistIds.push(newDist.distribution_id);
            }
        }

        await Distribution.destroy({
            where: {
                variety_id: varietyId,
                distribution_id: { [Op.notIn]: currentDistIds }
            },
            transaction: t
        });

        if (deletedImages && deletedImages.length > 0) {
            const imagesToDelete = await PlantImage.findAll({ where: { plant_image_id: deletedImages, variety_id: varietyId }, transaction: t });
            for (let i = 0; i < imagesToDelete.length; i++) {
                await deleteImage(imagesToDelete[i].url);
            }            
            await PlantImage.destroy({
                where: { plant_image_id: { [Op.in]: deletedImages } },
                transaction: t
            });
        }

        let newlyAddedImageJobs = []; 
        if (updatedExistingImages && updatedExistingImages.length > 0) {
            for (const imgData of updatedExistingImages) {
                // Sửa lỗi logic: update trả về số dòng ảnh hưởng, không trả về object record
                await PlantImage.update(
                    { is_standard: imgData.is_standard },
                    { where: { plant_image_id: imgData.plant_image_id }, transaction: t }
                );
                // Tìm lại record để kiểm tra cnn_feature_vector
                const imgCheck = await PlantImage.findByPk(imgData.plant_image_id, { transaction: t });
                if (imgCheck && imgCheck.is_standard === true && imgCheck.cnn_feature_vector === null) {
                    newlyAddedImageJobs.push(imgCheck); 
                }
            }
        }

        let resolvedBgImageId = isNaN(bgImageId) ? null : parseInt(bgImageId);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const meta = imageMetadata[i];
            const objectUrl = `/uploads/images/${file.filename}`; 

            const newImg = await PlantImage.create({
                variety_id: varietyId,
                url: objectUrl,
                part_type: meta.part_type,
                status: 'Pending',
                is_background: false,
                is_standard: meta.is_standard || false 
            }, { transaction: t });

            if (meta.temp_id === bgImageId) {
                resolvedBgImageId = newImg.plant_image_id;
            }
            if (newImg.is_standard) {
                newlyAddedImageJobs.push(newImg);
            }
        }
        
        await PlantImage.update(
            { is_background: false }, 
            { where: { variety_id: varietyId }, transaction: t }
        );

        if (resolvedBgImageId) {
            await PlantImage.update(
                { is_background: true }, 
                { where: { plant_image_id: resolvedBgImageId }, transaction: t }
            );
        }

        // --- ĐÓNG GIAO DỊCH (COMMIT) ---
        if (t) await t.commit();

        // Đẩy vào hàng đợi sau khi đã commit thành công
        for (const imgRecord of newlyAddedImageJobs) {
            pushToQueue(imgRecord);
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Lưu dữ liệu thành công',
            variety_id: varietyId
        });

    } catch (error) {
        // --- HỦY GIAO DỊCH (ROLLBACK) ---
        if (t) await t.rollback();
        console.error("Error saving variety:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- DELETE VARIETY (FIXED TRANSACTION) ---
export const deleteVariety = async (req, res) => {
    const { id } = req.params;
    const t = enableTransaction ? await sequelize.transaction() : null;

    try {
        if (!id || isNaN(id)) {
            if (t) await t.rollback();
            return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
        }

        const variety = await Variety.findByPk(id, { transaction: t });
        if (!variety) {
            if (t) await t.rollback();
            return res.status(404).json({ success: false, message: 'Không tìm thấy Thứ/Giống để xóa' });
        }

        await Promise.all([
            MorphologyLeaf.destroy({ where: { variety_id: id }, transaction: t }),
            MorphologyStem.destroy({ where: { variety_id: id }, transaction: t }),
            MorphologyFlower.destroy({ where: { variety_id: id }, transaction: t }),
            Distribution.destroy({ where: { variety_id: id }, transaction: t }),
        ]);
        
        const images = await PlantImage.findAll({ where: { variety_id: id }, transaction: t });
        for (const image of images) {
            await deleteImage(image.url);
        }

        await PlantImage.destroy({ where: { variety_id: id }, transaction: t });
        await Variety.destroy({ where: { variety_id: id }, transaction: t });

        // --- ĐÓNG GIAO DỊCH (COMMIT) ---
        if (t) await t.commit();

        return res.status(200).json({ success: true, message: 'Xóa dữ liệu thành công' });

    } catch (error) {
        // --- HỦY GIAO DỊCH (ROLLBACK) ---
        if (t) await t.rollback();
        console.error("Error deleting variety:", error);
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi xóa dữ liệu' });
    }
};

export const mapUIViewData = async (req, res, next) => {
    return res.json(UI_MAPPINGS);
};

export const getProvinces = async (req, res, next) => {
    try {
        const provinces = await Province.findAll({ attributes: ['province_id', 'province_name', 'country'] });
        res.json(provinces);
    } catch (error) {
        next(error);
    }
};