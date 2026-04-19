import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge, Spinner } from 'react-bootstrap';
import { FaSearch, FaCamera, FaTree, FaLeaf, FaDna, FaGlobeAsia, FaMicroscope, FaImages, FaSeedling, FaChartBar, FaInfoCircle, FaCheck } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';
import publicService from '../../../services/publicService';
import './HomePage.css'; 
import VarietyCarousel from '../../../components/common/VarietyCarousel';
import ImageSearchModal from '../../../components/modal/ImageSearchModal';

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [homeData, setHomeData] = useState({
        stats: { totalVarieties: 0, totalSpecies: 0, totalImages: 0 },
        popularVarieties: [],
        richMediaVarieties: []
    });

    const [showImageSearchModal, setShowImageSearchModal] = useState(false);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const data = await publicService.getHomeData();
                setHomeData(data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    useEffect(() => {
            // Nếu URL có chứa hash (ví dụ: #gioi-thieu)
            if (location.hash) {
                // Dùng setTimeout một chút để đợi DOM render xong xuôi
                setTimeout(() => {
                    const element = document.getElementById(location.hash.replace('#', ''));
                    if (element) {
                        // Cuộn tới phần tử đó với hiệu ứng mượt
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            } else {
                // Nếu không có hash (chỉ là /), thì cuộn lên đầu trang
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/varieties?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleImageSearch = () => {
        setShowImageSearchModal(true);
    };

    const handleTagClick = (tag) => {
        navigate(`/varieties?search=${encodeURIComponent(tag)}`);
    };

    return (
        <div className="homepage-wrapper bg-light font-sans">
            <Helmet>
                <title>PlantDB | Trang Chủ</title>
                <meta name="description" content="Khám phá đa dạng sinh học với PlantDB - hệ thống cơ sở dữ liệu hình thái thực vật, hỗ trợ tra cứu, định danh và nghiên cứu đa dạng sinh học với sự hỗ trợ của AI." />
            </Helmet>
            {/* 1. HERO SECTION */}
            <section className="hero-section position-relative d-flex flex-column align-items-center justify-content-center text-center" style={{
                background: 'linear-gradient(rgba(30, 70, 50, 0.85), rgba(20, 50, 35, 0.9)), url("/images/hero-bg.jpg") center/cover no-repeat',
                padding: '100px 0 180px 0' 
            }}>
                <Container className="z-2">
                    
                    <Badge bg="warning" text="dark" className="mb-4 px-4 py-2 text-uppercase rounded-pill fw-bold shadow-sm" style={{ letterSpacing: '1px' }}>
                        <FaGlobeAsia className="me-2" /> Nền Tảng Dữ Liệu Thực Vật Học
                    </Badge>
                    
                    <h1 className="display-4 fw-bolder mb-3 text-white text-shadow-sm">
                        Khám Phá <span className="text-warning">Đa Dạng Sinh Học</span>
                    </h1>
                    
                    <p className="lead mb-4 mx-auto text-white-50" style={{ maxWidth: '700px', fontSize: '1.1rem' }}>
                        Hệ sinh thái lưu trữ, tra cứu và nhận diện tự động hình thái các loài thực vật đặc hữu và quý hiếm tại Việt Nam.
                    </p>

                    {/* Thanh Search Trắng */}
                    <div className="mx-auto bg-white p-2 rounded-pill shadow-lg d-flex align-items-center search-bar-container" style={{ maxWidth: '750px' }}>
                        <Form onSubmit={handleSearch} className="w-100 d-flex align-items-center m-0">
                            <FaSearch className="text-muted ms-4 me-2 fs-5 d-none d-sm-block" />
                            <Form.Control
                                placeholder="Xem hướng dẫn ..."
                                className="border-0 shadow-none py-2 px-3 fs-6"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="light" className="rounded-circle text-success me-2 hover-bg-success-light" onClick={handleImageSearch} title="Tìm kiếm bằng Camera">
                                <FaCamera size={20} />
                            </Button>
                            <Button variant="success" type="submit" className="rounded-pill px-4 px-md-5 fw-bold" style={{ backgroundColor: '#198754' }}>
                                TÌM
                            </Button>
                        </Form>
                    </div>

                    {/* Từ khóa phổ biến */}
                    <div className="mt-4 d-flex justify-content-center align-items-center flex-wrap gap-2">
                        <span className="text-white-50 small me-2">Tìm kiếm phổ biến:</span>
                        {['Polyscias', 'Cảnh quan', 'Dược liệu', 'Thực phẩm'].map((tag, idx) => (
                            <Badge
                                key={idx}
                                bg="transparent"
                                className="border border-light border-opacity-50 text-white px-3 py-2 rounded-pill cursor-pointer hover-bg-white hover-text-success transition-all fw-normal"
                                onClick={() => handleTagClick(tag)}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {/* Bảng Hướng Dẫn Tích Hợp Gần Thanh Search (Đã làm chữ lớn và nổi bật hơn) */}
                    {/* Bảng Hướng Dẫn Tích Hợp Gần Thanh Search (Glassmorphism) */}
                    <div id='huong-dan' className="mx-auto mt-4 text-start rounded-4 p-4 border border-success border-opacity-50 shadow-lg" 
                         style={{ maxWidth: '850px', backgroundColor: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(12px)' }}>
                        <h6 className="text-warning fw-bolder mb-4 fs-6 d-flex align-items-center justify-content-center justify-content-sm-start text-uppercase tracking-wider">
                            <FaInfoCircle className="me-2 fs-5"/> Tra Cứu Toàn Diện Cơ Sở Dữ Liệu
                        </h6>
                        <Row className="g-4 text-white opacity-100">
                            {/* Cột 1: Tên gọi */}
                            <Col md={6} className="d-flex align-items-start">
                                <FaSeedling className="me-3 mt-1 text-success flex-shrink-0" style={{fontSize: '1.4rem'}}/>
                                <div>
                                    <strong className="d-block text-white fs-6 mb-1">Tên gọi & Danh pháp</strong>
                                    <span className="text-light" style={{fontSize: '0.9rem'}}>
                                        Tìm theo Tên khoa học (Họ, Chi, Loài), Tên Tiếng Việt, tên địa phương hoặc các từ đồng nghĩa (Synonyms).
                                    </span>
                                </div>
                            </Col>
                            
                            {/* Cột 2: Hình thái */}
                            <Col md={6} className="d-flex align-items-start">
                                <FaLeaf className="me-3 mt-1 text-success flex-shrink-0" style={{fontSize: '1.4rem'}}/>
                                <div>
                                    <strong className="d-block text-white fs-6 mb-1">Đặc điểm Hình thái</strong>
                                    <span className="text-light" style={{fontSize: '0.9rem'}}>
                                        Các đặc điểm nhận dạng nổi bật hoặc lọc theo cấu trúc hình dáng lá, màu sắc hoa, loại thân cây tại "Thư viện thực vật" .
                                    </span>
                                </div>
                            </Col>

                            {/* Cột 3: Công dụng & Phân bố */}
                            <Col md={6} className="d-flex align-items-start">
                                <FaGlobeAsia className="me-3 mt-1 text-success flex-shrink-0" style={{fontSize: '1.4rem'}}/>
                                <div>
                                    <strong className="d-block text-white fs-6 mb-1">Công dụng</strong>
                                    <span className="text-light" style={{fontSize: '0.9rem'}}>
                                        Truy vấn dựa trên giá trị sử dụng (dược liệu, cảnh quan...)
                                    </span>
                                </div>
                            </Col>

                            {/* Cột 4: Mã định danh */}
                            <Col md={6} className="d-flex align-items-start">
                                <FaDna className="me-3 mt-1 text-success flex-shrink-0" style={{fontSize: '1.4rem'}}/>
                                <div>
                                    <strong className="d-block text-white fs-6 mb-1">Mã hệ thống</strong>
                                    <span className="text-light" style={{fontSize: '0.9rem'}}>
                                        Truy xuất tức thì dữ liệu qua các mã định danh chuẩn xác nội bộ (VD: VAR-00001, SPC-0012).
                                    </span>
                                </div>
                            </Col>
                        </Row>
                    </div>

                </Container>
            </section>

            {/* 2. STATS SECTION */}
            <section className="position-relative" style={{ marginTop: '-50px', zIndex: 10 }}>
                <Container>
                    <div className="text-center mb-3">
                        <span className="text-white-50 small fw-bold tracking-wider text-uppercase" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)'}}>KHÁM PHÁ</span>
                    </div>
                    <Row className="g-3 justify-content-center">
                        {[
                            { icon: FaDna, title: 'HỌ & CHI LOÀI', count: homeData.stats.totalSpecies, color: '#198754', bg: '#E2F0E9' },
                            { icon: FaMicroscope, title: 'MẪU THỨ / GIỐNG', count: homeData.stats.totalVarieties, color: '#0d6efd', bg: '#e7f1ff' },
                            { icon: FaImages, title: 'HÌNH ẢNH SỐ HÓA', count: homeData.stats.totalImages, color: '#fd7e14', bg: '#fff3cd' }
                        ].map((stat, idx) => (
                            <Col md={4} sm={12} key={idx}>
                                <Card className="border-0 shadow h-100 rounded-4 stat-card overflow-hidden">
                                    <Card.Body className="p-4 d-flex align-items-center justify-content-center">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ backgroundColor: stat.bg, width: '60px', height: '60px' }}>
                                            <stat.icon style={{ color: stat.color, fontSize: '1.5rem' }} />
                                        </div>
                                        <div className="text-start">
                                            <h2 className="fw-bolder mb-0 text-dark d-flex align-items-baseline" style={{ fontSize: '2rem' }}>
                                                {loading ? <Spinner size="sm" animation="border" style={{ color: stat.color }} /> : stat.count}
                                                <span className="ms-1 fs-5" style={{ color: stat.color }}>+</span>
                                            </h2>
                                            <p className="text-muted small text-uppercase fw-bold mb-0" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>{stat.title}</p>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            <section id="gioi-thieu" className="py-5 mt-4 bg-white overflow-hidden">
    <Container className="py-4">
        <Row className="align-items-center g-5">
            {/* CỘT TRÁI: Nội dung giới thiệu */}
            <Col lg={6} className="pe-lg-5 z-2">
                <div className="d-inline-flex align-items-center bg-success bg-opacity-10 text-success px-3 py-2 text-uppercase rounded-pill fw-bold mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                    <FaTree className="me-2 fs-6"/> Về Dự Án PlantDB
                </div>
                
                <h2 className="display-5 fw-bolder mb-4 text-dark lh-sm">
                    Nền Tảng Số Hóa <br/> 
                    <span className="text-success position-relative">
                        Sinh Thái Học
                        {/* Nét gạch chân trang trí cách điệu */}
                        <svg className="position-absolute start-0 w-100" style={{ bottom: '-8px', height: '12px' }} viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 10C60 -2 140 -2 198 10" stroke="#198754" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.3"/>
                        </svg>
                    </span>
                </h2>
                
                <p className="text-secondary mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                    PlantDB cung cấp hệ thống quản trị và tra cứu hình thái cây trồng chuyên sâu. Kiến trúc dữ liệu được thiết kế chuẩn khoa học, hỗ trợ đắc lực cho sinh viên, nhà nghiên cứu và người đam mê thực vật học.
                </p>
                
                {/* Các thẻ tính năng nổi bật (Thiết kế lại theo dạng minimalist cards) */}
                <Row className="g-3 mt-2">
                    <Col sm={4} xs={12}>
                        <Card className="border border-light bg-white rounded-4 h-100 transition-all hover-lift shadow-sm">
                            <Card.Body className="p-4">
                                <div className="bg-success bg-opacity-10 d-inline-block p-3 rounded-circle mb-3">
                                    <FaGlobeAsia className="text-success fs-4" />
                                </div>
                                <h6 className="fw-bold text-dark mb-2">Hệ sinh thái VN</h6>
                                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Thực vật đặc hữu & đa dạng sinh học.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col sm={4} xs={12}>
                        <Card className="border border-light bg-white rounded-4 h-100 transition-all hover-lift shadow-sm">
                            <Card.Body className="p-4">
                                <div className="bg-primary bg-opacity-10 d-inline-block p-3 rounded-circle mb-3">
                                    <FaDna className="text-primary fs-4" />
                                </div>
                                <h6 className="fw-bold text-dark mb-2">Phân loại chuẩn</h6>
                                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Cấu trúc phân cấp từ Họ, Chi đến Loài.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col sm={4} xs={12}>
                        <Card className="border border-light bg-white rounded-4 h-100 transition-all hover-lift shadow-sm">
                            <Card.Body className="p-4">
                                <div className="bg-warning bg-opacity-10 d-inline-block p-3 rounded-circle mb-3">
                                    <FaCamera className="text-warning fs-4" />
                                </div>
                                <h6 className="fw-bold text-dark mb-2">Tích hợp AI</h6>
                                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Định danh & trích xuất bằng ảnh chụp.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Col>
            
            {/* CỘT PHẢI: Hình ảnh xịn sò với Floating Elements */}
            <Col lg={6} className="text-center position-relative mt-5 mt-lg-0 px-md-4">
                {/* Hiệu ứng đốm sáng nền (Backdrop Blur/Glow) để tôn bức ảnh lên */}
                <div className="position-absolute bg-success rounded-circle z-0" 
                     style={{ width: '350px', height: '350px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: '0.15', filter: 'blur(60px)' }}>
                </div>

                <div className="position-relative z-1 d-inline-block w-100" style={{ maxWidth: '500px' }}>
                    {/* Bức ảnh của bạn được bọc viền trắng mỏng, bo góc lớn và đổ bóng sâu */}
                    <img
                        src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop" // <-- Bạn thay bằng đường dẫn đúng của file ảnh vừa upload nhé
                        alt="About PlantDB"
                        className="img-fluid rounded-5 shadow-lg position-relative z-1"
                        style={{ width: '100%', objectFit: 'cover', height: '550px', border: '6px solid white' }}
                    />

                    {/* Thẻ Floating 1: Thể hiện tính năng Nhận diện AI */}
                    <div className="position-absolute bottom-0 start-0 ms-n3 mb-4 bg-white p-3 rounded-4 shadow-lg d-flex align-items-center z-3 border border-light" 
                         style={{ animation: 'float-up-down 3.5s ease-in-out infinite' }}>
                        <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                            <FaMicroscope className="text-success fs-4" />
                        </div>
                        <div className="text-start pe-3">
                            <h6 className="fw-bolder mb-1 text-dark" style={{ fontSize: '0.95rem' }}>AI Scanner</h6>
                            <span className="text-muted fw-medium" style={{ fontSize: '0.75rem' }}>Tự động nhận dạng</span>
                        </div>
                    </div>

                    {/* Thẻ Floating 2: Thể hiện Dữ liệu Lớn */}
                    <div className="position-absolute top-0 end-0 mt-5 me-n3 bg-white p-2 px-3 rounded-pill shadow-lg d-flex align-items-center z-3 border border-light" 
                         style={{ animation: 'float-up-down 4s ease-in-out infinite reverse' }}>
                        <div className="bg-dark p-1 rounded-circle me-2 d-flex">
                            <FaCheck className="text-white fs-6" style={{ padding: '2px' }}/>
                        </div>
                        <span className="fw-bold text-dark" style={{ fontSize: '0.8rem' }}>{homeData.stats.totalVarieties}+ biến thể</span>
                    </div>
                </div>
            </Col>
        </Row>

        {/* Thêm CSS nội bộ cho hiệu ứng trôi nổi và hover */}
        <style>{`
            .hover-lift { cursor: default; }
            .hover-lift:hover { transform: translateY(-8px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; border-color: #198754 !important; }
            @keyframes float-up-down {
                0% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
                100% { transform: translateY(0); }
            }
            /* Xử lý cho mobile không bị tràn màn hình do các thẻ floating */
            @media (max-width: 768px) {
                .ms-n3 { margin-left: 10px !important; }
                .me-n3 { margin-right: 10px !important; }
            }
        `}</style>
    </Container>
</section>

            {/* 4. POPULAR VARIETIES CAROUSEL */}
            <section className="pt-4 pb-2 bg-light border-top">
                <Container>
                    {loading ? (
                        <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
                    ) : (
                        <VarietyCarousel
                            title="Được Tra Cứu Nhiều Nhất"
                            subtitle="XU HƯỚNG HIỆN TẠI"
                            data={homeData.popularVarieties}
                            type="popular"
                        />
                    )}
                </Container>
            </section>

            {/* 5. RICH MEDIA VARIETIES CAROUSEL */}
            <section className="py-4 pb-2 bg-white border-top">
                <Container>
                    {loading ? (
                        <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
                    ) : (
                        <VarietyCarousel
                            title="Bộ Sưu Tập Hình Ảnh"
                            subtitle="THƯ VIỆN SINH ĐỘNG"
                            data={homeData.richMediaVarieties}
                            type="rich-media"
                        />
                    )}
                </Container>
            </section>
        <ImageSearchModal show={showImageSearchModal} onHide={() => setShowImageSearchModal(false)} />
        </div>
    );
};

export default HomePage;