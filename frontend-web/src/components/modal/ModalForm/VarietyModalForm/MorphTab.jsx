import React, { useState, useEffect, use } from 'react';
import { useWatch } from 'react-hook-form';
import { Row, Col, Form, Card } from 'react-bootstrap';

const MorphTab = ({ register, watch, status, setValue, control, errors, uiOptions  }) => {
    // Watch states để Tắt/Bật khu vực nhập liệu
    const hasLeaf = useWatch({
        control,
        name: 'has_leaf_data',
        defaultValue: false
        });

        const hasStem = useWatch({
        control,
        name: 'has_stem_data',
        defaultValue: false
        });

        const hasFlower = useWatch({
        control,
        name: 'has_flower_data',
        defaultValue: false
        });

    // Validation rule chung cho số dương
    const positiveNumberRule = { valueAsNumber: true, validate: (value) => value ? (value > 0 || "Phải là số dương") : true };

    const diabledLeaf = status === 'detail' || !hasLeaf;
    const diabledStem = status === 'detail' || !hasStem;
    const diabledFlower = status === 'detail' || !hasFlower;

    return (
        <div className="d-flex flex-column gap-3">
            {/* ================= KHU VỰC LÁ ================= */}
            <Card className={`border-${hasLeaf ? 'success' : 'light'} shadow-sm`}>
                <Card.Header className={`bg-${hasLeaf ? 'success' : 'light'} bg-opacity-10 d-flex justify-content-between align-items-center py-2`}>
                    <h6 className={`fw-bold mb-0 ${hasLeaf ? 'text-success' : 'text-muted'}`}>
                        <i className="fa fa-leaf me-2"></i>Dữ liệu Hình thái Lá
                    </h6>
                    <Form.Check type="switch" id="switch-leaf" {...register('has_leaf_data')} label={<small className="fw-bold">Nhập liệu</small>} disabled={status === 'detail'} />
                </Card.Header>
                    <Card.Body className="bg-white" style={{ display: hasLeaf ? 'block' : 'none' }}>
                        <Row className="g-3">
                            <Col md={3}>
                                <Form.Label className="small fw-bold mb-1">Kiểu lá <span className="text-danger">*</span></Form.Label>
                                <Form.Select size="sm" {...register('leaf_leaf_type', { required: hasLeaf ? "Vui lòng chọn kiểu lá" : false })} disabled={diabledLeaf} isInvalid={!!errors.leaf_leaf_type}>
                                    <option value="">-- Chọn --</option>
                                    {Object.entries(uiOptions.LEAF_TYPE).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                                </Form.Select>
                                {errors.leaf_leaf_type && <Form.Control.Feedback type="invalid">{errors.leaf_leaf_type.message}</Form.Control.Feedback>}
                            </Col>
                            <Col md={3}>
                                <Form.Label className="small fw-bold mb-1">Hình dáng <span className="text-danger">*</span></Form.Label>
                                <Form.Select size="sm" {...register('leaf_shape', { required: hasLeaf ? "Vui lòng chọn hình dáng lá" : false })} disabled={diabledLeaf} isInvalid={!!errors.leaf_shape}>
                                    <option value="">-- Chọn --</option>
                                    {Object.entries(uiOptions.LEAF_SHAPE).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                                </Form.Select>
                                {errors.leaf_shape && <Form.Control.Feedback type="invalid">{errors.leaf_shape.message}</Form.Control.Feedback>}
                            </Col>
                            <Col md={3}>
                                <Form.Label className="small fw-bold mb-1">Cách mọc <span className="text-danger">*</span></Form.Label>
                                <Form.Select size="sm" {...register('leaf_arrangement', { required: hasLeaf ? "Vui lòng chọn cách mọc lá" : false })} disabled={diabledLeaf} isInvalid={!!errors.leaf_arrangement}>
                                    <option value="">-- Chọn --</option>
                                    {Object.entries(uiOptions.LEAF_ARRANGEMENT).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                                </Form.Select>
                                {errors.leaf_arrangement && <Form.Control.Feedback type="invalid">{errors.leaf_arrangement.message}</Form.Control.Feedback>}
                            </Col>
                            <Col md={3}>
                                <Form.Label className="small fw-bold mb-1">Mép lá <span className="text-danger">*</span></Form.Label>
                                <Form.Select size="sm" {...register('leaf_margin', { required: hasLeaf ? "Vui lòng chọn mép lá" : false })} disabled={diabledLeaf} isInvalid={!!errors.leaf_margin}>
                                    <option value="">-- Chọn --</option>
                                    {Object.entries(uiOptions.LEAF_MARGIN).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                                </Form.Select>
                                {errors.leaf_margin && <Form.Control.Feedback type="invalid">{errors.leaf_margin.message}</Form.Control.Feedback>}
                            </Col>

                            {/* Số liệu kích thước */}
                            <Col md={12}><hr className="my-1 border-light"/></Col>
                            <Col md={12}>
                            <div className="alert alert-info py-2 px-3 small mb-2">
                                <strong>Lưu ý:</strong> Các trường số liệu kích thước có thể để trống nếu không có dữ liệu, 
                                nhưng nếu nhập thì phải là <strong>số dương</strong>. 
                                Tất cả đơn vị tính theo <strong>cm (centimet)</strong>.
                            </div>
                            </Col>                            
                            <Col md={2}>
                                <Form.Label className="small fw-bold text-muted mb-1">Dài tối thiểu (Nếu có)</Form.Label>
                                <Form.Control size="sm" type="number" step="0.1" {...register('leaf_length_min', positiveNumberRule)} placeholder="> 0" disabled={diabledLeaf} isInvalid={!!errors.leaf_length_min} />
                                {errors.leaf_length_min && <Form.Control.Feedback type="invalid">{errors.leaf_length_min.message}</Form.Control.Feedback>}
                            </Col>
                            <Col md={2}>
                                <Form.Label className="small fw-bold text-muted mb-1">Dài tối đa (Nếu có)</Form.Label>
                                <Form.Control size="sm" type="number" step="0.1" {...register('leaf_length_max', positiveNumberRule)} placeholder="> 0" disabled={diabledLeaf} isInvalid={!!errors.leaf_length_max} />
                                {errors.leaf_length_max && <Form.Control.Feedback type="invalid">{errors.leaf_length_max.message}</Form.Control.Feedback>}
                            </Col>
                            <Col md={2}>
                                <Form.Label className="small fw-bold text-muted mb-1">Rộng tối thiểu (Nếu có)</Form.Label>
                                <Form.Control size="sm" type="number" step="0.1" {...register('leaf_width_min', positiveNumberRule)} placeholder="> 0" disabled={diabledLeaf} isInvalid={!!errors.leaf_width_min} />
                                {errors.leaf_width_min && <Form.Control.Feedback type="invalid">{errors.leaf_width_min.message}</Form.Control.Feedback>}
                            </Col>
                            <Col md={2}>
                                <Form.Label className="small fw-bold text-muted mb-1">Rộng tối đa (Nếu có)</Form.Label>
                                <Form.Control size="sm" type="number" step="0.1" {...register('leaf_width_max', positiveNumberRule)} placeholder="> 0" disabled={diabledLeaf} isInvalid={!!errors.leaf_width_max} /> 
                                {errors.leaf_width_max && <Form.Control.Feedback type="invalid">{errors.leaf_width_max.message}</Form.Control.Feedback>}
                            </Col>
                            <Col md={4}>
                                <Form.Label className="small fw-bold text-muted mb-1">Chiều dài cuống (Nếu có)</Form.Label>
                                <Form.Control size="sm" type="number" step="0.1" {...register('leaf_petiole_length', positiveNumberRule)} placeholder="> 0" disabled={diabledLeaf} isInvalid={!!errors.leaf_petiole_length} />
                                {errors.leaf_petiole_length && <Form.Control.Feedback type="invalid">{errors.leaf_petiole_length.message}</Form.Control.Feedback>}
                            </Col>
                            <Col md={12}>
                                <Form.Control size="sm" as="textarea" rows={2} {...register('leaf_description')} placeholder="Mô tả thêm về lá..." disabled={diabledLeaf} />
                            </Col>
                        </Row>
                    </Card.Body>
            </Card>

            {/* ================= KHU VỰC THÂN ================= */}
            <Card className={`border-${hasStem ? 'warning' : 'light'} shadow-sm`}>
                <Card.Header className={`bg-${hasStem ? 'warning' : 'light'} bg-opacity-10 d-flex justify-content-between align-items-center py-2`}>
                    <h6 className={`fw-bold mb-0 ${hasStem ? 'text-warning' : 'text-muted'}`}>
                        <i className="fa fa-tree me-2"></i>Dữ liệu Hình thái Thân
                    </h6>
                    <Form.Check type="switch" id="switch-stem" {...register('has_stem_data')} label={<small className="fw-bold">Nhập liệu</small>} disabled={status === 'detail'} />
                </Card.Header>
                    <Card.Body className="bg-white" style={{ display: hasStem ? 'block' : 'none' }}>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Label className="small fw-bold mb-1">Kiểu thân <span className="text-danger">*</span></Form.Label>
                                <Form.Select size="sm" {...register('stem_stem_type', { required: hasStem ? "Kiểu thân là bắt buộc" : false })} disabled={diabledStem} isInvalid={!!errors.stem_stem_type}>
                                    <option value="">-- Chọn --</option>
                                    {Object.entries(uiOptions.STEM_TYPE).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                                </Form.Select>
                                {errors.stem_stem_type && <Form.Control.Feedback type="invalid">{errors.stem_stem_type.message}</Form.Control.Feedback>}
                            </Col>
                            <Col md={4}>
                                <Form.Label className="small fw-bold mb-1">Bề mặt <span className="text-danger">*</span></Form.Label>
                                <Form.Select size="sm" {...register('stem_surface', { required: hasStem ? "Bề mặt thân là bắt buộc" : false })} disabled={diabledStem} isInvalid={!!errors.stem_surface}>
                                    <option value="">-- Chọn --</option>
                                    {Object.entries(uiOptions.STEM_SURFACE).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                                </Form.Select>
                                {errors.stem_surface && <Form.Control.Feedback type="invalid">{errors.stem_surface.message}</Form.Control.Feedback>}
                            </Col>
                            <Col md={4}>
                                <Form.Label className="small fw-bold mb-1">Màu sắc </Form.Label>
                                <Form.Control size="sm" {...register('stem_color' )} placeholder="VD: Nâu, Xanh lục..." disabled={diabledStem} />
                            </Col>

                            <Col md={12}><hr className="my-1 border-light"/></Col>
                            <Col md={12}>
                            <div className="alert alert-info py-2 px-3 small mb-2">
                                <strong>Lưu ý:</strong> Các trường số liệu kích thước có thể để trống nếu không có dữ liệu, 
                                nhưng nếu nhập thì phải là <strong>số dương</strong>. 
                                Tất cả đơn vị tính theo <strong>m (meter)</strong>.
                            </div>
                            </Col>
                            <Col md={3}>
                                <Form.Label className="small fw-bold text-muted mb-1">Cao tối thiểu (Nếu có)</Form.Label>
                                <Form.Control size="sm" type="number" step="0.1" {...register('stem_height_min', positiveNumberRule)} placeholder="> 0" disabled={diabledStem} />
                            </Col>
                            <Col md={3}>
                                <Form.Label className="small fw-bold text-muted mb-1">Cao tối đa (Nếu có)</Form.Label>
                                <Form.Control size="sm" type="number" step="0.1" {...register('stem_height_max', positiveNumberRule)} placeholder="> 0" disabled={diabledStem} />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-muted mb-1">Mô tả thêm</Form.Label>
                                <Form.Control size="sm" as="textarea" rows={2} {...register('stem_description')} placeholder="Mô tả thêm về thân..." disabled={diabledStem} />
                            </Col>
                        </Row>
                    </Card.Body>
            </Card>

            {/* ================= KHU VỰC HOA ================= */}
            <Card className={`border-${hasFlower ? 'danger' : 'light'} shadow-sm`}>
                <Card.Header className={`bg-${hasFlower ? 'danger' : 'light'} bg-opacity-10 d-flex justify-content-between align-items-center py-2`}>
                    <h6 className={`fw-bold mb-0 ${hasFlower ? 'text-danger' : 'text-muted'}`}>
                        <i className="fa fa-sun-o me-2"></i>Dữ liệu Hình thái Hoa
                    </h6>
                    <Form.Check type="switch" id="switch-flower" {...register('has_flower_data')} label={<small className="fw-bold">Nhập liệu</small>} disabled={status === 'detail'} />
                </Card.Header>
                    <Card.Body className="bg-white" style={{ display: hasFlower ? 'block' : 'none' }}>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Label className="small fw-bold mb-1">Cụm hoa <span className="text-danger">*</span></Form.Label>
                                <Form.Select size="sm" {...register('flower_inflorescence', { required: hasFlower ? "Cụm hoa thân là bắt buộc" : false })} disabled={diabledFlower} isInvalid={!!errors.flower_inflorescence}>
                                    <option value="">-- Chọn --</option>
                                    {Object.entries(uiOptions.INFLORESCENCE).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                                </Form.Select>
                                {errors.flower_inflorescence && <Form.Control.Feedback type="invalid">{errors.flower_inflorescence.message}</Form.Control.Feedback>}
                            </Col>
                            <Col md={4}>
                                <Form.Label className="small fw-bold mb-1">Màu sắc <span className="text-danger">*</span></Form.Label>
                                <Form.Control size="sm" {...register('flower_color', { required: hasFlower ? "Màu sắc hoa là bắt buộc" : false })} placeholder="VD: Đỏ tươi, Trắng..."  disabled={diabledFlower} isInvalid={!!errors.flower_color} />
                                {errors.flower_color && <Form.Control.Feedback type="invalid">{errors.flower_color.message}</Form.Control.Feedback>}
                            </Col>
                            <Col md={4}>
                                <Form.Label className="small fw-bold mb-1">Số lượng cánh <span className="text-danger">*</span></Form.Label>
                                <Form.Control size="sm" type="number" {...register('flower_petal_count', { required: hasFlower ? "Số lượng cánh hoa là bắt buộc" : false, min: { value: 1, message: 'Phải >= 1' } })} placeholder="> 0"   disabled={diabledFlower } isInvalid={!!errors.flower_petal_count} />
                                {errors.flower_petal_count && <Form.Control.Feedback type="invalid">{errors.flower_petal_count.message}</Form.Control.Feedback>}
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-muted mb-1">Mùa nở hoa</Form.Label>
                                <Form.Control size="sm" {...register('flower_blooming_season')} placeholder="VD: Mùa xuân, Tháng 4-6..." disabled={diabledFlower} />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-muted mb-1">Mô tả thêm</Form.Label>
                                <Form.Control size="sm" as="textarea" rows={2} {...register('flower_description')} placeholder="Đặc điểm khác..." disabled={diabledFlower} />
                            </Col>
                        </Row>
                    </Card.Body>
            </Card>
        </div>
    );
};

export default MorphTab;