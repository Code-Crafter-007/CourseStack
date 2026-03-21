import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UICourse } from '../../types/course';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { reviewService } from '../../services/reviewService';



interface CourseCardProps {
    course: UICourse;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const { currentUser } = useAuth();
    const { isWishlisted, add, remove } = useWishlist(currentUser?.id ?? null);
    const wishlisted = isWishlisted(course.id);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!currentUser) return alert('Please log in');
        wishlisted ? remove(course.id) : add(course.id);
    };
    const navigate = useNavigate();
    const [avgRating, setAvgRating] = useState<number | null>(null);

    useEffect(() => {
        reviewService.getAverageRating(course.id).then((rating) => {
            setAvgRating(rating);
        });
    }, [course.id]);

const displayRating = avgRating !== null && avgRating > 0
        ? avgRating.toFixed(1)
        : null;

    const handleViewCourse = () => {
        navigate(`/course/${course.id}`);
    };

    return (
        <div className="glass-card course-card">
            <div style={{ position: 'relative' }}>
                <img src={course.thumbnail} alt={course.title} className="course-thumbnail" />
                <button onClick={handleToggle} style={{
                    position: 'absolute', top: 8, right: 8,
                    background: wishlisted ? 'rgba(0,0,0,0.5)': 'rgba(0,0,0,0.5)', border: 'none',
                    borderRadius: '50%', width: 34, height: 34,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer',
                    transition: 'background 0.2s',

                }}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}

                >
                    <Heart size={18}
                        color="#f87171"
                        fill={wishlisted ? '#f87171' : 'none'} 
                        style={{transition : "fill 0.2s"}}
                    />
                </button>
            </div>


            <div className="course-content">
                <h3 className="course-title">{course.title}</h3>

                <div className="course-instructor">
                    {course.instructor}
                </div>

                <div className="course-meta">
                    {displayRating ? (
                        <>
                            <span style={{ color: '#fbbf24', fontWeight: 600 }}>
                                ⭐ {displayRating}
                            </span>
                            <span>•</span>
                        </>
                    ) : (
                        <>
                            <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>
                                No ratings yet
                            </span>
                            <span>•</span>
                        </>
                    )}
                    <span>
                        {course.students.toLocaleString()} students
                    </span>
                </div>

                <button
                    className="btn-primary"
                    onClick={handleViewCourse}
                >
                    View Course
                </button>
            </div>
        </div>
    );
};

export default CourseCard;