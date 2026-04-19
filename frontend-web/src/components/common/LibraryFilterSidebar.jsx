import React, { useState, useEffect } from 'react';
import { Card, Form, Button, InputGroup, Accordion, Badge ,Row, Col} from 'react-bootstrap';
import { FaFilter, FaRedo, FaSearch, FaSeedling, FaLeaf, FaTree, FaMapMarkerAlt, FaDna, FaExpandAlt, FaQuestionCircle, FaCompressAlt, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import SmartSelect from './SmartSelect';

const LibraryFilterSidebar = ({ filters, onFilterChange, onApply, onReset, uiMapping, isExpanded, onToggleExpand, activeSections, setActiveSections, SmartSelectOptions, localGenusOptions, localSpeciesOptions, setLocalGenusOptions, setLocalSpeciesOptions }) => {
    
    const [showSearchGuide, setShowSearchGuide] = useState(false);
    

    const toggleSection = (section) => {
        setActiveSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Hàm chặn nhập sai định dạng cho ô số (Chỉ cho phép số và dấu chấm thập phân)
    const handleNumberInput = (e) => {
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <>
        <Card className="border-0 shadow-sm rounded-4 sticky-top" style={{ top: '80px', zIndex: 10, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
            <Card.Body className="p-3 p-md-4 custom-scrollbar">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0 text-success"><FaFilter className="me-2"/> {isExpanded ? 'Bộ Lọc Nâng Cao' : 'Bộ Lọc'}</h6>
                    <div className="d-flex align-items-center">
                            {/* Nút phóng to/thu nhỏ như Admin */}
                            <Button variant="link" className="text-muted p-0 text-decoration-none me-3 d-none d-lg-block hover-text-success transition-all" onClick={onToggleExpand} title={isExpanded ? "Thu gọn bộ lọc" : "Mở rộng bộ lọc"}>
                                {isExpanded ? <FaCompressAlt size={16}/> : <FaExpandAlt size={16}/>}
                            </Button>
                            
                            <Button variant="light" size="sm" className="text-danger fw-bold rounded-pill px-3" onClick={onReset}>
                                <FaRedo size={12} className="me-1"/> Làm mới
                            </Button>
                        </div>
                </div>
                
                    
                <Form onSubmit={(e) => { e.preventDefault(); onApply(); }}>
                    
                    {/* 1. THANH TÌM KIẾM TEXT */}
                    <Form.Group className="mb-4">
                            <div className="d-flex justify-content-between align-items-end mb-2">
                                <Form.Label className="small fw-bold text-dark mb-0">Từ khóa tự do</Form.Label>
                                {/* NÚT MỞ MODAL HƯỚNG DẪN */}
                                <Button variant="link" className="p-0 text-success text-decoration-none small d-flex align-items-center fw-medium" onClick={() => setShowSearchGuide(true)}>
                                    <FaQuestionCircle className="me-1"/> Hướng dẫn tìm kiếm
                                </Button>
                            </div>
                            <InputGroup className="shadow-sm rounded-pill overflow-hidden border border-success border-opacity-25">
                                <InputGroup.Text className="bg-light border-0 text-success"><FaSearch/></InputGroup.Text>
                                <Form.Control 
                                    name="search"
                                    placeholder="Xem hướng dẫn tìm kiếm..." 
                                    value={filters.search || ''}
                                    onChange={onFilterChange}
                                    className="border-0 ps-0 shadow-none bg-light"
                                />
                            </InputGroup>
                        </Form.Group>

                    <Accordion defaultActiveKey={['tax', 'bio']} alwaysOpen className="custom-accordion">
                        
                        {/* 2. PHÂN LOẠI HỌC (Luôn mở) */}
                        <Accordion.Item eventKey="tax">
                            <Accordion.Header><FaDna className="me-2 text-muted"/> Phân loại học</Accordion.Header>
                            <Accordion.Body className="px-0 pt-1 pb-3">
                                {/* GỌI COMPONENT SMART SELECT TẠI ĐÂY */}
                                <Form.Group className="mb-2">
                                    <Form.Label className="small fw-bold text-muted mb-1">Họ Thực vật</Form.Label>
                                    <SmartSelect 
                                        label="Họ"
                                        placeholder="Chọn Họ..." 
                                        onChange={(option) => 
                                        {
                                            if (option.value)
                                            {
                                            setLocalGenusOptions(SmartSelectOptions?.genus?.filter(g => g.family_id === option.value) || []);
                                            setLocalSpeciesOptions(SmartSelectOptions?.species?.filter(s => s.family_id === option.value) || []);
                                            }
                                            else 
                                            {
                                                setLocalGenusOptions(SmartSelectOptions?.genus || []);
                                                setLocalSpeciesOptions(SmartSelectOptions?.species || []);
                                            }
                                            onFilterChange({ target: { name: 'family_option', value: option.value ? option : null  }});
                                            onFilterChange({ target: { name: 'genus_option', value: null }});
                                            onFilterChange({ target: { name: 'species_option', value: null }});
                                        }} 
                                        options={SmartSelectOptions?.family || []}
                                        value={filters.family_option }
                                        isNewable={false}
                                        isNullable={true}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label className="small fw-bold text-muted mb-1">Chi (Genus)</Form.Label>
                                    <SmartSelect 
                                        label="Chi"
                                        placeholder="Chọn Chi..." 
                                        onChange={(option) => 
                                        {
                                            if (option.value)
                                                setLocalSpeciesOptions(SmartSelectOptions?.species?.filter(s => s.genus_id === option.value) || []);
                                            else
                                                {
                                                    setLocalSpeciesOptions(SmartSelectOptions?.species?.filter(s => s.family_id === filters.family_option?.value) || []);
                                                }
                                            onFilterChange({ target: { name: 'genus_option', value: option.value ? option : null }});
                                            onFilterChange({ target: { name: 'family_option', value: option.value ? (SmartSelectOptions?.family?.find(f => f.value === option.family_id) || null) : filters.family_option }});
                                            onFilterChange({ target: { name: 'species_option', value: null }});
                                        }} 
                                        options={localGenusOptions || []}
                                        value={filters.genus_option }
                                        isNewable={false}
                                        isNullable={true}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label className="small fw-bold text-muted mb-1">Loài (Species)</Form.Label>
                                    <SmartSelect 
                                        label="Loài"
                                        placeholder="Chọn Loài..." 
                                        onChange={(option) => 
                                        {
                                            onFilterChange({ target: { name: 'species_option', value: option.value ? option : null }});
                                            onFilterChange({ target: { name: 'genus_option', value: option.value ? (SmartSelectOptions?.genus?.find(g => g.value === option.genus_id) || null) : filters.genus_option }});
                                            onFilterChange({ target: { name: 'family_option', value: option.value ? (SmartSelectOptions?.family?.find(f => f.value === option.family_id) || null) : filters.family_option }});
                                        }} 
                                        options={localSpeciesOptions || []}
                                        value={filters.species_option }
                                        isNewable={false}
                                        isNullable={true}
                                    />
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* 3. SINH HỌC CƠ BẢN */}
                        <Accordion.Item eventKey="bio">
                            <Accordion.Header><FaSeedling className="me-2 text-muted"/> Đặc điểm Sinh học</Accordion.Header>
                            <Accordion.Body className="px-0 pt-1 pb-3">
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-muted mb-1">Dạng sống</Form.Label>
                                    <Form.Select size="sm" name="life_form" value={filters.life_form || ''} onChange={onFilterChange}>
                                        <option value="">Tất cả</option>
                                        {Object.entries(uiMapping?.LIFE_FORM || {}).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value}
                                                </option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>
                                <Row className="g-2 mt-2">
                                <Col xs={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-muted mb-1">Trạng thái Hoa</Form.Label>
                                        <Form.Select 
                                            size="sm" 
                                            name="is_flowering" 
                                            value={filters.is_flowering || ''} 
                                            onChange={onFilterChange}
                                        >
                                            <option value="">Tất cả (Không quan tâm)</option>
                                            <option value="true">Có hoa</option>
                                            <option value="false">Không có hoa</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                
                                <Col xs={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-muted mb-1">Trạng thái Quả</Form.Label>
                                        <Form.Select 
                                            size="sm" 
                                            name="is_fruiting" 
                                            value={filters.is_fruiting || ''} 
                                            onChange={onFilterChange}
                                        >
                                            <option value="">Tất cả (Không quan tâm)</option>
                                            <option value="true">Có quả</option>
                                            <option value="false">Không có quả</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* 4. HÌNH THÁI LÁ (Có nút bật tắt) */}
                        <div className="d-flex justify-content-between align-items-center mt-3 mb-2 px-1">
                            <span className="fw-bold text-dark d-flex align-items-center"><FaLeaf className="me-2 text-success"/> Hình thái Lá</span>
                            <Form.Check type="switch" checked={activeSections.leaf} onChange={() => toggleSection('leaf')} />
                        </div>
                        {activeSections.leaf && (
                            <div className="p-3 bg-light rounded-3 mb-3 border">
                                <Row className="g-2">
                                    <Col xs={6}>
                                        <Form.Select size="sm" name="leaf_type" value={filters.leaf_type || ''} onChange={onFilterChange}>
                                            <option value="">Kiểu lá...</option>
                                            {Object.entries(uiMapping?.LEAF_TYPE || {}).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value}
                                                </option>
                                            ))
                                        }
                                        </Form.Select>
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Select size="sm" name="leaf_shape" value={filters.leaf_shape || ''} onChange={onFilterChange}>
                                            <option value="">Hình dạng...</option>
                                            {Object.entries(uiMapping?.LEAF_SHAPE || {}).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value}
                                                </option>
                                            ))
                                        }
                                        </Form.Select>
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Select size="sm" name="leaf_arrangement" value={filters.leaf_arrangement || ''} onChange={onFilterChange}>
                                            <option value="">Cách mọc...</option>
                                            {Object.entries(uiMapping?.LEAF_ARRANGEMENT || {}).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value}
                                                </option>
                                            ))
                                        }
                                        </Form.Select>
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Select size="sm" name="leaf_margin" value={filters.leaf_margin || ''} onChange={onFilterChange}>
                                            <option value="">Mép lá...</option>
                                            {Object.entries(uiMapping?.LEAF_MARGIN || {}).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value}
                                                </option>
                                            ))
                                        }
                                        </Form.Select>
                                    </Col>

                                    {/* ĐÃ ĐỔI TỪ xs={4} SANG xs={6} ĐỂ TỰ ĐỘNG XUỐNG DÒNG MƯỢT MÀ */}
                                    <Col xs={12}><hr className="my-1"/></Col>
                                    
                                    <Col xs={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted mb-1 text-truncate w-100">Dài tối thiểu</Form.Label>
                                            <Form.Control size="sm" type="number" min="0" step="0.1" name="leaf_length_min" value={filters.leaf_length_min || ''} onChange={onFilterChange} onKeyDown={handleNumberInput} placeholder="cm"/>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted mb-1 text-truncate w-100">Rộng tối thiểu</Form.Label>
                                            <Form.Control size="sm" type="number" min="0" step="0.1" name="leaf_width_min" value={filters.leaf_width_min || ''} onChange={onFilterChange} onKeyDown={handleNumberInput} placeholder="cm"/>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted mb-1 text-truncate ">Dài cuống tối thiểu </Form.Label>
                                            <Form.Control size="sm" type="number" min="0" step="0.1" name="petiole_length_min" value={filters.petiole_length_min || ''} onChange={onFilterChange} onKeyDown={handleNumberInput} placeholder="cm"/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {/* 5. HÌNH THÁI THÂN */}
                        <div className="d-flex justify-content-between align-items-center mt-3 mb-2 px-1">
                            <span className="fw-bold text-dark d-flex align-items-center"><FaTree className="me-2 text-warning"/> Thân</span>
                            <Form.Check type="switch" checked={activeSections.stem} onChange={() => toggleSection('stem')} />
                        </div>
                        {activeSections.stem && (
                            <div className="p-3 bg-light rounded-3 mb-3 border">
                                <div className="small fw-bold text-muted mb-2">Đặc điểm Thân</div>
                                <Row className="g-2 mb-3">
                                    <Col xs={6}>
                                        <Form.Select size="sm" name="stem_type" value={filters.stem_type || ''} onChange={onFilterChange}>
                                            <option value="">Loại thân...</option>
                                            {Object.entries(uiMapping?.STEM_TYPE || {}).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Select size="sm" name="stem_surface" value={filters.stem_surface || ''} onChange={onFilterChange}>
                                            <option value="">Bề mặt thân...</option>
                                            {Object.entries(uiMapping?.STEM_SURFACE || {}).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-muted mb-1 text-truncate w-100">Màu thân</Form.Label>
                                        <Form.Control size="sm" type="text" name="stem_color" value={filters.stem_color || ''} onChange={onFilterChange} placeholder="Nhập màu..."/>
                                    </Form.Group>
                                </Col>

                                <Col xs={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-muted mb-1 text-truncate w-100">Cao tối thiểu</Form.Label>
                                        <Form.Control size="sm" type="number" min="0" step="0.1" name="stem_height_min" value={filters.stem_height_min || ''} onChange={onFilterChange} onKeyDown={handleNumberInput} placeholder="Mét (m)"/>
                                    </Form.Group>
                                </Col>
                                </Row>
                            </div>
                        )}

                        {/* 6. HÌNH THÁI HOA */}
                                <div className="d-flex justify-content-between align-items-center mt-3 mb-2 px-1">
                            <span className="fw-bold text-dark d-flex align-items-center">🌸 Hoa</span>
                            <Form.Check type="switch" checked={activeSections.flower} onChange={() => toggleSection('flower')} />
                            </div>
                            {activeSections.flower && (
                            <div className="p-3 bg-light rounded-3 mb-3 border">
                                <div className="small fw-bold text-muted mb-2">Đặc điểm Hoa</div>
                                <Row className="g-2">
                                    <Col xs={12}>
                                        <Form.Select size="sm" name="inflorescence" value={filters.inflorescence || ''} onChange={onFilterChange}>
                                            <option value="">Cụm hoa (Inflorescence) (Tất cả)</option>
                                            {Object.entries(uiMapping?.INFLORESCENCE || {}).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Group className="h-100 d-flex flex-column justify-content-end">
                                            <Form.Control size="sm" type="text" name="flower_color" value={filters.flower_color || ''} onChange={onFilterChange} placeholder="Màu hoa..."/>
                                        </Form.Group>
                                    </Col>

                                    <Col xs={6}>
                                        <Form.Group>
                                            <Form.Control size="sm" type="number" min="0" name="flower_petal_count" value={filters.flower_petal_count || ''} onChange={onFilterChange} onKeyDown={handleNumberInput} placeholder="Số cánh hoa"/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {/* 6. PHÂN BỐ ĐỊA LÝ (Có nút bật tắt) */}
                        <div className="d-flex justify-content-between align-items-center mt-3 mb-2 px-1">
                            <span className="fw-bold text-dark d-flex align-items-center"><FaMapMarkerAlt className="me-2 text-danger"/> Phân Bố</span>
                            <Form.Check type="switch" checked={activeSections.distribution} onChange={() => toggleSection('distribution')} />
                        </div>
                        {activeSections.distribution && (
                            <div className="p-3 bg-light rounded-3 mb-3 border">
                                <Form.Group className="mb-2">
                                    <SmartSelect 
                                        label="Tỉnh/Thành phố"
                                        placeholder="Chọn Tỉnh/Thành phố..." 
                                        onChange={(option) => 
                                        {
                                            onFilterChange({ target: { name: 'dist_province_option', value: option.value ? option : null}});
                                        }} 
                                        options={SmartSelectOptions?.provinces || []}
                                        value={filters.dist_province_option }
                                        isNewable={false}
                                        isNullable={true}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Select size="sm" name="dist_status" value={filters.dist_status || ''} onChange={onFilterChange}>
                                        <option value="">Tình trạng phân bố...</option>
                                        {Object.entries(uiMapping?.DISTRIBUTION_STATUS || {}).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value.label}
                                                </option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Control size="sm" type="text" name="dist_description" value={filters.dist_description || ''} onChange={onFilterChange} placeholder="Nơi sống (Ven suối, đồi núi...)"/>
                                </Form.Group>
                            </div>
                        )}

                    </Accordion>

                    {/* NÚT LỌC CỐ ĐỊNH Ở DƯỚI CÙNG */}
                    <div className="position-sticky bottom-0 bg-white pt-3 pb-1 mt-3" style={{ zIndex: 5 }}>
                        <Button variant="success" type="submit" className="w-100 rounded-pill fw-bolder shadow-sm py-2" style={{letterSpacing: '1px'}}>
                            ÁP DỤNG LỌC DỮ LIỆU
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
        {/* MODAL HƯỚNG DẪN TÌM KIẾM CHI TIẾT */}
            <Modal show={showSearchGuide} onHide={() => setShowSearchGuide(false)} centered size="lg">
                <Modal.Header closeButton className="bg-success text-white border-0 rounded-top-4">
                    <Modal.Title className="fw-bold d-flex align-items-center fs-5">
                        <FaLightbulb className="me-2 text-warning"/> Cẩm Nang Tra Cứu Dữ Liệu
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-light">
                    <Row className="g-4">
                        <Col md={6}>
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body>
                                    <h6 className="fw-bold text-success border-bottom pb-2"><FaSearch className="me-2"/> Ô "Từ khóa tự do" tìm gì?</h6>
                                    <ul className="list-unstyled mb-0 small mt-3 text-muted lh-lg">
                                        <li><FaCheckCircle className="text-success me-2"/> <strong>Tên gọi:</strong> Tên Tiếng Việt, tên khoa học, tên đồng nghĩa (Synonyms), tên địa phương.</li>
                                        <li><FaCheckCircle className="text-success me-2"/> <strong>Mã định danh:</strong> Mã tra cứu hệ thống (VD: VAR-0001, SPC-102).</li>
                                        <li><FaCheckCircle className="text-success me-2"/> <strong>Đặc điểm nổi bật:</strong> Mô tả hình thái dị biệt (VD: rễ sần sùi, lá có mùi thơm).</li>
                                        <li><FaCheckCircle className="text-success me-2"/> <strong>Công dụng:</strong> Thuốc chữa bệnh, làm cảnh, lấy gỗ...</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body>
                                    <h6 className="fw-bold text-primary border-bottom pb-2"><FaFilter className="me-2"/> Cơ chế tối ưu (Smart Logic)</h6>
                                    <p className="small text-muted mt-3">Hệ thống áp dụng <strong>luồng lọc thông minh (AND)</strong> để trả về kết quả chính xác tuyệt đối:</p>
                                    <div className="bg-light p-2 rounded small text-dark border">
                                        Nếu bạn chọn <b>Họ Nhân sâm (Araliaceae)</b> trong Bộ lọc Phân loại, thì từ khóa bạn gõ vào ô tìm kiếm sẽ <u>chỉ quét các loài thuộc Họ này</u>, giúp loại bỏ hoàn toàn các kết quả rác (nhiễu) từ các Họ thực vật khác.
                                    </div>
                                    <p className="small text-danger mt-2 mb-0 fst-italic">
                                        * Lưu ý: Không nên gõ "Lá kép" vào ô Từ khóa. Hãy dùng tùy chọn "Kiểu lá" ở bộ lọc bên dưới để tra cứu chính xác.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
            </>
    );
};

export default LibraryFilterSidebar;