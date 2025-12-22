import React, { useState, useEffect } from 'react';
import { Search, Crown, Flame, Award, Users, TrendingUp } from 'lucide-react';
import { subscribeToLeaderboard, getGlobalStats } from '../services/userStats';
import { useAuth } from '../context/AuthContext';

const LeaderboardPage = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [players, setPlayers] = useState([]);
    const [globalStats, setGlobalStats] = useState({ totalPlayers: 0, battlesToday: 0, totalBattles: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to leaderboard updates
        const unsubscribe = subscribeToLeaderboard((data) => {
            setPlayers(data);
            setLoading(false);
        }, 50);

        // Get global stats
        getGlobalStats().then(setGlobalStats);

        return () => unsubscribe();
    }, []);

    const filtered = players.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase())
    );

    // Find current user's rank
    const myRank = players.findIndex(p => p.id === user?.id) + 1;

    const getRankColor = (rank) => {
        if (rank === 1) return '#FFD700';
        if (rank === 2) return '#C0C0C0';
        if (rank === 3) return '#CD7F32';
        return 'var(--text-tertiary)';
    };

    return (
        <div className="page">
            <div className="container" style={{ paddingTop: '56px', paddingBottom: '56px' }}>
                {/* Header */}
                <div style={{ marginBottom: '48px' }}>
                    <p className="caption" style={{ marginBottom: '8px' }}>Rankings</p>
                    <h1 className="headline">Leaderboard</h1>
                </div>

                {/* Stats */}
                <div className={`grid ${user ? 'grid-3' : 'grid-2'}`} style={{ marginBottom: '40px' }}>
                    <div className="card" style={{ textAlign: 'center', padding: '28px' }}>
                        <Users size={20} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
                        <div style={{ fontSize: '32px', fontWeight: '600', marginBottom: '4px' }}>
                            {players.length || globalStats.totalPlayers || '—'}
                        </div>
                        <div className="caption">Total players</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '28px' }}>
                        <TrendingUp size={20} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
                        <div style={{ fontSize: '32px', fontWeight: '600', marginBottom: '4px' }}>
                            {globalStats.battlesToday || 0}
                        </div>
                        <div className="caption">Battles today</div>
                    </div>
                    {user && (
                        <div className="card" style={{ textAlign: 'center', padding: '28px' }}>
                            <Award size={20} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
                            <div style={{ fontSize: '32px', fontWeight: '600', marginBottom: '4px', color: myRank > 0 ? 'var(--accent)' : 'var(--text)' }}>
                                {myRank > 0 ? `#${myRank}` : '—'}
                            </div>
                            <div className="caption">Your rank</div>
                        </div>
                    )}
                </div>

                {/* Search */}
                <div style={{ position: 'relative', marginBottom: '24px' }}>
                    <Search size={16} style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-tertiary)'
                    }} />
                    <input
                        type="text"
                        className="input"
                        placeholder="Search players..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: '44px', fontSize: '15px' }}
                    />
                </div>

                {/* Table */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center' }}>
                            <div className="spinner" style={{ margin: '0 auto 16px' }} />
                            <p style={{ color: 'var(--text-tertiary)' }}>Loading leaderboard...</p>
                        </div>
                    ) : filtered.length > 0 ? (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: '60px' }}>Rank</th>
                                    <th>Player</th>
                                    <th style={{ textAlign: 'right' }}>Rating</th>
                                    <th style={{ textAlign: 'right' }}>Wins</th>
                                    <th style={{ textAlign: 'right' }}>Streak</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p) => (
                                    <tr key={p.id} style={{
                                        background: p.id === user?.id ? 'rgba(0, 113, 227, 0.05)' : 'transparent'
                                    }}>
                                        <td>
                                            {p.rank <= 3 ? (
                                                <Crown size={16} style={{ color: getRankColor(p.rank) }} />
                                            ) : (
                                                <span style={{ color: 'var(--text-tertiary)' }}>{p.rank}</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                                                <span style={{ fontWeight: '500' }}>
                                                    {p.name}
                                                    {p.id === user?.id && <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--accent)' }}>(you)</span>}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <span className="mono">{p.rating?.toLocaleString()}</span>
                                        </td>
                                        <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                                            {p.wins || 0}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            {p.streak > 0 ? (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--orange)' }}>
                                                    <Flame size={14} />
                                                    {p.streak}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--text-tertiary)' }}>0</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: '60px', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-tertiary)' }}>
                                {search ? 'No players found' : 'No players yet. Be the first!'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
