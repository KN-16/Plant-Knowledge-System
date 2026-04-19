import React, { useState, useEffect } from 'react';
import { Badge, Modal } from 'react-bootstrap';
import { FaChevronRight, FaChevronDown, FaDna, FaSeedling, FaLeaf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Nhận thêm prop backendUrl
const TaxonomyTreeView = ({ treeData, focusedLevel, focusedId, backendUrl , uiMapping}) => {
    const navigate = useNavigate();
    const [expandedNodes, setExpandedNodes] = useState({});
    
    // State quản lý việc phóng to ảnh
    const [showImageModal, setShowImageModal] = useState(false);
    const [enlargedImageUrl, setEnlargedImageUrl] = useState('');

    useEffect(() => {
        if (treeData && treeData.length > 0) {
            const initialExpanded = {};
            treeData.forEach(fam => {
                initialExpanded[`fam-${fam.family_id}`] = true;
                fam.Genera?.forEach(gen => {
                    initialExpanded[`gen-${gen.genus_id}`] = true;
                    gen.Species?.forEach(sp => {
                        initialExpanded[`sp-${sp.species_id}`] = true;
                    });
                });
            });
            setExpandedNodes(initialExpanded);
        } else {
            setExpandedNodes({});
        }
    }, [treeData]);

    const toggleNode = (nodeId) => {
        setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
    };

    const isFocused = (level, id) => {
        if (!focusedLevel || !focusedId) return false;
        return focusedLevel === level && focusedId === id;
    };

    // Hàm xử lý khi bấm vào thumbnail (Phóng to ảnh)
    const handleImageClick = (e, url) => {
        e.stopPropagation(); // QUAN TRỌNG: Ngăn sự kiện click lan ra ngoài thẻ <div> (tránh bị chuyển trang)
        setEnlargedImageUrl(url);
        setShowImageModal(true);
    };

    if (!treeData || treeData.length === 0) {
        return <div className="text-center text-muted p-4 fst-italic">Không có dữ liệu cây phân loại.</div>;
    }

    return (
        <div className="taxonomy-tree-container p-3 p-md-4 bg-white rounded-4 shadow-sm border border-light">
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
                            <Badge bg="light" text="dark" className="ms-auto border fw-normal">Họ (Family)</Badge>
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
                                                                    // Xác định URL ảnh
                                                                    const imgUrl = variety.PlantImages && variety.PlantImages.length > 0 
                                                                        ? `${backendUrl}${variety.PlantImages[0].url}` 
                                                                        : '/default-plant.png';

                                                                    return (
                                                                    <li key={`var-${variety.variety_id}`} className="mb-1">
                                                                        <div 
                                                                            className="d-flex align-items-center p-1 rounded transition-all hover-bg-light" 
                                                                            style={{cursor: 'pointer'}}
                                                                            onClick={() => navigate(`/varieties/${variety.variety_id}`)}
                                                                            title="Click để xem chi tiết biến thể"
                                                                        >
                                                                            <span className="text-success me-2 fw-bold" style={{fontSize: '1.2rem'}}>•</span>
                                                                            
                                                                            {/* THUMBNAIL HÌNH ẢNH */}
                                                                            <img 
                                                                                src={imgUrl} 
                                                                                alt="thumbnail" 
                                                                                className="rounded object-fit-cover shadow-sm me-2 border border-light tree-thumbnail"
                                                                                style={{ width: '36px', height: '36px' }}
                                                                                onClick={(e) => handleImageClick(e, imgUrl)}
                                                                                title="Phóng to ảnh"
                                                                            />
                                                                            
                                                                            <span className="text-primary hover-underline fw-medium">
                                                                                {variety.common_name || "Chưa có tên VN"}
                                                                            </span>
                                                                            
                                                                            <span className="ms-2 text-muted fst-italic small">
                                                                                ({variety.variety_name || 'var. chưa xác định'})
                                                                            </span>
                                                                            
                                                                            {variety.variant_type && (
                                                                                <Badge bg="warning" text="dark" className="ms-2 bg-opacity-75 fw-normal" style={{fontSize: '0.65rem'}}>
                                                                                    {variety.variant_type ? uiMapping['VARIANT_TYPE'][variety.variant_type] : '-'}
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
            
            {/* MODAL HIỂN THỊ ẢNH PHÓNG TO */}
            <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
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
                .hover-underline:hover { text-decoration: underline; color: #198754 !important; }
                .tree-thumbnail { transition: transform 0.2s ease; cursor: zoom-in; }
                .tree-thumbnail:hover { transform: scale(1.1); box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important; }
            `}</style>
        </div>
    );
};

export default TaxonomyTreeView;