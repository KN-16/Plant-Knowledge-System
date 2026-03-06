// models/Variety.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { RAW_ENUMS } from './enums.js';
import generateCustomId from '../utils/idGenerator.js';

const Variety = sequelize.define('Variety', {
    variety_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true }, // VD: VAR-00001
    variety_name: { type: DataTypes.STRING }, // Tên Latin biến thể (Thường ít khi dùng, có thể để trống)
    common_name: { type: DataTypes.STRING},  // Tên thường gọi (Đinh lăng lá nhỏ)
    variant_type: { type: DataTypes.ENUM(...RAW_ENUMS.VARIANT_TYPE),defaultValue: 'Phenotype' }, 
    authority: { type: DataTypes.STRING }, // Không bắt buộc khi không phải công bố chính thức 
    // Enum fields
    life_form: { type: DataTypes.ENUM(...RAW_ENUMS.LIFE_FORM) },
    
    distinctive_feature: { type: DataTypes.TEXT },
    description: { type: DataTypes.TEXT },
    is_flowering: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_fruiting: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'varieties', timestamps: true });

Variety.beforeCreate(async (record) => {
    record.code = await generateCustomId('Variety', 'VAR');
});

export default Variety;