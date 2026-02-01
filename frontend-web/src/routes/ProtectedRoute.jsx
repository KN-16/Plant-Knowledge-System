import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/useAuthContext';
import Loading from '../components/common/Loading';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuthContext();
    if (loading) return <Loading fullScreen />;
    if (!user) return <Navigate to="/login" replace />;
    
    return children;
};

export default ProtectedRoute;