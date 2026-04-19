import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Chỉ cuộn lên đầu khi đổi đường dẫn (pathname)
    // Dùng 'instant' hoặc 'auto' để chuyển trang không bị giật giật
    window.scrollTo({ top: 0, behavior: 'auto' }); 
  }, [pathname]);

  return null;
};

export default ScrollToTop;