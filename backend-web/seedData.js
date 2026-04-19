export const provincesData = [
    { province_name: "Thành phố Hà Nội", country: "Việt Nam" },
    { province_name: "Cao Bằng", country: "Việt Nam" },
    { province_name: "Tuyên Quang", country: "Việt Nam" },
    { province_name: "Điện Biên", country: "Việt Nam" },
    { province_name: "Lai Châu", country: "Việt Nam" },
    { province_name: "Sơn La", country: "Việt Nam" },
    { province_name: "Lào Cai", country: "Việt Nam" },
    { province_name: "Thái Nguyên", country: "Việt Nam" },
    { province_name: "Lạng Sơn", country: "Việt Nam" },
    { province_name: "Quảng Ninh", country: "Việt Nam" },
    { province_name: "Bắc Ninh", country: "Việt Nam" },
    { province_name: "Phú Thọ", country: "Việt Nam" },
    { province_name: "Thành phố Hải Phòng", country: "Việt Nam" },
    { province_name: "Hưng Yên", country: "Việt Nam" },
    { province_name: "Ninh Bình", country: "Việt Nam" },
    { province_name: "Thanh Hóa", country: "Việt Nam" },
    { province_name: "Nghệ An", country: "Việt Nam" },
    { province_name: "Hà Tĩnh", country: "Việt Nam" },
    { province_name: "Quảng Trị", country: "Việt Nam" },
    { province_name: "Thành phố Huế", country: "Việt Nam" },
    { province_name: "Thành phố Đà Nẵng", country: "Việt Nam" },
    { province_name: "Quảng Ngãi", country: "Việt Nam" },
    { province_name: "Gia Lai", country: "Việt Nam" },
    { province_name: "Khánh Hòa", country: "Việt Nam" },
    { province_name: "Đắk Lắk", country: "Việt Nam" },
    { province_name: "Lâm Đồng", country: "Việt Nam" },
    { province_name: "Đồng Nai", country: "Việt Nam" },
    { province_name: "Thành phố Hồ Chí Minh", country: "Việt Nam" },
    { province_name: "Tây Ninh", country: "Việt Nam" },
    { province_name: "Đồng Tháp", country: "Việt Nam" },
    { province_name: "Vĩnh Long", country: "Việt Nam" },
    { province_name: "An Giang", country: "Việt Nam" },
    { province_name: "Thành phố Cần Thơ", country: "Việt Nam" },
    { province_name: "Cà Mau", country: "Việt Nam" }
];

export const plantData = [
  {
    "family": { "scientific_name": "Musaceae", "vietnamese_name": "Họ Chuối", "authority": "Juss." },
    "genus": { "scientific_name": "Musa", "vietnamese_name": "Chi Chuối", "authority": "L." },
    "species": { 
      "scientific_name": "Musa paradisiaca", 
      "vietnamese_name": "Chuối trồng", 
      "synonyms": "Musa x paradisiaca", 
      "authority": "L.",
      "uses": "Thực phẩm (quả chín ăn tươi, quả xanh chế biến, bắp chuối làm rau), nông nghiệp (thân làm thức ăn chăn nuôi, lá gói bánh), dược liệu (nhựa và củ trị sỏi thận, dạ dày)."
    },
    "varieties": [
      {
        "common_name": "Chuối sứ (Chuối tây)", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thảo lớn, có thân giả tạo bởi bẹ lá ốp vào nhau. Trái to, ngắn, vỏ dầy.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Oblong", "arrangement": "Spiral", "margin": "Entire", "length_min": 150, "length_max": 200, "width_min": 40, "width_max": 60, "petiole_length": 50 },
        "morphology_stem": { "stem_type": "Fleshy", "surface": "Smooth", "color": "Xanh lơ", "height_min": 2.5, "height_max": 4 },
        "morphology_flower": { "inflorescence": "Spadix", "color": "Đỏ tía", "petal_count": 0 },
        "distributions": [{ "province_name": "Đồng Nai", "status": "Cultivated", "description": "Trồng phổ biến ở vùng phù sa cổ, đất thịt nhẹ tơi xốp." }]
      },
      {
        "common_name": "Chuối tiêu", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "distinctive_feature": "Quả thon dài, uốn cong, vỏ mỏng, khi chín có đốm đen (trứng cuốc). Cây thấp hơn chuối sứ.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Oblong", "arrangement": "Spiral", "margin": "Entire", "length_min": 120, "length_max": 180, "width_min": 35, "width_max": 50, "petiole_length": 40 },
        "morphology_stem": { "stem_type": "Fleshy", "surface": "Smooth", "color": "Xanh nhạt", "height_min": 1.5, "height_max": 2.5 },
        "morphology_flower": { "inflorescence": "Spadix", "color": "Đỏ thẫm", "petal_count": 0 },
        "distributions": [{ "province_name": "Hưng Yên", "status": "Cultivated", "description": "Trồng nhiều ở vùng đồng bằng Bắc Bộ, ưa đất phù sa ven sông Hồng." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Lamiaceae", "vietnamese_name": "Họ Hoa môi", "authority": "Martinov" },
    "genus": { "scientific_name": "Ocimum", "vietnamese_name": "Chi Hương nhu", "authority": "L." },
    "species": { 
      "scientific_name": "Ocimum basilicum", 
      "vietnamese_name": "Húng quế", 
      "synonyms": "Ocimum thyrsiflorum", 
      "authority": "L.",
      "uses": "Gia vị (ăn sống, phở, nêm canh), dược liệu (chứa nhiều tinh dầu, giải cảm, trị ho, kích thích tiêu hóa, diệt khuẩn)."
    },
    "varieties": [
      {
        "common_name": "Húng quế (Húng chó)", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thảo hằng năm, toàn cây có mùi thơm đặc trưng, chứa nhiều tinh dầu.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Opposite", "margin": "Serrate", "length_min": 3, "length_max": 5, "width_min": 1.5, "width_max": 2.5, "petiole_length": 1.5 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Glabrous", "color": "Tím đỏ hoặc xanh lục", "height_min": 0.3, "height_max": 0.5 },
        "morphology_flower": { "inflorescence": "Raceme", "color": "Trắng đến tía", "petal_count": 5 },
        "distributions": [{ "province_name": "Thành phố Hà Nội", "status": "Cultivated", "description": "Trồng làm rau thơm gia vị khắp các vườn gia đình." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Solanaceae", "vietnamese_name": "Họ Cà", "authority": "Juss." },
    "genus": { "scientific_name": "Capsicum", "vietnamese_name": "Chi Ớt", "authority": "L." },
    "species": { 
      "scientific_name": "Capsicum frutescens", 
      "vietnamese_name": "Ớt sừng trâu (Ớt chỉ thiên)", 
      "synonyms": "Capsicum baccatum", 
      "authority": "L.",
      "uses": "Gia vị (tạo vị cay cay), công nghiệp (chiết xuất capsaicin làm thuốc), dược liệu (tán hàn, giảm đau nhức cơ xương khớp)."
    },
    "varieties": [
      {
        "common_name": "Ớt chỉ thiên", "variant_type": "Cultivar", "life_form": "Shrub", "is_flowering": true, "is_fruiting": true,
        "description": "Cây bụi nhỏ, phân cành nhiều. Quả nhỏ, mọc ngược chỉ lên trời, rất cay.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Lanceolate", "arrangement": "Alternate", "margin": "Entire", "length_min": 4, "length_max": 8, "width_min": 2, "width_max": 3, "petiole_length": 2 },
        "morphology_stem": { "stem_type": "Shrubby", "surface": "Smooth", "color": "Xanh lục", "height_min": 0.5, "height_max": 1.2 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Trắng xanh", "petal_count": 5 },
        "distributions": [{ "province_name": "Quảng Ngãi", "status": "Cultivated", "description": "Thích nghi tốt với đất tơi xốp, trồng nhiều ở miền Trung." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Poaceae", "vietnamese_name": "Họ Lúa (Hòa thảo)", "authority": "Barnhart" },
    "genus": { "scientific_name": "Zea", "vietnamese_name": "Chi Ngô", "authority": "L." },
    "species": { 
      "scientific_name": "Zea mays", 
      "vietnamese_name": "Ngô (Bắp)", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Lương thực chính (chứa nhiều tinh bột), thức ăn chăn nuôi, công nghiệp (làm màng bọc sinh học, cồn), dược liệu (râu ngô có tác dụng lợi tiểu, thanh nhiệt)."
    },
    "varieties": [
      {
        "common_name": "Ngô nếp", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Thân mập, không phân nhánh. Hạt có độ dẻo cao do chứa nhiều amylopectin.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Linear", "arrangement": "Alternate", "margin": "Undulate", "length_min": 50, "length_max": 90, "width_min": 5, "width_max": 9, "petiole_length": 0 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Smooth", "color": "Xanh lục", "height_min": 1.5, "height_max": 2.5 },
        "morphology_flower": { "inflorescence": "Panicle", "color": "Vàng nhạt (Cờ ngô)", "petal_count": 0 },
        "distributions": [{ "province_name": "Sơn La", "status": "Cultivated", "description": "Trồng nhiều trên nương rẫy, đất dốc đồi núi." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Cucurbitaceae", "vietnamese_name": "Họ Bầu bí", "authority": "Juss." },
    "genus": { "scientific_name": "Cucumis", "vietnamese_name": "Chi Dưa", "authority": "L." },
    "species": { 
      "scientific_name": "Cucumis sativus", 
      "vietnamese_name": "Dưa leo (Dưa chuột)", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Thực phẩm (ăn sống, salad, muối chua), mỹ phẩm (làm mặt nạ dưỡng ẩm, làm dịu da), dược liệu (thanh nhiệt, giải độc)."
    },
    "varieties": [
      {
        "common_name": "Dưa leo", "variant_type": "Cultivar", "life_form": "Climber", "is_flowering": true, "is_fruiting": true,
        "description": "Cây dây leo có tua cuốn, thân có lông nháp. Quả hình trụ dài.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Cordate", "arrangement": "Alternate", "margin": "Dentate", "length_min": 8, "length_max": 15, "width_min": 8, "width_max": 14, "petiole_length": 10 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Hairy", "color": "Xanh lục", "height_min": 1.5, "height_max": 3.0 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Vàng", "petal_count": 5 },
        "distributions": [{ "province_name": "Bắc Ninh", "status": "Cultivated", "description": "Bắc Giang cũ. Cây trồng ngắn ngày ưa thời tiết ấm, trồng leo giàn." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Solanaceae", "vietnamese_name": "Họ Cà", "authority": "Juss." },
    "genus": { "scientific_name": "Solanum", "vietnamese_name": "Chi Cà", "authority": "L." },
    "species": { 
      "scientific_name": "Solanum melongena", 
      "vietnamese_name": "Cà tím", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Thực phẩm (chế biến món ăn, chứa nhiều chất xơ, vitamin và chất chống oxy hóa anthocyanin tốt cho tim mạch)."
    },
    "varieties": [
      {
        "common_name": "Cà tím quả dài", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thảo mọc đứng, có lông hình sao. Quả mọng dài, vỏ màu tím bóng.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Alternate", "margin": "Lobed", "length_min": 10, "length_max": 20, "width_min": 5, "width_max": 10, "petiole_length": 6 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Hairy", "color": "Tím tía hoặc Xanh", "height_min": 0.6, "height_max": 1.0 },
        "morphology_flower": { "inflorescence": "Cyme", "color": "Tím", "petal_count": 5 },
        "distributions": [{ "province_name": "Thành phố Hải Phòng", "status": "Cultivated", "description": "Hải Dương cũ. Trồng ở vùng đồng bằng màu mỡ, ưa sáng." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Zingiberaceae", "vietnamese_name": "Họ Gừng", "authority": "Martinov" },
    "genus": { "scientific_name": "Zingiber", "vietnamese_name": "Chi Gừng", "authority": "Boehm." },
    "species": { 
      "scientific_name": "Zingiber officinale", 
      "vietnamese_name": "Gừng", 
      "synonyms": "Amomum zingiber", 
      "authority": "Roscoe",
      "uses": "Gia vị thiết yếu, dược liệu quan trọng (ôn trung, tán hàn, kích thích tiêu hóa, trị buồn nôn, cảm mạo), công nghiệp (chiết xuất tinh dầu, thực phẩm chức năng)."
    },
    "varieties": [
      {
        "common_name": "Gừng trâu", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": false, "is_fruiting": false,
        "description": "Cây thân thảo có củ (thân rễ) phát triển to mập. Ít khi thấy ra hoa.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Lanceolate", "arrangement": "Alternate", "margin": "Entire", "length_min": 15, "length_max": 25, "width_min": 2, "width_max": 3, "petiole_length": 0.5 },
        "morphology_stem": { "stem_type": "Rhizome", "surface": "Smooth", "color": "Vàng nhạt (phần củ)", "height_min": 0.5, "height_max": 1.0 },
        "morphology_flower": { "inflorescence": "Spike", "color": "Xanh vàng", "petal_count": 3 },
        "distributions": [{ "province_name": "Thanh Hóa", "status": "Cultivated", "description": "Ưa bóng râm một phần, củ to nhiều nước." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Myrtaceae", "vietnamese_name": "Họ Sim", "authority": "Juss." },
    "genus": { "scientific_name": "Psidium", "vietnamese_name": "Chi Ổi", "authority": "L." },
    "species": { 
      "scientific_name": "Psidium guajava", 
      "vietnamese_name": "Ổi", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Thực phẩm (quả tươi dồi dào vitamin C và chất xơ), dược liệu (lá ổi chứa tanin giúp trị tiêu chảy, kháng khuẩn, viêm ruột)."
    },
    "varieties": [
      {
        "common_name": "Ổi găng", "variant_type": "Cultivar", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thân gỗ nhỏ, vỏ thân nhẵn dễ bong tróc. Quả nhỏ, vị chát ngọt, cùi giòn.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Elliptic", "arrangement": "Opposite", "margin": "Entire", "length_min": 5, "length_max": 10, "width_min": 3, "width_max": 5, "petiole_length": 1 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Smooth", "color": "Nâu nhạt", "height_min": 2, "height_max": 6 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Trắng", "petal_count": 5 },
        "distributions": [{ "province_name": "Thành phố Hà Nội", "status": "Cultivated", "description": "Trồng phổ biến ven các làng quê Bắc Bộ." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Rutaceae", "vietnamese_name": "Họ Cam chanh", "authority": "Juss." },
    "genus": { "scientific_name": "Citrus", "vietnamese_name": "Chi Cam chanh", "authority": "L." },
    "species": { 
      "scientific_name": "Citrus aurantiifolia", 
      "vietnamese_name": "Chanh ta", 
      "synonyms": "Limonia aurantiifolia", 
      "authority": "(Christm.) Swingle",
      "uses": "Gia vị, thực phẩm (nước giải khát giàu vitamin C), dược liệu (trị ho, giải độc, thanh nhiệt), công nghiệp (chiết xuất tinh dầu, mỹ phẩm, chất tẩy rửa hữu cơ)."
    },
    "varieties": [
      {
        "common_name": "Chanh giấy", "variant_type": "Cultivar", "life_form": "Shrub", "is_flowering": true, "is_fruiting": true,
        "description": "Cây bụi gai nhiều, vỏ mỏng nhiều nước. Rất thơm.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Alternate", "margin": "Serrate", "length_min": 4, "length_max": 8, "width_min": 2, "width_max": 4, "petiole_length": 1.5 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Spiny", "color": "Xanh đến Nâu xám", "height_min": 1.5, "height_max": 3 },
        "morphology_flower": { "inflorescence": "Raceme", "color": "Trắng phớt tím", "petal_count": 5 },
        "distributions": [{ "province_name": "Vĩnh Long", "status": "Cultivated", "description": "Bến Tre cũ. Thích hợp trồng ở vùng đồng bằng sông Cửu Long, chịu phèn nhẹ." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Anacardiaceae", "vietnamese_name": "Họ Đào lộn hột", "authority": "R.Br." },
    "genus": { "scientific_name": "Mangifera", "vietnamese_name": "Chi Xoài", "authority": "L." },
    "species": { 
      "scientific_name": "Mangifera indica", 
      "vietnamese_name": "Xoài", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Thực phẩm (quả ăn tươi có giá trị kinh tế thương mại cao), cảnh quan (trồng lấy bóng mát), mộc (lấy gỗ cây già)."
    },
    "varieties": [
      {
        "common_name": "Xoài cát Hòa Lộc", "variant_type": "Cultivar", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây gỗ lớn. Trái thon dài, khi chín màu vàng ươm, thịt chắc, ngọt lịm và rất thơm.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Lanceolate", "arrangement": "Alternate", "margin": "Entire", "length_min": 15, "length_max": 30, "width_min": 3, "width_max": 7, "petiole_length": 4 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Xám đen", "height_min": 5, "height_max": 15 },
        "morphology_flower": { "inflorescence": "Panicle", "color": "Vàng xanh nhạt", "petal_count": 5 },
        "distributions": [{ "province_name": "Đồng Tháp", "status": "Cultivated", "description": "Đặc sản của vùng Cái Bè, Tiền Giang, ưa đất phù sa ven sông." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Caricaceae", "vietnamese_name": "Họ Đu đủ", "authority": "Dumort." },
    "genus": { "scientific_name": "Carica", "vietnamese_name": "Chi Đu đủ", "authority": "L." },
    "species": { 
      "scientific_name": "Carica papaya", 
      "vietnamese_name": "Đu đủ", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Thực phẩm (quả chín ăn tươi, quả xanh chế biến món ăn), dược liệu (hoa và lá hỗ trợ điều trị u bướu, ho), công nghiệp (chiết xuất enzyme papain từ nhựa để làm mềm thịt và ứng dụng y học)."
    },
    "varieties": [
      {
        "common_name": "Đu đủ ruột đỏ", "variant_type": "Cultivar", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thân mập, vỏ xẹo rụng lá, không nhánh. Quả khi chín ruột có màu đỏ cam.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Palmate", "arrangement": "Spiral", "margin": "Lobed", "length_min": 30, "length_max": 60, "width_min": 30, "width_max": 60, "petiole_length": 50 },
        "morphology_stem": { "stem_type": "Fleshy", "surface": "Smooth", "color": "Xanh xám", "height_min": 3, "height_max": 8 },
        "morphology_flower": { "inflorescence": "Raceme", "color": "Trắng nhạt", "petal_count": 5 },
        "distributions": [{ "province_name": "Vĩnh Long", "status": "Cultivated", "description": "Phát triển mạnh ở nơi đất ẩm nhưng thoát nước cực tốt." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Rosaceae", "vietnamese_name": "Họ Hoa hồng", "authority": "Juss." },
    "genus": { "scientific_name": "Rosa", "vietnamese_name": "Chi Hoa hồng", "authority": "L." },
    "species": { 
      "scientific_name": "Rosa chinensis", 
      "vietnamese_name": "Hoa hồng nhung", 
      "synonyms": "Rosa indica", 
      "authority": "Jacq.",
      "uses": "Cảnh quan (hoa trang trí, tạo cảnh quan sân vườn), mỹ phẩm (chiết xuất tinh dầu, nước hoa hồng dưỡng da), dược liệu (cánh hoa làm trà an thần, thanh nhiệt)."
    },
    "varieties": [
      {
        "common_name": "Hồng nhung ta", "variant_type": "Cultivar", "life_form": "Shrub", "is_flowering": true, "is_fruiting": false,
        "description": "Cây bụi, thân cành có gai cong nhọn. Hoa màu đỏ thẫm, cánh dày, hương thơm đậm.",
        "morphology_leaf": { "leaf_type": "Compound_Pinnate", "shape": "Ovate", "arrangement": "Alternate", "margin": "Serrate", "length_min": 5, "length_max": 10, "width_min": 3, "width_max": 6, "petiole_length": 2 },
        "morphology_stem": { "stem_type": "Shrubby", "surface": "Spiny", "color": "Xanh sẫm", "height_min": 0.5, "height_max": 1.5 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Đỏ thẫm", "petal_count": 30 },
        "distributions": [{ "province_name": "Lâm Đồng", "status": "Cultivated", "description": "Đà Lạt cũ. Sinh trưởng tốt nhất ở khí hậu ôn đới mát mẻ." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Solanaceae", "vietnamese_name": "Họ Cà", "authority": "Juss." },
    "genus": { "scientific_name": "Solanum", "vietnamese_name": "Chi Cà", "authority": "L." },
    "species": { 
      "scientific_name": "Solanum lycopersicum", 
      "vietnamese_name": "Cà chua", 
      "synonyms": "Lycopersicon esculentum", 
      "authority": "L.",
      "uses": "Thực phẩm (quả dồi dào vitamin C, A và chất chống oxy hóa Lycopene), công nghiệp thực phẩm (làm sốt, tương cà), mỹ phẩm (mặt nạ dưỡng da)."
    },
    "varieties": [
      {
        "common_name": "Cà chua múi", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Thân thảo, yếu, phủ đầy lông tơ nhầy. Quả chia thành nhiều múi mọng nước.",
        "morphology_leaf": { "leaf_type": "Compound_Pinnate", "shape": "Ovate", "arrangement": "Alternate", "margin": "Dentate", "length_min": 10, "length_max": 25, "width_min": 5, "width_max": 15, "petiole_length": 5 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Hairy", "color": "Xanh lục", "height_min": 0.6, "height_max": 1.5 },
        "morphology_flower": { "inflorescence": "Cyme", "color": "Vàng", "petal_count": 5 },
        "distributions": [{ "province_name": "Lâm Đồng", "status": "Cultivated", "description": "Trồng trong nhà màng, nhà kính ở cao nguyên để cho năng suất cao." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Araliaceae", "vietnamese_name": "Họ Nhân sâm", "authority": "Juss." },
    "genus": { "scientific_name": "Polyscias", "vietnamese_name": "Chi Đinh lăng", "authority": "J.R.Forst. & G.Forst." },
    "species": { 
      "scientific_name": "Polyscias fruticosa", 
      "vietnamese_name": "Đinh lăng lá nhỏ", 
      "synonyms": "Panax fruticosus", 
      "authority": "(L.) Harms",
      "uses": "Dược liệu quý (rễ củ phơi khô ngâm rượu làm thuốc bổ được ví như nhân sâm người nghèo, lá giúp lợi sữa, chữa ho và chống dị ứng), cảnh quan (cây bonsai, trang trí nội thất), gia vị (ăn kèm gỏi cá)."
    },
    "varieties": [
      {
        "common_name": "Đinh lăng tẻ (Đinh lăng lá nhỏ)", "variant_type": "Cultivar", "life_form": "Shrub", "is_flowering": true, "is_fruiting": false,
        "description": "Cây bụi, lá kép xẻ lông chim rất sâu (2-3 lần), rễ củ có tác dụng dược lý giống nhân sâm.",
        "morphology_leaf": { "leaf_type": "Bipinnate", "shape": "Ovate", "arrangement": "Alternate", "margin": "Serrate", "length_min": 20, "length_max": 40, "width_min": 15, "width_max": 30, "petiole_length": 15 },
        "morphology_stem": { "stem_type": "Shrubby", "surface": "Smooth", "color": "Xám nhạt", "height_min": 0.8, "height_max": 1.5 },
        "morphology_flower": { "inflorescence": "Panicle", "color": "Lục nhạt", "petal_count": 5 },
        "distributions": [{ "province_name": "Ninh Bình", "status": "Cultivated", "description": "Nam Định cũ. Trồng nhiều ở vùng Giao Thủy, Hải Hậu làm dược liệu quý." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Rutaceae", "vietnamese_name": "Họ Cam chanh", "authority": "Juss." },
    "genus": { "scientific_name": "Citrus", "vietnamese_name": "Chi Cam chanh", "authority": "L." },
    "species": { 
      "scientific_name": "Citrus sinensis", 
      "vietnamese_name": "Cam ngọt", 
      "synonyms": "Citrus aurantium var. sinensis", 
      "authority": "Osbeck",
      "uses": "Thực phẩm (quả ăn tươi, vắt nước rất dồi dào vitamin C), công nghiệp (chiết xuất tinh dầu từ vỏ), dược liệu (vỏ cam chữa ho, kích thích tiêu hóa)."
    },
    "varieties": [
      {
        "common_name": "Cam sành", "variant_type": "Cultivar", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây gỗ nhỏ, vỏ quả sần sùi, màu xanh khi chín có thể hơi vàng, múi mọng nước, vị chua ngọt.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Alternate", "margin": "Serrate", "length_min": 6, "length_max": 10, "width_min": 3, "width_max": 5, "petiole_length": 1.5 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Smooth", "color": "Xám lục", "height_min": 2.5, "height_max": 5.0 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Trắng", "petal_count": 5 },
        "distributions": [{ "province_name": "Tuyên Quang", "status": "Cultivated", "description": "Hà Giang cũ. Đặc sản vùng Bắc Quang, trồng trên vùng đồi núi đất tơi xốp." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Rutaceae", "vietnamese_name": "Họ Cam chanh", "authority": "Juss." },
    "genus": { "scientific_name": "Citrus", "vietnamese_name": "Chi Cam chanh", "authority": "L." },
    "species": { 
      "scientific_name": "Citrus maxima", 
      "vietnamese_name": "Bưởi", 
      "synonyms": "Citrus grandis", 
      "authority": "(L.) Osbeck",
      "uses": "Thực phẩm (trái cây ăn tươi, cùi bưởi nấu chè), dược liệu (hoa bưởi ướp trà, vỏ bưởi chứa tinh dầu mọc tóc, trị ho, giảm béo), cảnh quan."
    },
    "varieties": [
      {
        "common_name": "Bưởi Năm Roi", "variant_type": "Cultivar", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "distinctive_feature": "Quả có hình quả lê, không hạt hoặc rất ít hạt, múi tróc, vị ngọt thanh.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Elliptic", "arrangement": "Alternate", "margin": "Entire", "length_min": 10, "length_max": 20, "width_min": 5, "width_max": 10, "petiole_length": 3.0 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Spiny", "color": "Nâu xám", "height_min": 4.0, "height_max": 8.0 },
        "morphology_flower": { "inflorescence": "Raceme", "color": "Trắng đục", "petal_count": 5 },
        "distributions": [{ "province_name": "Vĩnh Long", "status": "Cultivated", "description": "Vùng chuyên canh nổi tiếng tại Bình Minh, Vĩnh Long." }]
      }
    ]
  },
{
    "family": { "scientific_name": "Fabaceae", "vietnamese_name": "Họ Đậu", "authority": "Lindl." },
    "genus": { "scientific_name": "Glycine", "vietnamese_name": "Chi Đậu nành", "authority": "Willd." },
    "species": { 
      "scientific_name": "Glycine max", 
      "vietnamese_name": "Đậu nành (Đậu tương)", 
      "synonyms": "Dolichos soja", 
      "authority": "(L.) Merr.",
      "uses": "Thực phẩm (chế biến đậu phụ, sữa đậu nành, nước tương), công nghiệp (ép dầu thực vật), thức ăn chăn nuôi, dược liệu (isoflavone cân bằng nội tiết)."
    },
    "varieties": [
      {
        "common_name": "Đậu nành hạt vàng", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thân thảo hằng năm, toàn thân và trái phủ đầy lông tơ màu rỉ sắt.",
        "morphology_leaf": { "leaf_type": "Trifoliolate", "shape": "Ovate", "arrangement": "Alternate", "margin": "Entire", "length_min": 5, "length_max": 15, "width_min": 3, "width_max": 7, "petiole_length": 10 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Hairy", "color": "Xanh nhạt", "height_min": 0.4, "height_max": 1.0 },
        "morphology_flower": { "inflorescence": "Raceme", "color": "Trắng hoặc Tím phớt", "petal_count": 5 },
        "distributions": [{ "province_name": "Sơn La", "status": "Cultivated", "description": "Cây màu ngắn ngày quan trọng, trồng xen canh hoặc luân canh trên đất dốc." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Fabaceae", "vietnamese_name": "Họ Đậu", "authority": "Lindl." },
    "genus": { "scientific_name": "Vigna", "vietnamese_name": "Chi Đậu", "authority": "Savi" },
    "species": { 
      "scientific_name": "Vigna radiata", 
      "vietnamese_name": "Đậu xanh", 
      "synonyms": "Phaseolus aureus", 
      "authority": "(L.) R.Wilczek",
      "uses": "Thực phẩm (hạt nấu chè, làm miến, làm giá đỗ, bánh mứt), dược liệu (thanh nhiệt, giải độc, mát gan, tiêu khát)."
    },
    "varieties": [
      {
        "common_name": "Đậu xanh mỡ", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Thân thảo mọc đứng, hạt tròn, nhẵn bóng màu xanh lục.",
        "morphology_leaf": { "leaf_type": "Trifoliolate", "shape": "Ovate", "arrangement": "Alternate", "margin": "Entire", "length_min": 5, "length_max": 12, "width_min": 4, "width_max": 9, "petiole_length": 8 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Hairy", "color": "Xanh lục", "height_min": 0.3, "height_max": 0.8 },
        "morphology_flower": { "inflorescence": "Raceme", "color": "Vàng tươi", "petal_count": 5 },
        "distributions": [{ "province_name": "Gia Lai", "status": "Cultivated", "description": "Trồng nhiều ở vùng Tây Nguyên, chịu hạn tốt." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Cucurbitaceae", "vietnamese_name": "Họ Bầu bí", "authority": "Juss." },
    "genus": { "scientific_name": "Citrullus", "vietnamese_name": "Chi Dưa hấu", "authority": "Schrad." },
    "species": { 
      "scientific_name": "Citrullus lanatus", 
      "vietnamese_name": "Dưa hấu", 
      "synonyms": "Cucurbita citrullus", 
      "authority": "(Thunb.) Matsum. & Nakai",
      "uses": "Thực phẩm (quả chứa 90% nước, làm sinh tố giải khát mùa hè), dược liệu (thanh nhiệt, giải thử, lợi tiểu)."
    },
    "varieties": [
      {
        "common_name": "Dưa hấu Hắc mỹ nhân", "variant_type": "Cultivar", "life_form": "Climber", "is_flowering": true, "is_fruiting": true,
        "description": "Dây bò trên mặt đất, phân nhánh nhiều. Quả hình oval dài, vỏ màu xanh đen bóng.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Cordate", "arrangement": "Alternate", "margin": "Lobed", "length_min": 10, "length_max": 20, "width_min": 10, "width_max": 18, "petiole_length": 12 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Hairy", "color": "Xanh nhạt", "height_min": 2.0, "height_max": 5.0 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Vàng", "petal_count": 5 },
        "distributions": [{ "province_name": "Đồng Tháp", "status": "Cultivated", "description": "Tiền Giang cũ. Trồng chuyên canh trên đất pha cát, ruộng lúa màu." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Cucurbitaceae", "vietnamese_name": "Họ Bầu bí", "authority": "Juss." },
    "genus": { "scientific_name": "Cucurbita", "vietnamese_name": "Chi Bí", "authority": "L." },
    "species": { 
      "scientific_name": "Cucurbita moschata", 
      "vietnamese_name": "Bí đỏ (Bí rợ)", 
      "synonyms": "", 
      "authority": "Duchesne",
      "uses": "Thực phẩm (quả giàu vitamin A, ngọn non làm rau xanh), dược liệu (hạt bí đỏ trị giun sán, tốt cho tuyến tiền liệt)."
    },
    "varieties": [
      {
        "common_name": "Bí đỏ hồ lô", "variant_type": "Cultivar", "life_form": "Climber", "is_flowering": true, "is_fruiting": true,
        "description": "Dây bò lan hoặc leo giàn, thân có năm góc và phủ đầy lông gai nháp. Quả hình hồ lô đặc ruột.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Cordate", "arrangement": "Alternate", "margin": "Dentate", "length_min": 15, "length_max": 30, "width_min": 15, "width_max": 30, "petiole_length": 15 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Hairy", "color": "Xanh đậm", "height_min": 3.0, "height_max": 8.0 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Vàng cam", "petal_count": 5 },
        "distributions": [{ "province_name": "Lâm Đồng", "status": "Cultivated", "description": "Đắk Nông cũ. Dễ trồng trên đất đồi nương, rẫy xen canh." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Rosaceae", "vietnamese_name": "Họ Hoa hồng", "authority": "Juss." },
    "genus": { "scientific_name": "Rosa", "vietnamese_name": "Chi Hoa hồng", "authority": "L." },
    "species": { 
      "scientific_name": "Rosa multiflora", 
      "vietnamese_name": "Tầm xuân", 
      "synonyms": "", 
      "authority": "Thunb.",
      "uses": "Cảnh quan (trồng làm hàng rào hoa, dùng làm gốc ghép cho các giống hoa hồng lai), dược liệu (quả tầm xuân rất giàu vitamin C, thanh nhiệt)."
    },
    "varieties": [
      {
        "common_name": "Tầm xuân hoa trắng", "variant_type": "Variety", "life_form": "Climber", "is_flowering": true, "is_fruiting": true,
        "description": "Cây bụi leo, nhánh vươn dài có gai quặp. Hoa mọc thành cụm rực rỡ nhưng nhỏ hơn hoa hồng.",
        "morphology_leaf": { "leaf_type": "Compound_Pinnate", "shape": "Obovate", "arrangement": "Alternate", "margin": "Serrate", "length_min": 5, "length_max": 10, "width_min": 3, "width_max": 5, "petiole_length": 1.5 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Spiny", "color": "Nâu nhạt", "height_min": 2.0, "height_max": 5.0 },
        "morphology_flower": { "inflorescence": "Panicle", "color": "Trắng", "petal_count": 5 },
        "distributions": [{ "province_name": "Lào Cai", "status": "Native", "description": "Mọc hoang dại ven rừng, đồi núi các tỉnh phía Bắc." }]
      }
    ]
  },
  {
    "family": { "scientific_name": "Araliaceae", "vietnamese_name": "Họ Nhân sâm", "authority": "Juss." },
    "genus": { "scientific_name": "Polyscias", "vietnamese_name": "Chi Đinh lăng", "authority": "J.R.Forst. & G.Forst." },
    "species": { 
      "scientific_name": "Polyscias scutellaria", 
      "vietnamese_name": "Đinh lăng lá to", 
      "synonyms": "Crassula scutellaria", 
      "authority": "(Burm.f.) Merr.",
      "uses": "Cảnh quan (trồng chậu làm cây nội thất, trồng hàng rào do tán lá đẹp, chịu bóng bán phần), dược liệu (rễ có thể dùng sắc uống trị đau nhức xương khớp nhưng dược tính thấp hơn đinh lăng lá nhỏ rất nhiều), thực phẩm (lá non có thể dùng ăn sống)."
    },
    "varieties": [
      {
        "common_name": "Đinh lăng lá to (Đinh lăng đĩa)", "variant_type": "Cultivar", "life_form": "Shrub", "is_flowering": true,"is_fruiting": false,
        "description": "Cây bụi lớn, thân mập, ít phân nhánh. Lá mọc kép lông chim 1 lần, lá chét rất to, phiến lá hình tròn hoặc trái xoan rộng, mép lá vểnh lên trông như cái đĩa.",
        "morphology_leaf": { 
          "leaf_type": "Compound_Pinnate", "shape": "Ovate","arrangement": "Alternate", "margin": "Serrate", "length_min": 10, "length_max": 25,"width_min": 8, "width_max": 18,  "petiole_length": 15 
        },
        "morphology_stem": { 
          "stem_type": "Shrubby","surface": "Smooth", "color": "Xanh xám nhạt", "height_min": 1.0, "height_max": 3.0 
        },
        "morphology_flower": { 
          "inflorescence": "Panicle","color": "Xanh nhạt","petal_count": 5 
        },
        "distributions": [
          { 
            "province_name": "Thành phố Hồ Chí Minh", "status": "Cultivated", "description": "Trồng rất phổ biến làm cây cảnh quan đô thị, cây nội thất văn phòng nhờ khả năng thích nghi tốt." 
          }
        ]} ] 
  },
  {
    "family": { "scientific_name": "Rubiaceae", "vietnamese_name": "Họ Cà phê", "authority": "Juss." },
    "genus": { "scientific_name": "Coffea", "vietnamese_name": "Chi Cà phê", "authority": "L." },
    "species": { 
      "scientific_name": "Coffea canephora", 
      "vietnamese_name": "Cà phê vối (Robusta)", 
      "synonyms": "Coffea robusta", 
      "authority": "Pierre ex A.Froehner",
      "uses": "Công nghiệp (chiết xuất caffeine, sản xuất đồ uống năng lượng), nông nghiệp (mặt hàng xuất khẩu mũi nhọn của vùng Tây Nguyên)."
    },
    "varieties": [
      {
        "common_name": "Cà phê vối", "variant_type": "Cultivar", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thân gỗ nhỏ hoặc cây bụi lớn. Quả hình oval, chứa 2 hạt, hàm lượng caffeine rất cao (2-2.5%).",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Elliptic", "arrangement": "Opposite", "margin": "Entire", "length_min": 15, "length_max": 30, "width_min": 5, "width_max": 15, "petiole_length": 1.5 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Nâu xám", "height_min": 2.0, "height_max": 6.0 },
        "morphology_flower": { "inflorescence": "Cyme", "color": "Trắng", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Orchidaceae", "vietnamese_name": "Họ Lan", "authority": "Juss." },
    "genus": { "scientific_name": "Phalaenopsis", "vietnamese_name": "Chi Lan hồ điệp", "authority": "Blume" },
    "species": { 
      "scientific_name": "Phalaenopsis amabilis", 
      "vietnamese_name": "Lan hồ điệp trắng", 
      "synonyms": "Epidendrum amabile", 
      "authority": "(L.) Blume",
      "uses": "Cảnh quan (trồng chậu làm cây trang trí nội thất cao cấp), thương mại (hoa cắt cành, quà tặng)."
    },
    "varieties": [
      {
        "common_name": "Hồ điệp hoa trắng", "variant_type": "Cultivar", "life_form": "Epiphyte", "is_flowering": true, "is_fruiting": false,
        "description": "Lan đơn thân phụ sinh, rễ to mập, có màng xốp hút ẩm. Lá bản rộng, thịt dày. Hoa mọc thành chùm dài cong vút.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Oblong", "arrangement": "Alternate", "margin": "Entire", "length_min": 15, "length_max": 30, "width_min": 5, "width_max": 10, "petiole_length": 0 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Smooth", "color": "Xanh lục", "height_min": 0.1, "height_max": 0.3 },
        "morphology_flower": { "inflorescence": "Raceme", "color": "Trắng", "petal_count": 3 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Moraceae", "vietnamese_name": "Họ Dâu tằm", "authority": "Link" },
    "genus": { "scientific_name": "Artocarpus", "vietnamese_name": "Chi Mít", "authority": "J.R.Forst. & G.Forst." },
    "species": { 
      "scientific_name": "Artocarpus heterophyllus", 
      "vietnamese_name": "Mít", 
      "synonyms": "", 
      "authority": "Lam.",
      "uses": "Thực phẩm (quả chín ăn tươi, sấy khô; quả xanh nấu canh, làm gỏi), mộc (gỗ có màu vàng sáng, không bị mối mọt, chuyên tạc tượng Phật và làm nhạc cụ)."
    },
    "varieties": [
      {
        "common_name": "Mít Thái siêu sớm", "variant_type": "Cultivar", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thân gỗ lớn, sinh trưởng nhanh. Quả mọc trên thân chính, múi dày, giòn, màu vàng cam và rất ngọt.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Obovate", "arrangement": "Alternate", "margin": "Entire", "length_min": 10, "length_max": 20, "width_min": 5, "width_max": 12, "petiole_length": 2.0 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Xám nâu", "height_min": 5.0, "height_max": 15.0 },
        "morphology_flower": { "inflorescence": "Spadix", "color": "Xanh vàng", "petal_count": 0 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Nelumbonaceae", "vietnamese_name": "Họ Sen", "authority": "A.Rich." },
    "genus": { "scientific_name": "Nelumbo", "vietnamese_name": "Chi Sen", "authority": "Adans." },
    "species": { 
      "scientific_name": "Nelumbo nucifera", 
      "vietnamese_name": "Sen", 
      "synonyms": "Nelumbium speciosum", 
      "authority": "Gaertn.",
      "uses": "Thực phẩm (hạt sen, ngó sen làm món ăn), dược liệu (tâm sen an thần, lá sen giúp giảm mỡ máu), cảnh quan và văn hóa tâm linh."
    },
    "varieties": [
      {
        "common_name": "Sen hồng", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thảo thủy sinh. Thân rễ (ngó sen) mập mạp mọc bò dưới bùn. Cuống lá vươn cao khỏi mặt nước.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Alternate", "margin": "Entire", "length_min": 30, "length_max": 60, "width_min": 30, "width_max": 60, "petiole_length": 120 },
        "morphology_stem": { "stem_type": "Rhizome", "surface": "Smooth", "color": "Trắng ngà", "height_min": 0.5, "height_max": 1.5 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Hồng", "petal_count": 20 }
      }
    ]
  },
{
    "family": { "scientific_name": "Poaceae", "vietnamese_name": "Họ Lúa", "authority": "Barnhart" },
    "genus": { "scientific_name": "Oryza", "vietnamese_name": "Chi Lúa", "authority": "L." },
    "species": { 
      "scientific_name": "Oryza sativa", 
      "vietnamese_name": "Lúa nước", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Lương thực (thực phẩm chủ yếu của người Việt), nông nghiệp (rơm rạ làm thức ăn gia súc, ủ phân, trồng nấm)."
    },
    "varieties": [
      {
        "common_name": "Lúa ST25", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Giống lúa thơm đặc sản, hạt gạo dài, trắng trong, dẻo và có mùi thơm lá dứa.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Linear", "arrangement": "Alternate", "margin": "Entire", "length_min": 30, "length_max": 60, "width_min": 1, "width_max": 2, "petiole_length": 0 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Smooth", "color": "Xanh lục", "height_min": 0.8, "height_max": 1.2 },
        "morphology_flower": { "inflorescence": "Panicle", "color": "Vàng nhạt", "petal_count": 0 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Theaceae", "vietnamese_name": "Họ Chè", "authority": "Mirb." },
    "genus": { "scientific_name": "Camellia", "vietnamese_name": "Chi Trà", "authority": "L." },
    "species": { 
      "scientific_name": "Camellia sinensis", 
      "vietnamese_name": "Trà (Chè)", 
      "synonyms": "Thea sinensis", 
      "authority": "(L.) Kuntze",
      "uses": "Thực phẩm (chế biến trà xanh, trà đen, matcha), dược liệu (chất chống oxy hóa EGCG giúp chống lão hóa, giảm cân)."
    },
    "varieties": [
      {
        "common_name": "Chè Thái Nguyên (Chè Tân Cương)", "variant_type": "Cultivar", "life_form": "Shrub", "is_flowering": true, "is_fruiting": true,
        "description": "Cây bụi hái lá, được đốn tỉa thường xuyên để giữ chiều cao thấp. Nước trà xanh trong, vị chát dịu, hậu ngọt.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Elliptic", "arrangement": "Alternate", "margin": "Serrate", "length_min": 4, "length_max": 10, "width_min": 2, "width_max": 4, "petiole_length": 0.5 },
        "morphology_stem": { "stem_type": "Shrubby", "surface": "Rough", "color": "Nâu xám", "height_min": 0.6, "height_max": 1.5 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Trắng", "petal_count": 6 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Arecaceae", "vietnamese_name": "Họ Cau", "authority": "Bercht. & J.Presl" },
    "genus": { "scientific_name": "Cocos", "vietnamese_name": "Chi Dừa", "authority": "L." },
    "species": { 
      "scientific_name": "Cocos nucifera", 
      "vietnamese_name": "Dừa", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Thực phẩm (nước giải khát, cùi dừa ép dầu, làm cốt dừa), công nghiệp (xơ dừa làm thảm, mụn dừa làm giá thể), mộc (gỗ dừa làm nhà)."
    },
    "varieties": [
      {
        "common_name": "Dừa xiêm lùn", "variant_type": "Cultivar", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây cau dừa có thân mọc thẳng, rễ chùm. Cho quả khi cây còn thấp, nước rất ngọt.",
        "morphology_leaf": { "leaf_type": "Compound_Pinnate", "shape": "Linear", "arrangement": "Spiral", "margin": "Entire", "length_min": 200, "length_max": 400, "width_min": 5, "width_max": 10, "petiole_length": 100 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Xám bạc", "height_min": 3.0, "height_max": 10.0 },
        "morphology_flower": { "inflorescence": "Spadix", "color": "Vàng nhạt", "petal_count": 3 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Asphodelaceae", "vietnamese_name": "Họ Lan nhật quang", "authority": "Juss." },
    "genus": { "scientific_name": "Aloe", "vietnamese_name": "Chi Lô hội", "authority": "L." },
    "species": { 
      "scientific_name": "Aloe vera", 
      "vietnamese_name": "Nha đam (Lô hội)", 
      "synonyms": "Aloe barbadensis", 
      "authority": "(L.) Burm.f.",
      "uses": "Thực phẩm (nấu chè thanh nhiệt), mỹ phẩm (gel dưỡng ẩm, làm dịu vết bỏng, trị mụn), dược liệu."
    },
    "varieties": [
      {
        "common_name": "Nha đam Mỹ", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": false,
        "description": "Cây thảo mọng nước, không có thân rõ rệt, lá xếp thành hoa thị ở gốc, chứa nhiều gel trong suốt.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Lanceolate", "arrangement": "Basal", "margin": "Dentate", "length_min": 30, "length_max": 60, "width_min": 5, "width_max": 10, "petiole_length": 0 },
        "morphology_stem": { "stem_type": "Fleshy", "surface": "Smooth", "color": "Xanh lục nhạt", "height_min": 0.1, "height_max": 0.3 },
        "morphology_flower": { "inflorescence": "Raceme", "color": "Vàng cam", "petal_count": 6 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Piperaceae", "vietnamese_name": "Họ Hồ tiêu", "authority": "Giseke" },
    "genus": { "scientific_name": "Piper", "vietnamese_name": "Chi Hồ tiêu", "authority": "L." },
    "species": { 
      "scientific_name": "Piper nigrum", 
      "vietnamese_name": "Hồ tiêu", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Gia vị (tạo vị cay nồng, khử mùi tanh), công nghiệp (xuất khẩu), dược liệu (kích thích tiêu hóa, trị lạnh bụng)."
    },
    "varieties": [
      {
        "common_name": "Tiêu Vĩnh Linh", "variant_type": "Cultivar", "life_form": "Climber", "is_flowering": true, "is_fruiting": true,
        "description": "Dây leo bám vào trụ (trục sống hoặc nọc giả), rễ bám phát triển mạnh từ các đốt.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Alternate", "margin": "Entire", "length_min": 10, "length_max": 15, "width_min": 5, "width_max": 9, "petiole_length": 2.5 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Smooth", "color": "Xanh đậm", "height_min": 3.0, "height_max": 8.0 },
        "morphology_flower": { "inflorescence": "Spike", "color": "Trắng nhạt", "petal_count": 0 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Bromeliaceae", "vietnamese_name": "Họ Dứa", "authority": "Juss." },
    "genus": { "scientific_name": "Ananas", "vietnamese_name": "Chi Dứa", "authority": "Mill." },
    "species": { 
      "scientific_name": "Ananas comosus", 
      "vietnamese_name": "Dứa (Thơm / Khóm)", 
      "synonyms": "Bromelia comosa", 
      "authority": "(L.) Merr.",
      "uses": "Thực phẩm (quả ăn tươi, ép nước trái cây), công nghiệp thực phẩm (sản xuất dứa hộp), dược liệu (chứa enzyme bromelain hỗ trợ tiêu hóa)."
    },
    "varieties": [
      {
        "common_name": "Khóm Queen (Dứa nữ hoàng)", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thảo sống nhiều năm. Quả thơm nhỏ, mắt lồi sâu, ruột vàng đậm và rất ngọt, chịu phèn tốt.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Linear", "arrangement": "Spiral", "margin": "Spiny", "length_min": 60, "length_max": 100, "width_min": 3, "width_max": 6, "petiole_length": 0 },
        "morphology_stem": { "stem_type": "Fleshy", "surface": "Smooth", "color": "Xanh trắng", "height_min": 0.5, "height_max": 1.0 },
        "morphology_flower": { "inflorescence": "Capitulum", "color": "Tím nhạt", "petal_count": 3 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Poaceae", "vietnamese_name": "Họ Lúa", "authority": "Barnhart" },
    "genus": { "scientific_name": "Cymbopogon", "vietnamese_name": "Chi Sả", "authority": "Spreng." },
    "species": { 
      "scientific_name": "Cymbopogon citratus", 
      "vietnamese_name": "Sả chanh", 
      "synonyms": "Andropogon citratus", 
      "authority": "DC.",
      "uses": "Gia vị (khử mùi thực phẩm), dược liệu (giải cảm, làm ấm cơ thể), công nghiệp (chiết tinh dầu sả đuổi muỗi, làm mỹ phẩm)."
    },
    "varieties": [
      {
        "common_name": "Sả chanh", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": false, "is_fruiting": false,
        "description": "Thân thảo mọc thành bụi đẻ nhánh liên tục. Toàn cây có mùi thơm đặc trưng của chanh.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Linear", "arrangement": "Basal", "margin": "Rough", "length_min": 60, "length_max": 100, "width_min": 1, "width_max": 2, "petiole_length": 0 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Smooth", "color": "Trắng xanh", "height_min": 1.0, "height_max": 1.5 },
        "morphology_flower": { "inflorescence": "Panicle", "color": "Nâu nhạt", "petal_count": 0 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Convolvulaceae", "vietnamese_name": "Họ Bìm bìm", "authority": "Juss." },
    "genus": { "scientific_name": "Ipomoea", "vietnamese_name": "Chi Khoai lang", "authority": "L." },
    "species": { 
      "scientific_name": "Ipomoea batatas", 
      "vietnamese_name": "Khoai lang", 
      "synonyms": "Convolvulus batatas", 
      "authority": "(L.) Lam.",
      "uses": "Thực phẩm (củ luộc, làm mứt, ngọn lá làm rau), lương thực phụ, thức ăn chăn nuôi."
    },
    "varieties": [
      {
        "common_name": "Khoai lang Nhật (Khoai lang ruột vàng)", "variant_type": "Cultivar", "life_form": "Climber", "is_flowering": true, "is_fruiting": false,
        "description": "Dây leo bò lan trên mặt đất. Củ (rễ phình to) có vỏ tím, ruột vàng, ăn ngọt và bở.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Cordate", "arrangement": "Alternate", "margin": "Entire", "length_min": 8, "length_max": 15, "width_min": 8, "width_max": 12, "petiole_length": 10 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Smooth", "color": "Tím tía hoặc Xanh lục", "height_min": 1.0, "height_max": 3.0 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Hồng tím", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Nyctaginaceae", "vietnamese_name": "Họ Hoa giấy", "authority": "Juss." },
    "genus": { "scientific_name": "Bougainvillea", "vietnamese_name": "Chi Hoa giấy", "authority": "Comm. ex Juss." },
    "species": { 
      "scientific_name": "Bougainvillea spectabilis", 
      "vietnamese_name": "Hoa giấy", 
      "synonyms": "", 
      "authority": "Willd.",
      "uses": "Cảnh quan (trồng cổng rào, ban công, bonsai), che bóng mát."
    },
    "varieties": [
      {
        "common_name": "Hoa giấy xác pháo", "variant_type": "Cultivar", "life_form": "Climber", "is_flowering": true, "is_fruiting": false,
        "description": "Cây bụi leo, thân gỗ có gai nhọn. 'Hoa' sặc sỡ thực chất là các lá bắc màu đỏ thẫm/hồng bao quanh hoa thật rất nhỏ ở giữa.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Alternate", "margin": "Entire", "length_min": 4, "length_max": 10, "width_min": 3, "width_max": 6, "petiole_length": 1.5 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Spiny", "color": "Nâu xám", "height_min": 2.0, "height_max": 10.0 },
        "morphology_flower": { "inflorescence": "Cyme", "color": "Trắng nhạt (Lá bắc màu Đỏ)", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Moraceae", "vietnamese_name": "Họ Dâu tằm", "authority": "Link" },
    "genus": { "scientific_name": "Morus", "vietnamese_name": "Chi Dâu tằm", "authority": "L." },
    "species": { 
      "scientific_name": "Morus alba", 
      "vietnamese_name": "Dâu tằm", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Nông nghiệp (lá làm thức ăn nuôi tằm), thực phẩm (quả làm siro, ngâm rượu), dược liệu (cành, lá và rễ đều dùng làm thuốc trong Đông y)."
    },
    "varieties": [
      {
        "common_name": "Dâu tằm ta", "variant_type": "Cultivar", "life_form": "Shrub", "is_flowering": true, "is_fruiting": true,
        "description": "Cây gỗ nhỏ hoặc cây bụi do thường xuyên bị cắt tỉa. Quả mọng khi chín có màu tím đen, vị chua ngọt.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Alternate", "margin": "Serrate", "length_min": 8, "length_max": 15, "width_min": 6, "width_max": 12, "petiole_length": 3 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Nâu nhạt", "height_min": 2.0, "height_max": 5.0 },
        "morphology_flower": { "inflorescence": "Spike", "color": "Xanh nhạt", "petal_count": 4 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Euphorbiaceae", "vietnamese_name": "Họ Đại kích (Thầu dầu)", "authority": "Juss." },
    "genus": { "scientific_name": "Manihot", "vietnamese_name": "Chi Sắn", "authority": "Mill." },
    "species": { 
      "scientific_name": "Manihot esculenta", 
      "vietnamese_name": "Sắn (Khoai mì)", 
      "synonyms": "Jatropha manihot", 
      "authority": "Crantz",
      "uses": "Lương thực phụ (luộc, nấu chè), công nghiệp (sản xuất tinh bột sắn, bột ngọt, cồn sinh học), thức ăn chăn nuôi."
    },
    "varieties": [
      {
        "common_name": "Sắn cao sản", "variant_type": "Cultivar", "life_form": "Shrub", "is_flowering": true, "is_fruiting": true,
        "description": "Cây bụi, thân chia thành các đốt rõ rệt do sẹo lá rụng. Rễ củ phát triển lớn chứa nhiều tinh bột.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Palmate", "arrangement": "Alternate", "margin": "Lobed", "length_min": 10, "length_max": 20, "width_min": 10, "width_max": 20, "petiole_length": 15 },
        "morphology_stem": { "stem_type": "Shrubby", "surface": "Smooth", "color": "Xám lục", "height_min": 1.5, "height_max": 3.0 },
        "morphology_flower": { "inflorescence": "Panicle", "color": "Đỏ nhạt nhạt", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Euphorbiaceae", "vietnamese_name": "Họ Đại kích", "authority": "Juss." },
    "genus": { "scientific_name": "Hevea", "vietnamese_name": "Chi Cao su", "authority": "Aubl." },
    "species": { 
      "scientific_name": "Hevea brasiliensis", 
      "vietnamese_name": "Cao su", 
      "synonyms": "", 
      "authority": "(Willd. ex A.Juss.) Müll.Arg.",
      "uses": "Công nghiệp (khai thác mủ latex sản xuất săm lốp, nệm), mộc (gỗ cao su nội thất sau khi hết chu kỳ khai thác mủ)."
    },
    "varieties": [
      {
        "common_name": "Cao su sinh trưởng mạnh", "variant_type": "Cultivar", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thân gỗ lớn thẳng đứng, chứa nhiều nhựa mủ trắng. Có hiện tượng rụng lá sinh lý hàng năm.",
        "morphology_leaf": { "leaf_type": "Trifoliolate", "shape": "Elliptic", "arrangement": "Alternate", "margin": "Entire", "length_min": 10, "length_max": 25, "width_min": 5, "width_max": 10, "petiole_length": 15 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Smooth", "color": "Xám sáng", "height_min": 15.0, "height_max": 30.0 },
        "morphology_flower": { "inflorescence": "Panicle", "color": "Vàng xanh", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Fabaceae", "vietnamese_name": "Họ Đậu", "authority": "Lindl." },
    "genus": { "scientific_name": "Arachis", "vietnamese_name": "Chi Lạc", "authority": "L." },
    "species": { 
      "scientific_name": "Arachis hypogaea", 
      "vietnamese_name": "Lạc (Đậu phộng)", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Thực phẩm (hạt rang ăn trực tiếp, làm kẹo, bơ), công nghiệp (ép dầu), nông nghiệp (cải tạo đất do có nốt sần cố định đạm)."
    },
    "varieties": [
      {
        "common_name": "Đậu phộng sẻ", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Thân thảo mọc thấp bò lan. Đặc biệt tia quả đâm xuống đất để phát triển thành củ (quả).",
        "morphology_leaf": { "leaf_type": "Compound_Pinnate", "shape": "Obovate", "arrangement": "Alternate", "margin": "Entire", "length_min": 3, "length_max": 6, "width_min": 2, "width_max": 3, "petiole_length": 5 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Hairy", "color": "Xanh nhạt", "height_min": 0.3, "height_max": 0.5 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Vàng tươi", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Pinaceae", "vietnamese_name": "Họ Thông", "authority": "Spreng. ex F.Rudolphi" },
    "genus": { "scientific_name": "Pinus", "vietnamese_name": "Chi Thông", "authority": "L." },
    "species": { 
      "scientific_name": "Pinus kesiya", 
      "vietnamese_name": "Thông ba lá", 
      "synonyms": "Pinus insularis", 
      "authority": "Royle ex Gordon",
      "uses": "Lâm nghiệp (phủ xanh đồi núi trọc), công nghiệp (khai thác nhựa thông, gỗ làm giấy), cảnh quan sinh thái."
    },
    "varieties": [
      {
        "common_name": "Thông ba lá Đà Lạt", "variant_type": "Variety", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây gỗ lá kim lớn, tiết nhiều nhựa thơm. Lá hình kim, mọc thành cụm (bó) 3 lá chét.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Acicular", "arrangement": "Fascicled", "margin": "Entire", "length_min": 15, "length_max": 25, "width_min": 0.1, "width_max": 0.2, "petiole_length": 0 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Nâu đen nứt nẻ", "height_min": 20.0, "height_max": 35.0 },
        "morphology_flower": { "inflorescence": "Spike", "color": "Vàng nâu (Nón đực)", "petal_count": 0 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Lamiaceae", "vietnamese_name": "Họ Hoa môi", "authority": "Martinov" },
    "genus": { "scientific_name": "Perilla", "vietnamese_name": "Chi Tía tô", "authority": "L." },
    "species": { 
      "scientific_name": "Perilla frutescens", 
      "vietnamese_name": "Tía tô", 
      "synonyms": "Ocimum frutescens", 
      "authority": "(L.) Britton",
      "uses": "Thực phẩm (rau gia vị ăn sống, nấu canh), dược liệu (giải cảm, trị ho, giảm triệu chứng bệnh gút)."
    },
    "varieties": [
      {
        "common_name": "Tía tô tím", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thảo hằng năm. Toàn thân và mặt dưới lá có màu tím tía, phủ đầy lông nhám. Mùi thơm nồng đặc trưng.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Opposite", "margin": "Serrate", "length_min": 5, "length_max": 12, "width_min": 3, "width_max": 8, "petiole_length": 3 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Hairy", "color": "Tím đỏ", "height_min": 0.4, "height_max": 1.0 },
        "morphology_flower": { "inflorescence": "Raceme", "color": "Trắng nhạt đến Tím", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Convolvulaceae", "vietnamese_name": "Họ Bìm bìm", "authority": "Juss." },
    "genus": { "scientific_name": "Ipomoea", "vietnamese_name": "Chi Khoai lang", "authority": "L." },
    "species": { 
      "scientific_name": "Ipomoea aquatica", 
      "vietnamese_name": "Rau muống", 
      "synonyms": "Convolvulus repens", 
      "authority": "Forssk.",
      "uses": "Thực phẩm (loại rau ăn lá phổ biến nhất Việt Nam, dùng luộc, xào, nấu canh), thức ăn chăn nuôi."
    },
    "varieties": [
      {
        "common_name": "Rau muống nước", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thân thảo mọc bò lan trên mặt nước hoặc đất bùn ẩm. Thân rỗng rễ sinh ra từ các đốt.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Lanceolate", "arrangement": "Alternate", "margin": "Entire", "length_min": 7, "length_max": 14, "width_min": 2, "width_max": 5, "petiole_length": 6 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Smooth", "color": "Xanh nhạt hoặc Hơi đỏ", "height_min": 0.3, "height_max": 2.0 },
        "morphology_flower": { "inflorescence": "Cyme", "color": "Trắng hoặc Tím nhạt", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Sapindaceae", "vietnamese_name": "Họ Bồ hòn", "authority": "Juss." },
    "genus": { "scientific_name": "Dimocarpus", "vietnamese_name": "Chi Nhãn", "authority": "Lour." },
    "species": { 
      "scientific_name": "Dimocarpus longan", 
      "vietnamese_name": "Nhãn", 
      "synonyms": "Euphoria longan", 
      "authority": "Lour.",
      "uses": "Thực phẩm (quả tươi ngọt lịm, sấy khô làm long nhãn), dược liệu (long nhãn bổ máu, an thần)."
    },
    "varieties": [
      {
        "common_name": "Nhãn lồng Hưng Yên", "variant_type": "Cultivar", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thân gỗ lâu năm. Quả mọc thành chùm, vỏ sần màu nâu vàng, cùi dày giòn và hột nhỏ.",
        "morphology_leaf": { "leaf_type": "Compound_Pinnate", "shape": "Lanceolate", "arrangement": "Alternate", "margin": "Entire", "length_min": 15, "length_max": 30, "width_min": 4, "width_max": 8, "petiole_length": 5 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Nâu xám nứt nẻ", "height_min": 5.0, "height_max": 10.0 },
        "morphology_flower": { "inflorescence": "Panicle", "color": "Vàng nhạt", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Fabaceae", "vietnamese_name": "Họ Đậu", "authority": "Lindl." },
    "genus": { "scientific_name": "Delonix", "vietnamese_name": "Chi Phượng vĩ", "authority": "Raf." },
    "species": { 
      "scientific_name": "Delonix regia", 
      "vietnamese_name": "Phượng vĩ", 
      "synonyms": "Poinciana regia", 
      "authority": "(Bojer) Raf.",
      "uses": "Cảnh quan (trồng làm cây bóng mát tại các trường học, công viên, đường phố nhờ tán rộng và hoa nở rực rỡ vào mùa hè)."
    },
    "varieties": [
      {
        "common_name": "Phượng vĩ hoa đỏ", "variant_type": "Forma", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây gỗ lớn, tán lá xòe rộng như chiếc ô. Hoa nở đỏ rực vào khoảng tháng 5-7. Quả đậu to và dài.",
        "morphology_leaf": { "leaf_type": "Bipinnate", "shape": "Oblong", "arrangement": "Alternate", "margin": "Entire", "length_min": 30, "length_max": 50, "width_min": 15, "width_max": 25, "petiole_length": 8 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Xám trắng", "height_min": 10.0, "height_max": 15.0 },
        "morphology_flower": { "inflorescence": "Raceme", "color": "Đỏ cam", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Ochnaceae", "vietnamese_name": "Họ Mai", "authority": "DC." },
    "genus": { "scientific_name": "Ochna", "vietnamese_name": "Chi Mai", "authority": "L." },
    "species": { 
      "scientific_name": "Ochna integerrima", 
      "vietnamese_name": "Hoa mai (Mai vàng)", 
      "synonyms": "Elaeocarpus integerrimus", 
      "authority": "(Lour.) Merr.",
      "uses": "Cảnh quan (loài hoa đặc trưng không thể thiếu trong dịp Tết Nguyên Đán ở miền Nam Việt Nam)."
    },
    "varieties": [
      {
        "common_name": "Mai vàng 5 cánh", "variant_type": "Variety", "life_form": "Shrub", "is_flowering": true, "is_fruiting": true,
        "description": "Cây gỗ nhỏ hoặc cây bụi, thường rụng lá vào mùa khô để nụ hoa phát triển bung nở đúng dịp xuân.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Oblong", "arrangement": "Alternate", "margin": "Serrate", "length_min": 5, "length_max": 12, "width_min": 3, "width_max": 5, "petiole_length": 0.5 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Nâu đen", "height_min": 2.0, "height_max": 5.0 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Vàng tươi", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Amaryllidaceae", "vietnamese_name": "Họ Loa kèn", "authority": "J.St.-Hil." },
    "genus": { "scientific_name": "Allium", "vietnamese_name": "Chi Hành", "authority": "L." },
    "species": { 
      "scientific_name": "Allium fistulosum", 
      "vietnamese_name": "Hành lá (Hành hoa)", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Gia vị (loại rau nêm phổ biến nhất trong ẩm thực Việt Nam), dược liệu (giải cảm, làm toát mồ hôi)."
    },
    "varieties": [
      {
        "common_name": "Hành hương", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thảo, phần gốc phình to tạo thành củ nhỏ màu trắng. Lá hình ống rỗng bên trong, mùi rất thơm.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Linear", "arrangement": "Basal", "margin": "Entire", "length_min": 20, "length_max": 50, "width_min": 0.5, "width_max": 1.0, "petiole_length": 0 },
        "morphology_stem": { "stem_type": "Bulb", "surface": "Smooth", "color": "Trắng", "height_min": 0.05, "height_max": 0.1 },
        "morphology_flower": { "inflorescence": "Umbel", "color": "Trắng xanh", "petal_count": 6 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Poaceae", "vietnamese_name": "Họ Lúa", "authority": "Barnhart" },
    "genus": { "scientific_name": "Saccharum", "vietnamese_name": "Chi Mía", "authority": "L." },
    "species": { 
      "scientific_name": "Saccharum officinarum", 
      "vietnamese_name": "Mía", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Công nghiệp (ép nước sản xuất đường tinh luyện, mật rỉ), thực phẩm (nước giải khát), phụ phẩm (bã mía làm giấy, nhiên liệu sinh khối)."
    },
    "varieties": [
      {
        "common_name": "Mía tím (Mía bầu)", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": false,
        "description": "Cây họ Hòa thảo nhưng có thân mập to, phân đốt rõ rệt, vỏ màu tím đen. Thân chứa lượng nước đường rất lớn.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Linear", "arrangement": "Alternate", "margin": "Serrate", "length_min": 80, "length_max": 150, "width_min": 4, "width_max": 6, "petiole_length": 0 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Smooth", "color": "Tím đen", "height_min": 2.0, "height_max": 4.0 },
        "morphology_flower": { "inflorescence": "Panicle", "color": "Trắng bạc", "petal_count": 0 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Malvaceae", "vietnamese_name": "Họ Cẩm quỳ", "authority": "Juss." },
    "genus": { "scientific_name": "Durio", "vietnamese_name": "Chi Sầu riêng", "authority": "Adans." },
    "species": { 
      "scientific_name": "Durio zibethinus", 
      "vietnamese_name": "Sầu riêng", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Thực phẩm (quả được mệnh danh là 'vua của các loại trái cây', mùi rất đậm, giá trị kinh tế xuất khẩu cực kỳ cao)."
    },
    "varieties": [
      {
        "common_name": "Sầu riêng Ri6", "variant_type": "Cultivar", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thân gỗ lớn. Quả to, vỏ có gai nhọn cứng cáp. Múi sầu riêng Ri6 có màu vàng rực, hạt lép, vị béo ngậy và thơm lừng.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Oblong", "arrangement": "Alternate", "margin": "Entire", "length_min": 10, "length_max": 15, "width_min": 4, "width_max": 6, "petiole_length": 1.5 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Xám nâu", "height_min": 15.0, "height_max": 25.0 },
        "morphology_flower": { "inflorescence": "Cyme", "color": "Vàng nhạt đục", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Oxalidaceae", "vietnamese_name": "Họ Chua me đất", "authority": "R.Br." },
    "genus": { "scientific_name": "Averrhoa", "vietnamese_name": "Chi Khế", "authority": "L." },
    "species": { 
      "scientific_name": "Averrhoa carambola", 
      "vietnamese_name": "Khế", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Thực phẩm (khế ngọt ăn tươi, khế chua nấu canh chua mẻ, kho cá), cảnh quan (trồng bóng mát sân vườn)."
    },
    "varieties": [
      {
        "common_name": "Khế chua", "variant_type": "Variety", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây gỗ mọc phân cành rậm rạp. Quả có 5 múi tạo thành hình ngôi sao khi cắt ngang, chứa nhiều acid oxalic.",
        "morphology_leaf": { "leaf_type": "Compound_Pinnate", "shape": "Ovate", "arrangement": "Alternate", "margin": "Entire", "length_min": 15, "length_max": 25, "width_min": 10, "width_max": 15, "petiole_length": 3 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Nâu đỏ đục", "height_min": 3.0, "height_max": 8.0 },
        "morphology_flower": { "inflorescence": "Panicle", "color": "Tím hồng", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Cucurbitaceae", "vietnamese_name": "Họ Bầu bí", "authority": "Juss." },
    "genus": { "scientific_name": "Momordica", "vietnamese_name": "Chi Mướp đắng", "authority": "L." },
    "species": { 
      "scientific_name": "Momordica charantia", 
      "vietnamese_name": "Khổ qua (Mướp đắng)", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Thực phẩm (nấu canh dồn thịt, xào trứng), dược liệu (thanh nhiệt, giải độc gan, hỗ trợ hạ đường huyết cho người tiểu đường)."
    },
    "varieties": [
      {
        "common_name": "Khổ qua gai", "variant_type": "Cultivar", "life_form": "Climber", "is_flowering": true, "is_fruiting": true,
        "description": "Dây leo giàn bằng tua cuốn. Quả hình thoi rỗng ruột, trên mặt vỏ có nhiều u lồi lõm sần sùi, vị rất đắng.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Palmate", "arrangement": "Alternate", "margin": "Lobed", "length_min": 5, "length_max": 12, "width_min": 5, "width_max": 12, "petiole_length": 5 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Hairy", "color": "Xanh lục", "height_min": 2.0, "height_max": 5.0 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Vàng", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Asteraceae", "vietnamese_name": "Họ Cúc", "authority": "Bercht. & J.Presl" },
    "genus": { "scientific_name": "Artemisia", "vietnamese_name": "Chi Ngải", "authority": "L." },
    "species": { 
      "scientific_name": "Artemisia vulgaris", 
      "vietnamese_name": "Ngải cứu", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Dược liệu (cầm máu, điều hòa kinh nguyệt, trị đau đầu), thực phẩm (gà hầm ngải cứu, trứng rán ngải cứu)."
    },
    "varieties": [
      {
        "common_name": "Ngải cứu ta", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thảo sống lâu năm, toàn thân có mùi thơm hắc đặc trưng. Mặt dưới lá có lớp lông nhung màu trắng bạc.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Alternate", "margin": "Lobed", "length_min": 5, "length_max": 10, "width_min": 3, "width_max": 5, "petiole_length": 1 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Hairy", "color": "Trắng tía", "height_min": 0.4, "height_max": 1.0 },
        "morphology_flower": { "inflorescence": "Capitulum", "color": "Vàng nhạt", "petal_count": 0 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Phyllanthaceae", "vietnamese_name": "Họ Diệp hạ châu", "authority": "Martinov" },
    "genus": { "scientific_name": "Sauropus", "vietnamese_name": "Chi Rau ngót", "authority": "Blume" },
    "species": { 
      "scientific_name": "Sauropus androgynus", 
      "vietnamese_name": "Rau ngót (Bù ngót)", 
      "synonyms": "Breynia androgyna", 
      "authority": "(L.) Merr.",
      "uses": "Thực phẩm (rau ăn lá giàu sắt, canxi và protein, thường dùng nấu canh thịt băm), dược liệu (thanh nhiệt, tống sản dịch cho phụ nữ sau sinh)."
    },
    "varieties": [
      {
        "common_name": "Rau ngót lá tròn", "variant_type": "Cultivar", "life_form": "Shrub", "is_flowering": true, "is_fruiting": true,
        "description": "Cây bụi mọc thẳng đứng, phân nhiều cành nhỏ. Lá mọc so le hai bên cành trông như một lá kép lông chim.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Alternate", "margin": "Entire", "length_min": 3, "length_max": 6, "width_min": 1.5, "width_max": 3, "petiole_length": 0.2 },
        "morphology_stem": { "stem_type": "Shrubby", "surface": "Smooth", "color": "Xanh đậm", "height_min": 0.8, "height_max": 1.5 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Đỏ tía nhỏ xíu", "petal_count": 6 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Passifloraceae", "vietnamese_name": "Họ Lạc tiên", "authority": "Juss. ex Roussel" },
    "genus": { "scientific_name": "Passiflora", "vietnamese_name": "Chi Lạc tiên", "authority": "L." },
    "species": { 
      "scientific_name": "Passiflora edulis", 
      "vietnamese_name": "Chanh dây (Chanh leo)", 
      "synonyms": "", 
      "authority": "Sims",
      "uses": "Thực phẩm (làm nước ép giải khát rất giàu Vitamin C, pha chế cocktail, làm bánh), dược liệu (giúp an thần dễ ngủ)."
    },
    "varieties": [
      {
        "common_name": "Chanh dây vỏ tím", "variant_type": "Cultivar", "life_form": "Climber", "is_flowering": true, "is_fruiting": true,
        "description": "Dây leo bằng tua cuốn ở nách lá, thân nhẵn. Quả khi chín có vỏ màu tím sậm, ruột chứa dịch nhầy màu cam bao quanh hạt, vị chua thanh thơm lừng.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Palmate", "arrangement": "Alternate", "margin": "Lobed", "length_min": 10, "length_max": 15, "width_min": 12, "width_max": 18, "petiole_length": 4 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Smooth", "color": "Xanh lục", "height_min": 5.0, "height_max": 15.0 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Trắng tím xen kẽ", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Cucurbitaceae", "vietnamese_name": "Họ Bầu bí", "authority": "Juss." },
    "genus": { "scientific_name": "Benincasa", "vietnamese_name": "Chi Bí đao", "authority": "Savi" },
    "species": { 
      "scientific_name": "Benincasa hispida", 
      "vietnamese_name": "Bí đao (Bí xanh)", 
      "synonyms": "Cucurbita hispida", 
      "authority": "(Thunb.) Cogn.",
      "uses": "Thực phẩm (nấu canh, luộc), đồ uống (nước sâm bí đao giải nhiệt), công nghiệp thực phẩm (làm mứt bí dịp Tết)."
    },
    "varieties": [
      {
        "common_name": "Bí đao chanh", "variant_type": "Cultivar", "life_form": "Climber", "is_flowering": true, "is_fruiting": true,
        "description": "Dây leo bám giàn, toàn thân và quả non có nhiều lông tơ. Quả hình trụ thon dài, vỏ màu xanh nhạt hoặc xanh thẫm, khi già có lớp phấn trắng.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Cordate", "arrangement": "Alternate", "margin": "Dentate", "length_min": 15, "length_max": 25, "width_min": 15, "width_max": 25, "petiole_length": 8 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Hairy", "color": "Xanh lục", "height_min": 3.0, "height_max": 8.0 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Vàng", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Cucurbitaceae", "vietnamese_name": "Họ Bầu bí", "authority": "Juss." },
    "genus": { "scientific_name": "Momordica", "vietnamese_name": "Chi Mướp đắng", "authority": "L." },
    "species": { 
      "scientific_name": "Momordica cochinchinensis", 
      "vietnamese_name": "Gấc", 
      "synonyms": "Muricia cochinchinensis", 
      "authority": "(Lour.) Spreng.",
      "uses": "Thực phẩm (màng hạt gấc dùng đồ xôi tạo màu đỏ đẹp và vị ngậy), dược liệu/mỹ phẩm (chiết xuất dầu gấc chứa hàm lượng Beta-carotene và Lycopene khổng lồ làm sáng mắt, đẹp da)."
    },
    "varieties": [
      {
        "common_name": "Gấc nếp", "variant_type": "Cultivar", "life_form": "Climber", "is_flowering": true, "is_fruiting": true,
        "description": "Dây leo thân mảnh mọc khỏe, lá nhẵn chia thùy. Quả khi chín có màu đỏ cam rực rỡ, bên ngoài có các gai tù.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Palmate", "arrangement": "Alternate", "margin": "Lobed", "length_min": 12, "length_max": 20, "width_min": 12, "width_max": 20, "petiole_length": 6 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Glabrous", "color": "Xanh nhạt", "height_min": 5.0, "height_max": 15.0 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Vàng nhạt có đốm đen", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Fabaceae", "vietnamese_name": "Họ Đậu", "authority": "Lindl." },
    "genus": { "scientific_name": "Pueraria", "vietnamese_name": "Chi Sắn dây", "authority": "DC." },
    "species": { 
      "scientific_name": "Pueraria montana", 
      "vietnamese_name": "Sắn dây", 
      "synonyms": "Dolichos montanus", 
      "authority": "(Lour.) Merr.",
      "uses": "Thực phẩm/Dược liệu (rễ củ phình to chứa nhiều tinh bột được mài làm bột sắn dây pha nước uống thanh nhiệt, giải độc, trị cảm nắng)."
    },
    "varieties": [
      {
        "common_name": "Sắn dây ta", "variant_type": "Variety", "life_form": "Climber", "is_flowering": true, "is_fruiting": true,
        "description": "Dây leo quấn, toàn thân có lông tơ màu rỉ sắt bám dính. Rễ củ phát triển sâu dưới lòng đất, to và dài.",
        "morphology_leaf": { "leaf_type": "Trifoliolate", "shape": "Ovate", "arrangement": "Alternate", "margin": "Entire", "length_min": 8, "length_max": 15, "width_min": 6, "width_max": 12, "petiole_length": 10 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Hairy", "color": "Xanh tía", "height_min": 3.0, "height_max": 10.0 },
        "morphology_flower": { "inflorescence": "Raceme", "color": "Xanh tím", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Asteraceae", "vietnamese_name": "Họ Cúc", "authority": "Bercht. & J.Presl" },
    "genus": { "scientific_name": "Chrysanthemum", "vietnamese_name": "Chi Cúc", "authority": "L." },
    "species": { 
      "scientific_name": "Chrysanthemum morifolium", 
      "vietnamese_name": "Hoa cúc mâm xôi", 
      "synonyms": "Anthemis grandiflora", 
      "authority": "Ramat.",
      "uses": "Cảnh quan (trồng chậu làm cảnh dịp Tết rất được ưa chuộng nhờ hoa nở rực rỡ, tượng trưng cho sự sung túc)."
    },
    "varieties": [
      {
        "common_name": "Cúc mâm xôi vàng", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": false,
        "description": "Thân thảo mọc cụm tạo thành hình vòm cong như mâm xôi. Hoa nhỏ mọc dày đặc che kín cả lá.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Alternate", "margin": "Lobed", "length_min": 3, "length_max": 6, "width_min": 2, "width_max": 4, "petiole_length": 1 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Hairy", "color": "Xanh xám", "height_min": 0.3, "height_max": 0.6 },
        "morphology_flower": { "inflorescence": "Capitulum", "color": "Vàng rực", "petal_count": 0 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Lamiaceae", "vietnamese_name": "Họ Hoa môi", "authority": "Martinov" },
    "genus": { "scientific_name": "Perilla", "vietnamese_name": "Chi Tía tô", "authority": "L." },
    "species": { 
      "scientific_name": "Perilla frutescens", 
      "vietnamese_name": "Tía tô", 
      "synonyms": "Ocimum frutescens", 
      "authority": "(L.) Britton",
      "uses": "Thực phẩm (rau gia vị ăn sống, nấu canh), dược liệu (giải cảm, trị ho, giảm triệu chứng bệnh gút)."
    },
    "varieties": [
      {
        "common_name": "Tía tô tím", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thảo hằng năm. Toàn thân và mặt dưới lá có màu tím tía, phủ đầy lông nhám. Mùi thơm nồng đặc trưng.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Opposite", "margin": "Serrate", "length_min": 5, "length_max": 12, "width_min": 3, "width_max": 8, "petiole_length": 3 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Hairy", "color": "Tím đỏ", "height_min": 0.4, "height_max": 1.0 },
        "morphology_flower": { "inflorescence": "Raceme", "color": "Trắng nhạt đến Tím", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Convolvulaceae", "vietnamese_name": "Họ Bìm bìm", "authority": "Juss." },
    "genus": { "scientific_name": "Ipomoea", "vietnamese_name": "Chi Khoai lang", "authority": "L." },
    "species": { 
      "scientific_name": "Ipomoea aquatica", 
      "vietnamese_name": "Rau muống", 
      "synonyms": "Convolvulus repens", 
      "authority": "Forssk.",
      "uses": "Thực phẩm (loại rau ăn lá phổ biến nhất Việt Nam, dùng luộc, xào, nấu canh), thức ăn chăn nuôi."
    },
    "varieties": [
      {
        "common_name": "Rau muống nước", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thân thảo mọc bò lan trên mặt nước hoặc đất bùn ẩm. Thân rỗng rễ sinh ra từ các đốt.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Lanceolate", "arrangement": "Alternate", "margin": "Entire", "length_min": 7, "length_max": 14, "width_min": 2, "width_max": 5, "petiole_length": 6 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Smooth", "color": "Xanh nhạt hoặc Hơi đỏ", "height_min": 0.3, "height_max": 2.0 },
        "morphology_flower": { "inflorescence": "Cyme", "color": "Trắng hoặc Tím nhạt", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Sapindaceae", "vietnamese_name": "Họ Bồ hòn", "authority": "Juss." },
    "genus": { "scientific_name": "Dimocarpus", "vietnamese_name": "Chi Nhãn", "authority": "Lour." },
    "species": { 
      "scientific_name": "Dimocarpus longan", 
      "vietnamese_name": "Nhãn", 
      "synonyms": "Euphoria longan", 
      "authority": "Lour.",
      "uses": "Thực phẩm (quả tươi ngọt lịm, sấy khô làm long nhãn), dược liệu (long nhãn bổ máu, an thần)."
    },
    "varieties": [
      {
        "common_name": "Nhãn lồng Hưng Yên", "variant_type": "Cultivar", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thân gỗ lâu năm. Quả mọc thành chùm, vỏ sần màu nâu vàng, cùi dày giòn và hột nhỏ.",
        "morphology_leaf": { "leaf_type": "Compound_Pinnate", "shape": "Lanceolate", "arrangement": "Alternate", "margin": "Entire", "length_min": 15, "length_max": 30, "width_min": 4, "width_max": 8, "petiole_length": 5 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Nâu xám nứt nẻ", "height_min": 5.0, "height_max": 10.0 },
        "morphology_flower": { "inflorescence": "Panicle", "color": "Vàng nhạt", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Fabaceae", "vietnamese_name": "Họ Đậu", "authority": "Lindl." },
    "genus": { "scientific_name": "Delonix", "vietnamese_name": "Chi Phượng vĩ", "authority": "Raf." },
    "species": { 
      "scientific_name": "Delonix regia", 
      "vietnamese_name": "Phượng vĩ", 
      "synonyms": "Poinciana regia", 
      "authority": "(Bojer) Raf.",
      "uses": "Cảnh quan (trồng làm cây bóng mát tại các trường học, công viên, đường phố nhờ tán rộng và hoa nở rực rỡ vào mùa hè)."
    },
    "varieties": [
      {
        "common_name": "Phượng vĩ hoa đỏ", "variant_type": "Forma", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây gỗ lớn, tán lá xòe rộng như chiếc ô. Hoa nở đỏ rực vào khoảng tháng 5-7. Quả đậu to và dài.",
        "morphology_leaf": { "leaf_type": "Bipinnate", "shape": "Oblong", "arrangement": "Alternate", "margin": "Entire", "length_min": 30, "length_max": 50, "width_min": 15, "width_max": 25, "petiole_length": 8 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Xám trắng", "height_min": 10.0, "height_max": 15.0 },
        "morphology_flower": { "inflorescence": "Raceme", "color": "Đỏ cam", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Ochnaceae", "vietnamese_name": "Họ Mai", "authority": "DC." },
    "genus": { "scientific_name": "Ochna", "vietnamese_name": "Chi Mai", "authority": "L." },
    "species": { 
      "scientific_name": "Ochna integerrima", 
      "vietnamese_name": "Hoa mai (Mai vàng)", 
      "synonyms": "Elaeocarpus integerrimus", 
      "authority": "(Lour.) Merr.",
      "uses": "Cảnh quan (loài hoa đặc trưng không thể thiếu trong dịp Tết Nguyên Đán ở miền Nam Việt Nam)."
    },
    "varieties": [
      {
        "common_name": "Mai vàng 5 cánh", "variant_type": "Variety", "life_form": "Shrub", "is_flowering": true, "is_fruiting": true,
        "description": "Cây gỗ nhỏ hoặc cây bụi, thường rụng lá vào mùa khô để nụ hoa phát triển bung nở đúng dịp xuân.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Oblong", "arrangement": "Alternate", "margin": "Serrate", "length_min": 5, "length_max": 12, "width_min": 3, "width_max": 5, "petiole_length": 0.5 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Nâu đen", "height_min": 2.0, "height_max": 5.0 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Vàng tươi", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Amaryllidaceae", "vietnamese_name": "Họ Loa kèn", "authority": "J.St.-Hil." },
    "genus": { "scientific_name": "Allium", "vietnamese_name": "Chi Hành", "authority": "L." },
    "species": { 
      "scientific_name": "Allium fistulosum", 
      "vietnamese_name": "Hành lá (Hành hoa)", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Gia vị (loại rau nêm phổ biến nhất trong ẩm thực Việt Nam), dược liệu (giải cảm, làm toát mồ hôi)."
    },
    "varieties": [
      {
        "common_name": "Hành hương", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thảo, phần gốc phình to tạo thành củ nhỏ màu trắng. Lá hình ống rỗng bên trong, mùi rất thơm.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Linear", "arrangement": "Basal", "margin": "Entire", "length_min": 20, "length_max": 50, "width_min": 0.5, "width_max": 1.0, "petiole_length": 0 },
        "morphology_stem": { "stem_type": "Bulb", "surface": "Smooth", "color": "Trắng", "height_min": 0.05, "height_max": 0.1 },
        "morphology_flower": { "inflorescence": "Umbel", "color": "Trắng xanh", "petal_count": 6 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Poaceae", "vietnamese_name": "Họ Lúa", "authority": "Barnhart" },
    "genus": { "scientific_name": "Saccharum", "vietnamese_name": "Chi Mía", "authority": "L." },
    "species": { 
      "scientific_name": "Saccharum officinarum", 
      "vietnamese_name": "Mía", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Công nghiệp (ép nước sản xuất đường tinh luyện, mật rỉ), thực phẩm (nước giải khát), phụ phẩm (bã mía làm giấy, nhiên liệu sinh khối)."
    },
    "varieties": [
      {
        "common_name": "Mía tím (Mía bầu)", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": false,
        "description": "Cây họ Hòa thảo nhưng có thân mập to, phân đốt rõ rệt, vỏ màu tím đen. Thân chứa lượng nước đường rất lớn.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Linear", "arrangement": "Alternate", "margin": "Serrate", "length_min": 80, "length_max": 150, "width_min": 4, "width_max": 6, "petiole_length": 0 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Smooth", "color": "Tím đen", "height_min": 2.0, "height_max": 4.0 },
        "morphology_flower": { "inflorescence": "Panicle", "color": "Trắng bạc", "petal_count": 0 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Malvaceae", "vietnamese_name": "Họ Cẩm quỳ", "authority": "Juss." },
    "genus": { "scientific_name": "Durio", "vietnamese_name": "Chi Sầu riêng", "authority": "Adans." },
    "species": { 
      "scientific_name": "Durio zibethinus", 
      "vietnamese_name": "Sầu riêng", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Thực phẩm (quả được mệnh danh là 'vua của các loại trái cây', mùi rất đậm, giá trị kinh tế xuất khẩu cực kỳ cao)."
    },
    "varieties": [
      {
        "common_name": "Sầu riêng Ri6", "variant_type": "Cultivar", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thân gỗ lớn. Quả to, vỏ có gai nhọn cứng cáp. Múi sầu riêng Ri6 có màu vàng rực, hạt lép, vị béo ngậy và thơm lừng.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Oblong", "arrangement": "Alternate", "margin": "Entire", "length_min": 10, "length_max": 15, "width_min": 4, "width_max": 6, "petiole_length": 1.5 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Xám nâu", "height_min": 15.0, "height_max": 25.0 },
        "morphology_flower": { "inflorescence": "Cyme", "color": "Vàng nhạt đục", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Oxalidaceae", "vietnamese_name": "Họ Chua me đất", "authority": "R.Br." },
    "genus": { "scientific_name": "Averrhoa", "vietnamese_name": "Chi Khế", "authority": "L." },
    "species": { 
      "scientific_name": "Averrhoa carambola", 
      "vietnamese_name": "Khế", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Thực phẩm (khế ngọt ăn tươi, khế chua nấu canh chua mẻ, kho cá), cảnh quan (trồng bóng mát sân vườn)."
    },
    "varieties": [
      {
        "common_name": "Khế chua", "variant_type": "Variety", "life_form": "Tree", "is_flowering": true, "is_fruiting": true,
        "description": "Cây gỗ mọc phân cành rậm rạp. Quả có 5 múi tạo thành hình ngôi sao khi cắt ngang, chứa nhiều acid oxalic.",
        "morphology_leaf": { "leaf_type": "Compound_Pinnate", "shape": "Ovate", "arrangement": "Alternate", "margin": "Entire", "length_min": 15, "length_max": 25, "width_min": 10, "width_max": 15, "petiole_length": 3 },
        "morphology_stem": { "stem_type": "Woody", "surface": "Rough", "color": "Nâu đỏ đục", "height_min": 3.0, "height_max": 8.0 },
        "morphology_flower": { "inflorescence": "Panicle", "color": "Tím hồng", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Cucurbitaceae", "vietnamese_name": "Họ Bầu bí", "authority": "Juss." },
    "genus": { "scientific_name": "Momordica", "vietnamese_name": "Chi Mướp đắng", "authority": "L." },
    "species": { 
      "scientific_name": "Momordica charantia", 
      "vietnamese_name": "Khổ qua (Mướp đắng)", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Thực phẩm (nấu canh dồn thịt, xào trứng), dược liệu (thanh nhiệt, giải độc gan, hỗ trợ hạ đường huyết cho người tiểu đường)."
    },
    "varieties": [
      {
        "common_name": "Khổ qua gai", "variant_type": "Cultivar", "life_form": "Climber", "is_flowering": true, "is_fruiting": true,
        "description": "Dây leo giàn bằng tua cuốn. Quả hình thoi rỗng ruột, trên mặt vỏ có nhiều u lồi lõm sần sùi, vị rất đắng.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Palmate", "arrangement": "Alternate", "margin": "Lobed", "length_min": 5, "length_max": 12, "width_min": 5, "width_max": 12, "petiole_length": 5 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Hairy", "color": "Xanh lục", "height_min": 2.0, "height_max": 5.0 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Vàng", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Asteraceae", "vietnamese_name": "Họ Cúc", "authority": "Bercht. & J.Presl" },
    "genus": { "scientific_name": "Artemisia", "vietnamese_name": "Chi Ngải", "authority": "L." },
    "species": { 
      "scientific_name": "Artemisia vulgaris", 
      "vietnamese_name": "Ngải cứu", 
      "synonyms": "", 
      "authority": "L.",
      "uses": "Dược liệu (cầm máu, điều hòa kinh nguyệt, trị đau đầu), thực phẩm (gà hầm ngải cứu, trứng rán ngải cứu)."
    },
    "varieties": [
      {
        "common_name": "Ngải cứu ta", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": true,
        "description": "Cây thảo sống lâu năm, toàn thân có mùi thơm hắc đặc trưng. Mặt dưới lá có lớp lông nhung màu trắng bạc.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Alternate", "margin": "Lobed", "length_min": 5, "length_max": 10, "width_min": 3, "width_max": 5, "petiole_length": 1 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Hairy", "color": "Trắng tía", "height_min": 0.4, "height_max": 1.0 },
        "morphology_flower": { "inflorescence": "Capitulum", "color": "Vàng nhạt", "petal_count": 0 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Phyllanthaceae", "vietnamese_name": "Họ Diệp hạ châu", "authority": "Martinov" },
    "genus": { "scientific_name": "Sauropus", "vietnamese_name": "Chi Rau ngót", "authority": "Blume" },
    "species": { 
      "scientific_name": "Sauropus androgynus", 
      "vietnamese_name": "Rau ngót (Bù ngót)", 
      "synonyms": "Breynia androgyna", 
      "authority": "(L.) Merr.",
      "uses": "Thực phẩm (rau ăn lá giàu sắt, canxi và protein, thường dùng nấu canh thịt băm), dược liệu (thanh nhiệt, tống sản dịch cho phụ nữ sau sinh)."
    },
    "varieties": [
      {
        "common_name": "Rau ngót lá tròn", "variant_type": "Cultivar", "life_form": "Shrub", "is_flowering": true, "is_fruiting": true,
        "description": "Cây bụi mọc thẳng đứng, phân nhiều cành nhỏ. Lá mọc so le hai bên cành trông như một lá kép lông chim.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Alternate", "margin": "Entire", "length_min": 3, "length_max": 6, "width_min": 1.5, "width_max": 3, "petiole_length": 0.2 },
        "morphology_stem": { "stem_type": "Shrubby", "surface": "Smooth", "color": "Xanh đậm", "height_min": 0.8, "height_max": 1.5 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Đỏ tía nhỏ xíu", "petal_count": 6 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Passifloraceae", "vietnamese_name": "Họ Lạc tiên", "authority": "Juss. ex Roussel" },
    "genus": { "scientific_name": "Passiflora", "vietnamese_name": "Chi Lạc tiên", "authority": "L." },
    "species": { 
      "scientific_name": "Passiflora edulis", 
      "vietnamese_name": "Chanh dây (Chanh leo)", 
      "synonyms": "", 
      "authority": "Sims",
      "uses": "Thực phẩm (làm nước ép giải khát rất giàu Vitamin C, pha chế cocktail, làm bánh), dược liệu (giúp an thần dễ ngủ)."
    },
    "varieties": [
      {
        "common_name": "Chanh dây vỏ tím", "variant_type": "Cultivar", "life_form": "Climber", "is_flowering": true, "is_fruiting": true,
        "description": "Dây leo bằng tua cuốn ở nách lá, thân nhẵn. Quả khi chín có vỏ màu tím sậm, ruột chứa dịch nhầy màu cam bao quanh hạt, vị chua thanh thơm lừng.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Palmate", "arrangement": "Alternate", "margin": "Lobed", "length_min": 10, "length_max": 15, "width_min": 12, "width_max": 18, "petiole_length": 4 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Smooth", "color": "Xanh lục", "height_min": 5.0, "height_max": 15.0 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Trắng tím xen kẽ", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Cucurbitaceae", "vietnamese_name": "Họ Bầu bí", "authority": "Juss." },
    "genus": { "scientific_name": "Benincasa", "vietnamese_name": "Chi Bí đao", "authority": "Savi" },
    "species": { 
      "scientific_name": "Benincasa hispida", 
      "vietnamese_name": "Bí đao (Bí xanh)", 
      "synonyms": "Cucurbita hispida", 
      "authority": "(Thunb.) Cogn.",
      "uses": "Thực phẩm (nấu canh, luộc), đồ uống (nước sâm bí đao giải nhiệt), công nghiệp thực phẩm (làm mứt bí dịp Tết)."
    },
    "varieties": [
      {
        "common_name": "Bí đao chanh", "variant_type": "Cultivar", "life_form": "Climber", "is_flowering": true, "is_fruiting": true,
        "description": "Dây leo bám giàn, toàn thân và quả non có nhiều lông tơ. Quả hình trụ thon dài, vỏ màu xanh nhạt hoặc xanh thẫm, khi già có lớp phấn trắng.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Cordate", "arrangement": "Alternate", "margin": "Dentate", "length_min": 15, "length_max": 25, "width_min": 15, "width_max": 25, "petiole_length": 8 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Hairy", "color": "Xanh lục", "height_min": 3.0, "height_max": 8.0 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Vàng", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Cucurbitaceae", "vietnamese_name": "Họ Bầu bí", "authority": "Juss." },
    "genus": { "scientific_name": "Momordica", "vietnamese_name": "Chi Mướp đắng", "authority": "L." },
    "species": { 
      "scientific_name": "Momordica cochinchinensis", 
      "vietnamese_name": "Gấc", 
      "synonyms": "Muricia cochinchinensis", 
      "authority": "(Lour.) Spreng.",
      "uses": "Thực phẩm (màng hạt gấc dùng đồ xôi tạo màu đỏ đẹp và vị ngậy), dược liệu/mỹ phẩm (chiết xuất dầu gấc chứa hàm lượng Beta-carotene và Lycopene khổng lồ làm sáng mắt, đẹp da)."
    },
    "varieties": [
      {
        "common_name": "Gấc nếp", "variant_type": "Cultivar", "life_form": "Climber", "is_flowering": true, "is_fruiting": true,
        "description": "Dây leo thân mảnh mọc khỏe, lá nhẵn chia thùy. Quả khi chín có màu đỏ cam rực rỡ, bên ngoài có các gai tù.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Palmate", "arrangement": "Alternate", "margin": "Lobed", "length_min": 12, "length_max": 20, "width_min": 12, "width_max": 20, "petiole_length": 6 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Glabrous", "color": "Xanh nhạt", "height_min": 5.0, "height_max": 15.0 },
        "morphology_flower": { "inflorescence": "Solitary", "color": "Vàng nhạt có đốm đen", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Fabaceae", "vietnamese_name": "Họ Đậu", "authority": "Lindl." },
    "genus": { "scientific_name": "Pueraria", "vietnamese_name": "Chi Sắn dây", "authority": "DC." },
    "species": { 
      "scientific_name": "Pueraria montana", 
      "vietnamese_name": "Sắn dây", 
      "synonyms": "Dolichos montanus", 
      "authority": "(Lour.) Merr.",
      "uses": "Thực phẩm/Dược liệu (rễ củ phình to chứa nhiều tinh bột được mài làm bột sắn dây pha nước uống thanh nhiệt, giải độc, trị cảm nắng)."
    },
    "varieties": [
      {
        "common_name": "Sắn dây ta", "variant_type": "Variety", "life_form": "Climber", "is_flowering": true, "is_fruiting": true,
        "description": "Dây leo quấn, toàn thân có lông tơ màu rỉ sắt bám dính. Rễ củ phát triển sâu dưới lòng đất, to và dài.",
        "morphology_leaf": { "leaf_type": "Trifoliolate", "shape": "Ovate", "arrangement": "Alternate", "margin": "Entire", "length_min": 8, "length_max": 15, "width_min": 6, "width_max": 12, "petiole_length": 10 },
        "morphology_stem": { "stem_type": "Climbing", "surface": "Hairy", "color": "Xanh tía", "height_min": 3.0, "height_max": 10.0 },
        "morphology_flower": { "inflorescence": "Raceme", "color": "Xanh tím", "petal_count": 5 }
      }
    ]
  },
  {
    "family": { "scientific_name": "Asteraceae", "vietnamese_name": "Họ Cúc", "authority": "Bercht. & J.Presl" },
    "genus": { "scientific_name": "Chrysanthemum", "vietnamese_name": "Chi Cúc", "authority": "L." },
    "species": { 
      "scientific_name": "Chrysanthemum morifolium", 
      "vietnamese_name": "Hoa cúc mâm xôi", 
      "synonyms": "Anthemis grandiflora", 
      "authority": "Ramat.",
      "uses": "Cảnh quan (trồng chậu làm cảnh dịp Tết rất được ưa chuộng nhờ hoa nở rực rỡ, tượng trưng cho sự sung túc)."
    },
    "varieties": [
      {
        "common_name": "Cúc mâm xôi vàng", "variant_type": "Cultivar", "life_form": "Herb", "is_flowering": true, "is_fruiting": false,
        "description": "Thân thảo mọc cụm tạo thành hình vòm cong như mâm xôi. Hoa nhỏ mọc dày đặc che kín cả lá.",
        "morphology_leaf": { "leaf_type": "Simple", "shape": "Ovate", "arrangement": "Alternate", "margin": "Lobed", "length_min": 3, "length_max": 6, "width_min": 2, "width_max": 4, "petiole_length": 1 },
        "morphology_stem": { "stem_type": "Herbaceous", "surface": "Hairy", "color": "Xanh xám", "height_min": 0.3, "height_max": 0.6 },
        "morphology_flower": { "inflorescence": "Capitulum", "color": "Vàng rực", "petal_count": 0 }
      }
    ]
  }
];