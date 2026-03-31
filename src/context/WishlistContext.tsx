import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist } from '../services/wishlistsService';
import { useAuth } from './AuthContext';

interface WishlistContextType {
    wishlist: any[];
    wishlistedIds: Set<string>;
    loading: boolean;
    add: (courseId: string) => Promise<void>;
    remove: (courseId: string) => Promise<void>;
    isWishlisted: (courseId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({
    wishlist: [],
    wishlistedIds: new Set(),
    loading: false,
    add: async () => {},
    remove: async () => {},
    isWishlisted: () => false,
});

export const useWishlist = (_userId?: string | null) => useContext(WishlistContext);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const userId = (currentUser as any)?.user_id ?? null; // ← reads actual DB value without changing types

    const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = useCallback(async () => {
        if (!userId) {
            setWishlist([]);
            setWishlistedIds(new Set());
            return;
        }
        setLoading(true);
        try {
            const data = await getWishlist(userId);
            setWishlist(data ?? []);
            setWishlistedIds(new Set(data?.map((item: any) => item.course_id)));
        } catch (err) {
            console.error('Failed to fetch wishlist:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const add = async (courseId: string) => {
        if (!userId) {
                    console.log(' userId is null');

            return;
}
    console.log(' adding:', { userId, courseId });  

        setWishlistedIds(prev => new Set(prev).add(courseId));
        try {
            await addToWishlist(userId, courseId);
            console.log(' insert success');              

            await fetchWishlist();
        } catch(err) {
             console.log(' insert failed:', err);        

            setWishlistedIds(prev => { const s = new Set(prev); s.delete(courseId); return s; });
        }
    };

    const remove = async (courseId: string) => {
        if (!userId) return;
        setWishlistedIds(prev => { const s = new Set(prev); s.delete(courseId); return s; });
        setWishlist(prev => prev.filter(item => item.course_id !== courseId));
        try {
            await removeFromWishlist(userId, courseId);
        } catch {
            await fetchWishlist();
        }
    };

    const isWishlisted = (courseId: string) => wishlistedIds.has(courseId);

    useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

    return (
        <WishlistContext.Provider value={{ wishlist, wishlistedIds, loading, add, remove, isWishlisted }}>
            {children}
        </WishlistContext.Provider>
    );
};