// models/Morphology.js


import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { RAW_ENUMS } from './enums.js';
import generateCustomId from '../utils/idGenerator.js';

// Morphology Leaves (Lá)
const MorphologyLeaf = sequelize.define('MorphologyLeaf', {
    leaf_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true }, // VD: MLF-00001 (Morph Leaf)
    variety_id: { type: DataTypes.INTEGER, allowNull: false },
    leaf_type: { type: DataTypes.ENUM(...RAW_ENUMS.LEAF_TYPE), allowNull: false },
    shape: { type: DataTypes.ENUM(...RAW_ENUMS.LEAF_SHAPE), allowNull: false },
    arrangement: { type: DataTypes.ENUM(...RAW_ENUMS.LEAF_ARRANGEMENT), allowNull: false },
    margin: { type: DataTypes.ENUM(...RAW_ENUMS.LEAF_MARGIN), allowNull: false },
    // ... Thêm các field khác như length_min, width_max...
    length_min: { type: DataTypes.FLOAT },
    length_max: { type: DataTypes.FLOAT },
    width_min: { type: DataTypes.FLOAT },
    width_max: { type: DataTypes.FLOAT },
    petiole_length: { type: DataTypes.FLOAT },
    description: { type: DataTypes.TEXT }
}, { tableName: 'morphology_leaves' , timestamps: true , indexes: [
    {
        unique: true, // Không cho phép trùng lặp
        fields: ['variety_id', 'leaf_type', 'shape', 'arrangement', 'margin'], // Bộ 4 này phải duy nhất
        name: 'unique_leaf_entry' // Tên constraint (tùy chọn)
    }
]});

MorphologyLeaf.beforeCreate(async (record) => {
    record.code = await generateCustomId('MorphologyLeaf', 'MLF');
});

// Morphology Stem
const MorphologyStem = sequelize.define('MorphologyStem', {
    stem_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true }, // VD: MST-00001 (Morph Stem)
    variety_id: { type: DataTypes.INTEGER, allowNull: false },
    stem_type: { type: DataTypes.ENUM(...RAW_ENUMS.STEM_TYPE) , allowNull: false },
    color : { type: DataTypes.STRING  },
    surface: { type: DataTypes.ENUM(...RAW_ENUMS.STEM_SURFACE), allowNull: false },
    // ... Thêm các field khác như height_min, height_max...
    height_min: { type: DataTypes.FLOAT },
    height_max: { type: DataTypes.FLOAT },
    description: { type: DataTypes.TEXT }
}, { tableName: 'morphology_stems', timestamps: true , indexes: [
    {
        unique: true, // Không cho phép trùng lặp
        fields: ['variety_id', 'stem_type', 'color', 'surface'], // Bộ 4 này phải duy nhất
        name: 'unique_stem_entry' // Tên constraint (tùy chọn)
    }
]});

MorphologyStem.beforeCreate(async (record) => {
    record.code = await generateCustomId('MorphologyStem', 'MST');
});

// Morphology Flower
const MorphologyFlower = sequelize.define('MorphologyFlower', {
    flower_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true }, // VD: MFL-00001 (Morph Flower)
    variety_id: { type: DataTypes.INTEGER, allowNull: false },
    inflorescence: { type: DataTypes.ENUM(...RAW_ENUMS.INFLORESCENCE), allowNull: false },
    color : { type: DataTypes.STRING , allowNull: false },
    petal_count: { type: DataTypes.INTEGER , allowNull: false },
    blooming_season: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT }
}, { tableName: 'morphology_flowers' , timestamps: true , indexes: [
    {
        unique: true, // Không cho phép trùng lặp
        fields: ['variety_id', 'inflorescence', 'color', 'petal_count'], // Bộ 4 này phải duy nhất
        name: 'unique_flower_entry' // Tên constraint (tùy chọn)
    }
]});

MorphologyFlower.beforeCreate(async (record) => {
    record.code = await generateCustomId('MorphologyFlower', 'MFL');
});
// Có thể thêm MorphologyStem (MST-xxxxx) và MorphologyFlower (MFL-xxxxx) tương tự

export { MorphologyLeaf, MorphologyStem, MorphologyFlower };