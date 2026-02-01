// import { BrowserRouter } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import { AppRoutes } from './routes'; // Import từ file index.js vừa tạo
// import { ToastContainer } from 'react-toastify'; // Nếu dùng thông báo toast
// import 'react-toastify/dist/ReactToastify.css';

// function App() {
//     return (
//         <BrowserRouter>
//             <AuthProvider>
//                 {/* Router Logic đã tách riêng */}
//                 <AppRoutes />
                
//                 {/* Global Components như Toast Notification */}
//                 <ToastContainer position="top-right" autoClose={3000} />
//             </AuthProvider>
//         </BrowserRouter>
//     );
// }

// export default App;


import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';

import './assets/css/admin.css';
import './assets/css/guest.css';
function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;