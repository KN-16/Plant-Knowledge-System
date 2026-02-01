import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loading = ({ fullScreen = false }) => {
    if (fullScreen) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-white position-fixed top-0 start-0 w-100" style={{ zIndex: 9999 }}>
                <div className="text-center">
                    <Spinner animation="border" variant="success" style={{ width: '3rem', height: '3rem' }} />
                    <p className="mt-2 text-muted fw-bold">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }
    return (
        <div className="text-center py-5">
            <Spinner animation="grow" variant="success" />
            <Spinner animation="grow" variant="success" className="mx-2" />
            <Spinner animation="grow" variant="success" />
        </div>
    );
};

export default Loading;