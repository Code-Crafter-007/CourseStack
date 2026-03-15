import { supabase } from './supabaseClient';

export const getWishlist = async (userId: string) => {
    const { data, error } = await supabase
        .from('wishlists')
        .select(`
            wishlist_id,
            course_id,
            added_at,
            courses (
                course_id,
                title,
                thumbnail_url,
                price,
                instructor_id
            
            )
        `)
        .eq('user_id', userId)
        .order('added_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const addToWishlist = async (userId: string, courseId: string) => {
    console.log('inserting:', { userId, courseId }); 

    const {data, error } = await supabase
        .from('wishlists')
        .insert({ user_id: userId, course_id: courseId })
        .select();

    console.log('insert result:', { data, error });   



    if (error) throw error;
};

export const removeFromWishlist = async (userId: string, courseId: string) => {
    console.log('deleting:', { userId, courseId });
    const { data, error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .select();

    console.log('delete result:', { data, error });

    if (error) throw error;
};