// models/Morphology.js


import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { RAW_ENUMS } from './enums.js';
import generateCustomId from '../utils/idGenerator.js';

// Morphology Leaves (Lá)
const MorphologyLeaf = sequelize.define('MorphologyLeaf', {
    leaf_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true }, // VD: MLF-00001 (Morph Leaf)
    variety_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    leaf_type: { type: DataTypes.ENUM(...RAW_ENUMS.LEAF_TYPE), allowNull: false },
    shape: { type: DataTypes.ENUM(...RAW_ENUMS.LEAF_SHAPE), allowNull: false },
    arrangement: { type: DataTypes.ENUM(...RAW_ENUMS.LEAF_ARRANGEMENT), allowNull: false },
    margin: { type: DataTypes.ENUM(...RAW_ENUMS.LEAF_MARGIN), allowNull: false },
    // ... Thêm các field khác như length_min, width_max...
    length_min: { type: DataTypes.FLOAT }, //cm
    length_max: { type: DataTypes.FLOAT }, //cm
    width_min: { type: DataTypes.FLOAT }, //cm
    width_max: { type: DataTypes.FLOAT }, //cm
    petiole_length: { type: DataTypes.FLOAT }, //cm
    description: { type: DataTypes.TEXT }
}, { tableName: 'morphology_leaves' , timestamps: true });

MorphologyLeaf.beforeCreate(async (record) => {
    record.code = await generateCustomId('MorphologyLeaf', 'MLF');
});

// Morphology Stem
const MorphologyStem = sequelize.define('MorphologyStem', {
    stem_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true }, // VD: MST-00001 (Morph Stem)
    variety_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    stem_type: { type: DataTypes.ENUM(...RAW_ENUMS.STEM_TYPE) , allowNull: false },
    color : { type: DataTypes.STRING  },
    surface: { type: DataTypes.ENUM(...RAW_ENUMS.STEM_SURFACE), allowNull: false },
    // ... Thêm các field khác như height_min, height_max...
    height_min: { type: DataTypes.FLOAT }, //met
    height_max: { type: DataTypes.FLOAT }, //met
    description: { type: DataTypes.TEXT }
}, { tableName: 'morphology_stems', timestamps: true });

MorphologyStem.beforeCreate(async (record) => {
    record.code = await generateCustomId('MorphologyStem', 'MST');
});

// Morphology Flower
const MorphologyFlower = sequelize.define('MorphologyFlower', {
    flower_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true }, // VD: MFL-00001 (Morph Flower)
    variety_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    inflorescence: { type: DataTypes.ENUM(...RAW_ENUMS.INFLORESCENCE), allowNull: false },
    color : { type: DataTypes.STRING , allowNull: false },
    petal_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    blooming_season: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT }
}, { tableName: 'morphology_flowers' , timestamps: true 
});

MorphologyFlower.beforeCreate(async (record) => {
    record.code = await generateCustomId('MorphologyFlower', 'MFL');
});
// Có thể thêm MorphologyStem (MST-xxxxx) và MorphologyFlower (MFL-xxxxx) tương tự

const MorphologyFruit = sequelize.define('MorphologyFruit', {
    fruit_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true }, // VD: MFR-00001 (Morph Fruit)
    variety_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    fruit_type: { type: DataTypes.ENUM(...RAW_ENUMS.FRUIT_TYPE), allowNull: false },
    color : { type: DataTypes.STRING  },
    surface: { type: DataTypes.ENUM(...RAW_ENUMS.FRUIT_SURFACE), allowNull: false },
    // ... Thêm các field khác như weight_min, weight_max...
    weight_min: { type: DataTypes.FLOAT }, //gram
    weight_max: { type: DataTypes.FLOAT }, //gram
    description: { type: DataTypes.TEXT }
}, { tableName: 'morphology_fruits', timestamps: true });

MorphologyFruit.beforeCreate(async (record) => {
    record.code = await generateCustomId('MorphologyFruit', 'MFR');
});

export { MorphologyLeaf, MorphologyStem, MorphologyFlower, MorphologyFruit };