import React, { useEffect, useState } from 'react';
import { Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { 
    FaTree, FaDna, FaLeaf, FaSeedling, 
    FaUsers, FaImage, FaGlobeAsia, FaEye, FaRobot 
} from 'react-icons/fa';
import adminService from '../../services/adminService';
import Loading from '../../components/common/Loading';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
    // Mở rộng state để chứa nhiều dữ liệu xịn sò hơn từ DB
    const [stats, setStats] = useState({
        flora: { families: 0, genera: 0, species: 0, varieties: 0, totalViews: 0 },
        ai: { totalSystemImages: 0, totalImages: 0, completedImages: 0 },
        geo: { provinces: 0, distributions: 0 },
        users: { total: 0, active: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.fetchDashboardStats();
                // Merge data từ API với state mặc định để tránh lỗi undefined
                setStats(prev => ({ ...prev, ...data }));
            } catch (error) {
                console.error("Lỗi tải thống kê", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="py-5"><Loading /></div>;

    // Component Card Thống kê chính (Gradient hiện đại)
    const PrimaryStatCard = ({ title, count, icon, bgGradient }) => (
        <Card className={`border-0 shadow-sm h-100 stat-card-hover text-white rounded-4 overflow-hidden`} style={{ background: bgGradient }}>
            <Card.Body className="position-relative p-4">
                <div className="position-relative z-1">
                    <h6 className="text-white-50 text-uppercase fw-bold mb-2" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>{title}</h6>
                    <h2 className="fw-bolder mb-0 display-5">{count}</h2>
                </div>
                {/* Icon làm mờ chìm ở góc phải */}
                <div className="position-absolute opacity-25" style={{ bottom: '-10px', right: '-10px', transform: 'rotate(-15deg)' }}>
                    {React.cloneElement(icon, { size: 100 })}
                </div>
            </Card.Body>
        </Card>
    );

    // Component Card Thống kê phụ (Trắng, viền mảnh)
    const SecondaryStatCard = ({ title, count, subtitle, icon, color }) => (
        <Card className="border-0 shadow-sm h-100 stat-card-hover rounded-4">
            <Card.Body className="d-flex align-items-center p-4">
                <div className={`bg-${color} bg-opacity-10 p-3 rounded-circle text-${color} me-4`}>
                    {React.cloneElement(icon, { size: 28 })}
                </div>
                <div>
                    <h6 className="text-muted fw-bold mb-1" style={{ fontSize: '0.9rem' }}>{title}</h6>
                    <h4 className="fw-bolder text-dark mb-0">{count}</h4>
                    {subtitle && <small className="text-muted">{subtitle}</small>}
                </div>
            </Card.Body>
        </Card>
    );

    // Tính % AI xử lý
    const aiProgress = stats.ai.totalImages > 0 
        ? Math.round((stats.ai.completedImages / stats.ai.totalImages) * 100) 
        : 0;

    return (
        <div className="container-fluid py-2 fade-in">
            <Helmet>
                <title>PlantDB | Tổng Quan Hệ Thống</title>
            </Helmet>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bolder text-dark border-start border-success border-4 ps-3 mb-0">Tổng Quan Hệ Thống</h3>
                <span className="text-muted fst-italic">Cập nhật lần cuối: Hôm nay</span>
            </div>

            {/* ROW 1: Hệ thống Phân loại (Thực vật) */}
            <h6 className="fw-bold text-success text-uppercase mb-3 mt-2"><FaLeaf className="me-2"/>Hệ thống phân loại thực vật</h6>
            <Row className="g-4 mb-4">
                <Col md={3}>
                    <PrimaryStatCard title="Tổng số Họ (Family)" count={stats.flora.families} icon={<FaTree />} bgGradient="linear-gradient(135deg, #2b5876 0%, #4e4376 100%)" />
                </Col>
                <Col md={3}>
                    <PrimaryStatCard title="Tổng số Chi (Genus)" count={stats.flora.genera} icon={<FaDna />} bgGradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" />
                </Col>
                <Col md={3}>
                    <PrimaryStatCard title="Tổng số Loài (Species)" count={stats.flora.species} icon={<FaLeaf />} bgGradient="linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)" />
                </Col>
                <Col md={3}>
                    <PrimaryStatCard title="Biến thể & Giống (Variety)" count={stats.flora.varieties} icon={<FaSeedling />} bgGradient="linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)" />
                </Col>
            </Row>

            <Row className="g-4">
                {/* CỘT TRÁI: Dữ liệu AI và Tương tác */}
                <Col lg={7}>
                <h6 className="fw-bold text-primary text-uppercase mb-3"><FaRobot className="me-2"/>Học máy & Tương tác</h6>
                <Card className="border-0 shadow-sm rounded-4 h-100">
                    <Card.Body className="p-4">
                        <Row className="g-4 h-100">
                            {/* CỘT 1: Thống kê Ảnh & Tiến độ AI */}
                            <Col sm={6}>
                                <div className="p-3 border rounded-4 bg-light h-100 d-flex flex-column justify-content-between">
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-bold text-muted">Kho dữ liệu hình ảnh</span>
                                            <FaImage className="text-primary fs-4"/>
                                        </div>
                                        <h3 className="fw-bolder mb-1 text-dark">
                                            {stats.ai.totalSystemImages} <span className="fs-6 text-muted fw-normal">ảnh tổng</span>
                                        </h3>
                                    </div>
                                    
                                    <div className="mt-3 pt-3 border-top">
                                        <div className="d-flex justify-content-between small text-muted mb-1">
                                            <span>Tiến độ xử lý AI (Completed)</span>
                                            <span className="fw-bold text-success">{aiProgress}%</span>
                                        </div>
                                        <ProgressBar now={aiProgress} variant="success" style={{ height: '8px' }} className="mb-1" />
                                        <small className="text-muted d-block text-end fst-italic">
                                            {stats.ai.completedImages}/ {stats.ai.totalImages} ảnh tiêu chuẩn
                                        </small>
                                    </div>
                                </div>
                            </Col>

                            {/* CỘT 2: Lượt tra cứu */}
                            <Col sm={6}>
                                <div className="p-3 border rounded-4 bg-light h-100 d-flex flex-column justify-content-center">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="fw-bold text-muted">Tổng lượt tra cứu</span>
                                        <FaEye className="text-warning fs-4"/>
                                    </div>
                                    <h3 className="fw-bolder mb-0 text-dark">
                                        {stats.flora.totalViews} <span className="fs-6 text-muted fw-normal">lượt xem</span>
                                    </h3>
                                    <small className="text-muted mt-2">Dựa trên lượt xem của các "biến thể & giống" trong hệ thống</small>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>

                {/* CỘT PHẢI: Địa lý & Người dùng */}
                <Col lg={5}>
                    <h6 className="fw-bold text-info text-uppercase mb-3"><FaGlobeAsia className="me-2"/>Mở rộng & Nhân sự</h6>
                    <Row className="g-3 h-100">
                        <Col sm={12}>
                            <SecondaryStatCard 
                                title="Khu vực phân bố hiện có dữ liệu" 
                                count={`${stats.geo.distributions} điểm`} 
                                subtitle={`Trải rộng trên ${stats.geo.provinces} Tỉnh/Thành`}
                                icon={<FaGlobeAsia />} 
                                color="info" 
                            />
                        </Col>
                        <Col sm={12}>
                            <SecondaryStatCard 
                                title="Nhân sự Quản trị" 
                                count={`${stats.users.total} Tài khoản`} 
                                subtitle={`${stats.users.active} tài khoản đang hoạt động`}
                                icon={<FaUsers />} 
                                color="danger" 
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>

            <style>{`
                .fade-in { animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .stat-card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: default; }
                .stat-card-hover:hover { transform: translateY(-5px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
            `}</style>
        </div>
    );
};

export default Dashboard;