import React, { useState } from 'react';
import useCrud from '../../../hooks//useCrud';
import DataTableCustom from '../../../components/common/DataTableCustom';
import ModalForm from '../../../components/modal/ModalForm/speciesForm';
import ExcelImportModal from '../../../components/modal/ExcelImportModal';
import { Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import adminService from '../../../services/adminService';
import { set } from 'react-hook-form';

const SpeciesPage = () => {
    const { data, loading, totalRows, handlePageChange, handlePerRowsChange, setSearch, handleDelete, fetchData } = useCrud(adminService.endpointFetchSpecies);
    const [modalShow, setModalShow] = useState(false);
    const [importShow, setImportShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [status, setStatus] = useState('');

    const columns = [
        { name: 'Mã', selector: row => <Badge bg="secondary">{row.code}</Badge>, width: '100px' },
        { name: 'Tên Khoa học', selector: row => <i className="fw-bold text-success">{row.scientific_name}</i>, sortable: true },
        { name: 'Tên Tiếng Việt', selector: row => row.vietnamese_name },
        { name: 'Tên khác', selector: row => row.other_names || '---' },
        { name: 'Tác giả', selector: row => row.authority || '---' },
        { name: 'Thuộc chi', selector: row => row.Genus?.scientific_name || '---', sortable: true },
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