import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CourseCard from '../components/course/CourseCard';
import ContinueLearning from '../components/course/ContinueLearning';
import { useAuth } from '../context/AuthContext';
import type { Course, EnrolledCourse } from '../types/course';
import '../styles/home.css';

// --- DUMMY DATA ---
const dummyEnrolled: EnrolledCourse[] = [
    {
        id: 'c1',
        title: 'Advanced React patterns & Performance',
        instructor: 'Sarah Drasner',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
        rating: 4.9,
        students: 12450,
        progress: 65,
        currentLecture: 15,
        totalLectures: 42
    },
    {
        id: 'c2',
        title: 'Fullstack Next.js 14 Masterclass',
        instructor: 'Lee Robinson',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
        rating: 4.8,
        students: 8900,
        progress: 12,
        currentLecture: 3,
        totalLectures: 85
    }
];

const dummyRecommended: Course[] = [
    {
        id: 'c3',
        title: 'Mastering TypeScript 5.0 from Scratch',
        instructor: 'Matt Pocock',
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop',
        rating: 4.9,
        students: 45200
    },
    {
        id: 'c4',
        title: 'UI/UX Design for Web Developers',
        instructor: 'Gary Simon',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
        rating: 4.7,
        students: 31050
    },
    {
        id: 'c5',
        title: 'Node.js & Microservices Architecture',
        instructor: 'Stephen Grider',
        thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop',
        rating: 4.8,
        students: 110200
    },
    {
        id: 'c6',
        title: 'Python for Data Science & Machine Learning',
        instructor: 'Jose Portilla',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
        rating: 4.6,
        students: 450000
    }
];

const categories = [
    { name: 'Web Development', icon: '💻' },
    { name: 'Data Science', icon: '📊' },
    { name: 'AI / Machine Learning', icon: '🤖' },
    { name: 'Mobile Development', icon: '📱' },
    { name: 'Cloud & DevOps', icon: '☁️' }
];

const Home: React.FC = () => {
    const { currentUser } = useAuth();

    // Derived stats from dummy data (later fetched from Supabase)
    const totalEnrolled = dummyEnrolled.length;
    const totalCompleted = 0; // placeholder
    const overallProgress = Math.round(dummyEnrolled.reduce((acc, curr) => acc + (curr.progress || 0), 0) / (totalEnrolled || 1));

    return (
        <div className="home-container">
            <Navbar />

            <div className="home-content">
                {/* Hero / Welcome */}
                <div className="hero-section">
                    <h1 className="hero-greeting">
                        Welcome back, {currentUser?.name?.split(' ')[0] || 'Student'} 👋
                    </h1>
                    <p className="hero-subtitle">Continue your learning journey and achieve your goals.</p>

                    <div className="glass-card">
                        <div className="hero-stats">
                            <div className="stat-box">
                                <div className="stat-label">Courses Enrolled</div>
                                <div className="stat-value">{totalEnrolled}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-label">Lectures Completed</div>
                                <div className="stat-value">{totalCompleted}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-label">Overall Progress</div>
                                <div className="stat-value">{overallProgress}%</div>
                                <div className="progress-bar-bg" style={{ marginTop: '8px' }}>
                                    <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Continue Learning */}
                <ContinueLearning courses={dummyEnrolled} />

                {/* Recommended */}
                <div className="section-container">
                    <h2 className="section-title">Recommended for You</h2>
                    <div className="course-grid">
                        {dummyRecommended.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </div>

                {/* Popular Trending */}
                <div className="section-container">
                    <h2 className="section-title">🔥 Popular Courses</h2>
                    <div className="course-grid">
                        {[...dummyRecommended].reverse().slice(0, 3).map(course => (
                            <CourseCard key={course.id + '-popular'} course={course} />
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <div className="section-container">
                    <h2 className="section-title">Top Categories</h2>
                    <div className="categories-grid">
                        {categories.map((cat, idx) => (
                            <div key={idx} className="glass-card category-card">
                                <span className="category-icon">{cat.icon}</span>
                                <div className="category-name">{cat.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default Home;
