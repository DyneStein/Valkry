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
        { to: '/friends', label: 'Friends' },
        { to: '/leaderboard', label: 'Leaderboard' },
        { to: '/about', label: 'About' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <div style={{ height: '80px' }} /> {/* Spacer */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 40px',
                zIndex: 100,
                pointerEvents: 'none' // Allow clicking through empty space
            }}>
                {/* Logo - Interactive area */}
                <div style={{ pointerEvents: 'auto' }}>
                    <Logo />
                </div>

                {/* Floating Navigation Pill */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px',
                    background: 'rgba(10, 10, 10, 0.6)',
                    backdropFilter: 'saturate(180%) blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '999px',
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
                    pointerEvents: 'auto'
                }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            style={{
                                display: 'block',
                                padding: '10px 20px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: isActive(link.to) ? 'var(--text)' : 'var(--text-secondary)',
                                background: isActive(link.to) ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                                borderRadius: '999px',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={e => {
                                if (!isActive(link.to)) {
                                    e.currentTarget.style.color = 'var(--text)';
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive(link.to)) {
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {user && (
                        <Link
                            to="/dashboard"
                            style={{
                                display: 'block',
                                padding: '10px 20px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: isActive('/dashboard') ? 'var(--text)' : 'var(--text-secondary)',
                                background: isActive('/dashboard') ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                                borderRadius: '999px',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Dashboard
                        </Link>
                    )}
                </div>

                {/* User / Auth - Interactive area */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', pointerEvents: 'auto' }}>
                    {user ? (
                        <>
                            <Link to="/profile" style={{ textDecoration: 'none' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '6px 8px 6px 6px',
                                    background: 'rgba(20, 20, 20, 0.6)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.1s'
                                }}>
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'var(--accent)',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '13px',
                                            fontWeight: '600'
                                        }}>
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', paddingRight: '8px' }}>
                                        {user.name?.split(' ')[0] || 'User'}
                                    </span>
                                </div>
                            </Link>
                            <button
                                onClick={logout}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s'
                                }}
                                title="Sign out"
                            >
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <Link to="/signin">
                            <button className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '999px', fontSize: '14px' }}>
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
        </>
    );
};

export default Navbar;
