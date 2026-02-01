import { useRoutes, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loading from '../components/common/Loading';
import AdminLayout from '../components/layouts/AdminLayout';
import GuestLayout from '../components/layouts/GuestLayout';
import ProtectedRoute from './ProtectedRoute';

// Lazy Load Pages
const Login = lazy(() => import('../pages/auth/Login'));
const HomePage = lazy(() => import('../pages/guest/HomePage'));
const SpeciesPage = lazy(() => import('../pages/admin/SpeciesPage'));
const GenusPage = lazy(() => import('../pages/admin/GenusPage')); // Bạn tự tạo file
const FamilyPage = lazy(() => import('../pages/admin/FamilyPage')); // Bạn tự tạo file
const Dashboard = lazy(() => import('../pages/admin/Dashboard')); // Bạn tự tạo file

const AppRoutes = () => {
    const elements = useRoutes([
        {
            path: '/',
            element: <GuestLayout />,
            children: [
                { index: true, element: <HomePage /> },
                { path: 'login', element: <Login /> }
            ]
        },
        {
            path: '/admin',
            element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
            children: [
                { index: true, element: <Navigate to="dashboard" /> },
                { path: 'dashboard', element: <Dashboard /> },
                { path: 'families', element: <FamilyPage /> },
                { path: 'genera', element: <GenusPage /> },
                { path: 'species', element: <SpeciesPage /> },
            ]
        }
    ]);

    return <Suspense fallback={<Loading fullScreen />}>{elements}</Suspense>;
};

export default AppRoutes;