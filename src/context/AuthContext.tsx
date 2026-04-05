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

    const fetchAndSetProfile = async (userId: string, isMounted: () => boolean) => {
        console.log("[AuthContext] fetchAndSetProfile called for user:", userId);
        try {
            console.log("[AuthContext] Requesting profile from authService...");
            const profile = await authService.getUserProfile(userId);
            console.log("[AuthContext] Received profile:", profile);

            if (profile && isMounted()) {
                const normalizedProfile = {
                    ...profile,
                    id: (profile as any).id ?? (profile as any).user_id ?? userId
                };
                console.log("[AuthContext] Setting currentUser and userRole...", normalizedProfile);
                setCurrentUser(normalizedProfile as AppUser);
                setUserRole(profile.role);
            } else {
                console.log("[AuthContext] Skipping set state. profile exists?", !!profile, "isMounted?", isMounted());
            }
        } catch (err) {
            console.warn("[AuthContext] Error fetching user profile:", err);
        }
    };

    const refreshProfile = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await fetchAndSetProfile(session.user.id, () => true);
            }
        } catch (error) {
            console.error("Error refreshing profile manually:", error);
        }
    };

    useEffect(() => {
        console.log("[AuthContext] Initializing useEffect...");
        let mounted = true;
        const isMounted = () => mounted;

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("[AuthContext] onAuthStateChange event:", event);

            if (session?.user) {
                console.log("[AuthContext] User found. Queuing profile fetch via macro-task to prevent lock deadlock...");
                setTimeout(async () => {
                    await fetchAndSetProfile(session.user.id, isMounted);
                    // ONLY set loading to false AFTER the profile has been fully fetched and set!
                    if (isMounted()) {
                        console.log("[AuthContext] Setting loading to false after profile fetch");
                        setLoading(false);
                    }
                }, 0);
            } else {
                console.log("[AuthContext] No user found. Clearing state...");
                if (isMounted()) {
                    setCurrentUser(null);
                    setUserRole(null);
                    console.log("[AuthContext] Setting loading to false (no user)");
                    setLoading(false);
                }
            }
        });

        // Safe fallback ONLY if onAuthStateChange fails to fire within 1 second.
        // This avoids overlapping getSession() deadlocks during the exact tick the client initializes.
        const watchdog = setTimeout(() => {
            if (isMounted() && loading) {
                console.log("[AuthContext] Watchdog triggered. Falling back to getSession()...");
                supabase.auth.getSession().then(({ data: { session } }) => {
                    if (session?.user) {
                        fetchAndSetProfile(session.user.id, isMounted).then(() => {
                            if (isMounted()) setLoading(false);
                        });
                    } else {
                        if (isMounted()) setLoading(false);
                    }
                });
            }
        }, 1000);

        return () => {
            console.log("[AuthContext] Cleaning up...");
            mounted = false;
            clearTimeout(watchdog);
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
            {children}
        </AuthContext.Provider>
    );
};