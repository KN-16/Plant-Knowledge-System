import React, { useState, useEffect } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { FaSearchPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

const AIPartCarousel = ({ images, backendUrl, onImageClick, isModalOpen }) => {
    const [swiperInstance, setSwiperInstance] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (swiperInstance && swiperInstance.autoplay) {
            if (isModalOpen) {
                swiperInstance.autoplay.pause(); 
            } else {
                swiperInstance.autoplay.resume(); 
            }
        }
    }, [isModalOpen, swiperInstance]);

    if (!images || images.length === 0) return (
        <div className="text-muted small fst-italic py-3 bg-light rounded text-center border border-dashed mt-3">
            Chưa tìm thấy dữ liệu tương đồng.
        </div>
    );
        
    return (
        <Swiper
            onSwiper={setSwiperInstance}
            modules={[Navigation, Autoplay]}
            slidesPerView={2}
            spaceBetween={15}
            navigation
            loop={images.length > 4}
            // autoplay={{
            //     delay: 3500,
            //     disableOnInteraction: false,
            //     pauseOnMouseEnter: true, 
            // }}
            breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
            className="mt-4 py-2 px-1"
        >
            {images.map((item, index) => (
            <SwiperSlide key={item.variety_id + '-' + index}>
                <div 
                    className={`position-relative rounded-3 overflow-hidden shadow-sm border cursor-zoom-in group-hover ${index === 0 ? 'border-warning border-2 shadow' : ''}`}
                    style={{ height: '140px' }}
                    onClick={() => onImageClick(`${backendUrl}${item.thumbnail}`)}
                >
                    {index === 0 && (
                        <Badge bg="warning" text="dark" className="position-absolute top-0 start-0 m-2 z-1 shadow px-2 py-1">
                            🔥 Khớp nhất
                        </Badge>
                    )}
                    
                    <img src={`${backendUrl}${item.thumbnail}`} className="w-100 h-100 object-fit-cover transition-transform" alt="part" />
                    
                    {/* Lớp phủ icon kính lúp xuất hiện khi hover */}
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25 opacity-0 icon-zoom transition-opacity z-2">
                        <FaSearchPlus size={28} className="text-white" />
                    </div>
                    
                    {/* Caption thông tin */}
                    <div className="position-absolute bottom-0 start-0 w-100 p-2 bg-gradient-dark text-white shadow-sm z-3">
                        <small className={`caption-similarity badge ${index === 0 ? 'bg-warning text-dark' : 'bg-success'}`}>
                            { (item.similarity * 100).toFixed(2) }% Khớp
                        </small>
                        <div className="text-white small text-truncate fw-bold mt-1">{item.common_name}</div>
                        <Button variant="link" size="sm" className="p-0 text-warning text-decoration-none" onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/varieties/${item.variety_id}`);
                        }}>Xem chi tiết</Button>
                    </div>
                </div>
            </SwiperSlide>
        ))}
        
        <style>{`
            .bg-gradient-dark { background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%); }
            .group-hover { cursor: zoom-in; }
            .group-hover:hover img { transform: scale(1.1); }
            .group-hover:hover .icon-zoom { opacity: 1 !important; }
            .transition-transform { transition: transform 0.3s ease; }
            .transition-opacity { transition: opacity 0.3s ease; }
            
            /* CSS cho Swiper navigation khi disabled */
            .swiper-button-disabled {
                opacity: 0.3 !important;
                cursor: not-allowed !important;
            }
        `}</style>
    </Swiper>
    );
};

export default AIPartCarousel;