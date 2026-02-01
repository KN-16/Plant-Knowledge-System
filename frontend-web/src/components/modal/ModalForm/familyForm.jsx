// import React, { useEffect } from 'react';
// import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
// import { useForm, Controller } from 'react-hook-form';
// import api from '../../../services/api';
// import Swal from 'sweetalert2';
// import adminService from '../../../services/adminService';

// const defaultValues = {
//         scientific_name: '',
//         vietnamese_name: '',
//         authority: '',
//         description: '',
//         code: '',
// };
// const ModalForm = ({ show, onHide, initialData, onSuccess, type, title,status }) => {
    
//     const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm({ 
//         mode: 'onTouched', reValidateMode: 'onChange',defaultValues: defaultValues, shouldFocusError: true });
    
//     useEffect(() => {
//         if (initialData) {
//             // Clone data và xử lý null -> ''
//             const resetData = { ...initialData };
//             Object.keys(resetData).forEach(key => {
//                 if (resetData[key] === null) resetData[key] = '';
//             });
//             reset(resetData);
//         } else {
//             reset(defaultValues);
//         }
//     }, []);

//     const onSubmit = async (formData) => {
//         console.log('Form Data Submitted:', formData);
//         // if (formData.scientific_name.trim() === '') {
//         //     Swal.fire('Lỗi', 'Tên khoa học là bắt buộc', 'error');
//         //     return;
//         // }
//         try {
//             const payload = { ...formData };
//             // Clean payload - delete spaces
//             Object.keys(payload).forEach(key => {
//                 if (typeof payload[key] === 'string') {
//                     payload[key] = payload[key].trim();
//                 }
//             });
//             // Map select value
//             if (formData.family_select) payload.family_id = formData.family_select.value;
//             // Mapping ID key
//             const idKeyMap = { families: 'family_id', genera: 'genus_id', species: 'species_id' };
//             const idKey = idKeyMap[type];

//             if (initialData) {
//                 console.log('Payload for update:', payload);
//                 await api.put(`${adminService.endpointTaxonomy}/${type}/${initialData[idKey]}`, payload);
//             } else {
//                 await api.post(`${adminService.endpointTaxonomy}/${type}`, payload);
//             }
//             Swal.fire('Thành công', 'Đã lưu dữ liệu', 'success');
//             onSuccess();
//         } catch (error) {
//             Swal.fire('Lỗi', error.response.data.message, 'error');
//         }
//     };

//     return (
//         <Modal show={show} onHide={onHide} size="lg" backdrop="static" centered>
//             <Modal.Header closeButton className="bg-light">
//                 <Modal.Title className="fw-bold text-success">{status === 'detail' ? 'Chi tiết' : status === 'edit' ? 'Cập nhật' : 'Thêm mới'} {title}</Modal.Title> 
//             </Modal.Header>
//             <Form onSubmit={handleSubmit(onSubmit)} noValidate>
//                 <Modal.Body className="p-4">
//                     <Row className="g-3">
//                         { status !== 'add' && <Col md={12}>
//                             <Form.Label className="fw-bold">Mã</Form.Label>
//                             <Form.Control value={initialData.code} disabled />
//                         </Col>}
                        
//                         <Col md={6}>
//                             <Form.Label className="fw-bold">Tên Khoa học <span className="text-danger">*</span></Form.Label>
//                             <Form.Control {...register('scientific_name', { required: "Tên khoa học là bắt buộc" })} placeholder="VD: Polyscias fruticosa" disabled={status === 'detail'} 
//                                 isInvalid={!!errors.scientific_name}
//                             />
//                             <Form.Control.Feedback type="invalid">
//                             {errors.scientific_name?.message}
//                             </Form.Control.Feedback>
//                         </Col>
//                         <Col md={6}>
//                             <Form.Label className="fw-bold">Tên Tiếng Việt</Form.Label>
//                             <Form.Control {...register('vietnamese_name')} placeholder="VD: Đinh lăng" disabled={status === 'detail'} />
//                         </Col>

//                         <Col md={12}>
//                             <Form.Label className="fw-bold">Tác giả</Form.Label>
//                             <Form.Control {...register('authority')} placeholder="VD: (L.) J. W. Grimes" disabled={status === 'detail'} />
//                         </Col>
//                         <Col md={12}>
//                             <Form.Label className="fw-bold">Mô tả / Công dụng</Form.Label>
//                             <Form.Control as="textarea" rows={4} {...register('description')} disabled={status === 'detail'} />
//                         </Col>
//                     </Row>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={onHide}>Đóng</Button>
//                     {status !== 'detail' && <Button variant="success" type="submit">{initialData ? 'Cập nhật' : 'Tạo mới'}</Button>}
//                 </Modal.Footer>
//             </Form>
//         </Modal>
//     );
// };

// export default ModalForm;


import React, { useMemo } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import adminService from '../../../services/adminService';

// Giá trị mặc định rỗng
const DEFAULT_VALUES = {
    scientific_name: '',
    vietnamese_name: '',
    authority: '',
    description: '',
    code: ''};

const ModalForm = ({ show, onHide, initialData, onSuccess, type, title, status }) => {
    
    // 1. CHUẨN BỊ DATA: Dùng useMemo để tính toán dữ liệu đầu vào chuẩn xác
    // React 19 sẽ tự động track dependency initialData cực tốt
    const formValues = useMemo(() => {
        if (!initialData) return DEFAULT_VALUES;

        // Clone và xử lý null -> ''
        const data = { ...initialData };
        Object.keys(data).forEach(key => {
            if (data[key] === null) data[key] = '';
        });
        return data;
    }, [initialData, type]);

    // 2. KHỞI TẠO FORM: Dùng prop `values` thay vì useEffect + reset
    const { register, handleSubmit, formState: { errors } } = useForm({ 
        mode: 'onTouched', 
        reValidateMode: 'onChange',
        defaultValues: DEFAULT_VALUES,
        values: formValues, // <--- QUAN TRỌNG: Tự động sync data vào form input
    });

    const onSubmit = async (formData) => {
        console.log('✅ Form Data nhận được:', formData); // Chắc chắn sẽ có dữ liệu ở đây
        try {
            const payload = { ...formData };
            
            // Trim dữ liệu string
            Object.keys(payload).forEach(key => {
                if (typeof payload[key] === 'string') {
                    payload[key] = payload[key].trim();
                }
            });
           
            const idKeyMap = { families: 'family_id', genera: 'genus_id', species: 'species_id' };
            const idKey = idKeyMap[type];

            if (initialData) {
                await api.put(`${adminService.endpointTaxonomy}/${type}/${initialData[idKey]}`, payload);
            } else {
                await api.post(`${adminService.endpointTaxonomy}/${type}`, payload);
            }
            
            Swal.fire('Thành công', 'Đã lưu dữ liệu', 'success');
            onSuccess();
        } catch (error) {
            console.error(error);
            Swal.fire('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" backdrop="static" centered>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title className="fw-bold text-success">
                    {status === 'detail' ? 'Chi tiết' : status === 'edit' ? 'Cập nhật' : 'Thêm mới'} {title}
                </Modal.Title> 
            </Modal.Header>
            
            {/* noValidate để tắt popup lỗi mặc định của trình duyệt */}
            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Modal.Body className="p-4">
                    <Row className="g-3">
                        {status !== 'add' && (
                            <Col md={12}>
                                <Form.Label className="fw-bold">Mã</Form.Label>
                                {/* Dùng optional chaining ?. code || '' để tránh lỗi null */}
                                <Form.Control value={initialData?.code || ''} disabled />
                            </Col>
                        )}
                        
                        <Col md={6}>
                            <Form.Label className="fw-bold">Tên Khoa học <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                // Đăng ký validation trực tiếp tại đây
                                {...register('scientific_name', { 
                                    required: "Tên khoa học là bắt buộc",
                                    validate: value => value.trim() !== '' || "Tên khoa học không được để trống"
                                })} 
                                placeholder="VD: Araliaceae Juss" 
                                disabled={status === 'detail'} 
                                isInvalid={!!errors.scientific_name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.scientific_name?.message}
                            </Form.Control.Feedback>
                        </Col>

                        <Col md={6}>
                            <Form.Label className="fw-bold">Tên Tiếng Việt</Form.Label>
                            <Form.Control {...register('vietnamese_name')} placeholder="VD: Ngũ gia bì" disabled={status === 'detail'} />
                        </Col>

                        <Col md={12}>
                            <Form.Label className="fw-bold">Tác giả</Form.Label>
                            <Form.Control {...register('authority')} placeholder="VD: Antoine Laurent de Jussieu" disabled={status === 'detail'} />
                        </Col>
                        <Col md={12}>
                            <Form.Label className="fw-bold">Mô tả / Công dụng</Form.Label>
                            <Form.Control as="textarea" rows={4} {...register('description')} disabled={status === 'detail'} />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Đóng</Button>
                    {status !== 'detail' && <Button variant="success" type="submit">
                        {initialData ? 'Cập nhật' : 'Tạo mới'}
                    </Button>}
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalForm;