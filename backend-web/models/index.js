// models/index.js

import sequelize from '../config/database.js';
import Counter from './Counter.js';
import Account from './Account.js';
import { Family, Genus, Species } from './Taxonomy.js';
import Variety from './Variety.js';
import { MorphologyLeaf, MorphologyFlower, MorphologyStem, MorphologyFruit } from './Morphology.js';
import { PlantImage } from './AI.js';
import { Distribution, Province } from './geoDistributions.js';

// --- THIẾT LẬP QUAN HỆ (ASSOCIATIONS) ---

// 1. Family -> Genus (1-N)
Family.hasMany(Genus, { foreignKey: 'family_id' });
Genus.belongsTo(Family, { foreignKey: 'family_id' });

// 2. Genus -> Species (1-N)
Genus.hasMany(Species, { foreignKey: 'genus_id' });
Species.belongsTo(Genus, { foreignKey: 'genus_id' });

// 3. Species -> Variety (1-N)
Species.hasMany(Variety, { foreignKey: 'species_id'});
Variety.belongsTo(Species, { foreignKey: 'species_id'});

// 4. Variety -> Morphology (1-1)
Variety.hasOne(MorphologyLeaf, { foreignKey: 'variety_id' });
MorphologyLeaf.belongsTo(Variety, { foreignKey: 'variety_id' });
Variety.hasOne(MorphologyStem, { foreignKey: 'variety_id' });
MorphologyStem.belongsTo(Variety, { foreignKey: 'variety_id' });
Variety.hasOne(MorphologyFlower, { foreignKey: 'variety_id' });
MorphologyFlower.belongsTo(Variety, { foreignKey: 'variety_id' });
Variety.hasOne(MorphologyFruit, { foreignKey: 'variety_id' });
MorphologyFruit.belongsTo(Variety, { foreignKey: 'variety_id' });

// 5. Variety -> Distribution (1-N) 
Variety.hasMany(Distribution, { foreignKey: 'variety_id' });
Distribution.belongsTo(Variety, { foreignKey: 'variety_id' });

// 6. Province -> Distribution (1-N)
Province.hasMany(Distribution, { foreignKey: 'province_id' });
Distribution.belongsTo(Province, { foreignKey: 'province_id' });

// 7. Images, Knowledge Chunks liên kết với Variety (1-N)
Variety.hasMany(PlantImage, { foreignKey: 'variety_id' });
PlantImage.belongsTo(Variety, { foreignKey: 'variety_id' });

// Xuất tất cả models và sequelize instance
export {
    sequelize,
    Counter,
    Family,
    Genus,
    Species,
    Variety,
    MorphologyLeaf,
    MorphologyStem,
    MorphologyFlower,
    MorphologyFruit,
    Distribution,
    Province,
    PlantImage,
    Account,
};