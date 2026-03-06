import React, { useRef, useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Form, Modal } from 'react-bootstrap';
import { FaTrash, FaCheckCircle, FaUpload, FaSearchPlus, FaInfoCircle, FaImage } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ImageManagerTab = ({ 
    existingImages, 
    setDeletedImageIds,
    setExistingImages, 
    deletedImageIds = [], 
    newImages, 
    setNewImages, 
    bgImageId, 
    setBgImageId ,
    status
}) => {
    const fileInputRef = useRef(null);
    const [uploadTargetPart, setUploadTargetPart] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const BACKEND_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000'; // Đổi lại port backend của bạn
    const detailMode = status === 'detail';
    const getImageUrl = (path) => {
        if (!path) return '/default-plant.png'; 
        if (path.startsWith('http')) return path; 
        return `${BACKEND_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    };
    // Tự động set ảnh đầu tiên làm nền nếu chưa có
    useEffect(() => {
        if (!bgImageId) {
            const firstExisting = existingImages.find(img => !deletedImageIds.includes(img.plant_image_id));
            if (firstExisting) {
                setBgImageId(firstExisting.plant_image_id);
            } else if (newImages.length > 0) {
                setBgImageId(newImages[0].id);
            }
        }
    }, [existingImages, newImages, deletedImageIds, bgImageId, setBgImageId]);

    // Lấy Source URL của Ảnh Nền để làm Preview
    const getBgImageSrc = () => {
        if (!bgImageId) return null;
        const bgExisting = existingImages.find(img => img.plant_image_id === bgImageId);
        if (bgExisting) return getImageUrl(bgExisting.url);
        const bgNew = newImages.find(img => img.id === bgImageId);
        if (bgNew) return bgNew.previewUrl;
        return null;
    };

    const triggerUpload = (partType) => {
        setUploadTargetPart(partType);
        fileInputRef.current.click();
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const newImgs = files.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file),
            part_type: uploadTargetPart, 
            is_standard: true,
            id: file.name + '-' + Date.now() 
        }));
        
        setNewImages(prev => [...prev, ...newImgs]);
        
        if (!bgImageId && newImgs.length > 0 && existingImages.length === 0) {
            setBgImageId(newImgs[0].id);
        }
        e.target.value = null; 
    };

    const handleDeleteExisting = (imgId) => {
       Swal.fire({
            title: 'Xác nhận xóa ảnh?',
            text: "Ảnh sẽ bị xóa khỏi danh sách tải lên và không được lưu vào hệ thống.",
            icon: 'warning',
            showCancelButton: true, 
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy' 
        }).then((result) => {
            if (result.isConfirmed) {
                setDeletedImageIds(prev => [...prev, imgId]);
                if (bgImageId === imgId) setBgImageId(null); // Reset bg nếu xóa trúng ảnh nền
            }
        }) 
    };

    const handleDeleteNew = (previewUrl, id) => {
        Swal.fire({
            title: 'Xác nhận xóa ảnh mới?',
            text: "Ảnh sẽ bị xóa khỏi danh sách tải lên và không được lưu vào hệ thống.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy' 
        }).then((result) => {
            if (result.isConfirmed) {
                setNewImages(prev => prev.filter(img => img.previewUrl !== previewUrl));
                if (bgImageId === id) setBgImageId(null);
            }
        })       
    };

    const toggleNewImageStandard = (id) => {
        setNewImages(prev => prev.map(img => img.id === id ? { ...img, is_standard: !img.is_standard } : img));
    };

    const toggleExistingImageStandard = (id) => {
        setExistingImages(prev => prev.map(img => 
            img.plant_image_id === id ? { ...img, is_standard: !img.is_standard } : img
        ));
    };

    const ImageCard = ({ src, type, isNew, imgId, isStandard, onDelete, onToggleStandard }) => (
        <Col xl={2} lg={2} md={3} sm={4} xs={6}>
            <Card className={`h-100 shadow-sm transition-all ${isNew ? 'border-primary' : 'border-light'} ${bgImageId === imgId ? 'ring-2 ring-success' : ''}`} style={{ borderWidth: bgImageId === imgId ? '2px' : '1px' }}>
                <div className="position-relative bg-dark" style={{ height: '160px', cursor: 'pointer' }} onClick={() => setPreviewImage(src)}>
                    <Card.Img variant="top" src={src} style={{ height: '100%', objectFit: 'cover', opacity: '0.9' }} />
                    
                    {bgImageId === imgId && (
                        <div className="position-absolute top-0 start-0 m-2 text-success bg-white rounded-circle p-1 shadow">
                            <FaCheckCircle size={22} />
                        </div>
                    )}
                    {isNew && (
                        <Badge bg="primary" className="position-absolute top-0 end-0 m-2 shadow-sm" style={{ letterSpacing: '1px' }}>
                            MỚI UPLOAD
                        </Badge>
                    )}
                    <div className="position-absolute bottom-0 end-0 m-2 text-white opacity-75">
                        <FaSearchPlus size={18} />
                    </div>
                </div>

                <Card.Body className="p-3 bg-light d-flex flex-column justify-content-between">
                    <Form.Group className="mb-3">
                        <Form.Check 
                            type="switch"
                            id={`std-${imgId}`}
                            label={<span className={`small fw-bold ${isStandard ? 'text-success' : 'text-muted'}`}>Ảnh tiêu chuẩn AI</span>}
                            checked={isStandard}
                            onChange={() => onToggleStandard && onToggleStandard(imgId)}
                            disabled={ detailMode}
                        />
                    </Form.Group>
                    
                    <div className="d-flex justify-content-between align-items-center border-top pt-2">
                        <Form.Check 
                            type="radio" 
                            name="bgImageRadio" 
                            id={`bg-${imgId}`}
                            label={<span className="fw-bold text-dark">Đặt làm Bìa</span>}
                            checked={bgImageId === imgId}
                            onChange={() => setBgImageId(imgId)}
                            disabled={ detailMode}
                            className="mb-0"
                        />
                        <Button variant="outline-danger" size="sm" className="rounded-circle py-1 px-2" onClick={(e) => { e.stopPropagation(); onDelete(); }} disabled={ detailMode }>
                            <FaTrash size={12} />
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );

    const getImagesByPart = (partType) => {
        const existing = existingImages.filter(img => img.part_type === partType && !deletedImageIds.includes(img.plant_image_id));
        const newlyAdded = newImages.filter(img => img.part_type === partType);
        return { existing, newlyAdded, total: existing.length + newlyAdded.length };
    };

    const PartSection = ({ title, partType, iconColor }) => {
        const { existing, newlyAdded, total } = getImagesByPart(partType);
        
        return (
            <div className="mb-4 border rounded shadow-sm bg-white overflow-hidden">
                <div className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
                    <h6 className={`fw-bold mb-0 text-${iconColor}`}>
                        <i className={`fa fa-circle me-2`}></i>{title} <Badge bg="secondary" className="ms-1">{total}</Badge>
                    </h6>
                    <Button variant="outline-primary" size="sm" onClick={() => triggerUpload(partType)} disabled={ detailMode }>
                        <FaUpload className="me-1"/> Thêm ảnh {title.toLowerCase()}
                    </Button>
                </div>

                <div className="p-3" style={{ maxHeight: '350px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                    <Row className="g-3">
                        {existing.map(img => 
                            ( 
                            <ImageCard 
                                key={`ext-${img.plant_image_id}`} 
                                src={getImageUrl(img.url)} 
                                isNew={false}
                                imgId={img.plant_image_id}
                                isStandard={img.is_standard}
                                onToggleStandard={toggleExistingImageStandard}
                                onDelete={() => handleDeleteExisting(img.plant_image_id)}
                            />
                        ))}
                        {newlyAdded.map(img => (
                            <ImageCard 
                                key={`new-${img.id}`} 
                                src={img.previewUrl} 
                                isNew={true}
                                imgId={img.id}
                                isStandard={img.is_standard}
                                onToggleStandard={toggleNewImageStandard}
                                onDelete={() => handleDeleteNew(img.previewUrl, img.id)}
                            />
                        ))}
                        {total === 0 && (
                            <Col md={12}>
                                <div className="text-center py-4 text-muted w-100 border border-dashed rounded bg-white">
                                    <p className="mb-0">Chưa có ảnh {title.toLowerCase()}.</p>
                                </div>
                            </Col>
                        )}
                    </Row>
                </div>
            </div>
        );
    };

    const bgSrc = getBgImageSrc();

    return (
        <div className="p-3">
            <input type="file" multiple accept="image/*" className="d-none" ref={fileInputRef} onChange={handleFileSelect} />

            {/* Thông tin Ảnh Nền và Giải thích AI */}
            <Row className="mb-4">
                <Col md={6}>
                <div className="p-3 border border-success rounded bg-success bg-opacity-10 h-100 d-flex flex-column justify-content-center align-items-center text-center">
                    <span className="text-success fw-bold text-uppercase mb-2 d-block">Ảnh Nền</span>
                    
                    {bgSrc ? (
                        <div className="position-relative" style={{ width: '100px', height: '100px', cursor: 'pointer' }} onClick={() => setPreviewImage(bgSrc)}>
                            <img 
                                src={bgSrc} 
                                alt="Background Preview" 
                                className="rounded shadow-sm border border-2 border-success" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            <div className="position-absolute bottom-0 end-0 m-1 text-white bg-dark bg-opacity-50 rounded-circle d-flex p-1">
                                <FaSearchPlus size={12} />
                            </div>
                        </div>
                    ) : (
                        <div className="rounded bg-success bg-opacity-25 d-flex flex-column justify-content-center align-items-center text-success shadow-sm border border-success border-opacity-25" style={{ width: '100px', height: '100px' }}>
                            <FaImage size={28} className="mb-1" />
                            <small style={{ fontSize: '11px', fontWeight: 'bold' }}>Chưa có</small>
                        </div>
                    )}
                </div>
            </Col>
                <Col md={6}>
                    <div className="p-3 border rounded bg-light h-100">
                        <span className="fw-bold text-primary"><FaInfoCircle className="me-1"/> Hướng dẫn hệ thống AI:</span>
                        <p className=" text-muted mt-2 mb-0">
                         <b>Ảnh tiêu chuẩn:</b> Là ảnh chụp rõ nét, phông nền đơn giản. AI sẽ dùng ảnh này để trích xuất đặc trưng phục vụ chức năng tìm kiếm hình ảnh. <br/>
                        </p>
                    </div>
                </Col>
            </Row>

            <PartSection title="Hình ảnh LÁ" partType="Leaf" iconColor="success" />
            <PartSection title="Hình ảnh HOA" partType="Flower" iconColor="danger" />
            <PartSection title="Hình ảnh THÂN" partType="Stem" iconColor="warning" />

            <Modal show={!!previewImage} onHide={() => setPreviewImage(null)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
                <Modal.Body className="text-center p-0 pb-3">
                    <img src={previewImage} alt="Preview" className="img-fluid rounded shadow" style={{ maxHeight: '80vh' }} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ImageManagerTab;