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
export async function joinQueue(player) {
    const queueRef = ref(database, 'matchmaking/queue');
    const newEntry = push(queueRef);

    await set(newEntry, {
        odplayerId: player.id,
        playerName: player.name,
        joinedAt: Date.now(),
        status: 'waiting',
        battleId: null  // Will be set when matched
    });

    console.log('Joined queue with key:', newEntry.key, 'player:', player.name);
    return newEntry.key;
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
            expectedOutput: problem.expectedOutput
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
 * This watches the queue and when 2 players are waiting:
 * - The first player (by joinedAt) creates the battle
 * - Both players get notified via their queue entry's battleId
 */
export function subscribeToMatchmaking(myId, myKey, onBattleFound, onError) {
    const queueRef = ref(database, 'matchmaking/queue');
    const myEntryRef = ref(database, `matchmaking/queue/${myKey}`);

    // Watch my own entry for battleId updates
    const myEntryUnsubscribe = onValue(myEntryRef, async (snapshot) => {
        if (!snapshot.exists()) return;

        const myEntry = snapshot.val();
        console.log('My entry updated:', myEntry);

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

    // Watch the queue for potential matches (only first player creates battle)
    const queueUnsubscribe = onValue(queueRef, async (snapshot) => {
        if (!snapshot.exists()) return;

        const queue = snapshot.val();
        const entries = Object.entries(queue);

        // Filter waiting players
        const waitingPlayers = entries
            .filter(([key, entry]) => entry.status === 'waiting')
            .sort((a, b) => a[1].joinedAt - b[1].joinedAt);  // Sort by join time

        console.log('Waiting players:', waitingPlayers.length);

        if (waitingPlayers.length >= 2) {
            // Am I the first player (earliest joinedAt)?
            const [firstKey, firstPlayer] = waitingPlayers[0];
            const [secondKey, secondPlayer] = waitingPlayers[1];

            // Only the first player creates the battle
            if (firstKey === myKey) {
                console.log('I am first player, creating battle...');

                try {
                    // Import problem here to avoid circular dependency
                    const { getRandomProblem } = await import('../data/problems');
                    const problem = getRandomProblem();

                    // Create battle
                    const battleId = await createBattle(
                        { id: firstPlayer.odplayerId, name: firstPlayer.playerName },
                        { id: secondPlayer.odplayerId, name: secondPlayer.playerName },
                        problem
                    );

                    // Update both queue entries with battleId
                    await update(ref(database, `matchmaking/queue/${firstKey}`), {
                        status: 'matched',
                        battleId
                    });
                    await update(ref(database, `matchmaking/queue/${secondKey}`), {
                        status: 'matched',
                        battleId
                    });

                    console.log('Battle created and players matched!');
                } catch (error) {
                    console.error('Error creating battle:', error);
                    onError(error);
                }
            } else {
                console.log('Waiting for first player to create battle...');
            }
        }
    });

    // Return cleanup function
    return () => {
        myEntryUnsubscribe();
        off(queueRef);
    };
}
