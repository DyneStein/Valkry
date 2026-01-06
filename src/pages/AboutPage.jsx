import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Youtube, Instagram, ArrowRight } from 'lucide-react';
import { getGlobalStats } from '../services/userStats';
import { getCountByDifficulty } from '../data/problems';

const AboutPage = () => {
    const [stats, setStats] = useState({ totalPlayers: 0, totalBattles: 0 });
    const problemStats = getCountByDifficulty();

    useEffect(() => {
        getGlobalStats().then(setStats);
    }, []);

    // Social link component for reusability
    const SocialLink = ({ href, icon: Icon, hoverBg, label }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.7)',
                transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = hoverBg;
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = hoverBg;
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <Icon size={18} />
        </a>
    );

    // Feature card component - clean numbered style
    const FeatureCard = ({ num, title, description }) => (
        <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'left'
        }}>
            <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.05em',
                marginBottom: '12px',
                display: 'block'
            }}>{num}</span>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>{title}</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>{description}</p>
        </div>
    );

    return (
        <div style={{ background: '#09090b', color: '#fff', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '100px 24px 60px',
                position: 'relative'
            }}>
                {/* Subtle gradient background */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: '800px',
                    height: '400px',
                    background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    animation: 'gradientFadeIn 4s ease-out forwards',
                    opacity: 0
                }} />
                <style>{`
                    @keyframes gradientFadeIn {
                        from { opacity: 0; transform: translateX(-50%) scale(0.9); }
                        to { opacity: 1; transform: translateX(-50%) scale(1); }
                    }
                `}</style>

                <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#818cf8',
                    marginBottom: '16px'
                }}>
                    About
                </span>

                <h1 style={{
                    fontSize: 'clamp(48px, 10vw, 80px)',
                    fontWeight: '700',
                    letterSpacing: '-0.03em',
                    margin: '0 0 20px',
                    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Valkry
                </h1>

                <p style={{
                    fontSize: '18px',
                    color: 'rgba(255,255,255,0.6)',
                    maxWidth: '500px',
                    lineHeight: 1.7,
                    margin: 0
                }}>
                    Real-time competitive programming battles.
                    <br />
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Solve. Debug. Climb.</span>
                </p>
            </section>

            {/* Stats Section */}
            <section style={{
                padding: '60px 24px',
                background: 'rgba(255,255,255,0.02)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '32px',
                        textAlign: 'center'
                    }}>
                        <div>
                            <div style={{
                                fontSize: '42px',
                                fontWeight: '700',
                                letterSpacing: '-0.02em',
                                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {stats.totalPlayers || 0}
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Players</div>
                        </div>
                        <div>
                            <div style={{
                                fontSize: '42px',
                                fontWeight: '700',
                                letterSpacing: '-0.02em',
                                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {stats.totalBattles || 0}
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Battles</div>
                        </div>
                        <div>
                            <div style={{
                                fontSize: '42px',
                                fontWeight: '700',
                                letterSpacing: '-0.02em',
                                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {problemStats.total}+
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Problems</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '80px 24px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '12px' }}>Platform Features</h2>
                        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)' }}>Everything you need to sharpen your competitive programming skills</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        <FeatureCard
                            num="01"
                            title="Real-Time Battles"
                            description="Compete head-to-head with live code execution and instant results. ELO-based matchmaking ensures fair competition."
                        />
                        <FeatureCard
                            num="02"
                            title="Group Battles"
                            description="Host team-based competitions with custom problems. Perfect for classrooms, clubs, or friend groups."
                        />
                        <FeatureCard
                            num="03"
                            title="600+ Problems"
                            description="Curated problem sets across all difficulty levels, from fundamentals to expert-level challenges."
                        />
                        <FeatureCard
                            num="04"
                            title="Global Leaderboard"
                            description="Climb the ranks with our ELO rating system. Track your progress and compare with top performers."
                        />
                        <FeatureCard
                            num="05"
                            title="Control Visualizer"
                            description="Step-by-step C++ execution visualization for learning loops, OOP, inheritance, and polymorphism."
                        />
                        <FeatureCard
                            num="06"
                            title="Secure Judging"
                            description="Server-side code execution with comprehensive test cases. No cheating, no shortcuts."
                        />
                    </div>
                </div>
            </section>

            {/* Creator Section */}
            <section style={{
                padding: '80px 24px',
                background: 'rgba(255,255,255,0.02)',
                borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <span style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.4)',
                        marginBottom: '24px',
                        display: 'block'
                    }}>
                        Created By
                    </span>

                    <img
                        src="/creator.jpg"
                        alt="Muhammad Dyen Asif"
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: '20px',
                            border: '2px solid rgba(255,255,255,0.1)'
                        }}
                    />

                    <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>
                        Muhammad Dyen Asif
                    </h2>

                    <p style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '20px'
                    }}>
                        CS Enthusiast · FAST NUCES
                    </p>

                    <p style={{
                        fontSize: '15px',
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.7,
                        marginBottom: '28px',
                        maxWidth: '450px',
                        margin: '0 auto 28px'
                    }}>
                        Built Valkry to explore real-time systems, competitive programming, and modern web development.
                        A passion project combining coding challenges with React and Firebase.
                    </p>

                    {/* Social Links */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                        <SocialLink
                            href="https://github.com/DyneStein"
                            icon={Github}
                            hoverBg="#333"
                            label="GitHub"
                        />
                        <SocialLink
                            href="https://www.linkedin.com/in/dynestein/"
                            icon={Linkedin}
                            hoverBg="#0077b5"
                            label="LinkedIn"
                        />
                        <SocialLink
                            href="https://www.instagram.com/dyenstien?igsh=MWhnNmdqNDZyejViZw=="
                            icon={Instagram}
                            hoverBg="linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)"
                            label="Instagram"
                        />
                        <SocialLink
                            href="https://www.youtube.com/@dyenasif6247"
                            icon={Youtube}
                            hoverBg="#ff0000"
                            label="YouTube"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '80px 24px',
                textAlign: 'center'
            }}>
                <h2 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '12px' }}>
                    Ready to compete?
                </h2>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', marginBottom: '28px' }}>
                    Join the arena and start your journey.
                </p>
                <Link
                    to="/arena"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#818cf8',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#a5b4fc'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#818cf8'}
                >
                    Enter Arena <ArrowRight size={16} />
                </Link>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '24px',
                textAlign: 'center',
                borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                    Valkry © 2025 · Built with React & Firebase
                </span>
            </footer>
        </div>
    );
};

export default AboutPage;
