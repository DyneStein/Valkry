import React, { useState, useEffect } from 'react';
import { Swords, Trophy, Target, TrendingUp, Play, ArrowRight, Clock, Award, Flame } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeToUserStats, getUserAchievements, getLeaderboard } from '../services/userStats';

const Dashboard = () => {
    const { user, loading: authLoading } = useAuth();

    // Redirect to sign in if not authenticated
    if (!authLoading && !user) {
        return <Navigate to="/signin" replace />;
    }

    const firstName = user?.name?.split(' ')[0] || 'there';
    const [stats, setStats] = useState(null);
    const [achievements, setAchievements] = useState({});
    const [topPlayers, setTopPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // Subscribe to user stats
        const unsubscribe = subscribeToUserStats(user.id, (userStats) => {
            setStats(userStats);
            setLoading(false);
        });

        // Load achievements
        getUserAchievements(user.id).then(setAchievements);

        // Load top players
        getLeaderboard(3).then(setTopPlayers);

        return () => unsubscribe();
    }, [user]);

    const achievementCount = Object.keys(achievements).length;

    return (
        <div className="page">
            <div className="container" style={{ paddingTop: '56px', paddingBottom: '56px' }}>
                {/* Header */}
                <div style={{ marginBottom: '48px' }}>
                    <p className="caption" style={{ marginBottom: '8px' }}>Dashboard</p>
                    <h1 className="headline">Welcome back, {firstName}.</h1>
                </div>

                {/* Quick Action */}
                <div className="card" style={{
                    padding: '40px',
                    marginBottom: '32px',
                    textAlign: 'center',
                    background: 'linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-secondary) 100%)'
                }}>
                    <h2 className="headline-small" style={{ marginBottom: '8px' }}>
                        Ready for a battle?
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Find an opponent and start competing.
                    </p>
                    <Link to="/arena">
                        <button className="btn btn-primary" style={{ padding: '14px 28px' }}>
                            <Play size={16} />
                            Start playing
                        </button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-4" style={{ marginBottom: '32px' }}>
                    {[
                        { label: 'Battles', value: stats?.battles || 0, icon: Swords },
                        { label: 'Wins', value: stats?.wins || 0, icon: Trophy },
                        { label: 'Win rate', value: `${stats?.winRate || 0}%`, icon: TrendingUp },
                        { label: 'Rating', value: stats?.rating || 1000, icon: Target },
                    ].map((stat, i) => (
                        <div key={i} className="card" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <stat.icon size={16} style={{ color: 'var(--text-tertiary)' }} />
                                <span className="caption">{stat.label}</span>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: '600', letterSpacing: '-0.02em' }}>
                                {loading ? '—' : stat.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Two columns */}
                <div className="grid grid-2">
                    {/* Leaderboard preview */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <span style={{ fontWeight: '600' }}>Top players</span>
                            <Link to="/leaderboard" className="btn btn-secondary" style={{ padding: 0, fontSize: '14px' }}>
                                See all <ArrowRight size={12} />
                            </Link>
                        </div>
                        {topPlayers.length > 0 ? topPlayers.map((p) => (
                            <div key={p.rank} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 0',
                                borderTop: '1px solid var(--border)'
                            }}>
                                <span style={{
                                    width: '24px',
                                    fontSize: '14px',
                                    color: p.rank === 1 ? '#FFD700' : 'var(--text-tertiary)'
                                }}>
                                    {p.rank}
                                </span>
                                {p.avatar ? (
                                    <img
                                        src={p.avatar}
                                        alt={p.name}
                                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '13px' }}>
                                        {p.name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                )}
                                <span style={{ flex: 1, fontWeight: '500', fontSize: '15px' }}>{p.name}</span>
                                <span className="mono" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                    {p.rating?.toLocaleString()}
                                </span>
                            </div>
                        )) : (
                            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                                No players yet
                            </div>
                        )}
                    </div>

                    {/* Your Stats */}
                    <div className="card">
                        <span style={{ fontWeight: '600' }}>Your progress</span>
                        <div style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Rank</span>
                                <span style={{ fontWeight: '600', color: 'var(--accent)' }}>{stats?.rank || 'Bronze'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Current streak</span>
                                <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Flame size={14} style={{ color: 'var(--orange)' }} />
                                    {stats?.currentStreak || 0}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Best streak</span>
                                <span style={{ fontWeight: '600' }}>{stats?.bestStreak || 0}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Achievements</span>
                                <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Award size={14} style={{ color: 'var(--green)' }} />
                                    {achievementCount}/12
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                {achievementCount > 0 && (
                    <div className="card" style={{ marginTop: '24px' }}>
                        <span style={{ fontWeight: '600' }}>Recent achievements</span>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                            {Object.entries(achievements).slice(0, 6).map(([id, a]) => (
                                <div key={id} style={{
                                    padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }}>
                                    <Trophy size={16} style={{ color: 'var(--green)' }} />
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{a.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
