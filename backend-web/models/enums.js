// src/models/enums.js

// Định nghĩa các giá trị Enum chuẩn cho Database (Tiếng Anh)
const RAW_ENUMS = {
    LIFE_FORM: ['Tree', 'Shrub', 'Herb', 'Climber', 'Epiphyte'],
    DISTRIBUTION_STATUS: ['Native', 'Cultivated', 'Invasive', 'Endemic', 'Naturalized'],
    STEM_TYPE: ['Woody', 'Herbaceous', 'Climbing', 'Shrubby', 'Fleshy', 'Rhizome', 'Bulb', 'Tuber'], 
    STEM_SURFACE: ['Smooth', 'Hairy', 'Spiny', 'Glabrous', 'Rough'], 
    LEAF_TYPE: ['Simple', 'Compound_Pinnate', 'Compound_Palmate', 'Bipinnate', 'Trifoliolate'], 
    LEAF_SHAPE: ['Ovate', 'Lanceolate', 'Elliptic', 'Linear', 
        'Cordate', 'Oblong', 'Palmate', 'Obovate', 'Orbicular', 
        'Peltate', 'Acicular'], 
    LEAF_MARGIN: ['Entire', 'Serrate', 'Lobed', 'Dentate', 'Undulate', 'Spiny', 'Rough'], 
    LEAF_ARRANGEMENT: ['Alternate', 'Opposite', 'Whorled', 'Spiral', 'Basal', 'Fascicled'],
    FRUIT_TYPE: ['Berry', 'Drupe', 'Pome', 'Capsule', 'Achene', 'Nut', 'Samara', 'Legume'], 
    FRUIT_SURFACE: ['Smooth', 'Hairy', 'Spiny', 'Glabrous', 'Rough'],
    INFLORESCENCE: ['Umbel', 'Raceme', 'Panicle', 'Solitary', 'Spadix', 'Cyme', 'Spike', 'Capitulum'], 
    PART_TYPE: ['Leaf', 'Flower', 'Stem', 'Root', 'Fruit', 'Seed', 'Whole_Plant'], 
    VARIANT_TYPE: ['Variety', 'Phenotype', 'Cultivar', 'Forma'], 
    IMAGE_STATUS: ['Pending', 'Completed', 'Failed'],
};

// Định nghĩa các mapping để hiển thị trên UI (Tiếng Việt + Tiếng Anh)
const UI_MAPPINGS = {
    LIFE_FORM: {
        'Tree': 'Cây gỗ (Tree)',
        'Shrub': 'Cây bụi (Shrub)',
        'Herb': 'Cây thảo (Herb)',
        'Climber': 'Dây leo (Climber)',
        'Epiphyte': 'Cây phụ sinh (Bì sinh) (Epiphyte)'
    },
    LIFE_FORM_BG: {
        'Tree': { label: 'Cây gỗ (Tree)', bg: 'success' },
        'Shrub': { label: 'Cây bụi (Shrub)', bg: 'warning text-dark' },
        'Herb': { label: 'Cây thảo (Herb)', bg: 'info text-dark' },
        'Climber': { label: 'Dây leo (Climber)', bg: 'secondary' },
        'Epiphyte': { label: 'Cây phụ sinh (Bì sinh) (Epiphyte)', bg: 'primary' }
    },
    DISTRIBUTION_STATUS: {
        'Native': { label: 'Bản địa (Native)', bg: 'success' },
        'Endemic': { label: 'Đặc hữu (Endemic)', bg: 'primary' }, 
        'Cultivated': { label: 'Trồng trọt (Cultivated)', bg: 'info text-dark' },
        'Naturalized': { label: 'Nhập nội (Naturalized)', bg: 'secondary' },
        'Invasive': { label: 'Xâm lấn (Invasive)', bg: 'danger' }
    },
    STEM_TYPE: {
        'Woody': 'Thân gỗ (Woody)',
        'Herbaceous': 'Thân thảo (Herbaceous)',
        'Climbing': 'Thân leo (Climbing)',
        'Shrubby': 'Thân bụi (Shrubby)',
        'Fleshy': 'Thân mọng nước (Fleshy)',
        'Rhizome': 'Thân rễ (Rhizome)', 
        'Bulb': 'Thân hành (Bulb)',
        'Tuber': 'Thân củ (Tuber)'
    },
    STEM_SURFACE: {
        'Smooth': 'Trơn (Smooth)',
        'Glabrous': 'Nhẵn / Không lông (Glabrous)',
        'Hairy': 'Có lông (Hairy)',
        'Spiny': 'Có gai (Spiny)',
        'Rough': 'Sần sùi / Nhám (Rough)'
    },
    LEAF_TYPE: {
        'Simple': 'Lá đơn (Simple)',
        'Compound_Pinnate': 'Lá kép lông chim (Compound_Pinnate)',
        'Bipinnate': 'Lá kép lông chim 2 lần (Bipinnate)',
        'Compound_Palmate': 'Lá kép chân vịt (Compound_Palmate)',
        'Trifoliolate': 'Lá kép 3 lá chét (Trifoliolate)',
        'Orbicular': 'Lá hình tròn (Orbicular)',
        'Peltate': 'Lá hình khiên (Peltate)',
        'Acicular': 'Lá hình kim (Acicular)'
    },
    LEAF_SHAPE: {
        'Ovate': 'Hình trứng (Ovate)',
        'Obovate': 'Hình trứng ngược (Obovate)',
        'Lanceolate': 'Hình mác (Lanceolate)',
        'Elliptic': 'Hình bầu dục (Elliptic)',
        'Linear': 'Hình dải (Tuyến) (Linear)',
        'Cordate': 'Hình tim (Cordate)',
        'Oblong': 'Hình thuôn (Oblong)',
        'Palmate': 'Hình chân vịt (Palmate)',
    },
    LEAF_MARGIN: {
        'Entire': 'Mép nguyên (Entire)',
        'Serrate': 'Răng cưa (Serrate)',
        'Dentate': 'Khía răng (Dentate)',
        'Lobed': 'Chia thùy (Lobed)',
        'Undulate': 'Lượn sóng (Undulate)',
        'Spiny': 'Có gai (Spiny)',
        'Rough': 'Sần sùi / Nhám (Rough)'
    },
    LEAF_ARRANGEMENT: {
        'Alternate': 'Mọc so le / Mọc cách (Alternate)',
        'Opposite': 'Mọc đối (Opposite)',              
        'Whorled': 'Mọc vòng (Whorled)',              
        'Spiral': 'Mọc xoắn ốc (Spiral)',
        'Basal': 'Mọc chụm gốc (Basal)',
        'Fascicled': 'Mọc thành bó (Fascicled)'
    },
    INFLORESCENCE: {
        'Solitary': 'Đơn độc (Solitary)',
        'Raceme': 'Chùm (Raceme)',
        'Panicle': 'Chùy / Cụm chùm (Panicle)',        
        'Umbel': 'Tán (Umbel)',
        'Spadix': 'Bông mo (Spadix)',
        'Cyme': 'Xim (Cyme)',
        'Spike': 'Bông (Spike)',
        'Capitulum': 'Đầu / Rổ (Capitulum)'             
    },
    PART_TYPE: {
        'Whole_Plant': 'Toàn cây',
        'Root': 'Rễ',
        'Stem': 'Thân',
        'Leaf': 'Lá',
        'Flower': 'Hoa',
        'Fruit': 'Quả',
        'Seed': 'Hạt'
    },
    VARIANT_TYPE: {
        'Variety': 'Thứ (Variety)',          
        'Forma': 'Dạng (Forma)',
        'Phenotype': 'Kiểu hình (Phenotype)',
        'Cultivar': 'Giống trồng (Cultivar)'
    },
    FRUIT_TYPE: {
        'Berry': 'Quả mọng (Berry)',
        'Drupe': 'Quả hạch (Drupe)',
        'Pome': 'Quả giả / Dạng táo (Pome)',
        'Capsule': 'Quả nang (Capsule)',
        'Achene': 'Quả bế (Achene)',
        'Nut': 'Quả kiên (Nut)',
        'Samara': 'Quả có cánh (Samara)',
        'Legume': 'Quả loại đậu (Legume)'
    },
    FRUIT_SURFACE: {
        'Smooth': 'Trơn (Smooth)',
        'Glabrous': 'Nhẵn / Không lông (Glabrous)',
        'Hairy': 'Có lông (Hairy)',
        'Spiny': 'Có gai (Spiny)',
        'Rough': 'Sần sùi / Nhám (Rough)'
    }
};

export { RAW_ENUMS, UI_MAPPINGS };