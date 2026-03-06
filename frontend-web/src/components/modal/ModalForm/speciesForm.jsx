import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap';
import { useForm, Controller, useWatch } from 'react-hook-form';
import Swal from 'sweetalert2';
import adminService from '../../../services/adminService';
import SmartSelect from '../../common/SmartSelect';

const DEFAULT_VALUES = {
    // 1. Thông tin Loài (Species)
    code: '',
    scientific_name: '',
    vietnamese_name: '',
    synonyms: '',
    other_names: '',
    uses: '',
    description: '',
    authority: '',
    
    // 2. Thông tin Chi (Genus) - Select & Input
    genus_select: null,
    new_genus_scientific_name: '',
    new_genus_vietnamese_name: '',

    // 3. Thông tin Họ (Family) - Select & Input
    family_select: null,
    new_family_scientific_name: '',
    new_family_vietnamese_name: ''
};

const SpeciesModalForm = ({ show, onHide, initialData, onSuccess, type = "species", title, status }) => {
    const [genusList, setGenusList] = useState([]); // List data gốc để tham chiếu
    const [genusOptions, setGenusOptions] = useState([]);
    
    const [familyList, setFamilyList] = useState([]); // List data gốc để tham chiếu
    const [familyOptions, setFamilyOptions] = useState([]);
    
    const [loadingData, setLoadingData] = useState(false);

    // --------------------------------------------------------
    // 1. FETCH DATA (CHI & HỌ) KHI MỞ MODAL
    // --------------------------------------------------------
    useEffect(() => {
        const fetchReferenceData = async () => {
            setLoadingData(true);
            try {
                // Gọi song song cả 2 API để tối ưu tốc độ
                const [generaData, familiesData] = await Promise.all([
                    adminService.fetchAllItems('genera'),
                    adminService.fetchAllItems('families')
                ]);

                // 1. Setup Genus Data
                setGenusList(generaData);
                setGenusOptions(generaData.map(g => ({
                    value: g.genus_id,
                    label: `${g.scientific_name} - ${g.code}`,
                    // Lưu kèm thông tin Family của Genus này để auto-fill
                    family_id: g.family_id,
                    Family: familiesData.find(f => f.family_id === g.family_id)
                })));

                // 2. Setup Family Data
                setFamilyList(familiesData);
                setFamilyOptions(familiesData.map(f => ({
                    value: f.family_id,
                    label: `${f.scientific_name} - ${f.code}`,
                })));

            } catch (error) {
                console.error("Lỗi fetch data tham chiếu:", error);
                Swal.fire('Lỗi', 'Không thể tải danh sách Chi/Họ', 'error');
            } finally {
                setLoadingData(false);
            }
        };

        if (show) {
            fetchReferenceData();
        }
    }, [show]);

    // --------------------------------------------------------
    // 2. PREPARE FORM VALUES TỪ INITIAL DATA
    // --------------------------------------------------------
    const formValues = useMemo(() => {
        if (!initialData) return DEFAULT_VALUES;
        
        const data = { ...initialData };
        // Clean null -> ''
        Object.keys(data).forEach(key => { if (data[key] === null) data[key] = ''; });

        // Reset field nhập mới
        data.new_genus_scientific_name = '';
        data.new_genus_vietnamese_name = '';
        data.new_family_scientific_name = '';
        data.new_family_vietnamese_name = '';

        // --- MAP DATA CHO GENUS SELECT ---
        if (data.Genus) {
            data.genus_select = {
                value: data.Genus.genus_id,
                label: `${data.Genus.scientific_name} - ${data.Genus.code}`,
                // Quan trọng: Truyền Family info theo để logic hiển thị hoạt động đúng
                Family: data.Genus.Family 
            };
            // Fill thông tin vào ô input (readonly)
            data.new_genus_scientific_name = data.Genus.scientific_name || '';
            data.new_genus_vietnamese_name = data.Genus.vietnamese_name || '';
        } else {
            data.genus_select = null;
        }

        // --- MAP DATA CHO FAMILY SELECT ---
        // Lấy từ Genus.Family (ưu tiên) hoặc data.Family (nếu structure khác)
        const refFamily = data.Genus?.Family || data.Family;
        if (refFamily) {
            data.family_select = {
                value: refFamily.family_id,
                label: `${refFamily.scientific_name} - ${refFamily.code}`
            };
            data.new_family_scientific_name = refFamily.scientific_name || '';
            data.new_family_vietnamese_name = refFamily.vietnamese_name || '';
        } else {
            data.family_select = null;
        }

        return data;
    }, [initialData]);

    // --------------------------------------------------------
    // 3. SETUP REACT HOOK FORM
    // --------------------------------------------------------
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({ 
        mode: 'onTouched', 
        reValidateMode: 'onChange',
        defaultValues: DEFAULT_VALUES,
        values: formValues
    });

    // --------------------------------------------------------
    // 4. WATCHERS (Theo dõi trạng thái Select)
    // --------------------------------------------------------
    const selectedGenus = useWatch({ control, name: 'genus_select' });
    const selectedFamily = useWatch({ control, name: 'family_select' });

    // Logic xác định trạng thái "New"
    const isNewGenus = selectedGenus?.value === 'new';
    const isNewFamily = selectedFamily?.value === 'new';

    // Logic Disabled:
    // - Family Select bị disable khi: Đang load HOẶC (Đã chọn Chi cũ - vì Chi cũ đã cố định Họ)
    // - Chỉ mở Family Select khi: Chọn Chi Mới ('new')
    const disableFamilySelect = loadingData || status === 'detail' || (!isNewGenus);

    // --------------------------------------------------------
    // 5. SUBMIT HANDLER
    // --------------------------------------------------------
    const onSubmit = async (formData) => {
        try {
            const payload = { ...formData };
            
            // --- XỬ LÝ LOGIC NESTED (SPECIES -> GENUS -> FAMILY) ---
            
            // 1. Xử lý GENUS
            if (isNewGenus) {
                payload.genus_id = "new"; // Backend hiểu là tạo mới
                payload.new_genus = {
                    scientific_name: formData.new_genus_scientific_name,
                    vietnamese_name: formData.new_genus_vietnamese_name,
                    family_id: isNewFamily ? "new" : formData.family_select.value,
                    new_family: isNewFamily ? {
                        scientific_name: formData.new_family_scientific_name,
                        vietnamese_name: formData.new_family_vietnamese_name
                    } : null
                };
            } else {
                // Chọn Genus có sẵn
                if (!formData.genus_select?.value) {
                    Swal.fire('Lỗi', 'Vui lòng chọn Chi (Genus)', 'error');
                    return;
                }
                payload.genus_id = formData.genus_select.value;
            }

            // Clean rác
            delete payload.genus_select;
            delete payload.new_genus_scientific_name;
            delete payload.new_genus_vietnamese_name;
            delete payload.family_select;
            delete payload.new_family_scientific_name;
            delete payload.new_family_vietnamese_name;
            delete payload.Genus;
            delete payload.Family;

            // Clean string spaces
            Object.keys(payload).forEach(key => {
                if (typeof payload[key] === 'string') payload[key] = payload[key].trim();
            });
            console.log('Payload:', payload);

            // Call API
            if (initialData) {
                await adminService.updateSpecies(initialData.species_id, payload);
            } else {
                await adminService.createSpecies(payload);
            }
            
            Swal.fire('Thành công', 'Đã lưu dữ liệu Loài', 'success');
            onSuccess();

        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" backdrop="static" centered>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title className="fw-bold text-primary">
                    {status === 'detail' ? 'Chi tiết' : status === 'edit' ? 'Cập nhật' : 'Thêm mới'} {title}
                </Modal.Title> 
            </Modal.Header>
            
            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Modal.Body className="p-4">
                    <Row className="g-3">
                        {/* ================= KHU VỰC THÔNG TIN LOÀI (SPECIES) ================= */}
                        <Col md={12}><h6 className="text-primary fw-bold border-bottom pb-2">I. Thông tin Loài (Species)</h6></Col>
                        
                        {status !== 'add' && (
                            <Col md={3}>
                                <Form.Label className="fw-bold">Mã Loài</Form.Label>
                                <Form.Control value={initialData?.code || ''} disabled />
                            </Col>
                        )}
                        
                        <Col md={status !== 'add' ? 5 : 6}>
                            <Form.Label className="fw-bold">Tên Khoa học <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                {...register('scientific_name', { required: 'Bắt buộc nhập' })} 
                                placeholder="VD: Panax vietnamensis" 
                                disabled={status === 'detail'} 
                                isInvalid={!!errors.scientific_name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.scientific_name?.message}</Form.Control.Feedback>
                        </Col>

                        <Col md={status !== 'add' ? 4 : 6}>
                            <Form.Label className="fw-bold">Tên Tiếng Việt</Form.Label>
                            <Form.Control {...register('vietnamese_name')} placeholder="VD: Sâm Ngọc Linh" disabled={status === 'detail'} />
                        </Col>

                        <Col md={6}>
                            <Form.Label>Tên đồng danh (Synonyms)</Form.Label>
                            <Form.Control {...register('synonyms')} as="textarea" rows={2} disabled={status === 'detail'} />
                        </Col>
                        <Col md={6}>
                            <Form.Label>Tên gọi khác (Other names)</Form.Label>
                            <Form.Control {...register('other_names')} as="textarea" rows={2} disabled={status === 'detail'} />
                        </Col>
                        <Col md={12}>
                            <Form.Label className="fw-bold">Công dụng (Uses)</Form.Label>
                            <Form.Control {...register('uses')} as="textarea" rows={3} disabled={status === 'detail'} />
                        </Col>
                        <Col md={12}>
                            <Form.Label>Mô tả chi tiết</Form.Label>
                            <Form.Control {...register('description')} as="textarea" rows={3} disabled={status === 'detail'} />
                        </Col>
                        <Col md={12}>
                            <Form.Label>Tác giả (Authority)</Form.Label>
                            <Form.Control {...register('authority')} disabled={status === 'detail'} />
                        </Col>

                        {/* ================= KHU VỰC THAM CHIẾU (CHI & HỌ) ================= */}
                        <Col md={12} className="mt-4"><h6 className="text-success fw-bold border-bottom pb-2">II. Thông tin Phân loại (Tham chiếu)</h6></Col>

                        {/* --- CARD CHI (GENUS) --- */}
                        <Col md={12}>
                            <Card className={`border-${isNewGenus ? 'warning' : 'secondary'} shadow-sm`}>
                                <Card.Header className={`bg-${isNewGenus ? 'warning' : 'light'} text-${isNewGenus ? 'dark' : 'dark'} fw-bold`}>
                                    {isNewGenus ? 'Tạo mới Chi (Genus)' : 'Thuộc Chi (Genus)'}
                                </Card.Header>
                                <Card.Body>
                                    <Row className="g-3">
                                        {/* 1. Select Genus */}
                                        <Col md={12}>
                                            <Form.Label className="fw-bold">Chọn Chi <span className="text-danger">*</span></Form.Label>
                                            <Controller
                                                name="genus_select"
                                                control={control}
                                                rules={{ required: "Vui lòng chọn Chi" }}
                                                render={({ field }) => (
                                                    <SmartSelect
                                                        {...field}
                                                        label="Chi (Genus)"
                                                        options={genusOptions}
                                                        isDisabled={status === 'detail' || loadingData}
                                                        placeholder={loadingData ? "Đang tải..." : "Chọn hoặc thêm mới Chi..."}
                                                        onChange={(option) => {
                                                            field.onChange(option); // Update State RHF
                                                            // LOGIC TỰ ĐỘNG ĐIỀN INPUT KHI CHANGE
                                                            if (option?.value === 'new') {
                                                                // Reset trắng input Chi
                                                                setValue('new_genus_scientific_name', '');
                                                                setValue('new_genus_vietnamese_name', '');
                                                                // Reset trắng Select Họ để user tự chọn
                                                                setValue('family_select', null);
                                                                setValue('new_family_scientific_name', '');
                                                                setValue('new_family_vietnamese_name', '');
                                                            } else {
                                                                // Chọn Chi cũ -> Auto fill input Chi
                                                                const foundGenus = genusList.find(g => g.genus_id === option.value);
                                                                if (foundGenus) {
                                                                    setValue('new_genus_scientific_name', foundGenus.scientific_name || '');
                                                                    setValue('new_genus_vietnamese_name', foundGenus.vietnamese_name || '');                                                                    
                                                                    // AUTO-SELECT HỌ (FAMILY) CỦA CHI ĐÓ
                                                                    if (option.Family) {
                                                                        const famObj = {
                                                                            value: option.Family.family_id,
                                                                            label: `${option.Family.scientific_name} - ${option.Family.code}`,
                                                                        };
                                                                        setValue('family_select', famObj);
                                                                        // Fill luôn input Họ (readonly)
                                                                        setValue('new_family_scientific_name', option.Family.scientific_name || '');
                                                                        setValue('new_family_vietnamese_name', option.Family.vietnamese_name || '');
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                            {errors.genus_select && <div className="text-danger small mt-1">{errors.genus_select.message}</div>}
                                        </Col>
                                        { isNewGenus &&(
                                        <Col md={12}>
                                            <div className="alert alert-warning py-2 small mb-0">
                                            <i className="fa fa-info-circle me-1"></i>
                                            Bạn đang ở chế độ <strong>Tạo mới Chi thực vật</strong>. Vui lòng nhập đầy đủ thông tin bên dưới.  
                                            <br />
                                            <i className="fa fa-exclamation-triangle me-1"></i>
                                            Đây chỉ là một phần thông tin cơ bản. Để cập nhật chi tiết, vui lòng truy cập trang <strong>Chi thực vật</strong>.
                                            </div>
                                        </Col>)}      
                                        {/* 2. Input Genus Scientific Name */}
                                        <Col md={6}>
                                            <Form.Label>Tên khoa học (Chi) {isNewGenus && <span className="text-danger">*</span>}</Form.Label>
                                            <Form.Control
                                                {...register('new_genus_scientific_name', { required: isNewGenus ? "Nhập tên Chi" : false })}
                                                placeholder="VD: Panax"
                                                disabled={!isNewGenus} // Chỉ cho sửa khi chọn New
                                                isInvalid={!!errors.new_genus_scientific_name}
                                                className={!isNewGenus ? 'bg-light' : ''}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.new_genus_scientific_name?.message}</Form.Control.Feedback>
                                        </Col>

                                        {/* 3. Input Genus Vietnamese Name */}
                                        <Col md={6}>
                                            <Form.Label>Tên tiếng Việt (Chi)</Form.Label>
                                            <Form.Control
                                                {...register('new_genus_vietnamese_name')}
                                                placeholder="VD: Chi Sâm"
                                                disabled={!isNewGenus}
                                                className={!isNewGenus ? 'bg-light' : ''}
                                            />
                                        </Col>

                                        {/* --- NESTED CARD HỌ (FAMILY) --- */}
                                        <Col md={12}>
                                            <Card className={`border-${isNewFamily ? 'warning' : 'success'} mt-2`}>
                                                <Card.Header className={`bg-${isNewFamily ? 'warning' : 'success'} text-${isNewFamily ? 'dark' : 'white'} py-1 px-3`} style={{fontSize: '0.9rem'}}>
                                                    {isNewFamily ? '>> Tạo mới Họ (Family)' : '>> Thuộc Họ (Family)'}
                                                </Card.Header>
                                                <Card.Body className="py-3 bg-opacity-10 bg-success">
                                                    <Row className="g-2">
                                                        {/* A. Select Family */}
                                                        <Col md={12}>
                                                            <Form.Label className="small fw-bold mb-1">Chọn Họ {isNewGenus && <span className="text-danger">*</span>}</Form.Label>
                                                            <Controller
                                                                name="family_select"
                                                                control={control}
                                                                rules={{ required: isNewGenus ? "Vui lòng chọn Họ cho Chi mới" : false }}
                                                                render={({ field }) => (
                                                                    <SmartSelect
                                                                        {...field}
                                                                        label="Họ (Family)"
                                                                        options={familyOptions}
                                                                        placeholder="Chọn hoặc thêm mới Họ..."
                                                                        // DISABLE Logic: 
                                                                        // Nếu Genus KHÔNG PHẢI NEW (tức là chọn Genus cũ) -> Disable Family Select (vì Genus cũ đã dính với Family cũ)
                                                                        isDisabled={disableFamilySelect}
                                                                        
                                                                        onChange={(option) => {
                                                                            field.onChange(option);
                                                                            if (option?.value === 'new') {
                                                                                setValue('new_family_scientific_name', '');
                                                                                setValue('new_family_vietnamese_name', '');
                                                                            } else {
                                                                                const foundFam = familyList.find(f => f.family_id === option.value);
                                                                                if(foundFam){
                                                                                    setValue('new_family_scientific_name', foundFam.scientific_name || '');
                                                                                    setValue('new_family_vietnamese_name', foundFam.vietnamese_name || '');
                                                                                }
                                                                            }
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            {errors.family_select && <div className="text-danger small mt-1">{errors.family_select.message}</div>}
                                                        </Col>
                                                        { isNewFamily &&(
                                                        <Col md={12}>
                                                            <div className="alert alert-warning py-2 small mb-0">
                                                            <i className="fa fa-info-circle me-1"></i>
                                                            Bạn đang ở chế độ <strong>Tạo mới Họ thực vật</strong>. Vui lòng nhập đầy đủ thông tin bên dưới.  
                                                            <br />
                                                            <i className="fa fa-exclamation-triangle me-1"></i>
                                                            Đây chỉ là một phần thông tin cơ bản. Để cập nhật chi tiết, vui lòng truy cập trang <strong>Họ thực vật</strong>.
                                                            </div>
                                                        </Col>)}            
                                                        {/* B. Input Family Name */}
                                                        <Col md={6}>
                                                            <Form.Label className="small mb-1">Tên khoa học (Họ) {isNewFamily && <span className="text-danger">*</span>}</Form.Label>
                                                            <Form.Control
                                                                {...register('new_family_scientific_name', { required: isNewFamily ? "Nhập tên Họ" : false })}
                                                                size="sm"
                                                                disabled={!isNewFamily} // Chỉ sửa được khi chọn New Family
                                                                isInvalid={!!errors.new_family_scientific_name}
                                                                className={!isNewFamily ? 'bg-light' : ''}
                                                            />
                                                        </Col>
                                                        <Col md={6}>
                                                            <Form.Label className="small mb-1">Tên tiếng Việt (Họ)</Form.Label>
                                                            <Form.Control
                                                                {...register('new_family_vietnamese_name')}
                                                                size="sm"
                                                                disabled={!isNewFamily}
                                                                className={!isNewFamily ? 'bg-light' : ''}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        {/* END NESTED CARD FAMILY */}

                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* END CARD GENUS */}

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

export default SpeciesModalForm;