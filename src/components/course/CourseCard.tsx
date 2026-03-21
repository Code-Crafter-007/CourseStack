import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { UICourse } from '../../types/course';

interface CourseCardProps {
    course: UICourse;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const navigate = useNavigate();

    const handleViewCourse = () => {
        navigate(`/course/${course.id}`);
    };

    return (
        <div className="glass-card course-card">
            <img
                src={course.thumbnail}
                alt={course.title}
                className="course-thumbnail"
            />

            <div className="course-content">
                <h3 className="course-title">{course.title}</h3>

                <div className="course-instructor">
                    {course.instructor}
                </div>

                <div className="course-meta">
                    <span style={{ color: '#fbbf24', fontWeight: 600 }}>
                        ⭐ {course.rating.toFixed(1)}
                    </span>

                    <span>•</span>

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