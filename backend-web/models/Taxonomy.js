// models/Taxonomy.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import generateCustomId from '../utils/idGenerator.js';

// 1. FAMILY (Họ)
export const Family = sequelize.define('Family', {
    family_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true }, // VD: FAM-00001
    scientific_name: { type: DataTypes.STRING, allowNull: false },
    vietnamese_name: { type: DataTypes.STRING},
    description: { type: DataTypes.TEXT },
    authority: { type: DataTypes.STRING }
}, { tableName: 'families' , timestamps: true , indexes: [
    {
        unique: true, // Không cho phép trùng lặp
        fields: ['scientific_name'], // Tên khoa học phải duy nhất
        name: 'unique_family_entry' // Tên constraint (tùy chọn)
    }
]});

Family.beforeValidate(async (family, options) => {
  // Chỉ tạo code nếu chưa có (để tránh ghi đè khi update hoặc nếu đã truyền tay)
  if (!family.code) {
    let transaction = options.transaction || null;
    family.code = await generateCustomId('Family', 'FAM', transaction);
  }
});

// 2. GENUS (Chi)
export const Genus = sequelize.define('Genus', {
    genus_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true }, // VD: GEN-00001
    scientific_name: { type: DataTypes.STRING, allowNull: false },
    vietnamese_name: { type: DataTypes.STRING},
    authority: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT }
}, { tableName: 'genera' , timestamps: true , indexes: [
    {
        unique: true, // Không cho phép trùng lặp
        fields: ['scientific_name'], // Tên khoa học phải duy nhất
        name: 'unique_genus_entry' // Tên constraint (tùy chọn)
    }
]});

Genus.beforeValidate(async (genus, options) => {
    // Chỉ tạo code nếu chưa có (để tránh ghi đè khi update hoặc nếu đã truyền tay)
    if (!genus.code) {
        let transaction = options.transaction || null;
        genus.code = await generateCustomId('Genus', 'GEN', transaction);
    }
});

// 3. SPECIES (Loài - Bảng trung tâm)
export const Species = sequelize.define('Species', {
    species_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true }, // VD: SPC-00001
    scientific_name: { type: DataTypes.STRING, allowNull: false },
    vietnamese_name: { type: DataTypes.STRING},
    synonyms: { type: DataTypes.STRING},
    other_names: { type: DataTypes.STRING},
    uses: { type: DataTypes.TEXT },
    description: { type: DataTypes.TEXT },
    authority: { type: DataTypes.STRING }
}, { tableName: 'species' , timestamps: true , indexes: [
    {
        unique: true, // Không cho phép trùng lặp
        fields: ['scientific_name'], // Tên khoa học phải duy nhất
        name: 'unique_species_entry' // Tên constraint (tùy chọn)
    }
]});

Species.beforeValidate(async (species, options) => {
    // Chỉ tạo code nếu chưa có (để tránh ghi đè khi update hoặc nếu đã truyền tay)
    if (!species.code) {
        let transaction = options.transaction || null;
        species.code = await generateCustomId('Species', 'SPC', transaction);
    }
});