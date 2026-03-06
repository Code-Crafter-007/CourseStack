export interface Course {
    id: string;
    title: string;
    instructor: string;
    thumbnail: string;
    rating: number;
    students: number;
    progress?: number;
}

export interface EnrolledCourse extends Course {
    currentLecture: number;
    totalLectures: number;
}
