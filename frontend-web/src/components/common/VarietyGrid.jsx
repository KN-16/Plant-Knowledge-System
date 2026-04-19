import React from 'react';
import { Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { FaCheck, FaEye, FaImages } from 'react-icons/fa';

const VarietyGrid = ({ data, loading, compareList, onToggleCompare, onNavigate, backendUrl, isExpanded }) => {
    
    // Xử lý khi đang tải dữ liệu
    if (loading) return (
        <div className="d-flex justify-content-center py-5 mt-5">
            <Spinner animation="border" variant="success" />
        </div>
    );
    
    // Xử lý khi không có dữ liệu (Empty State)
    if (!data || data.length === 0) return (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm text-muted mt-3 border border-light">
            <h5 className="fw-bold mb-2">Không tìm thấy dữ liệu</h5>
            <p className="mb-0">Hãy thử thay đổi từ khóa hoặc điều chỉnh lại bộ lọc.</p>
        </div>
    );

    // KÍCH THƯỚC LƯỚI ĐỘNG (GRID SYSTEM)
    const rowClasses = isExpanded 
        ? "row-cols-1 row-cols-sm-2 row-cols-lg-2 row-cols-xl-3" 
        : "row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4";

    return (
        <Row className={`g-3 g-md-4 ${rowClasses}`}>
            {data.map(plant => {
                const isSelected = compareList.find(i => i.variety_id === plant.variety_id);
                // Xử lý đường dẫn ảnh (Sử dụng ảnh mặc định nếu không có)
                const imgUrl = plant.thumbnail ? `${backendUrl}${plant.thumbnail}` : '/default-plant.png';
                const imageCount = plant.image_count || 0; 

                return (
                    <Col key={plant.variety_id}>
                        <Card 
                            className={`h-100 border-0 rounded-4 overflow-hidden shadow-sm hover-card transition-all ${isSelected ? 'ring-success' : ''}`}
                            onClick={() => onNavigate(plant.variety_id)}
                        >
                            
                            {/* KHU VỰC HÌNH ẢNH */}
                            {/* Chú ý: Bỏ class bg-dark để ảnh không bị ám đen, thêm overflow-hidden để giữ bo tròn khi zoom */}
                            <div className="position-relative cursor-pointer overflow-hidden" style={{ height: '240px' }}>
                                
                                {/* Ảnh nền chính */}
                                <Card.Img 
                                    src={imgUrl} 
                                    className="h-100 w-100 transition-all hover-zoom" 
                                    style={{ objectFit: 'cover' }} 
                                    alt={plant.common_name || plant.variety_name}
                                />
                                
                                {/* Huy hiệu số lượng ảnh ở góc trên cùng bên phải */}
                                <Badge 
                                    bg="dark" 
                                    className="position-absolute top-0 end-0 m-2 bg-opacity-75 d-flex align-items-center py-2 px-2 shadow-sm border border-light border-opacity-25"
                                >
                                    <FaImages className="me-1 text-warning"/> {imageCount}
                                </Badge>

                                {/* LỚP PHỦ GRADIENT TỐI Ở NỬA DƯỚI & NỘI DUNG VĂN BẢN */}
                                <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-dark text-white d-flex flex-column justify-content-end" style={{height: '75%'}}>
                                    
                                    {/* 1. Hàng trên cùng: Danh pháp khoa học & Biến thể */}
                                    <div className="mb-1 d-flex flex-wrap gap-1" style={{fontSize: '0.85rem'}}>
                                        <Badge bg="success" className="fw-normal shadow-sm px-2">
                                            {plant.Species?.scientific_name || 'N/A'}
                                        </Badge>
                                        <Badge bg="secondary" className="bg-opacity-50 fw-normal shadow-sm fst-italic px-2">
                                            {plant.variety_name}
                                        </Badge>
                                    </div>
                                    
                                    {/* 2. Tên Tiếng Việt Chính (Common Name) - Nổi bật nhất */}
                                    <h6 className="mb-0 fw-bold text-truncate text-white text-shadow-sm lh-base mt-1" style={{fontSize: '1.15rem', letterSpacing: '0.3px'}}>
                                        {plant.common_name || plant.variety_name}
                                    </h6>
                                    
                                    {/* 3. Tên Tiếng Việt của Loài (Phụ trợ) */}
                                    <div className="text-truncate mt-1" style={{fontSize: '0.95rem', color: '#c1d5c9'}}>
                                        {plant.Species?.vietnamese_name || plant.Species?.scientific_name || ''}
                                    </div>
                                    
                                </div>
                            </div>

                            {/* KHU VỰC ACTION (FOOTER CỦA CARD) */}
                            <Card.Body className="bg-white d-flex justify-content-between align-items-center py-2 px-3 border-top border-light">
                                {/* Cụm icon thống kê */}
                                <div className="text-muted small d-flex align-items-center gap-3">
                                    <span title="Lượt xem" className="d-flex align-items-center fw-medium">
                                        <FaEye className="me-1 text-secondary opacity-75"/> {plant.view_count || 0}
                                    </span>
                                </div>
                                
                                {/* Nút thêm vào danh sách So sánh */}
                                <Button 
                                    variant={isSelected ? "success" : "outline-success"} 
                                    size="sm" 
                                    className="rounded-pill px-3 fw-bold d-flex align-items-center transition-all"
                                    style={{fontSize: '0.75rem'}}
                                    onClick={(e) => { 
                                        e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền lên thẻ Card (dẫn tới việc chuyển trang)
                                        onToggleCompare(plant); 
                                    }}
                                >
                                    {isSelected ? <FaCheck className="me-1"/> : "+"} 
                                    <span className="d-none d-sm-inline ms-1">{isSelected ? 'Đã chọn' : 'So sánh'}</span>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                );
            })}
        </Row>
    );
};

export default VarietyGrid;