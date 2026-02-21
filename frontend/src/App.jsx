import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/layout/Sidebar';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import PermissionManagementPage from './pages/PermissionManagementPage';
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
};

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Routes>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/employees" element={<EmployeeListPage />} />
                                <Route path="/employees/new" element={<EmployeeFormPage />} />
                                <Route path="/employees/edit/:id" element={<EmployeeFormPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/permissions" element={<PermissionManagementPage />} />
                                <Route path="/" element={<Navigate to="/dashboard" />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default App;
