import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Swords, Trophy, BookOpen, LayoutDashboard, LogOut } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/arena', label: 'Arena' },
        { to: '/learn', label: 'Learn' },
        { to: '/leaderboard', label: 'Leaderboard' },
        { to: '/about', label: 'About' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            {/* Logo */}
            <Logo />

            {/* Desktop Nav Links */}
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                {navLinks.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
                    >
                        {link.label}
                    </Link>
                ))}

                {user && (
                    <Link
                        to="/dashboard"
                        className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                    >
                        Dashboard
                    </Link>
                )}
            </div>

            {/* User / Auth */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {user ? (
                    <>
                        <Link to="/profile" style={{ textDecoration: 'none' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 12px',
                                background: 'var(--bg-elevated)',
                                borderRadius: '980px',
                                border: '1px solid var(--border)',
                                cursor: 'pointer',
                                transition: 'border-color 0.2s'
                            }}>
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="avatar" style={{ width: '24px', height: '24px', fontSize: '11px' }}>
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    {user.name?.split(' ')[0] || 'User'}
                                </span>
                            </div>
                        </Link>
                        <button
                            onClick={logout}
                            className="btn btn-ghost"
                            style={{ padding: '8px' }}
                            title="Sign out"
                        >
                            <LogOut size={16} />
                        </button>
                    </>
                ) : (
                    <Link to="/signin">
                        <button className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                            Sign In
                        </button>
                    </Link>
                )}

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="btn btn-ghost"
                    style={{ display: 'none', padding: '8px' }}
                >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div style={{
                    position: 'absolute',
                    top: '52px',
                    left: 0,
                    right: 0,
                    background: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'saturate(180%) blur(20px)',
                    borderBottom: '1px solid var(--border)',
                    padding: '16px 22px'
                }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                display: 'block',
                                padding: '12px 0',
                                fontSize: '15px',
                                color: isActive(link.to) ? 'var(--text)' : 'var(--text-secondary)',
                                borderBottom: '1px solid var(--border)'
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {user && (
                        <Link
                            to="/dashboard"
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                display: 'block',
                                padding: '12px 0',
                                fontSize: '15px',
                                color: isActive('/dashboard') ? 'var(--text)' : 'var(--text-secondary)'
                            }}
                        >
                            Dashboard
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
