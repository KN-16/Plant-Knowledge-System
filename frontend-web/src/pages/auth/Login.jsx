import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../context/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaLeaf } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Login = () => {
    const { register, handleSubmit } = useForm();
    const { login } = useAuthContext();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await login(data.username, data.password);
            Swal.fire({ icon: 'success', title: 'Đăng nhập thành công', timer: 1500, showConfirmButton: false });
            navigate('/admin/dashboard');
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Đăng nhập thất bại', text: error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.', timer: 2000, showConfirmButton: false });
        }
    };

    return (
        <div className="d-flex align-items-center min-vh-100 bg-light">
            <Container>
                <Row className="justify-content-center">
                    <Col md={5}>
                        <Card className="shadow-lg border-0 rounded-4">
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <FaLeaf className="text-success display-1 mb-3" />
                                    <h3 className="fw-bold text-dark">Đăng nhập Admin</h3>
                                </div>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Form.Group className="mb-3">
                                        {/* <Form.Label className="fw-bold text-dark mb-2">Tên đăng nhập hoặc email</Form.Label> */}
                                        <Form.Control {...register('username')} placeholder="Nhập tên đăng nhập hoặc email..." size="lg" className="rounded-pill bg-light border-0 px-4" />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        {/* <Form.Label className="fw-bold text-dark mb-2">Mật khẩu</Form.Label> */}
                                        <Form.Control {...register('password')} type="password" placeholder="Mật khẩu" size="lg" className="rounded-pill bg-light border-0 px-4" />
                                    </Form.Group>
                                    <Button type="submit" variant="success" size="lg" className="w-100 rounded-pill fw-bold shadow-sm">ĐĂNG NHẬP</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;