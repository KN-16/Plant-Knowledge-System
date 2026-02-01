import React from 'react';
import { Navbar, Container, Form, InputGroup, Button, Nav } from 'react-bootstrap';
import { FaLeaf, FaSearch, FaCamera, FaSignInAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const GuestNavbar = () => {
    const navigate = useNavigate();
    return (
        <Navbar bg="white" expand="lg" className="shadow-sm py-2 sticky-top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-success fw-bold fs-4">
                    <FaLeaf className="me-2" /> PlantDB
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Form className="d-flex mx-auto my-2 w-50">
                        <InputGroup>
                            <Form.Control placeholder="Tìm kiếm cây, đặc điểm..." className="rounded-start-pill border-end-0 bg-light" />
                            <Button variant="light" className="border-top border-bottom bg-light text-muted"><FaCamera /></Button>
                            <Button variant="success" className="rounded-end-pill px-4"><FaSearch /></Button>
                        </InputGroup>
                    </Form>
                    {/* <Nav className="ms-auto">
                        <Button variant="outline-primary" className="rounded-pill px-4" onClick={() => navigate('/login')}>
                            <FaSignInAlt className="me-2"/> Admin
                        </Button>
                    </Nav> */}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default GuestNavbar;