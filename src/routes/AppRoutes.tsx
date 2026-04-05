import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Auth from '../pages/Auth';
import Home from '../pages/Home';
import TutorDashboard from '../pages/TutorDashboard';
import AdminPanel from '../pages/AdminPanel';
import CourseDetail from '../pages/CourseDetail';
import WishlistPage from '../pages/WishlistPage';
import ProfilePage from '../pages/ProfilePage';

import type { UserRole } from '../types';



// ✅ Protected Route
const ProtectedRoute = ({
    children,
    allowedRoles
}: {
    children: React.ReactNode,
    allowedRoles?: UserRole[]
}) => {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', color: '#fff' }}>
                Loading...
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/auth" replace />;
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        switch (userRole) {
            case 'student': return <Navigate to="/dashboard" replace />;
            case 'tutor': return <Navigate to="/tutor-dashboard" replace />;
            case 'admin': return <Navigate to="/admin-panel" replace />;
            default: return <Navigate to="/auth" replace />;
        }
    }

    return <>{children}</>;
};

// ✅ Root redirect based on role
const RootRedirect = () => {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#000", color: "#fff" }}>
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

// ✅ Main Routes
const AppRoutes: React.FC = () => {

    return (
        <Routes>
            {/* Root */}
            <Route path="/" element={<RootRedirect />} />

            {/* Public */}
            <Route path="/auth" element={<Auth />} />

            {/* Student Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <Home />
                    </ProtectedRoute>
                }
            />

            {/* Student Course Detail */}
            <Route
                path="/course/:courseId"
                element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <CourseDetail />
                    </ProtectedRoute>
                }
            />

            {/* Tutor Dashboard */}
            <Route
                path="/tutor-dashboard"
                element={
                    <ProtectedRoute allowedRoles={['tutor']}>
                        <TutorDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Admin Panel */}
            <Route
                path="/admin-panel"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminPanel />
                    </ProtectedRoute>
                }
            />

            {/* Wishlist */}
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* Profile */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />

            {/* Catch all */}
            <Route path="*" element={<RootRedirect />} />
        </Routes>
    );
};

export default AppRoutes;