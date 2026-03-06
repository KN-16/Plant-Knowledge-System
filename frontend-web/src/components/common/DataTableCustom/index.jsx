import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaPlus, FaFileExcel, FaSearch } from 'react-icons/fa';
import Loading from '../Loading';

const DataTableCustom = ({ 
    title, columns, data, loading, totalRows, 
    handlePerRowsChange, handlePageChange, 
    onAdd, onImport, onSearch, isExcelable= false
}) => {
    const [searchText, setSearchText] = useState('');

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        if (onSearch) onSearch(e.target.value);
    };

    // Style giống Vue Good Table (Ảnh 1, 2)
    const customStyles = {
        table: {
            style: {
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
            },
        },
        headRow: {
            style: {
                backgroundColor: '#f8f9fa', // Màu nền header xám nhạt
                borderBottom: '2px solid #dee2e6',
                minHeight: '50px',
            },
        },
        headCells: {
            style: {
                fontSize: '14px',
                fontWeight: '700',
                color: '#495057',
                paddingLeft: '16px',
                paddingRight: '16px',
            },
        },
        rows: {
            style: {
                fontSize: '14px',
                color: '#212529',
                minHeight: '55px',
                '&:not(:last-of-type)': {
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                    borderBottomColor: '#e0e0e0',
                },
                '&:hover': {
                    backgroundColor: '#f1f3f5', // Hover màu nhẹ
                    cursor: 'default',
                    transition: 'all 0.2s',
                },
            },
        },
        pagination: {
            style: {
                borderTop: '1px solid #e0e0e0',
            },
        },
    };

    return (
        <div className="bg-white p-4 rounded-3 shadow-sm">
            {/* Header Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-bold text-dark border-start border-4 border-primary ps-3">
                    {title}
                </h5>
                
                <div className="d-flex gap-2">
                    <InputGroup style={{ width: '300px' }}>
                        <Form.Control 
                            placeholder="Tìm kiếm theo mã, tên khoa học, tên tiếng Việt..." 
                            className="bg-light"
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                        <Button variant="outline-secondary" className="bg-light border-start-0 text-muted">
                            <FaSearch />
                        </Button>
                    </InputGroup>
                    
                    {isExcelable && onImport && (
                        <Button variant="outline-success" onClick={onImport} title="Nhập Excel">
                            <FaFileExcel /> <span className="d-none d-md-inline">Excel</span>
                        </Button>
                    )}
                    
                    {onAdd && (
                        <Button variant="primary" onClick={onAdd} className="fw-bold">
                            <FaPlus className="me-1" /> Thêm mới
                        </Button>
                    )}
                </div>
            </div>
            
            <DataTable
                columns={columns}
                data={data}
                progressPending={loading}
                progressComponent={<div className="py-5"><Loading /></div>}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                customStyles={customStyles}
                persistTableHead
                highlightOnHover
                fixedHeader
                noDataComponent={<div className="p-5 text-muted bg-light w-100 text-center">Không tìm thấy dữ liệu nào.</div>}
            />
        </div>
    );
};

export default DataTableCustom;