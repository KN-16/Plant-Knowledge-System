import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <Container className="text-center">
                <FaExclamationTriangle className="text-warning mb-4" size={80} />
                <h1 className="display-1 fw-bold text-dark">404</h1>
                <h3 className="mb-4">Không tìm thấy trang</h3>
                <p className="text-muted mb-5">Đường dẫn bạn truy cập không tồn tại hoặc đã bị xóa.</p>
                <Link to="/">
                    <Button variant="primary" size="lg" className="rounded-pill px-5 shadow">
                        <FaHome className="me-2" /> Về trang chủ
                    </Button>
                </Link>
            </Container>
        </div>
    );
};

export default NotFound;