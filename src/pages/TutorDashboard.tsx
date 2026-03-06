import React from 'react';
import { useAuth } from '../context/AuthContext';

const TutorDashboard: React.FC = () => {
    const { currentUser, logout } = useAuth();

    return (
        <div style={{ padding: '2rem', color: '#fff', background: '#000', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Tutor Dashboard</h1>
                <button onClick={logout} style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', background: '#333', color: '#fff', border: 'none' }}>Logout</button>
            </div>

            <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
                <h2>Hello Instructor, {currentUser?.name}!</h2>
                <p style={{ color: '#888', marginTop: '1rem' }}>Manage your courses, lectures, and students here.</p>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button style={{ padding: '10px 20px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                        + Create New Course
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                    <div style={{ padding: '1.5rem', background: '#222', borderRadius: '8px', border: '1px solid #444' }}>
                        <h3>0</h3>
                        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Active Courses</p>
                    </div>
                    <div style={{ padding: '1.5rem', background: '#222', borderRadius: '8px', border: '1px solid #444' }}>
                        <h3>0</h3>
                        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Total Students</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorDashboard;
