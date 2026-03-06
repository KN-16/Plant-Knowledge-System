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
            title: 'Bạn chắc chắn?',
            text: "Dữ liệu sẽ bị xóa vĩnh viễn!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa ngay',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`${endpoint}/${id}`);
                Swal.fire('Đã xóa!', '', 'success');
                fetchData();
            } catch (error) {
                Swal.fire('Lỗi', 'Xóa thất bại', 'error');
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