import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap';
// Import useWatch để theo dõi value real-time tối ưu hơn
import { useForm, Controller, useWatch } from 'react-hook-form'; 
import Swal from 'sweetalert2';
import adminService from '../../../services/adminService'; // Đảm bảo đường dẫn đúng
import SmartSelect from '../../common/SmartSelect'; // Đảm bảo đường dẫn đúng

const DEFAULT_VALUES = {
    scientific_name: '',
    vietnamese_name: '',
    description: '',
    authority: '',
    family_select: null, // Object {value, label}
    // Field phụ cho Family mới
    new_family_scientific_name: '',
    new_family_vietnamese_name: ''
};

const ModalForm = ({ show, onHide, initialData, onSuccess, type, title, status }) => {
    const [familyOptions, setFamilyOptions] = useState([]);
    const [loadingFamily, setLoadingFamily] = useState(false);
    const [familyList, setFamilyList] = useState([]);
    // 1. FETCH DATA FAMILY NGAY TẠI ĐÂY
    // Mỗi lần Modal mở lên (mount), nó sẽ tự đi lấy data mới nhất
    useEffect(() => {
        const fetchFamilies = async () => {
            setLoadingFamily(true);
            try {
                const data = await adminService.fetchAllItems('families');
                setFamilyList(data);
                // Map data từ API sang format của React Select
                const options = data.map(fam => ({
                    value: fam.family_id,
                    label: `${fam.scientific_name} - ${fam.code}`
                }));
                setFamilyOptions(options);
            } catch (error) {
                console.error("Lỗi fetch family:", error);
                Swal.fire('Lỗi', 'Không thể tải danh sách Họ thực vật', 'error');
            } finally {
                setLoadingFamily(false);
            }
        };

        if (show) {
            fetchFamilies();
        }
    }, [show]); // Chạy lại khi modal mở

    // 2. TÍNH TOÁN GIÁ TRỊ FORM TỪ INITIAL DATA
    const formValues = useMemo(() => {
        if (!initialData) return DEFAULT_VALUES;
        
        const data = { ...initialData };
        // Xử lý null -> ''
        Object.keys(data).forEach(key => { if (data[key] === null) data[key] = ''; });

        // Map initialData sang Select Object (Nếu đang sửa)
        // Kiểm tra xem initialData có thông tin Family không để fill vào select
        if (data.Family) {
            data.family_select = {
                value: data.Family.family_id,
                label: `${data.Family.scientific_name} - ${data.Family.code}`
            };
            data.new_family_scientific_name = data.Family.scientific_name || '';
            data.new_family_vietnamese_name = data.Family.vietnamese_name || '';
        } else {
            data.family_select = null;
        }

        return data;
    }, [initialData]);

    // 3. KHỞI TẠO FORM
    const { register, handleSubmit, control,setValue, formState: { errors } } = useForm({ 
        mode: 'onTouched', 
        reValidateMode: 'onChange',
        defaultValues: DEFAULT_VALUES,
        values: formValues, // Sync data tự động (React 19 safe)
    });

    // 4. THEO DÕI GIÁ TRỊ SELECT
    // Dùng useWatch để lấy giá trị hiện tại của family_select
    const selectedFamily = useWatch({ control, name: 'family_select' });
    const isCreatingNewFamily = selectedFamily?.value === 'new';
    // 5. XỬ LÝ SUBMIT
    const onSubmit = async (formData) => {
        try {
            const payload = { ...formData };
            
            // Trim string
            Object.keys(payload).forEach(key => {
                if (typeof payload[key] === 'string') payload[key] = payload[key].trim();
            });

            // LOGIC XỬ LÝ FAMILY
            if (isCreatingNewFamily) {
                payload.family_id = "new";
                payload.new_family = {
                    scientific_name: formData.new_family_scientific_name,
                    vietnamese_name: formData.new_family_vietnamese_name
                };
            } else {
                // Case 2: Chọn Family có sẵn
                payload.family_id = formData.family_select?.value;
            }

            // Cleanup: Xóa các field thừa không gửi lên API
            delete payload.family_select;
            delete payload.new_family_scientific_name;
            delete payload.new_family_vietnamese_name;
            delete payload.Family; // Xóa object quan hệ cũ nếu có

            // Mapping ID key
            const idKeyMap = { families: 'family_id', genera: 'genus_id', species: 'species_id' };
            const idKey = idKeyMap[type];

            if (initialData) {
                await adminService.updateGenus(initialData[idKey], payload);
            } else {
                await adminService.createGenus(payload);
            }
            
            Swal.fire('Thành công', 'Đã lưu dữ liệu', 'success');
            onSuccess(); // Callback để refresh table ở cha

        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" backdrop="static" centered>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title className="fw-bold text-success">
                    {status === 'detail' ? 'Chi tiết' : status === 'edit' ? 'Cập nhật' : 'Thêm mới'} {title}
                </Modal.Title> 
            </Modal.Header>
            
            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Modal.Body className="p-4">
                    <Row className="g-3">
                        <Col md={12}><h6 className="text-primary fw-bold border-bottom pb-2">I. Thông tin Chi (Genus)</h6></Col>
                        {status !== 'add' && (
                            <Col md={12}>
                                <Form.Label className="fw-bold">Mã</Form.Label>
                                <Form.Control value={initialData?.code || ''} disabled />
                            </Col>
                        )}
                        
                        <Col md={6}>
                            <Form.Label className="fw-bold">Tên Khoa học (Chi) <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                {...register('scientific_name', { required: 'Tên khoa học là bắt buộc' })} 
                                placeholder="VD: Polyscias" 
                                disabled={status === 'detail'} 
                                isInvalid={!!errors.scientific_name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.scientific_name?.message}
                            </Form.Control.Feedback>
                        </Col>

                        <Col md={6}>
                            <Form.Label className="fw-bold">Tên Tiếng Việt</Form.Label>
                            <Form.Control 
                                {...register('vietnamese_name')} 
                                placeholder="VD: Chi Đinh lăng" 
                                disabled={status === 'detail'} 
                            />
                        </Col>
                        <Col md={12}>
                            <Form.Label className="fw-bold">Tác giả</Form.Label>
                            <Form.Control {...register('authority')} disabled={status === 'detail'} />
                        </Col>
                        
                        <Col md={12}>
                            <Form.Label className="fw-bold">Mô tả</Form.Label>
                            <Form.Control as="textarea" rows={4} {...register('description')} disabled={status === 'detail'} />
                        </Col>
                        <Col md={12} className="mt-4"><h6 className="text-success fw-bold border-bottom pb-2">II. Thông tin Phân loại (Tham chiếu)</h6></Col>
                        {/* --- PHẦN SELECT FAMILY (CHỈ HIỆN KHI KHÔNG PHẢI TYPE FAMILY) --- */}
                        {type !== 'families' && (
                        <Col md={12}>
                            <Card className={`border-${isCreatingNewFamily ? 'warning' : 'success'}`}>
                                <Card.Header className={`bg-${isCreatingNewFamily ? 'warning' : 'success'} text-${isCreatingNewFamily ? 'dark' : 'white'} fw-bold`}>
                                    {isCreatingNewFamily ? 'Tạo mới Họ thực vật (Family)' : 'Thông tin Họ thực vật (Family)'}
                                </Card.Header>

                                <Card.Body>
                                    <Row className="g-3">
                                        <Col md={12}>
                                            <Form.Label className="fw-bold">
                                                Chọn Họ <span className="text-danger">*</span>
                                            </Form.Label>
                                            
                                            {/* REACT SELECT CONTROLLER */}
                                            <Controller
                                                name="family_select"
                                                control={control}
                                                rules={{ required: "Vui lòng chọn Họ thực vật" }}
                                                render={({ field }) => (
                                                    <SmartSelect
                                                        {...field} // Truyền value, onChange, onBlur
                                                        label="Họ thực vật"
                                                        options={familyOptions}
                                                        isDisabled={status === 'detail' || loadingFamily}
                                                        placeholder={loadingFamily ? "Đang tải danh sách..." : "Chọn hoặc thêm mới Họ..."}
                                                        onChange={(selectedOption) => {  
                                                        // BƯỚC 1: Cập nhật giá trị cho chính Select này (Quan trọng!)
                                                        // Nếu không có dòng này, RHF sẽ không biết bạn đã chọn gì.
                                                        field.onChange(selectedOption);

                                                        // BƯỚC 2: Custom Logic - Set value cho 2 field kia
                                                        if (selectedOption?.value === 'new') {
                                                            // Ví dụ: Reset 2 ô nhập liệu về rỗng để người dùng nhập mới
                                                            setValue('new_family_scientific_name', ''); 
                                                            setValue('new_family_vietnamese_name', '');
                                                            
                                                        } else {
                                                            const fam= familyList.find(fam => fam.family_id === selectedOption.value);
                                                            // Ví dụ: Nếu chọn lại Họ cũ, xóa sạch dữ liệu ở ô nhập mới (để tránh gửi nhầm)
                                                            setValue('new_family_scientific_name', fam.scientific_name || '');
                                                            setValue('new_family_vietnamese_name', fam.vietnamese_name || '');
                                                        }
                                                    }}
                                                    />
                                                )}
                                            />
                                            {errors.family_select && (
                                                <div className="text-danger small mt-1">
                                                    {errors.family_select.message}
                                                </div>
                                            )}
                                        </Col>

                                            <> { isCreatingNewFamily &&(
                                                <Col md={12}>
                                                    <div className="alert alert-warning py-2 small mb-0">
                                                    <i className="fa fa-info-circle me-1"></i>
                                                    Bạn đang ở chế độ <strong>Tạo mới Họ thực vật</strong>. Vui lòng nhập đầy đủ thông tin bên dưới.  
                                                    <br />
                                                    <i className="fa fa-exclamation-triangle me-1"></i>
                                                    Đây chỉ là một phần thông tin cơ bản. Để cập nhật chi tiết, vui lòng truy cập trang <strong>Họ thực vật</strong>.
                                                    </div>
                                                </Col>)}
                                                <Col md={6}>
                                                    <Form.Label>Tên khoa học (Họ mới) <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        {...register('new_family_scientific_name', {
                                                            required: isCreatingNewFamily ? "Tên khoa học Họ thực vật là bắt buộc" : false
                                                        })}
                                                        isInvalid={!!errors.new_family_scientific_name}
                                                        placeholder="Nhập tên Họ mới..."
                                                        disabled={!isCreatingNewFamily}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.new_family_scientific_name?.message}
                                                    </Form.Control.Feedback>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Label>Tên Tiếng Việt (Họ mới)</Form.Label>
                                                    <Form.Control
                                                        {...register('new_family_vietnamese_name')}
                                                        placeholder="Nhập tên tiếng Việt..."
                                                        disabled={!isCreatingNewFamily}
                                                    />
                                                </Col>
                                            </>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        )}

                        
                    </Row>
                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Đóng</Button>
                    {status !== 'detail' && (
                        <Button variant="success" type="submit">
                            {initialData ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    )}
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalForm;