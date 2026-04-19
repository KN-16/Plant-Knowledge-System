import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import adminService from '../../../services/adminService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AccountModalForm = ({ show, onHide, initialData, status, onSuccess }) => {
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
        mode: 'onTouched', 
        reValidateMode: 'onChange',
    }
    );
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // Điền dữ liệu cũ nếu đang ở chế độ Edit
    useEffect(() => {
        if ((status === 'edit'|| status === 'detail')  && initialData) {
            setValue('username', initialData.username);
            setValue('email', initialData.email);
            setValue('full_name', initialData.full_name);
            setValue('phone_number', initialData.phone_number);
            setValue('address', initialData.address);
            setValue('role', initialData.role);
            setValue('status', initialData.status);
        } else {
            reset();
            setValue('role', 'user');
            setValue('status', 'active');
        }
    }, [initialData, status, setValue, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (status === 'add') {
                // Thêm tài khoản mới
                await adminService.createAccount(data);
                Swal.fire('Thành công', 'Tạo tài khoản mới thành công!', 'success');
            } else if (status === 'edit') {
                // Sửa thông tin (không bao gồm pass)
                await adminService.updateAccount(initialData.account_id, data);
                Swal.fire('Thành công', 'Cập nhật thông tin thành công!', 'success');
            } else if (status === 'password') {
                // Đổi mật khẩu
                if (data.new_password !== data.confirm_password) {
                    Swal.fire('Lỗi', 'Mật khẩu xác nhận không khớp!', 'error');
                    setLoading(false);
                    return;
                }
                await adminService.updatePassword(initialData.account_id, {
                    new_password: data.new_password
                });
                Swal.fire('Thành công', 'Đổi mật khẩu thành công!', 'success');
            }
            onSuccess();
        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        } finally {
            setLoading(false);
        }
    };
    const is_detail = status === 'detail';

    const renderFormContent = () => {
        if (status === 'password') {
            return (
                <>
                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu mới <span className="text-danger">*</span></Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control 
                                    type={showPassword ? "text" : "password"} 
                                    {...register('new_password', { 
                                        required: 'Bắt buộc nhập',
                                        minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                                    })}
                                    isInvalid={!!errors.new_password}
                                />
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ borderColor: '#dee2e6' }} // Chỉnh màu viền cho đồng bộ
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                                <Form.Control.Feedback type="invalid">
                                    {errors.new_password?.message}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Xác nhận mật khẩu <span className="text-danger">*</span></Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    {...register('confirm_password', { 
                                        required: 'Bắt buộc nhập',
                                        validate: (value) => value === watch('new_password') || 'Mật khẩu xác nhận không khớp!'
                                    })}
                                    isInvalid={!!errors.confirm_password} 
                                />
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{ borderColor: '#dee2e6' }}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                                <Form.Control.Feedback type="invalid">
                                    {errors.confirm_password?.message}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                </>
            );
        }

        return (
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên đăng nhập (Username) <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="text" 
                            readOnly={status === 'edit'} // Không cho đổi username khi sửa
                            disabled={is_detail || status === 'edit'}
                            {...register('username', { required: 'Bắt buộc nhập' })} 
                            isInvalid={!!errors.username}
                        />
                        <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="email" 
                            {...register('email', { 
                                required: 'Bắt buộc nhập',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'Địa chỉ email không hợp lệ (VD: example@gmail.com)'
                                }
                            })} 
                            isInvalid={!!errors.email}
                            disabled={is_detail}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                {status === 'add' && (
                <>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu <span className="text-danger">*</span></Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control 
                                    type={showPassword ? "text" : "password"} 
                                    {...register('password_hash', { 
                                        required: 'Bắt buộc nhập',
                                        minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                                    })}
                                    isInvalid={!!errors.password_hash}
                                />
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ borderColor: '#dee2e6' }} // Chỉnh màu viền cho đồng bộ
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                                <Form.Control.Feedback type="invalid">
                                    {errors.password_hash?.message}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Xác nhận mật khẩu <span className="text-danger">*</span></Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    {...register('password_confirm', { 
                                        required: 'Bắt buộc nhập',
                                        validate: (value) => value === watch('password_hash') || 'Mật khẩu xác nhận không khớp!'
                                    })}
                                    isInvalid={!!errors.password_confirm} // Đã sửa từ password_hash thành password_confirm
                                />
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{ borderColor: '#dee2e6' }}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                                <Form.Control.Feedback type="invalid">
                                    {errors.password_confirm?.message}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </>
            )}

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control type="text" {...register('full_name')} 
                        disabled={is_detail}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control 
                            type="text" 
                            {...register('phone_number', {
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: 'Số điện thoại phải gồm đúng 10 chữ số'
                                }
                            })} 
                            disabled={is_detail}
                            isInvalid={!!errors.phone_number} // Báo đỏ nếu nhập sai
                        />
                        {/* Hiển thị câu thông báo lỗi */}
                        <Form.Control.Feedback type="invalid">
                            {errors.phone_number?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control type="text" {...register('address')} 
                        disabled={is_detail}    
                        />
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Phân quyền</Form.Label>
                        <Form.Select {...register('role')}
                            disabled={is_detail}>
                            <option value="user">Quản lý dữ liệu</option>
                            <option value="admin">Quản trị viên hệ thống</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Select {...register('status')}
                            disabled={is_detail}>
                            <option value="active">Hoạt động</option>
                            <option value="locked">Bị khóa</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        );
    };

    return (
        <Modal show={show} onHide={onHide} size={status === 'password' ? 'md' : 'lg'} centered backdrop="static">
            <Modal.Header closeButton className="bg-light">
                <Modal.Title className="fw-bold text-primary">
                    {status === 'add' ? 'Thêm Tài Khoản Mới' : status === 'edit' ? 'Chỉnh Sửa Tài Khoản' : status === 'password' ? 'Đổi Mật Khẩu' : 'Chi Tiết Tài Khoản'}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body className="p-4">
                    {renderFormContent()}
                </Modal.Body>
                <Modal.Footer className="bg-light">
                    <Button variant="secondary" onClick={onHide}>{is_detail ? 'Đóng' : 'Hủy bỏ'} </Button>
                    {
                    !is_detail && (<Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Đang lưu...' : 'Lưu dữ liệu'}
                    </Button>)}
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AccountModalForm;