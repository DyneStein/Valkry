import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Clock, Loader, Swords, Flag, Target, UserPlus, X, Check, Users, Code, CheckCircle, XCircle, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { executeCode } from '../services/judge0';
import { joinQueue, leaveQueue, subscribeToMatchmaking, subscribeToBattle, updatePlayerProgress, forfeitBattle } from '../services/matchmaking';
import { setPlayerOnline, subscribeToOnlinePlayers, sendChallenge, subscribeToIncomingChallenge, acceptChallenge, declineChallenge, subscribeToChallengeResponse, setPlayerStatus } from '../services/onlinePlayers';
import { getRandomProblem } from '../data/problems';
import { initUserStats, recordBattleResult, checkAchievements, incrementGlobalStats } from '../services/userStats';

const MATCHMAKING_TIMEOUT = 30000; // 30 seconds

const ArenaPage = () => {
    const { user } = useAuth();
    const [gameState, setGameState] = useState('lobby');
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState({ type: 'info', content: 'Click "Run" to execute your code' });
    const [queueKey, setQueueKey] = useState(null);
    const [battleId, setBattleId] = useState(null);
    const [battleStartTime, setBattleStartTime] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const [currentProblem, setCurrentProblem] = useState(getRandomProblem());
    const [timer, setTimer] = useState(0);
    const [searchTimer, setSearchTimer] = useState(0);
    const [battleResult, setBattleResult] = useState(null);
    const [onlinePlayers, setOnlinePlayers] = useState([]);
    const [incomingChallenge, setIncomingChallenge] = useState(null);
    const [challengeSent, setChallengeSent] = useState(null);
    const [showOnlinePlayers, setShowOnlinePlayers] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [newAchievements, setNewAchievements] = useState([]);

    const unsubscribeRef = useRef(null);
    const battleUnsubRef = useRef(null);
    const onlineUnsubRef = useRef(null);
    const challengeUnsubRef = useRef(null);
    const timeoutRef = useRef(null);
    const searchIntervalRef = useRef(null);
    const [code, setCode] = useState(currentProblem.starterCode);

    // Initialize user stats on mount
    useEffect(() => {
        if (user) {
            initUserStats(user.id, user.name, user.avatar);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            const cleanup = setPlayerOnline({ id: user.id, name: user.name, avatar: user.avatar });
            onlineUnsubRef.current = subscribeToOnlinePlayers(user.id, (players) => {
                setOnlinePlayers(players.filter(p => p.status === 'available'));
            });
            challengeUnsubRef.current = subscribeToIncomingChallenge(user.id, setIncomingChallenge);
            return () => {
                cleanup();
                if (onlineUnsubRef.current) onlineUnsubRef.current();
                if (challengeUnsubRef.current) challengeUnsubRef.current();
            };
        }
    }, [user]);

    useEffect(() => {
        let interval;
        if (gameState === 'playing') {
            const startTime = battleStartTime || Date.now();
            interval = setInterval(() => {
                setTimer(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState, battleStartTime]);

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const startBattle = async (id, opp, problem, startedAt) => {
        // Clear search timeout
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);

        setBattleId(id);
        setOpponent(opp);
        setCurrentProblem(problem);
        setCode(problem.starterCode);
        setGameState('playing');
        setBattleResult(null);
        setBattleStartTime(startedAt || Date.now());
        setChallengeSent(null);
        setSearchTimer(0);
        if (user) setPlayerStatus(user.id, 'in_battle');

        // Increment global battle count
        incrementGlobalStats('battle');

        const unsub = subscribeToBattle(id, async (battle) => {
            if (battle.startedAt) setBattleStartTime(battle.startedAt);
            if (battle.status === 'finished') {
                const isP1 = battle.player1.id === user.id;
                const won = battle.winner === (isP1 ? 'player1' : 'player2');
                setGameState('finished');
                setBattleResult(won ? 'win' : 'lose');
                if (user) setPlayerStatus(user.id, 'available');
                if (battleUnsubRef.current) battleUnsubRef.current();

                // Record battle result and check achievements
                if (user) {
                    const battleDuration = Math.floor((Date.now() - (battle.startedAt || Date.now())) / 1000);
                    const updatedStats = await recordBattleResult(user.id, won, battleDuration);
                    const achievements = await checkAchievements(user.id, updatedStats);
                    if (achievements.new.length > 0) {
                        setNewAchievements(achievements.new);
                    }
                }
            }
        });
        battleUnsubRef.current = unsub;
    };

    const handleAutoMatch = async () => {
        if (!user) return;
        setGameState('searching');
        setSearchTimer(0);

        // Start search timer
        const startTime = Date.now();
        searchIntervalRef.current = setInterval(() => {
            setSearchTimer(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        try {
            const key = await joinQueue({ id: user.id, name: user.name });
            setQueueKey(key);

            // Set timeout for matchmaking
            timeoutRef.current = setTimeout(async () => {
                // Timeout reached - cancel search
                if (unsubscribeRef.current) unsubscribeRef.current();
                if (key) await leaveQueue(key);
                if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
                setQueueKey(null);
                setGameState('timeout');
                if (user) setPlayerStatus(user.id, 'available');
            }, MATCHMAKING_TIMEOUT);

            const unsub = subscribeToMatchmaking(user.id, key,
                (data) => { startBattle(data.battleId, data.opponent, data.problem, null); unsub(); },
                () => {
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
                    setGameState('lobby');
                }
            );
            unsubscribeRef.current = unsub;
        } catch (e) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
            setGameState('lobby');
        }
    };

    const handleCancel = async () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
        if (unsubscribeRef.current) unsubscribeRef.current();
        if (queueKey) await leaveQueue(queueKey);
        setQueueKey(null);
        setGameState('lobby');
        setSearchTimer(0);
        if (user) setPlayerStatus(user.id, 'available');
    };

    const handleChallenge = async (target) => {
        const problem = getRandomProblem();
        await sendChallenge({ id: user.id, name: user.name, avatar: user.avatar }, target.id, problem);
        setChallengeSent({ target, problem });
        setShowOnlinePlayers(false);
        subscribeToChallengeResponse(target.id,
            (c) => startBattle(c.battleId, target, c.problem, null),
            () => setChallengeSent(null),
            () => setChallengeSent(null)
        );
    };

    const handleAccept = async () => {
        const id = await acceptChallenge(user.id, user.name, incomingChallenge);
        startBattle(id, incomingChallenge.from, incomingChallenge.problem, null);
        setIncomingChallenge(null);
    };

    const handleDecline = async () => {
        await declineChallenge(user.id);
        setIncomingChallenge(null);
    };

    const handleForfeit = async () => {
        if (battleId && user) await forfeitBattle(battleId, user.id);
    };

    const handleRun = async () => {
        setIsRunning(true);
        setOutput({ type: 'info', content: 'Compiling...' });
        try {
            const result = await executeCode(code);
            if (result.compile_output) {
                setOutput({ type: 'error', content: `Compile Error:\n${result.compile_output}` });
            } else if (result.stderr) {
                setOutput({ type: 'error', content: `Runtime Error:\n${result.stderr}` });
            } else {
                const passed = result.stdout?.trim() === currentProblem.expectedOutput?.trim();
                setOutput({ type: passed ? 'success' : 'warning', content: passed ? `All tests passed!\n${result.stdout}` : `Wrong answer\nExpected: ${currentProblem.expectedOutput}\nGot: ${result.stdout}` });
                if (passed && battleId) await updatePlayerProgress(battleId, user.id, 1, true);
            }
        } catch (e) {
            setOutput({ type: 'error', content: e.message });
        }
        setIsRunning(false);
    };

    const handlePractice = () => {
        const p = getRandomProblem();
        setCurrentProblem(p);
        setCode(p.starterCode);
        setGameState('playing');
        setOpponent(null);
        setBattleId(null);
        setBattleStartTime(Date.now());
        setTimer(0);
    };

    const handlePlayAgain = () => {
        setGameState('lobby');
        setTimer(0);
        setBattleResult(null);
        setBattleId(null);
        setOpponent(null);
        setNewAchievements([]);
        if (battleUnsubRef.current) battleUnsubRef.current();
        if (user) setPlayerStatus(user.id, 'available');
    };

    const ResultIcon = battleResult === 'win' ? CheckCircle : XCircle;

    // Modal component
    const Modal = ({ children, onClose }) => (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '18px',
                padding: '32px', maxWidth: '400px', width: '90%'
            }} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );

    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingTop: '52px' }}>
            {/* Auth Required Modal */}
            {showAuthModal && (
                <Modal onClose={() => setShowAuthModal(false)}>
                    <div style={{ textAlign: 'center' }}>
                        <LogIn size={40} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
                        <h2 className="headline-small" style={{ marginBottom: '8px' }}>Sign In Required</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
                            Create an account to compete with other players
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/signin" style={{ textDecoration: 'none' }}>
                                <button className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                                    Sign In / Sign Up
                                </button>
                            </Link>
                            <button onClick={() => setShowAuthModal(false)} style={{
                                padding: '12px', background: 'transparent', border: 'none',
                                color: 'var(--text-secondary)', cursor: 'pointer'
                            }}>
                                Maybe later
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Challenge Modal */}
            {incomingChallenge && (
                <Modal>
                    <div style={{ textAlign: 'center' }}>
                        {/* Gradient glow effect */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 20px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.2), rgba(48, 209, 88, 0.2))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid var(--border)'
                        }}>
                            {incomingChallenge.from.avatar ? (
                                <img
                                    src={incomingChallenge.from.avatar}
                                    alt=""
                                    style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{
                                    width: '72px',
                                    height: '72px',
                                    borderRadius: '50%',
                                    background: 'var(--bg-elevated)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '28px',
                                    fontWeight: '600',
                                    color: 'var(--accent)'
                                }}>
                                    {incomingChallenge.from.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <h2 className="headline-small" style={{ marginBottom: '4px' }}>
                            {incomingChallenge.from.name}
                        </h2>
                        <p style={{ color: 'var(--text-tertiary)', marginBottom: '28px', fontSize: '15px' }}>
                            wants to battle you
                        </p>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={handleDecline}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    background: 'transparent',
                                    border: '1px solid var(--border)',
                                    borderRadius: '980px',
                                    color: 'var(--text)',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Decline
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleAccept}
                                style={{ flex: 1, padding: '14px' }}
                            >
                                <Swords size={16} /> Accept
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* New Achievement Modal */}
            {newAchievements.length > 0 && (
                <Modal onClose={() => setNewAchievements([])}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
                        <h2 className="headline-small" style={{ marginBottom: '8px' }}>Achievement Unlocked!</h2>
                        {newAchievements.map((a, i) => (
                            <div key={i} style={{
                                padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px',
                                marginTop: '12px', textAlign: 'left'
                            }}>
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{a.name}</div>
                                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{a.desc}</div>
                            </div>
                        ))}
                        <button className="btn btn-primary" onClick={() => setNewAchievements([])} style={{ marginTop: '20px', width: '100%', padding: '12px' }}>
                            Awesome!
                        </button>
                    </div>
                </Modal>
            )}

            {/* Online Players Modal */}
            {showOnlinePlayers && (
                <Modal onClose={() => setShowOnlinePlayers(false)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 className="headline-small" style={{ margin: 0 }}>Online Players</h2>
                        <button onClick={() => setShowOnlinePlayers(false)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '4px' }}>
                            <X size={20} />
                        </button>
                    </div>
                    {onlinePlayers.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {onlinePlayers.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => handleChallenge(p)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: '12px',
                                        cursor: 'pointer', transition: 'background 0.15s'
                                    }}
                                >
                                    {p.avatar ? (
                                        <img
                                            src={p.avatar}
                                            alt={p.name}
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '15px' }}>
                                            {p.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '500' }}>{p.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Available</div>
                                    </div>
                                    <Swords size={16} style={{ color: 'var(--accent)' }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
                            <Users size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                            <p>No players online</p>
                        </div>
                    )}
                </Modal>
            )}



            {/* Lobby */}
            {gameState === 'lobby' && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ maxWidth: '380px', width: '100%', textAlign: 'center' }}>
                        <h1 className="headline" style={{ marginBottom: '12px' }}>Ready to battle?</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
                            Compete in real-time coding challenges
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button className="btn btn-primary" onClick={() => user ? handleAutoMatch() : setShowAuthModal(true)} style={{ width: '100%', padding: '14px' }}>
                                <Target size={18} /> Find Match
                            </button>
                            <button onClick={() => user ? setShowOnlinePlayers(true) : setShowAuthModal(true)} style={{
                                width: '100%', padding: '14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                borderRadius: '980px', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}>
                                <UserPlus size={18} /> Challenge Friend
                            </button>
                            <button onClick={handlePractice} style={{
                                width: '100%', padding: '14px', background: 'transparent', border: 'none',
                                borderRadius: '980px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}>
                                <Code size={18} /> Solo Practice
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Searching */}
            {gameState === 'searching' && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }} />
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Finding opponent...</p>
                        <p className="mono" style={{ fontSize: '24px', fontWeight: '600' }}>{formatTime(searchTimer)}</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
                            Timeout in {Math.max(0, 30 - searchTimer)}s
                        </p>
                    </div>
                    <button onClick={handleCancel} style={{
                        padding: '10px 24px', background: 'transparent', border: 'none',
                        color: 'var(--accent)', cursor: 'pointer'
                    }}>
                        Cancel
                    </button>
                </div>
            )}

            {/* Timeout */}
            {gameState === 'timeout' && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px' }}>
                    <AlertCircle size={48} style={{ color: 'var(--orange)' }} />
                    <div style={{ textAlign: 'center' }}>
                        <h2 className="headline-small" style={{ marginBottom: '8px' }}>No opponents found</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Try again or practice solo</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={handleAutoMatch} className="btn btn-primary" style={{ padding: '12px 24px' }}>
                            Try Again
                        </button>
                        <button onClick={() => setGameState('lobby')} style={{
                            padding: '12px 24px', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                            borderRadius: '980px', color: 'var(--text)', cursor: 'pointer'
                        }}>
                            Back
                        </button>
                    </div>
                </div>
            )}

            {/* Challenge Sent Toast */}
            {challengeSent && gameState === 'lobby' && (
                <div style={{
                    position: 'fixed', bottom: '24px', right: '24px',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '14px',
                    padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                    <div className="spinner" style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '15px' }}>Waiting for {challengeSent.target.name}...</span>
                    <button onClick={() => setChallengeSent(null)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '4px' }}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Battle View */}
            {(gameState === 'playing' || gameState === 'finished') && (
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                    {/* Editor */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)' }}>
                        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
                            <span className="mono" style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>main.cpp</span>
                        </div>
                        <div style={{ flex: 1 }}>
                            <Editor
                                height="100%"
                                defaultLanguage="cpp"
                                theme="vs-dark"
                                value={code}
                                onChange={v => setCode(v || '')}
                                options={{
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    automaticLayout: true,
                                    readOnly: gameState === 'finished',
                                    padding: { top: 16 },
                                    fontFamily: 'SF Mono, Menlo, Monaco, monospace'
                                }}
                            />
                        </div>
                        <div style={{
                            padding: '16px 20px', borderTop: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', gap: '12px'
                        }}>
                            <button className="btn btn-primary" onClick={handleRun} disabled={isRunning || gameState === 'finished'} style={{ padding: '10px 20px' }}>
                                {isRunning ? <><div className="spinner" style={{ width: '14px', height: '14px' }} /> Running...</> : <><Play size={16} /> Run</>}
                            </button>
                            <button onClick={() => setCode(currentProblem.starterCode)} disabled={gameState === 'finished'} style={{
                                padding: '10px 16px', background: 'transparent', border: '1px solid var(--border)',
                                borderRadius: '980px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                            }}>
                                <RotateCcw size={14} /> Reset
                            </button>
                            {opponent && gameState === 'playing' && (
                                <button onClick={handleForfeit} style={{
                                    marginLeft: 'auto', padding: '10px 16px', background: 'transparent', border: 'none',
                                    color: 'var(--red)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                                }}>
                                    <Flag size={14} /> Forfeit
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Problem Panel */}
                    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
                            <span className="badge" style={{
                                marginBottom: '12px',
                                background: currentProblem.difficulty === 'EASY' ? 'rgba(48, 209, 88, 0.12)' : 'rgba(255, 159, 10, 0.12)',
                                color: currentProblem.difficulty === 'EASY' ? 'var(--green)' : 'var(--orange)'
                            }}>
                                {currentProblem.difficulty}
                            </span>
                            <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px' }}>{currentProblem.title}</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>{currentProblem.description}</p>
                        </div>

                        {/* Output */}
                        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
                            <span className="caption" style={{ marginBottom: '12px' }}>OUTPUT</span>
                            <div style={{
                                flex: 1, padding: '16px', background: 'var(--bg)', borderRadius: '12px',
                                border: '1px solid var(--border)', overflow: 'auto'
                            }}>
                                <pre className="mono" style={{
                                    margin: 0, fontSize: '13px', whiteSpace: 'pre-wrap',
                                    color: output.type === 'success' ? 'var(--green)' : output.type === 'error' ? 'var(--red)' : 'var(--text-secondary)'
                                }}>
                                    {output.content}
                                </pre>
                            </div>
                        </div>

                        {/* Result */}
                        {gameState === 'finished' && (
                            <div style={{ padding: '24px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                                <ResultIcon size={48} style={{ color: battleResult === 'win' ? 'var(--green)' : 'var(--red)', marginBottom: '12px' }} />
                                <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px', color: battleResult === 'win' ? 'var(--green)' : 'var(--red)' }}>
                                    {battleResult === 'win' ? 'Victory!' : 'Defeated'}
                                </h3>
                                <p style={{ color: 'var(--text-tertiary)', marginBottom: '20px' }}>Time: {formatTime(timer)}</p>
                                <button className="btn btn-primary" onClick={handlePlayAgain} style={{ width: '100%', padding: '14px' }}>
                                    Play Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArenaPage;
