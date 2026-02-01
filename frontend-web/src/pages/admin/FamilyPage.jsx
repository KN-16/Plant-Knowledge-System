import React, { useState } from 'react';
import useCrud from '../../hooks/useCrud';
import DataTableCustom from '../../components/common/DataTableCustom';
import ModalForm from '../../components/modal/ModalForm/familyForm';
import ExcelImportModal from '../../components/modal/ExcelImportModal';
import { Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import adminService from '../../services/adminService';

const FamilyPage = () => {
    // Gọi hook useCrud trỏ vào endpoint /families
    const { data, loading, totalRows, handlePageChange, handlePerRowsChange, setSearch, handleDelete, fetchData } = useCrud(adminService.endpointFetchFamily);
    
    const [modalShow, setModalShow] = useState(false);
    const [importShow, setImportShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [status, setStatus] = useState(''); // 'add' hoặc 'edit' or detail
//     family_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     code: { type: DataTypes.STRING, unique: true }, // VD: FAM-00001
//     scientific_name: { type: DataTypes.STRING, allowNull: false },
//     vietnamese_name: { type: DataTypes.STRING},
//     description: { type: DataTypes.TEXT },
//     authority: { type: DataTypes.STRING }
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
            name: 'Tác giả',
            selector: row => row.authority || '---',
            width: '200px',
            sortable: true,
        },
        {
            name: 'Mô tả',
            selector: row => row.description || '---',
            wrap: true,
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

            {importShow && (
                <ExcelImportModal 
                    show={importShow} onHide={() => setImportShow(false)}
                    onSuccess={() => { fetchData(); }} type="families"
                />
            )}
        </>
    );
};

export default FamilyPage;