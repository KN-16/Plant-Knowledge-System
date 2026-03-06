import React, { useState } from 'react';
import useCrud from '../../hooks/useCrud';
import DataTableCustom from '../../components/common/DataTableCustom';
// Import VarietyModalForm từ thư mục bạn đã tạo ở bước trước
import VarietyModalForm from '../../components/modal/ModalForm/VarietyModalForm'; 
import ExcelImportModal from '../../components/modal/ExcelImportModal';
import { Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaImage } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { useEffect } from 'react';

const VarietyPage = () => {
    // Sử dụng hook useCrud trỏ vào endpoint /varieties
    const { 
        data, loading, totalRows, 
        handlePageChange, handlePerRowsChange, 
        setSearch, handleDelete, fetchData 
    } = useCrud(adminService.endpointFetchVarieties);

    const defaultThumbnail = '/default-plant.png'; // Đường dẫn đến ảnh mặc định trong thư mục public/
    const API_BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';
    const getImageUrl = (path) => {
    if (!path) return defaultThumbnail; // Đường dẫn đến file ảnh trong thư mục public/ của React/Vite
    
    // Nếu path lưu trong DB đã có sẵn http (ví dụ link ngoài), thì giữ nguyên
    if (path.startsWith('http')) return path; 
    
    // Ghép domain với path, loại bỏ dấu / thừa ở giữa
    return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    };
    const [modalShow, setModalShow] = useState(false);
    const [importShow, setImportShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [status, setStatus] = useState('add'); // 'add' | 'edit' | 'detail'
    const [uiOptions, setUiOptions] = useState({});
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
    // Định nghĩa các cột cho bảng
    const columns = [
    { 
        name: 'Ảnh', 
        selector: row => row.thumbnail,
        cell: row => (
            <div className="py-2">
                <img 
                    // Gọi hàm xử lý URL ở đây
                    src={getImageUrl(row.thumbnail)} 
                    alt="thumbnail" 
                    // Thêm thuộc tính onError để đề phòng ảnh bị lỗi (404) dù có link
                    onError={(e) => { 
                    console.warn(`Failed to load image at ${e.target.src}, using default thumbnail.`);
                    e.target.src = defaultThumbnail;}} 
                    style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #dee2e6', backgroundColor: '#f8f9fa' }} 
                />
            </div>
        ),
        width: '70px',
        center: true
    },
    { 
        name: 'Thông tin Định danh', 
        selector: row => (
            <div className="py-2">
                <div className="d-flex align-items-center gap-2 mb-1">
                    <Badge bg="secondary" style={{ fontSize: '0.7rem' }}>{row.code}</Badge>
                    <span className="fw-bold text-success" style={{ fontSize: '15px' }}>
                        {row.common_name}
                    </span>
                </div>
                <small className="text-dark fw-medium">{row.variety_name || 'Chưa cập nhật Tên Latin'}</small>
            </div>
        ), 
        sortable: true,
        grow: 2 
    },
    { 
        name: 'Chuỗi Phân loại (Taxonomy)', 
        selector: row => row.Species?.scientific_name, // Dùng để sort
        cell: row => {
            if (!row.Species) return <span className="text-muted fst-italic">---</span>;

            // Bóc tách dữ liệu cho gọn
            const species = row.Species;
            const genus = species.Genus;
            const family = genus?.Family;

            return (
                <div className="py-2 d-flex flex-column gap-1 w-100">
                    {/* Dòng 1: Họ (Family) và Chi (Genus) - Kích thước nhỏ, màu nhạt */}
                    <div className="text-secondary d-flex align-items-center flex-wrap" style={{ fontSize: '0.75rem', lineHeight: '1' }}>
                        <span title="Họ (Family)">
                            {family?.scientific_name || 'Họ: ---'}
                        </span>
                        <span className="mx-1 opacity-50">›</span>
                        <span title="Chi (Genus)">
                            {genus?.scientific_name || 'Chi: ---'}
                        </span>
                    </div>
                    
                    {/* Dòng 2: Loài (Species) - Nổi bật nhất */}
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
        grow: 1.8 // Cho cột này rộng hơn một chút vì chữ khá dài
    },
    { 
        name: 'Đặc tính', 
        cell: row => {
            const formMap = uiOptions['LIFE_FORM_BG'] || {};
            const mapped = formMap[row.life_form];
            return (
                <div className="d-flex flex-column gap-1 py-1">
                    <div>
                        {mapped ? <Badge bg={mapped.bg} className="border">{mapped.label}</Badge> : <span className="text-muted">---</span>}
                    </div>
                    <div className="d-flex gap-2">
                        {row.is_flowering && <Badge bg="danger" pill title="Có hoa">🌸</Badge>}
                        {row.is_fruiting && <Badge bg="warning" pill title="Có quả">🍎</Badge>}
                    </div>
                </div>
            );
        },
        width: '130px',
    },
    {
                            name: 'Xem chi tiết',
                            cell: row => (
                                <Button variant="outline-info" size="sm" className="rounded-circle" onClick={() => { setSelectedItem(row); setModalShow(true); setStatus('detail'); }}>
                                    <FaEye />
                                </Button>
                            ),
                            center: true,
                            width: '120px'
            },
    {
        name: 'Thao tác',
        cell: row => (
            <div className="d-flex gap-2">

                <Button variant="outline-primary" size="sm" className="rounded-circle" onClick={() => { setSelectedItem(row); setModalShow(true); setStatus('edit'); }}>
                                        <FaEdit />
                </Button>
                <Button variant="outline-danger" size="sm" className="rounded-circle" onClick={() => handleDelete(row.variety_id)}>
                    <FaTrash />
                </Button>
            </div>
        ),
        center: true,
        width: '150px'
    }
];
    return (
        <div className="container-fluid p-0 fade-in">
            {/* Component Bảng dữ liệu dùng chung */}
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
                onImport={() => setImportShow(true)}
            />

            {/* Modal Quản lý Thông tin & Ảnh (Có chia Tabs) */}
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

            {/* Modal Import Excel */}
            {importShow && (
                <ExcelImportModal 
                    show={importShow} 
                    onHide={() => setImportShow(false)}
                    onSuccess={() => { fetchData(); }} 
                    type="varieties"
                />
            )}
        </div>
    );
};

export default VarietyPage;