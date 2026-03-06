import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

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
                />
            </div>

            <div className="nav-right">
                <a href="#explore" className="nav-link" onClick={(e) => e.preventDefault()}>Explore</a>
                <a href="#my-learning" className="nav-link" onClick={(e) => e.preventDefault()}>My Learning</a>
                <a href="#bookmarks" className="nav-link" onClick={(e) => e.preventDefault()}>Bookmarks</a>

                <div
                    className="nav-avatar"
                    title="Logout"
                    onClick={handleLogout}
                >
                    {getInitials(currentUser?.name || '')}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
