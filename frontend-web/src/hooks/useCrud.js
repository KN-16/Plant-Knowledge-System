import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const useCrud = (endpoint) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(endpoint, { params: { page, limit: perPage, search } });
            setData(res.data.data);
            setTotalRows(res.data.pagination.total);
        } catch (error) {
            console.error(error);
            Swal.fire('Lỗi', 'Không thể tải dữ liệu', 'error');
        } finally {
            setLoading(false);
        }
    }, [endpoint, page, perPage, search]);

    useEffect(() => {
        const timer = setTimeout(() => fetchData(), 500);
        return () => clearTimeout(timer);
    }, [fetchData]);

    const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'Bạn chắc chắn muốn xóa?',
        text: "Dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545', // Màu đỏ cho nút xóa
        cancelButtonColor: '#6c757d', // Màu xám cho nút hủy
        confirmButtonText: 'Xóa ngay',
        cancelButtonText: 'Hủy bỏ'
    });

    if (result.isConfirmed) {
        try {
            const response = await api.delete(`${endpoint}/${id}`);
            // Đọc message thành công từ backend (nếu có)
            Swal.fire('Đã xóa!', response.data.message || 'Xóa thành công', 'success');
            fetchData();
        } catch (error) {
            // Lấy thông báo lỗi cụ thể từ Backend (ví dụ: "Không thể xóa vì đang chứa Chi...")
            // Nếu không có response data, fallback về câu báo lỗi mặc định
            const errorMessage = `${error.response?.data?.message || 'Xóa thất bại do lỗi hệ thống.'} Xem cây phân loại để biết chi tiết dữ liệu cấp dưới.`;
            Swal.fire({
                title: 'Không thể xóa!',
                text: errorMessage,
                icon: 'error',
                confirmButtonColor: '#198754' // Trả màu nút OK về màu xanh cho dịu
            });
        }
    }
};
    const handleSearch = (value) => {
        setSearch(value);
        setPage(1); // Luôn về trang 1 khi tìm kiếm mới
    };

    return {
        data, loading, totalRows,
        handlePageChange: page => setPage(page),
        handlePerRowsChange: (newPerPage, page) => { setPerPage(newPerPage); setPage(page); },
        setSearch: handleSearch,
        handleDelete,
        fetchData
    };
};

export default useCrud;