import React, { useState, useRef } from 'react';
import { Navbar, Container, Form, InputGroup, Button, Nav, OverlayTrigger, Popover } from 'react-bootstrap';
import { FaLeaf, FaSearch, FaCamera, FaUserShield, FaBookOpen, FaProjectDiagram, FaHome, FaInfoCircle } from 'react-icons/fa';
import { Link, NavLink, useNavigate, useLocation, createSearchParams } from 'react-router-dom';
import ImageSearchModal from '../modal/ImageSearchModal';

const GuestNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    
    // State lưu trữ từ khóa tìm kiếm
    const [searchValue, setSearchValue] = useState('');
    const formRef = useRef(null);

    const [showImageSearchModal, setShowImageSearchModal] = useState(false);

    // Xử lý khi nhấn nút Tìm kiếm hoặc Enter
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchValue.trim() !== '') {
            // Điều hướng sang trang Thư viện kèm Query Parameter
            navigate({
                pathname: '/varieties',
                search: createSearchParams({
                    search: searchValue.trim()
                }).toString()
            });
        }
    };

    // Khung hướng dẫn tìm kiếm (Tooltip Popover)
    const searchHelpPopover = (
        <Popover id="popover-search-help" className="shadow border-success border-opacity-25 rounded-4">
            <Popover.Header as="h3" className="bg-success bg-opacity-10 text-success fw-bold border-bottom-0 rounded-top-4">
                💡 Mẹo tìm kiếm thông minh
            </Popover.Header>
            <Popover.Body className="text-muted small">
                <p className="mb-2">
                    Bạn có thể nhập bất kỳ từ khóa nào để tìm kiếm, hệ thống sẽ đối chiếu trên toàn bộ thông tin về cây:
                </p>
                <ul className="mb-0 ps-3">
                    <li className="mb-1">
                        <b>Tên cây:</b> Tên tiếng Việt hoặc tên khoa học (VD: <i>Đinh lăng, Polyscias</i>)
                    </li>
                    <li className="mb-1">
                        <b>Tên gọi khác:</b> Tên địa phương, tên đồng nghĩa
                    </li>
                    <li className="mb-1">
                        <b>Đặc điểm nổi bật:</b> Hình thái như lá, thân, màu sắc... (VD: lá nhỏ, viền trắng)
                    </li>
                    <li className="mb-1">
                        <b>Công dụng:</b> Làm thuốc, làm cảnh, hoặc mục đích sử dụng khác
                    </li>
                    <li className="mb-1">
                        <b>Phân loại:</b> Tên loài, chi hoặc họ thực vật
                    </li>
                    <li>
                        <b>Mã nội bộ:</b> Mã quản lý trong hệ thống (VD: <i>VAR-0001</i>)
                    </li>
                </ul>
            </Popover.Body>
        </Popover>
    );

    return (
        <>
            {/* Navbar */}
        <Navbar bg="white" expand="lg" className="shadow-sm py-2 sticky-top">
            <Container fluid className="px-3 px-xl-5">
                {/* 1. LOGO */}
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-success fw-bolder fs-4 me-4">
                    <FaLeaf className="me-2" /> PlantDB
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    
                    {/* 2. CÁC LIÊN KẾT ĐIỀU HƯỚNG (NAV LINKS) */}
                    <Nav className="gap-1 gap-lg-3 my-3 my-lg-0">
                        <Nav.Link 
                            as={NavLink} 
                            to="/" 
                            className="fw-medium d-flex align-items-center rounded px-3 py-2 transition-all nav-item-custom"
                            title="Trang chủ"
                        >
                            <FaHome className="me-2 opacity-75" /> Trang chủ
                        </Nav.Link>
                        
                        <Nav.Link 
                            as={NavLink} 
                            to="/varieties" 
                            className="fw-medium d-flex align-items-center rounded px-3 py-2 transition-all nav-item-custom"
                        >
                            <FaBookOpen className="me-2 opacity-75" /> Thư viện Thực vật
                        </Nav.Link>
                        
                        <Nav.Link 
                            as={NavLink} 
                            to="/taxonomy-explorer" 
                            className="fw-medium d-flex align-items-center rounded px-3 py-2 transition-all nav-item-custom"
                        >
                            <FaProjectDiagram className="me-2 opacity-75" /> Sơ đồ Phân loại
                        </Nav.Link>
                    </Nav>

                    {/* 3. THANH TÌM KIẾM CHÍNH */}
                    {!isHomePage && (
                        <Form 
                            className="d-flex flex-grow-1 mx-lg-4 my-2 my-lg-0 align-items-center position-relative" 
                            style={{ maxWidth: '450px' }}
                            onSubmit={handleSearchSubmit}
                            ref={formRef}
                        >
                            <InputGroup className="flex-grow-1 shadow-sm rounded-pill bg-light">
                                <Form.Control 
                                    placeholder="Xem hướng dẫn tìm kiếm..." 
                                    className="rounded-start-pill border-success border-opacity-25 bg-transparent px-4 py-2 border-end-0 focus-ring-0" 
                                    style={{ fontSize: '0.95rem' }}
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                                
                                {/* Nút Camera (Có thể phát triển sau) */}
                                <Button variant="light" className="border-top border-bottom border-success border-opacity-25 bg-transparent text-muted px-3"
                                    onClick={() => setShowImageSearchModal(true)}>
                                    <FaCamera />
                                </Button>
                                
                                {/* Nút Tìm Kiếm */}
                                <Button type="submit" variant="success" className="rounded-end-pill px-4">
                                    <FaSearch />
                                </Button>
                            </InputGroup>

                            {/* Nút Hướng Dẫn Nằm Ngay Cạnh Thanh Search */}
                            <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={searchHelpPopover}>
                                <div className="ms-2 cursor-pointer text-muted hover-text-success transition-all d-none d-sm-block">
                                    <FaInfoCircle size={18} />
                                </div>
                            </OverlayTrigger>
                        </Form>
                    )}

                    {/* 4. NÚT ADMIN */}
                    <Nav className="ms-lg-auto mt-3 mt-lg-0 align-items-center">
                        <Nav.Link 
                            onClick={() => navigate('/login')}
                            className="text-muted d-flex align-items-center px-3 py-2 rounded admin-btn-custom"
                            title="Đăng nhập quản trị"
                        >
                            <FaUserShield size={18} />
                            <span className="ms-2 d-lg-none fw-medium">Đăng nhập Admin</span>
                        </Nav.Link>
                    </Nav> 
                    
                </Navbar.Collapse>
            </Container>

            <style>{`
                /* Tắt viền xanh mặc định của Bootstrap khi focus ô Input */
                .focus-ring-0:focus {
                    box-shadow: none !important;
                    border-color: rgba(25, 135, 84, 0.25) !important;
                    background-color: #fff !important;
                }
                
                .nav-item-custom { color: #495057 !important; }
                .nav-item-custom:hover { background-color: #f8f9fa; color: #198754 !important; }
                .nav-item-custom.active { background-color: rgba(25, 135, 84, 0.1); color: #198754 !important; font-weight: 600 !important; }
                
                .admin-btn-custom:hover { color: #198754 !important; background-color: #f8f9fa; }
                .hover-text-success:hover { color: #198754 !important; }
                .cursor-pointer { cursor: pointer; }
                .transition-all { transition: all 0.2s ease-in-out; }
            `}</style>
        </Navbar>

        <ImageSearchModal
            show={showImageSearchModal}
            onHide={() => setShowImageSearchModal(false)}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            formRef={formRef}
        />
        </>
    );
};

export default GuestNavbar;