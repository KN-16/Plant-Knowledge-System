import React, { useState, useEffect } from 'react';
import useCrud from '../../hooks/useCrud';
import DataTableCustom from '../../components/common/DataTableCustom';
import VarietyModalForm from '../../components/modal/ModalForm/VarietyModalForm'; 
import { Button, Badge, OverlayTrigger, Tooltip, Modal, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaProjectDiagram } from 'react-icons/fa';
import adminService from '../../services/adminService';
import TaxonomyTreeModal from '../../components/modal/TaxonomyTreeModal';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';

const VarietyPage = () => {
    const { 
        data, loading, totalRows, 
        handlePageChange, handlePerRowsChange, 
        setSearch, handleDelete, fetchData 
    } = useCrud(adminService.endpointFetchVarieties);

    const defaultThumbnail = '/default-plant.png';
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'; // Fix chữ VITE_ nếu dùng Vite
    
    const getImageUrl = (path) => {
        if (!path) return defaultThumbnail; 
        if (path.startsWith('http')) return path; 
        return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    };

    const [modalShow, setModalShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [status, setStatus] = useState('add'); 
    const [uiOptions, setUiOptions] = useState({});

    const [treeData, setTreeData] = useState([]);
    const [treeModalShow, setTreeModalShow] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [focusedVarietyId, setFocusedVarietyId] = useState(null);

    // Thêm State để quản lý việc phóng to ảnh ở Cột 1
    const [enlargedImg, setEnlargedImage] = useState(null);

    useEffect(() => {
        const fetchUIOptions = async () => {
            try {
                const mappings = await adminService.fetchUIOptions();
                setUiOptions(mappings);
            } catch (error) {
                console.error('Error fetching UI mappings:', error);
            }
        };
        fetchUIOptions();
    }, []);

    // ĐÃ TỐI ƯU LẠI WIDTH & GROW CHO CÁC CỘT
    const columns = [
        { 
            name: 'Ảnh', 
            selector: row => row.thumbnail,
            cell: row => (
                <div className="py-2">
                    <img 
                        src={getImageUrl(row.thumbnail)} 
                        alt="thumbnail" 
                        onClick={() => setEnlargedImage(getImageUrl(row.thumbnail))}
                        onError={(e) => { 
                            console.warn(`Failed to load image at ${e.target.src}`);
                            e.target.src = defaultThumbnail;
                        }} 
                        className="shadow-sm image-zoom-hover"
                        style={{ 
                            width: '45px', height: '45px', 
                            objectFit: 'cover', borderRadius: '6px', 
                            border: '1px solid #dee2e6', backgroundColor: '#f8f9fa',
                            cursor: 'zoom-in' // Thêm con trỏ kính lúp
                        }} 
                    />
                </div>
            ),
            width: '80px',
            center: true
        },
        { 
            name: 'Thông tin Định danh', 
            selector: row => row.common_name,
            cell: row => (
                <div className="py-2">
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <Badge bg="secondary" style={{ fontSize: '0.7rem' }}>{row.code}</Badge>
                        <span className="fw-bold text-success" style={{ fontSize: '15px' }}>
                            {row.common_name}
                        </span>
                    </div>
                    <small className="text-dark fw-medium fst-italic">{row.variety_name || 'Chưa cập nhật Tên Latin'}</small>
                </div>
            ), 
            sortable: true,
            grow: 2, // Cho phép cột này phình to gấp đôi cột khác
            minWidth: '220px' // Ép chiều rộng tối thiểu
        },
        { 
            name: 'Thuộc loài', 
            selector: row => row.Species?.scientific_name, 
            cell: row => {
                if (!row.Species) return <span className="text-muted fst-italic">---</span>;
                const species = row.Species;
                return (
                    <div className="py-2 d-flex flex-column gap-1">
                        <div style={{ lineHeight: '1.3' }}>
                            <span className="fw-bold text-dark fst-italic" style={{ fontSize: '0.9rem' }}>
                                {species.scientific_name}
                            </span>
                            <br/>
                            <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                                {species.vietnamese_name}
                            </small>
                        </div>
                    </div>
                );
            },
            sortable: true,
            minWidth: '180px'
        },
        {
            name: 'Cây phân loại',
            cell: row => (
                (isFetching) ? (
                    <Spinner animation="border" size="sm" variant="info" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                ) : (
                    <Button variant="outline-info" size="sm" className="rounded-circle" title="Xem cây phân loại" onClick={async () => {
                        setIsFetching(true);
                        try {
                            const data = await adminService.fetchTaxonomyTree({ variety_id: row.variety_id });
                            setTreeData(data);
                            setFocusedVarietyId(row.variety_id);
                            setTreeModalShow(true);
                        } catch (error) {
                            console.error('Error fetching taxonomy tree:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi',
                                text: 'Xem cây phân loại thất bại. Vui lòng thử lại sau.',
                            });
                        } finally {
                            setIsFetching(false);
                        }
                    }}>
                        <FaProjectDiagram />
                    </Button>
                )
            ),
            center: true,
            width: '160px' // Bóp nhỏ lại
        },
        { 
            name: 'Đặc tính', 
            cell: row => {
                const formMap = uiOptions['LIFE_FORM_BG'] || {};
                const mapped = formMap[row.life_form];
                return (
                    <div className="d-flex flex-column align-items-center gap-1 py-1">
                        <div>
                            {mapped ? <Badge bg={mapped.bg} className="border">{mapped.label}</Badge> : <span className="text-muted">---</span>}
                        </div>
                        <div className="d-flex gap-2 mt-1">
                            {row.is_flowering && <Badge bg="danger" pill title="Có hoa">🌸</Badge>}
                            {row.is_fruiting && <Badge bg="warning" pill title="Có quả">🍎</Badge>}
                        </div>
                    </div>
                );
            },
            center: true,
            width: '130px',
        },
        {
            name: 'Chi tiết',
            cell: row => (
                <Button variant="outline-success" size="sm" className="rounded-circle" title="Xem chi tiết" onClick={() => { setSelectedItem(row); setModalShow(true); setStatus('detail'); }}>
                    <FaEye />
                </Button>
            ),
            center: true,
            width: '90px' // Bóp nhỏ lại
        },
        {
            name: 'Thao tác',
            cell: row => (
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm" className="rounded-circle" title="Sửa" onClick={() => { setSelectedItem(row); setModalShow(true); setStatus('edit'); }}>
                        <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" className="rounded-circle" title="Xóa" onClick={() => handleDelete(row.variety_id)}>
                        <FaTrash />
                    </Button>
                </div>
            ),
            center: true,
            width: '110px' // Bóp nhỏ lại
        }
    ];

    return (
        <div className="container-fluid p-0 fade-in">
            <Helmet>
                <title>PlantDB | Quản lý Thứ & Giống</title>
            </Helmet>
            <DataTableCustom 
                title="DANH SÁCH THỨ & GIỐNG (VARIETIES)"
                columns={columns}
                data={data}
                loading={loading}
                totalRows={totalRows}
                handlePageChange={handlePageChange}
                handlePerRowsChange={handlePerRowsChange}
                onSearch={setSearch}
                onAdd={() => { 
                    setSelectedItem(null); 
                    setStatus('add');
                    setModalShow(true); 
                }}
                
            />

            {/* Modal Quản lý Thông tin & Ảnh */}
            {modalShow && (
                <VarietyModalForm 
                    key={selectedItem ? selectedItem.variety_id : 'add-new'}
                    show={modalShow} 
                    onHide={() => setModalShow(false)} 
                    initialData={selectedItem} 
                    status={status}
                    uiOptions={uiOptions}
                    onSuccess={() => { 
                        setModalShow(false); 
                        fetchData(); 
                    }}
                />
            )}

            {/* Modal Cây phân loại */}
            {treeModalShow && (
                <TaxonomyTreeModal 
                    show={treeModalShow} onHide={() => setTreeModalShow(false)}
                    treeData={treeData}
                    backendUrl={API_BASE_URL}
                    uiMapping={uiOptions}
                    focusedLevel="variety"         // Truyền level
                    focusedId={focusedVarietyId}
                />
            )}

            {/* Modal Phóng to ảnh Avatar */}
            <Modal show={!!enlargedImg} onHide={() => setEnlargedImage(null)} centered size="md">
                <Modal.Header closeButton className="border-0 pb-0 bg-dark" variant="dark"></Modal.Header>
                <Modal.Body className="text-center p-0 bg-dark rounded-bottom">
                    <img 
                        src={enlargedImg} 
                        alt="Enlarged" 
                        className="img-fluid rounded-bottom" 
                        style={{ maxHeight: '80vh', objectFit: 'contain', width: '100%' }} 
                    />
                </Modal.Body>
            </Modal>

            {/* CSS Tối ưu hiệu ứng hover ảnh */}
            <style>{`
                .image-zoom-hover { transition: transform 0.2s ease-in-out; }
                .image-zoom-hover:hover { transform: scale(1.15); box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important; }
            `}</style>
        </div>
    );
};

export default VarietyPage;