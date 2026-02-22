import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './hooks/useAuthStore';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import PermissionManagementPage from './pages/PermissionManagementPage';
import ProfilePage from './pages/ProfilePage';
import AuditLogPage from './pages/AuditLogPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';

import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import { Toaster } from 'sonner';

const ProtectedRoute = ({ children }) => {
    const { user, loading, fetchMe } = useAuthStore();
    
    useEffect(() => {
        if (!user && localStorage.getItem('access_token')) {
            fetchMe();
        }
    }, [user, fetchMe]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground font-medium animate-pulse text-sm">Authenticating...</p>
            </div>
        </div>
    );

    if (!user && !localStorage.getItem('access_token')) return <Navigate to="/login" />;
    
    return children;
};

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

const App = () => {
    const { theme } = useAuthStore();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <>
            <Toaster position="top-right" richColors />
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
                                <Route path="/audit-logs" element={<AuditLogPage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                <Route path="/help" element={<HelpPage />} />
                                <Route path="/" element={<Navigate to="/dashboard" />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
        </>
    );
};

export default App;
