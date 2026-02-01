import pool from './config/db.js';

const createTableQuery = `
    DROP TABLE IF EXISTS morphology_data CASCADE;
    DROP TABLE IF EXISTS species CASCADE;
    
    CREATE TABLE species (
        id SERIAL PRIMARY KEY,
        common_name VARCHAR(255) NOT NULL,
        english_name VARCHAR(255),
        scientific_name VARCHAR(255) UNIQUE,
        genus VARCHAR(100),
        family VARCHAR(100),
        description TEXT,
        uses TEXT,
        distribution TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Tạo bảng Morphology Data
    CREATE TABLE morphology_data (
        id SERIAL PRIMARY KEY,
        species_id INT REFERENCES species(id) ON DELETE CASCADE,
        leaf_type VARCHAR(50),
        leaf_shape VARCHAR(50),
        leaf_margin VARCHAR(50),
        avg_leaf_length FLOAT,
        avg_leaf_width FLOAT,
        avg_solidity FLOAT,
        flower_color VARCHAR(50),
        flower_petals_count INT,
        stem_type VARCHAR(50)
    );

    -- 3. Tạo Index (Dùng IF NOT EXISTS cho index để tránh lỗi trùng)
    CREATE INDEX IF NOT EXISTS idx_leaf_len ON morphology_data(avg_leaf_length);

`;
// --- DỮ LIỆU CHUẨN ---
// Lưu ý: Số liệu avg_leaf_length/width tính bằng cm.
// Solidity là ước lượng dựa trên hình dáng hình học của lá dùng cho CV.
const plantsData = [
    {
        common_name: "Chuối",
        english_name: "Banana",
        scientific_name: "Musa acuminata",
        genus: "Musa",
        family: "Musaceae",
        description: "Cây thân thảo khổng lồ, giả thân do bẹ lá tạo thành. Lá rất lớn, phiến lá hình chữ nhật hoặc hình elip dài. Quả mọng dài, cong.",
        uses: "Quả dùng làm thực phẩm (giàu kali), lá dùng gói bánh, thân dùng làm thức ăn gia súc.",
        distribution: "Phổ biến khắp vùng nhiệt đới, trồng nhiều tại Việt Nam.",
        morphology: {
            leaf_type: "Simple", // Lá đơn (nhưng hay bị rách)
            leaf_shape: "Oblong", // Hình thuôn dài
            leaf_margin: "Entire", // Nguyên (nhưng thường rách theo gân bên)
            avg_leaf_length: 150.0,
            avg_leaf_width: 40.0,
            avg_solidity: 0.95, // Cao nếu lá nguyên vẹn
            stem_type: "Herbaceous", // Thân thảo
            flower_color: "Purple/Red", // Bắp chuối màu đỏ tím
            flower_petals_count: 0 // Hoa không điển hình cánh rời
        }
    },
    {
        common_name: "Húng quế",
        english_name: "Basil",
        scientific_name: "Ocimum basilicum",
        genus: "Ocimum",
        family: "Lamiaceae",
        description: "Cây thảo sống hàng năm, thân vuông, phân nhánh nhiều. Lá mọc đối, hình trứng hoặc mũi mác, có mùi thơm đặc trưng.",
        uses: "Gia vị, dược liệu trị cảm cúm, đầy bụng.",
        distribution: "Trồng khắp Việt Nam làm rau gia vị.",
        morphology: {
            leaf_type: "Simple",
            leaf_shape: "Ovate", // Hình trứng
            leaf_margin: "Serrate", // Răng cưa nhẹ hoặc nguyên
            avg_leaf_length: 5.0,
            avg_leaf_width: 3.0,
            avg_solidity: 0.92,
            stem_type: "Herbaceous",
            flower_color: "White/Purple",
            flower_petals_count: 5 // Hoa môi
        }
    },
    {
        common_name: "Sắn (Khoai mì)",
        english_name: "Cassava",
        scientific_name: "Manihot esculenta",
        genus: "Manihot",
        family: "Euphorbiaceae",
        description: "Cây bụi lâu năm, rễ củ chứa nhiều tinh bột. Lá xẻ thùy chân vịt sâu (3-7 thùy).",
        uses: "Củ lấy tinh bột, làm thức ăn, sản xuất ethanol. Lá non có thể muối chua.",
        distribution: "Vùng trung du miền núi và đồng bằng.",
        morphology: {
            leaf_type: "Simple", // Lá đơn xẻ thùy
            leaf_shape: "Palmate", // Chân vịt
            leaf_margin: "Entire",
            avg_leaf_length: 18.0,
            avg_leaf_width: 15.0,
            avg_solidity: 0.65, // Thấp do xẻ thùy sâu
            stem_type: "Woody", // Thân gỗ nhỏ
            flower_color: "Yellow/Red",
            flower_petals_count: 5
        }
    },
    {
        common_name: "Ớt",
        english_name: "Chili",
        scientific_name: "Capsicum annuum",
        genus: "Capsicum",
        family: "Solanaceae",
        description: "Cây bụi nhỏ. Lá mọc so le, hình trứng hoặc mũi mác. Quả mọng, cay, có nhiều hình dạng và màu sắc khi chín.",
        uses: "Gia vị, thực phẩm, dược liệu (giảm đau).",
        distribution: "Trồng khắp cả nước.",
        morphology: {
            leaf_type: "Simple",
            leaf_shape: "Lanceolate", // Hình mác
            leaf_margin: "Entire",
            avg_leaf_length: 8.0,
            avg_leaf_width: 3.0,
            avg_solidity: 0.96,
            stem_type: "Herbaceous/Woody",
            flower_color: "White",
            flower_petals_count: 5
        }
    },
    {
        common_name: "Dừa",
        english_name: "Coconut",
        scientific_name: "Cocos nucifera",
        genus: "Cocos",
        family: "Arecaceae",
        description: "Cây thân cột cao, không phân nhánh. Lá tập trung ở đỉnh, xẻ lông chim kích thước lớn.",
        uses: "Lấy quả (nước, cùi), thân làm gỗ, lá lợp nhà.",
        distribution: "Vùng ven biển, Đồng bằng sông Cửu Long.",
        morphology: {
            leaf_type: "Compound", // Lá kép lông chim (Pinnate)
            leaf_shape: "Linear", // Lá chét hình dải
            leaf_margin: "Entire",
            avg_leaf_length: 400.0, // Cả tàu lá
            avg_leaf_width: 100.0,
            avg_solidity: 0.50, // Rất thấp nếu tính cả khoảng hở tàu lá
            stem_type: "Woody", // Thân cột
            flower_color: "Yellow",
            flower_petals_count: 3
        }
    },
    {
        common_name: "Ngô (Bắp)",
        english_name: "Corn",
        scientific_name: "Zea mays",
        genus: "Zea",
        family: "Poaceae",
        description: "Cây thảo lớn, thân đặc. Lá hình dải dài, mép lượn sóng, gân song song. Hoa đơn tính cùng gốc.",
        uses: "Lương thực, thức ăn chăn nuôi.",
        distribution: "Trồng nhiều ở vùng núi và đồng bằng.",
        morphology: {
            leaf_type: "Simple",
            leaf_shape: "Linear-Lanceolate", // Dải - Mác
            leaf_margin: "Undulate", // Lượn sóng
            avg_leaf_length: 70.0,
            avg_leaf_width: 8.0,
            avg_solidity: 0.90, // Cong nên solidity trong ảnh 2D có thể giảm
            stem_type: "Herbaceous", // Thân thảo (cứng)
            flower_color: "Yellow/White",
            flower_petals_count: 0
        }
    },
    {
        common_name: "Dưa leo (Dưa chuột)",
        english_name: "Cucumber",
        scientific_name: "Cucumis sativus",
        genus: "Cucumis",
        family: "Cucurbitaceae",
        description: "Cây thảo dây leo, thân có lông cứng, có tua cuốn. Lá hình tim hoặc chia thùy (3-5 thùy).",
        uses: "Thực phẩm, làm đẹp.",
        distribution: "Trồng rau màu khắp nơi.",
        morphology: {
            leaf_type: "Simple",
            leaf_shape: "Palmate/Cordate", // Chân vịt/Hình tim
            leaf_margin: "Serrate",
            avg_leaf_length: 15.0,
            avg_leaf_width: 15.0,
            avg_solidity: 0.85,
            stem_type: "Vine", // Thân leo
            flower_color: "Yellow",
            flower_petals_count: 5
        }
    },
    {
        common_name: "Cà tím",
        english_name: "Eggplant",
        scientific_name: "Solanum melongena",
        genus: "Solanum",
        family: "Solanaceae",
        description: "Cây bụi hàng năm. Lá lớn, hình trứng, có lông tơ, mép lượn sóng hoặc chia thùy nông.",
        uses: "Thực phẩm.",
        distribution: "Trồng phổ biến.",
        morphology: {
            leaf_type: "Simple",
            leaf_shape: "Ovate",
            leaf_margin: "Lobed/Sinuate", // Thùy nông/Lượn sóng
            avg_leaf_length: 15.0,
            avg_leaf_width: 10.0,
            avg_solidity: 0.88,
            stem_type: "Herbaceous",
            flower_color: "Purple",
            flower_petals_count: 5
        }
    },
    {
        common_name: "Gừng",
        english_name: "Ginger",
        scientific_name: "Zingiber officinale",
        genus: "Zingiber",
        family: "Zingiberaceae",
        description: "Cây thảo, thân rễ mập (củ). Lá mọc so le, không cuống, hình mác, xếp thành 2 dãy.",
        uses: "Gia vị, dược liệu (chống nôn, ấm bụng).",
        distribution: "Trồng nhiều ở đồi núi.",
        morphology: {
            leaf_type: "Simple",
            leaf_shape: "Lanceolate",
            leaf_margin: "Entire",
            avg_leaf_length: 20.0,
            avg_leaf_width: 2.5,
            avg_solidity: 0.95,
            stem_type: "Herbaceous",
            flower_color: "Yellow-Green",
            flower_petals_count: 3
        }
    },
    {
        common_name: "Ổi",
        english_name: "Guava",
        scientific_name: "Psidium guajava",
        genus: "Psidium",
        family: "Myrtaceae",
        description: "Cây gỗ nhỏ. Thân nhẵn bong mảng. Lá mọc đối, hình bầu dục, gân lá nổi rõ ở mặt dưới.",
        uses: "Ăn quả, lá dùng làm thuốc (chữa tiêu chảy).",
        distribution: "Rất phổ biến tại Việt Nam.",
        morphology: {
            leaf_type: "Simple",
            leaf_shape: "Elliptic/Oblong", // Bầu dục/Thuôn
            leaf_margin: "Entire",
            avg_leaf_length: 10.0,
            avg_leaf_width: 5.0,
            avg_solidity: 0.98,
            stem_type: "Woody",
            flower_color: "White",
            flower_petals_count: 5
        }
    },
    {
        common_name: "Mít",
        english_name: "Jackfruit",
        scientific_name: "Artocarpus heterophyllus",
        genus: "Artocarpus",
        family: "Moraceae",
        description: "Cây gỗ lớn. Lá dày, xanh đậm, hình bầu dục. Quả phức kích thước rất lớn, có gai.",
        uses: "Gỗ quý, quả ăn, hạt ăn được.",
        distribution: "Trồng nhiều ở vườn quê và đồn điền.",
        morphology: {
            leaf_type: "Simple",
            leaf_shape: "Obovate/Elliptic", // Trứng ngược/Bầu dục
            leaf_margin: "Entire",
            avg_leaf_length: 15.0,
            avg_leaf_width: 8.0,
            avg_solidity: 0.98,
            stem_type: "Woody",
            flower_color: "Green", // Hoa nhỏ tập hợp thành cụm
            flower_petals_count: 0
        }
    },
    {
        common_name: "Chanh (Chanh ta)",
        english_name: "Lemon", // Lưu ý: Lemon thường là C. limon, Chanh ta là C. aurantifolia
        scientific_name: "Citrus aurantifolia",
        genus: "Citrus",
        family: "Rutaceae",
        description: "Cây gỗ nhỏ, thân có gai. Lá hình trứng, mép có răng cưa nhỏ, cuống lá có cánh hẹp. Quả vỏ xanh, vị chua.",
        uses: "Gia vị, nước giải khát, dược liệu.",
        distribution: "Rất phổ biến.",
        morphology: {
            leaf_type: "Simple",
            leaf_shape: "Ovate",
            leaf_margin: "Crenulate", // Răng cưa tròn nhỏ
            avg_leaf_length: 6.0,
            avg_leaf_width: 3.5,
            avg_solidity: 0.95,
            stem_type: "Woody",
            flower_color: "White",
            flower_petals_count: 5
        }
    },
    {
        common_name: "Xoài",
        english_name: "Mango",
        scientific_name: "Mangifera indica",
        genus: "Mangifera",
        family: "Anacardiaceae",
        description: "Cây gỗ lớn, tán rộng. Lá đơn, nguyên, mọc so le, hình thuôn mũi mác, mép lượn sóng.",
        uses: "Ăn quả (xanh và chín), cây bóng mát.",
        distribution: "Đặc sản nhiều vùng (Hòa Lộc, Cát Chu).",
        morphology: {
            leaf_type: "Simple",
            leaf_shape: "Lanceolate/Oblong",
            leaf_margin: "Entire/Undulate",
            avg_leaf_length: 25.0,
            avg_leaf_width: 6.0,
            avg_solidity: 0.94,
            stem_type: "Woody",
            flower_color: "Yellow-Red",
            flower_petals_count: 5
        }
    },
    {
        common_name: "Cam",
        english_name: "Orange",
        scientific_name: "Citrus sinensis",
        genus: "Citrus",
        family: "Rutaceae",
        description: "Cây gỗ nhỏ, có gai. Lá hình trứng, cuống có cánh nhỏ. Quả hình cầu, vỏ cam, tép chứa nhiều nước.",
        uses: "Ăn quả, lấy nước ép giàu Vitamin C.",
        distribution: "Vinh, Cao Phong, Hà Giang.",
        morphology: {
            leaf_type: "Simple",
            leaf_shape: "Ovate/Elliptic",
            leaf_margin: "Crenulate",
            avg_leaf_length: 8.0,
            avg_leaf_width: 4.0,
            avg_solidity: 0.95,
            stem_type: "Woody",
            flower_color: "White",
            flower_petals_count: 5
        }
    },
    {
        common_name: "Đu đủ",
        english_name: "Papaya",
        scientific_name: "Carica papaya",
        genus: "Carica",
        family: "Caricaceae",
        description: "Cây thân thảo lớn, thân xốp, ít phân nhánh, có sẹo lá. Lá to, xẻ thùy chân vịt sâu, cuống rỗng.",
        uses: "Quả ăn, nhựa (papain) làm mềm thịt.",
        distribution: "Phổ biến.",
        morphology: {
            leaf_type: "Simple", // Nhưng xẻ thùy sâu
            leaf_shape: "Palmate", // Chân vịt
            leaf_margin: "Lobed",
            avg_leaf_length: 40.0,
            avg_leaf_width: 40.0,
            avg_solidity: 0.60, // Rất thấp do xẻ thùy
            stem_type: "Herbaceous", // Thân thảo hóa gỗ
            flower_color: "Cream/Yellow",
            flower_petals_count: 5
        }
    },
    {
        common_name: "Lựu",
        english_name: "Pomegranate",
        scientific_name: "Punica granatum",
        genus: "Punica",
        family: "Lythraceae",
        description: "Cây bụi hoặc gỗ nhỏ. Lá mọc đối hoặc thành chùm, hình giáo hẹp, bóng láng.",
        uses: "Ăn quả, làm cảnh.",
        distribution: "Trồng rải rác làm cảnh.",
        morphology: {
            leaf_type: "Simple",
            leaf_shape: "Oblanceolate", // Hình giáo ngược
            leaf_margin: "Entire",
            avg_leaf_length: 5.0,
            avg_leaf_width: 1.5,
            avg_solidity: 0.96,
            stem_type: "Woody",
            flower_color: "Red/Orange",
            flower_petals_count: 6
        }
    },
    {
        common_name: "Hoa hồng",
        english_name: "Rose",
        scientific_name: "Rosa sp.", // Dùng sp. vì có nhiều loài lai
        genus: "Rosa",
        family: "Rosaceae",
        description: "Cây bụi hoặc leo, thân có gai. Lá kép lông chim lẻ (3-7 lá chét), mép có răng cưa.",
        uses: "Làm cảnh, chiết xuất tinh dầu, trà.",
        distribution: "Đà Lạt, Sapa, làng hoa.",
        morphology: {
            leaf_type: "Compound", // Lá kép
            leaf_shape: "Ovate", // Hình dáng lá chét
            leaf_margin: "Serrate", // Răng cưa
            avg_leaf_length: 5.0, // Kích thước 1 lá chét
            avg_leaf_width: 3.0,
            avg_solidity: 0.85, // Răng cưa làm giảm độ đặc
            stem_type: "Woody",
            flower_color: "Various",
            flower_petals_count: 20 // Số nhiều (kép)
        }
    },
    {
        common_name: "Đậu nành (Đậu tương)",
        english_name: "Soybean",
        scientific_name: "Glycine max",
        genus: "Glycine",
        family: "Fabaceae",
        description: "Cây thảo hàng năm, toàn thân có lông. Lá kép có 3 lá chét. Hoa nhỏ màu tím hoặc trắng.",
        uses: "Lương thực (đậu phụ, sữa đậu nành), ép dầu.",
        distribution: "Đồng bằng sông Hồng, Đông Nam Bộ.",
        morphology: {
            leaf_type: "Compound", // Kép 3 lá chét
            leaf_shape: "Ovate",
            leaf_margin: "Entire",
            avg_leaf_length: 8.0,
            avg_leaf_width: 5.0,
            avg_solidity: 0.90,
            stem_type: "Herbaceous",
            flower_color: "Purple/White",
            flower_petals_count: 5
        }
    },
    {
        common_name: "Cà chua",
        english_name: "Tomato",
        scientific_name: "Solanum lycopersicum",
        genus: "Solanum",
        family: "Solanaceae",
        description: "Cây thảo, thân có lông dính. Lá kép lông chim, các lá chét có răng cưa hoặc thùy.",
        uses: "Thực phẩm phổ biến.",
        distribution: "Trồng rau màu.",
        morphology: {
            leaf_type: "Compound",
            leaf_shape: "Ovate/Lobed",
            leaf_margin: "Dentate/Lobed",
            avg_leaf_length: 20.0, // Cả lá kép lớn
            avg_leaf_width: 15.0,
            avg_solidity: 0.55, // Thấp do lá kép xẻ
            stem_type: "Herbaceous",
            flower_color: "Yellow",
            flower_petals_count: 5
        }
    },
    {
        common_name: "Dưa hấu",
        english_name: "Watermelon",
        scientific_name: "Citrullus lanatus",
        genus: "Citrullus",
        family: "Cucurbitaceae",
        description: "Cây dây leo bò sát đất, có tua cuốn. Lá xẻ thùy sâu (3-5 thùy), có lông nhám.",
        uses: "Ăn quả giải khát.",
        distribution: "Vùng đất cát ven biển, đồng bằng.",
        morphology: {
            leaf_type: "Simple",
            leaf_shape: "Palmate/Lobed", // Xẻ thùy sâu
            leaf_margin: "Lobed",
            avg_leaf_length: 15.0,
            avg_leaf_width: 12.0,
            avg_solidity: 0.60,
            stem_type: "Vine",
            flower_color: "Yellow",
            flower_petals_count: 5
        }
    }
];

const seedData = async () => {
    const client = await pool.connect();
    
    try {
        console.log("🚀 Starting initialization...");
        
        // --- BƯỚC QUAN TRỌNG: TẠO BẢNG NẾU CHƯA CÓ ---
        console.log("🛠  Checking/Creating tables...");
        await client.query(createTableQuery);
        console.log("✅ Tables checked/created.");

        // Bắt đầu Transaction để đổ dữ liệu
        await client.query('BEGIN');

        // 3. Loop & Insert
        for (const plant of plantsData) {
            // Insert Species
            const speciesRes = await client.query(`
                INSERT INTO species 
                (common_name, english_name, scientific_name, genus, family, description, uses, distribution)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id;
            `, [
                plant.common_name, 
                plant.english_name, 
                plant.scientific_name, 
                plant.genus, 
                plant.family, 
                plant.description, 
                plant.uses, 
                plant.distribution
            ]);

            const speciesId = speciesRes.rows[0].id;

            // Insert Morphology Data
            await client.query(`
                INSERT INTO morphology_data 
                (species_id, leaf_type, leaf_shape, leaf_margin, avg_leaf_length, avg_leaf_width, avg_solidity, flower_color, flower_petals_count, stem_type)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `, [
                speciesId,
                plant.morphology.leaf_type,
                plant.morphology.leaf_shape,
                plant.morphology.leaf_margin,
                plant.morphology.avg_leaf_length,
                plant.morphology.avg_leaf_width,
                plant.morphology.avg_solidity,
                plant.morphology.flower_color,
                plant.morphology.flower_petals_count,
                plant.morphology.stem_type
            ]);

            console.log(`✅ Seeded: ${plant.common_name} (${plant.scientific_name})`);
        }

        // 4. Commit Transaction
        await client.query('COMMIT');
        console.log("🎉 Seeding completed successfully!");

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    } finally {
        client.release();
        // Close pool to finish script
        await pool.end(); 
    }
};

// Run the function
seedData();