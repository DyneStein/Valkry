// Matchmaking Service for Arena Battles
// Uses Firebase Realtime Database for real-time game state

import { database } from '../firebase';
import {
    ref,
    push,
    set,
    get,
    remove,
    onValue,
    off,
    update,
    serverTimestamp
} from 'firebase/database';

/**
 * Join the matchmaking queue
 */
export async function joinQueue(player, filters = {}) {
    const queueRef = ref(database, 'matchmaking/queue');
    const newEntry = push(queueRef);

    await set(newEntry, {
        odplayerId: player.id,
        playerName: player.name,
        joinedAt: Date.now(),
        status: 'waiting',
        battleId: null,
        filters: {
            difficulty: filters.difficulty || 'Random',
            category: filters.category || 'Random'
        }
    });

    console.log('Joined queue with key:', newEntry.key, 'player:', player.name, 'filters:', filters);
    return newEntry.key;
}

/**
 * Helper to check if two players' filters are compatible
 */
function areFiltersCompatible(filters1, filters2) {
    // Difficulty check
    if (filters1.difficulty !== 'Random' && filters2.difficulty !== 'Random' && filters1.difficulty !== filters2.difficulty) {
        return false;
    }
    // Category check
    if (filters1.category !== 'Random' && filters2.category !== 'Random' && filters1.category !== filters2.category) {
        return false;
    }
    return true;
}

/**
 * Helper to determine battle settings from two players
 */
function getBattleSettings(filters1, filters2) {
    return {
        difficulty: filters1.difficulty !== 'Random' ? filters1.difficulty : filters2.difficulty,
        category: filters1.category !== 'Random' ? filters1.category : filters2.category
    };
}

/**
 * Leave the matchmaking queue
 */
export async function leaveQueue(queueKey) {
    if (!queueKey) return;
    try {
        const entryRef = ref(database, `matchmaking/queue/${queueKey}`);
        await remove(entryRef);
        console.log('Left queue:', queueKey);
    } catch (e) {
        console.error('Error leaving queue:', e);
    }
}

/**
 * Create a new battle
 */
export async function createBattle(player1, player2, problem) {
    const battlesRef = ref(database, 'battles');
    const newBattle = push(battlesRef);

    await set(newBattle, {
        player1: {
            id: player1.id,
            name: player1.name,
            code: problem.starterCode,
            testsPassed: 0,
            finished: false
        },
        player2: {
            id: player2.id,
            name: player2.name,
            code: problem.starterCode,
            testsPassed: 0,
            finished: false
        },
        problem: {
            id: problem.id,
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            category: problem.category,
            starterCode: problem.starterCode,
            expectedOutput: problem.expectedOutput,
            testCases: problem.testCases || [],
            solution: problem.solution || '',
            explanation: problem.explanation || {}
        },
        status: 'active',
        startedAt: serverTimestamp(),
        winner: null
    });

    console.log('Created battle:', newBattle.key);
    return newBattle.key;
}

/**
 * Subscribe to battle updates
 */
export function subscribeToBattle(battleId, callback) {
    const battleRef = ref(database, `battles/${battleId}`);

    const unsubscribe = onValue(battleRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        }
    });

    return () => off(battleRef);
}

/**
 * Update player's progress in a battle
 */
export async function updatePlayerProgress(battleId, playerId, testsPassed, finished) {
    const battleRef = ref(database, `battles/${battleId}`);
    const snapshot = await get(battleRef);

    if (!snapshot.exists()) return;

    const battle = snapshot.val();
    const isPlayer1 = battle.player1.id === playerId;
    const playerKey = isPlayer1 ? 'player1' : 'player2';

    const playerRef = ref(database, `battles/${battleId}/${playerKey}`);
    await update(playerRef, { testsPassed, finished });

    if (finished) {
        await update(battleRef, {
            status: 'finished',
            winner: playerKey,
            finishedAt: Date.now()
        });
    }
}

/**
 * Forfeit a battle
 */
export async function forfeitBattle(battleId, playerId) {
    const battleRef = ref(database, `battles/${battleId}`);
    const snapshot = await get(battleRef);

    if (!snapshot.exists()) return;

    const battle = snapshot.val();
    const isPlayer1 = battle.player1.id === playerId;
    const playerKey = isPlayer1 ? 'player1' : 'player2';
    const winnerKey = isPlayer1 ? 'player2' : 'player1';

    // Mark player as forfeited and opponent as winner
    await update(ref(database, `battles/${battleId}/${playerKey}`), { forfeited: true });
    await update(battleRef, {
        status: 'finished',
        winner: winnerKey,
        finishedAt: Date.now(),
        endReason: 'forfeit'
    });
}

/**
 * Subscribe to queue and handle matchmaking
 */
export function subscribeToMatchmaking(myId, myKey, onBattleFound, onError) {
    const queueRef = ref(database, 'matchmaking/queue');
    const myEntryRef = ref(database, `matchmaking/queue/${myKey}`);

    // Watch my own entry for battleId updates
    const myEntryUnsubscribe = onValue(myEntryRef, async (snapshot) => {
        if (!snapshot.exists()) return;

        const myEntry = snapshot.val();

        // If I've been matched to a battle, notify and unsubscribe
        if (myEntry.battleId && myEntry.status === 'matched') {
            console.log('I was matched! Battle:', myEntry.battleId);

            // Get battle details
            const battleRef = ref(database, `battles/${myEntry.battleId}`);
            const battleSnap = await get(battleRef);

            if (battleSnap.exists()) {
                const battle = battleSnap.val();
                const isPlayer1 = battle.player1.id === myId;
                const opponentData = isPlayer1 ? battle.player2 : battle.player1;

                onBattleFound({
                    battleId: myEntry.battleId,
                    problem: battle.problem,
                    opponent: opponentData,
                    isPlayer1
                });
            }

            // Clean up my queue entry
            await remove(myEntryRef);
        }
    });

    // Watch the queue for potential matches
    const queueUnsubscribe = onValue(queueRef, async (snapshot) => {
        if (!snapshot.exists()) return;

        const queue = snapshot.val();
        const entries = Object.entries(queue);

        // Get my entry to know my filters
        const myEntry = queue[myKey];
        if (!myEntry || myEntry.status !== 'waiting') return;

        // Find potential opponents
        const potentialOpponents = entries
            .filter(([key, entry]) =>
                key !== myKey && // Not me
                entry.status === 'waiting' && // Waiting
                areFiltersCompatible(myEntry.filters, entry.filters) // Compatible
            )
            .sort((a, b) => a[1].joinedAt - b[1].joinedAt); // First come first served

        if (potentialOpponents.length > 0) {
            const [opponentKey, opponent] = potentialOpponents[0];

            // Determination of who creates the battle:
            // The one with the earlier join time creates it to avoid race conditions
            const matches = [
                { key: myKey, ...myEntry },
                { key: opponentKey, ...opponent }
            ].sort((a, b) => a.joinedAt - b.joinedAt);

            // Only proceed if I am the earliest joined player in this pair
            if (matches[0].key === myKey) {
                console.log('I am the host, creating battle with:', opponent.playerName);

                try {
                    // Import problem here to avoid circular dependency
                    const { getRandomProblem } = await import('../data/problems');

                    // Determine common settings
                    const battleSettings = getBattleSettings(myEntry.filters, opponent.filters);
                    const problem = getRandomProblem(battleSettings);

                    // Create battle
                    const battleId = await createBattle(
                        { id: myEntry.odplayerId, name: myEntry.playerName },
                        { id: opponent.odplayerId, name: opponent.playerName },
                        problem
                    );

                    // Update both queue entries
                    await update(ref(database, `matchmaking/queue/${myKey}`), {
                        status: 'matched',
                        battleId
                    });
                    await update(ref(database, `matchmaking/queue/${opponentKey}`), {
                        status: 'matched',
                        battleId
                    });

                } catch (error) {
                    console.error('Error creating battle:', error);
                    onError(error);
                }
            }
        }
    });

    // Return cleanup function
    return () => {
        myEntryUnsubscribe();
        off(queueRef);
    };
}
