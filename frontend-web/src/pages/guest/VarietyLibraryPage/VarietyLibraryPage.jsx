// VarietyLibraryPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Pagination, Form , Spinner} from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaExchangeAlt, FaSortAmountDown } from 'react-icons/fa';
import { Helmet} from 'react-helmet-async';
import Swal from 'sweetalert2';
import publicService from '../../../services/publicService';
import './VarietyLibraryPage.css';

import LibraryFilterSidebar from '../../../components/common/LibraryFilterSidebar';
import VarietyGrid from '../../../components/common/VarietyGrid';
import CompareModal from '../../../components/modal/ModalForm/CompareModal';


const VarietyLibraryPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    const [initialLoading, setInitialLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [uiMapping, setUiMapping] = useState({ });

    const [SmartSelectOptions, setSmartSelectOptions] = useState({ });

    const [localGenusOptions, setLocalGenusOptions] = useState([]);
    const [localSpeciesOptions, setLocalSpeciesOptions] = useState([]);

    const [activeSections, setActiveSections] = useState({
        leaf: false,
        stem: false,
        flower: false,
        distribution: false
    });

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        sort: searchParams.get('sort') || 'image_count_desc',
        limit: searchParams.get('limit') || '12'
    });

    const [compareList, setCompareList] = useState([]);
    const [showCompareModal, setShowCompareModal] = useState(false);
    const [compareData, setCompareData] = useState([]);

    useEffect(() => { 
        const fetchSmartSelectOptions = async () => {
            try {
                const [familiesData, generaData, speciesData, provincesData] = await Promise.all([
                    publicService.fetchAllItems('families'),
                    publicService.fetchAllItems('genera'),
                    publicService.fetchAllItems('species'),
                    publicService.fetchProvinces()
                ]);
                const genusOptions = generaData.map(item => ({ value: item.genus_id, label: `${item.scientific_name} - ${item.vietnamese_name}`, family_id: item.Family.family_id }));
                const speciesOptions = speciesData.map(item => ({ value: item.species_id, label: `${item.scientific_name} - ${item.vietnamese_name}`, genus_id: item.Genus.genus_id, family_id: item.Genus.Family.family_id }));
                setSmartSelectOptions({
                    family: familiesData.map(item => ({ value: item.family_id, label: `${item.scientific_name} - ${item.vietnamese_name}` })),
                    genus: genusOptions,
                    species: speciesOptions,
                    provinces: provincesData.map(item => ({ value: item.province_id, label: `${item.province_name} - ${item.country}` }))
                });
                setLocalGenusOptions(genusOptions);
                setLocalSpeciesOptions(speciesOptions);
            } catch (error) {
                console.error('Error fetching smart select options:', error);
            }
        };

        const fetchInitialData = async () => {
            try {
                const mapping = await publicService.getUIEnumMapping();
                setUiMapping(mapping);
                await fetchSmartSelectOptions();
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };
        fetchInitialData();
    }, []);

    useEffect( () => { 
        fetchData();
        //scroll top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    
    }, [searchParams]);

    const fetchData = async () => {
        setIsFiltering(true);
        try {
            const params = Object.fromEntries([...searchParams]);
            const response = await publicService.getVarietiesList(params);
            setData(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setInitialLoading(false);
            setIsFiltering(false);
        }
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setFilters(prev => ({ ...prev, sort: newSort }));
        
        const activeFilters = { page: 1 };
        Object.keys(filters).forEach(key => { 
            if (filters[key] && key !== 'sort') activeFilters[key] = filters[key]; 
        });
        activeFilters.sort = newSort;
        setSearchParams(activeFilters);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        const activeFilters = { page: 1 , sort: filters.sort, limit: filters.limit };
    
        if (!activeSections.leaf) {
            delete filters.leaf_margin;
            delete filters.leaf_type;
            delete filters.leaf_shape;
            delete filters.leaf_arrangement;
            delete filters.leaf_length_min;
            delete filters.leaf_width_min;
            delete filters.petiole_length_min;
        }
        if (!activeSections.stem) {
            delete filters.stem_type;
            delete filters.stem_surface;
            delete filters.stem_height_min;
            delete filters.stem_color;
        }
        if (!activeSections.flower) {
            delete filters.inflorescence;
            delete filters.flower_color;
            delete filters.flower_petal_count
        }
        if (!activeSections.distribution) {
            delete filters.dist_province_option;
            delete filters.dist_status;
            delete filters.dist_description;
        }
        activeFilters.has_leaf_filter = activeSections.leaf;
        activeFilters.has_stem_filter = activeSections.stem;
        activeFilters.has_flower_filter = activeSections.flower;
        activeFilters.has_distribution_filter = activeSections.distribution;
        // Xử lý các filter SmartSelect đặc biệt: species_option, genus_option, family_option, dist_province_option
        if (filters.species_option) {
            activeFilters.species_id = filters.species_option.value;
            activeFilters.genus_id = filters.species_option.genus_id;
            activeFilters.family_id = filters.species_option.family_id;
        }
        if (filters.genus_option) {
            activeFilters.genus_id = filters.genus_option.value;
            activeFilters.family_id = filters.genus_option.family_id;
        }
        if (filters.family_option) {
            activeFilters.family_id = filters.family_option.value;
        }
        if (filters.dist_province_option) {
            activeFilters.dist_province_id = filters.dist_province_option.value;
        }

        Object.keys(filters).forEach(key => { if (filters[key]) activeFilters[key] = filters[key]; });
        setSearchParams(activeFilters);
    };

    const resetFilters = () => {
        setFilters({ search: '', sort: 'image_count_desc', limit: '12' , species_option: null, genus_option: null, family_option: null, dist_province_option: null });
        setLocalGenusOptions(SmartSelectOptions.genus || []);
        setLocalSpeciesOptions(SmartSelectOptions.species || []);
        setActiveSections({ leaf: false, stem: false, flower: false, distribution: false });
        setSearchParams({sort: 'image_count_desc', page: 1, limit: 12 });
    };

    const toggleCompare = (plant) => {
        setCompareList(prev => {
            const isExist = prev.find(item => item.variety_id === plant.variety_id);
            if (isExist) return prev.filter(item => item.variety_id !== plant.variety_id);
            // if (prev.length >= 3) 
            //     {
            //         Swal.fire({
            //         toast: true,
            //         position: 'top-end', // 👉 góc phải trên
            //         icon: 'warning',
            //         title: 'Giới hạn so sánh',
            //         text: 'Bạn chỉ có thể so sánh tối đa 3 giống cây trồng cùng lúc.',
            //         showConfirmButton: false,
            //         timer: 3000,
            //         timerProgressBar: true,

            //         customClass: {
            //             popup: 'colored-toast'
            //         }
            //         });
            //         return prev;
            //     };
            return [...prev, plant];
        });
    };

    const handleSortLimitChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        
        const activeFilters = { page: 1 };
        Object.keys(filters).forEach(key => { 
            if (filters[key] && key !== name) activeFilters[key] = filters[key]; 
        });
        activeFilters[name] = value;
        setSearchParams(activeFilters);
    };

    const openCompareModal = async () => {
        const ids = compareList.map(item => item.variety_id);
        const detailData = await publicService.getCompareData(ids);
        setCompareData(detailData);
        setShowCompareModal(true);
    };

    const handlePageChange = (newPage) => {
        const currentParams = new URLSearchParams(searchParams);
        // 2. Cập nhật tham số page
        currentParams.set('page', newPage);
        setSearchParams(currentParams);
        // (Tùy chọn) Cuộn mượt mà lên đầu trang lưới dữ liệu
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="library-wrapper bg-light min-vh-100 font-sans">
            <Helmet>
                <title>PlantDB | Thư viện thực vật</title>
                <meta name="description" content="Khám phá thư viện giống cây trồng đa dạng với hình ảnh chi tiết và thông tin phong phú. Tìm kiếm, so sánh và lựa chọn giống cây phù hợp cho nông nghiệp của bạn." />
            </Helmet>
            <Container fluid className="px-3 px-xl-5">
                <Row className="g-4 mt-1 flex-lg-nowrap">
                    <Col lg={isSidebarExpanded ? 4 : 3}>
                        <LibraryFilterSidebar 
                            filters={filters} 
                            onFilterChange={handleFilterChange} 
                            onApply={applyFilters} 
                            onReset={resetFilters}
                            onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
                            isExpanded={isSidebarExpanded}
                            uiMapping={uiMapping}
                            loading={initialLoading}
                            activeSections={activeSections}
                            setActiveSections={setActiveSections}
                            SmartSelectOptions={SmartSelectOptions}
                            localGenusOptions={localGenusOptions}
                            localSpeciesOptions={localSpeciesOptions}
                            setLocalGenusOptions={setLocalGenusOptions}
                            setLocalSpeciesOptions={setLocalSpeciesOptions}
                        />
                    </Col>

                    <Col lg={isSidebarExpanded ? 8 : 9} className="transition-all">
                        
                        {/* THANH ĐIỀU KHIỂN SẮP XẾP */}
                        <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-4 shadow-sm mb-4">
                            <span className="text-muted fw-medium d-none d-md-block">
                                Tìm thấy <strong className="text-success">{pagination.total || data.length}</strong> kết quả phù hợp
                            </span>
                            <div className="d-flex align-items-center w-auto">
                                <FaSortAmountDown className="text-success me-2 flex-shrink-0" />
                                <span className="text-muted small fw-bold me-2 d-none d-sm-block text-nowrap">Sắp xếp:</span>
                                <Form.Select 
                                    size="sm" 
                                    className="border-success border-opacity-25 rounded-pill shadow-none px-3 py-1 bg-light fw-medium"
                                    value={filters.sort}
                                    onChange={handleSortChange}
                                    style={{ width: '200px', cursor: 'pointer' }}
                                >
                                    <option value="createdAt_desc">Mới nhất - Cũ nhất</option>
                                    <option value="name_asc">Tên hiển thị (A - Z)</option>
                                    <option value="name_desc">Tên hiển thị (Z - A)</option>
                                    <option value="view_count_desc">Lượt xem (Cao - Thấp)</option>
                                    <option value="view_count_asc">Lượt xem (Thấp - Cao)</option>
                                    <option value="image_count_desc">Kho sưu tập hình ảnh (Lớn - Nhỏ)</option>
                                    <option value="image_count_asc">Kho sưu tập hình ảnh (Nhỏ - Lớn)</option>
                                </Form.Select>
                                <span className="text-muted small fw-bold ms-2 d-none d-sm-block">Hiển thị:</span>
                                <Form.Select 
                                    size="sm" 
                                    name="limit"
                                    className="ms-2 border-success border-opacity-25 rounded-pill shadow-none px-3 bg-light fw-medium"
                                    value={filters.limit}
                                    onChange={handleSortLimitChange}
                                    style={{ width: '80px', cursor: 'pointer' }}
                                >
                                    <option value="12">12</option>
                                    <option value="24">24</option>
                                    <option value="48">48</option>
                                </Form.Select>
                            </div>
                        </div>

                        {initialLoading ? (
                            <div className="d-flex justify-content-center py-5 mt-5"><Spinner animation="grow" variant="success" /></div>
                        ) : (
                            <div style={{ transition: 'opacity 0.3s ease', opacity: isFiltering ? 0.4 : 1 }}>
                                <VarietyGrid 
                                    data={data} 
                                    compareList={compareList} 
                                    onToggleCompare={toggleCompare} 
                                    onNavigate={(id) => navigate(`/varieties/${id}`)}
                                    backendUrl={backendUrl}
                                    isExpanded={isSidebarExpanded} 
                                />

                                {/* PHÂN TRANG */}
                                {pagination.totalPages > 1 && (
                                    <div className="d-flex justify-content-center mt-5 mb-5 pb-5">
                                        <Pagination className="shadow-sm">
                                            <Pagination.Prev disabled={pagination.page === 1} onClick={() => handlePageChange(pagination.page - 1)} />
                                            
                                            {/* Logic render số trang (Ví dụ: 1 2 3 ... 10) */}
                                            {[...Array(pagination.totalPages)].map((_, idx) => {
                                                const p = idx + 1;
                                                // Chỉ show 2 trang đầu, 2 trang cuối, và các trang gần trang hiện tại
                                                if (p === 1 || p === pagination.totalPages || (p >= pagination.page - 1 && p <= pagination.page + 1)) {
                                                    return (
                                                        <Pagination.Item key={p} active={p === pagination.page} onClick={() => handlePageChange(p)}>
                                                            {p}
                                                        </Pagination.Item>
                                                    );
                                                }
                                                // Hiển thị dấu ... nếu bị cách quãng
                                                if (p === pagination.page - 2 || p === pagination.page + 2) {
                                                    return <Pagination.Ellipsis key={p} disabled />;
                                                }
                                                return null;
                                            })}

                                            <Pagination.Next disabled={pagination.page === pagination.totalPages} onClick={() => handlePageChange(pagination.page + 1)} />
                                        </Pagination>
                                    </div>
                                )}
                            </div>
                        )}

                    </Col>
                </Row>
            </Container>

            {compareList.length > 0 && (
                <div className="position-fixed bottom-0 end-0 m-4 z-3 animation-slide-up">
                    <Button variant="success" size="lg" className="rounded-pill shadow-lg fw-bold px-4 py-3" onClick={openCompareModal}>
                        <FaExchangeAlt className="me-2" /> So Sánh ({compareList.length})
                    </Button>
                </div>
            )}

            <CompareModal 
                show={showCompareModal} 
                onHide={() => setShowCompareModal(false)} 
                compareData={compareData} 
                onRemoveItem={(item) => {
                    toggleCompare(item);
                    setCompareData(prev => prev.filter(p => p.variety_id !== item.variety_id));
                }}
                backendUrl={backendUrl}
                uiMapping={uiMapping}
            />
        </div>
    );
};

export default VarietyLibraryPage;