import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './assets/css/admin.css';
import './assets/css/guest.css';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ScrollToTop />
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;