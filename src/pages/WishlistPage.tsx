import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const WishlistPage: React.FC = () => {
    const { currentUser } = useAuth();           
    const { wishlist, loading, remove } = useWishlist(currentUser?.id ?? null);
    const navigate = useNavigate();

    if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Heart size={24} color="#f87171" fill="#f87171" />
                My Wishlist ({wishlist.length})
            </h1>

            {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.6 }}>
                    <p style={{ marginBottom: '1rem' }}>Your wishlist is empty.</p>
                    <button className="btn-primary" onClick={() => navigate('/')}>
                        Browse Courses
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {wishlist.map((item) => (
                        <div key={item.wishlist_id} className="glass-card"
                            style={{ display: 'flex', gap: '1rem', padding: '1rem', alignItems: 'center' }}>
                            <img
                                src={item.courses.thumbnail}
                                alt={item.courses.title}
                                style={{ width: 140, height: 85, objectFit: 'cover', borderRadius: 8 }}
                            />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 600, marginBottom: 4 }}>{item.courses.title}</h3>
                                <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: 4 }}>{item.courses.instructor}</p>
                                <span style={{ color: '#fbbf24' }}>⭐ {item.courses.rating?.toFixed(1)}</span>
                                <span style={{ marginLeft: 12, opacity: 0.6, fontSize: '0.85rem' }}>
                                    {item.courses.students?.toLocaleString()} students
                                </span>
                            </div>
                            <button
                                onClick={() => remove(item.course_id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: 8 }}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;