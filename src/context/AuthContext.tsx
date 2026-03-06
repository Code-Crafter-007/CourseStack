import React, { createContext, useContext, useEffect, useState } from 'react';
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

    const refreshProfile = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const profile = await authService.getUserProfile(session.user.id);
                if (profile) {
                    setCurrentUser(profile as AppUser);
                    setUserRole(profile.role);
                }
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
                    const profile = await authService.getUserProfile(session.user.id);
                    if (profile && mounted) {
                        setCurrentUser(profile as AppUser);
                        setUserRole(profile.role);
                    }
                }
            } catch (err) {
                console.warn("Auth initialization error:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        // Execute init Auth
        initAuth();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            // Skip INITIAL_SESSION as it's handled by initAuth, preventing double fetching & AbortErrors
            if (event === 'INITIAL_SESSION') return;

            if (session?.user && mounted) {
                try {
                    const profile = await authService.getUserProfile(session.user.id);
                    if (profile && mounted) {
                        setCurrentUser(profile as AppUser);
                        setUserRole(profile.role);
                    }
                } catch (err) {
                    console.warn("Auth state change error:", err);
                }
            } else if (!session?.user && mounted) {
                setCurrentUser(null);
                setUserRole(null);
            }
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

    const value = {
        currentUser,
        userRole,
        loading,
        logout,
        refreshProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
