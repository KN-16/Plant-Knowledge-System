import React, { useState, useEffect } from 'react';
import { Badge} from 'react-bootstrap';
import {  FaSearchPlus } from 'react-icons/fa';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

// =========================================================================
// 1. ĐƯA COMPONENT SWIPER RA NGOÀI (QUAN TRỌNG NHẤT ĐỂ KHÔNG BỊ RESET)
// =========================================================================
const PartImageCarousel = ({ images, backendUrl, onImageClick, isModalOpen }) => {
    const [swiperInstance, setSwiperInstance] = useState(null);

    // Lắng nghe biến isModalOpen để Tạm dừng / Tiếp tục
    useEffect(() => {
        if (swiperInstance && swiperInstance.autoplay) {
            if (isModalOpen) {
                swiperInstance.autoplay.stop(); // Dùng pause() thay vì stop() để giữ nguyên tiến trình
            } else {
                swiperInstance.autoplay.start(); // Dùng resume() để chạy tiếp
            }
        }
    }, [isModalOpen, swiperInstance]);

    if (images.length === 0) return <div className="text-muted small fst-italic py-3 bg-light rounded text-center border border-dashed mt-3">Chưa có dữ liệu hình ảnh cho bộ phận này.</div>;
    
    return (
        <Swiper
            onSwiper={setSwiperInstance}
            modules={[Navigation, Autoplay]}
            slidesPerView={2}
            spaceBetween={15}
            navigation
            loop={images.length > 4}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
            className="mt-4 py-2 px-1"
        >
            {images.map(img => (
                <SwiperSlide key={img.plant_image_id}>
                    <div 
                        className={`position-relative rounded-3 overflow-hidden shadow-sm border cursor-zoom-in group-hover ${img.is_background ? 'border-warning border-2' : ''}`}
                        style={{ height: '140px' }}
                        onClick={() => onImageClick(`${backendUrl}${img.url}`)} // Gọi hàm từ component Cha
                    >
                        {img.is_background && (
                            <Badge bg="warning" text="dark" className="position-absolute top-0 start-0 m-2 z-1 shadow-sm px-2">⭐ Ảnh bìa</Badge>
                        )}
                        <img src={`${backendUrl}${img.url}`} className="w-100 h-100 object-fit-cover transition-transform" alt="part" />
                        <div className="position-absolute top-50 start-50 translate-middle text-white opacity-0 icon-zoom transition-opacity z-2">
                            <FaSearchPlus size={28} />
                        </div>
                        <div className="position-absolute inset-0 bg-dark opacity-0 group-hover-bg transition-opacity z-0 w-100 h-100"></div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default PartImageCarousel;