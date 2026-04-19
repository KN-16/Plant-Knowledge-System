import React, { useState, useEffect } from 'react';
import { Badge, Modal } from 'react-bootstrap';
import { FaChevronRight, FaChevronDown, FaDna, FaSeedling, FaLeaf } from 'react-icons/fa';

const TaxonomyTreeModal = ({ show, onHide, treeData, focusedLevel, focusedId, backendUrl, uiMapping }) => {
    const [expandedNodes, setExpandedNodes] = useState(() => {
        const initialExpanded = {};
        if (show && treeData && treeData.length > 0) {
            treeData.forEach(fam => {
                initialExpanded[`fam-${fam.family_id}`] = true;
                // Chú ý: Tùy backend trả về chữ Hoa hay chữ thường (Genera hay genera)
                const generaList = fam.Genera || fam.genera; 
                generaList?.forEach(gen => {
                    initialExpanded[`gen-${gen.genus_id}`] = true;
                    // Chú ý: Tùy backend trả về chữ Hoa hay chữ thường (Species hay species)
                    const speciesList = gen.Species || gen.species;
                    speciesList?.forEach(sp => {
                        initialExpanded[`sp-${sp.species_id}`] = true;
                    });
                });
            });
        }
        return initialExpanded;
    });
    
    // State quản lý việc phóng to ảnh (Nested Modal)
    const [showImageModal, setShowImageModal] = useState(false);
    const [enlargedImageUrl, setEnlargedImageUrl] = useState('');

    const toggleNode = (nodeId) => {
        setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
    };

    const isFocused = (level, id) => {
        if (!focusedLevel || !focusedId) return false;
        return focusedLevel === level && focusedId === id;
    };

    const handleImageClick = (e, url) => {
        e.stopPropagation(); 
        setEnlargedImageUrl(url);
        setShowImageModal(true);
    };

    return (
        <>
            {/* MODAL CÂY PHÂN LOẠI CHÍNH */}
            <Modal show={show} onHide={onHide} size="lg" centered scrollable backdrop="static">
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title className="fs-5 fw-bold"><FaDna className="me-2"/> Cây Phân Loại Hệ Thống</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3 p-md-4 bg-light">
                    {(!treeData || treeData.length === 0) ? (
                        <div className="text-center text-muted p-4 fst-italic">Không có dữ liệu cây phân loại.</div>
                    ) : (
                        <div className="taxonomy-tree-container p-3 bg-white rounded-4 shadow-sm border border-light">
                            <ul className="list-unstyled ms-0 mb-0">
                                {treeData.map(family => (
                                    <li key={`fam-${family.family_id}`} className="mb-2">
                                        {/* Cấp 1: HỌ (FAMILY) */}
                                        <div 
                                            className={`d-flex align-items-center cursor-pointer p-2 rounded transition-all ${isFocused('family', family.family_id) ? 'bg-success bg-opacity-10 border border-success border-opacity-25' : 'hover-bg-light'}`}
                                            onClick={() => toggleNode(`fam-${family.family_id}`)}
                                        >
                                            {expandedNodes[`fam-${family.family_id}`] ? <FaChevronDown className="text-muted me-2 small"/> : <FaChevronRight className="text-muted me-2 small"/>}
                                            <FaDna className="text-danger me-2"/>
                                            <span className="fw-bold fs-6">{family.scientific_name}</span>
                                            {family.vietnamese_name && <span className="ms-2 text-muted small"> - {family.vietnamese_name}</span>}
                                            <Badge bg="light" text="dark" className="ms-auto border fw-normal">Họ</Badge>
                                        </div>

                                        {/* Cấp 2: CHI (GENUS) */}
                                        {expandedNodes[`fam-${family.family_id}`] && (
                                            <ul className="list-unstyled ms-4 ps-2 border-start border-success border-opacity-25 mt-1 transition-all">
                                                {family.genera?.map(genus => (
                                                    <li key={`gen-${genus.genus_id}`} className="mb-1">
                                                        <div 
                                                            className={`d-flex align-items-center cursor-pointer p-1 rounded ${isFocused('genus', genus.genus_id) ? 'bg-success bg-opacity-10 fw-bold' : 'hover-bg-light'}`}
                                                            onClick={() => toggleNode(`gen-${genus.genus_id}`)}
                                                        >
                                                            {expandedNodes[`gen-${genus.genus_id}`] ? <FaChevronDown className="text-muted me-2 small"/> : <FaChevronRight className="text-muted me-2 small"/>}
                                                            <FaSeedling className="text-success me-2"/>
                                                            <span className="text-dark">{genus.scientific_name}</span>
                                                            {genus.vietnamese_name && <span className="ms-2 text-muted small"> - {genus.vietnamese_name}</span>}
                                                        </div>

                                                        {/* Cấp 3: LOÀI (SPECIES) */}
                                                        {expandedNodes[`gen-${genus.genus_id}`] && (
                                                            <ul className="list-unstyled ms-4 ps-2 border-start mt-1 transition-all">
                                                                {genus.Species?.map(species => (
                                                                    <li key={`sp-${species.species_id}`} className="mb-1">
                                                                        <div 
                                                                            className={`d-flex align-items-center cursor-pointer p-1 rounded ${isFocused('species', species.species_id) ? 'bg-success bg-opacity-10 fw-bold' : 'hover-bg-light'}`}
                                                                            onClick={() => toggleNode(`sp-${species.species_id}`)}
                                                                        >
                                                                            {expandedNodes[`sp-${species.species_id}`] ? <FaChevronDown className="text-muted me-2 small"/> : <FaChevronRight className="text-muted me-2 small"/>}
                                                                            <FaLeaf className="text-success opacity-75 me-2"/>
                                                                            <span className="fst-italic text-dark">{species.scientific_name}</span>
                                                                            {species.vietnamese_name && <span className="ms-2 text-muted small fw-normal"> - {species.vietnamese_name}</span>}
                                                                        </div>

                                                                        {/* Cấp 4: BIẾN THỂ (VARIETY) */}
                                                                        {expandedNodes[`sp-${species.species_id}`] && (
                                                                            <ul className="list-unstyled ms-4 ps-3 mt-1 border-start border-light">
                                                                                {species.Varieties?.map(variety => {
                                                                                    const imgUrl = variety.PlantImages && variety.PlantImages.length > 0 
                                                                                        ? `${backendUrl}${variety.PlantImages[0].url}` 
                                                                                        : '/default-plant.png';

                                                                                    // Kiểm tra xem variety này có phải là đối tượng đang được click không
                                                                                    const isHighlighted = isFocused('variety', variety.variety_id);

                                                                                    return (
                                                                                    <li key={`var-${variety.variety_id}`} className="mb-1">
                                                                                        <div 
                                                                                            // THAY ĐỔI LỚN TẠI ĐÂY: CSS Nổi bật nếu isHighlighted = true
                                                                                            className={`d-flex align-items-center p-2 rounded transition-all ${
                                                                                                isHighlighted 
                                                                                                    ? 'bg-warning bg-opacity-25 border border-warning border-2 shadow-sm' // Nổi bật
                                                                                                    : 'hover-bg-light border border-transparent' // Bình thường
                                                                                            }`}
                                                                                        >
                                                                                            <span className={`me-2 fw-bold ${isHighlighted ? 'text-warning fs-5' : 'text-success fs-6'}`}>
                                                                                                {isHighlighted ? '★' : '•'}
                                                                                            </span>
                                                                                            
                                                                                            {/* THUMBNAIL HÌNH ẢNH */}
                                                                                            <img 
                                                                                                src={imgUrl} 
                                                                                                alt="thumbnail" 
                                                                                                className={`rounded object-fit-cover me-2 tree-thumbnail cursor-pointer ${isHighlighted ? 'shadow' : 'shadow-sm border border-light'}`}
                                                                                                style={{ 
                                                                                                    width: isHighlighted ? '42px' : '36px', // Ảnh to hơn chút nếu nổi bật
                                                                                                    height: isHighlighted ? '42px' : '36px' 
                                                                                                }}
                                                                                                onClick={(e) => handleImageClick(e, imgUrl)}
                                                                                                title="Phóng to ảnh"
                                                                                            />
                                                                                            
                                                                                            <div className="d-flex flex-column">
                                                                                                <span className={`fw-medium ${isHighlighted ? 'text-dark fw-bold fs-6' : 'text-dark'}`}>
                                                                                                    {variety.common_name || "Chưa có tên VN"}
                                                                                                </span>
                                                                                                
                                                                                                <span className="text-muted fst-italic" style={{ fontSize: '0.75rem' }}>
                                                                                                    ({variety.variety_name || 'var. chưa xác định'})
                                                                                                </span>
                                                                                            </div>
                                                                                            
                                                                                            {variety.variant_type && (
                                                                                                <Badge 
                                                                                                    bg={isHighlighted ? "danger" : "warning"} 
                                                                                                    text={isHighlighted ? "white" : "dark"} 
                                                                                                    className={`ms-auto bg-opacity-75 fw-normal ${isHighlighted ? 'shadow-sm' : ''}`} 
                                                                                                    style={{fontSize: '0.65rem'}}
                                                                                                >
                                                                                                    {uiMapping?.VARIANT_TYPE ? uiMapping['VARIANT_TYPE'][variety.variant_type] : variety.variant_type}
                                                                                                </Badge>
                                                                                            )}
                                                                                        </div>
                                                                                    </li>
                                                                                )})}
                                                                                {(!species.Varieties || species.Varieties.length === 0) && (
                                                                                    <li className="text-muted small ms-3 fst-italic py-1">Chưa ghi nhận biến thể nội loài.</li>
                                                                                )}
                                                                            </ul>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* MODAL HIỂN THỊ ẢNH PHÓNG TO (Nested Modal) */}
            <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg" style={{ zIndex: 1060 }}>
                <Modal.Header closeButton className="border-0 pb-0 bg-dark" variant="dark"></Modal.Header>
                <Modal.Body className="text-center p-0 bg-dark rounded-bottom">
                    <img 
                        src={enlargedImageUrl} 
                        alt="Enlarged" 
                        className="img-fluid rounded-bottom" 
                        style={{ maxHeight: '85vh', objectFit: 'contain', width: '100%' }} 
                    />
                </Modal.Body>
            </Modal>

            <style>{`
                .hover-bg-light:hover { background-color: #f1f8f4; }
                .cursor-pointer { cursor: pointer; }
                .tree-thumbnail { transition: transform 0.2s ease; cursor: zoom-in; }
                .tree-thumbnail:hover { transform: scale(1.1); box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important; }
            `}</style>
        </>
    );
};

export default TaxonomyTreeModal;