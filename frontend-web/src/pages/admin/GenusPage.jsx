import React, { useState } from 'react';
import useCrud from '../../hooks/useCrud';
import DataTableCustom from '../../components/common/DataTableCustom';
import ModalForm from '../../components/modal/ModalForm/genusForm';
import ExcelImportModal from '../../components/modal/ExcelImportModal';
import { Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import adminService from '../../services/adminService';

const GenusPage = () => {
    const { data, loading, totalRows, handlePageChange, handlePerRowsChange, setSearch, handleDelete, fetchData } = useCrud(adminService.endpointFetchGenus);
    
    const [modalShow, setModalShow] = useState(false);
    const [importShow, setImportShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [status, setStatus] = useState(''); // 'add' hoặc 'edit' or detail
    const [familyList, setFamilyList] = useState([]);
    const [smartSelectFamily, setSmartSelectFamily] = useState({});

    // const onAddNewGenus = async () => {

    // setSelectedItem(null);
    // setModalShow(true);
    // setStatus("add");

    // const family_data = await adminService.fetchAllItems('families');
    // setFamilyList(family_data);

    // const options = family_data.map(fam => ({
    //     value: fam.family_id,
    //     label: `${fam.code} - ${fam.scientific_name}`
    // }));

    // setSmartSelectFamily({
    //     options,
    //     label: "Họ thực vật",
    //     value: "",
    //     selected: null,
    //     onChange: (option) => {

    //     // Chọn thêm mới
    //     if (option?.value === "new") {
    //         setSmartSelectFamily(prev => ({
    //         ...prev,
    //         value: option,
    //         selected: { scientific_name: "", vietnamese_name: "" }
    //         }));
    //         return;
    //     }

    //     // Chọn family thường
    //     const found = family_data.find(
    //         f => f.family_id === option.value
    //     );
    //     console.log('found family: ', found);
    //     setSmartSelectFamily(prev => ({
    //         ...prev,
    //         value: option,
    //         selected: found
    //     }));
    //     }
    // });
    // };
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
                name: 'Thuộc Họ',
                selector: row => row.Family?.scientific_name || '---',
                sortable: true,
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
                title="DANH SÁCH CHI THỰC VẬT"
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
                    type="genera" title="Chi Thực Vật"
                />
            )}

            {importShow && (
                <ExcelImportModal 
                    show={importShow} onHide={() => setImportShow(false)}
                    onSuccess={() => { fetchData(); }} type="genera"
                />
            )}
        </>
    );
};

export default GenusPage;