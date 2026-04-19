import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Modal } from 'react-bootstrap';
import { FaSearchPlus } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import AIPartCarousel from '../../components/common/AIPartCarousel';
import publicService from '../../services/publicService';

const SearchResultsPage = () => {
    const { state } = useLocation();

    
    const imageBase64 = state?.imageBase64;
    const croppedBase64 = state?.croppedBase64 || imageBase64;

    const parts = state?.parts?.split(',') || [];
    const bbox = state?.bbox_x !== undefined ? {
    x: parseFloat(state.bbox_x),
    y: parseFloat(state.bbox_y),
    w: parseFloat(state.bbox_w),
    h: parseFloat(state.bbox_h)
    } : { x: 0, y: 0, w: 100, h: 100 };

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState({}); 
    const [enlargedImg, setEnlargedImage] = useState(null); 

    useEffect(() => {
        const fetchAISearch = async () => {
            if (!imageBase64) return;
            
            // THÊM DÒNG NÀY: Reset lại trạng thái loading mỗi khi bắt đầu tìm kiếm mới
            setLoading(true); 
            setResults({}); // Xóa kết quả cũ đi cho sạch giao diện

            try {
                const response = await publicService.aiSearchImage(imageBase64, bbox, parts);
                setResults(response.results); 
            } catch (error) {
                console.error("Lỗi tìm kiếm AI:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAISearch();

    }, [imageBase64, state?.bbox_x, state?.bbox_y, state?.bbox_w, state?.bbox_h, state?.parts]);

    if (!imageBase64) return <div className="text-center mt-5">Không có dữ liệu ảnh đầu vào.</div>;

    return (
        <Container className="py-5">
                <Helmet>
                    <title>PlantDB | Kết quả tìm kiếm ảnh</title>
                    <meta name="description" content="Kết quả tìm kiếm thực vật bằng ảnh trên PlantDB - hệ thống cơ sở dữ liệu hình thái thực vật, hỗ trợ tra cứu, định danh và nghiên cứu đa dạng sinh học với sự hỗ trợ của AI." />
                </Helmet>
            <h2 className="fw-bolder text-success mb-4">Kết quả Nhận diện AI</h2>
            
            <Row className="mb-5">
                <Col md={4}>
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                    <Card.Header className="bg-dark bg-opacity-75 text-white text-center small fw-medium py-2">
                        Ảnh vùng chọn tìm kiếm
                    </Card.Header>
                    {/* Thêm wrapper 'image-zoom-container' để quản lý hiệu ứng hover */}
                    <div 
                        className="bg-light d-flex align-items-center justify-content-center p-3 position-relative image-zoom-container" 
                        style={{ height: '280px', cursor: 'zoom-in' }}
                        onClick={() => setEnlargedImage(croppedBase64)}
                    >
                        <img 
                            src={croppedBase64} 
                            alt="Cropped" 
                            className="max-h-100 max-w-100 object-fit-contain rounded shadow-sm border transition-transform" 
                            style={{maxHeight: '100%', maxWidth: '100%'}} 
                        />
                        {/* Lớp phủ chứa icon kính lúp */}
                        <div className="zoom-overlay">
                            <FaSearchPlus size={30} className="text-white" />
                        </div>
                    </div>
                </Card>
            </Col>
                
                <Col md={8} className="d-flex flex-column justify-content-center">
                    <h5 className="fw-bold">Phân tích hệ thống</h5>
                    <p className="text-muted">Hệ thống đang đối chiếu hình ảnh với cơ sở dữ liệu dựa trên các bộ phận: {parts.map(part => part === 'Leaf' ? 'Lá' : part === 'Stem' ? 'Thân' : 'Hoa').join(', ')}.</p>
                    {loading && (
                        <div className="p-4 bg-light rounded-4 text-center mt-3 border border-success border-opacity-25">
                            <Spinner animation="grow" variant="success" className="mb-3"/>
                            <h6 className="text-success fw-bold">Đang tìm kiếm...</h6>
                            <small className="text-muted">Quá trình này có thể mất vài giây.</small>
                        </div>
                    )}
                </Col>
            </Row>

            {!loading && parts.map(part => (
                <div key={part} className="mb-5 border-top pt-4">
                    <h4 className="fw-bold mb-3 d-flex align-items-center">
                        Kết quả tương đồng: {part === 'Leaf' ? 'Lá' : part === 'Stem' ? 'Thân' : 'Hoa'}
                    </h4>
                    
                    {results[part]?.length > 0 ? (
                        /* Đã xóa khối Card Top 1, chỉ gọi mỗi Carousel */
                        <AIPartCarousel 
                            images={results[part]} 
                            backendUrl={backendUrl}
                            onImageClick={setEnlargedImage} 
                            isModalOpen={!!enlargedImg} 
                        />
                    ) : (
                        <div className="text-muted fst-italic">Không tìm thấy dữ liệu tương đồng phù hợp.</div>
                    )}
                </div>
            ))}

            <Modal show={!!enlargedImg} onHide={() => setEnlargedImage(null)} centered size="xl">
                <Modal.Header closeButton className="border-0 pb-0 bg-dark" variant="dark"></Modal.Header>
                <Modal.Body className="text-center p-0 bg-dark rounded-bottom">
                    <img src={enlargedImg} alt="Enlarged" className="img-fluid rounded-bottom" style={{ maxHeight: '85vh', objectFit: 'contain', width: '100%' }} />
                </Modal.Body>
            </Modal>
        <style>{`
        .cursor-pointer { cursor: pointer; }
        .group-hover:hover { background-color: rgba(25, 135, 84, 0.15) !important; transition: all 0.2s ease-in-out; }
        
        /* Hiệu ứng zoom cho ảnh nguồn */
        .image-zoom-container .zoom-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.3);
            display: flex; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.3s ease;
        }
        .image-zoom-container:hover .zoom-overlay { opacity: 1; }
        .image-zoom-container:hover img { transform: scale(1.05); }
        .transition-transform { transition: transform 0.3s ease; }
    `}</style>
        </Container>
);
};
export default SearchResultsPage;