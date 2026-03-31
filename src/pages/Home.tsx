import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CourseCard from '../components/course/CourseCard';
import ContinueLearning from '../components/course/ContinueLearning';
import { useAuth } from '../context/AuthContext';
import type { UICourse, EnrolledCourse } from '../types/course';
import { studentService } from '../services/studentService';
import '../styles/home.css';

const Home: React.FC = () => {
    const { currentUser } = useAuth();

    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [recommendedCourses, setRecommendedCourses] = useState<UICourse[]>([]);
    const [popularCourses, setPopularCourses] = useState<UICourse[]>([]);
    const [categories, setCategories] = useState<{ name: string; icon: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Fetch basic data that don't depend on the user
                const [recommendedData, popularData, categoriesData] = await Promise.all([
                    studentService.getRecommendedCourses(),
                    studentService.getPopularCourses(),
                    studentService.getCategories(),
                ]);

                setRecommendedCourses(recommendedData);
                setPopularCourses(popularData);
                setCategories(categoriesData);

                // Fetch user specific data
                if (currentUser?.id) {
                    const enrolledData = await studentService.getEnrolledCourses(currentUser.id);
                    setEnrolledCourses(enrolledData);
                }
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser?.id]);

    const totalEnrolled = enrolledCourses.length;
    const totalCompleted = enrolledCourses.reduce(
        (acc, curr) => acc + (curr.completedLectures || 0),
        0
    );
    const totalLectures = enrolledCourses.reduce(
        (acc, curr) => acc + (curr.totalLectures || 0),
        0
    );
    const overallProgress = totalLectures > 0
        ? Math.round((totalCompleted / totalLectures) * 100)
        : 0;

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesCourse = (course: { title: string; instructor?: string }) => {
        if (!normalizedQuery) return true;
        return (
            course.title.toLowerCase().includes(normalizedQuery) ||
            (course.instructor || '').toLowerCase().includes(normalizedQuery)
        );
    };

    const matchesCategory = (course: { category?: string }) => {
        if (!selectedCategory) return true;
        return (course.category || '').toLowerCase() === selectedCategory.toLowerCase();
    };

    const filteredEnrolledCourses = useMemo(
        () => enrolledCourses.filter((course) => matchesCourse(course) && matchesCategory(course)),
        [enrolledCourses, normalizedQuery, selectedCategory]
    );

    const filteredRecommendedCourses = useMemo(
        () => recommendedCourses.filter((course) => matchesCourse(course) && matchesCategory(course)),
        [recommendedCourses, normalizedQuery, selectedCategory]
    );

    const filteredPopularCourses = useMemo(
        () => popularCourses.filter((course) => matchesCourse(course) && matchesCategory(course)),
        [popularCourses, normalizedQuery, selectedCategory]
    );

    const hasSearchResults =
        filteredEnrolledCourses.length > 0 ||
        filteredRecommendedCourses.length > 0 ||
        filteredPopularCourses.length > 0;

    if (isLoading) {
        return (
            <div className="home-container">
                <Navbar searchValue={searchQuery} onSearchChange={setSearchQuery} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'white' }}>
                    <h2>Loading dashboard...</h2>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="home-container">
            <Navbar searchValue={searchQuery} onSearchChange={setSearchQuery} />

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
                                <div className="stat-label">{totalCompleted} / {totalLectures} lectures watched</div>
                                <div className="progress-bar-bg" style={{ marginTop: '8px' }}>
                                    <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Continue Learning */}
                {filteredEnrolledCourses.length > 0 && (
                    <div id="continue-learning">
                        <ContinueLearning courses={filteredEnrolledCourses} />
                    </div>
                )}

                {normalizedQuery && !hasSearchResults && (
                    <div className="section-container">
                        <p style={{ color: '#aaa' }}>
                            No courses found for "{searchQuery}".
                        </p>
                    </div>
                )}

                {/* Recommended */}
                <div className="section-container" id="explore">
                    <h2 className="section-title">Recommended for You</h2>
                    {filteredRecommendedCourses.length > 0 ? (
                        <div className="course-grid">
                            {filteredRecommendedCourses.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#aaa' }}>No recommended courses found.</p>
                    )}
                </div>

                {/* Popular Trending */}
                <div className="section-container">
                    <h2 className="section-title">🔥 Popular Courses</h2>
                    {filteredPopularCourses.length > 0 ? (
                        <div className="course-grid">
                            {filteredPopularCourses.map(course => (
                                <CourseCard key={course.id + '-popular'} course={course} />
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#aaa' }}>No popular courses found.</p>
                    )}
                </div>

                {/* Categories */}
                <div className="section-container">
                    <h2 className="section-title">Top Categories</h2>
                    {selectedCategory && (
                        <p style={{ color: '#aaa', marginTop: '-10px', marginBottom: '16px' }}>
                            Filtering by: <strong>{selectedCategory}</strong>{' '}
                            <button
                                type='button'
                                className='nav-link'
                                style={{ border: 'none', background: 'none', padding: 0, marginLeft: '8px' }}
                                onClick={() => setSelectedCategory(null)}
                            >
                                Clear
                            </button>
                        </p>
                    )}
                    {categories.length > 0 ? (
                        <div className="categories-grid">
                            {categories.map((cat, idx) => (
                                <div
                                    key={idx}
                                    className={`glass-card category-card${selectedCategory === cat.name ? ' active' : ''}`}
                                    onClick={() => setSelectedCategory((prev) => (prev === cat.name ? null : cat.name))}
                                    role='button'
                                    aria-label={`Filter by ${cat.name}`}
                                >
                                    <span className="category-icon">{cat.icon}</span>
                                    <div className="category-name">{cat.name}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#aaa' }}>No categories found.</p>
                    )}
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default Home;
