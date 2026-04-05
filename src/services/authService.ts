import { supabase } from './supabaseClient';
import type { UserRole } from '../types'
export const authService = {
    // Save user profile to public.users table after registration
    async createUserProfile(userId: string, email: string, name: string, role: UserRole, bio: string = '') {
        const { error: userError } = await supabase
            .from('users')
            .insert([
                {
                    user_id: userId,
                    email,
                    name,
                    role,
                },
            ]);

        if (userError) throw userError;

        // If role is tutor, also create an instructor profile
        if (role === 'tutor') {
            const { error: instructorError } = await supabase
                .from('instructors')
                .insert([
                    {
                        instructor_id: userId,
                        bio: bio || null,
                        verified: false,
                    },
                ]);

            if (instructorError) throw instructorError;
        }
    },

    // Fetch the extended user profile (to get the role)
    async getUserProfile(userId: string) {
        console.log("[authService] getUserProfile called for user:", userId);
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', userId)
            .single();
        console.log("[authService] getUserProfile returned data:", data, "error:", error);
        if (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
        return data;
    }
};
