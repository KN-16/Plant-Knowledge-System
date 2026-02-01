// import React, { useState } from 'react';
// import useSpecies from './useSpecies';
// import DataTableCustom from '../../../components/DataTableCustom';
// import ModalForm from '../../../components/ModalForm/ModalForm'; // Bạn tự tạo component này
// import ExcelImportModal from '../../../components/ExcelImportModal/ExcelImportModal';
// import { Button, Badge } from 'react-bootstrap';
// import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

// const SpeciesPage = () => {
//     const { 
//         data, loading, totalRows, 
//         handlePageChange, handlePerRowsChange, setSearchQuery, handleDelete, fetchData 
//     } = useSpecies();

//     const [showModal, setShowModal] = useState(false);
//     const [selectedItem, setSelectedItem] = useState(null); // null = Add, object = Edit
//     const [showImport, setShowImport] = useState(false);

//     // Cấu hình cột cho bảng
//     const columns = [
//         { name: 'Mã', selector: row => <Badge bg="secondary">{row.code}</Badge>, width: '120px' },
//         { name: 'Tên Khoa học', selector: row => <i className="fw-bold">{row.scientific_name}</i>, sortable: true },
//         { name: 'Tên Tiếng Việt', selector: row => row.vietnamese_name },
//         { name: 'Chi', selector: row => row.Genus?.scientific_name || '---' },
//         {
//             name: 'Thao tác',
//             cell: row => (
//                 <div className="d-flex gap-2">
//                     <Button variant="outline-info" size="sm" className="rounded-circle" title="Xem chi tiết">
//                         <FaEye />
//                     </Button>
//                     <Button 
//                         variant="outline-primary" size="sm" className="rounded-circle"
//                         onClick={() => { setSelectedItem(row); setShowModal(true); }}
//                     >
//                         <FaEdit />
//                     </Button>
//                     <Button 
//                         variant="outline-danger" size="sm" className="rounded-circle"
//                         onClick={() => handleDelete(row.species_id)}
//                     >
//                         <FaTrash />
//                     </Button>
//                 </div>
//             ),
//             width: '180px',
//             center: true
//         }
//     ];

//     return (
//         <div className="container-fluid p-4">
//             <h3 className="mb-4 text-primary fw-bold border-start border-4 border-primary ps-3">
//                 Quản lý Loài Thực Vật
//             </h3>

//             <DataTableCustom 
//                 title="Danh sách Loài"
//                 columns={columns}
//                 data={data}
//                 loading={loading}
//                 totalRows={totalRows}
//                 handlePageChange={handlePageChange}
//                 handlePerRowsChange={handlePerRowsChange}
//                 onSearch={setSearchQuery}
//                 onAdd={() => { setSelectedItem(null); setShowModal(true); }}
//                 onImport={() => setShowImport(true)}
//             />

//             {/* Modal Thêm/Sửa */}
//             {showModal && (
//                 <ModalForm 
//                     show={showModal}
//                     onHide={() => setShowModal(false)}
//                     initialData={selectedItem}
//                     onSuccess={() => { setShowModal(false); fetchData(); }}
//                     type="species" // Props để modal biết load field gì
//                 />
//             )}

//             {/* Modal Import Excel */}
//             {showImport && (
//                 <ExcelImportModal 
//                     show={showImport}
//                     onHide={() => setShowImport(false)}
//                     onSuccess={() => { setShowImport(false); fetchData(); }}
//                     type="species"
//                     templateUrl="/uploads/format-excel-data/species_template.xlsx"
//                 />
//             )}
//         </div>
//     );
// };

// export default SpeciesPage;



import React, { useState } from 'react';
import useCrud from '../../hooks/useCrud';
import DataTableCustom from '../../components/common/DataTableCustom';
import ModalForm from '../../components/modal/ModalForm';
import ExcelImportModal from '../../components/modal/ExcelImportModal';
import { Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const SpeciesPage = () => {
    const { data, loading, totalRows, handlePageChange, handlePerRowsChange, setSearch, handleDelete, fetchData } = useCrud('/species');
    const [modalShow, setModalShow] = useState(false);
    const [importShow, setImportShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const columns = [
        { name: 'Mã', selector: row => <Badge bg="secondary">{row.code}</Badge>, width: '100px' },
        { name: 'Tên Khoa học', selector: row => <i className="fw-bold text-success">{row.scientific_name}</i>, sortable: true },
        { name: 'Tên Tiếng Việt', selector: row => row.vietnamese_name },
        { name: 'Chi', selector: row => row.Genus?.scientific_name || '---', sortable: true },
        {
            name: 'Thao tác',
            cell: row => (
                <div className="d-flex gap-2">
                    <Button variant="outline-info" size="sm" className="rounded-circle"><FaEye /></Button>
                    <Button variant="outline-primary" size="sm" className="rounded-circle" onClick={() => { setSelectedItem(row); setModalShow(true); }}><FaEdit /></Button>
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
                onAdd={() => { setSelectedItem(null); setModalShow(true); }}
                onImport={() => setImportShow(true)}
            />

            {modalShow && (
                <ModalForm 
                    show={modalShow} onHide={() => setModalShow(false)} 
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