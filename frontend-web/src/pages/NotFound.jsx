import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUserShield, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = location.pathname.startsWith('/admin');

  const handleBack = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <Container className="text-center">
        <FaExclamationTriangle size={80} className="text-warning mb-4" />

        <h1 className="display-1 fw-bold">404</h1>
        <h3>Không tìm thấy trang</h3>

        <p className="text-muted mb-5">
          Đường dẫn bạn truy cập không tồn tại hoặc đã bị xóa.
        </p>

        <Button
          variant={isAdmin ? "dark" : "primary"}
          size="lg"
          className="rounded-pill px-5"
          onClick={handleBack}
        >
          {isAdmin ? (
            <>
              <FaUserShield className="me-2" />
              Về trang quản trị
            </>
          ) : (
            <>
              <FaHome className="me-2" />
              Về trang chủ
            </>
          )}
        </Button>
      </Container>
    </div>
  );
};

export default NotFound;
