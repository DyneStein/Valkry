import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Bell, Search, Check, X, Swords, Copy, CheckCircle, Trash2, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCategories } from '../data/problems';
import {
    subscribeToFriends,
    subscribeToFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    searchUserById,
    subscribeToFriendsOnlineStatus
} from '../services/friendsService';

const FriendsPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('friends');
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [friendStatuses, setFriendStatuses] = useState({});
    const [searchId, setSearchId] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchError, setSearchError] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [copied, setCopied] = useState(false);
    const [actionMessage, setActionMessage] = useState('');

    // Challenge Modal State
    const [challengeModalOpen, setChallengeModalOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [challengeOptions, setChallengeOptions] = useState({ difficulty: 'Random', category: 'Random' });
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        // Load categories
        setCategories(getAllCategories().sort());

        const unsubFriends = subscribeToFriends(user.id, setFriends);
        const unsubRequests = subscribeToFriendRequests(user.id, setRequests);

        return () => {
            unsubFriends();
            unsubRequests();
        };
    }, [user]);

    useEffect(() => {
        if (friends.length > 0) {
            const friendIds = friends.map(f => f.id);
            const unsub = subscribeToFriendsOnlineStatus(friendIds, setFriendStatuses);
            return unsub;
        }
    }, [friends]);

    const handleCopyId = () => {
        navigator.clipboard.writeText(user.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSearch = async () => {
        if (!searchId.trim()) return;

        setIsSearching(true);
        setSearchResult(null);
        setSearchError('');

        if (searchId.trim() === user.id) {
            setSearchError("You can't add yourself as a friend");
            setIsSearching(false);
            return;
        }

        try {
            // Add timeout to prevent infinite searching
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Search timed out')), 15000)
            );

            const result = await Promise.race([
                searchUserById(searchId.trim()),
                timeoutPromise
            ]);

            if (result) {
                setSearchResult(result);
            } else {
                setSearchError('User not found. Make sure the ID is correct.');
            }
        } catch (error) {
            console.error('Search error:', error);
            if (error.message === 'Search timed out') {
                setSearchError('Search timed out. Please check your connection and try again.');
            } else if (error.code === 'PERMISSION_DENIED' || error.message?.includes('permission')) {
                setSearchError('Permission denied. Please sign out and sign in again.');
            } else if (error.message?.includes('network') || error.message?.includes('offline')) {
                setSearchError('Network error. Please check your internet connection.');
            } else {
                setSearchError(`Search failed: ${error.message || 'Unknown error'}. Please try again.`);
            }
        }
        setIsSearching(false);
    };

    const handleSendRequest = async () => {
        if (!searchResult) return;

        const result = await sendFriendRequest(
            { id: user.id, name: user.name, avatar: user.avatar },
            searchResult.id
        );

        if (result.success) {
            setActionMessage('Friend request sent!');
            setSearchResult(null);
            setSearchId('');
        } else {
            setSearchError(result.error);
        }
        setTimeout(() => setActionMessage(''), 3000);
    };

    const handleAccept = async (request) => {
        await acceptFriendRequest(user.id, request.from);
        setActionMessage(`${request.from.name} is now your friend!`);
        setTimeout(() => setActionMessage(''), 3000);
    };

    const handleDecline = async (request) => {
        await declineFriendRequest(user.id, request.id);
    };

    const handleRemove = async (friend) => {
        if (window.confirm(`Remove ${friend.name} from friends?`)) {
            await removeFriend(user.id, friend.id);
            setActionMessage(`Removed ${friend.name} from friends`);
            setTimeout(() => setActionMessage(''), 3000);
        }
    };

    const openChallengeModal = (friend) => {
        setSelectedFriend(friend);
        setChallengeOptions({ difficulty: 'Random', category: 'Random' });
        setChallengeModalOpen(true);
    };

    const startChallenge = () => {
        if (!selectedFriend) return;
        setChallengeModalOpen(false);
        navigate('/arena', {
            state: {
                challengeFriend: selectedFriend,
                challengeOptions: challengeOptions
            }
        });
    };

    if (!user) {
        return (
            <div className="page">
                <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
                    <Users size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }} />
                    <h2 className="headline-small" style={{ marginBottom: '12px' }}>Sign in Required</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Sign in to add friends and challenge them
                    </p>
                    <Link to="/signin">
                        <button className="btn btn-primary">Sign In</button>
                    </Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'friends', label: 'Friends', icon: Users, count: friends.length },
        { id: 'requests', label: 'Requests', icon: Bell, count: requests.length },
        { id: 'add', label: 'Add Friend', icon: UserPlus }
    ];

    return (
        <div className="page">
            <div className="container" style={{ paddingTop: '56px', paddingBottom: '56px', maxWidth: '600px' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <p className="caption" style={{ marginBottom: '8px' }}>Social</p>
                    <h1 className="headline">Friends</h1>
                </div>

                {/* Your ID Card */}
                <div className="card" style={{ padding: '16px', marginBottom: '24px', background: 'var(--bg-elevated)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: '600' }}>YOUR ID</span>
                            <div className="mono" style={{ fontSize: '13px', color: 'var(--text)', marginTop: '4px' }}>
                                {user.id}
                            </div>
                        </div>
                        <button
                            onClick={handleCopyId}
                            style={{
                                padding: '8px 14px',
                                background: copied ? 'var(--green)' : 'var(--bg-secondary)',
                                border: 'none',
                                borderRadius: '8px',
                                color: copied ? 'white' : 'var(--text)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px'
                            }}
                        >
                            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
                        Share this ID with friends so they can add you
                    </p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                background: activeTab === tab.id ? 'var(--accent)' : 'var(--bg-elevated)',
                                border: activeTab === tab.id ? 'none' : '1px solid var(--border)',
                                borderRadius: '10px',
                                color: activeTab === tab.id ? 'white' : 'var(--text)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                position: 'relative'
                            }}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {tab.count > 0 && (
                                <span style={{
                                    background: activeTab === tab.id ? 'rgba(255,255,255,0.3)' : 'var(--accent)',
                                    color: 'white',
                                    padding: '2px 6px',
                                    borderRadius: '10px',
                                    fontSize: '11px',
                                    fontWeight: '600'
                                }}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Action Message */}
                {actionMessage && (
                    <div style={{
                        padding: '12px 16px',
                        background: 'rgba(48, 209, 88, 0.12)',
                        border: '1px solid rgba(48, 209, 88, 0.3)',
                        borderRadius: '10px',
                        marginBottom: '16px',
                        color: 'var(--green)',
                        fontSize: '14px'
                    }}>
                        <CheckCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />{actionMessage}
                    </div>
                )}

                {/* Friends Tab */}
                {activeTab === 'friends' && (
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {friends.length > 0 ? (
                            friends.map((friend, idx) => (
                                <div
                                    key={friend.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '16px',
                                        borderBottom: idx < friends.length - 1 ? '1px solid var(--border)' : 'none'
                                    }}
                                >
                                    {friend.avatar ? (
                                        <img
                                            src={friend.avatar}
                                            alt={friend.name}
                                            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="avatar" style={{ width: '44px', height: '44px', fontSize: '16px' }}>
                                            {friend.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '500' }}>{friend.name}</div>
                                        <div style={{ fontSize: '12px', color: friendStatuses[friend.id] ? 'var(--green)' : 'var(--text-tertiary)' }}>
                                            {friendStatuses[friend.id] ? '● Online' : '○ Offline'}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openChallengeModal(friend)}
                                        className="btn btn-primary"
                                        style={{ padding: '8px 14px', fontSize: '13px' }}
                                        disabled={!friendStatuses[friend.id]}
                                        title={!friendStatuses[friend.id] ? "Friend must be online to challenge" : ""}
                                    >
                                        <Swords size={14} /> Challenge
                                    </button>
                                    <button
                                        onClick={() => handleRemove(friend)}
                                        style={{
                                            padding: '8px',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-tertiary)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                                <Users size={40} style={{ color: 'var(--text-tertiary)', marginBottom: '12px', opacity: 0.5 }} />
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>No friends yet</p>
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
                                    Add friends to challenge them in battles
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Requests Tab */}
                {activeTab === 'requests' && (
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {requests.length > 0 ? (
                            requests.map((request, idx) => (
                                <div
                                    key={request.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '16px',
                                        borderBottom: idx < requests.length - 1 ? '1px solid var(--border)' : 'none'
                                    }}
                                >
                                    {request.from.avatar ? (
                                        <img
                                            src={request.from.avatar}
                                            alt={request.from.name}
                                            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="avatar" style={{ width: '44px', height: '44px', fontSize: '16px' }}>
                                            {request.from.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '500' }}>{request.from.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                                            Wants to be friends
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAccept(request)}
                                        style={{
                                            padding: '8px 14px',
                                            background: 'var(--green)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '13px'
                                        }}
                                    >
                                        <Check size={14} /> Accept
                                    </button>
                                    <button
                                        onClick={() => handleDecline(request)}
                                        style={{
                                            padding: '8px',
                                            background: 'transparent',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            color: 'var(--text-tertiary)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                                <Bell size={40} style={{ color: 'var(--text-tertiary)', marginBottom: '12px', opacity: 0.5 }} />
                                <p style={{ color: 'var(--text-secondary)' }}>No pending requests</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Add Friend Tab */}
                {activeTab === 'add' && (
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '17px', fontWeight: '600' }}>Add by User ID</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>
                            Enter your friend's User ID to send them a friend request
                        </p>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                            <input
                                type="text"
                                placeholder="Paste User ID here..."
                                value={searchId}
                                onChange={(e) => { setSearchId(e.target.value); setSearchError(''); setSearchResult(null); }}
                                className="input"
                                style={{ flex: 1 }}
                            />
                            <button
                                onClick={handleSearch}
                                className="btn btn-primary"
                                disabled={!searchId.trim() || isSearching}
                                style={{ padding: '12px 20px' }}
                            >
                                {isSearching ? 'Searching...' : <><Search size={16} /> Search</>}
                            </button>
                        </div>

                        {searchError && (
                            <div style={{
                                padding: '12px',
                                background: 'rgba(255, 69, 58, 0.12)',
                                border: '1px solid rgba(255, 69, 58, 0.3)',
                                borderRadius: '8px',
                                color: 'var(--red)',
                                fontSize: '14px'
                            }}>
                                {searchError}
                            </div>
                        )}

                        {searchResult && (
                            <div style={{
                                padding: '16px',
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                {searchResult.avatar ? (
                                    <img
                                        src={searchResult.avatar}
                                        alt={searchResult.name}
                                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '18px' }}>
                                        {searchResult.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '500', marginBottom: '2px' }}>{searchResult.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                                        {searchResult.rank} • {searchResult.rating} rating
                                    </div>
                                </div>
                                <button
                                    onClick={handleSendRequest}
                                    className="btn btn-primary"
                                    style={{ padding: '10px 16px' }}
                                >
                                    <UserPlus size={16} /> Add Friend
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {/* Challenge Modal */}
                {challengeModalOpen && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px'
                    }}>
                        <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
                            <h3 style={{ marginBottom: '8px', fontSize: '20px', fontWeight: '600' }}>Challenge {selectedFriend?.name}</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
                                Select problem settings for this battle
                            </p>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Difficulty</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {['Random', 'Easy', 'Medium', 'Hard'].map(diff => (
                                        <button
                                            key={diff}
                                            onClick={() => setChallengeOptions({ ...challengeOptions, difficulty: diff })}
                                            style={{
                                                flex: 1,
                                                padding: '10px',
                                                borderRadius: '8px',
                                                border: challengeOptions.difficulty === diff ? '1px solid var(--accent)' : '1px solid var(--border)',
                                                background: challengeOptions.difficulty === diff ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-secondary)',
                                                color: challengeOptions.difficulty === diff ? 'var(--accent)' : 'var(--text-secondary)',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {diff}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Category</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={challengeOptions.category}
                                        onChange={(e) => setChallengeOptions({ ...challengeOptions, category: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            paddingRight: '40px',
                                            background: 'var(--bg-secondary)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            color: 'var(--text)',
                                            fontSize: '14px',
                                            appearance: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="Random">Random Category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setChallengeModalOpen(false)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: 'transparent',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: 'var(--text)',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={startChallenge}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: 'var(--accent)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Swords size={16} /> Send Challenge
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendsPage;
