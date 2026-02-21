import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import PermissionManagementPage from './pages/PermissionManagementPage';
import ProfilePage from './pages/ProfilePage';

import Navbar from './components/layout/Navbar';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-shubakar-softBg">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-shubakar-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-shubakar-text animate-pulse font-black uppercase tracking-widest text-xs italic">Syncing Protocols...</p>
            </div>
        </div>
    );
    if (!user) return <Navigate to="/login" />;
    return children;
};

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-shubakar-bg flex flex-col">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
                {children}
            </main>
        </div>
    );
};

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
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
