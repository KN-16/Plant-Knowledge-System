import React, { useState, useEffect } from 'react';
import useCrud from '../../../hooks//useCrud';
import DataTableCustom from '../../../components/common/DataTableCustom';
import ModalForm from '../../../components/modal/ModalForm/speciesForm';
import ExcelImportModal from '../../../components/modal/ExcelImportModal';
import { Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaProjectDiagram } from 'react-icons/fa';
import adminService from '../../../services/adminService';
import TaxonomyTreeModal from '../../../components/modal/TaxonomyTreeModal';
import Swal from 'sweetalert2';
import { Spinner } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const SpeciesPage = () => {
    const { data, loading, totalRows, handlePageChange, handlePerRowsChange, setSearch, handleDelete, fetchData } = useCrud(adminService.endpointFetchSpecies);
    const [modalShow, setModalShow] = useState(false);
    const [importShow, setImportShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [status, setStatus] = useState('');

    const [treeData, setTreeData] = useState([]);
    const [treeModalShow, setTreeModalShow] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
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
        { name: 'Mã', selector: row => <Badge bg="secondary">{row.code}</Badge>, width: '100px' },
        { name: 'Tên Khoa học', selector: row => <i className="fw-bold text-success">{row.scientific_name}</i>, sortable: true },
        { name: 'Tên Tiếng Việt', selector: row => row.vietnamese_name },
        { 
        name: 'Thuộc chi', 
        selector: row => row.Genus?.scientific_name, // Dùng để sort
        cell: row => {
            if (!row.Genus) return <span className="text-muted fst-italic">---</span>;
            return (
                <div className="py-2 d-flex flex-column gap-1 w-100">
                    <div style={{ lineHeight: '1.3' }}>
                        <span className="fw-bold text-dark fst-italic text-nowrap" style={{ fontSize: '0.9rem' }}>
                            {row.Genus.scientific_name}
                        </span>
                        <br/>
                        <small className="text-muted text-nowrap" style={{ fontSize: '0.8rem' }}>
                            {row.Genus.vietnamese_name}
                        </small>
                    </div>
                </div>
            );
        },
        sortable: true
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
                        const data= await adminService.fetchTaxonomyTree({ genus_id: row.genus_id });
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
                    <Button variant="outline-primary" size="sm" className="rounded-circle" onClick={() => { setSelectedItem(row); setModalShow(true); setStatus('edit'); }}><FaEdit /></Button>
                    <Button variant="outline-danger" size="sm" className="rounded-circle" onClick={() => handleDelete(row.species_id)}><FaTrash /></Button>
                </div>
            ),
            center: true,
            width: '180px'
        }
    ];

    return (
        <>
            <Helmet>
                <title>PlantDB | Quản lý Loài thực vật</title>
            </Helmet>
            <DataTableCustom 
                title="DANH SÁCH LOÀI"
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
                    key={selectedItem ? selectedItem.genus_id : 'add-new'} 
                    show={modalShow} onHide={() => setModalShow(false)}
                    status={status} 
                    initialData={selectedItem} onSuccess={() => { setModalShow(false); fetchData(); }}
                    type="species" title="Loài"
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
                    onSuccess={() => { fetchData(); }} type="species"
                />
            )}
        </>
    );
};

export default SpeciesPage;