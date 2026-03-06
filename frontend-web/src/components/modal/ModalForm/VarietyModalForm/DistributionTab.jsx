import React, { useEffect, useState } from 'react';
import { Button, Table, Badge, Form, Row, Col, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaEye } from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';
import SmartSelect from '../../../common/SmartSelect';
import adminService from '../../../../services/adminService';

const DistributionTab = ({ distributions, setDistributions, uiOptions, status }) => {
    // Controls the separate Modal for Distribution
    const [formModal, setFormModal] = useState({ show: false, mode: 'add', index: null });
    
    const { register, handleSubmit, control, reset, watch , formState: { errors}} = useForm(
        {
            mode: 'onTouched', 
            reValidateMode: 'onChange',
        }
    );
    const [provinceOptions, setProvinceOptions] = useState([]);

    const watchProvinceSelect = watch('province_select');
    const distributionStatusOptions = uiOptions?.DISTRIBUTION_STATUS || {};
    const detailMode = status === 'detail';
    // Load Provinces for SmartSelect on mount
    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const data = await adminService.fetchProvinces(); // Assume this exists in adminService
                setProvinceOptions(
                    data.map(p => ({
                        value: p.province_id,
                        label: `${p.province_name} - ${p.country}`,
                        details: p
                    }))
                );
            } catch (err) {
                console.error("Load provinces error:", err);
            }
        };
        loadProvinces();
    }, []);

    const handleOpenForm = (mode, index = null) => {
        if (mode === 'edit' || mode === 'view') {
            const item = distributions[index];
            reset({
                status: item.status,
                description: item.description,
                province_select: item.province_select || { 
                    value: item.province_id, 
                    label: item.Province ? `${item.Province.province_name} - ${item.Province.country}` : 'Đã chọn',
                    details: item.Province 
                }
            });
        } else {
            reset({ status: 'Native', description: '', province_select: null });
        }
        setFormModal({ show: true, mode, index });
    };

    const handleCloseForm = () => {
        setFormModal({ show: false, mode: 'add', index: null });
    };

    const onSubmitDistribution = (data) => {
        if (formModal.mode === 'view') return; 
        if (!data.province_select) return;

        let provName = '';
        let provCountry = 'VN';

        if (data.province_select.isNew) {
            provName = data.province_select.label.replace('+ Thêm Tỉnh mới...', '').trim() || 'Tỉnh Mới';
        } else if (data.province_select.details) {
            provName = data.province_select.details.province_name;
            provCountry = data.province_select.details.country;
        } else {
            const parts = data.province_select.label.split(' - ');
            provName = parts[0];
            if(parts[1]) provCountry = parts[1];
        }

        const newDist = {
            province_select: data.province_select, 
            province_id: data.province_select.value,
            Province: { province_name: provName, country: provCountry },
            status: data.status,
            description: data.description,
            isNewProvince: data.province_select.isNew 
        };

        if (formModal.mode === 'edit' && formModal.index !== null) {
            const updated = [...distributions];
            if (updated[formModal.index].distribution_id) {
                newDist.distribution_id = updated[formModal.index].distribution_id;
            }
            updated[formModal.index] = newDist;
            setDistributions(updated);
        } else {
            setDistributions([...distributions, newDist]);
        }
        handleCloseForm();
    };

    const handleDelete = (index) => {
        setDistributions(distributions.filter((_, i) => i !== index));
    };

    const isReadOnly = formModal.mode === 'view';

    return (
        <div className="p-4 bg-white m-3 rounded shadow-sm border">
            
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h6 className="fw-bold mb-0 text-primary">
                    <FaMapMarkerAlt className="me-2"/>Quản lý Phân bố Địa lý
                </h6>
                <Button variant="primary" size="sm" onClick={() => handleOpenForm('add')} disabled={detailMode}>
                    <FaPlus className="me-1" /> Thêm Phân bố
                </Button>
            </div>

            {/* List Data Table */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="border rounded">
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="table-light position-sticky top-0 shadow-sm" style={{ zIndex: 1 }}>
                        <tr>
                            <th className="px-3" style={{width: '60px'}}>STT</th>
                            <th>Khu vực (Tỉnh / Quốc gia)</th>
                            <th>Trạng thái</th>
                            <th>Ghi chú</th>
                            <th className="text-center" style={{width: '150px'}}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {distributions.length > 0 ? (
                            distributions.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="px-3 fw-bold text-muted">{idx + 1}</td>
                                    <td className="fw-medium text-dark">
                                        {item.Province ? `${item.Province.province_name} (${item.Province.country || 'VN'})` : 'Chưa xác định'}
                                    </td>
                                    <td>
                                        <Badge 
                                            bg={distributionStatusOptions[item.status].label === 'Bản địa' ? 'success' : distributionStatusOptions[item.status].label === 'Xâm lấn' ? 'danger' : 'info'} 
                                            className="px-3 py-2 rounded-pill"
                                        >
                                            {distributionStatusOptions[item.status].label || item.status}
                                        </Badge>
                                    </td>
                                    <td className="small text-muted text-truncate" style={{ maxWidth: '250px' }}>
                                        {item.description || '---'}
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex gap-2 justify-content-center">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>Xem chi tiết</Tooltip>}>
                                                <Button variant="outline-info" size="sm" className="rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleOpenForm('view', idx)} disabled={detailMode}>
                                                    <FaEye size={12}/>
                                                </Button>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement="top" overlay={<Tooltip>Chỉnh sửa</Tooltip>}>
                                                <Button variant="outline-primary" size="sm" className="rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleOpenForm('edit', idx)} disabled={detailMode}>
                                                    <FaEdit size={12}/>
                                                </Button>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement="top" overlay={<Tooltip>Xóa</Tooltip>}>
                                                <Button variant="outline-danger" size="sm" className="rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleDelete(idx)} disabled={detailMode}>
                                                    <FaTrash size={12}/>
                                                </Button>
                                            </OverlayTrigger>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-5">
                                    <div className="text-muted opacity-50 mb-2">
                                        <FaMapMarkerAlt size={40} />
                                    </div>
                                    <p className="mb-0 fw-medium">Chưa có dữ liệu phân bố địa lý.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Sub-Modal Form (pops up over the tab) */}
            <Modal show={formModal.show} onHide={handleCloseForm} centered size="lg" style={{ zIndex: 1060 }} backdrop="static"> 
                <div onKeyDown={(e) => {
                     // (Tùy chọn) Nếu người dùng nhấn Enter, giả lập click nút Lưu
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSubmit(onSubmitDistribution)();
                    }
                }}>
                    <Modal.Header closeButton className={`bg-${isReadOnly ? 'light' : 'primary'} text-${isReadOnly ? 'dark' : 'white'}`}>
                        <Modal.Title className="fs-6 fw-bold">
                            <FaMapMarkerAlt className="me-2"/>
                            {formModal.mode === 'add' ? 'Thêm mới khu vực phân bố' : formModal.mode === 'edit' ? 'Chỉnh sửa phân bố' : 'Chi tiết phân bố'}
                        </Modal.Title>
                    </Modal.Header>
                    
                    <Modal.Body className="p-4 bg-light">
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Label className="small fw-bold mb-1">Tỉnh/Thành/Khu vực <span className="text-danger">*</span></Form.Label>
                                {isReadOnly ? (
                                    <Form.Control disabled value={watchProvinceSelect?.label || ''} />
                                ) : (
                                    <Controller
                                        name="province_select"
                                        control={control}
                                        rules={{ required: "Vui lòng chọn tỉnh/thành" }}
                                        render={({ field }) => (
                                            <SmartSelect 
                                                {...field} 
                                                options={provinceOptions}
                                                label="Tỉnh/Quốc gia" 
                                                placeholder="Chọn hoặc nhập tên mới..."
                                                isNewable={false} // Disable inner creation if you want pure DB selection
                                            />
                                        )}
                                    />
                                )}
                                {errors.province_select && (
                                <div className="text-danger small mt-1">
                                    {errors.province_select.message}
                                </div>
                            )}
                            </Col>

                            <Col md={6}>
                                <Form.Label className="small fw-bold mb-1 text-muted">Tên Tỉnh/Thành</Form.Label>
                                <Form.Control 
                                    disabled 
                                    value={watchProvinceSelect?.details?.province_name || (watchProvinceSelect?.isNew ? 'Đang tạo mới' : '')} 
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold mb-1 text-muted">Quốc gia</Form.Label>
                                <Form.Control 
                                    disabled 
                                    value={watchProvinceSelect?.details?.country || (watchProvinceSelect?.isNew ? 'VN' : '')} 
                                />
                            </Col>

                            <Col md={12}>
                                <Form.Label className="small fw-bold mb-1">Trạng thái sinh học <span className="text-danger">*</span></Form.Label>
                                <Form.Select {...register('status', { required: true })} disabled={isReadOnly}>
                                    {Object.entries(distributionStatusOptions).map(([key, option]) => (
                                        <option key={key} value={key}>{option.label}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            
                            <Col md={12}>
                                <Form.Label className="small fw-bold mb-1">Mô tả / Ghi chú</Form.Label>
                                <Form.Control as="textarea" rows={3} {...register('description')} disabled={isReadOnly} placeholder="Độ cao, môi trường sống..."  />
                            </Col>
                        </Row>
                    </Modal.Body>

                    <Modal.Footer className="bg-white">
                        <Button variant="secondary" onClick={handleCloseForm}>Đóng</Button>
                        {!isReadOnly && (
                            <Button variant={formModal.mode === 'add' ? 'primary' : 'warning'} type="button" onClick={handleSubmit(onSubmitDistribution)}>
                                {formModal.mode === 'add' ? 'Thêm vào danh sách' : 'Lưu thay đổi'}
                            </Button>
                        )}
                    </Modal.Footer>
                </div>
            </Modal>

        </div>
    );
};

export default DistributionTab;