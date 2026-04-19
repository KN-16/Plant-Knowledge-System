import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, InputGroup, Badge } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { 
    FaEye, FaEyeSlash, FaUserCircle, FaLock, 
    FaUserEdit, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaUserShield 
} from 'react-icons/fa';
import adminService from '../../services/adminService';

const UserProfile = () => {
    // THÊM: Lấy hàm watch để hiển thị tên động lên Card Avatar bên trái
    const { register: registerProfile, handleSubmit: handleSubmitProfile, setValue, watch: watchProfile, formState: { errors: errProfile } } = useForm({ mode: 'onTouched' });
    const { register: registerPass, handleSubmit: handleSubmitPass, reset: resetPass, watch: watchPass, formState: { errors: errPass } } = useForm({ mode: 'onTouched' });
    
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPass, setLoadingPass] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [is_admin, setIsAdmin] = useState(false);

    // THÊM STATE: Quản lý Tab Đang mở (Profile hay Password)
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

    useEffect(() => {
        const fetchMyProfile = async () => {
            try {
                const data = await adminService.getMyProfile();
                setIsAdmin(data.role === 'admin');
                setValue('username', data.username);
                setValue('email', data.email);
                setValue('full_name', data.full_name);
                setValue('phone_number', data.phone_number);
                setValue('address', data.address);
                setFetching(false);
            } catch (error) {
                console.error("Lỗi lấy thông tin:", error);
                setFetching(false);
            }
        };
        fetchMyProfile();
    }, [setValue]);

    const onUpdateProfile = async (data) => {
        setLoadingProfile(true);
        try {
            await adminService.updateMyProfile(data);
            Swal.fire('Thành công', 'Cập nhật thông tin cá nhân thành công!', 'success');
        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message || 'Cập nhật thất bại', 'error');
        } finally {
            setLoadingProfile(false);
        }
    };

    const onChangePassword = async (data) => {
        setLoadingPass(true);
        try {
            await adminService.changeMyPassword({
                old_password: data.old_password,
                new_password: data.new_password
            });
            Swal.fire('Thành công', 'Đổi mật khẩu thành công!', 'success');
            resetPass();
            setActiveTab('profile'); // Tự động quay về tab thông tin sau khi đổi pass thành công
        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message || 'Sai mật khẩu cũ', 'error');
        } finally {
            setLoadingPass(false);
        }
    };

    if (fetching) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Spinner animation="grow" variant="success" />
        </div>
    );

    // Bắt giá trị đang gõ để preview lên Card trái
    const currentFullName = watchProfile('full_name');
    const currentEmail = watchProfile('email');

    return (
        <Container fluid className="py-4 px-md-4 fade-in bg-light min-vh-100">
            <div className="d-flex align-items-center mb-4">
                <FaUserEdit className="text-success fs-3 me-3" />
                <h3 className="fw-bolder text-dark mb-0">Tài khoản của tôi</h3>
            </div>

            <Row className="g-4">
                {/* CỘT TRÁI: SUMMARY CÁ NHÂN & ĐIỀU HƯỚNG */}
                <Col lg={4} xl={3}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style={{ top: '20px' }}>
                        {/* Header Gradient */}
                        <div style={{ height: '100px', background: 'linear-gradient(135deg, #198754 0%, #20c997 100%)' }}></div>
                        
                        <Card.Body className="text-center px-4 pb-4" style={{ marginTop: '-50px' }}>
                            {/* Avatar ảo */}
                            <div className="d-inline-block bg-white rounded-circle p-1 mb-3 shadow-sm">
                                <div className="d-flex justify-content-center align-items-center bg-light text-success rounded-circle fw-bold" 
                                     style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}>
                                    {currentFullName ? currentFullName.charAt(0).toUpperCase() : <FaUserCircle />}
                                </div>
                            </div>
                            
                            <h5 className="fw-bold text-dark mb-1">{currentFullName || 'Người dùng'}</h5>
                            <p className="text-muted small mb-3">{currentEmail}</p>
                            
                            <Badge bg={is_admin ? 'danger' : 'info'} className="px-3 py-2 rounded-pill fw-medium mb-4 w-100 text-uppercase" style={{ letterSpacing: '0.5px' }}>
                                {is_admin ? 'Quản trị viên hệ thống' : 'Quản lý dữ liệu'}
                            </Badge>

                            {/* Menu Điều Hướng Tab */}
                            <div className="d-flex flex-column gap-2 text-start">
                                <Button 
                                    variant={activeTab === 'profile' ? "success" : "light"} 
                                    className={`py-2 rounded-3 text-start fw-medium ${activeTab === 'profile' ? 'shadow-sm' : 'text-muted border-0'}`}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    <FaUserShield className="me-3" /> Chi tiết hồ sơ
                                </Button>
                                <Button 
                                    variant={activeTab === 'password' ? "warning" : "light"} 
                                    className={`py-2 rounded-3 text-start fw-medium ${activeTab === 'password' ? 'shadow-sm text-dark' : 'text-muted border-0'}`}
                                    onClick={() => setActiveTab('password')}
                                >
                                    <FaLock className="me-3" /> Đổi mật khẩu
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* CỘT PHẢI: FORM NHẬP LIỆU CHÍNH */}
                <Col lg={8} xl={9}>
                    {/* TAB 1: FORM THÔNG TIN CÁ NHÂN */}
                    <div className={activeTab === 'profile' ? 'd-block fade-in' : 'd-none'}>
                        <Card className="border-0 shadow-sm rounded-4 h-100">
                            <Card.Body className="p-4 p-md-5">
                                <h4 className="fw-bold text-dark mb-4 border-bottom pb-3">Thông tin cơ bản</h4>
                                <Form onSubmit={handleSubmitProfile(onUpdateProfile)}>
                                    <Row className="g-4">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold text-uppercase mb-1">Tên đăng nhập</Form.Label>
                                                <Form.Control type="text" disabled className="bg-light border-0 py-2 custom-input" {...registerProfile('username')} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold text-uppercase mb-1"><FaEnvelope className="me-1"/> Email</Form.Label>
                                                <Form.Control 
                                                    type="email"  
                                                    className={`py-2 custom-input ${!is_admin ? 'bg-light border-0' : ''}`}
                                                    disabled={!is_admin} 
                                                    {...registerProfile('email', {
                                                        pattern: {
                                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                            message: 'Địa chỉ email không hợp lệ'
                                                        }
                                                    })} 
                                                    isInvalid={!!errProfile.email}
                                                />
                                                <Form.Control.Feedback type="invalid">{errProfile.email?.message}</Form.Control.Feedback>
                                                {!is_admin && <Form.Text className="text-muted fst-italic mt-1 d-block" style={{fontSize: '0.8rem'}}>Không thể tự ý thay đổi email. Vui lòng liên hệ Admin.</Form.Text>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold text-uppercase mb-1">Họ và tên</Form.Label>
                                                <Form.Control type="text" className="py-2 custom-input" {...registerProfile('full_name')} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold text-uppercase mb-1"><FaPhoneAlt className="me-1"/> Số điện thoại</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    className="py-2 custom-input"
                                                    {...registerProfile('phone_number', {
                                                        pattern: {
                                                            value: /^\d{10}$/,
                                                            message: 'Số điện thoại phải gồm đúng 10 chữ số'
                                                        }
                                                    })} 
                                                    isInvalid={!!errProfile.phone_number}
                                                />
                                                <Form.Control.Feedback type="invalid">{errProfile.phone_number?.message}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold text-uppercase mb-1"><FaMapMarkerAlt className="me-1"/> Địa chỉ</Form.Label>
                                                <Form.Control as="textarea" rows={2} className="py-2 custom-input" {...registerProfile('address')} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="text-end mt-4 pt-3 border-top">
                                        <Button variant="success" type="submit" disabled={loadingProfile} className="px-5 py-2 rounded-pill fw-bold shadow-sm">
                                            {loadingProfile ? <><Spinner as="span" animation="border" size="sm" className="me-2" /> Đang lưu...</> : 'Lưu thay đổi'}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>

                    {/* TAB 2: FORM ĐỔI MẬT KHẨU */}
                    <div className={activeTab === 'password' ? 'd-block fade-in' : 'd-none'}>
                        <Card className="border-0 shadow-sm rounded-4 h-100">
                            <Card.Body className="p-4 p-md-5">
                                <h4 className="fw-bold text-dark mb-4 border-bottom pb-3">Cập nhật mật khẩu</h4>
                                
                                <div className="alert alert-light border-warning border-start border-4 mb-4" role="alert">
                                    <h6 className="alert-heading fw-bold text-warning mb-1">Mẹo bảo mật</h6>
                                    <p className="mb-0 small text-muted">Vui lòng sử dụng mật khẩu mạnh có chứa chữ hoa, chữ thường và số để đảm bảo an toàn cho dữ liệu hệ thống.</p>
                                </div>

                                <Form onSubmit={handleSubmitPass(onChangePassword)}>
                                    <Row className="g-4">
                                        <Col md={12}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold text-uppercase mb-1">Mật khẩu hiện tại <span className="text-danger">*</span></Form.Label>
                                                <InputGroup hasValidation>
                                                    <Form.Control 
                                                        type={showOldPassword ? "text" : "password"} 
                                                        className="py-2 custom-input"
                                                        {...registerPass('old_password', { required: 'Nhập mật khẩu hiện tại' })} 
                                                        isInvalid={!!errPass.old_password}
                                                    />
                                                    <Button variant="outline-secondary" className="px-3" onClick={() => setShowOldPassword(!showOldPassword)}>
                                                        {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                                                    </Button>
                                                    <Form.Control.Feedback type="invalid">{errPass.old_password?.message}</Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold text-uppercase mb-1">Mật khẩu mới <span className="text-danger">*</span></Form.Label>
                                                <InputGroup hasValidation>
                                                    <Form.Control 
                                                        type={showNewPassword ? "text" : "password"} 
                                                        className="py-2 custom-input"
                                                        {...registerPass('new_password', { 
                                                            required: 'Nhập mật khẩu mới', 
                                                            minLength: {value: 6, message: 'Ít nhất 6 ký tự'} 
                                                        })} 
                                                        isInvalid={!!errPass.new_password}
                                                    />
                                                    <Button variant="outline-secondary" onClick={() => setShowNewPassword(!showNewPassword)}>
                                                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                                    </Button>
                                                    <Form.Control.Feedback type="invalid">{errPass.new_password?.message}</Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold text-uppercase mb-1">Xác nhận mật khẩu <span className="text-danger">*</span></Form.Label>
                                                <InputGroup hasValidation>
                                                    <Form.Control 
                                                        type={showConfirmPassword ? "text" : "password"} 
                                                        className="py-2 custom-input"
                                                        {...registerPass('confirm_password', { 
                                                            required: 'Vui lòng xác nhận mật khẩu',
                                                            validate: (value) => value === watchPass('new_password') || 'Mật khẩu xác nhận không khớp!'
                                                        })} 
                                                        isInvalid={!!errPass.confirm_password}
                                                    />
                                                    <Button variant="outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                    </Button>
                                                    <Form.Control.Feedback type="invalid">{errPass.confirm_password?.message}</Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="text-end mt-4 pt-3 border-top">
                                        <Button variant="warning" type="submit" disabled={loadingPass} className="px-5 py-2 rounded-pill fw-bold shadow-sm text-dark">
                                            {loadingPass ? <><Spinner as="span" animation="border" size="sm" className="me-2" /> Đang xử lý...</> : 'Cập nhật bảo mật'}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>

            <style>{`
                /* Tạo hiệu ứng mượt mà khi chuyển Tab hoặc Focus Input */
                .fade-in { animation: fadeIn 0.4s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                
                /* Tùy chỉnh nhẹ Input cho mềm mại */
                .custom-input { transition: all 0.2s ease; border: 1px solid #dee2e6; }
                .custom-input:focus { border-color: #198754; box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.15); }
                .custom-input:disabled { background-color: #f8f9fa; opacity: 0.8; }
            `}</style>
        </Container>
    );
};

export default UserProfile;