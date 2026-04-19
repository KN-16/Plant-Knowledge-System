import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaEye, FaImages } from "react-icons/fa";
import "./VarietyCarousel.css"; // Nhớ import file CSS mới

export default function VarietyCarousel({ title, subtitle, data, type }) {
    const varieties = data || []; 
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    const handleItemClick = (id) => {
        navigate(`/varieties/${id}`);
    };

    const handleViewAll = () => {
        // Điều hướng kèm query tùy theo loại carousel
        const query = type === 'popular' ? '?sort=view_count_desc' : '?sort=image_count_desc';
        navigate(`/varieties${query}`);
    };

    return (
        <div className="carousel-container">
            <div className="carousel-title-container">
                <div>
                    {subtitle && <span className="carousel-subtitle">{subtitle}</span>}
                    <h2 className="carousel-title">{title}</h2>
                </div>
                <div className="carousel-view-all" onClick={handleViewAll}>
                    Xem tất cả <FaArrowRight className="ms-2" size={14} />
                </div>
            </div>

            {varieties.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    Chưa có dữ liệu để hiển thị.
                </div>
            ) : (
                <Swiper
                    modules={[Navigation, Autoplay]}
                    slidesPerView={2}
                    spaceBetween={24}
                    navigation
                    loop={varieties.length > 4} // Chỉ loop nếu có nhiều hơn 4 item
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                    className="variety-swiper"
                >      
                    {varieties.slice(0, 10).map((item) => {
                        const imageUrl = item.thumbnail ? `${apiUrl}${item.thumbnail}` : '/default-plant.png';
                        
                        return (
                            <SwiperSlide key={item.variety_id}>
                                <div 
                                    className="carousel-image-wrapper"
                                    onClick={() => handleItemClick(item.variety_id)}
                                >
                                    <img 
                                        src={imageUrl} 
                                        alt={item.common_name} 
                                        className="carousel-image" 
                                    />
                                    <div className="carousel-overlay"></div>
                                    
                                    <div className="carousel-caption-custom">
                                        <h5 className="caption-title">
                                            {item.common_name || item.Species?.vietnamese_name || 'Đang cập nhật'}
                                        </h5>
                                        <p className="caption-subtitle">
                                            {item.Species?.scientific_name} {item.variety_name}
                                        </p>
                                        
                                        <div className="caption-badges">
                                            {type === 'popular' && (
                                                <span className="caption-badge">
                                                    <FaEye className="me-1"/> {item.view_count || 0}
                                                </span>
                                            )}
                                            {type === 'rich-media' && (
                                                <span className="caption-badge">
                                                    <FaImages className="me-1"/> {item.image_count || 0}
                                                </span>
                                            )}
                                            {item.Species?.Genus?.Family?.vietnamese_name && (
                                                <span className="caption-badge text-truncate" style={{maxWidth: '120px'}}>
                                                    {item.Species.Genus.Family.vietnamese_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            )}
        </div>
    );
}