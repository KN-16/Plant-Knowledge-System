import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { FaLeaf, FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import GuestNavbar from './GuestNavbar';

const GuestLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* 1. NAVBAR KHÁCH */}
            <GuestNavbar />

            {/* 2. NỘI DUNG CHÍNH (Thay đổi theo Route) */}
            <main className="flex-grow-1">
                <Outlet />
            </main>

            {/* 3. FOOTER CHUYÊN NGHIỆP */}
            <footer className="bg-dark text-white pt-5 pb-3 mt-auto">
                <Container>
                    <Row className="g-4">
                        {/* Cột 1: Thông tin chung */}
                        <Col md={4}>
                            <h5 className="text-success fw-bold mb-3 d-flex align-items-center">
                                <FaLeaf className="me-2" /> PlantDB
                            </h5>
                            <p className="text-white-50 small">
                                Hệ thống Cơ sở dữ liệu hình thái thực vật, hỗ trợ tra cứu, 
                                định danh và nghiên cứu đa dạng sinh học với sự hỗ trợ của AI.
                            </p>
                            <div className="d-flex gap-3 mt-3">
                                <a href="#" className="text-white-50 hover-text-white"><FaFacebook size={20} /></a>
                                <a href="#" className="text-white-50 hover-text-white"><FaTwitter size={20} /></a>
                                <a href="#" className="text-white-50 hover-text-white"><FaLinkedin size={20} /></a>
                            </div>
                        </Col>

                        {/* Cột 2: Liên kết nhanh */}
                        <Col md={4}>
                            <h6 className="text-uppercase fw-bold mb-3">Liên kết nhanh</h6>
                            <ul className="list-unstyled text-white-50 small">
                                <li className="mb-2"><Link to="/" className="text-decoration-none text-white-50 hover-text-success">Trang chủ</Link></li>
                                <li className="mb-2"><a href="#" className="text-decoration-none text-white-50 hover-text-success">Giới thiệu đề tài</a></li>
                                <li className="mb-2"><a href="#" className="text-decoration-none text-white-50 hover-text-success">Hướng dẫn tra cứu</a></li>
                                <li className="mb-2"><Link to="/login" className="text-decoration-none text-white-50 hover-text-success">Dành cho Quản trị viên</Link></li>
                            </ul>
                        </Col>

                        {/* Cột 3: Liên hệ */}
                        <Col md={4}>
                            <h6 className="text-uppercase fw-bold mb-3">Liên hệ</h6>
                            <ul className="list-unstyled text-white-50 small">
                                <li className="mb-2 d-flex align-items-start">
                                    <FaMapMarkerAlt className="me-2 mt-1 text-success" /> 
                                    <span>Trường Đại học Công nghệ Thông tin<br/>Khu phố 6, P.Linh Trung, Tp.Thủ Đức</span>
                                </li>
                                <li className="mb-2 d-flex align-items-center">
                                    <FaEnvelope className="me-2 text-success" /> 
                                    <span>contact@plantdb.com</span>
                                </li>
                                <li className="mb-2 d-flex align-items-center">
                                    <FaPhone className="me-2 text-success" /> 
                                    <span>(028) 372 52002</span>
                                </li>
                            </ul>
                        </Col>
                    </Row>

                    <hr className="border-secondary my-4" />

                    <div className="text-center text-white-50 small">
                        <p className="mb-0">&copy; {new Date().getFullYear()} Plant Phenotype Database System. Luận văn Thạc sĩ.</p>
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default GuestLayout;