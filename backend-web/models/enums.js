// src/models/enums.js

// Định nghĩa các giá trị Enum chuẩn cho Database (Tiếng Anh)
const RAW_ENUMS = {
    LIFE_FORM: ['Tree', 'Shrub', 'Herb', 'Climber', 'Epiphyte'],
    DISTRIBUTION_STATUS: ['Native', 'Cultivated', 'Invasive'],
    STEM_TYPE: ['Woody', 'Herbaceous', 'Climbing', 'Shrubby'],
    STEM_SURFACE: ['Smooth', 'Hairy', 'Spiny'],
    LEAF_TYPE: ['Simple', 'Compound_Pinnate', 'Compound_Palmate'],
    LEAF_SHAPE: ['Ovate', 'Lanceolate', 'Elliptic', 'Linear'],
    LEAF_MARGIN: ['Entire', 'Serrate', 'Lobed'],
    LEAF_ARRANGEMENT: ['Alternate', 'Opposite', 'Whorled'],
    INFLORESCENCE: ['Umbel', 'Raceme', 'Panicle'],
    PART_TYPE: ['Leaf', 'Flower', 'Stem', 'Whole_Plant']
};

// Ánh xạ sang tiếng Việt và cấu trúc cho Frontend (Select option)
const UI_MAPPINGS = {
    LIFE_FORM: {
        'Tree': 'Cây gỗ',
        'Shrub': 'Cây bụi',
        'Herb': 'Cây thảo',
        'Climber': 'Dây leo',
        'Epiphyte': 'Cây phụ sinh'
    },
    LEAF_TYPE: {
        'Simple': 'Lá đơn',
        'Compound_Pinnate': 'Lá kép lông chim',
        'Compound_Palmate': 'Lá kép chân vịt'
    },
    LEAF_SHAPE: {
        'Ovate': 'Hình trứng',
        'Lanceolate': 'Hình mác',
        'Elliptic': 'Hình bầu dục',
        'Linear': 'Hình dải'
    },
    LEAF_MARGIN: {
        'Entire': 'Nguyên',
        'Serrate': 'Răng cưa',
        'Lobed': 'Chia thùy'
    },
    LEAF_ARRANGEMENT: {
        'Alternate': 'Xoè',
        'Opposite': 'Đối diện',
        'Whorled': 'Xoắn ốc'
    },
    INFLORESCENCE: {
        'Umbel': 'Tán',
        'Raceme': 'Chùm',
        'Panicle': 'Cụm chùm'
    },
    DISTRIBUTION_STATUS: {
        'Native': 'Bản địa',
        'Cultivated': 'Trồng trọt',
        'Invasive': 'Xâm lấn'
    },
    STEM_TYPE: {
        'Woody': 'Gỗ',
        'Herbaceous': 'Thảo mộc',
        'Climbing': 'Leo',
        'Shrubby': 'Bụi'
    },
    STEM_SURFACE: {
        'Smooth': 'Trơn nhẵn',
        'Hairy': 'Có lông',
        'Spiny': 'Có gai'
    },
    PART_TYPE: {
        'Leaf': 'Lá',
        'Flower': 'Hoa',
        'Stem': 'Thân',
        'Whole_Plant': 'Toàn cây'
    }
};

// Hàm helper để lấy danh sách Options cho Frontend
const getOptions = (key) => {
    if (!UI_MAPPINGS[key]) return [];
    return Object.entries(UI_MAPPINGS[key]).map(([value, label]) => ({ value, label }));
};

export { RAW_ENUMS, UI_MAPPINGS, getOptions };