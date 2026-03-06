// models/AI.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { RAW_ENUMS } from './enums.js';

export const PlantImage= sequelize.define('PlantImage', {
    plant_image_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    url: { type: DataTypes.STRING, allowNull: false }, // URL hình ảnh, xem là objectkey cho minio
    part_type: { type: DataTypes.ENUM(...RAW_ENUMS.PART_TYPE), allowNull: false }, // Phần của cây (lá, hoa, thân, toàn cây)
    status: { type: DataTypes.ENUM(...RAW_ENUMS.IMAGE_STATUS), allowNull: false }, // Tình trạng hình ảnh
    is_background: { type: DataTypes.BOOLEAN, defaultValue: false }, // Có phải hình ảnh nền không
    cnn_feature_vector: { type: DataTypes.ARRAY(DataTypes.FLOAT) }, // Vector đặc trưng CNN
    is_standard: { type: DataTypes.BOOLEAN, defaultValue: true }, // Có phải hình ảnh tiêu chuan AI khong
}, { tableName: 'plant_images', timestamps: true });

export const KnowledgeChunk= sequelize.define('KnowledgeChunk', {
    knowledge_chunk_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.TEXT, allowNull: false }, // Nội dung đoạn kiến thức
    embedding_vector: { type: DataTypes.ARRAY(DataTypes.FLOAT) }, // Vector nhúng
}, { tableName: 'knowledge_chunks', timestamps: true });