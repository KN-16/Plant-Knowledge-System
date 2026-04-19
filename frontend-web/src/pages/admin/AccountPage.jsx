import React, { useState } from 'react';
import useCrud from '../../hooks/useCrud';
import DataTableCustom from '../../components/common/DataTableCustom';
import AccountModalForm from '../../components/modal/ModalForm/AccountModalForm';
import { Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaKey, FaLock, FaUnlock, FaEye, FaUser } from 'react-icons/fa';
import Swal from 'sweetalert2';
import adminService from '../../services/adminService';
import { useAuthContext } from '../../context/useAuthContext';
import { Helmet } from 'react-helmet-async';


const AccountPage = () => {
    // Tái sử dụng hook useCrud với endpoint của accounts
    const { data, loading, totalRows, handlePageChange, handlePerRowsChange, setSearch, handleDelete, fetchData } = useCrud('/admin/accounts');

    const { user } = useAuthContext();

    const [modalShow, setModalShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [status, setStatus] = useState('add'); // 'add', 'edit', 'password'

    const handleToggleLock = async (row) => {
        const isLocked = row.status === 'locked';
        const newStatus = isLocked ? 'active' : 'locked';
        const textConfirm = isLocked ? 'Bạn muốn mở khóa tài khoản này?' : 'Bạn muốn khóa tài khoản này?';

        const result = await Swal.fire({
            title: 'Xác nhận',
            text: textConfirm,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await adminService.toggleStatus(row.account_id, { status: newStatus });
                Swal.fire('Thành công', 'Cập nhật trạng thái thành công', 'success');
                fetchData();
            } catch (error) {
                Swal.fire('Lỗi', 'Không thể cập nhật trạng thái', 'error');
            }
        }
    };

    const columns = [
        {
            name: 'Mã & Tên Đăng Nhập',
            selector: row => row.username,
            cell: row => {
                const isCurrentUser = row.account_id === user.account_id;
                return (
                    <div className="py-2">
                        <div className="d-flex align-items-center gap-2 mb-1">
                            {isCurrentUser && <Badge bg="success" className="d-flex align-items-center gap-1">
                                <FaUser size={12} /> Bạn
                            </Badge>}

                            <Badge bg="secondary">{row.code}</Badge>
                            {/* Đánh dấu người dùng hiện tại */}

                        </div>
                        <div className={`fw-bold ${isCurrentUser ? 'text-success' : 'text-primary'}`}>
                            {row.username}
                        </div>
                    </div>
                );
            },
            sortable: true,
            width: '240px'
        },
        {
            name: 'Thông tin cá nhân',
            selector: row => row.full_name,
            cell: row => (
                <div className="py-2">
                    <div className="fw-bold">{row.full_name || '---'}</div>
                    <div className="text-muted small">{row.email}</div>
                    <div className="text-muted small">{row.phone_number || '---'}</div>
                </div>
            ),
            sortable: true,
            width: '240px'
        },
        {
            name: 'Quyền hạn',
            selector: row => row.role,
            cell: row => (
                <Badge bg={row.role === 'admin' ? 'danger' : 'info'} className=" px-2 py-1">
                    {row.role === 'admin' ? 'Quản trị viên hệ thống' : 'Quản lý dữ liệu'}
                </Badge>
            ),
            center: true,
            sortable: true
        },
        {
            name: 'Trạng thái',
            selector: row => row.status,
            cell: row => {
                const bgMap = { active: 'success', inactive: 'secondary', locked: 'dark' };
                return <Badge bg={bgMap[row.status]}>{row.status === 'locked' ? 'Bị khóa' : 'Hoạt động'}</Badge>;
            },
            center: true,
            sortable: true
        },
        {
            name: 'Chi tiết',
            cell: row => (
                <Button variant="outline-success" size="sm" className="rounded-circle" title="Xem chi tiết" onClick={() => { setSelectedItem(row); setModalShow(true); setStatus('detail'); }}>
                    <FaEye />
                </Button>
            ),
            center: true,
        },
        {
            name: 'Thao tác',
            cell: row => {
                const isCurrentUser = row.account_id === user.account_id;
                return (

                    <div className="d-flex gap-2">
                        <Button variant="outline-warning" size="sm" className="rounded-circle" title="Đổi mật khẩu"
                            onClick={() => { setSelectedItem(row); setStatus('password'); setModalShow(true); }}
                            disabled={isCurrentUser}>
                            <FaKey />
                        </Button>

                        <Button variant={row.status === 'locked' ? 'outline-success' : 'outline-dark'} size="sm" className="rounded-circle"
                            title={row.status === 'locked' ? 'Mở khóa' : 'Khóa tài khoản'}
                            onClick={() => handleToggleLock(row)}
                            disabled={isCurrentUser}>
                            {row.status === 'locked' ? <FaUnlock /> : <FaLock />}
                        </Button>

                        <Button variant="outline-primary" size="sm" className="rounded-circle" title="Sửa thông tin"
                            onClick={() => { setSelectedItem(row); setStatus('edit'); setModalShow(true); }}
                            disabled={isCurrentUser}>
                            <FaEdit />
                        </Button>
                        <Button variant="outline-danger" size="sm" className="rounded-circle" title="Xóa tài khoản"
                            onClick={() => handleDelete(row.account_id)}
                            disabled={isCurrentUser}>
                            <FaTrash />
                        </Button>
                    </div>
                )
            },
            center: true,
            width: '200px'
        }
    ];

    return (
        <div className="container-fluid p-0 fade-in">
            <Helmet>
                <title>PlantDB | Quản lý Tài Khoản</title>
            </Helmet>
            <DataTableCustom
                title="QUẢN LÝ TÀI KHOẢN (ACCOUNTS)"
                columns={columns}
                data={data}
                loading={loading}
                totalRows={totalRows}
                handlePageChange={handlePageChange}
                handlePerRowsChange={handlePerRowsChange}
                onSearch={setSearch}
                onAdd={() => { setSelectedItem(null); setStatus('add'); setModalShow(true); }}
                placeholderSearch="Tìm theo Username, Email, Tên..."
            />

            {modalShow && (
                <AccountModalForm
                    key={selectedItem ? selectedItem.account_id : 'add-new'}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    initialData={selectedItem}
                    status={status}
                    onSuccess={() => { setModalShow(false); fetchData(); }}
                />
            )}
        </div>
    );
};

export default AccountPage;