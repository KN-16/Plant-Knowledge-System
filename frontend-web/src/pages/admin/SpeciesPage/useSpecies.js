import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import Swal from 'sweetalert2';

const useSpecies = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch Data
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/species', {
                params: {
                    page: currentPage,
                    limit: perPage,
                    search: searchQuery
                }
            });
            setData(response.data.data);
            setTotalRows(response.data.pagination.total);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
            Swal.fire('Lỗi', 'Không thể tải danh sách loài', 'error');
        } finally {
            setLoading(false);
        }
    }, [currentPage, perPage, searchQuery]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchData();
        }, 500); // Debounce search
        return () => clearTimeout(delayDebounce);
    }, [fetchData]);

    // Xử lý Xóa
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Bạn chắc chắn?',
            text: "Dữ liệu sẽ bị xóa vĩnh viễn!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Xóa ngay'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/species/${id}`);
                Swal.fire('Đã xóa!', 'Dữ liệu đã được xóa.', 'success');
                fetchData(); // Reload
            } catch (error) {
                Swal.fire('Lỗi', 'Xóa thất bại', 'error');
            }
        }
    };

    // Xử lý Thay đổi trang
    const handlePageChange = page => setCurrentPage(page);
    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    return {
        data, loading, totalRows,
        handlePageChange, handlePerRowsChange,
        setSearchQuery,
        handleDelete,
        fetchData // Expose để gọi lại khi thêm/sửa xong
    };
};

export default useSpecies;