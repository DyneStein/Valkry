import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Youtube, ArrowRight } from 'lucide-react';
import { getGlobalStats } from '../services/userStats';
import { getCountByDifficulty } from '../data/problems';

const AboutPage = () => {
    const [stats, setStats] = useState({ totalPlayers: 0, totalBattles: 0 });
    const problemStats = getCountByDifficulty();

    useEffect(() => {
        getGlobalStats().then(setStats);
    }, []);

    return (
        <div className="page">
            {/* Hero - Ultra clean Apple style */}
            <section style={{
                minHeight: 'calc(100vh - 52px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 22px'
            }}>
                <p className="caption" style={{ marginBottom: '12px', color: 'var(--accent)' }}>
                    About
                </p>
                <h1 className="headline-super" style={{ marginBottom: '16px' }}>
                    Valkry
                </h1>
                <p className="body-large" style={{ maxWidth: '500px', marginBottom: '0' }}>
                    Real-time competitive programming battles.
                    <br />
                    Solve. Debug. Climb.
                </p>
            </section>

            {/* Stats - Minimal grid */}
            <section style={{ padding: '88px 22px', background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div className="grid grid-3" style={{ textAlign: 'center' }}>
                        <div>
                            <div style={{ fontSize: '48px', fontWeight: '600', letterSpacing: '-0.02em' }}>
                                {stats.totalPlayers || 0}
                            </div>
                            <div className="caption">Players</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '48px', fontWeight: '600', letterSpacing: '-0.02em' }}>
                                {stats.totalBattles || 0}
                            </div>
                            <div className="caption">Battles</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '48px', fontWeight: '600', letterSpacing: '-0.02em' }}>
                                {problemStats.total}+
                            </div>
                            <div className="caption">Problems</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Creator - Clean, centered */}
            <section style={{ padding: '120px 22px' }}>
                <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
                    <img
                        src="/creator.jpg"
                        alt="Muhammad Dyen Asif"
                        style={{
                            width: '280px',
                            height: '300px',
                            borderRadius: '20px',
                            objectFit: 'cover',
                            objectPosition: 'center top',
                            marginBottom: '40px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                            border: '1px solid var(--border)'
                        }}
                    />

                    <h2 className="headline" style={{ marginBottom: '8px' }}>
                        Muhammad Dyen Asif
                    </h2>

                    <p className="caption" style={{ marginBottom: '24px' }}>
                        FAST NUCES
                    </p>

                    <p style={{
                        fontSize: '17px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                        marginBottom: '40px'
                    }}>
                        Built Valkry to explore real-time systems, competitive programming,
                        and modern web development. A passion project combining coding
                        challenges with hands-on Firebase and React experience.
                    </p>

                    {/* Social - Simple icons */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <a
                            href="https://github.com/DyneStein"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'var(--text)';
                                e.currentTarget.style.color = 'var(--bg)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'var(--bg-elevated)';
                                e.currentTarget.style.color = 'var(--text)';
                            }}
                        >
                            <Github size={20} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/dynestein/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#0077b5';
                                e.currentTarget.style.color = '#fff';
                                e.currentTarget.style.borderColor = '#0077b5';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'var(--bg-elevated)';
                                e.currentTarget.style.color = 'var(--text)';
                                e.currentTarget.style.borderColor = 'var(--border)';
                            }}
                        >
                            <Linkedin size={20} />
                        </a>
                        <a
                            href="https://www.youtube.com/@dyenasif6247"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#ff0000';
                                e.currentTarget.style.color = '#fff';
                                e.currentTarget.style.borderColor = '#ff0000';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'var(--bg-elevated)';
                                e.currentTarget.style.color = 'var(--text)';
                                e.currentTarget.style.borderColor = 'var(--border)';
                            }}
                        >
                            <Youtube size={20} />
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA - Minimal */}
            <section style={{
                padding: '88px 22px',
                background: 'var(--bg-secondary)',
                textAlign: 'center'
            }}>
                <h2 className="headline" style={{ marginBottom: '12px' }}>
                    Ready to compete?
                </h2>
                <p className="body-large" style={{ marginBottom: '32px' }}>
                    Join the arena.
                </p>
                <Link to="/arena">
                    <button className="btn btn-primary">
                        Enter Arena <ArrowRight size={14} />
                    </button>
                </Link>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '24px 22px',
                textAlign: 'center',
                borderTop: '1px solid var(--border)'
            }}>
                <span className="caption">
                    Valkry © 2025 · Built with React & Firebase
                </span>
            </footer>
        </div>
    );
};

export default AboutPage;
