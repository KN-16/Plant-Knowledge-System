import React from 'react';
import { Navbar, Container, Dropdown, Form, InputGroup, Button } from 'react-bootstrap';
import { FaBars, FaSearch, FaCamera, FaSignOutAlt, FaHome, FaUserShield } from 'react-icons/fa';
import { useAuthContext } from '../../../context/useAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminNavbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        Swal.fire({
            title: 'Đăng xuất?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đăng xuất',
            cancelButtonText: 'Huỷ'
        }).then(async (res) => {
            if (res.isConfirmed) {
                await logout();
                Swal.fire({
                    title: 'Đã đăng xuất',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                navigate('/login');
            }
        });
    };

    return (
        <Navbar bg="white" expand="lg" className="shadow-sm px-3 py-2 sticky-top">
            <Container fluid>
                {/* ... Các phần Button Sidebar, Home, Search giữ nguyên ... */}
                <Button variant="link" className="text-dark me-3" onClick={toggleSidebar}>
                    <FaBars size={20} />
                </Button>
                {/* <Link to="/" className="btn btn-light rounded-circle text-success me-3" title="Trang chủ khách">
                     <FaHome size={24} />
                </Link> */}
                {/* <Form className="d-none d-md-flex w-50 mx-auto">
                    <InputGroup>
                        <Form.Control 
                            placeholder="Tìm kiếm dữ liệu..." 
                            className="rounded-start-pill border-end-0 bg-light focus-ring focus-ring-success border-light" 
                        />
                        <Button variant="light" className="border border-start-0 bg-light text-muted">
                            <FaCamera />
                        </Button>
                        <Button variant="success" className="rounded-end-pill px-4">
                            <FaSearch />
                        </Button>
                    </InputGroup>
                </Form> */}

                {/* User Menu Area */}
                <div className="d-flex align-items-center gap-3 "
                     style={{ marginRight: '120px' }}>
                    
                    {/* --- SỬA LOGIC DROPDOWN ĐỂ KHÔNG BỊ TRÀN MÀN HÌNH --- */}
                    <Dropdown> 
                        {/* 1. align="end": Bắt buộc phải có để cạnh phải của Menu 
                              thẳng hàng với cạnh phải của Nút bấm -> Không bị tràn ra ngoài.
                        */}
                        <Dropdown.Toggle
                            variant="transparent"
                            className="border-0 p-0 d-flex align-items-center gap-2 no-arrow"
                            id="user-dropdown"
                        >
                            <div className="position-relative">
                                <FaUserShield size={28} className="text-success" />
                                <span className="position-absolute bottom-0 end-0 bg-warning border border-white rounded-circle" 
                                      style={{ width: '10px', height: '10px' }}></span>
                            </div>
                            <span className="fw-bold text-dark d-none d-sm-block">{user?.username || 'Admin'}</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu 
                            className="shadow-lg border-0 mt-3 p-2 animate__animated animate__fadeIn"
                            style={{ 
                                minWidth: '220px', 
                                borderRadius: '12px',
                                /* Không cần left/right ở đây nữa vì align="end" đã lo rồi */
                            }}
                        >
                            {/* 2. CHỈNH VỊ TRÍ MŨI TÊN (QUAN TRỌNG)
                                Vì menu đang căn lề phải (align="end"), nên ta tính vị trí mũi tên từ BÊN PHẢI vào.
                                Cái khiên nằm bên trái của nút, nhưng nút này bao gồm cả (Khiên + Tên).
                                Ta cần đẩy mũi tên sang phải một chút để khớp với cái khiên.
                            */}
                            <div style={{
                                position: 'absolute',
                                top: '-8px',
                                // Thay vì left: 20px, ta dùng right + calc hoặc ước lượng
                                // Nếu chỉ hiện icon (mobile): right tầm 10px
                                // Nếu hiện icon + tên (desktop): right cần lớn hơn (để trỏ về phía icon bên trái)
                                right: 'auto', 
                                left: '15px', // Mẹo: Dù menu align right, ta vẫn có thể set mũi tên absolute theo left của menu
                                width: '0', 
                                height: '0', 
                                borderLeft: '8px solid transparent',
                                borderRight: '8px solid transparent',
                                borderBottom: '8px solid white'
                            }}></div>

                            <div className="px-3 py-2 border-bottom mb-2">
                                <p className="m-0 fw-bold text-dark">{user?.full_name || 'Administrator'}</p>
                                <small className="text-muted" style={{fontSize: '12px'}}>
                                    {user?.email || 'admin@system.com'}
                                </small>
                            </div>

                            <Dropdown.Item href="/admin/profile" className="rounded-2 py-2 mb-1">
                                <FaUserShield className="me-2 text-success"/> Hồ sơ cá nhân
                            </Dropdown.Item>
                            
                            <Dropdown.Divider />
                            
                            <Dropdown.Item onClick={handleLogout} className="rounded-2 py-2 text-danger fw-medium">
                                <FaSignOutAlt className="me-2"/> Đăng xuất
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Container>
        </Navbar>
    );
};

export default AdminNavbar;