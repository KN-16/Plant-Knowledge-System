// models/geoDistributions.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { RAW_ENUMS } from './enums.js';
import generateCustomId from '../utils/idGenerator.js';

export const Province = sequelize.define('Province', {
    province_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true }, // VD: PRO-00001
    province_name: { type: DataTypes.STRING , allowNull: false}, // Tên tỉnh
    country: { type: DataTypes.STRING , allowNull: false}, // Quốc gia
}, { tableName: 'provinces' 
    , timestamps: true,
    indexes: [
        {
            unique: true, // Không cho phép trùng lặp
            fields: ['province_name', 'country'], // Bộ 2 này phải duy nhất
            name: 'unique_province_entry' // Tên constraint (tùy chọn)
        }
    ]
});

Province.beforeCreate(async (record) => {
    record.code = await generateCustomId('Province', 'PRO');
});


export const Distribution = sequelize.define('Distribution', {
    distribution_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    variety_id: { type: DataTypes.INTEGER, allowNull: false },
    province_id: { type: DataTypes.INTEGER, allowNull: false },
    code: { type: DataTypes.STRING, unique: true }, // VD: DIS-00001
    status: { type: DataTypes.ENUM(...RAW_ENUMS.DISTRIBUTION_STATUS), allowNull: false }, // Tình trạng phân bố
    description: { type: DataTypes.TEXT },
}, 
{ tableName: 'distributions'
    , timestamps: true
    ,indexes: [
        {
            unique: true, // Không cho phép trùng lặp
            fields: ['variety_id', 'province_id', 'status'], // Bộ 3 này phải duy nhất
            name: 'unique_distribution_entry' // Tên constraint (tùy chọn)
        }
    ],
 });

Distribution.beforeCreate(async (record) => {
    record.code = await generateCustomId('Distribution', 'DIS');
});