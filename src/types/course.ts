export interface Category {
    category_id: number;
    name: string;
    description: string;
    created_at: string;
}

export interface User {
    user_id: string;
    name: string;
    email: string;
    role: 'student' | 'tutor' | 'admin';
    created_at: string;
}

export interface Instructor {
    instructor_id: string;
    specialization: string;
    years_of_experience: number;
    created_at: string;
    users?: { name: string }; // joined relation
}

export interface Course {
    course_id: string;
    title: string;
    description: string;
    category_id: number;
    instructor_id: string;
    price: number;
    thumbnail_url: string;
    created_at: string;
    // Joined relations for easy frontend use
    instructors?: { users?: { name: string } };
    Categories?: { name: string };
    _count?: { enrollments: number };
    rating?: number; // Calculated or fetched separately
    students?: number; // Typically derived from enrollments
}

export interface Enrollment {
    enrollment_id: string;
    student_id: string;
    course_id: string;
    enrolled_at: string;
    courses?: Course; // When joined
}

export interface Lecture {
    lecture_id: string;
    module_id: string;
    title: string;
    video_url: string;
    lecture_type: 'upload' | 'youtube';
    order_number: number;
}

export interface UserProgress {
    progress_id: string;
    student_id: string;
    lecture_id: string;
    watched: boolean;
    watched_at: string;
}

// Frontend specific types combining database schema types
export interface EnrolledCourse extends UICourse {
    currentLecture: number;
    totalLectures: number;
    progress: number;
}

// Backward compatibility or simpler components might just use this
export interface UICourse {
    id: string;
    title: string;
    instructor: string;
    thumbnail: string;
    rating: number;
    students: number;
    progress?: number;
}
