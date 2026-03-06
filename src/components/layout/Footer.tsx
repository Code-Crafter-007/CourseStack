import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-col">
                    <h4 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Course Stack</h4>
                    <p>Empowering learners worldwide through modern, accessible, and high-quality educational content taught by industry experts.</p>
                </div>

                <div className="footer-col">
                    <h4>Platform</h4>
                    <a href="#!">Browse Courses</a>
                    <a href="#!">Become a Tutor</a>
                    <a href="#!">Pricing</a>
                    <a href="#!">Enterprise</a>
                </div>

                <div className="footer-col">
                    <h4>Resources</h4>
                    <a href="#!">Community</a>
                    <a href="#!">Help Center</a>
                    <a href="#!">Blog</a>
                    <a href="#!">Guidelines</a>
                </div>

                <div className="footer-col">
                    <h4>Company</h4>
                    <a href="#!">About Us</a>
                    <a href="#!">Careers</a>
                    <a href="#!">Contact</a>
                    <a href="#!">Partners</a>
                </div>
            </div>

            <div className="footer-bottom">
                <div>&copy; {new Date().getFullYear()} Course Stack. All rights reserved.</div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <a href="#!" style={{ color: '#666', textDecoration: 'none' }}>Privacy Policy</a>
                    <a href="#!" style={{ color: '#666', textDecoration: 'none' }}>Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
