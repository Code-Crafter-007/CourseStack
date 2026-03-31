import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';

interface NavbarProps {
    searchValue?: string;
    onSearchChange?: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchValue = '', onSearchChange }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const { wishlist } = useWishlist(currentUser?.id ?? null);  // ← get wishlist count


    const getInitials = (name: string) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    const handleLogout = async () => {
        await logout();
        navigate('/auth');
    };

    return (
        <nav className="navbar">
            <div className="nav-left">
                <a href="#/" className="nav-logo" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
                    Course Stack
                </a>
                <input
                    type="text"
                    placeholder="Search courses..."
                    className="nav-search"
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                />
            </div>

            <div className="nav-right">
                <Link to="/dashboard#explore" className="nav-link">Explore</Link>
                <Link to="/dashboard#continue-learning" className="nav-link">My Learning</Link>
                <Link to="/wishlist" className="nav-link">Bookmarks</Link>

                {/* Wishlist icon with red badge count */}
                <Link to="/wishlist" className="nav-link" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Heart
                        size={22}
                        color={wishlist.length > 0 ? '#f87171' : 'currentColor'}
                        fill={wishlist.length > 0 ? '#f87171' : 'none'}
                    />
                    {wishlist.length > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            background: '#f87171',
                            color: '#fff',
                            borderRadius: '50%',
                            width: 18,
                            height: 18,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 1,
                        }}>
                            {wishlist.length > 99 ? '99+' : wishlist.length}
                        </span>
                    )}
                </Link>

                <Link to="/profile" className="nav-avatar" title="Profile">
                    {getInitials(currentUser?.name || '')}
                </Link>
                <button
                    type="button"
                    className="nav-link"
                    onClick={handleLogout}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
