import { supabase } from './supabaseClient';

export const reviewService = {
    async getReviews(courseId: string) {
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                review_id,
                rating,
                comment,
                created_at,
                user_id,
                users!reviews_user_id_fkey (
                    name
                )
            `)
            .eq('course_id', courseId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reviews:', error.message);
            return [];
        }
        return data;
    },

    async submitReview(courseId: string, userId: string, rating: number, comment: string) {
        const { error } = await supabase
            .from('reviews')
            .insert({
                course_id: courseId,
                user_id: userId,
                rating,
                comment,
                created_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error submitting review:', error.message);
            throw error;
        }
    },

    async hasUserReviewed(courseId: string, userId: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('reviews')
            .select('review_id')
            .eq('course_id', courseId)
            .eq('user_id', userId)
            .maybeSingle();

        if (error) return false;
        return !!data;
    },

    async getAverageRating(courseId: string): Promise<number> {
        const { data, error } = await supabase
            .from('reviews')
            .select('rating')
            .eq('course_id', courseId);

        if (error || !data || data.length === 0) return 0;
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        return Math.round(avg * 10) / 10;
    }
};