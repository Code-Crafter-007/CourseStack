import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Auth from '../pages/Auth';
import Home from '../pages/Home';
import TutorDashboard from '../pages/TutorDashboard';
import AdminPanel from '../pages/AdminPanel';
import type { UserRole } from '../types';
import WishlistPage from '../pages/WishlistPage';   


// Wrapper for routes that require authentication
const ProtectedRoute = ({
    children,
    allowedRoles
}: {
    children: React.ReactNode,
    allowedRoles?: UserRole[]
}) => {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', color: '#fff' }}>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/auth" replace />;
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        // Redirect to their default dashboard if they try to access an unauthorized route
        switch (userRole) {
            case 'student': return <Navigate to="/dashboard" replace />;
            case 'tutor': return <Navigate to="/tutor-dashboard" replace />;
            case 'admin': return <Navigate to="/admin-panel" replace />;
            default: return <Navigate to="/auth" replace />;
        }
    }

    return <>{children}</>;
};

// Root redirect based on role
const RootRedirect = () => {
    const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#000",
            color: "#fff"
        }}>
            Loading...
        </div>
    );
}

    if (!currentUser) return <Navigate to="/auth" replace />;

    switch (userRole) {
        case 'student': return <Navigate to="/dashboard" replace />;
        case 'tutor': return <Navigate to="/tutor-dashboard" replace />;
        case 'admin': return <Navigate to="/admin-panel" replace />;
        default: return <Navigate to="/auth" replace />;
    }
};

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<RootRedirect />} />

            {/* Public Routes */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <Home />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tutor-dashboard"
                element={
                    <ProtectedRoute allowedRoles={['tutor']}>
                        <TutorDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-panel"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminPanel />
                    </ProtectedRoute>
                }
            />

            <Route path="/wishlist" element={<WishlistPage />} />


            {/* Catch-all route */}
            <Route path="*" element={<RootRedirect />} />
        </Routes>
    );
};

export default AppRoutes;
