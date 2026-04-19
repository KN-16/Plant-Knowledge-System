import React, { useState } from 'react';
import { Modal, Table, Button, Badge } from 'react-bootstrap';
import { FaTimes, FaGlobeAsia, FaLeaf, FaSeedling, FaPalette, FaDna, FaTree, FaRulerCombined, FaChevronDown, FaChevronUp} from 'react-icons/fa';

const CompareModal = ({ show, onHide, compareData, onRemoveItem, backendUrl, uiMapping }) => {
    
    // Hàm hỗ trợ render dữ liệu trống
    const renderData = (data, suffix = '', prefix = '') => {
        if (data === null || data === undefined || data === '') return <span className="text-muted d-block text-center">-</span>;
        return <span>{prefix} {data} {suffix}</span>;
    };

    const [expandedGroups, setExpandedGroups] = useState({
        general: true,
        leaf: false,
        stem: false,
        flower: false
    });

    // Hàm trigger Đóng/Mở
    const toggleGroup = (groupName) => {
        setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" centered className="compare-modal" fullscreen="lg-down">
            <Modal.Header closeButton className="bg-success text-white border-0 py-3">
                <Modal.Title className="fw-bold d-flex align-items-center fs-5">
                    <FaSeedling className="me-2 text-warning"/> So Sánh Hình Thái Thực Vật
                </Modal.Title>
            </Modal.Header>
            
            {/* Modal Body không có padding để Table full viền */}
            <Modal.Body className="p-0 bg-light custom-scrollbar" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
                <Table responsive bordered hover className="text-center align-middle mb-0 compare-table bg-white">
                    
                    {/* STICKY HEADER: Giữ cố định hàng chứa hình ảnh khi cuộn */}
                    <thead className="position-sticky top-0 z-3 bg-white shadow-sm">
                        <tr>
                            <th className="text-start align-bottom p-3 bg-light border-end-0" style={{ minWidth: '200px', width: '20%' }}>
                                <h6 className="fw-bold text-success mb-0">Tiêu chí so sánh</h6>
                                <div className="text-muted small fw-normal mt-1">Đối chiếu {compareData.length} mẫu vật</div>
                            </th>
                            
                            {compareData.map(item => (
                                <th key={item.variety_id} style={{ minWidth: '250px', width: `${80 / compareData.length}%` }} className="p-3 bg-white position-relative">
                                    {/* Nút xóa item khỏi danh sách so sánh */}
                                    <Button 
                                        variant="danger" 
                                        className="position-absolute top-0 end-0 rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm m-2 transition-all hover-scale" 
                                        style={{ width: '26px', height: '26px', zIndex: 10 }}
                                        onClick={() => onRemoveItem(item)}
                                        title="Xóa khỏi so sánh"
                                    >
                                        <FaTimes size={12} />
                                    </Button>

                                    {/* Hình ảnh mẫu vật */}
                                    <div className="rounded-3 overflow-hidden shadow-sm mb-3 position-relative" 
                                    style={{ height: '160px' }}>
                                        <img 
                                            src={item.PlantImages?.length > 0 ? `${backendUrl}${item.PlantImages[0].url}` : '/default-plant.png'} 
                                            alt={item.common_name} 
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "contain"
                                            }} 
                                        />
                                    </div>

                                    {/* Tên khoa học & Tên thường gọi */}
                                    <Badge bg="success" className="mb-2 shadow-sm fst-italic">
                                        {item.Species?.scientific_name}
                                    </Badge>
                                    <h6 className="fw-bold text-dark mb-1 lh-base">{item.common_name || item.variety_name}</h6>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    
                    <tbody>
                        {/* --- NHÓM 1: PHÂN LOẠI & THÔNG TIN CHUNG --- */}
                        <tr 
                                                    className="table-success opacity-75 cursor-pointer" 
                                                    onClick={() => toggleGroup('general')}
                                                    style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                                                >
                                                    <td colSpan={compareData.length + 1} className="text-start fw-bold py-2">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span><FaDna className="me-2"/> Thông tin chung & Phân loại</span>
                                                            {expandedGroups.general ? <FaChevronUp className="text-muted"/> : <FaChevronDown className="text-muted"/>}
                                                        </div>
                                                    </td>
                        </tr>
                        {expandedGroups.general && (
                            <>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Họ (Family)</td>
                            {compareData.map(item => <td key={`fam-${item.variety_id}`}>{renderData(item.Species?.Genus?.Family?.vietnamese_name)} <br/><small className="text-muted fst-italic">{item.Species?.Genus?.Family?.scientific_name}</small></td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Chi (Genus)</td>
                            {compareData.map(item => <td key={`gen-${item.variety_id}`}>{renderData(item.Species?.Genus?.vietnamese_name)} <br/><small className="text-muted fst-italic">{item.Species?.Genus?.scientific_name}</small></td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Loài (Species)</td>
                            {compareData.map(item => <td key={`sp-${item.variety_id}`}>{renderData(item.Species?.vietnamese_name)} <br/><small className="text-muted fst-italic">{item.Species?.scientific_name}</small></td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Dạng sống</td>
                            {compareData.map(item => <td key={`lf-${item.variety_id}`}>{renderData(item.life_form ? uiMapping.LIFE_FORM[item.life_form] : '')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Có hoa </td>
                            {compareData.map(item => <td key={`lf-${item.variety_id}`}>{renderData(item.is_flowering ? 'Có' : 'Không')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Có quả </td>
                            {compareData.map(item => <td key={`lf-${item.variety_id}`}>{renderData(item.is_fruiting ? 'Có' : 'Không')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Đặc điểm nhận dạng</td>
                            {compareData.map(item => <td key={`df-${item.variety_id}`} className="text-start small px-3">{renderData(item.distinctive_feature)}</td>)}
                        </tr>
                            </>
                        )}

                        
                        {/* --- NHÓM 2: HÌNH THÁI LÁ --- */}
                        <tr 
                                                    className="table-success opacity-75 cursor-pointer" 
                                                    onClick={() => toggleGroup('leaf')}
                                                    style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                                                >
                                                    <td colSpan={compareData.length + 1} className="text-start fw-bold py-2">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span><FaLeaf className="me-2"/> Đặc điểm Hình thái Lá</span>
                                                            {expandedGroups.leaf ? <FaChevronUp className="text-muted"/> : <FaChevronDown className="text-muted"/>}
                                                        </div>
                                                    </td>
                                                </tr>
                       {expandedGroups.leaf && (
                            <>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Kiểu lá</td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData( item.MorphologyLeaf?.leaf_type ? uiMapping.LEAF_TYPE[item.MorphologyLeaf?.leaf_type] : '')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Hình dáng</td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData( item.MorphologyLeaf?.shape ? uiMapping.LEAF_SHAPE[item.MorphologyLeaf?.shape] : '')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Cách mọc</td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData(item.MorphologyLeaf?.arrangement ? uiMapping.LEAF_ARRANGEMENT[item.MorphologyLeaf?.arrangement] : '')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Mép lá</td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData(item.MorphologyLeaf?.margin ? uiMapping.LEAF_MARGIN[item.MorphologyLeaf?.margin] : '')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Dài tối thiểu </td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData(item.MorphologyLeaf?.length_min ? item.MorphologyLeaf?.length_min + ' cm' : '')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Dài tối đa </td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData(item.MorphologyLeaf?.length_max ? item.MorphologyLeaf?.length_max + ' cm' : '')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Rộng tối thiểu </td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData(item.MorphologyLeaf?.width_min ? item.MorphologyLeaf?.width_min + ' cm' : '')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Rộng tối đa </td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData(item.MorphologyLeaf?.width_max ? item.MorphologyLeaf?.width_max + ' cm' : '')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Độ dài cuống lá </td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData(item.MorphologyLeaf?.petiole_length ? item.MorphologyLeaf?.petiole_length + ' cm' : '')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Đặc điểm lá</td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData(item.MorphologyLeaf?.description)}</td>)}
                        </tr>
                            </>
                        )}
                        
                        {/* --- NHÓM 3: HÌNH THÁI THÂN --- */}
                        <tr 
                            className="table-success opacity-75 cursor-pointer" 
                            onClick={() => toggleGroup('stem')}
                            style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                        >
                            <td colSpan={compareData.length + 1} className="text-start fw-bold py-2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span><FaTree className="me-2"/> Đặc điểm Hình thái Thân</span>
                                    {expandedGroups.stem ? <FaChevronUp className="text-muted"/> : <FaChevronDown className="text-muted"/>}
                                </div>
                            </td>
                        </tr>
                       {expandedGroups.stem && (
                            <>


                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Kiểu thân</td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData(item.MorphologyStem?.stem_type ? uiMapping.STEM_TYPE[item.MorphologyStem.stem_type] : '')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Bề mặt thân</td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData(item.MorphologyStem?.surface ? uiMapping.STEM_SURFACE[item.MorphologyStem.surface] : '')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Màu sắc</td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData(item.MorphologyStem?.color)}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Chiều cao tối thiểu</td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData(item.MorphologyStem?.height_min, 'cm')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Chiều cao tối đa</td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData(item.MorphologyStem?.height_max, 'cm')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Đặc điểm thân</td>
                            {compareData.map(item => <td key={`lt-${item.variety_id}`}>{renderData(item.MorphologyStem?.description)}</td>)}
                        </tr>
                            </>
                        )}


                        {/* --- NHÓM 4: HÌNH THÁI HOA --- */}
                        <tr 
                            className="table-success opacity-75 cursor-pointer" 
                            onClick={() => toggleGroup('flower')}
                            style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                        >
                            <td colSpan={compareData.length + 1} className="text-start fw-bold py-2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span><FaPalette className="me-2"/> Đặc điểm Hình thái Hoa</span>
                                    {expandedGroups.flower ? <FaChevronUp className="text-muted"/> : <FaChevronDown className="text-muted"/>}
                                </div>
                            </td>
                        </tr>
                          {expandedGroups.flower && (
                            <>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Cụm hoa (Inflorescence)</td>
                            {compareData.map(item => <td key={`finfl-${item.variety_id}`}>{renderData(item.MorphologyFlower?.inflorescence ? uiMapping.INFLORESCENCE[item.MorphologyFlower.inflorescence] : '')}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Màu sắc hoa</td>
                            {compareData.map(item => <td key={`fcol-${item.variety_id}`}>{renderData(item.MorphologyFlower?.color)}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Số cánh hoa</td>
                            {compareData.map(item => <td key={`fpetal-${item.variety_id}`}>{renderData(item.MorphologyFlower?.petal_count)}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Mùa hoa nở</td>
                            {compareData.map(item => <td key={`fbloom-${item.variety_id}`}>{renderData(item.MorphologyFlower?.blooming_season)}</td>)}
                        </tr>
                        <tr>
                            <td className="text-start fw-bold bg-light text-muted">Đặc điểm hoa</td>
                            {compareData.map(item => <td key={`fl-${item.variety_id}`}>{renderData(item.MorphologyFlower?.description)}</td>)}
                        </tr>
                            </>
                        )}
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    );
};

export default CompareModal;