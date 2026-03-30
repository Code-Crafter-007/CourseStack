import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CourseCard from '../components/course/CourseCard';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { studentService } from '../services/studentService';
import type { UICourse, EnrolledCourse } from '../types/course';
import '../styles/profile.css';

const ProfilePage: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const { wishlist } = useWishlist(currentUser?.id ?? null);
    const navigate = useNavigate();

    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [wishlistedCourses, setWishlistedCourses] = useState<UICourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'enrolled' | 'wishlist'>('enrolled');

    useEffect(() => {
       const fetchData = async () => {
    if (!(currentUser as any)?.user_id) {
        setIsLoading(false); // ← add this
        return;
    }
    setIsLoading(true);
    try {
        const enrolled = await studentService.getEnrolledCourses((currentUser as any).user_id);
        setEnrolledCourses(enrolled);
    } catch (err) {
        console.error('Failed to fetch enrolled courses:', err);
    } finally {
        setIsLoading(false);
    }
};
        fetchData();
  }, [(currentUser as any)?.user_id]);

    // Map wishlist items to UICourse shape
    useEffect(() => {
        if (!wishlist || wishlist.length === 0) {
            setWishlistedCourses([]);
            return;
        }
        const mapped: any[] = wishlist
            .filter((item: any) => item.courses)
            .map((item: any) => ({
                id: item.courses.course_id,
                title: item.courses.title,
                thumbnail: item.courses.thumbnail_url ?? '',
                instructor: '',
                students: 0,
                price: item.courses.price ?? 0,
            }));
        setWishlistedCourses(mapped);
    }, [wishlist]);

    const handleLogout = async () => {
        await logout();
        navigate('/auth');
    };

    const joinedDate = currentUser?.created_at
        ? new Date(currentUser.created_at).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
          })
        : '—';

    const initials = currentUser?.name
        ? currentUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    if (isLoading) {
        return (
            <div className="home-container">
                <Navbar />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'white' }}>
                    <h2>Loading profile...</h2>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="home-container">
            <Navbar />

            <div className="home-content">

                {/* Profile Header Card */}
                <div className="profile-hero glass-card">
                    <div className="profile-avatar">
                        {initials}
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">{currentUser?.name || 'Student'}</h1>
                        <p className="profile-email">{currentUser?.email}</p>
                        <div className="profile-badges">
                            <span className="profile-badge role-badge">
                                {currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'Student'}
                            </span>
                            <span className="profile-badge joined-badge">
                                📅 Joined {joinedDate}
                            </span>
                        </div>
                    </div>
                    <button className="profile-logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                {/* Stats Row */}
                <div className="glass-card" style={{ marginBottom: '2rem' }}>
                    <div className="hero-stats">
                        <div className="stat-box">
                            <div className="stat-label">Enrolled Courses</div>
                            <div className="stat-value">{enrolledCourses.length}</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-label">Wishlisted</div>
                            <div className="stat-value">{wishlistedCourses.length}</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-label">Member Since</div>
                            <div className="stat-value" style={{ fontSize: '1.1rem' }}>{joinedDate}</div>
                        </div>
                    </div>
                </div>

                {/* Registration Details */}
                <div className="section-container">
                    <h2 className="section-title">Registration Details</h2>
                    <div className="glass-card profile-details-grid">
                        <div className="profile-detail-item">
                            <span className="detail-label">Full Name</span>
                            <span className="detail-value">{currentUser?.name || '—'}</span>
                        </div>
                        <div className="profile-detail-item">
                            <span className="detail-label">Email Address</span>
                            <span className="detail-value">{currentUser?.email || '—'}</span>
                        </div>
                        <div className="profile-detail-item">
                            <span className="detail-label">Account Role</span>
                            <span className="detail-value" style={{ textTransform: 'capitalize' }}>{currentUser?.role || '—'}</span>
                        </div>
                        <div className="profile-detail-item">
                            <span className="detail-label">Member Since</span>
                            <span className="detail-value">{joinedDate}</span>
                        </div>
                        <div className="profile-detail-item">
                            <span className="detail-label">User ID</span>
                            <span className="detail-value" style={{ fontSize: '0.78rem', opacity: 0.6 }}>{currentUser?.id || '—'}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs — Enrolled & Wishlist */}
                <div className="section-container">
                    <div className="profile-tabs">
                        <button
                            className={`profile-tab-btn ${activeTab === 'enrolled' ? 'active' : ''}`}
                            onClick={() => setActiveTab('enrolled')}
                        >
                            📚 Enrolled Courses ({enrolledCourses.length})
                        </button>
                        <button
                            className={`profile-tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
                            onClick={() => setActiveTab('wishlist')}
                        >
                            ❤️ Wishlist ({wishlistedCourses.length})
                        </button>
                    </div>

                    {activeTab === 'enrolled' && (
                        <div>
                            {enrolledCourses.length > 0 ? (
                                <div className="course-grid">
                                    {enrolledCourses.map((course) => (
                                        <CourseCard key={course.id} course={course} />
                                    ))}
                                </div>
                            ) : (
                                <div className="profile-empty-state">
                                    <span>📭</span>
                                    <p>You haven't enrolled in any courses yet.</p>
                                    <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                                        Browse Courses
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'wishlist' && (
                        <div>
                            {wishlistedCourses.length > 0 ? (
                                <div className="course-grid">
                                    {wishlistedCourses.map((course) => (
                                        <CourseCard key={course.id} course={course} />
                                    ))}
                                </div>
                            ) : (
                                <div className="profile-empty-state">
                                    <span>🤍</span>
                                    <p>Your wishlist is empty. Heart a course to save it!</p>
                                    <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                                        Explore Courses
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default ProfilePage;