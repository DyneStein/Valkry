import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    subscribeToLobby,
    subscribeToActivity,
    subscribeToProblemStates,
    updatePlayerActivity,
    solveProblem,
    forfeitGroup,
    cancelBattle
} from '../services/groupBattleService';
import { executeCode } from '../services/judge0';
import { problems } from '../data/problems';
import { Check, Lock, Play, AlertCircle, Loader, ChevronLeft, ChevronRight, Flag, Trophy, X as XIcon, Crown, ShieldAlert, FlagOff } from 'lucide-react';
import InfoTooltip from '../components/InfoTooltip';
import Editor from '@monaco-editor/react';

const TeamBattleArena = () => {
    const { lobbyId, groupId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [lobby, setLobby] = useState(null);
    const [activity, setActivity] = useState({});
    const [problemStates, setProblemStates] = useState({});
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [code, setCode] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [executionStatus, setExecutionStatus] = useState(null);
    const [output, setOutput] = useState(null);
    const [showForfeitModal, setShowForfeitModal] = useState(false);
    const [managerLeft, setManagerLeft] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        if (lobby?.startedAt) {
            const updateTimer = () => setElapsedTime(Date.now() - lobby.startedAt);
            updateTimer();
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }
    }, [lobby?.startedAt]);

    const formatTime = (ms) => {
        if (ms < 0) ms = 0;
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Subscribe to data
    useEffect(() => {
        if (!lobbyId) return;
        const unsub1 = subscribeToLobby(lobbyId, setLobby);
        const unsub2 = subscribeToActivity(lobbyId, setActivity);
        const unsub3 = subscribeToProblemStates(lobbyId, setProblemStates);
        return () => { unsub1(); unsub2(); unsub3(); };
    }, [lobbyId]);

    // Detect when manager leaves
    useEffect(() => {
        if (!lobby) return;
        if (lobby.managerOnline === false) {
            setManagerLeft(true);
            const timer = setTimeout(() => {
                navigate('/group-battle');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [lobby?.managerOnline, navigate]);

    // Delay showing results to prevent flicker (wait for score updates)
    useEffect(() => {
        if (lobby?.status === 'COMPLETED') {
            const timer = setTimeout(() => setShowResults(true), 1500);
            return () => clearTimeout(timer);
        } else {
            setShowResults(false);
        }
    }, [lobby?.status]);

    // Update activity when changing problems
    useEffect(() => {
        if (lobbyId && currentUser) {
            updatePlayerActivity(lobbyId, currentUser.id, currentProblemIndex);
        }
    }, [currentProblemIndex, lobbyId, currentUser]);

    // Get battle problems (supports both Platform and Custom sources)
    const battleProblems = useMemo(() => {
        if (!lobby?.battleConfig?.problemIds) return [];

        // Check if using custom problems
        if (lobby.battleConfig.problemSource === 'CUSTOM' && lobby.customProblems) {
            // Map problem IDs to custom problems stored in the lobby
            return lobby.battleConfig.problemIds.map(id => {
                const customProblem = Object.values(lobby.customProblems).find(p => p.id === id);
                return customProblem;
            }).filter(Boolean);
        }

        // Default: use platform problems
        return lobby.battleConfig.problemIds.map(id => problems.find(p => p.id === id)).filter(Boolean);
    }, [lobby]);

    const currentProblem = battleProblems[currentProblemIndex];
    const myGroup = lobby?.groups?.[groupId];

    // Get teammates
    const teammates = useMemo(() => {
        if (!myGroup?.players) return [];
        return Object.entries(myGroup.players).filter(([id]) => id !== currentUser?.id).map(([id, data]) => ({ id, ...data }));
    }, [myGroup, currentUser]);

    // Check problem states
    // Check problem states (Scoped per group)
    const isSolvedByMyGroup = (problemId) => problemStates?.[problemId]?.[groupId]?.solvedBy != null;
    // Helper to check if ANY group solved it (not widely used but good for completeness)
    const isProblemSolvedGlobal = (problemId) => Object.values(problemStates?.[problemId] || {}).some(g => g?.solvedBy != null);

    // Auto-end battle when all problems are solved by MY group
    useEffect(() => {
        if (!lobby || !battleProblems.length || lobby.status !== 'BATTLE') return;
        const allSolved = battleProblems.every(p => isSolvedByMyGroup(p.id));
        if (allSolved) {
            cancelBattle(lobbyId).catch(console.error);
        }
    }, [problemStates, battleProblems, lobby, lobbyId, groupId]);

    // Auto-redirect to lobby after battle ends (after showing results briefly)
    useEffect(() => {
        if (lobby?.status === 'COMPLETED') {
            const timer = setTimeout(() => {
                navigate(`/group-battle/${lobbyId}`);
            }, 4000); // 4 second delay to show results
            return () => clearTimeout(timer);
        }
    }, [lobby?.status, lobbyId, navigate]);

    // Initialize code
    useEffect(() => {
        if (currentProblem && !isSolvedByMyGroup(currentProblem.id)) {
            setCode(currentProblem.starterCode || '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your solution here\n    return 0;\n}');
            setOutput(null);
        }
    }, [currentProblem]);

    // Avatar component
    const Avatar = ({ name, avatar, size = 24 }) => (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: avatar ? 'transparent' : 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: '600', fontSize: size * 0.4,
            overflow: 'hidden', flexShrink: 0
        }}>
            {avatar ? <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : name?.[0]?.toUpperCase()}
        </div>
    );

    // Handle code submission
    const handleRunCode = async () => {
        if (!currentProblem || isSolvedByMyGroup(currentProblem.id)) return;
        setIsRunning(true);
        setExecutionStatus('Starting execution...');
        setOutput(null);

        try {
            // Determine test cases (support legacy single case or new multi-case)
            const cases = (currentProblem.testCases && currentProblem.testCases.length > 0)
                ? currentProblem.testCases
                : [{
                    input: '',
                    expectedOutput: currentProblem.expectedOutput,
                    isPublic: true
                }];

            for (let i = 0; i < cases.length; i++) {
                const tc = cases[i];
                setExecutionStatus(`Running Test Case ${i + 1} / ${cases.length}`);

                // Add slight delay between calls to avoid rate limits if many cases
                if (i > 0) await new Promise(r => setTimeout(r, 500));

                const response = await executeCode(code, tc.input || '');

                if (response.stderr?.trim()) {
                    setOutput({ type: 'error', content: `Error on Case ${i + 1}: ${response.stderr.substring(0, 100)}` });
                    return;
                } else if (response.compile_output?.trim()) {
                    setOutput({ type: 'error', content: `Compile Error: ${response.compile_output.substring(0, 100)}` });
                    return;
                } else if (!response.stdout && !tc.expectedOutput) {
                    // Empty output allowed if expected is empty? Rare.
                }

                const expected = (tc.expectedOutput || '').trim();
                const actual = (response.stdout || '').trim();
                const normalize = (str) => str.replace(/\s+/g, ' ').trim();

                if (normalize(actual) !== normalize(expected)) {
                    if (tc.isPublic) {
                        setOutput({
                            type: 'error',
                            content: `Failed Case ${i + 1} (Public). Expected: "${expected}", Got: "${actual.substring(0, 30)}"`
                        });
                    } else {
                        setOutput({
                            type: 'error',
                            content: `Failed Hidden Test Case ${i + 1}. Review your logic.`
                        });
                    }
                    return; // Fail fast
                }
            }

            // All cases passed
            setExecutionStatus('All cases passed!');
            const result = await solveProblem(lobbyId, groupId, currentProblem.id, currentUser.id);
            setOutput({ type: 'success', content: result.success ? 'Correct! All test cases passed.' : 'Already solved by teammate' });

        } catch (error) {
            setOutput({ type: 'error', content: error.message || 'Execution failed' });
        } finally {
            setIsRunning(false);
            setExecutionStatus(null);
        }
    };

    const handleForfeit = async () => {
        await forfeitGroup(lobbyId, groupId);
        setShowForfeitModal(false);
    };

    const goToNextProblem = () => currentProblemIndex < battleProblems.length - 1 && setCurrentProblemIndex(i => i + 1);
    const goToPrevProblem = () => currentProblemIndex > 0 && setCurrentProblemIndex(i => i - 1);

    // Loading
    if (!lobby || !currentProblem) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
                <div className="spinner" />
            </div>
        );
    }

    // Manager has left - show message and redirect
    if (managerLeft) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', flexDirection: 'column', gap: '16px', paddingTop: '80px' }}>
                <XIcon size={48} color="var(--red)" />
                <h2 style={{ fontSize: '20px' }}>Organizer Left</h2>
                <p style={{ color: 'var(--text-secondary)' }}>The organizer has left the battle.</p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Redirecting to home...</p>
            </div>
        );
    }

    // Not logged in
    if (!currentUser) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', flexDirection: 'column', gap: '16px', paddingTop: '80px' }}>
                <h2 style={{ fontSize: '20px' }}>Authentication Required</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Please log in to participate in battles.</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Go to Home
                </button>
            </div>
        );
    }

    // Invalid group (doesn't exist)
    if (!myGroup) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', flexDirection: 'column', gap: '16px', paddingTop: '80px' }}>
                <h2 style={{ fontSize: '20px' }}>Invalid Team</h2>
                <p style={{ color: 'var(--text-secondary)' }}>This team no longer exists.</p>
                <button className="btn btn-secondary" onClick={() => navigate(`/group-battle/${lobbyId}`)}>
                    Return to Lobby
                </button>
            </div>
        );
    }

    // Determine results
    const sortedGroups = Object.entries(lobby.groups || {}).sort((a, b) => {
        const scoreDiff = (b[1].score || 0) - (a[1].score || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return (a[1].lastSolvedAt || Infinity) - (b[1].lastSolvedAt || Infinity);
    });
    const winner = sortedGroups[0];
    const myScore = myGroup?.score || 0;
    const isWinner = winner && winner[0] === groupId;
    const totalProblems = battleProblems.length;

    // If status went back to LOBBY, redirect immediately (new battle starting)
    if (lobby.status === 'LOBBY') {
        navigate(`/group-battle/${lobbyId}`);
        return null;
    }

    // Battle ended - Victory/Defeat/Draw screen
    if (lobby.status === 'COMPLETED') {
        if (!showResults) {
            return (
                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
                    <Loader size={48} className="spin" style={{ color: 'var(--accent)', marginBottom: '24px' }} />
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text-primary)' }}>Calculating Results...</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Syncing final scores</p>
                </div>
            );
        }

        // Check if it's a draw (all teams have 0 score)
        // Check if it's a draw (all teams have 0 score)
        const allTeamsZeroScore = sortedGroups.every(([, g]) => (g.score || 0) === 0);
        const isDraw = allTeamsZeroScore;
        const isWinner = !isDraw && winner && winner[0] === groupId;

        return (
            <div style={{
                height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '420px', textAlign: 'center', padding: '0 24px' }}>
                    {/* Background Glow */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '120%', height: '120%',
                        background: isDraw
                            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)'
                            : isWinner
                                ? 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)'
                                : 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
                        pointerEvents: 'none', zIndex: 0
                    }} />

                    {/* Content */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: isDraw ? 'rgba(245, 158, 11, 0.1)' : isWinner ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: isDraw ? 'var(--yellow)' : isWinner ? 'var(--green)' : 'var(--red)',
                            marginBottom: '32px'
                        }}>
                            {isDraw ? <ShieldAlert size={40} /> : isWinner ? <Crown size={40} /> : myGroup?.forfeited ? <FlagOff size={40} /> : <ShieldAlert size={40} />}
                        </div>

                        <h2 style={{ margin: '0 0 8px', fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                            {isDraw ? 'Draw' : isWinner ? 'Victory' : myGroup?.forfeited ? 'Forfeited' : 'Defeated'}
                        </h2>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '40px' }}>
                            {isDraw ? 'Neither team scored. It\'s a tie!' : isWinner ? 'Great job! Your team won the battle.' : myGroup?.forfeited ? 'Your team forfeited the match.' : 'Keep practicing, better luck next time.'}
                        </p>

                        <div style={{
                            display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '40px',
                            padding: '16px', background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)'
                        }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>Score</span>
                                <span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>{myScore}/{totalProblems}</span>
                            </div>
                            <div>
                                <span style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>Time</span>
                                <span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{formatTime(elapsedTime)}</span>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/group-battle/${lobbyId}`)}
                            style={{
                                width: '100%', padding: '16px', fontSize: '15px', borderRadius: '14px',
                                background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', fontWeight: '600', cursor: 'pointer'
                            }}
                        >
                            Return to Lobby
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Forfeited screen
    if (myGroup?.forfeited) {
        return (
            <div style={{
                height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-primary)', flexDirection: 'column', gap: '24px'
            }}>
                <Flag size={48} color="var(--red)" />
                <h1 style={{ fontSize: '24px', fontWeight: '600' }}>Team Forfeited</h1>
                <p style={{ color: 'var(--text-secondary)' }}>A team member forfeited the match</p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Returning to lobby...</p>
            </div>
        );
    }

    const solvedCount = battleProblems.filter(p => isSolvedByMyGroup(p.id)).length;

    // Battle in progress
    return (
        <div style={{ position: 'fixed', top: '80px', left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
                height: '52px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', padding: '0 20px',
                justifyContent: 'space-between', background: 'var(--bg-elevated)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: myGroup?.color || 'var(--accent)' }} />
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>{myGroup?.name}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        Score: <span style={{ color: 'var(--green)', fontWeight: '600' }}>{solvedCount}</span>/{totalProblems}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        fontFamily: 'monospace', fontSize: '15px', color: 'var(--text-primary)',
                        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                        padding: '4px 12px', borderRadius: '6px'
                    }}>
                        {formatTime(elapsedTime)}
                    </div>
                    {teammates.map(tm => {
                        const tmActivity = activity?.[tm.id];
                        const pIdx = tmActivity?.currentProblemIndex || 0;
                        const isSame = pIdx === currentProblemIndex;
                        return (
                            <div key={tm.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                                <Avatar name={tm.name} avatar={lobby.players?.[tm.id]?.avatar || tm.avatar} size={22} />
                                <span style={{ color: 'var(--text-tertiary)' }}>{tm.name}</span>
                                <span style={{ color: isSame ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: '500' }}>P{pIdx + 1}</span>
                            </div>
                        );
                    })}

                    <button
                        onClick={() => setShowForfeitModal(true)}
                        style={{
                            background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)',
                            padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px',
                            display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                    >
                        <Flag size={10} /> Forfeit
                    </button>
                </div>
            </div>

            {/* Problem Tabs */}
            <div style={{
                height: '42px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: '2px',
                padding: '0 20px', background: 'var(--bg-secondary)', overflowX: 'auto'
            }}>
                {battleProblems.map((p, idx) => {
                    const byUs = isSolvedByMyGroup(p.id);
                    const solved = byUs; // For this view, only care if WE solved it
                    const active = idx === currentProblemIndex;

                    return (
                        <button
                            key={p.id}
                            onClick={() => !solved && setCurrentProblemIndex(idx)}
                            disabled={solved}
                            style={{
                                padding: '5px 12px', borderRadius: '6px', border: 'none',
                                background: active ? 'var(--accent)' : 'transparent',
                                color: active ? 'white' : solved ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                                cursor: solved ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: '5px',
                                fontSize: '11px', fontWeight: '500', opacity: 1, // Always visible
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {solved ? (byUs ? <Check size={10} color="var(--green)" /> : <Lock size={10} />) : <span>{idx + 1}</span>}
                            <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</span>
                        </button>
                    );
                })}
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '340px 1fr', minHeight: 0 }}>
                {/* Problem Description */}
                {/* Problem Description */}
                <div style={{ borderRight: '1px solid var(--border)', padding: '20px', overflowY: 'auto', background: 'var(--bg-elevated)' }}>
                    {isSolvedByMyGroup(currentProblem.id) ? (
                        <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <Check size={24} color="var(--green)" />
                            </div>
                            <h2 style={{ fontSize: '16px', marginBottom: '6px' }}>Solved</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Your team earned a point</p>

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                                <button className="btn btn-secondary" onClick={goToPrevProblem} disabled={currentProblemIndex === 0} style={{ fontSize: '12px', padding: '8px 14px' }}>
                                    <ChevronLeft size={12} /> Prev
                                </button>
                                <button className="btn btn-primary" onClick={goToNextProblem} disabled={currentProblemIndex === battleProblems.length - 1} style={{ fontSize: '12px', padding: '8px 14px' }}>
                                    Next <ChevronRight size={12} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>{currentProblem.title}</h1>

                            {currentProblem.requiresManualInput && (
                                <div style={{
                                    background: 'rgba(251, 191, 36, 0.1)',
                                    border: '1px solid rgba(251, 191, 36, 0.3)',
                                    borderRadius: '8px',
                                    padding: '10px 12px',
                                    marginBottom: '14px',
                                    fontSize: '12px',
                                    lineHeight: '1.5'
                                }}>
                                    <div style={{ fontWeight: '600', color: 'rgb(251, 191, 36)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>⚠️</span> Special Input Format
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)' }}>
                                        {currentProblem.inputInstructions || 'This problem requires a custom data structure. Check the test case inputs carefully.'}
                                    </div>
                                </div>
                            )}

                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '20px', fontSize: '13px' }}>{currentProblem.description}</p>

                            <h3 style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: '10px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                                Examples <InfoTooltip text="Use these public test cases to understand the required logic." />
                            </h3>
                            {(
                                (currentProblem.sampleCases && currentProblem.sampleCases.length > 0)
                                    ? currentProblem.sampleCases
                                    : (currentProblem.testCases || []).some(tc => tc.isPublic)
                                        ? (currentProblem.testCases || []).filter(tc => tc.isPublic)
                                        : (currentProblem.testCases || []).slice(0, 2)
                            ).map((tc, i) => (
                                <div key={i} style={{
                                    background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px',
                                    marginBottom: '6px', fontFamily: 'monospace', fontSize: '11px', border: '1px solid var(--border)'
                                }}>
                                    <div style={{ color: 'var(--text-tertiary)' }}>Input: <span style={{ color: 'var(--text-secondary)' }}>{tc.input}</span></div>
                                    <div style={{ color: 'var(--text-tertiary)' }}>Output: <span style={{ color: 'var(--text-primary)' }}>{tc.expectedOutput}</span></div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Editor */}
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <div style={{ flex: 1 }}>
                        <Editor
                            height="100%"
                            defaultLanguage="cpp"
                            theme="vs-dark"
                            value={code}
                            onChange={setCode}
                            options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 14 }, readOnly: isSolvedByMyGroup(currentProblem.id), lineHeight: 20 }}
                        />
                    </div>

                    <div style={{
                        height: '52px', borderTop: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0 20px', background: 'var(--bg-elevated)'
                    }}>
                        {output && (
                            <div style={{
                                fontSize: '12px', color: output.type === 'error' ? 'var(--red)' : output.type === 'success' ? 'var(--green)' : 'var(--accent)',
                                display: 'flex', alignItems: 'center', gap: '6px'
                            }}>
                                {output.type === 'error' ? <AlertCircle size={12} /> : <Check size={12} />}
                                {output.content}
                            </div>
                        )}

                        <button
                            className="btn btn-primary"
                            onClick={handleRunCode}
                            disabled={isRunning || isSolvedByMyGroup(currentProblem.id)}
                            style={{ marginLeft: 'auto', padding: '6px 16px', fontSize: '13px' }}
                        >
                            {isRunning ? (
                                <><Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> {executionStatus || 'Running'}</>
                            ) : (
                                <><Play size={12} /> Submit</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Forfeit Modal */}
            {showForfeitModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }} onClick={() => setShowForfeitModal(false)}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '16px',
                        padding: '28px', maxWidth: '380px', width: '90%', textAlign: 'center'
                    }}>
                        <Flag size={28} color="var(--red)" style={{ marginBottom: '14px' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '6px' }}>Forfeit Match</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '13px' }}>
                            Your entire team will lose the match. This cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn btn-secondary" onClick={() => setShowForfeitModal(false)} style={{ flex: 1 }}>Cancel</button>
                            <button onClick={handleForfeit} style={{
                                flex: 1, background: 'var(--red)', border: 'none', color: 'white',
                                padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500'
                            }}>Forfeit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamBattleArena;
