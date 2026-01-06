import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Clock, Loader, Swords, Flag, Target, UserPlus, X, Check, Users, Code, CheckCircle, XCircle, AlertCircle, LogIn, Eye, AlertTriangle, Zap, Info, Trophy, ChevronDown, Filter, Crown, ShieldAlert, FlagOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { executeCode } from '../services/judge0';
import { joinQueue, leaveQueue, subscribeToMatchmaking, subscribeToBattle, updatePlayerProgress, forfeitBattle } from '../services/matchmaking';
import { setPlayerOnline, subscribeToOnlinePlayers, sendChallenge, subscribeToIncomingChallenge, acceptChallenge, declineChallenge, subscribeToChallengeResponse, setPlayerStatus } from '../services/onlinePlayers';
import { getRandomProblem, getAllCategories } from '../data/problems';
import { initUserStats, recordBattleResult, checkAchievements, incrementGlobalStats } from '../services/userStats';
import { subscribeToFriends, subscribeToFriendsOnlineStatus } from '../services/friendsService';

const MATCHMAKING_TIMEOUT = 30000; // 30 seconds

const ArenaPage = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
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
    const [showSolutionModal, setShowSolutionModal] = useState(false);
    const [solutionRevealed, setSolutionRevealed] = useState(false);
    const [friends, setFriends] = useState([]);
    const [friendStatuses, setFriendStatuses] = useState({});

    const unsubscribeRef = useRef(null);
    const battleUnsubRef = useRef(null);
    const onlineUnsubRef = useRef(null);
    const challengeUnsubRef = useRef(null);
    const timeoutRef = useRef(null);
    const searchIntervalRef = useRef(null);
    const friendsUnsubRef = useRef(null);
    const challengeTriggeredRef = useRef(false);
    const [code, setCode] = useState(currentProblem.starterCode);

    // Initialize user stats on mount
    useEffect(() => {
        if (user) {
            initUserStats(user.id, user.name, user.avatar);
        }
    }, [user]);

    // Handle challenge from FriendsPage navigation
    useEffect(() => {
        if (user && location.state?.challengeFriend && !challengeTriggeredRef.current) {
            const friend = location.state.challengeFriend;
            const options = location.state.challengeOptions || {};

            challengeTriggeredRef.current = true;
            // Clear the state so it doesn't re-trigger on re-renders
            window.history.replaceState({}, document.title);

            // Auto-trigger the challenge with options
            const problem = getRandomProblem(options);
            sendChallenge({ id: user.id, name: user.name, avatar: user.avatar }, friend.id, problem);
            setChallengeSent({ target: friend, problem });
            subscribeToChallengeResponse(friend.id,
                (c) => startBattle(c.battleId, friend, c.problem, null),
                () => setChallengeSent(null),
                () => setChallengeSent(null)
            );
        }
    }, [user, location.state]);

    useEffect(() => {
        if (user) {
            onlineUnsubRef.current = subscribeToOnlinePlayers(user.id, (players) => {
                setOnlinePlayers(players.filter(p => p.status === 'available'));
            });
            challengeUnsubRef.current = subscribeToIncomingChallenge(user.id, setIncomingChallenge);
            // Subscribe to friends list
            friendsUnsubRef.current = subscribeToFriends(user.id, setFriends);
            return () => {
                if (onlineUnsubRef.current) onlineUnsubRef.current();
                if (challengeUnsubRef.current) challengeUnsubRef.current();
                if (friendsUnsubRef.current) friendsUnsubRef.current();
            };
        }
    }, [user]);

    // Subscribe to friends' online status
    useEffect(() => {
        if (friends.length > 0) {
            const friendIds = friends.map(f => f.id);
            const unsub = subscribeToFriendsOnlineStatus(friendIds, setFriendStatuses);
            return unsub;
        }
    }, [friends]);

    // Challenge & Filtering State
    const [soloOptions, setSoloOptions] = useState({ difficulty: 'Random', category: 'Random' });
    const [matchmakingOptions, setMatchmakingOptions] = useState({ difficulty: 'Random', category: 'Random' });
    const [showMatchmakingSettings, setShowMatchmakingSettings] = useState(false);
    const [categories, setCategories] = useState([]);

    // Friend Challenge Settings State
    const [showFriendChallengeSettings, setShowFriendChallengeSettings] = useState(false);
    const [friendChallengeTarget, setFriendChallengeTarget] = useState(null);
    const [friendChallengeOptions, setFriendChallengeOptions] = useState({ difficulty: 'Random', category: 'Random' });

    useEffect(() => {
        setCategories(getAllCategories().sort());
    }, []);

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
            const key = await joinQueue({ id: user.id, name: user.name }, matchmakingOptions);
            setQueueKey(key);
            setShowMatchmakingSettings(false);

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

    const handlePractice = () => {
        const problem = getRandomProblem(soloOptions);
        setCurrentProblem(problem);
        setCode(problem.starterCode);
        setGameState('playing');
        setBattleResult(null);
        setBattleStartTime(Date.now());
        setOpponent(null);
        setBattleId(null);
        setSearchTimer(0);
        setShowSoloSettings(false);
    };

    const [showSoloSettings, setShowSoloSettings] = useState(false);

    const handleRevealSolution = () => {
        setSolutionRevealed(true);
        setShowSolutionModal(false);
        if (opponent) {
            forfeitBattle(battleId, user.id);
        }
    };

    const handleChallenge = async (target, options = {}) => {
        const problem = getRandomProblem(options);
        await sendChallenge({ id: user.id, name: user.name, avatar: user.avatar }, target.id, problem);
        setChallengeSent({ target, problem });
        setShowOnlinePlayers(false); // Close friend list modal if open
        setShowFriendChallengeSettings(false); // Close settings modal if open
        subscribeToChallengeResponse(target.id,
            (c) => startBattle(c.battleId, target, c.problem, null),
            () => setChallengeSent(null),
            () => setChallengeSent(null)
        );
    };

    const openFriendChallengeSettings = (friend) => {
        setFriendChallengeTarget(friend);
        setFriendChallengeOptions({ difficulty: 'Random', category: 'Random' });
        setShowOnlinePlayers(false);
        setShowFriendChallengeSettings(true);
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
        setOutput(null);

        try {
            // Determine test cases - supporting legacy single case
            const cases = (currentProblem.testCases && currentProblem.testCases.length > 0)
                ? currentProblem.testCases
                : [{
                    input: '',
                    expectedOutput: currentProblem.expectedOutput,
                    isPublic: true
                }];

            for (let i = 0; i < cases.length; i++) {
                const tc = cases[i];
                // Show progress without trailing dots as requested
                setOutput({ type: 'info', content: `Running Test Case ${i + 1} / ${cases.length}` });

                // Small delay to prevent rate limiting
                if (i > 0) await new Promise(r => setTimeout(r, 200));

                const result = await executeCode(code, tc.input || '');

                if (result.compile_output) {
                    setOutput({ type: 'error', content: `Compile Error:\n${result.compile_output}` });
                    setIsRunning(false);
                    return;
                } else if (result.stderr) {
                    setOutput({ type: 'error', content: `Runtime Error (Case ${i + 1}):\n${result.stderr}` });
                    setIsRunning(false);
                    return;
                }

                const expected = (tc.expectedOutput || '').trim();
                const actual = (result.stdout || '').trim();
                // Normalize newlines and spaces
                const normalize = (str) => str.replace(/\s+/g, ' ').trim();

                if (normalize(actual) !== normalize(expected)) {
                    setOutput({
                        type: 'warning',
                        content: `Wrong Answer on Case ${i + 1}/${cases.length}\nExpected: "${expected}"\nGot: "${actual.substring(0, 50)}${actual.length > 50 ? '...' : ''}"`
                    });
                    setIsRunning(false);
                    return;
                }
            }

            // If we get here, ALL passed
            setOutput({ type: 'success', content: 'All passed! Perfect solution.' });
            if (battleId) await updatePlayerProgress(battleId, user.id, 1, true);

        } catch (e) {
            setOutput({ type: 'error', content: e.message || 'Execution failed' });
        }
        setIsRunning(false);
    };



    const handlePlayAgain = () => {
        setGameState('lobby');
        setTimer(0);
        setBattleResult(null);
        setBattleId(null);
        setOpponent(null);
        setNewAchievements([]);
        setSolutionRevealed(false);
        if (battleUnsubRef.current) battleUnsubRef.current();
        if (user) setPlayerStatus(user.id, 'available');
    };



    const ResultIcon = battleResult === 'win' ? Crown : ShieldAlert;

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
                        <Trophy size={48} style={{ color: 'var(--orange)', marginBottom: '16px' }} />
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

            {/* Challenge Friend Modal */}
            {showOnlinePlayers && (
                <Modal onClose={() => setShowOnlinePlayers(false)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 className="headline-small" style={{ margin: 0 }}>Challenge Friend</h2>
                        <button onClick={() => setShowOnlinePlayers(false)} className="btn btn-ghost" style={{ padding: '8px' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Online Friends */}
                    {friends.filter(f => friendStatuses[f.id]).length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {friends.filter(f => friendStatuses[f.id]).map(f => (
                                <div
                                    key={f.id}
                                    onClick={() => openFriendChallengeSettings(f)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: '12px',
                                        cursor: 'pointer', transition: 'background 0.15s'
                                    }}
                                >
                                    {f.avatar ? (
                                        <img
                                            src={f.avatar}
                                            alt={f.name}
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '15px' }}>
                                            {f.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '500' }}>{f.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--green)' }}>Online</div>
                                    </div>
                                    <Swords size={16} style={{ color: 'var(--accent)' }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Users size={32} style={{ marginBottom: '12px', opacity: 0.5, color: 'var(--text-tertiary)' }} />
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                {friends.length === 0 ? 'No friends added yet' : 'No friends online right now'}
                            </p>
                            <Link to="/friends" onClick={() => setShowOnlinePlayers(false)} style={{ textDecoration: 'none' }}>
                                <button className="btn btn-primary" style={{ marginTop: '12px', padding: '10px 20px' }}>
                                    <UserPlus size={16} /> Add Friends
                                </button>
                            </Link>
                        </div>
                    )}

                    {/* Offline Friends */}
                    {friends.filter(f => !friendStatuses[f.id]).length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <span className="caption" style={{ display: 'block', marginBottom: '8px' }}>OFFLINE</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {friends.filter(f => !friendStatuses[f.id]).map(f => (
                                    <div
                                        key={f.id}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: '10px',
                                            opacity: 0.5
                                        }}
                                    >
                                        {f.avatar ? (
                                            <img src={f.avatar} alt={f.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>{f.name?.charAt(0).toUpperCase()}</div>
                                        )}
                                        <div style={{ flex: 1, fontSize: '14px' }}>{f.name}</div>
                                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Offline</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Modal>
            )}

            {/* Solution Reveal Modal */}
            {showSolutionModal && (
                <Modal onClose={() => setShowSolutionModal(false)}>
                    <div style={{ textAlign: 'center' }}>
                        <AlertTriangle size={48} style={{ color: 'var(--orange)', marginBottom: '16px' }} />
                        <h2 className="headline-small" style={{ marginBottom: '8px' }}>Reveal Solution?</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            This will show you the complete solution and all test cases.
                        </p>
                        {opponent && (
                            <div style={{
                                background: 'rgba(255, 69, 58, 0.12)',
                                border: '1px solid rgba(255, 69, 58, 0.3)',
                                borderRadius: '10px',
                                padding: '12px',
                                marginBottom: '20px'
                            }}>
                                <p style={{ color: 'var(--red)', fontSize: '14px', fontWeight: '500', margin: 0 }}>
                                    <Zap size={14} style={{ display: 'inline', marginRight: '4px' }} /> This will forfeit the battle and count as a loss
                                </p>
                            </div>
                        )}
                        {!opponent && (
                            <p style={{ color: 'var(--orange)', fontSize: '13px', marginBottom: '20px' }}>
                                Practice mode - no penalty applied
                            </p>
                        )}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowSolutionModal(false)}
                                style={{
                                    flex: 1, padding: '12px', background: 'transparent',
                                    border: '1px solid var(--border)', borderRadius: '980px',
                                    color: 'var(--text)', cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRevealSolution}
                                style={{
                                    flex: 1, padding: '12px',
                                    background: 'var(--red)', border: 'none', borderRadius: '980px',
                                    color: 'white', cursor: 'pointer', fontWeight: '500'
                                }}
                            >
                                Reveal Solution
                            </button>
                        </div>
                    </div>
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
                            <button className="btn btn-primary" onClick={() => user ? setShowMatchmakingSettings(true) : setShowAuthModal(true)} style={{ width: '100%', padding: '14px' }}>
                                <Target size={18} /> Find Match
                            </button>
                            <button onClick={() => user ? setShowOnlinePlayers(true) : setShowAuthModal(true)} style={{
                                width: '100%', padding: '14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                borderRadius: '980px', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}>
                                <UserPlus size={18} /> Challenge Friend
                            </button>
                            <button onClick={() => user ? navigate('/group-battle') : setShowAuthModal(true)} style={{
                                width: '100%', padding: '14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                borderRadius: '980px', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}>
                                <Users size={18} /> Group Battle
                            </button>
                            <button onClick={() => setShowSoloSettings(true)} style={{
                                width: '100%', padding: '14px', background: 'transparent', border: 'none',
                                borderRadius: '980px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}>
                                <Code size={18} /> Solo Practice
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Matchmaking Settings Modal */}
            {showMatchmakingSettings && (
                <Modal onClose={() => setShowMatchmakingSettings(false)}>
                    <div style={{ textAlign: 'center' }}>
                        <Target size={40} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
                        <h2 className="headline-small" style={{ marginBottom: '8px' }}>Matchmaking Settings</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                            Find a worthy opponent
                        </p>

                        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Difficulty</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['Random', 'Easy', 'Medium', 'Hard'].map(diff => (
                                    <button
                                        key={diff}
                                        onClick={() => setMatchmakingOptions({ ...matchmakingOptions, difficulty: diff })}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: matchmakingOptions.difficulty === diff ? '1px solid var(--accent)' : '1px solid var(--border)',
                                            background: matchmakingOptions.difficulty === diff ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-secondary)',
                                            color: matchmakingOptions.difficulty === diff ? 'var(--accent)' : 'var(--text-secondary)',
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

                        <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Category</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={matchmakingOptions.category}
                                    onChange={(e) => setMatchmakingOptions({ ...matchmakingOptions, category: e.target.value })}
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
                                onClick={() => setShowMatchmakingSettings(false)}
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
                                onClick={handleAutoMatch}
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
                                <Target size={16} /> Find Match
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Solo Settings Modal */}
            {showSoloSettings && (
                <Modal onClose={() => setShowSoloSettings(false)}>
                    <div style={{ textAlign: 'center' }}>
                        <Code size={40} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} />
                        <h2 className="headline-small" style={{ marginBottom: '8px' }}>Practice Settings</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                            Customize your practice session
                        </p>

                        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Difficulty</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['Random', 'Easy', 'Medium', 'Hard'].map(diff => (
                                    <button
                                        key={diff}
                                        onClick={() => setSoloOptions({ ...soloOptions, difficulty: diff })}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: soloOptions.difficulty === diff ? '1px solid var(--accent)' : '1px solid var(--border)',
                                            background: soloOptions.difficulty === diff ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-secondary)',
                                            color: soloOptions.difficulty === diff ? 'var(--accent)' : 'var(--text-secondary)',
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

                        <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Category</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={soloOptions.category}
                                    onChange={(e) => setSoloOptions({ ...soloOptions, category: e.target.value })}
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

                        <button className="btn btn-primary" onClick={handlePractice} style={{ width: '100%', padding: '12px' }}>
                            Start Practice
                        </button>
                    </div>
                </Modal>
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
                    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', overflow: 'auto' }}>
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

                            {/* Sample I/O */}
                            {currentProblem.testCases && currentProblem.testCases.length > 0 && (
                                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                                    <span className="caption" style={{ display: 'block', marginBottom: '10px' }}>SAMPLE I/O</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {currentProblem.testCases.slice(0, 2).map((tc, idx) => (
                                            <div key={idx} style={{
                                                background: 'var(--bg)',
                                                borderRadius: '8px',
                                                padding: '10px 12px',
                                                border: '1px solid var(--border)',
                                                fontSize: '12px'
                                            }}>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <span style={{ color: 'var(--text-tertiary)', fontSize: '10px', fontWeight: '600' }}>IN</span>
                                                        <code className="mono" style={{ display: 'block', color: 'var(--text)', marginTop: '2px' }}>{tc.input}</code>
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <span style={{ color: 'var(--text-tertiary)', fontSize: '10px', fontWeight: '600' }}>OUT</span>
                                                        <code className="mono" style={{ display: 'block', color: 'var(--green)', marginTop: '2px' }}>{tc.expectedOutput}</code>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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

                        {/* View Solution Button */}
                        {!solutionRevealed && gameState === 'playing' && (
                            <div style={{ padding: '0 20px 16px' }}>
                                <button
                                    onClick={() => setShowSolutionModal(true)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        background: 'transparent',
                                        border: '1px dashed var(--border)',
                                        borderRadius: '8px',
                                        color: 'var(--text-tertiary)',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <Eye size={14} />
                                    View Solution {opponent && '(forfeit)'}
                                </button>
                            </div>
                        )}

                        {/* Revealed Solution */}
                        {solutionRevealed && (
                            <div style={{ padding: '0 20px 20px' }}>
                                <div style={{
                                    background: 'rgba(255, 159, 10, 0.08)',
                                    border: '1px solid rgba(255, 159, 10, 0.3)',
                                    borderRadius: '12px',
                                    padding: '16px'
                                }}>
                                    <span className="caption" style={{ display: 'block', marginBottom: '10px', color: 'var(--orange)' }}>
                                        SOLUTION (REVEALED)
                                    </span>
                                    <pre className="mono" style={{
                                        margin: 0,
                                        fontSize: '11px',
                                        whiteSpace: 'pre-wrap',
                                        color: 'var(--text)',
                                        maxHeight: '150px',
                                        overflow: 'auto'
                                    }}>
                                        {currentProblem.solution}
                                    </pre>

                                    {/* All Test Cases */}
                                    {currentProblem.testCases && (
                                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '600' }}>
                                                ALL TEST CASES ({currentProblem.testCases.length})
                                            </span>
                                            <div style={{ marginTop: '8px', maxHeight: '120px', overflow: 'auto' }}>
                                                {currentProblem.testCases.map((tc, idx) => (
                                                    <div key={idx} style={{
                                                        fontSize: '11px',
                                                        padding: '6px 8px',
                                                        background: 'var(--bg)',
                                                        borderRadius: '6px',
                                                        marginBottom: '4px'
                                                    }}>
                                                        <span className="mono" style={{ color: 'var(--text-secondary)' }}>
                                                            {tc.input} → <span style={{ color: 'var(--green)' }}>{tc.expectedOutput}</span>
                                                        </span>
                                                        {tc.explanation && (
                                                            <span style={{ color: 'var(--text-tertiary)', marginLeft: '8px' }}>
                                                                ({tc.explanation})
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Result Overlay */}
                        {/* Result Overlay */}
                        {gameState === 'finished' && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                width: '100vw',
                                height: '100vh',
                                background: 'rgba(5, 5, 5, 0.6)',
                                backdropFilter: 'blur(12px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 2000,
                                animation: 'fadeIn 0.4s ease-out'
                            }}>
                                <div style={{
                                    background: 'var(--bg-elevated)',
                                    borderRadius: '32px',
                                    padding: '56px 48px',
                                    width: '100%',
                                    maxWidth: '440px',
                                    textAlign: 'center',
                                    boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.6), 0 0 0 1px var(--border)',
                                    animation: 'scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {/* Ambient Glow */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-50%',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '100%',
                                        height: '100%',
                                        background: battleResult === 'win'
                                            ? 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)'
                                            : 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
                                        pointerEvents: 'none'
                                    }} />

                                    {/* Content */}
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        {/* Icon */}
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: battleResult === 'win' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: battleResult === 'win' ? 'var(--green)' : 'var(--red)',
                                            marginBottom: '32px'
                                        }}>
                                            <ResultIcon size={40} style={{ strokeWidth: 2.5 }} />
                                        </div>

                                        {/* Title */}
                                        <h2 style={{
                                            margin: '0 0 8px',
                                            fontSize: '32px',
                                            fontWeight: '700',
                                            letterSpacing: '-0.02em',
                                            color: 'var(--text)'
                                        }}>
                                            {battleResult === 'win' ? 'Victory' : 'Defeated'}
                                        </h2>

                                        <p style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '16px',
                                            marginBottom: '40px'
                                        }}>
                                            {battleResult === 'win' ? 'Great job! You solved it.' : 'Keep practicing, you will get it next time.'}
                                        </p>

                                        {/* Stats Row */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginBottom: '40px',
                                            padding: '16px',
                                            background: 'var(--bg)',
                                            borderRadius: '16px',
                                            border: '1px solid var(--border)'
                                        }}>
                                            <div style={{ padding: '0 24px' }}>
                                                <span style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>Time</span>
                                                <span className="mono" style={{ fontSize: '18px', color: 'var(--text)' }}>{formatTime(timer)}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <button
                                                className="btn"
                                                onClick={handlePlayAgain}
                                                style={{
                                                    width: '100%',
                                                    padding: '16px',
                                                    fontSize: '15px',
                                                    borderRadius: '14px',
                                                    background: 'var(--text)',
                                                    color: 'var(--bg)',
                                                    border: 'none',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.1s'
                                                }}
                                                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                Play Again
                                            </button>

                                            <button
                                                className="btn"
                                                onClick={() => setGameState('lobby')}
                                                style={{
                                                    width: '100%',
                                                    padding: '16px',
                                                    fontSize: '15px',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                Return to Lobby
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <style>{`
                                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                                    @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                                `}</style>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Friend Challenge Settings Modal */}
            {showFriendChallengeSettings && friendChallengeTarget && (
                <Modal onClose={() => setShowFriendChallengeSettings(false)}>
                    <div style={{ padding: '0 4px' }}>
                        <h2 className="headline-small" style={{ marginBottom: '8px' }}>Challenge {friendChallengeTarget.name}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                            Configure the battle settings
                        </p>

                        {/* Difficulty */}
                        <div style={{ marginBottom: '24px' }}>
                            <label className="caption" style={{ marginBottom: '8px', display: 'block' }}>DIFFICULTY</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['Random', 'Easy', 'Medium', 'Hard'].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setFriendChallengeOptions(prev => ({ ...prev, difficulty: d }))}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            borderRadius: '12px',
                                            border: friendChallengeOptions.difficulty === d ? '2px solid var(--accent)' : '1px solid var(--border)',
                                            background: friendChallengeOptions.difficulty === d ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                                            color: friendChallengeOptions.difficulty === d ? 'var(--accent)' : 'var(--text)',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div style={{ marginBottom: '32px' }}>
                            <label className="caption" style={{ marginBottom: '8px', display: 'block' }}>CATEGORY</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={friendChallengeOptions.category}
                                    onChange={(e) => setFriendChallengeOptions(prev => ({ ...prev, category: e.target.value }))}
                                    className="input"
                                    style={{ width: '100%', appearance: 'none', cursor: 'pointer' }}
                                >
                                    <option value="Random">Random Category</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <ChevronDown size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)' }} />
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '16px', fontSize: '16px' }}
                            onClick={() => handleChallenge(friendChallengeTarget, friendChallengeOptions)}
                        >
                            <Swords size={20} /> Send Challenge
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ArenaPage;
