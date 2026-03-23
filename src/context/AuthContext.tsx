import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { authService } from '../services/authService';
import type { User as AppUser, UserRole } from '../types';

interface AuthContextType {
    currentUser: AppUser | null;
    userRole: UserRole | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    userRole: null,
    loading: true,
    logout: async () => { },
    refreshProfile: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const isFetching = useRef(false); // 👈 ADD THIS - prevents double fetching

    const fetchAndSetProfile = async (userId: string, mounted: boolean) => {
        // 👇 If already fetching, skip
        if (isFetching.current) return;
        isFetching.current = true;

        try {
            const profile = await authService.getUserProfile(userId);
            if (profile && mounted) {
                setCurrentUser(profile as AppUser);
                setUserRole(profile.role);
            }
        } catch (err) {
            console.warn("Error fetching user profile:", err);
        } finally {
            isFetching.current = false;
        }
    };

    const refreshProfile = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await fetchAndSetProfile(session.user.id, true);
            }
        } catch (error) {
            console.error("Error refreshing profile manually:", error);
        }
    };

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user && mounted) {
                    await fetchAndSetProfile(session.user.id, mounted);
                }
            } catch (err) {
                console.warn("Auth initialization error:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'INITIAL_SESSION') return;

            if (session?.user && mounted) {
                await fetchAndSetProfile(session.user.id, mounted);
            } else if (!session?.user && mounted) {
                setCurrentUser(null);
                setUserRole(null);
                isFetching.current = false; // 👈 Reset on logout
            }

            // 👇 Handle loading on sign in/out events
            if (event === 'SIGNED_OUT' && mounted) setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
        setUserRole(null);
    };

    const value = { currentUser, userRole, loading, logout, refreshProfile };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};