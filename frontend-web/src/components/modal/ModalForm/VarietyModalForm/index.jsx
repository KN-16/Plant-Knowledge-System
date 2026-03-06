import React, { useEffect, useState , useRef} from 'react';
import { Modal, Button, Form, Tabs, Tab, Spinner, Badge, Card, Row, Col } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';
import adminService from '../../../../services/adminService';
import SmartSelect from '../../../common/SmartSelect';
import ImageManagerTab from './ImageManagerTab';
import MorphTab from './MorphTab';
import DistributionTab from './DistributionTab'; // Mới thêm

const VarietyModalForm = ({ show, onHide, initialData, onSuccess, status, uiOptions }) => {
    const [loadingData, setLoadingData] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    // State Quản lý phân bố
    const [distributions, setDistributions] = useState([]);
    const initialDistributionsRef = useRef([]);
    const initialBgImageIdRef = useRef(null);
    const initialExistingImagesRef = useRef([]);

    // State quản lý Ảnh
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);
    const [bgImageId, setBgImageId] = useState(null);

    const [speciesOptions, setSpeciesOptions] = useState([]); // Dùng để lưu options Loài cho select
    const detailMode= status === 'detail';
    const { register, handleSubmit, control, setValue, reset, watch, formState: { errors, isDirty}, setFocus  } = useForm(
        {
            mode: 'onTouched', 
            reValidateMode: 'onChange',
        }
    );
    
    const checkIsFormDirty = () => {
        // 1. Kiểm tra các input cơ bản (Text, Select, Switch do react-hook-form quản lý)
        if (isDirty) return true;

        // 2. Kiểm tra thao tác Thêm/Xóa ảnh
        if (newImages.length > 0 || deletedImageIds.length > 0) return true;

        // 3. Kiểm tra thay đổi Ảnh bìa (Background Image)
        if (bgImageId !== initialBgImageIdRef.current) return true;

        // 4. Kiểm tra thay đổi trong mảng Phân bố địa lý (Distributions)
        // - Nếu độ dài khác nhau => Chắc chắn có Thêm/Xóa
        if (distributions.length !== initialDistributionsRef.current.length) return true;

        // - Nếu độ dài bằng nhau => Kiểm tra xem nội dung bên trong có bị sửa không
        // (Ta map ra các thuộc tính quan trọng nhất để so sánh JSON)
        const extractCoreDistData = (dists) => {
            return dists.map(d => ({
                distribution_id: d.distribution_id || null, // Nếu là tạo mới sẽ ko có id này
                province_id: d.province_id,
                status: d.status,
                description: d.description || ''
            }));
        };

        const currentDistsJSON = JSON.stringify(extractCoreDistData(distributions));
        const initialDistsJSON = JSON.stringify(extractCoreDistData(initialDistributionsRef.current));

        if (currentDistsJSON !== initialDistsJSON) return true;

        // 5. Kiểm tra thay đổi trong mảng Ảnh cũ
        const currentExistingImagesCore = existingImages.map(img => ({
            plant_image_id: img.plant_image_id,
            is_standard: img.is_standard 
        }));

        if (JSON.stringify(currentExistingImagesCore) !== JSON.stringify(initialExistingImagesRef.current)) {
            return true;
        }

        // Nếu vượt qua tất cả các chốt chặn trên => Form không có gì thay đổi
        return false;
    };
    // Thay thế hàm gọi onHide trực tiếp bằng hàm này
    const handleCloseModal = () => {
        if (checkIsFormDirty()) {
            Swal.fire({
                title: 'Dữ liệu chưa được lưu!',
                text: "Bạn có những thay đổi chưa được lưu. Nếu đóng, các thay đổi này sẽ bị mất. Bạn có chắc chắn muốn đóng không?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Vẫn đóng và bỏ qua',
                cancelButtonText: 'Quay lại'
            }).then((result) => {
                if (result.isConfirmed) {
                    reset(); // Reset form về trạng thái ban đầu
                    onHide(); // Gọi hàm đóng từ component cha
                }
            });
        } else {
            reset();
            onHide(); // Đóng bình thường nếu không có thay đổi
        }
    };
    const speciesSelect = watch('species_select');

    useEffect(() => {
        const loadDetail = async () => {
            //Species options
            const speciesOptionData = await adminService.fetchAllItems('species');
            console.log(speciesOptionData);
            setSpeciesOptions(speciesOptionData.map(species => ({
                value: species.species_id,
                label: `${species.scientific_name} - ${species.code}`,
                details: species,
                code: species.code,
                genus_scientific_name: species.Genus.scientific_name || '',
                family_scientific_name: species.Genus.Family.scientific_name || ''
            })));

            if (initialData?.variety_id && status !== 'add') {
                try {
                    const detail = await adminService.getVarietyDetail(initialData.variety_id);
                    
                    // 1. GOM TẤT CẢ DỮ LIỆU VÀO 1 OBJECT DUY NHẤT
                    const formValues = {
                        code: detail.code,
                        variety_name: detail.variety_name,
                        common_name: detail.common_name,
                        variant_type: detail.variant_type,
                        authority: detail.authority,
                        life_form: detail.life_form,
                        distinctive_feature: detail.distinctive_feature,
                        description: detail.description,
                        is_flowering: detail.is_flowering,
                        is_fruiting: detail.is_fruiting,
                        species_select: detail.Species ? { 
                            value: detail.species_id, 
                            label: `${detail.Species.scientific_name} - ${detail.Species.code}`,
                            details: detail.Species
                        } : null,
                        
                        // Khởi tạo trạng thái Switch dựa vào việc có data Morphology hay không
                        has_leaf_data: !!detail.MorphologyLeaf,
                        has_stem_data: !!detail.MorphologyStem,
                        has_flower_data: !!detail.MorphologyFlower
                    };

                    // 2. Đổ dữ liệu Morphology vào object formValues (KHÔNG GỌI SETVALUE Ở ĐÂY NỮA)
                    ['Leaf', 'Stem', 'Flower'].forEach(part => {
                        const data = detail[`Morphology${part}`];
                        if (data) {
                            Object.keys(data).forEach(k => {
                                formValues[`${part.toLowerCase()}_${k}`] = data[k];
                            });
                        }
                    });

                    // 3. GỌI RESET 1 LẦN DUY NHẤT VÀ ÉP NÓ THÀNH DEFAULT VALUES
                    // Chú ý tham số thứ 2
                    reset(formValues, { keepDefaultValues: false });

                    // ... (Phần set Distributions và Images giữ nguyên)
                    setDistributions(detail.Distributions || []);
                    initialDistributionsRef.current = JSON.parse(JSON.stringify(detail.Distributions || []));
                    setExistingImages(detail.PlantImages || []);
                    initialExistingImagesRef.current = (detail.PlantImages || []).map(img => ({
                        plant_image_id: img.plant_image_id,
                        // Ép kiểu an toàn giống như cách ta làm ở UI
                        is_standard: img.is_standard
                    }));
                    const bgImg = detail.PlantImages?.find(i => i.is_background);
                    if (bgImg) {
                        setBgImageId(bgImg.plant_image_id);
                        initialBgImageIdRef.current = bgImg.plant_image_id;
                    } else {
                        setBgImageId(null);
                        initialBgImageIdRef.current = null;
                    }

                } catch (error) {
                    Swal.fire('Lỗi', 'Không thể lấy chi tiết Thứ/Giống', 'error');
                    onHide();
                }
            } else {
                // Form Thêm mới
                reset({ 
                    variant_type: 'Phenotype', 
                    has_leaf_data: false, 
                    has_stem_data: false, 
                    has_flower_data: false 
                }, { keepDefaultValues: false }); // Cũng reset lại trạng thái gốc

                setExistingImages([]);
                setNewImages([]);
                setDistributions([]);
                initialDistributionsRef.current = [];
                initialBgImageIdRef.current = null;
                initialExistingImagesRef.current = [];
            }
        };

        setLoadingData(true);
        if (show) loadDetail();
        setLoadingData(false);
    }, [show, initialData, status, reset]); // Bỏ setValue ra khỏi array dependency

    const onSubmit = async (data) => {
        setSaving(true);
        try {
            const fd = new FormData();
            
            // 1. Basic Info
            const basicInfo = {
                variety_name: data.variety_name,
                common_name: data.common_name,
                variant_type: data.variant_type,
                authority: data.authority,
                life_form: data.life_form,
                distinctive_feature: data.distinctive_feature,
                description: data.description,
                is_flowering: data.is_flowering ? true : false,
                is_fruiting: data.is_fruiting ? true : false,
                species_id: data.species_select?.value
            };
            fd.append('basicInfo', JSON.stringify(basicInfo));

            // 2. Morph Info
            const extractMorph = (prefix) => {
                if (!data[`has_${prefix}_data`]) return null;
                let obj = {};
                let hasData = false;
                Object.keys(data).forEach(k => {
                    if (k.startsWith(`${prefix}_`) && data[k] !== '' && data[k] !== undefined) {
                        obj[k.replace(`${prefix}_`, '')] = data[k];
                        hasData = true;
                    }
                });
                return hasData ? obj : null;
            };
            fd.append('leafData', JSON.stringify(extractMorph('leaf')));
            fd.append('stemData', JSON.stringify(extractMorph('stem')));
            fd.append('flowerData', JSON.stringify(extractMorph('flower')));

            // 3. Phân bố (Distributions)
            // Lọc ra id để BE biết cái nào giữ, hoặc gửi data mới/sửa
            fd.append('distributions', JSON.stringify(distributions));

            // 4. Ảnh
            fd.append('deletedImages', JSON.stringify(deletedImageIds));
            fd.append('bgImageId', bgImageId);
            const imageMeta = [];
            newImages.forEach(item => {
                fd.append('images', item.file);
                imageMeta.push({ part_type: item.part_type, is_standard: item.is_standard, temp_id: item.id });
            });
            fd.append('imageMetadata', JSON.stringify(imageMeta));
            const updatedExistingImages = existingImages
                .filter(img => !deletedImageIds.includes(img.plant_image_id))
                .map(img => ({
                    plant_image_id: img.plant_image_id,
                    is_standard: img.is_standard
                }));
            fd.append('updatedExistingImages', JSON.stringify(updatedExistingImages));

            await adminService.saveVariety(initialData?.variety_id, fd);
            
            Swal.fire('Thành công', 'Dữ liệu đã được lưu', 'success');
            onSuccess();
        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message || 'Lưu thất bại', 'error');
        } finally {
            setSaving(false);
        }
    };

    const onError = (errors) => {
    console.log("Form bị chặn lưu do các lỗi sau:", errors);

    // 1. Lấy tên của trường đầu tiên bị lỗi
    const firstErrorField = Object.keys(errors)[0];

    if (firstErrorField) {
        // 2. Xác định xem trường đó thuộc Tab nào
        let targetTab = 'basic'; 
        
        // Dựa vào tiền tố để biết thuộc tab Hình thái (MorphTab)
        if (firstErrorField.startsWith('leaf_') || 
            firstErrorField.startsWith('stem_') || 
            firstErrorField.startsWith('flower_')) {
            targetTab = 'morph';
        }

        // 3. Nếu đang không ở Tab chứa lỗi thì tự động chuyển Tab
        if (activeTab !== targetTab) {
            setActiveTab(targetTab);
        }

        // 4. Đợi giao diện render xong Tab mới (khoảng 100ms) rồi Focus vào ô nhập liệu
        setTimeout(() => {
            setFocus(firstErrorField);
        }, 240);
    }

    // 5. Hiển thị thông báo Toast
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Vui lòng kiểm tra lại các trường báo đỏ!',
        showConfirmButton: false,
        timer: 3000
    });
};

    return (
        <Modal show={show} onHide={handleCloseModal} size="xl" backdrop="static">
            <Form onSubmit={handleSubmit(onSubmit, onError)}>
                <Modal.Header closeButton className="bg-light" >
                    <Modal.Title className="fw-bold text-success">
                        <i className="fa fa-seedling me-2"></i>
                        {status === 'add' ? 'Thêm mới' : detailMode ? 'Chi tiết' : 'Cập nhật'} Thứ & Giống
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body className="p-0 bg-light">
                    {loadingData ? (
                        <div className="text-center py-5"><Spinner animation="border" /></div>
                    ) : (
                        <Tabs 
                            activeKey={activeTab} 
                            onSelect={(k) => setActiveTab(k)} 
                            className="mb-3 bg-white px-3 pt-3 border-bottom shadow-sm"
                        >
                            
                            {/* --- TAB 1: THÔNG TIN CHUNG --- */}
                            <Tab eventKey="basic" title={<span className="fw-bold">Thông tin chung</span>}>
                                <div className="p-4 bg-white m-3 rounded shadow-sm border">
                                    <Row className="g-4">
                                        
                                        {/* Cột Trái: Form Nhập liệu chính */}
                                        <Col md={7} lg={8}>
                                            <h6 className="text-primary fw-bold border-bottom pb-2 mb-3">Thông tin định danh</h6>
                                            <Row className="g-3">
                                                {status !== 'add' && (
                                                    <Col md={12}>
                                                        <Form.Label className="small fw-bold mb-1">Mã (Code)</Form.Label>
                                                        <Form.Control size="sm" {...register('code')} disabled className="bg-light fw-bold" style={{ width: '150px'}}/>
                                                    </Col>
                                                )}

                                                <Col md={6}>
                                                    <Form.Label className="small fw-bold mb-1">Tên Latin (Nếu có)</Form.Label>
                                                    <Form.Control size="sm" {...register('variety_name')} placeholder="VD: var. macrocarpa"
                                                    disabled={detailMode} 
                                                    />
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Label className="small fw-bold mb-1">Tên thường gọi <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control size="sm" {...register('common_name', { required: "Tên thường gọi là bắt buộc!" })} placeholder="VD: Đinh lăng lá lớn" 
                                                        isInvalid={!!errors.common_name}
                                                        disabled={detailMode}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errors.common_name?.message}</Form.Control.Feedback>
                                                </Col>

                                                <Col md={4}>
                                                    <Form.Label className="small fw-bold mb-1">Bậc phân loại</Form.Label>
                                                    <Form.Select size="sm" {...register('variant_type')} disabled={detailMode}>
                                                        {Object.entries(uiOptions.VARIANT_TYPE || {}).map(([key, label]) => (
                                                            <option key={key} value={key}>{label}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Label className="small fw-bold mb-1">Dạng sống</Form.Label>
                                                    <Form.Select size="sm" {...register('life_form')} disabled={detailMode}>
                                                        <option value="" disabled>-- Chọn --</option>
                                                        {Object.entries(uiOptions.LIFE_FORM || {}).map(([key, label]) => (
                                                            <option key={key} value={key}>{label}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Label className="small fw-bold mb-1">Tác giả công bố</Form.Label>
                                                    <Form.Control size="sm" {...register('authority')} placeholder="Người đặt tên..." disabled={detailMode} />
                                                </Col>

                                                <Col md={12}>
                                                    <Form.Label className="small fw-bold mb-1">Đặc điểm nhận dạng nổi bật (Distinctive Feature)</Form.Label>
                                                    <Form.Control size="sm" as="textarea" rows={2} {...register('distinctive_feature')} placeholder="Điểm khác biệt chính so với loài gốc..." disabled={detailMode} />
                                                </Col>
                                                <Col md={12}>
                                                    <Form.Label className="small fw-bold mb-1">Mô tả chung</Form.Label>
                                                    <Form.Control size="sm" as="textarea" rows={3} {...register('description')} disabled={detailMode} />
                                                </Col>
                                                
                                                <Col md={12} className="pt-2">
                                                    <Form.Check inline type="switch" id="flowering" label={<span className="fw-bold text-danger">Có Hoa</span>} {...register('is_flowering')} disabled={detailMode}/>
                                                    <Form.Check inline type="switch" id="fruiting" label={<span className="fw-bold text-warning">Có Quả</span>} {...register('is_fruiting')} className="ms-3" disabled={detailMode}/>
                                                </Col>
                                            </Row>
                                        </Col>

                                        {/* Cột Phải: Tham chiếu Loài (Nổi bật) */}
                                        <Col md={5} lg={4}>
                                            <Card className="border-success h-100 shadow-sm">
                                                <Card.Header className="bg-success text-white py-2">
                                                    <h6 className="mb-0 fw-bold"><i className="fa fa-link me-2"></i>Thông tin về Loài (Species)</h6>
                                                </Card.Header>
                                                <Card.Body className="bg-success bg-opacity-10 d-flex flex-column">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="small fw-bold mb-1 text-success">Chọn Loài <span className="text-danger">*</span></Form.Label>
                                                        <Controller
                                                            name="species_select"
                                                            control={control}
                                                            rules={{ required: "Vui lòng chọn loài" }}
                                                            render={({ field, fieldState: { error } }) => (
                                                                <>
                                                                    <SmartSelect 
                                                                        {...field} 
                                                                        label="Loài" 
                                                                        placeholder="Chọn loài cho giống này..."
                                                                        options={speciesOptions}
                                                                        isDisabled={status === 'detail'|| loadingData}
                                                                        isNewable={false}
                                                                         // Chỉnh sửa thì không cho đổi loài (vì liên quan đến Morphology), chỉ được chọn khi thêm mới
                                                                    />
                                                                    {error && <small className="text-danger">{error.message}</small>}
                                                                </>
                                                            )}
                                                        />
                                                    </Form.Group>

                                                    {/* Khu vực hiển thị thông tin Taxonomy rút gọn */}
                                                    <div className="flex-grow-1 p-3 bg-white rounded border border-success border-opacity-25">
                                                        {speciesSelect ? (
                                                            <>
                                                                <div className="mb-2 pb-2 border-bottom">
                                                                    <small className="text-muted d-block">Mã loài (Species):</small>
                                                                    <span className="fw-bold text-dark">{speciesSelect.code }</span>
                                                                </div>
                                                                <div className="mb-2 pb-2 border-bottom">
                                                                    <small className="text-muted d-block">Tên khoa học loài (Species):</small>
                                                                    <span className="fw-bold text-dark">{speciesSelect.scientific_name }</span>
                                                                </div>
                                                                <div className="mb-2 pb-2 border-bottom">
                                                                    <small className="text-muted d-block">Chi (Genus):</small>
                                                                    <span className="fw-medium text-secondary">{speciesSelect.genus_scientific_name || 'Đang tải...'}</span>
                                                                </div>
                                                                <div>
                                                                    <small className="text-muted d-block">Họ (Family):</small>
                                                                    <span className="fw-medium text-secondary">{speciesSelect.family_scientific_name || 'Đang tải...'}</span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-center text-muted opacity-50 py-3">
                                                                <i className="fa fa-info-circle display-6 mb-2"></i>
                                                                <p className="mb-0 small">Vui lòng chọn Loài để xem chuỗi phân loại.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                            </Tab>

                            {/* --- TAB 2: HÌNH THÁI --- */}
                            <Tab eventKey="morph" title={<span className="fw-bold">Hình thái chi tiết</span>}
                            mountOnEnter
                            unmountOnExit={false}

                             >
                                <div className="p-3">
                                    <MorphTab register={register} watch={watch} setValue={setValue} status={status} control={control} 
                                    errors={errors} uiOptions={uiOptions}/>
                                </div>
                            </Tab>

                            {/* --- TAB 3: PHÂN BỐ --- */}
                            <Tab eventKey="distribution" title={<span className="fw-bold">Phân bố địa lý</span>}
                            mountOnEnter
                            unmountOnExit={false}
                            
                            >
                                <DistributionTab 
                                    distributions={distributions} 
                                    setDistributions={setDistributions} 
                                    uiOptions={uiOptions} // Chỉ truyền options của trường enum liên quan đến phân bố
                                    status={status}
                                />
                            </Tab>

                            {/* --- TAB 4: HÌNH ẢNH --- */}
                            <Tab eventKey="images" title={<span className="fw-bold text-primary"><i className="fa fa-image me-1"></i>Thư viện Ảnh</span>}>
                                <ImageManagerTab 
                                    existingImages={existingImages}
                                    setDeletedImageIds={setDeletedImageIds}
                                    deletedImageIds={deletedImageIds}
                                    newImages={newImages}
                                    setNewImages={setNewImages}
                                    bgImageId={bgImageId}
                                    setBgImageId={setBgImageId}
                                    status={status}
                                    setExistingImages={setExistingImages}
                                />
                            </Tab>

                        </Tabs>
                    )}
                </Modal.Body>

                <Modal.Footer className="bg-white border-top shadow-sm">
                    <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
                    <Button variant="success" type="submit" disabled={saving || detailMode} >
                        {saving ? <Spinner size="sm" /> : <><i className="fa fa-save me-1"></i> Lưu dữ liệu</>}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default VarietyModalForm;