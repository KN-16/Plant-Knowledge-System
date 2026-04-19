import React, { useEffect, useState } from 'react';
import useCrud from '../../hooks/useCrud';
import DataTableCustom from '../../components/common/DataTableCustom';
import ModalForm from '../../components/modal/ModalForm/familyForm';
import ExcelImportModal from '../../components/modal/ExcelImportModal';
import { Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaProjectDiagram } from 'react-icons/fa';
import adminService from '../../services/adminService';
import TaxonomyTreeModal from '../../components/modal/TaxonomyTreeModal';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';
import { Spinner } from 'react-bootstrap';

const FamilyPage = () => {
    // Gọi hook useCrud trỏ vào endpoint /families
    const { data, loading, totalRows, handlePageChange, handlePerRowsChange, setSearch, handleDelete, fetchData } = useCrud(adminService.endpointFetchFamily);
    
    const [modalShow, setModalShow] = useState(false);
    const [importShow, setImportShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [status, setStatus] = useState(''); // 'add' hoặc 'edit' or detail

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const [treeData, setTreeData] = useState([]);
    const [treeModalShow, setTreeModalShow] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [uiMapping, setUiMapping] = useState({});
    
    useEffect(() => {
        const fetchUIOptions = async () => {
            try {
                const mappings = await adminService.fetchUIOptions();
                setUiMapping(mappings);
            } catch (error) {
                console.error('Error fetching UI mappings:', error);
            }
        };
        fetchUIOptions();
    }, []);
    
    const columns = [
        {
            name: 'Mã',
            selector: row => row.code,
            cell: row => <Badge bg="secondary">{row.code}</Badge>,
            width: '100px',
            sortable: true,
        },
        {
            name: 'Tên Khoa học',
            selector: row => row.scientific_name,
            cell: row => (
            <span className="fw-bold text-primary">
                {row.scientific_name}
            </span>
            ),
            sortable: true,
        },
        {
            name: 'Tên Tiếng Việt',
            selector: row => row.vietnamese_name || '---',
            sortable: true,
        },
        {
            name: 'Xem cây phân loại',
            cell: row => (
                (isFetching) ? (
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                ):(
                <Button variant="outline-info" size="sm" className="rounded-circle" onClick={async () => {
                    setIsFetching(true);
                    try {
                        const data= await adminService.fetchTaxonomyTree({ family_id: row.family_id });
                        setTreeData(data);
                        console.log(data);
                        setIsFetching(false);
                        setTreeModalShow(true);
                    } catch (error) {
                        console.error('Error fetching taxonomy tree:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi',
                            text: 'Xem cây phân loại thất bại. Vui lòng thử lại sau.',
                        });
                        setIsFetching(false);
                    } 
                    setIsFetching(false);
                }}
                >
                <FaProjectDiagram />
                </Button>
            )),
            center: true,
            width: '200px'
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
                    <Button variant="outline-danger" size="sm" className="rounded-circle" onClick={() => handleDelete(row.family_id)}>
                        <FaTrash />
                    </Button>
                </div>
            ),
            center: true,
            width: '150px'
        }
    ];

    return (
        <>
            <Helmet>
                <title>PlantDB | Quản lý Họ Thực Vật</title>
            </Helmet>
            <DataTableCustom 
                title="DANH SÁCH HỌ THỰC VẬT"
                columns={columns}
                data={data}
                loading={loading}
                totalRows={totalRows}
                handlePageChange={handlePageChange} 
                handlePerRowsChange={handlePerRowsChange}
                onSearch={setSearch}
                onAdd={() => { setSelectedItem(null); setModalShow(true); setStatus('add'); }}
                onImport={() => setImportShow(true)}
            />

            {modalShow && (
                <ModalForm 
                    key={selectedItem ? selectedItem.family_id : 'add-new'}
                    show={modalShow} onHide={() => setModalShow(false)} 
                    initialData={selectedItem}
                    status={status}
                    onSuccess={() => { setModalShow(false); fetchData(); }}
                    type="families" title="Họ Thực Vật"
                />
            )}
            {
                treeModalShow && (
                    <TaxonomyTreeModal 
                        show={treeModalShow} onHide={() => setTreeModalShow(false)}
                        treeData={treeData}
                        backendUrl={backendUrl}
                        uiMapping={uiMapping}
                    />
                )
            }
            {importShow && (
                <ExcelImportModal 
                    show={importShow} onHide={() => setImportShow(false)}
                    onSuccess={() => { fetchData(); }} 
                />
            )}
        </>
    );
};

export default FamilyPage;