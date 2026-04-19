import React, { useState, useRef } from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import ReactCrop, { convertToPercentCrop } from 'react-image-crop'; // THÊM convertToPercentCrop
import 'react-image-crop/dist/ReactCrop.css';
import { FaUpload, FaLeaf, FaTree,  FaSearch } from 'react-icons/fa';
import { useNavigate, createSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const ImageSearchModal = ({ show, onHide }) => {
    const navigate = useNavigate();
    const [imgSrc, setImgSrc] = useState('');
    
    // State này lưu giá trị PIXEL để thư viện vẽ khung mượt mà
    const [crop, setCrop] = useState(); 
    // State này lưu giá trị PHẦN TRĂM (%) để gửi cho Backend Python
    const [percentCropData, setPercentCropData] = useState(null);

    const [selectedParts, setSelectedParts] = useState(['Leaf']);
    const imgRef = useRef(null);

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImgSrc(reader.result);
                // Reset crop khi đổi ảnh
                setCrop(undefined); 
                setPercentCropData(null);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const togglePart = (part) => {
        setSelectedParts(prev => 
            prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]
        );
    };

    // Khi ảnh load xong, set mặc định khung crop là 80% nằm ở giữa
    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const defaultCrop = {
            unit: '%',
            width: 100,
            height: 100,
            x: 0,
            y: 0
        };
        setCrop(defaultCrop);
        setPercentCropData(defaultCrop);
    };

    // Hàm cắt ảnh ngầm trên trình duyệt (Dựa trên % để đảm bảo chính xác)
    const getCroppedImgBase64 = () => {
        const image = imgRef.current;
        if (!image || !percentCropData || percentCropData.width === 0 || percentCropData.height === 0) return null;

        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / 100;
        const scaleY = image.naturalHeight / 100;

        // Kích thước thật của canvas
        canvas.width = percentCropData.width * scaleX;
        canvas.height = percentCropData.height * scaleY;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            percentCropData.x * scaleX,
            percentCropData.y * scaleY,
            percentCropData.width * scaleX,
            percentCropData.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        return canvas.toDataURL('image/jpeg');
    };

    const handleSearch = () => {
        if (!imgSrc || selectedParts.length === 0) return alert("Vui lòng chọn ảnh và ít nhất 1 bộ phận");

        const croppedBase64 = getCroppedImgBase64();
        if (!croppedBase64) {
            return Swal.fire({
                icon: 'error',
                title: 'Khoanh vùng không hợp lệ!',
                text: 'Vui lòng kéo khung chọn trên ảnh',
                showConfirmButton: false,
                timer: 1500
            });
        }

        // Gửi tọa độ PHẦN TRĂM (%) sang cho Backend
        const searchParams = {
            parts: selectedParts.join(','),
            bbox_x: percentCropData.x, 
            bbox_y: percentCropData.y, 
            bbox_w: percentCropData.width, 
            bbox_h: percentCropData.height
        };

        navigate(
            { pathname: '/ai-search-results' }, 
            { state: { imageBase64: imgSrc, croppedBase64: croppedBase64 ,...searchParams} }
        );        
        onHide();
    };

    return (
        <Modal show={show} onHide={() => { onHide(); setImgSrc(''); }} size="lg" centered backdrop="static">
            <Modal.Header closeButton className="border-0 bg-light">
                <Modal.Title className="fw-bold text-success d-flex align-items-center">
                    <FaSearch className="me-2"/> Tìm kiếm thực vật bằng ảnh
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <div className="mb-4 text-center">
                    <input type="file" accept="image/*" id="upload-search" className="d-none" onChange={onSelectFile} />
                    <label htmlFor="upload-search" className="btn btn-outline-success border-dashed w-100 py-3">
                        <FaUpload className="me-2"/> Chọn ảnh tải lên
                    </label>
                </div>

                {imgSrc && (
                    <div className="d-flex flex-column align-items-center bg-dark rounded-3 overflow-hidden mb-4 p-2">
                        <span className="text-white-50 small mb-2">Kéo thả khung để khoanh vùng vị trí cần nhận diện</span>
                        <ReactCrop 
                            crop={crop} 
                            onChange={(pixelCrop, percentCrop) => {
                                setCrop(pixelCrop); // Giữ pixelCrop cho thư viện mượt
                                // Nếu có ảnh, tính toán lại % chuẩn xác
                                if (imgRef.current) {
                                    setPercentCropData(convertToPercentCrop(pixelCrop, imgRef.current.width, imgRef.current.height));
                                }
                            }} 
                            aspect={undefined} 
                            className="search-crop-container"
                            minWidth={50}  // 50px
                            minHeight={50} // 50px
                        >
                            <img ref={imgRef} src={imgSrc} alt="Upload" onLoad={onImageLoad} style={{ maxHeight: '400px' }} />
                        </ReactCrop>
                    </div>
                )}

                <div className="mb-2 fw-bold text-muted small">Chọn bộ phận nhận diện (Có thể chọn nhiều)</div>
                <div className="d-flex gap-2">
                    <Badge pill bg={selectedParts.includes('Leaf') ? 'success' : 'light'} text={selectedParts.includes('Leaf') ? 'light' : 'dark'} className="p-3 cursor-pointer border shadow-sm" onClick={() => togglePart('Leaf')}>
                        <FaLeaf className="me-1"/> Lá cây
                    </Badge>
                    <Badge pill bg={selectedParts.includes('Stem') ? 'success' : 'light'} text={selectedParts.includes('Stem') ? 'light' : 'dark'} className="p-3 cursor-pointer border shadow-sm" onClick={() => togglePart('Stem')}>
                        <FaTree className="me-1"/> Thân cây
                    </Badge>
                    <Badge pill bg={selectedParts.includes('Flower') ? 'success' : 'light'} text={selectedParts.includes('Flower') ? 'light' : 'dark'} className="p-3 cursor-pointer border shadow-sm" onClick={() => togglePart('Flower')}>
                        🌸 Hoa
                    </Badge>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0 bg-light">
                <Button variant="success" className="w-100 rounded-pill py-2 fw-bold" onClick={handleSearch} disabled={!imgSrc || selectedParts.length === 0 || !percentCropData}>
                    Bắt đầu trích xuất & Tìm kiếm
                </Button>
            </Modal.Footer>
            
            <style>{`
                .ReactCrop__crop-selection { box-shadow: 0 0 0 9999em rgba(0, 0, 0, 0.6); border: 2px solid #fff; border-radius: 8px; }
                .cursor-pointer { cursor: pointer; transition: all 0.2s; }
                .cursor-pointer:hover { transform: translateY(-2px); }
                .border-dashed { border-style: dashed; border-width: 2px; }
            `}</style>
        </Modal>
    );
};
export default ImageSearchModal;