import { supabase } from './supabaseClient';
import type { UICourse, EnrolledCourse } from '../types/course';

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
        const { data, error } = await supabase
            .from('enrollments')
            .select(`
                course_id,
                enrolled_at,
                courses (
                    course_id,
                    title,
                    thumbnail_url,
                    price,
                    instructors (
                        users ( name )
                    )
                )
            `)
            .eq('user_id', studentId);

        if (error) {
            console.error("Error fetching enrolled courses:", error.message);
            return [];
        }

        // Map Supabase response to frontend EnrolledCourse interface
        return (data || []).map(enrollment => {
            const course = enrollment.courses as any;
            if (!course) return null;

            const instructorName = course.instructors?.users?.name || 'Unknown Instructor';

            return {
                id: course.course_id,
                title: course.title,
                instructor: instructorName,
                thumbnail: getThumbnailSrc(course.thumbnail_url),
                rating: 4.5, // Default placeholder
                students: 0,
                currentLecture: 1, // Default placeholder (can be expanded later with user_progress queries)
                totalLectures: 10,
                progress: 0
            };
        }).filter(Boolean) as EnrolledCourse[];
    },

    async getRecommendedCourses(): Promise<UICourse[]> {
        const { data, error } = await supabase
            .from('courses')
            .select(`
                course_id,
                title,
                thumbnail_url,
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
