import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { FaSearch, FaCamera, FaTree, FaLeaf, FaDna, FaArrowRight, FaSeedling } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../assets/css/guest.css'; // Đảm bảo đã import file css guest

const HomePage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if(searchTerm.trim()) {
            // Demo chuyển hướng hoặc thông báo
            Swal.fire({
                title: 'Đang tìm kiếm...',
                text: `Hệ thống đang quét dữ liệu cho từ khóa: "${searchTerm}"`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const handleImageSearch = () => {
        Swal.fire({
            title: 'AI Nhận diện Cây trồng',
            text: 'Tính năng tải ảnh để định danh loài đang được phát triển.',
            icon: 'info',
            confirmButtonText: 'Đã hiểu'
        });
    };

    // Dữ liệu giả lập cho phần "Loài nổi bật" (Sau này gọi API)
    const featuredPlants = [
        {
            id: 1,
            name: 'Đinh Lăng',
            sciName: 'Polyscias fruticosa',
            family: 'Araliaceae',
            img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Polyscias_fruticosa_2.jpg/450px-Polyscias_fruticosa_2.jpg',
            tag: 'Dược liệu'
        },
        {
            id: 2,
            name: 'Sâm Ngọc Linh',
            sciName: 'Panax vietnamensis',
            family: 'Araliaceae',
            img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Panax_vietnamensis.jpg/300px-Panax_vietnamensis.jpg',
            tag: 'Quý hiếm'
        },
        {
            id: 3,
            name: 'Ngũ Gia Bì Chân Chim',
            sciName: 'Schefflera heptaphylla',
            family: 'Araliaceae',
            img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Schefflera_heptaphylla_kz01.jpg/450px-Schefflera_heptaphylla_kz01.jpg',
            tag: 'Cảnh quan'
        }
    ];

    return (
        <div className="homepage-wrapper">
            {/* 1. HERO SECTION (Tìm kiếm trung tâm) */}
            <section className="hero-section text-center text-white">
                <div className="hero-overlay"></div>
                <Container className="hero-content">
                    <h1 className="display-4 fw-bold mb-3 animate-up">Tra cứu Hình thái Thực vật</h1>
                    <p className="lead mb-5 animate-up delay-1 opacity-75">
                        Hệ thống cơ sở dữ liệu khoa học hỗ trợ định danh và nghiên cứu đa dạng sinh học.
                    </p>

                    <div className="animate-up delay-2 mx-auto" style={{ maxWidth: '700px' }}>
                        <Form onSubmit={handleSearch}>
                            <InputGroup className="shadow-lg">
                                <Form.Control 
                                    placeholder="Nhập tên loài, tên khoa học hoặc đặc điểm..." 
                                    className="hero-search-input py-3"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button variant="light" className="bg-white border-top border-bottom border-0 text-muted" onClick={handleImageSearch}>
                                    <FaCamera size={22} className="text-success" />
                                </Button>
                                <Button variant="success" type="submit" className="hero-search-btn">
                                    <FaSearch className="me-2" /> Tìm kiếm
                                </Button>
                            </InputGroup>
                        </Form>
                        <div className="mt-3 text-white-50 small">
                            <span className="me-2">Gợi ý:</span>
                            <Badge bg="light" text="dark" className="me-2 cursor-pointer bg-opacity-75">Polyscias</Badge>
                            <Badge bg="light" text="dark" className="me-2 cursor-pointer bg-opacity-75">Lá kép</Badge>
                            <Badge bg="light" text="dark" className="cursor-pointer bg-opacity-75">Dược liệu</Badge>
                        </div>
                    </div>
                </Container>
            </section>

            {/* 2. STATS SECTION (Thống kê nhanh) */}
            <section className="py-5 bg-white position-relative shadow-sm" style={{ marginTop: '-60px', zIndex: 10, borderRadius: '40px 40px 0 0' }}>
                <Container>
                    <Row className="text-center g-4">
                        <Col md={4} className="border-end">
                            <FaTree className="text-success mb-2 display-6" />
                            <h3 className="fw-bold mb-0 count-up">150+</h3>
                            <p className="text-muted small text-uppercase fw-bold">Họ Thực Vật</p>
                        </Col>
                        <Col md={4} className="border-end">
                            <FaDna className="text-primary mb-2 display-6" />
                            <h3 className="fw-bold mb-0 count-up">1,200+</h3>
                            <p className="text-muted small text-uppercase fw-bold">Chi & Loài</p>
                        </Col>
                        <Col md={4}>
                            <FaLeaf className="text-warning mb-2 display-6" />
                            <h3 className="fw-bold mb-0 count-up">50,000+</h3>
                            <p className="text-muted small text-uppercase fw-bold">Dữ liệu hình thái</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* 3. FEATURED PLANTS (Danh sách nổi bật) */}
            <section className="py-5 bg-light">
                <Container>
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <div>
                            <h6 className="text-success fw-bold text-uppercase mb-1">Cơ sở dữ liệu</h6>
                            <h2 className="fw-bold text-dark">Loài phổ biến</h2>
                        </div>
                        <Button variant="outline-success" className="rounded-pill fw-bold">
                            Xem tất cả <FaArrowRight className="ms-1" />
                        </Button>
                    </div>

                    <Row className="g-4">
                        {featuredPlants.map((plant) => (
                            <Col key={plant.id} md={4}>
                                <Card className="plant-card h-100 shadow-sm border-0">
                                    <div className="card-img-wrapper">
                                        <Card.Img variant="top" src={plant.img} alt={plant.name} />
                                        <span className="card-badge bg-success text-white">
                                            {plant.tag}
                                        </span>
                                    </div>
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <Card.Title className="fw-bold mb-1">{plant.name}</Card.Title>
                                                <Card.Subtitle className="text-muted fst-italic small">
                                                    {plant.sciName}
                                                </Card.Subtitle>
                                            </div>
                                            <FaSeedling className="text-success" size={20} />
                                        </div>
                                        <hr className="my-2 border-light"/>
                                        <div className="d-flex justify-content-between text-secondary small">
                                            <span>Họ: {plant.family}</span>
                                            <span className="text-success fw-bold cursor-pointer">Chi tiết &rarr;</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* 4. ABOUT SECTION */}
            <section className="py-5 bg-white">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h2 className="fw-bold mb-3">Về Dự án <span className="text-success">PlantDB</span></h2>
                            <p className="text-muted lead">
                                Xây dựng cơ sở dữ liệu hình thái cây trồng chuyên sâu, phục vụ tra cứu và nghiên cứu khoa học.
                            </p>
                            <p className="text-secondary">
                                Hệ thống tích hợp công nghệ AI để hỗ trợ nhận diện loài thông qua hình ảnh lá, hoa và thân cây, giúp sinh viên và nhà nghiên cứu tiết kiệm thời gian định danh.
                            </p>
                            <Button variant="success" size="lg" className="mt-3 rounded-pill shadow-sm">
                                Tìm hiểu thêm
                            </Button>
                        </Col>
                        <Col md={6} className="text-center">
                            <img 
                                src="https://img.freepik.com/free-vector/botanical-concept-illustration_114360-3162.jpg" 
                                alt="About PlantDB" 
                                className="img-fluid" 
                                style={{ maxHeight: '350px' }}
                            />
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default HomePage;