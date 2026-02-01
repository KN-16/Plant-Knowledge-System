import React, { useState } from 'react';
import { Modal, Button, Form, Alert, ProgressBar } from 'react-bootstrap';
import api from '../../../services/api';
import Swal from 'sweetalert2';

const ExcelImportModal = ({ show, onHide, onSuccess, type }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImport = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post(`/${type}/import`, formData);
            onHide();
            
            let htmlMsg = `Thành công: <b>${res.data.success}</b><br/>Lỗi: <b class="text-danger">${res.data.fail}</b>`;
            if (res.data.errorFileUrl) {
                htmlMsg += `<br/><br/><a href="http://localhost:3000${res.data.errorFileUrl}" class="btn btn-sm btn-danger">Tải file lỗi</a>`;
            }

            Swal.fire({
                title: 'Kết quả Import',
                html: htmlMsg,
                icon: res.data.fail > 0 ? 'warning' : 'success'
            });
            onSuccess();
        } catch (error) {
            Swal.fire('Lỗi', 'Import thất bại', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Import Excel ({type})</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant="info">
                    <i className="fa fa-info-circle me-2"></i>
                    Vui lòng sử dụng file mẫu chuẩn. <a href={`http://localhost:3000/uploads/format-excel-data/${type}_template.xlsx`} download className="fw-bold">Tải tại đây</a>
                </Alert>
                <Form.Group>
                    <Form.Label className="fw-bold">Chọn file (.xlsx)</Form.Label>
                    <Form.Control type="file" onChange={e => setFile(e.target.files[0])} accept=".xlsx, .xls" />
                </Form.Group>
                {loading && <ProgressBar animated now={100} label="Đang xử lý..." className="mt-3" variant="success" />}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={loading}>Hủy</Button>
                <Button variant="success" onClick={handleImport} disabled={loading}>
                    {loading ? 'Đang import...' : 'Bắt đầu Import'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ExcelImportModal;