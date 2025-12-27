import React, { useState, useEffect } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGlobalStats } from '../services/userStats';
import { getCountByDifficulty } from '../data/problems';

const LandingPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ totalPlayers: 0, totalBattles: 0 });
    const problemStats = getCountByDifficulty();

    useEffect(() => {
        getGlobalStats().then(setStats);
    }, []);

    return (
        <div className="page">
            {/* Hero - Apple centered style */}
            <section style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 52px)',
                textAlign: 'center',
                padding: '0 22px'
            }}>
                <p className="caption" style={{ marginBottom: '16px', color: 'var(--accent)' }}>
                    Introducing Valkry
                </p>

                <h1 className="headline-super" style={{ maxWidth: '800px', marginBottom: '16px' }}>
                    Code. Battle. Dominate.
                </h1>

                <p className="body-large" style={{ maxWidth: '500px', marginBottom: '32px' }}>
                    Solve. Debug. Compete. Climb the global leaderboard.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <Link to={user ? "/arena" : "/signin"}>
                        <button className="btn btn-primary">
                            {user ? 'Enter Arena' : 'Get started'}
                        </button>
                    </Link>
                    <Link to="/leaderboard" className="btn btn-secondary">
                        View rankings <ArrowRight size={14} />
                    </Link>
                </div>
            </section>

            {/* Features - Apple grid style */}
            <section style={{
                padding: '88px 22px',
                background: 'var(--bg-secondary)'
            }}>
                <div className="container">
                    <h2 className="headline" style={{ textAlign: 'center', marginBottom: '12px' }}>
                        How it works.
                    </h2>
                    <p className="body-large" style={{ textAlign: 'center', marginBottom: '56px' }}>
                        Three steps to start competing.
                    </p>

                    <div className="grid grid-3" style={{ gap: '30px' }}>
                        {[
                            { num: '01', title: 'Match', desc: 'Join the queue and get paired with a similar skill player.' },
                            { num: '02', title: 'Code', desc: 'Solve the problem or fix the bug before your opponent.' },
                            { num: '03', title: 'Rise', desc: 'Win battles to earn points and climb the leaderboard.' }
                        ].map((item, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '48px',
                                    fontWeight: '600',
                                    color: 'var(--text-tertiary)',
                                    marginBottom: '16px'
                                }}>
                                    {item.num}
                                </div>
                                <h3 className="headline-small" style={{ marginBottom: '8px' }}>
                                    {item.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.5 }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section style={{ padding: '88px 22px' }}>
                <div className="container">
                    <div className="grid grid-3" style={{ textAlign: 'center' }}>
                        <div>
                            <div style={{ fontSize: '56px', fontWeight: '600', letterSpacing: '-0.02em' }}>
                                {stats.totalPlayers || 0}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Players worldwide</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '56px', fontWeight: '600', letterSpacing: '-0.02em' }}>
                                {stats.totalBattles || 0}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Battles completed</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '56px', fontWeight: '600', letterSpacing: '-0.02em' }}>
                                {problemStats.total}+
                            </div>
                            <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Problems available</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{
                padding: '88px 22px',
                background: 'var(--bg-secondary)',
                textAlign: 'center'
            }}>
                <h2 className="headline" style={{ marginBottom: '12px' }}>
                    Ready to compete?
                </h2>
                <p className="body-large" style={{ marginBottom: '32px' }}>
                    Join the arena. It's free.
                </p>
                <Link to={user ? "/arena" : "/signin"}>
                    <button className="btn btn-primary">
                        Start now <ArrowRight size={14} />
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
                    Valkry © 2025
                </span>
            </footer>
        </div>
    );
};

export default LandingPage;
