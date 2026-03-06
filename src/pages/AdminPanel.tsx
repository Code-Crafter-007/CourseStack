import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminPanel: React.FC = () => {
    const { currentUser, logout } = useAuth();

    return (
        <div style={{ padding: '2rem', color: '#fff', background: '#000', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Command Center</h1>
                <button onClick={logout} style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', background: '#e03131', color: '#fff', border: 'none', fontWeight: 'bold' }}>Logout</button>
            </div>

            <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
                <h2>Platform Administrator: {currentUser?.name}</h2>
                <p style={{ color: '#888', marginTop: '1rem' }}>Oversee platform operations, approve tutors, and manage content moderation.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                    <div style={{ padding: '1.5rem', background: '#222', borderRadius: '8px', border: '1px solid #444' }}>
                        <h3>Users</h3>
                        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Manage all registered users</p>
                    </div>
                    <div style={{ padding: '1.5rem', background: '#222', borderRadius: '8px', border: '1px solid #444' }}>
                        <h3>Instructors</h3>
                        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Review instructor applications</p>
                    </div>
                    <div style={{ padding: '1.5rem', background: '#222', borderRadius: '8px', border: '1px solid #444' }}>
                        <h3>Courses</h3>
                        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Content moderation and removal</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
