import React from 'react';
import type { EnrolledCourse } from '../../types/course';
import { useNavigate } from 'react-router-dom';

interface ContinueLearningProps {
    courses: EnrolledCourse[];
}

const ContinueLearning: React.FC<ContinueLearningProps> = ({ courses }) => {
    const navigate = useNavigate();

    if (!courses || courses.length === 0) {
        return null; // hide section if no courses
    }

    return (
        <div className="section-container">
            <h2 className="section-title">Continue Learning</h2>

            <div className="course-grid">
                {courses.map((course) => (
                    <div key={course.id} className="glass-card course-card">
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="course-thumbnail"
                            style={{ height: '140px' }}
                        />

                        <div className="course-content">
                            <h3 className="course-title" style={{ fontSize: '15px' }}>{course.title}</h3>
                            <div className="course-instructor">{course.instructor}</div>

                            <div style={{ marginTop: 'auto' }}>
                                <div className="continue-lecture-info">
                                    Lecture {course.currentLecture} / {course.totalLectures}
                                </div>

                                <div className="progress-bar-bg">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${course.progress || 0}%` }}
                                    ></div>
                                </div>

                                <button className="btn-primary" onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/course/${course.id}`);
                                }}>
                                    Resume Learning
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContinueLearning;
