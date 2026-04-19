import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { FaProjectDiagram, FaSearch, FaRedo, FaExclamationTriangle } from 'react-icons/fa';
import publicService from '../../services/publicService'; 
import SmartSelect from '../../components/common/SmartSelect';
import TaxonomyTreeView from '../../components/common/TaxonomyTreeView';
import { Helmet } from 'react-helmet-async';

const TaxonomyExplorerPage = () => {
    // Lưu trữ Master Data cho Select
    const [SmartSelectOptions, setSmartSelectOptions] = useState({});
    
    // Tùy chọn cục bộ thay đổi dựa theo quan hệ cha con
    const [localGenusOptions, setLocalGenusOptions] = useState([]);
    const [localSpeciesOptions, setLocalSpeciesOptions] = useState([]);
    
    // State lưu giá trị đang chọn
    const [selectedFilters, setSelectedFilters] = useState({
        family_option: null,
        genus_option: null,
        species_option: null
    });
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const [treeData, setTreeData] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [focusedNode, setFocusedNode] = useState({ level: null, id: null });
    const [uiMapping, setUIMapping] = useState({});

    // Lấy dữ liệu cơ sở cho SmartSelect khi mới vào trang
    useEffect(() => {
        const fetchSelectOptions = async () => {
            try {

                const uiMappingData = await publicService.getUIEnumMapping();
                setUIMapping(uiMappingData);


                const [familiesData, generaData, speciesData] = await Promise.all([
                    publicService.fetchAllItems('families'),
                    publicService.fetchAllItems('genera'),
                    publicService.fetchAllItems('species')
                ]);
                
                const familyOpts = familiesData.map(item => ({ value: item.family_id, label: `${item.scientific_name} - ${item.vietnamese_name}` }));
                const genusOpts = generaData.map(item => ({ value: item.genus_id, label: `${item.scientific_name} - ${item.vietnamese_name}`, family_id: item.Family.family_id }));
                const speciesOpts = speciesData.map(item => ({ value: item.species_id, label: `${item.scientific_name} - ${item.vietnamese_name}`, genus_id: item.Genus.genus_id, family_id: item.Genus.Family.family_id }));
                
                setSmartSelectOptions({ family: familyOpts, genus: genusOpts, species: speciesOpts });
                setLocalGenusOptions(genusOpts);
                setLocalSpeciesOptions(speciesOpts);
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };
        fetchSelectOptions();
    }, []);

    const handleReset = () => {
        setSelectedFilters({ family_option: null, genus_option: null, species_option: null });
        setLocalGenusOptions(SmartSelectOptions.genus || []);
        setLocalSpeciesOptions(SmartSelectOptions.species || []);
        setTreeData(null); // Xóa sơ đồ cũ
        setFocusedNode({ level: null, id: null });
    };
    
    const handleExtractTree = async () => {
        // --- LOGIC BẢO VỆ SERVER: BẮT BUỘC CHỌN TỐI THIỂU LÀ "HỌ" ---
        // if (!selectedFilters.family_option) {
        //     alert("Vui lòng chọn tối thiểu một Họ thực vật (Family) để tránh quá tải hệ thống!");
        //     return;
        // }

        setIsFetching(true);
        try {
            const params = {};
            // Ghi nhớ Node sâu nhất được chọn để Highlight
            if (selectedFilters.species_option) {
                params.species_id = selectedFilters.species_option.value;
                setFocusedNode({ level: 'species', id: selectedFilters.species_option.value });
            } else if (selectedFilters.genus_option) {
                params.genus_id = selectedFilters.genus_option.value;
                setFocusedNode({ level: 'genus', id: selectedFilters.genus_option.value });
            } else if (selectedFilters.family_option) {
                // Rơi vào đây tức là đã có family_option
                params.family_id = selectedFilters.family_option.value;
                setFocusedNode({ level: 'family', id: selectedFilters.family_option.value });
            }

            const response = await publicService.getTaxonomyTree(params);
            setTreeData(response.data);
        } catch (error) {
            console.error("Lỗi khi trích xuất sơ đồ:", error);
            alert("Có lỗi xảy ra khi lấy dữ liệu sơ đồ.");
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5 font-sans">
            <Helmet>
                <title>PlantDB | Sơ đồ phân loại</title>
                <meta name="description" content="Khoanh vùng dữ liệu theo từng Họ, Chi hoặc Loài để trích xuất Sơ đồ quan hệ hình thái cây trồng trực quan, tránh quá tải khi tải dữ liệu lớn." />
            </Helmet>
            <Container>
                {/* Header Trang */}
                <div className="text-center mb-5">
                    <h2 className="fw-bolder text-success d-flex align-items-center justify-content-center">
                        <FaProjectDiagram className="me-3"/> Hệ Thống Tra Cứu Phân Loại Học
                    </h2>
                    <p className="text-muted mx-auto" style={{maxWidth: '700px'}}>
                        Khoanh vùng dữ liệu theo từng Họ, Chi hoặc Loài để trích xuất Sơ đồ quan hệ hình thái cây trồng trực quan, tránh quá tải khi tải dữ liệu lớn.
                    </p>
                </div>

                <Row className="justify-content-center">
                    <Col lg={10} xl={8}>
                        {/* BẢNG ĐIỀU KHIỂN CHỌN LỌC (CONTROL PANEL) */}
                        <Card className="border-0 shadow-sm rounded-4 mb-4">
                            <Card.Body className="p-4 p-md-5">
                                <h6 className="fw-bold mb-4 text-dark border-bottom pb-2">Khoanh vùng trích xuất</h6>
                                <Row className="g-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted">Họ Thực vật (Family) <span className="text-danger">*</span></Form.Label>
                                            <SmartSelect 
                                                placeholder="Chọn Họ..."
                                                label="Họ" 
                                                options={SmartSelectOptions.family || []}
                                                value={selectedFilters.family_option}
                                                isNewable={false}
                                                isNullable={true}
                                                onChange={(option) => {
                                                    setSelectedFilters(prev => ({ ...prev, family_option: option.value ? option : null, genus_option: null, species_option: null }));
                                                    // Chỉ hiện Chi thuộc Họ này
                                                    if (option.value) {
                                                    setLocalGenusOptions(SmartSelectOptions.genus?.filter(g => g.family_id === option.value) || []);
                                                    setLocalSpeciesOptions(SmartSelectOptions.species?.filter(s => s.family_id === option.value) || []);
                                                    } else {
                                                    setLocalGenusOptions(SmartSelectOptions.genus || []);
                                                    setLocalSpeciesOptions(SmartSelectOptions.species || []);
                                                    }
                                                }} 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted">Chi (Genus)</Form.Label>
                                            <SmartSelect 
                                                placeholder="Chọn Chi..."
                                                label="Chi" 
                                                options={localGenusOptions}
                                                value={selectedFilters.genus_option}
                                                isNewable={false}
                                                isNullable={true}
                                                onChange={(option) => {
                                                    if (option.value)
                                                    {
                                                    const parentFamily = SmartSelectOptions.family?.find(f => f.value === option.family_id) || null;
                                                    setSelectedFilters(prev => ({ ...prev, genus_option: option, species_option: null, family_option: parentFamily }));
                                                    // Chỉ hiện Loài thuộc Chi này
                                                    setLocalSpeciesOptions(SmartSelectOptions.species?.filter(s => s.genus_id === option.value) || []);
                                                    } else
                                                    {
                                                        setSelectedFilters(prev => ({ ...prev, genus_option: null, species_option: null }));
                                                        setLocalSpeciesOptions(selectedFilters.family_option ? SmartSelectOptions.species?.filter(s => s.family_id === selectedFilters.family_option.value) || [] : SmartSelectOptions.species || []);
                                                    }
                                                }} 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted">Loài (Species)</Form.Label>
                                            <SmartSelect 
                                                placeholder="Chọn Loài..."
                                                label="Loài" 
                                                options={localSpeciesOptions}
                                                value={selectedFilters.species_option}
                                                isNewable={false}
                                                isNullable={true}
                                                onChange={(option) => {
                                                    if (option.value)
                                                    {
                                                    const parentGenus = SmartSelectOptions.genus?.find(g => g.value === option.genus_id) || null;
                                                    const parentFamily = SmartSelectOptions.family?.find(f => f.value === option.family_id) || null;
                                                    setSelectedFilters({ species_option: option, genus_option: parentGenus, family_option: parentFamily });
                                                    } else
                                                    {
                                                        setSelectedFilters(prev => ({ ...prev, species_option: null }));
                                                    }
                                                }} 
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-flex justify-content-end mt-4 gap-2">
                                    <Button variant="light" className="fw-bold px-4 text-muted border" onClick={handleReset}>
                                        <FaRedo className="me-2"/> Làm mới
                                    </Button>
                                    
                                    {/* FIX UX: Khóa nút nếu chưa chọn Family */}
                                    <Button 
                                        variant="success" 
                                        className="fw-bold px-4 shadow-sm" 
                                        onClick={handleExtractTree} 
                                        disabled={isFetching}
                                    >
                                        {isFetching ? <Spinner size="sm" className="me-2"/> : <FaSearch className="me-2"/>} 
                                        Trích xuất Sơ đồ
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* KHU VỰC HIỂN THỊ SƠ ĐỒ */}
                        {treeData && (
                            <div className="animation-fade-in">
                                <TaxonomyTreeView 
                                    treeData={treeData} 
                                    focusedLevel={focusedNode.level} 
                                    focusedId={focusedNode.id}
                                    backendUrl={backendUrl}
                                    uiMapping={uiMapping}
                                />
                            </div>
                        )}
                        
                        {/* {!treeData && !isFetching && (
                            <Alert variant="warning" className="text-center p-4 mt-3 border-dashed rounded-4 bg-white opacity-75">
                                <FaExclamationTriangle className="me-2 text-warning mb-1" size={20}/>
                                <br/>
                                <strong>Bắt buộc:</strong> Vui lòng chọn ít nhất một <b>Họ thực vật (Family)</b> và ấn "Trích xuất" để vẽ cấu trúc phả hệ.
                            </Alert>
                        )} */}
                    </Col>
                </Row>
            </Container>
            
            <style>{`
                .border-dashed { border-style: dashed !important; border-width: 2px !important; border-color: #ffc107 !important; }
                .animation-fade-in { animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default TaxonomyExplorerPage;