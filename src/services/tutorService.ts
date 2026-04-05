import { supabase } from './supabaseClient';
import type { Category, Course, TutorCourseInput } from '../types/course';

const COURSE_SELECT =
    'course_id,title,description,category_id,instructor_id,price,thumbnail_url,created_at,instructors ( users ( name ) ),Categories ( name )';

const normalizeCourse = (row: any): Course => {
    const normalizedInstructor = Array.isArray(row?.instructors) ? row.instructors[0] : row?.instructors;
    const normalizedCategory = Array.isArray(row?.Categories) ? row.Categories[0] : row?.Categories;

    return {
        ...row,
        instructors: normalizedInstructor,
        Categories: normalizedCategory
    } as Course;
};

export const tutorService = {
    async getTutorCourses(tutorId: string): Promise<Course[]> {
        const { data, error } = await supabase
            .from('courses')
            .select(COURSE_SELECT)
            .eq('instructor_id', tutorId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tutor courses:', error.message);
            return [];
        }

        return (data || []).map(normalizeCourse);
    },

    async createCourse(tutorId: string, input: TutorCourseInput): Promise<Course> {
        const { data, error } = await supabase
            .from('courses')
            .insert([
                {
                    title: input.title,
                    description: input.description,
                    category_id: input.category_id,
                    instructor_id: tutorId,
                    price: input.price,
                    thumbnail_url: input.thumbnail_url
                }
            ])
            .select(COURSE_SELECT)
            .single();

        if (error) throw error;
        return normalizeCourse(data);
    },

    async updateCourse(tutorId: string, courseId: string, input: TutorCourseInput): Promise<Course> {
        const { data, error } = await supabase
            .from('courses')
            .update({
                title: input.title,
                description: input.description,
                category_id: input.category_id,
                price: input.price,
                thumbnail_url: input.thumbnail_url
            })
            .eq('course_id', courseId)
            .eq('instructor_id', tutorId)
            .select(COURSE_SELECT)
            .single();

        if (error) throw error;
        return normalizeCourse(data);
    },

    async deleteCourse(tutorId: string, courseId: string): Promise<void> {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('course_id', courseId)
            .eq('instructor_id', tutorId);

        if (error) throw error;
    },

    async getCategories(): Promise<Category[]> {
        const { data, error } = await supabase
            .from('Categories')
            .select('category_id,name,description,created_at')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error.message);
            return [];
        }

        return (data || []) as Category[];
    },

    async getModulesWithLectures(courseId: string): Promise<any[]> {
        const { data, error } = await supabase
            .from('modules')
            .select(`
                module_id,
                course_id,
                module_title,
                order_number,
                lectures (
                    lecture_id,
                    module_id,
                    title,
                    video_url,
                    lecture_type,
                    order_number
                )
            `)
            .eq('course_id', courseId)
            .order('order_number', { ascending: true });

        if (error) throw error;

        return (data || []).map((mod: any) => ({
            ...mod,
            title: mod.module_title,
            lectures: (mod.lectures || []).sort((a: any, b: any) => a.order_number - b.order_number)
        }));
    },

    async createModule(courseId: string, title: string, orderNumber: number) {
        const { data, error } = await supabase
            .from('modules')
            .insert([{ course_id: courseId, module_title: title, order_number: orderNumber }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async createLecture(
        moduleId: string,
        title: string,
        videoUrl: string,
        lectureType: 'upload' | 'youtube',
        orderNumber: number
    ) {
        const { data, error } = await supabase
            .from('lectures')
            .insert([
                {
                    module_id: moduleId,
                    title,
                    video_url: videoUrl,
                    lecture_type: lectureType,
                    order_number: orderNumber
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteModule(moduleId: string) {
        const { error } = await supabase.from('modules').delete().eq('module_id', moduleId);
        if (error) throw error;
    },

    async deleteLecture(lectureId: string) {
        const { data: lectureRow, error: lectureFetchError } = await supabase
            .from('lectures')
            .select('video_url, lecture_type')
            .eq('lecture_id', lectureId)
            .single();

        if (lectureFetchError) throw lectureFetchError;

        const videoUrl = lectureRow?.video_url || '';
        const isUploadedVideo =
            lectureRow?.lecture_type === 'upload' ||
            videoUrl.includes('/storage/v1/object/public/lecture-videos/');

        if (isUploadedVideo && videoUrl) {
            const marker = '/storage/v1/object/public/lecture-videos/';
            const markerIndex = videoUrl.indexOf(marker);

            if (markerIndex !== -1) {
                const encodedPathWithQuery = videoUrl.slice(markerIndex + marker.length);
                const encodedPath = encodedPathWithQuery.split('?')[0];
                const filePath = decodeURIComponent(encodedPath);

                const { error: storageDeleteError } = await supabase.storage
                    .from('lecture-videos')
                    .remove([filePath]);

                if (storageDeleteError) throw storageDeleteError;
            }
        }

        const { error: lectureDeleteError } = await supabase
            .from('lectures')
            .delete()
            .eq('lecture_id', lectureId);

        if (lectureDeleteError) throw lectureDeleteError;
    },

    async updateModule(moduleId: string, updates: { module_title?: string; order_number?: number }) {
        const { error } = await supabase.from('modules').update(updates).eq('module_id', moduleId);
        if (error) throw error;
    },

    async updateLecture(lectureId: string, updates: { title?: string; video_url?: string; order_number?: number }) {
        const { error } = await supabase.from('lectures').update(updates).eq('lecture_id', lectureId);
        if (error) throw error;
    },

    async uploadLectureVideo(file: File, moduleId: string): Promise<string> {
        const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const ext = safeFileName.includes('.') ? safeFileName.split('.').pop() : 'mp4';
        const filePath = moduleId + '/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;

        const { error: uploadError } = await supabase.storage
            .from('lecture-videos')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type || 'video/mp4'
            });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('lecture-videos').getPublicUrl(filePath);
        if (!data?.publicUrl) throw new Error('Failed to create public URL for uploaded video.');

        return data.publicUrl;
    }
};
