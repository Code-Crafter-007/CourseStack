import React from 'react';
import type { Course } from '../../types/course';

interface CourseCardProps {
    course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    return (
        <div className="glass-card course-card">
            <img
                src={course.thumbnail}
                alt={course.title}
                className="course-thumbnail"
            />

            <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <div className="course-instructor">{course.instructor}</div>

                <div className="course-meta">
                    <span style={{ color: '#fbbf24', fontWeight: 600 }}>⭐ {course.rating.toFixed(1)}</span>
                    <span>•</span>
                    <span>{course.students.toLocaleString()} students</span>
                </div>

                <button className="btn-primary" onClick={(e) => {
                    e.stopPropagation();
                    console.log('Enroll in', course.title);
                }}>
                    Enroll Now
                </button>
            </div>
        </div>
    );
};

export default CourseCard;
