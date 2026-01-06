import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    createLobby,
    joinLobby,
    subscribeToLobby,
    createGroup,
    assignPlayerToGroup,
    removePlayerFromGroup,
    setBattleConfig,
    startBattle,
    cancelBattle,
    resetLobbyForNewBattle,
    setManagerPresence,
    addCustomProblem,
    deleteCustomProblem,
    subscribeToCustomProblems,
    deleteGroup
} from '../services/groupBattleService';
import { problems, getAllCategories } from '../data/problems';
import { Users, Play, Plus, ArrowRight, Copy, Check, X, Shuffle, Grid, Shield, Eye, Loader, FileText, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import InfoTooltip from '../components/InfoTooltip';


// Avatar component with profile picture support
const Avatar = ({ name, avatar, size = 36, color }) => (
    <div style={{
        width: size, height: size, borderRadius: '50%',
        background: avatar ? 'transparent' : (color || 'var(--accent)'),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontWeight: '600', fontSize: size * 0.4,
        overflow: 'hidden', flexShrink: 0
    }}>
        {avatar ? (
            <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
            name?.[0]?.toUpperCase() || '?'
        )}
    </div>
);

// Modal component
const Modal = ({ children, onClose }) => (
    <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
        <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '24px', maxWidth: '600px', width: '90%',
            maxHeight: '90vh', overflowY: 'auto'
        }}>
            {children}
        </div>
    </div>
);

const GROUP_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const GroupBattlePage = () => {
    const { lobbyId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [lobby, setLobby] = useState(null);
    const [loading, setLoading] = useState(false);
    const [startingBattle, setStartingBattle] = useState(false);
    const [joinInput, setJoinInput] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [draggedPlayer, setDraggedPlayer] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [problemCount, setProblemCount] = useState(5);
    const [assignmentMode, setAssignmentMode] = useState('RANDOM');
    const [selectedProblems, setSelectedProblems] = useState([]);
    const [showProblemPicker, setShowProblemPicker] = useState(false);
    const [managerLeft, setManagerLeft] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [battleResults, setBattleResults] = useState(null);
    const [isResetting, setIsResetting] = useState(false);
    const [problemSource, setProblemSource] = useState('PLATFORM'); // 'PLATFORM' or 'CUSTOM'
    const [customProblems, setCustomProblems] = useState([]);
    const [showCustomProblemModal, setShowCustomProblemModal] = useState(false);
    const [customProblemForm, setCustomProblemForm] = useState({
        title: '',
        description: '',
        difficulty: 'MEDIUM',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your solution here\n    return 0;\n}',
        sampleInput: '',
        sampleOutput: '',
        hiddenTestCases: []
    });


    useEffect(() => {
        if (lobby?.status === 'COMPLETED') {
            setBattleResults(prev => {
                // Calculate scores dynamically from problemStates
                const scores = {};
                if (lobby.problemStates) {
                    Object.values(lobby.problemStates).forEach(problemData => {
                        Object.values(problemData).forEach(state => {
                            if (state.solvedByGroup) {
                                scores[state.solvedByGroup] = (scores[state.solvedByGroup] || 0) + 1;
                            }
                        });
                    });
                }

                const sorted = Object.entries(lobby.groups || {}).sort((a, b) => {
                    const scoreA = scores[a[0]] || 0;
                    const scoreB = scores[b[0]] || 0;
                    const scoreDiff = scoreB - scoreA;

                    if (scoreDiff !== 0) return scoreDiff;
                    return (a[1].lastSolvedAt || Infinity) - (b[1].lastSolvedAt || Infinity);
                });

                // Attach calculated scores to group objects for display
                const sortedWithScores = sorted.map(([gid, group]) => [
                    gid,
                    { ...group, score: scores[gid] || 0 }
                ]);

                // Detect draw: if top 2 teams have same score, it's a draw
                const topScore = sortedWithScores[0]?.[1]?.score || 0;
                const secondScore = sortedWithScores[1]?.[1]?.score || 0;
                const isDraw = sortedWithScores.length >= 2 && topScore === secondScore;

                return { sortedGroups: sortedWithScores, winner: isDraw ? null : sortedWithScores[0], isDraw };
            });
        } else {
            setBattleResults(null);
            setIsResetting(false);
        }
    }, [lobby?.status, lobby?.groups]);

    const handleReset = async () => {
        setIsResetting(true);
        try {
            await resetLobbyForNewBattle(lobbyId);
        } catch (e) {
            console.error(e);
            setIsResetting(false);
        }
    };

    useEffect(() => {
        if (lobby?.startedAt && lobby?.status === 'BATTLE') {
            const updateTimer = () => setElapsedTime(Date.now() - lobby.startedAt);
            updateTimer();
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }
    }, [lobby?.startedAt, lobby?.status]);

    const formatTime = (ms) => {
        if (ms < 0) ms = 0;
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (!lobbyId || !currentUser) return;

        let playerCleanup = null;

        // Join lobby and get cleanup function
        joinLobby(lobbyId, currentUser).then(cleanup => {
            playerCleanup = cleanup;
        }).catch(console.error);

        const unsubscribe = subscribeToLobby(lobbyId, setLobby);

        return () => {
            unsubscribe();
            // Player will be auto-removed by onDisconnect, but also call cleanup if available
            if (playerCleanup) playerCleanup();
        };
    }, [lobbyId, currentUser]);

    // Manager sets up presence tracking (onDisconnect auto-updates when they leave)
    const isManager = lobby?.hostId === currentUser?.id;
    useEffect(() => {
        if (!lobbyId || !isManager) return;
        const cleanup = setManagerPresence(lobbyId);
        return cleanup;
    }, [lobbyId, isManager]);

    // Detect when manager leaves (non-manager participants)
    useEffect(() => {
        if (!lobby || isManager) return;
        // If managerOnline is explicitly false (not just undefined), manager has left
        if (lobby.managerOnline === false) {
            setManagerLeft(true);
            // Auto-redirect after showing message briefly
            const timer = setTimeout(() => {
                navigate('/group-battle');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [lobby?.managerOnline, isManager, navigate]);

    // Clear selected problems when category changes (they may no longer be valid)
    useEffect(() => {
        setSelectedProblems([]);
    }, [selectedCategory]);

    // Subscribe to custom problems
    useEffect(() => {
        if (!lobbyId) return;
        const unsubscribe = subscribeToCustomProblems(lobbyId, setCustomProblems);
        return () => unsubscribe();
    }, [lobbyId]);

    // Clear selected problems when switching source
    useEffect(() => {
        setSelectedProblems([]);
    }, [problemSource]);

    const handleCreateLobby = async () => {
        if (!currentUser) { setShowAuthModal(true); return; }
        setLoading(true);
        try {
            const id = await createLobby(currentUser);
            navigate(`/group-battle/${id}`);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleJoinByInput = () => {
        if (!currentUser) { setShowAuthModal(true); return; }
        if (joinInput.trim()) {
            navigate(`/group-battle/${joinInput.trim()}`);
            setJoinInput('');
        }
    };

    const copyLobbyId = () => {
        navigator.clipboard.writeText(lobbyId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) return;
        const color = GROUP_COLORS[Object.keys(lobby.groups || {}).length % GROUP_COLORS.length];
        await createGroup(lobbyId, newGroupName.trim(), color);
        setNewGroupName('');
    };

    const handleDragStart = (e, player) => {
        setDraggedPlayer(player);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDropOnGroup = async (e, groupId) => {
        e.preventDefault();
        if (draggedPlayer && draggedPlayer.odId !== lobby.hostId) {
            await assignPlayerToGroup(lobbyId, draggedPlayer.odId, groupId, draggedPlayer);
        }
        setDraggedPlayer(null);
    };

    const handleRemoveFromGroup = async (groupId, playerId) => {
        await removePlayerFromGroup(lobbyId, playerId, groupId);
    };

    const handleRandomProblems = () => {
        const filtered = selectedCategory === 'ALL' ? problems : problems.filter(p => p.category === selectedCategory);
        if (filtered.length < 2) {
            alert(`Not enough problems in "${selectedCategory}" category`);
            return;
        }
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        const count = Math.min(problemCount, filtered.length);
        setSelectedProblems(shuffled.slice(0, count).map(p => p.id));
    };

    const toggleProblemSelection = (problemId) => {
        setSelectedProblems(prev =>
            prev.includes(problemId) ? prev.filter(id => id !== problemId) : prev.length < 10 ? [...prev, problemId] : prev
        );
    };

    const handleCreateCustomProblem = async () => {
        const { title, sampleOutput, hiddenTestCases, sampleInput } = customProblemForm;

        // Validation
        if (!title.trim() || !sampleOutput.trim()) {
            alert('Title and Sample Output are required');
            return;
        }

        // Minimum 3 test cases total (1 Sample + 2 Hidden)
        if (hiddenTestCases.length < 2) {
            alert('Please add at least 2 hidden test cases (Total 3 required including sample).');
            return;
        }

        if (hiddenTestCases.some(tc => !tc.expectedOutput.trim())) {
            alert('All test cases must have an expected output.');
            return;
        }

        try {
            const payload = {
                title: customProblemForm.title,
                description: customProblemForm.description,
                difficulty: customProblemForm.difficulty,
                starterCode: customProblemForm.starterCode,
                testCases: [
                    { input: sampleInput, expectedOutput: sampleOutput, isPublic: true },
                    ...hiddenTestCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput, isPublic: false }))
                ],
                sampleCases: [
                    { input: sampleInput, expectedOutput: sampleOutput }
                ]
            };

            await addCustomProblem(lobbyId, payload);
            setCustomProblemForm({
                title: '',
                description: '',
                difficulty: 'MEDIUM',
                starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your solution here\n    return 0;\n}',
                sampleInput: '',
                sampleOutput: '',
                hiddenTestCases: []
            });
            setShowCustomProblemModal(false);
        } catch (error) {
            console.error('Failed to create custom problem:', error);
            alert('Failed to create problem: ' + error.message);
        }
    };

    const addHiddenTestCase = () => {
        setCustomProblemForm(prev => ({
            ...prev,
            hiddenTestCases: [...prev.hiddenTestCases, { input: '', expectedOutput: '' }]
        }));
    };

    const updateHiddenTestCase = (index, field, value) => {
        setCustomProblemForm(prev => {
            const updated = [...prev.hiddenTestCases];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, hiddenTestCases: updated };
        });
    };

    const removeHiddenTestCase = (index) => {
        setCustomProblemForm(prev => ({
            ...prev,
            hiddenTestCases: prev.hiddenTestCases.filter((_, i) => i !== index)
        }));
    };

    const handleDeleteCustomProblem = async (problemId) => {
        if (confirm('Delete this custom problem?')) {
            await deleteCustomProblem(lobbyId, problemId);
            setSelectedProblems(prev => prev.filter(id => id !== problemId));
        }
    };

    const handleDeleteGroup = async (groupId) => {
        // Direct delete for debugging
        console.log('Deleting group:', groupId);
        try {
            await deleteGroup(lobbyId, groupId);
        } catch (error) {
            console.error('Failed to delete group:', error);
            alert('Error: ' + error.message);
        }
    };

    const handleStartBattle = async () => {
        // DEBUG: Temporary alerts to trace execution


        if (startingBattle) return; // Prevent double-click

        // Determine which problems to use
        const problemsToUse = problemSource === 'CUSTOM'
            ? customProblems.map(p => p.id)
            : selectedProblems;



        if (problemsToUse.length < 2) {
            alert(problemSource === 'CUSTOM' ? 'Create at least 2 custom problems' : 'Select at least 2 problems');
            return;
        }

        const groupCount = Object.keys(lobby.groups || {}).length;
        if (groupCount < 2) { alert('Minimum 2 groups required'); return; }
        for (const [gid, g] of Object.entries(lobby.groups || {})) {
            if (Object.keys(g.players || {}).length < 2) {
                alert(`${g.name} needs at least 2 players`);
                return;
            }
        }
        setStartingBattle(true);
        try {
            await setBattleConfig(lobbyId, {
                problemIds: problemsToUse,
                category: selectedCategory,
                mode: assignmentMode,
                problemSource: problemSource  // NEW: Track which source
            });
            await startBattle(lobbyId);
        } catch (error) {
            console.error('Failed to start battle:', error);
            alert('Failed to start battle. Please try again.');
        } finally {
            setStartingBattle(false);
        }
    };

    const unassignedPlayers = useMemo(() => {
        if (!lobby?.players) return [];
        return Object.entries(lobby.players)
            .filter(([id, p]) => !p.groupId && id !== lobby.hostId)
            .map(([id, p]) => ({ odId: id, ...p }));
    }, [lobby]);

    const categories = useMemo(() => getAllCategories(), []);
    const filteredProblems = useMemo(() => {
        return selectedCategory === 'ALL' ? problems : problems.filter(p => p.category === selectedCategory);
    }, [selectedCategory]);



    // Landing page
    if (!lobbyId) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '100px', paddingBottom: '60px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ marginBottom: '48px' }}>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '11px', letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase' }}>Tournament Mode</p>
                        <h1 style={{ fontSize: '42px', fontWeight: '700', letterSpacing: '-1px', marginBottom: '12px' }}>Group Battle</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6' }}>Create teams, assign problems, and compete in real-time.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Host a Battle</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px', lineHeight: '1.5' }}>Create a lobby and manage the competition as the organizer.</p>
                            <button className="btn btn-primary" onClick={handleCreateLobby} disabled={loading} style={{ width: '100%' }}>
                                {loading ? 'Creating...' : 'Create Lobby'}
                            </button>
                        </div>
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Join a Battle</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px', lineHeight: '1.5' }}>Enter a lobby code to participate as a team member.</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px', color: 'var(--text)', fontSize: '14px' }}
                                    placeholder="Lobby code" value={joinInput} onChange={e => setJoinInput(e.target.value)}
                                />
                                <button className="btn btn-secondary" onClick={handleJoinByInput} style={{ padding: '0 16px' }}>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {showAuthModal && (
                    <Modal onClose={() => setShowAuthModal(false)}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', textAlign: 'center' }}>Sign In Required</h2>
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '20px', fontSize: '14px' }}>Please sign in to participate in group battles.</p>
                        <Link to="/signin" style={{ textDecoration: 'none' }}>
                            <button className="btn btn-primary" style={{ width: '100%' }}>Sign In</button>
                        </Link>
                    </Modal>
                )}
            </div>
        );
    }

    // Loading state
    if (!lobby) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
            <div className="spinner" />
        </div>
    );

    // Manager has left - show message and redirect
    if (managerLeft) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', flexDirection: 'column', gap: '16px', paddingTop: '80px' }}>
                <X size={48} color="var(--red)" />
                <h2 style={{ fontSize: '20px' }}>Organizer Left</h2>
                <p style={{ color: 'var(--text-secondary)' }}>The organizer has left the lobby.</p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Redirecting to home...</p>
            </div>
        );
    }

    // Battle in progress - Manager spectator view
    if (lobby.status === 'BATTLE' && isManager) {
        const totalProblems = lobby.battleConfig?.problemIds?.length || 0;
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '100px', paddingBottom: '60px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                        <div>
                            <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '4px' }}>Battle in Progress</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: '600', color: 'var(--accent)' }}>
                                    {formatTime(elapsedTime)}
                                </span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>•</span>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{Object.keys(lobby.groups || {}).length} teams competing</p>
                            </div>
                        </div>
                        <button className="btn btn-secondary" onClick={() => cancelBattle(lobbyId)} style={{ borderColor: 'var(--red)', color: 'var(--red)' }}>
                            End Battle
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {Object.entries(lobby.groups || {}).map(([gid, group]) => {
                            const score = group.score || 0;
                            const progress = totalProblems > 0 ? (score / totalProblems) * 100 : 0;
                            return (
                                <div key={gid} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: group.color }} />
                                            <h3 style={{ fontWeight: '600', fontSize: '15px' }}>{group.name}</h3>
                                        </div>
                                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{score}/{totalProblems}</span>
                                    </div>
                                    <div style={{ height: '4px', background: 'var(--bg-secondary)', borderRadius: '2px', marginBottom: '16px' }}>
                                        <div style={{ height: '100%', background: group.color, borderRadius: '2px', width: `${progress}%`, transition: 'width 0.3s' }} />
                                    </div>
                                    {Object.entries(group.players || {}).map(([pid, p]) => (
                                        <div key={pid} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '13px' }}>
                                            <Avatar name={lobby.players?.[pid]?.name || p.name} avatar={lobby.players?.[pid]?.avatar || p.avatar} size={24} />
                                            <span style={{ color: 'var(--text-secondary)' }}>{lobby.players?.[pid]?.name || p.name}</span>
                                            <span style={{ marginLeft: 'auto', color: 'var(--text-tertiary)', fontSize: '11px' }}>
                                                P{(lobby.activity?.[pid]?.currentProblemIndex || 0) + 1}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Battle in progress - Participant redirect
    if (lobby.status === 'BATTLE' && !isManager) {
        const myGroup = Object.entries(lobby.groups || {}).find(([gid, g]) => g.players?.[currentUser.id]);
        if (!myGroup) {
            return (
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', flexDirection: 'column', gap: '16px', paddingTop: '80px' }}>
                    <h2 style={{ fontSize: '20px' }}>Battle in Progress</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>You were not assigned to any team.</p>
                    <button className="btn btn-secondary" onClick={() => navigate('/group-battle')}>
                        Leave Lobby
                    </button>
                </div>
            );
        }
        navigate(`/team-battle/${lobbyId}/${myGroup[0]}`);
        return null;
    }

    // Completed battle - show results
    if (lobby.status === 'COMPLETED') {
        const { sortedGroups, winner, isDraw } = battleResults || { sortedGroups: [], winner: null, isDraw: false };

        // Fallback to live calculation if state not ready yet (rare)
        if (!battleResults) {
            const sorted = Object.entries(lobby.groups || {}).sort((a, b) => {
                const scoreDiff = (b[1].score || 0) - (a[1].score || 0);
                if (scoreDiff !== 0) return scoreDiff;
                return (a[1].lastSolvedAt || Infinity) - (b[1].lastSolvedAt || Infinity);
            });
            return (
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
                </div>
            );
        }

        // Calculate result message
        const getResultMessage = () => {
            if (isDraw) {
                const tiedScore = sortedGroups[0]?.[1]?.score || 0;
                return tiedScore === 0 ? "It's a draw! No team scored." : `It's a draw! Teams tied at ${tiedScore} problems.`;
            }
            if (winner) {
                return `${winner[1].name} wins with ${winner[1].score || 0} problems solved!`;
            }
            return 'Battle ended.';
        };

        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '100px', paddingBottom: '60px' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                        {isDraw ? '🤝 Draw' : 'Battle Complete'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                        {getResultMessage()}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                        {sortedGroups.map(([gid, group], idx) => (
                            <div key={gid} style={{
                                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px'
                            }}>
                                <span style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: idx === 0 ? 'var(--accent)' : 'var(--bg-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '13px', fontWeight: '600', color: idx === 0 ? 'white' : 'var(--text-secondary)'
                                }}>{idx + 1}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: group.color }} />
                                    <span style={{ fontWeight: '500' }}>{group.name}</span>
                                </div>
                                <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                    {group.score || 0} solved
                                </span>
                            </div>
                        ))}
                    </div>

                    {isManager ? (
                        <button
                            className="btn btn-primary"
                            onClick={handleReset}
                            disabled={isResetting}
                            style={{ minWidth: '160px' }}
                        >
                            {isResetting ? (
                                <><Loader size={16} style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} /> Starting New...</>
                            ) : (
                                'Start New Battle'
                            )}
                        </button>
                    ) : (
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Waiting for organizer to start a new battle...</p>
                    )}
                </div>
            </div>
        );
    }

    // Lobby view
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '100px', paddingBottom: '60px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                            <h1 style={{ fontSize: '22px', fontWeight: '600' }}>Lobby</h1>
                            <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Setting Up
                            </span>
                        </div>
                        <div
                            onClick={copyLobbyId}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: copied ? 'var(--green)' : 'var(--text-tertiary)', fontSize: '13px', transition: 'color 0.2s' }}
                        >
                            <span>Code: <code style={{ fontFamily: 'monospace' }}>{lobbyId}</code></span>
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            {copied && <span style={{ fontSize: '11px' }}>Copied</span>}
                        </div>
                    </div>
                    {isManager && (
                        <button
                            className="btn btn-primary"
                            onClick={handleStartBattle}
                            disabled={startingBattle || (problemSource === 'CUSTOM' ? customProblems.length < 2 : selectedProblems.length < 2) || Object.keys(lobby.groups || {}).length < 2}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            {startingBattle ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Starting...</> : <><Play size={14} /> Start Battle</>}
                        </button>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px', alignItems: 'start' }}>
                    {/* Left: Players & Config */}
                    <div>
                        {/* Players */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>
                                Players ({Object.keys(lobby.players || {}).length})
                            </h3>

                            {/* Scrollable player list container */}
                            <div style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                                {/* Manager */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                                    borderRadius: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--accent)',
                                    marginBottom: '8px'
                                }}>
                                    <Avatar name={lobby.hostName} avatar={lobby.players?.[lobby.hostId]?.avatar} size={36} color="var(--accent)" />
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontWeight: '500', fontSize: '14px' }}>{lobby.hostName}</span>
                                            <Shield size={12} color="var(--accent)" />
                                        </div>
                                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Organizer</span>
                                    </div>
                                </div>

                                {/* Unassigned Players */}
                                {unassignedPlayers.map(p => (
                                    <div
                                        key={p.odId}
                                        draggable={isManager}
                                        onDragStart={e => handleDragStart(e, p)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                                            borderRadius: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                            marginBottom: '8px', cursor: isManager ? 'grab' : 'default',
                                            opacity: draggedPlayer?.odId === p.odId ? 0.5 : 1, transition: 'opacity 0.2s'
                                        }}
                                    >
                                        <Avatar name={p.name} avatar={p.avatar} size={36} />
                                        <div>
                                            <span style={{ fontWeight: '500', fontSize: '14px' }}>{p.name}</span>
                                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                                                {p.odId === currentUser?.id ? 'You' : 'Available'}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {unassignedPlayers.length === 0 && (
                                    <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', fontStyle: 'italic', padding: '8px 0' }}>
                                        All players assigned
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Problem Config (Manager only) */}
                        {isManager && (
                            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                                <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>Problem Configuration</h3>

                                {/* Problem Source Toggle */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Problem Source <InfoTooltip text="Choose VALKRY problems or create your own" />
                                    </label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => setProblemSource('PLATFORM')}
                                            style={{
                                                flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid var(--border)',
                                                background: problemSource === 'PLATFORM' ? 'var(--accent)' : 'var(--bg-secondary)',
                                                color: problemSource === 'PLATFORM' ? 'white' : 'var(--text-secondary)',
                                                fontWeight: '500', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                            }}
                                        >
                                            <Grid size={14} /> Platform
                                        </button>
                                        <button
                                            onClick={() => setProblemSource('CUSTOM')}
                                            style={{
                                                flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid var(--border)',
                                                background: problemSource === 'CUSTOM' ? 'var(--accent)' : 'var(--bg-secondary)',
                                                color: problemSource === 'CUSTOM' ? 'white' : 'var(--text-secondary)',
                                                fontWeight: '500', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                            }}
                                        >
                                            <FileText size={14} /> Custom
                                        </button>
                                    </div>
                                </div>

                                {/* Custom Problems Mode */}
                                {problemSource === 'CUSTOM' ? (
                                    <div style={{ marginTop: '8px' }}>
                                        {/* Custom Problems List or Empty State */}
                                        {customProblems.length === 0 ? (
                                            <div style={{
                                                background: 'var(--bg-secondary)',
                                                border: '1px dashed var(--border)',
                                                borderRadius: '12px',
                                                padding: '24px 16px',
                                                textAlign: 'center'
                                            }}>
                                                <div style={{
                                                    width: '40px', height: '40px', borderRadius: '10px',
                                                    background: 'rgba(99, 102, 241, 0.1)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    margin: '0 auto 12px'
                                                }}>
                                                    <FileText size={20} color="var(--accent)" />
                                                </div>
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px', fontWeight: '500' }}>
                                                    No problems yet
                                                </p>
                                                <p style={{ color: 'var(--text-tertiary)', fontSize: '11px', marginBottom: '16px' }}>
                                                    Create at least 2 custom problems to start
                                                </p>
                                                <button
                                                    onClick={() => setShowCustomProblemModal(true)}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px',
                                                        background: 'var(--accent)', color: 'white', border: 'none',
                                                        borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer'
                                                    }}
                                                >
                                                    <Plus size={16} /> Create Problem
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Problem Count Header */}
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                    marginBottom: '10px', padding: '0 2px'
                                                }}>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                        {customProblems.length} Problem{customProblems.length !== 1 ? 's' : ''} Created
                                                    </span>
                                                    <button
                                                        onClick={() => setShowCustomProblemModal(true)}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px',
                                                            background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)',
                                                            borderRadius: '6px', fontSize: '11px', fontWeight: '500', cursor: 'pointer'
                                                        }}
                                                    >
                                                        <Plus size={12} /> Add
                                                    </button>
                                                </div>

                                                {/* Problems List */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                                                    {customProblems.map((p, idx) => (
                                                        <div key={p.id} style={{
                                                            display: 'flex', alignItems: 'center', gap: '10px',
                                                            padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border)'
                                                        }}>
                                                            <span style={{
                                                                width: '20px', height: '20px', borderRadius: '5px',
                                                                background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)', flexShrink: 0
                                                            }}>{idx + 1}</span>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <span style={{ fontWeight: '500', fontSize: '13px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
                                                            </div>
                                                            <span style={{
                                                                fontSize: '9px', padding: '3px 6px', borderRadius: '4px', fontWeight: '600', textTransform: 'uppercase', flexShrink: 0,
                                                                background: p.difficulty === 'EASY' ? 'rgba(16, 185, 129, 0.1)' : p.difficulty === 'HARD' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                                color: p.difficulty === 'EASY' ? 'var(--green)' : p.difficulty === 'HARD' ? 'var(--red)' : 'var(--yellow)'
                                                            }}>{p.difficulty}</span>
                                                            <button
                                                                onClick={() => handleDeleteCustomProblem(p.id)}
                                                                style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', transition: 'color 0.15s' }}
                                                                title="Remove"
                                                                onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                                                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Min 2 warning */}
                                                {customProblems.length < 2 && (
                                                    <p style={{ color: 'var(--yellow)', fontSize: '11px', marginTop: '8px', textAlign: 'center' }}>
                                                        ⚠️ Add {2 - customProblems.length} more problem{2 - customProblems.length !== 1 ? 's' : ''} to start
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* Platform Problems Mode - Original UI */}
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</label>
                                            <select
                                                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text)', fontSize: '13px' }}
                                                value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                                            >
                                                <option value="ALL">All Categories</option>
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Problems</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <button
                                                    onClick={() => setProblemCount(c => Math.max(2, c - 1))}
                                                    disabled={problemCount <= 2}
                                                    style={{
                                                        width: '32px', height: '32px', borderRadius: '8px',
                                                        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                                                        color: problemCount <= 2 ? 'var(--text-tertiary)' : 'var(--text)',
                                                        cursor: problemCount <= 2 ? 'not-allowed' : 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '16px', fontWeight: '500'
                                                    }}
                                                >−</button>
                                                <div style={{
                                                    flex: 1, height: '4px', background: 'var(--bg-secondary)', borderRadius: '2px',
                                                    position: 'relative'
                                                }}>
                                                    <div style={{
                                                        position: 'absolute', left: 0, top: 0, height: '100%',
                                                        width: `${((problemCount - 2) / 8) * 100}%`,
                                                        background: 'var(--accent)', borderRadius: '2px',
                                                        transition: 'width 0.15s ease'
                                                    }} />
                                                </div>
                                                <span style={{
                                                    fontSize: '15px', fontWeight: '600', color: 'var(--text)',
                                                    minWidth: '24px', textAlign: 'center'
                                                }}>{problemCount}</span>
                                                <button
                                                    onClick={() => setProblemCount(c => Math.min(10, c + 1))}
                                                    disabled={problemCount >= 10}
                                                    style={{
                                                        width: '32px', height: '32px', borderRadius: '8px',
                                                        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                                                        color: problemCount >= 10 ? 'var(--text-tertiary)' : 'var(--text)',
                                                        cursor: problemCount >= 10 ? 'not-allowed' : 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '16px', fontWeight: '500'
                                                    }}
                                                >+</button>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                            <button onClick={() => { setAssignmentMode('RANDOM'); handleRandomProblems(); }} className="btn btn-secondary" style={{ flex: 1, fontSize: '12px', padding: '8px' }}>
                                                <Shuffle size={12} /> Random
                                            </button>
                                            <button onClick={() => { setAssignmentMode('MANUAL'); setShowProblemPicker(true); }} className="btn btn-secondary" style={{ flex: 1, fontSize: '12px', padding: '8px' }}>
                                                <Grid size={12} /> Manual
                                            </button>
                                        </div>

                                        {selectedProblems.length > 0 && (
                                            <p style={{ fontSize: '12px', color: 'var(--green)' }}>{selectedProblems.length} problems selected</p>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Groups */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                                Teams <InfoTooltip text="Create teams and drag players to assign them" />
                            </h3>
                            {isManager && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        placeholder="Team name"
                                        value={newGroupName}
                                        onChange={e => setNewGroupName(e.target.value)}
                                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 12px', color: 'var(--text)', fontSize: '13px', width: '140px' }}
                                    />
                                    <button onClick={handleCreateGroup} className="btn btn-secondary" style={{ padding: '8px 12px' }}>
                                        <Plus size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                            {Object.entries(lobby.groups || {}).map(([gid, group]) => (
                                <div
                                    key={gid}
                                    onDragOver={handleDragOver}
                                    onDrop={e => handleDropOnGroup(e, gid)}
                                    style={{
                                        background: 'var(--bg-elevated)', border: `2px solid ${group.color}40`,
                                        borderRadius: '16px', padding: '20px', minHeight: '140px'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: group.color }} />
                                            <h4 style={{ fontWeight: '600', fontSize: '14px' }}>{group.name}</h4>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                                                {Object.keys(group.players || {}).length} members
                                            </span>
                                            {isManager && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteGroup(gid);
                                                    }}
                                                    style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '6px', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                                                    title="Remove team"
                                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = 'var(--red)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {Object.entries(group.players || {}).map(([pid, p]) => (
                                        <div key={pid} style={{
                                            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px',
                                            background: 'var(--bg-secondary)', borderRadius: '10px', marginBottom: '8px'
                                        }}>
                                            <Avatar name={lobby.players?.[pid]?.name || p.name} avatar={lobby.players?.[pid]?.avatar || p.avatar} size={28} />
                                            <span style={{ fontSize: '13px', flex: 1 }}>{lobby.players?.[pid]?.name || p.name || '?'}</span>
                                            {isManager && (
                                                <button onClick={() => handleRemoveFromGroup(gid, pid)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '4px' }}>
                                                    <X size={12} />
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    {Object.keys(group.players || {}).length === 0 && (
                                        <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', textAlign: 'center', padding: '16px' }}>Drag players here</p>
                                    )}

                                    {Object.keys(group.players || {}).length === 1 && (
                                        <p style={{ color: 'var(--orange)', fontSize: '11px', marginTop: '8px' }}>Minimum 2 players required</p>
                                    )}
                                </div>
                            ))}

                            {Object.keys(lobby.groups || {}).length === 0 && (
                                <div style={{
                                    border: '2px dashed var(--border)', borderRadius: '16px', padding: '40px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-tertiary)', fontSize: '13px'
                                }}>
                                    {isManager ? 'Create a team to get started' : 'Waiting for organizer'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Problem Picker Modal */}
                {showProblemPicker && (
                    <Modal onClose={() => setShowProblemPicker(false)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '600' }}>Select Problems</h2>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedProblems.length}/10</span>
                        </div>
                        <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                            {filteredProblems.slice(0, 50).map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => toggleProblemSelection(p.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px', padding: '10px',
                                        background: selectedProblems.includes(p.id) ? 'var(--accent-bg)' : 'transparent',
                                        borderRadius: '8px', cursor: 'pointer', marginBottom: '4px'
                                    }}
                                >
                                    <div style={{
                                        width: '18px', height: '18px', borderRadius: '4px',
                                        border: `2px solid ${selectedProblems.includes(p.id) ? 'var(--accent)' : 'var(--border)'}`,
                                        background: selectedProblems.includes(p.id) ? 'var(--accent)' : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {selectedProblems.includes(p.id) && <Check size={12} color="white" />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '13px', fontWeight: '500' }}>{p.title}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{p.difficulty}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowProblemPicker(false)} style={{ width: '100%', marginTop: '16px' }}>
                            Done
                        </button>
                    </Modal>
                )}

                {/* Custom Problem Creation Modal */}
                {showCustomProblemModal && (
                    <Modal onClose={() => setShowCustomProblemModal(false)}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                            Create Custom Problem
                            <InfoTooltip text="Create a custom coding challenge. You define the logic, and participants must write C++ code to solve it. Your test cases are the 'Judge' - if their code returns the right output for your inputs, they win." />
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Title *</label>
                                <input
                                    type="text"
                                    value={customProblemForm.title}
                                    onChange={e => setCustomProblemForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g., Sum of Two Numbers"
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)', fontSize: '14px' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Description</label>
                                <textarea
                                    value={customProblemForm.description}
                                    onChange={e => setCustomProblemForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe the problem..."
                                    rows={3}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)', fontSize: '14px', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Difficulty</label>
                                    <select
                                        value={customProblemForm.difficulty}
                                        onChange={e => setCustomProblemForm(prev => ({ ...prev, difficulty: e.target.value }))}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)', fontSize: '14px' }}
                                    >
                                        <option value="EASY">Easy</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HARD">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                                        Starter Code <InfoTooltip text="This code appears in the editor when participants start. Use it to provide the main function structure or expected class definitions. Example: #include <iostream>..." />
                                    </label>
                                    <textarea
                                        value={customProblemForm.starterCode}
                                        onChange={e => setCustomProblemForm(prev => ({ ...prev, starterCode: e.target.value }))}
                                        rows={2}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)', fontSize: '13px', fontFamily: 'monospace', resize: 'vertical' }}
                                    />
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                                <label style={{ fontSize: '12px', color: 'var(--accent)', display: 'block', marginBottom: '12px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                                    Sample Case (Public) <InfoTooltip text="The 'Public' test case. This Input/Output pair is shown to participants to explain the problem. Ensure the Output is EXACTLY what the code writes to stdout (case-sensitive)." />
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ fontSize: '10px', color: 'var(--text-tertiary)', display: 'block', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                                            Input <InfoTooltip text="Data fed to Standard Input (stdin). Separate values with spaces or newlines. Example: For `cin >> a >> b`, enter `5 10`." />
                                        </label>
                                        <textarea
                                            value={customProblemForm.sampleInput}
                                            onChange={e => setCustomProblemForm(prev => ({ ...prev, sampleInput: e.target.value }))}
                                            placeholder="Standard input..."
                                            rows={2}
                                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)', fontSize: '12px', fontFamily: 'monospace' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '10px', color: 'var(--text-tertiary)', display: 'block', marginBottom: '4px' }}>Expected Output *</label>
                                        <textarea
                                            value={customProblemForm.sampleOutput}
                                            onChange={e => setCustomProblemForm(prev => ({ ...prev, sampleOutput: e.target.value }))}
                                            placeholder="Standard output..."
                                            rows={2}
                                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)', fontSize: '12px', fontFamily: 'monospace' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                                        Hidden Test Cases (Min 2) <InfoTooltip text="The 'Secret' test cases. These are used to judge the solution. Participants generally don't see these. Add edge cases here to robustly test their logic." />
                                    </label>
                                    <button onClick={addHiddenTestCase} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px', height: 'auto' }}>
                                        <Plus size={12} style={{ marginRight: '4px' }} /> Add Case
                                    </button>
                                </div>

                                {customProblemForm.hiddenTestCases.map((tc, idx) => (
                                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 24px', gap: '8px', marginBottom: '8px', alignItems: 'start' }}>
                                        <textarea
                                            value={tc.input}
                                            onChange={e => updateHiddenTestCase(idx, 'input', e.target.value)}
                                            placeholder={`Hidden Input ${idx + 1}`}
                                            rows={1}
                                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)', fontSize: '12px', fontFamily: 'monospace', minHeight: '36px' }}
                                        />
                                        <textarea
                                            value={tc.expectedOutput}
                                            onChange={e => updateHiddenTestCase(idx, 'expectedOutput', e.target.value)}
                                            placeholder={`Expected Output ${idx + 1}`}
                                            rows={1}
                                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)', fontSize: '12px', fontFamily: 'monospace', minHeight: '36px' }}
                                        />
                                        <button
                                            onClick={() => removeHiddenTestCase(idx)}
                                            style={{ background: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '6px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', transition: 'all 0.15s' }}
                                            title="Remove test case"
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = 'var(--red)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {customProblemForm.hiddenTestCases.length === 0 && (
                                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No hidden test cases added yet.</p>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowCustomProblemModal(false)}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleCreateCustomProblem}
                                disabled={!customProblemForm.title.trim() || !customProblemForm.sampleOutput.trim() || customProblemForm.hiddenTestCases.length < 2}
                                style={{ flex: 1 }}
                            >
                                Create Problem
                            </button>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default GroupBattlePage;
