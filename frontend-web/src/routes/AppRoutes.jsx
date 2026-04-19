import { useRoutes, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loading from '../components/common/Loading';
import AdminLayout from '../components/layouts/AdminLayout';
import GuestLayout from '../components/layouts/GuestLayout';
import ProtectedRoute from './ProtectedRoute';


// Lazy Load Pages
const Login = lazy(() => import('../pages/auth/Login'));
const NotFound = lazy(() => import('../pages/NotFound'));
const HomePage = lazy(() => import('../pages/guest/HomePage/index'));
const SpeciesPage = lazy(() => import('../pages/admin/SpeciesPage'));
const GenusPage = lazy(() => import('../pages/admin/GenusPage')); 
const FamilyPage = lazy(() => import('../pages/admin/FamilyPage')); 
const Dashboard = lazy(() => import('../pages/admin/Dashboard')); 
const VarietyPage = lazy(() => import('../pages/admin/VarietyPage'));
const VarietyLibraryPage = lazy(() => import('../pages/guest/VarietyLibraryPage/VarietyLibraryPage'));
const TaxonomyExplorerPage = lazy(() => import('../pages/guest/TaxonomyExplorerPage'));
const VarietyDetailPage = lazy(() => import('../pages/guest/VarietyDetailPage'));
const SearchResultsPage = lazy(() => import('../pages/guest/SearchResultsPage'));
const UserProfile = lazy(() => import('../pages/admin/UserProfile'));
const AccountPage = lazy(() => import('../pages/admin/AccountPage'));


const AppRoutes = () => {
    const elements = useRoutes([
        {
            path: '/',
            element: <GuestLayout />,
            children: [
                { index: true, element: <HomePage /> },
                { path: 'login', element: <Login /> },
                { path: 'varieties', element: <VarietyLibraryPage /> },
                { path: 'taxonomy-explorer', element: <TaxonomyExplorerPage /> },
                { path: 'varieties/:id', element: <VarietyDetailPage /> },
                { path: 'ai-search-results', element: <SearchResultsPage /> },
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
                { path: 'varieties', element: <VarietyPage /> },
                { path: 'profile', element: <UserProfile /> },
                { path: 'users', element: <AccountPage /> },
            ]
        },
        // Not Found
        { path: '*', element: <NotFound /> }
    ]);

    return <Suspense fallback={<Loading fullScreen />}>{elements}</Suspense>;
};

export default AppRoutes;