import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Card, Spinner, Modal, Table, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLeaf, FaTree, FaPalette, FaGlobeAsia, FaDna, FaArrowLeft, FaInfoCircle, FaEye, FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp, FaMapMarkerAlt } from 'react-icons/fa';
import PartImageCarousel from '../../components/common/PartImageCarousel';
import publicService from '../../services/publicService';
import { Helmet } from 'react-helmet-async';

const VarietyDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    const [variety, setVariety] = useState(null);
    const [uiMapping, setUiMapping] = useState({});
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showTaxonomyModal, setShowTaxonomyModal] = useState(false);
    const [showDistModal, setShowDistModal] = useState(false);
    const [enlargedImg, setEnlargedImage] = useState(null);

    // State điều khiển đóng/mở hình thái (ẩn bằng CSS, không unmount)
    const [expandedSections, setExpandedSections] = useState({
        leaf: true,
        stem: true,
        flower: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    useEffect(() => {
        const fetchDetailData = async () => {
            try {
                const [detailRes, mappingRes] = await Promise.all([
                    publicService.getVarietyDetail(id),
                    publicService.getUIEnumMapping()
                ]);
                
                setVariety(detailRes.data);
                setUiMapping(mappingRes);
                handleViewCountLogic(id); 
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetailData();
    }, [id]);

    const handleViewCountLogic = async (varietyId) => {
        let viewedList = sessionStorage.getItem('viewed_varieties');
        viewedList = viewedList ? JSON.parse(viewedList) : [];

        if (!viewedList.includes(varietyId)) {
            try {
                await publicService.incrementView(varietyId);
                viewedList.push(varietyId);
                sessionStorage.setItem('viewed_varieties', JSON.stringify(viewedList));
            } catch (error) {
                console.error("Lỗi tăng view", error);
            }
        }
    };

    if (loading) return <div className="text-center py-5 mt-5"><Spinner animation="border" variant="success" /></div>;
    if (!variety) return <div className="text-center py-5"><h4>Không tìm thấy dữ liệu mẫu vật này.</h4></div>;

    // Lọc hình ảnh
    const getImagesByPart = (partType) => variety.PlantImages?.filter(img => img.part_type === partType) || [];
    const leafImages = getImagesByPart('Leaf');
    const stemImages = getImagesByPart('Stem');
    const flowerImages = getImagesByPart('Flower');
    const allImages = variety.PlantImages || [];
    
    const coverImage = allImages.find(img => img.is_background)?.url || allImages[0]?.url;
    const coverUrl = coverImage ? `${backendUrl}${coverImage}` : '/default-plant.png';

    // Helpers Render Data
    const renderBoolean = (value) => {
        return value 
            ? <span className="text-success"><FaCheckCircle className="me-1"/> Có</span>
            : <span className="text-muted"><FaTimesCircle className="me-1"/> Không</span>;
    };

    const renderField = (value, suffix = '') => {
        if (value === null || value === undefined || value === '') {
            return <span className="text-muted fst-italic fw-normal opacity-75">Chưa ghi nhận</span>;
        }
        return <span className="fw-bold text-dark">{value} {suffix}</span>;
    };

    const renderRange = (min, max, unit = '') => {
        if (!min && !max) {
            return <span className="text-muted fst-italic fw-normal opacity-75">Chưa ghi nhận</span>;
        }
        // Thêm class text-nowrap để các số và đơn vị (vd: 3 - 4 cm) KHÔNG BAO GIỜ bị rớt dòng tách rời nhau
        return <span className="fw-bold text-dark text-nowrap">{min || '?'} - {max || '?'} {unit}</span>;
    };

    return (
        <div className="bg-light min-vh-100 pb-5 font-sans">
         
            {/* THANH ĐIỀU HƯỚNG TRÊN CÙNG */}
            <div className="bg-white border-bottom py-3 shadow-sm mb-4">
                <Container>
                    <Button variant="link" className="text-decoration-none text-muted p-0 d-flex align-items-center hover-text-success" onClick={() => navigate(-1)}>
                        <FaArrowLeft className="me-2"/> Trở về danh sách
                    </Button>
                </Container>
            </div>
            <Helmet>
                <title>PlantDB | Chi tiết thực vật</title>
                <meta name="description" content={`Thông tin chi tiết về mẫu vật ${variety.common_name}`} />
            </Helmet>
            <Container>
                {/* PROFILE HEADER */}
                <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                    <Card.Body className="p-0">
                        <Row className="g-0">
                            <Col md={5} lg={4} className="bg-dark position-relative" style={{ minHeight: '300px' }}>
                                <img src={coverUrl} className="w-100 h-100 object-fit-cover cursor-zoom-in" alt="Cover" onClick={() => setEnlargedImage(coverUrl)} />
                                <Badge bg="dark" className="position-absolute bottom-0 end-0 m-3 bg-opacity-75 px-3 py-2 d-flex align-items-center">
                                    <FaEye className="me-2 text-warning"/> {variety.view_count || 0} Lượt xem
                                </Badge>
                            </Col>

                            <Col md={7} lg={8} className="p-4 p-lg-5 d-flex flex-column justify-content-center bg-white">
                                <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                                    <Badge bg="success" className="px-3 py-2 fw-medium shadow-sm border border-success">{variety.code}</Badge>
                                    {variety.variant_type && <Badge bg="warning" text="dark" className="px-3 py-2 fw-medium shadow-sm">{uiMapping.VARIANT_TYPE?.[variety.variant_type] || variety.variant_type}</Badge>}
                                </div>
                                
                                <h1 className="fw-bolder text-dark mb-1 lh-base">{variety.common_name || variety.variety_name || 'Đang cập nhật'}</h1>
                                <h4 className="fst-italic fw-normal text-muted mb-4">
                                    {variety.Species?.scientific_name} {variety.variety_name && <span className="text-primary">{variety.variety_name?.startsWith('var.') ? `${variety.variety_name}` : `var. ${variety.variety_name}`}</span>}
                                </h4>

                                <Row className="g-3 border-top pt-3">
                                    <Col sm={6}>
                                        <div className="text-muted small mb-1">Dạng sống (Life Form):</div>
                                        <div>{renderField(variety.life_form ? uiMapping.LIFE_FORM?.[variety.life_form] || variety.life_form : null)}</div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="text-muted small mb-1">Cơ quan/Tác giả công bố (Authority):</div>
                                        <div>{renderField(variety.authority)}</div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="text-muted small mb-1">Khả năng ra hoa:</div>
                                        <div className="fw-medium text-dark">{renderBoolean(variety.is_flowering)}</div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="text-muted small mb-1">Khả năng đậu quả:</div>
                                        <div className="fw-medium text-dark">{renderBoolean(variety.is_fruiting)}</div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Row className="g-4">
                    {/* CỘT CHÍNH: HÌNH THÁI VÀ MÔ TẢ CHI TIẾT */}
                    <Col lg={8}>
                        
                        {/* Đặc điểm nhận dạng & Mô tả */}
                        <Card className="border-0 shadow-sm rounded-4 mb-4">
                            <Card.Body className="p-4 p-md-5">
                                <h5 className="fw-bold text-success border-bottom border-success border-opacity-25 pb-3 mb-4">Đặc Điểm Nhận Dạng</h5>
                                <p className="lh-lg text-dark text-justify">{variety.distinctive_feature || <span className="fst-italic text-muted">Chưa cập nhật thông tin nhận dạng.</span>}</p>
                                
                                {variety.description && (
                                    <>
                                        <h5 className="fw-bold text-success border-bottom border-success border-opacity-25 pb-3 mb-4 mt-5">Mô Tả Sinh Học Chi Tiết</h5>
                                        <p className="lh-lg text-muted text-justify">{variety.description}</p>
                                    </>
                                )}
                            </Card.Body>
                        </Card>

                        {/* Hình thái LÁ */}
                        <Card className="border-0 shadow-sm rounded-4 mb-4 border-start border-success border-4 overflow-hidden">
                            <div 
                                className="bg-white p-4 cursor-pointer d-flex justify-content-between align-items-center hover-bg-light transition-all"
                                onClick={() => toggleSection('leaf')}
                            >
                                <h5 className="fw-bold text-success mb-0 d-flex align-items-center"><FaLeaf className="me-3"/> Cấu Tạo Hình Thái Lá</h5>
                                {expandedSections.leaf ? <FaChevronUp className="text-muted"/> : <FaChevronDown className="text-muted"/>}
                            </div>
                            <div className={expandedSections.leaf ? 'd-block' : 'd-none'}>
                                <Card.Body className="p-4 p-md-5 pt-0 border-top">
                                    {!variety.MorphologyLeaf ? (
                                        <div className="text-muted fst-italic py-3">Chưa có dữ liệu chi tiết hình thái Lá.</div>
                                    ) : (
                                        <>
                                            <Row className="g-3 mb-4">
                                                {/* Hàng 1: Các thuộc tính ngắn (Kiểu, dáng, mọc, mép) */}
                                                <Col xs={6} md="auto"><div className="p-3 bg-light rounded h-100"><small className="text-muted d-block mb-1">Kiểu lá</small>{renderField(uiMapping.LEAF_TYPE?.[variety.MorphologyLeaf.leaf_type] || variety.MorphologyLeaf.leaf_type)}</div></Col>
                                                <Col xs={6} md="auto"><div className="p-3 bg-light rounded h-100"><small className="text-muted d-block mb-1">Hình dáng</small>{renderField(uiMapping.LEAF_SHAPE?.[variety.MorphologyLeaf.shape] || variety.MorphologyLeaf.shape)}</div></Col>
                                                <Col xs={6} md="auto"><div className="p-3 bg-light rounded h-100"><small className="text-muted d-block mb-1">Cách mọc</small>{renderField(uiMapping.LEAF_ARRANGEMENT?.[variety.MorphologyLeaf.arrangement] || variety.MorphologyLeaf.arrangement)}</div></Col>
                                                <Col xs={6} md><div className="p-3 bg-light rounded h-100"><small className="text-muted d-block mb-1">Mép lá</small>{renderField(uiMapping.LEAF_MARGIN?.[variety.MorphologyLeaf.margin] || variety.MorphologyLeaf.margin)}</div></Col>
                                            </Row>
                                            
                                            <Row className="g-3 mb-4">
                                                {/* Hàng 2: Các kích thước. 
                                                    Dùng md="auto" để ô tự mở rộng theo chiều ngang. 
                                                    Dùng xs={12} để trên điện thoại mỗi ô tự chiếm 1 hàng cho dễ nhìn. 
                                                */}
                                                <Col xs={12} md="auto">
                                                    <div className="p-3 bg-light rounded h-100">
                                                        <small className="text-muted d-block mb-1">Dài lá (Khoảng)</small>
                                                        {renderRange(variety.MorphologyLeaf.length_min, variety.MorphologyLeaf.length_max, 'cm')}
                                                    </div>
                                                </Col>
                                                
                                                <Col xs={12} md="auto">
                                                    <div className="p-3 bg-light rounded h-100">
                                                        <small className="text-muted d-block mb-1">Rộng lá (Khoảng)</small>
                                                        {renderRange(variety.MorphologyLeaf.width_min, variety.MorphologyLeaf.width_max, 'cm')}
                                                    </div>
                                                </Col>
                                                
                                                {/* Cột cuối cùng chỉ dùng md (không số, không auto) để nó tự giãn ra lấp đầy hàng */}
                                                <Col xs={12} md>
                                                    <div className="p-3 bg-light rounded h-100">
                                                        <small className="text-muted d-block mb-1">Cuống lá (Khoảng)</small>
                                                        <div className="text-nowrap">{renderField(variety.MorphologyLeaf.petiole_length, 'cm')}</div>
                                                    </div>
                                                </Col>
                                                
                                                <Col xs={12}>
                                                    <div className="p-3 bg-light rounded">
                                                        <small className="text-muted d-block mb-1">Mô tả chi tiết</small>
                                                        {renderField(variety.MorphologyLeaf.description)}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </>
                                    )}
                                    <PartImageCarousel images={leafImages} backendUrl={backendUrl} onImageClick={setEnlargedImage} isModalOpen={!!enlargedImg}/>
                                </Card.Body>
                            </div>
                        </Card>

                        {/* Hình thái THÂN */}
                        <Card className="border-0 shadow-sm rounded-4 mb-4 border-start border-success border-4 overflow-hidden">
                            <div 
                                className="bg-white p-4 cursor-pointer d-flex justify-content-between align-items-center hover-bg-light transition-all"
                                onClick={() => toggleSection('stem')}
                            >
                                <h5 className="fw-bold text-success mb-0 d-flex align-items-center"><FaTree className="me-3"/> Cấu Tạo Hình Thái Thân</h5>
                                {expandedSections.stem ? <FaChevronUp className="text-muted"/> : <FaChevronDown className="text-muted"/>}
                            </div>
                            <div className={expandedSections.stem ? 'd-block' : 'd-none'}>
                                <Card.Body className="p-4 p-md-5 pt-0 border-top">
                                    {!variety.MorphologyStem ? (
                                        <div className="text-muted fst-italic py-3">Chưa có dữ liệu chi tiết hình thái Thân.</div>
                                    ) : (
                                        <>
                                            <Row className="g-3 mb-4">
                                                <Col sm={6} md={4}><div className="p-3 bg-light rounded h-100"><small className="text-muted d-block mb-1">Kiểu thân</small>{renderField(variety.MorphologyStem.stem_type ? uiMapping.STEM_TYPE?.[variety.MorphologyStem.stem_type] : null)}</div></Col>
                                                <Col sm={6} md={4}><div className="p-3 bg-light rounded h-100"><small className="text-muted d-block mb-1">Màu sắc</small>{renderField(variety.MorphologyStem.color)}</div></Col>
                                                <Col sm={12} md={4}><div className="p-3 bg-light rounded h-100"><small className="text-muted d-block mb-1">Bề mặt thân</small>{renderField(variety.MorphologyStem.surface ? uiMapping.STEM_SURFACE?.[variety.MorphologyStem.surface] : null)}</div></Col>
                                                
                                                <Col sm={12} md={12}><div className="p-3 bg-light rounded h-100"><small className="text-muted d-block mb-1">Chiều cao cây (Khoảng)</small>{renderRange(variety.MorphologyStem.height_min, variety.MorphologyStem.height_max, 'm')}</div></Col>
                                                
                                                <Col xs={12}><div className="p-3 bg-light rounded"><small className="text-muted d-block mb-1">Mô tả chi tiết</small>{renderField(variety.MorphologyStem.description)}</div></Col>
                                            </Row>
                                        </>
                                    )}
                                    <PartImageCarousel images={stemImages} backendUrl={backendUrl} onImageClick={setEnlargedImage} isModalOpen={!!enlargedImg}/>
                                </Card.Body>
                            </div>
                        </Card>

                        {/* Hình thái HOA */}
                        <Card className="border-0 shadow-sm rounded-4 mb-4 border-start border-success border-4 overflow-hidden">
                            <div 
                                className="bg-white p-4 cursor-pointer d-flex justify-content-between align-items-center hover-bg-light transition-all"
                                onClick={() => toggleSection('flower')}
                            >
                                <h5 className="fw-bold text-success mb-0 d-flex align-items-center"><FaPalette className="me-3"/> Cấu Tạo Hình Thái Hoa</h5>
                                {expandedSections.flower ? <FaChevronUp className="text-muted"/> : <FaChevronDown className="text-muted"/>}
                            </div>
                            <div className={expandedSections.flower ? 'd-block' : 'd-none'}>
                                <Card.Body className="p-4 p-md-5 pt-0 border-top">
                                    {!variety.MorphologyFlower ? (
                                        <div className="text-muted fst-italic py-3">Chưa có dữ liệu chi tiết hình thái Hoa.</div>
                                    ) : (
                                        <>
                                            <Row className="g-3 mb-4">
                                                <Col sm={6} md="auto"><div className="p-3 bg-light rounded h-100"><small className="text-muted d-block mb-1">Cụm hoa</small>{renderField(variety.MorphologyFlower.inflorescence ? uiMapping.INFLORESCENCE?.[variety.MorphologyFlower.inflorescence] : null)}</div></Col>
                                                <Col sm={6} md="auto"><div className="p-3 bg-light rounded h-100"><small className="text-muted d-block mb-1">Màu hoa</small>{renderField(variety.MorphologyFlower.color)}</div></Col>
                                                <Col sm={6} md ><div className="p-3 bg-light rounded h-100"><small className="text-muted d-block mb-1">Số cánh hoa</small>{renderField(variety.MorphologyFlower.petal_count)}</div></Col>
                                            </Row>
                                            
                                            <Row className="g-3 mb-4">    
                                                <Col sm={6} md ><div className="p-3 bg-light rounded"><small className="text-muted d-block mb-1">Mùa nở</small>{renderField(variety.MorphologyFlower.blooming_season)}</div></Col>
                                                
                                                <Col xs={12}><div className="p-3 bg-light rounded"><small className="text-muted d-block mb-1">Mô tả chi tiết</small>{renderField(variety.MorphologyFlower.description)}</div></Col>
                                            </Row>
                                        </>
                                    )}
                                    <PartImageCarousel images={flowerImages} backendUrl={backendUrl} onImageClick={setEnlargedImage} isModalOpen={!!enlargedImg}/>
                                </Card.Body>
                            </div>
                        </Card>
                    </Col>

                    {/* CỘT SIDEBAR: PHÂN LOẠI & PHÂN BỐ */}
                    <Col lg={4}>
                        
                        {/* Thẻ Phân loại học (Taxonomy) rút gọn */}
                        <Card className="border-0 shadow-sm rounded-4 mb-4 bg-success bg-opacity-10 border border-success border-opacity-25">
                            <Card.Body className="p-4">
                                <h6 className="fw-bold text-success border-bottom border-success border-opacity-25 pb-3 mb-3">
                                    <FaDna className="me-2"/> Hệ Thống Phân Loại
                                </h6>
                                <div className="mb-2">
                                    <span className="text-muted small">Họ (Family): </span><br/>
                                    <b className="text-dark fs-6">{variety.Species?.Genus?.Family?.vietnamese_name || '-'}</b> <br/><i className="text-muted small">({variety.Species?.Genus?.Family?.scientific_name || '-'})</i>
                                </div>
                                <hr className="border-success border-opacity-25 my-2"/>
                                <div className="mb-2">
                                    <span className="text-muted small">Chi (Genus): </span><br/>
                                    <b className="text-dark fs-6">{variety.Species?.Genus?.vietnamese_name || '-'}</b> <br/><i className="text-muted small">({variety.Species?.Genus?.scientific_name || '-'})</i>
                                </div>
                                <hr className="border-success border-opacity-25 my-2"/>
                                <div className="mb-3">
                                    <span className="text-muted small">Loài (Species): </span><br/>
                                    <b className="text-dark fs-6">{variety.Species?.vietnamese_name || '-'}</b> <br/><i className="text-muted small">({variety.Species?.scientific_name || '-'})</i>
                                </div>
                                
                                <Button variant="outline-success" size="sm" className="w-100 rounded-pill fw-bold mt-2 shadow-sm bg-white" onClick={() => setShowTaxonomyModal(true)}>
                                    <FaInfoCircle className="me-2"/> Xem Hồ sơ Khoa học
                                </Button>
                            </Card.Body>
                        </Card>

                        {/* Thẻ Phân bố địa lý */}
                        <Card className="border-0 shadow-sm rounded-4 mb-4">
                            <Card.Body className="p-4">
                                <h6 className="fw-bold text-success border-bottom border-success border-opacity-25 pb-3 mb-3 d-flex justify-content-between align-items-center">
                                    <span><FaGlobeAsia className="me-2"/> Khu Vực Phân Bố</span>
                                    <Badge bg="secondary" className="bg-opacity-50 text-dark fw-normal">{variety.Distributions?.length || 0}</Badge>
                                </h6>
                                
                                {variety.Distributions && variety.Distributions.length > 0 ? (
                                    <>
                                        <div className="custom-scrollbar pe-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                            <ul className="list-unstyled mb-0">
                                                {variety.Distributions.map(dist => (
                                                    <li key={dist.distribution_id} className="mb-3 border-bottom border-light pb-2">
                                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                                            <div className="fw-bold text-dark d-flex align-items-center"><FaMapMarkerAlt className="text-danger me-1 opacity-75"/> {dist.Province?.province_name}</div>
                                                            <Badge bg={uiMapping['DISTRIBUTION_STATUS'][dist.status].bg || 'secondary'} className="bg-opacity-75 ms-2">{uiMapping['DISTRIBUTION_STATUS'][dist.status].label}</Badge>
                                                        </div>
                                                        <div className="text-muted small ms-3">{dist.Province?.country}</div>
                                                        {dist.description && <div className="text-muted small mt-1 ms-3 fst-italic text-truncate" title={dist.description}>{dist.description}</div>}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <Button variant="light" size="sm" className="w-100 mt-2 fw-medium border text-muted hover-text-success" onClick={() => setShowDistModal(true)}>
                                            Xem chi tiết danh sách
                                        </Button>
                                    </>
                                ) : (
                                    <span className="text-muted small fst-italic">Chưa ghi nhận dữ liệu phân bố địa lý.</span>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* MODAL HỒ SƠ PHÂN LOẠI CHI TIẾT */}
            <Modal show={showTaxonomyModal} onHide={() => setShowTaxonomyModal(false)} centered size="lg">
                <Modal.Header closeButton className="bg-success text-white border-0">
                    <Modal.Title className="fw-bold"><FaDna className="me-2"/> Hồ Sơ Khoa Học (Taxonomy)</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    <Table striped bordered hover className="mb-0 align-middle">
                        <tbody>
                            {/* HỌ THỰC VẬT (FAMILY) */}
                            <tr>
                                <th className="w-25 bg-light p-3">
                                    Họ Thực vật<br/>
                                    <small className="text-muted fw-normal">(Family)</small>
                                </th>
                                <td className="p-3">
                                    <b className="text-success fs-5">{variety.Species?.Genus?.Family?.scientific_name}</b>
                                    {variety.Species?.Genus?.Family?.authority && (
                                         <small className="ms-2 text-muted border border-secondary px-1 rounded">
                                             {variety.Species.Genus.Family.authority}
                                        </small>
                                    )}
                                    <br/>
                                    
                                    {variety.Species?.Genus?.Family?.vietnamese_name && (
                                        <span className="text-dark fw-medium d-block mt-1">
                                            Tên VN: {variety.Species.Genus.Family.vietnamese_name}
                                        </span>
                                    )}
                                    
                                    <div className="mt-2 text-justify">
                                        {variety.Species?.Genus?.Family?.description ? (
                                            <span className="text-muted small">{variety.Species.Genus.Family.description}</span>
                                        ) : (
                                            <span className="text-muted small fst-italic opacity-75">Chưa có mô tả chi tiết về Họ này.</span>
                                        )}
                                    </div>
                                </td>
                            </tr>

                            {/* CHI THỰC VẬT (GENUS) */}
                            <tr>
                                <th className="bg-light p-3">
                                    Chi Thực vật<br/>
                                    <small className="text-muted fw-normal">(Genus)</small>
                                </th>
                                <td className="p-3">
                                    <b className="text-success fs-5">{variety.Species?.Genus?.scientific_name}</b>
                                    {variety.Species?.Genus?.authority && (
                                        <small className="ms-2 text-muted border border-secondary px-1 rounded">
                                            {variety.Species.Genus.authority}
                                        </small>
                                    )}
                                    <br/>
                                    
                                    {variety.Species?.Genus?.vietnamese_name && (
                                        <span className="text-dark fw-medium d-block mt-1">
                                            Tên VN: {variety.Species.Genus.vietnamese_name}
                                        </span>
                                    )}
                                    
                                    <div className="mt-2 text-justify">
                                        {variety.Species?.Genus?.description ? (
                                            <span className="text-muted small">{variety.Species.Genus.description}</span>
                                        ) : (
                                            <span className="text-muted small fst-italic opacity-75">Chưa có mô tả chi tiết về Chi này.</span>
                                        )}
                                    </div>
                                </td>
                            </tr>

                            {/* LOÀI (SPECIES) */}
                            <tr>
                                <th className="bg-light p-3">
                                    Loài<br/>
                                    <small className="text-muted fw-normal">(Species)</small>
                                </th>
                                <td className="p-3">
                                    <b className="text-success fs-5">{variety.Species?.scientific_name}</b>
                                    {variety.Species?.authority && (
                                        <small className="ms-2 text-muted border border-secondary px-1 rounded">
                                            {variety.Species.authority}
                                        </small>
                                    )}
                                    <br/>
                                    
                                    {variety.Species?.vietnamese_name && (
                                        <span className="text-dark fw-medium d-block mt-1 mb-2">
                                            Tên VN: {variety.Species.vietnamese_name}
                                        </span>
                                    )}
                                    
                                    {/* Chỉ hiện Tên đồng nghĩa nếu có dữ liệu */}
                                    {variety.Species?.synonyms && (
                                        <div className="mt-2 d-flex">
                                            <span className="badge bg-secondary bg-opacity-50 text-dark me-2" style={{height: 'fit-content'}}>Đồng nghĩa</span>
                                            <i className="small text-muted">{variety.Species.synonyms}</i>
                                        </div>
                                    )}
                                    
                                    {/* Chỉ hiện Tên gọi khác nếu có dữ liệu */}
                                    {variety.Species?.other_names && (
                                        <div className="mt-2 d-flex">
                                            <span className="badge bg-secondary bg-opacity-50 text-dark me-2" style={{height: 'fit-content'}}>Tên khác</span>
                                            <span className="small text-muted">{variety.Species.other_names}</span>
                                        </div>
                                    )}
                                    
                                    <div className="mt-3 p-3 bg-light rounded border border-light">
                                        <b className="small text-dark mb-1 d-block">Công dụng chính:</b>
                                        {variety.Species?.uses ? (
                                            <span className="text-muted small text-justify d-block">{variety.Species.uses}</span>
                                        ) : (
                                            <span className="text-muted small fst-italic opacity-75">Chưa ghi nhận công dụng loài.</span>
                                        )}
                                    </div>
                                    
                                    <div className="mt-2 p-3 bg-light rounded border border-light">
                                        <b className="small text-dark mb-1 d-block">Mô tả sinh học Loài:</b>
                                        {variety.Species?.description ? (
                                            <span className="text-muted small text-justify d-block">{variety.Species.description}</span>
                                        ) : (
                                            <span className="text-muted small fst-italic opacity-75">Chưa có mô tả chung của loài.</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>

            {/* MODAL PHÂN BỐ ĐỊA LÝ CHI TIẾT */}
            <Modal show={showDistModal} onHide={() => setShowDistModal(false)} centered size="lg" scrollable>
                <Modal.Header closeButton className="bg-white border-bottom shadow-sm z-3">
                    <Modal.Title className="fw-bold text-success"><FaGlobeAsia className="me-2 text-primary"/> Chi tiết Phân bố Địa lý</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0 bg-light">
                    <Table hover responsive className="mb-0 align-middle bg-white">
                        <thead className="table-light position-sticky top-0 shadow-sm z-2">
                            <tr>
                                <th className="p-3">Tỉnh/Thành phố</th>
                                <th className="p-3">Quốc gia</th>
                                <th className="p-3">Trạng thái</th>
                                <th className="p-3 w-50">Mô tả chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {variety.Distributions?.map(dist => (
                                <tr key={`dist-modal-${dist.distribution_id}`}>
                                    <td className="p-3 fw-bold text-dark">{dist.Province?.province_name}</td>
                                    <td className="p-3 text-muted">{dist.Province?.country}</td>
                                    <td className="p-3"><Badge bg={uiMapping['DISTRIBUTION_STATUS'][dist.status].bg || 'info' } className="bg-opacity-75">{uiMapping['DISTRIBUTION_STATUS'][dist.status].label}</Badge></td>
                                    <td className="p-3 text-muted small text-justify">{dist.description || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>

            {/* MODAL PHÓNG TO ẢNH (LIGHTBOX) */}
            <Modal show={!!enlargedImg} onHide={() => setEnlargedImage(null)} centered size="xl">
                <Modal.Header closeButton className="border-0 pb-0 bg-dark" variant="dark"></Modal.Header>
                <Modal.Body className="text-center p-0 bg-dark rounded-bottom">
                    <img src={enlargedImg} alt="Enlarged" className="img-fluid rounded-bottom" style={{ maxHeight: '85vh', objectFit: 'contain', width: '100%' }} />
                </Modal.Body>
            </Modal>

            <style>{`
                .text-justify { text-align: justify; }
                .hover-text-success:hover { color: #198754 !important; }
                .hover-bg-light:hover { background-color: #f8f9fa; }
                .cursor-pointer { cursor: pointer; }
                .border-dashed { border-style: dashed; border-width: 2px; border-color: #dee2e6; }
                
                /* Hiệu ứng hover phóng to icon trên Thumbnail */
                .cursor-zoom-in { cursor: zoom-in; }
                .group-hover:hover img { transform: scale(1.08); }
                .group-hover:hover .icon-zoom { opacity: 1 !important; }
                .group-hover:hover .group-hover-bg { opacity: 0.3 !important; }
                .transition-transform { transition: transform 0.3s ease; }
                .transition-opacity { transition: opacity 0.3s ease; }
                .transition-all { transition: all 0.2s ease-in-out; }

                /* Custom Scrollbar cho Sidebar Distribution */
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1d5c9; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #198754; }
            `}</style>
        </div>
    );
};

export default VarietyDetailPage;