// Online Players & Challenge System
// Manages player presence and direct challenges

import { database } from '../firebase';
import {
    ref,
    set,
    get,
    remove,
    onValue,
    off,
    update,
    onDisconnect
} from 'firebase/database';

/**
 * Set player as online and track presence with heartbeat
 */
export function setPlayerOnline(player) {
    const playerRef = ref(database, `online_players/${player.id}`);

    const updatePresence = () => {
        update(playerRef, {
            name: player.name,
            avatar: player.avatar || null,
            status: 'available',
            lastSeen: Date.now()
        });
    };

    // Initial set
    set(playerRef, {
        name: player.name,
        avatar: player.avatar || null,
        status: 'available',
        onlineSince: Date.now(),
        lastSeen: Date.now()
    });

    // Remove on disconnect (fallback)
    onDisconnect(playerRef).remove();

    // Heartbeat every 60s
    const interval = setInterval(updatePresence, 60000);

    return () => {
        clearInterval(interval);
        remove(playerRef);
    };
}

/**
 * Set player status
 */
export async function setPlayerStatus(playerId, status) {
    const playerRef = ref(database, `online_players/${playerId}`);
    await update(playerRef, { status, lastSeen: Date.now() });
}

/**
 * Subscribe to online players list with stale filtering
 */
export function subscribeToOnlinePlayers(myId, callback) {
    const playersRef = ref(database, 'online_players');

    const unsubscribe = onValue(playersRef, (snapshot) => {
        if (!snapshot.exists()) {
            callback([]);
            return;
        }

        const players = [];
        const now = Date.now();
        const STALE_TIMEOUT = 120000; // 2 minutes

        snapshot.forEach((child) => {
            if (child.key !== myId) {
                const data = child.val();
                // Only include if lastSeen is recent (or if it doesn't exist yet, give it a grace period - but better to require it)
                // We'll allow players without lastSeen for now to avoid breaking existing sessions, 
                // but realistically the stale ones probably don't have it or have old timestamps if we had it before.
                // Since we are adding it now, old stale users won't have it.
                // We will filter out anyone who HAS lastSeen and it's old, OR anyone who lacks it (assuming they are old stale data).

                // STRICT MODE: If lastSeen is missing, it's considered stale (cached from before this update).
                // However, legitimate other users might not have refreshed yet.
                // For this specific bug fix ("stale users showing online"), we assume those stale records validly don't have invalid timestamps because they don't have timestamps at all?
                // Actually the previous code didn't set lastSeen. So ALL existing records lack lastSeen.
                // If I enforce 'lastSeen', everyone currently online (except me) will disappear until they refresh.
                // This is Acceptable for a fix.

                if (data.lastSeen && (now - data.lastSeen < STALE_TIMEOUT)) {
                    players.push({ id: child.key, ...data });
                }
            }
        });
        callback(players);
    });

    return () => off(playersRef);
}

/**
 * Send a challenge to another player
 * Returns: { challengeRef, expiryTimeout, unsubscribe }
 */
export async function sendChallenge(from, toPlayerId, problem) {
    const challengeRef = ref(database, `challenges/${toPlayerId}`);

    await set(challengeRef, {
        from: { id: from.id, name: from.name, avatar: from.avatar || null },
        problem: {
            id: problem.id,
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            category: problem.category || 'General',
            starterCode: problem.starterCode,
            expectedOutput: problem.expectedOutput,
            testCases: problem.testCases || [],
            solution: problem.solution || '',
            explanation: problem.explanation || {}
        },
        createdAt: Date.now(),
        status: 'pending',
        battleId: null
    });

    return challengeRef;
}

/**
 * Cancel a sent challenge
 */
export async function cancelChallenge(toPlayerId) {
    const challengeRef = ref(database, `challenges/${toPlayerId}`);
    const snap = await get(challengeRef);
    if (snap.exists() && snap.val().status === 'pending') {
        await remove(challengeRef);
    }
}

/**
 * Subscribe to challenge response (for challenger)
 * Handles: accepted (returns battleId), declined, expired
 */
export function subscribeToChallengeResponse(targetId, onAccepted, onDeclined, onExpired) {
    const challengeRef = ref(database, `challenges/${targetId}`);
    let handled = false;

    // Set expiry timeout
    const expiryTimeout = setTimeout(async () => {
        if (handled) return;
        const snap = await get(challengeRef);
        if (snap.exists() && snap.val().status === 'pending') {
            await update(challengeRef, { status: 'expired' });
            setTimeout(() => remove(challengeRef), 1000);
        }
    }, 30000);

    const unsubscribe = onValue(challengeRef, (snapshot) => {
        if (handled) return;

        if (snapshot.exists()) {
            const challenge = snapshot.val();

            if (challenge.status === 'accepted' && challenge.battleId) {
                handled = true;
                clearTimeout(expiryTimeout);
                onAccepted(challenge);
            } else if (challenge.status === 'declined') {
                handled = true;
                clearTimeout(expiryTimeout);
                onDeclined();
            } else if (challenge.status === 'expired') {
                handled = true;
                clearTimeout(expiryTimeout);
                onExpired();
            }
        } else {
            // Challenge was removed (cancelled)
            if (!handled) {
                handled = true;
                clearTimeout(expiryTimeout);
                onExpired();
            }
        }
    });

    return () => {
        clearTimeout(expiryTimeout);
        off(challengeRef);
    };
}

/**
 * Subscribe to incoming challenges
 */
export function subscribeToIncomingChallenge(myId, onChallenge) {
    const challengeRef = ref(database, `challenges/${myId}`);

    const unsubscribe = onValue(challengeRef, (snapshot) => {
        if (snapshot.exists()) {
            const challenge = snapshot.val();
            if (challenge.status === 'pending') {
                onChallenge(challenge);
            } else {
                onChallenge(null);
            }
        } else {
            onChallenge(null);
        }
    });

    return () => off(challengeRef);
}

/**
 * Accept a challenge - creates battle and updates challenge
 */
export async function acceptChallenge(myId, myName, challenge) {
    const { createBattle } = await import('./matchmaking');

    // Create battle with the SAME problem from challenge
    const battleId = await createBattle(
        { id: challenge.from.id, name: challenge.from.name },
        { id: myId, name: myName },
        challenge.problem  // Use problem from challenge, not random
    );

    // Update challenge with battleId - this triggers challenger's subscription
    const challengeRef = ref(database, `challenges/${myId}`);
    await update(challengeRef, {
        status: 'accepted',
        battleId
    });

    // Clean up after challenger has received
    setTimeout(() => remove(challengeRef), 5000);

    return battleId;
}

/**
 * Decline a challenge
 */
export async function declineChallenge(myId) {
    const challengeRef = ref(database, `challenges/${myId}`);
    await update(challengeRef, { status: 'declined' });
    setTimeout(() => remove(challengeRef), 2000);
}
