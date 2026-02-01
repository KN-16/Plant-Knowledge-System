import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaTree, FaDna, FaLeaf, FaUsers } from 'react-icons/fa';
import adminService from '../../services/adminService';
import Loading from '../../components/common/Loading';

const Dashboard = () => {
    const [stats, setStats] = useState({ families: 0, genera: 0, species: 0, users: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Gọi API thống kê (Sẽ tạo ở backend bên dưới)
                const data = await adminService.fetchDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Lỗi tải thống kê", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Loading />;

    const StatCard = ({ title, count, icon, color }) => (
        <Card className={`border-0 shadow-sm h-100 border-start border-4 border-${color}`}>
            <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                    <h6 className="text-muted text-uppercase mb-2">{title}</h6>
                    <h2 className="fw-bold mb-0">{count}</h2>
                </div>
                <div className={`bg-${color} bg-opacity-10 p-3 rounded-circle text-${color}`}>
                    {icon}
                </div>
            </Card.Body>
        </Card>
    );

    return (
        <div className="container-fluid">
            <h3 className="mb-4 fw-bold text-dark">Tổng quan hệ thống</h3>
            <Row className="g-4">
                <Col md={3}>
                    <StatCard title="Tổng số Họ" count={stats.families} icon={<FaTree size={24}/>} color="success" />
                </Col>
                <Col md={3}>
                    <StatCard title="Tổng số Chi" count={stats.genera} icon={<FaDna size={24}/>} color="info" />
                </Col>
                <Col md={3}>
                    <StatCard title="Tổng số Loài" count={stats.species} icon={<FaLeaf size={24}/>} color="warning" />
                </Col>
                <Col md={3}>
                    <StatCard title="Admin" count={stats.users} icon={<FaUsers size={24}/>} color="primary" />
                </Col>
            </Row>
            
            {/* Khu vực biểu đồ hoặc danh sách mới nhất (Placeholder) */}
            <Row className="mt-4">
                <Col md={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-bold py-3">Hoạt động gần đây</Card.Header>
                        <Card.Body>
                            <p className="text-muted text-center py-5">Chưa có dữ liệu hoạt động.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;