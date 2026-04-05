import { supabase } from './supabaseClient';
import type { UICourse, EnrolledCourse } from '../types/course';

const ENROLLMENT_SELECT = `
    course_id,
    enrolled_at,
    courses (
        course_id,
        title,
        thumbnail_url,
        price,
        Categories ( name ),
        instructors (
            users ( name )
        )
    )
`;

const getCategoryName = (course: any): string | undefined => {
    const raw = course?.Categories;
    if (Array.isArray(raw)) {
        return raw[0]?.name;
    }
    return raw?.name;
};

const getThumbnailSrc = (thumbnailUrl?: string | null): string => {
    if (!thumbnailUrl) {
        return 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop';
    }
    if (/^https?:\/\//i.test(thumbnailUrl) || thumbnailUrl.startsWith('/')) {
        return thumbnailUrl;
    }
    return `/images/${thumbnailUrl}`;
};

export const studentService = {
    async getEnrolledCourses(studentId: string): Promise<EnrolledCourse[]> {
        const loadEnrollments = async (column: 'user_id' | 'student_id') => {
            return supabase.from('enrollments').select(ENROLLMENT_SELECT).eq(column, studentId);
        };

        let { data: enrollments, error: enrollmentError } = await loadEnrollments('user_id');

        if (enrollmentError) {
            const retry = await loadEnrollments('student_id');
            enrollments = retry.data;
            enrollmentError = retry.error;
        }

        if (enrollmentError) {
            console.error('Error fetching enrolled courses:', enrollmentError.message);
            return [];
        }

        const safeEnrollments = enrollments || [];
        const courseIds = safeEnrollments
            .map((enrollment: any) => enrollment?.course_id)
            .filter((courseId: string | null | undefined): courseId is string => Boolean(courseId));

        const totalLecturesByCourse = new Map<string, number>();
        const lectureToCourse = new Map<string, string>();

        courseIds.forEach((courseId) => totalLecturesByCourse.set(courseId, 0));

        if (courseIds.length > 0) {
            const { data: moduleRows, error: moduleError } = await supabase
                .from('modules')
                .select('course_id,lectures ( lecture_id )')
                .in('course_id', courseIds);

            if (moduleError) {
                console.error('Error fetching modules/lectures for progress:', moduleError.message);
            } else {
                (moduleRows || []).forEach((moduleRow: any) => {
                    const courseId = moduleRow?.course_id as string | undefined;
                    if (!courseId) return;

                    const lectures = Array.isArray(moduleRow?.lectures) ? moduleRow.lectures : [];

                    lectures.forEach((lecture: any) => {
                        const lectureId = lecture?.lecture_id as string | undefined;
                        if (!lectureId) return;

                        lectureToCourse.set(lectureId, courseId);
                        totalLecturesByCourse.set(courseId, (totalLecturesByCourse.get(courseId) || 0) + 1);
                    });
                });
            }
        }

        const fetchWatchedLectureIds = async (column: 'user_id' | 'student_id'): Promise<string[]> => {
            const withWatchedFilter = await supabase
                .from('user_progress')
                .select('lecture_id,watched')
                .eq(column, studentId)
                .eq('watched', true);

            if (!withWatchedFilter.error) {
                return (withWatchedFilter.data || [])
                    .map((row: any) => row?.lecture_id)
                    .filter((lectureId: string | null | undefined): lectureId is string => Boolean(lectureId));
            }

            const fallbackWithoutWatched = await supabase
                .from('user_progress')
                .select('lecture_id')
                .eq(column, studentId);

            if (fallbackWithoutWatched.error) {
                throw fallbackWithoutWatched.error;
            }

            return (fallbackWithoutWatched.data || [])
                .map((row: any) => row?.lecture_id)
                .filter((lectureId: string | null | undefined): lectureId is string => Boolean(lectureId));
        };

        let watchedLectureIds: string[] = [];
        try {
            watchedLectureIds = await fetchWatchedLectureIds('user_id');
        } catch {
            try {
                watchedLectureIds = await fetchWatchedLectureIds('student_id');
            } catch (progressError: any) {
                console.error('Error fetching user progress:', progressError?.message || progressError);
            }
        }

        const completedByCourse = new Map<string, number>();

        watchedLectureIds.forEach((lectureId) => {
            const courseId = lectureToCourse.get(lectureId);
            if (!courseId) return;
            completedByCourse.set(courseId, (completedByCourse.get(courseId) || 0) + 1);
        });

        return safeEnrollments
            .map((enrollment: any) => {
                const course = enrollment?.courses as any;
                if (!course) return null;

                const courseId = course.course_id as string;
                const instructorName = course.instructors?.users?.name || 'Unknown Instructor';
                const totalLectures = totalLecturesByCourse.get(courseId) || 0;
                const completedLectures = Math.min(completedByCourse.get(courseId) || 0, totalLectures);
                const progress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
                const currentLecture = totalLectures > 0 ? Math.min(completedLectures + 1, totalLectures) : 0;

                return {
                    id: courseId,
                    title: course.title,
                    instructor: instructorName,
                    thumbnail: getThumbnailSrc(course.thumbnail_url),
                    category: getCategoryName(course),
                    rating: 4.5,
                    students: 0,
                    currentLecture,
                    totalLectures,
                    completedLectures,
                    progress
                };
            })
            .filter(Boolean) as EnrolledCourse[];
    },

    async getRecommendedCourses(): Promise<UICourse[]> {
        const { data, error } = await supabase
            .from('courses')
            .select(`
                course_id,
                title,
                thumbnail_url,
                Categories ( name ),
                instructors (
                    users ( name )
                )
            `)
            .limit(4);

        if (error) {
            console.error("Error fetching recommended courses:", error.message);
            return [];
        }

        return (data || []).map(course => ({
            id: course.course_id,
            title: course.title,
            instructor: (course.instructors as any)?.users?.name || 'Unknown Instructor',
            thumbnail: getThumbnailSrc(course.thumbnail_url),
            category: getCategoryName(course),
            rating: 4.7,
            students: Math.floor(Math.random() * 1000) // Placeholder
        }));
    },

    async getPopularCourses(): Promise<UICourse[]> {
        const { data, error } = await supabase
            .from('courses')
            .select(`
                course_id,
                title,
                thumbnail_url,
                Categories ( name ),
                instructors (
                    users ( name )
                )
            `)
            .order('created_at', { ascending: false })
            .limit(3);
            
        if (error) {
            console.error("Error fetching popular courses:", error.message);
            return [];
        }

        return (data || []).map(course => ({
            id: course.course_id,
            title: course.title,
            instructor: (course.instructors as any)?.users?.name || 'Unknown Instructor',
            thumbnail: getThumbnailSrc(course.thumbnail_url),
            category: getCategoryName(course),
            rating: 4.9,
            students: Math.floor(Math.random() * 5000)
        }));
    },

    async getCategories(): Promise<{ name: string; icon: string }[]> {
        const { data, error } = await supabase
            .from('Categories')
            .select('name');

        if (error) {
            console.error("Error fetching categories:", error.message);
            return [];
        }

        const icons = ['💻', '📊', '🤖', '📱', '☁️', '🎨', '💼', '🚀'];

        return (data || []).map((cat, index) => ({
            name: cat.name,
            icon: icons[index % icons.length]
        }));
    }
};
