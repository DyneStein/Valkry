import { database } from '../firebase';
import {
    ref,
    set,
    push,
    update,
    onValue,
    remove,
    serverTimestamp,
    get,
    runTransaction,
    onDisconnect
} from 'firebase/database';

// ==================== LOBBY MANAGEMENT ====================

export async function createLobby(hostPlayer) {
    const lobbyRef = push(ref(database, 'groupLobbies'));
    const lobbyId = lobbyRef.key;

    const lobbyData = {
        id: lobbyId,
        hostId: hostPlayer.id,
        hostName: hostPlayer.name || 'Anonymous',
        createdAt: serverTimestamp(),
        status: 'LOBBY', // LOBBY, BATTLE, COMPLETED
        players: {
            [hostPlayer.id]: {
                name: hostPlayer.name || 'Anonymous',
                avatar: hostPlayer.avatar || null,
                status: 'ONLINE',
                groupId: null,
                joinedAt: serverTimestamp()
            }
        },
        groups: {},
        battleConfig: null,
        activity: {}
    };

    await set(lobbyRef, lobbyData);
    return lobbyId;
}

export async function joinLobby(lobbyId, player) {
    const playerRef = ref(database, `groupLobbies/${lobbyId}/players/${player.id}`);

    // Set player data
    await set(playerRef, {
        name: player.name || 'Anonymous',
        avatar: player.avatar || null,
        status: 'ONLINE',
        groupId: null,
        joinedAt: serverTimestamp()
    });

    // Set up onDisconnect to auto-remove player when they leave/disconnect
    onDisconnect(playerRef).remove();

    // Return cleanup function
    return () => {
        remove(playerRef);
    };
}

export function leaveLobby(lobbyId, playerId) {
    remove(ref(database, `groupLobbies/${lobbyId}/players/${playerId}`));
}

export function subscribeToLobby(lobbyId, callback) {
    const lobbyRef = ref(database, `groupLobbies/${lobbyId}`);
    return onValue(lobbyRef, (snapshot) => {
        callback(snapshot.val());
    });
}

// Manager presence tracking - sets up onDisconnect to mark lobby as abandoned when manager leaves
export function setManagerPresence(lobbyId) {
    const presenceRef = ref(database, `groupLobbies/${lobbyId}/managerOnline`);
    const disconnectRef = ref(database, `groupLobbies/${lobbyId}/managerDisconnectedAt`);
    const customProblemsRef = ref(database, `groupLobbies/${lobbyId}/customProblems`);

    // Mark manager as online
    set(presenceRef, true);

    // When manager disconnects, mark them as offline, record timestamp, and clear custom problems
    onDisconnect(presenceRef).set(false);
    onDisconnect(disconnectRef).set(serverTimestamp());
    onDisconnect(customProblemsRef).remove(); // Clean up custom problems when manager leaves

    // Return cleanup function
    return () => {
        set(presenceRef, false);
        set(disconnectRef, serverTimestamp());
        remove(customProblemsRef); // Also remove custom problems on explicit cleanup
    };
}

// Delete lobby entirely (for cleanup)
export async function deleteLobby(lobbyId) {
    await remove(ref(database, `groupLobbies/${lobbyId}`));
}

// ==================== GROUP MANAGEMENT ====================

export async function createGroup(lobbyId, groupName, color) {
    const groupsRef = ref(database, `groupLobbies/${lobbyId}/groups`);
    const newGroupRef = push(groupsRef);

    await set(newGroupRef, {
        id: newGroupRef.key,
        name: groupName,
        color: color || '#4ECDC4',
        players: {},
        score: 0
    });

    return newGroupRef.key;
}

export async function assignPlayerToGroup(lobbyId, playerId, groupId, playerData) {
    // Add to group with full player data including avatar
    await set(ref(database, `groupLobbies/${lobbyId}/groups/${groupId}/players/${playerId}`), {
        name: playerData.name || 'Anonymous',
        avatar: playerData.avatar || null,
        status: 'ASSIGNED'
    });

    // Update player's groupId
    await update(ref(database, `groupLobbies/${lobbyId}/players/${playerId}`), {
        groupId: groupId,
        status: 'ASSIGNED'
    });
}

export async function removePlayerFromGroup(lobbyId, playerId, groupId) {
    // Remove from group
    await remove(ref(database, `groupLobbies/${lobbyId}/groups/${groupId}/players/${playerId}`));

    // Only update player's groupId if they still exist in the lobby
    const playerSnap = await get(ref(database, `groupLobbies/${lobbyId}/players/${playerId}`));
    if (playerSnap.exists()) {
        await update(ref(database, `groupLobbies/${lobbyId}/players/${playerId}`), {
            groupId: null,
            status: 'ONLINE'
        });
    }
}

export async function deleteGroup(lobbyId, groupId) {
    // First, try to unassign all players
    try {
        const snapshot = await get(ref(database, `groupLobbies/${lobbyId}/groups/${groupId}/players`));
        if (snapshot.exists()) {
            const players = snapshot.val();
            for (const playerId of Object.keys(players)) {
                await update(ref(database, `groupLobbies/${lobbyId}/players/${playerId}`), {
                    groupId: null,
                    status: 'ONLINE'
                });
            }
        }
    } catch (err) {
        console.error("Error unassigning players during group delete:", err);
        // Continue to delete group anyway
    }

    await remove(ref(database, `groupLobbies/${lobbyId}/groups/${groupId}`));
}

// ==================== BATTLE CONFIG ====================

export async function setBattleConfig(lobbyId, config) {
    await set(ref(database, `groupLobbies/${lobbyId}/battleConfig`), {
        problemIds: config.problemIds,
        category: config.category || null,
        mode: config.mode || 'RANDOM',
        problemSource: config.problemSource || 'PLATFORM',
        createdAt: serverTimestamp()
    });
}

export async function startBattle(lobbyId) {
    // Update lobby status
    await update(ref(database, `groupLobbies/${lobbyId}`), {
        status: 'BATTLE',
        startedAt: serverTimestamp()
    });

    // Update all assigned players to IN_BATTLE
    const snapshot = await get(ref(database, `groupLobbies/${lobbyId}/players`));
    if (snapshot.exists()) {
        const players = snapshot.val();
        for (const [playerId, player] of Object.entries(players)) {
            if (player.groupId) {
                await update(ref(database, `groupLobbies/${lobbyId}/players/${playerId}`), {
                    status: 'IN_BATTLE'
                });
            }
        }
    }

    // Initialize problem states
    const configSnap = await get(ref(database, `groupLobbies/${lobbyId}/battleConfig`));
    if (configSnap.exists()) {
        const config = configSnap.val();
        const problemStates = {};
        for (const problemId of config.problemIds) {
            problemStates[problemId] = {
                solvedBy: null,
                solvedAt: null
            };
        }
        await set(ref(database, `groupLobbies/${lobbyId}/problemStates`), problemStates);
    }
}

export async function cancelBattle(lobbyId) {
    await update(ref(database, `groupLobbies/${lobbyId}`), {
        status: 'COMPLETED',
        endedAt: serverTimestamp()
    });
}

export async function forfeitGroup(lobbyId, groupId) {
    // Mark group as forfeited
    await update(ref(database, `groupLobbies/${lobbyId}/groups/${groupId}`), {
        forfeited: true,
        forfeitedAt: serverTimestamp()
    });

    // Award win to other groups by ending battle
    await update(ref(database, `groupLobbies/${lobbyId}`), {
        status: 'COMPLETED',
        endedAt: serverTimestamp(),
        forfeitedBy: groupId
    });
}

export async function resetLobbyForNewBattle(lobbyId) {
    const lobbySnap = await get(ref(database, `groupLobbies/${lobbyId}`));
    if (!lobbySnap.exists()) return;

    const lobbyData = lobbySnap.val();
    const currentPlayers = lobbyData.players || {};
    const groups = lobbyData.groups || {};

    // Clean up groups: reset scores and remove stale players
    for (const [gid, group] of Object.entries(groups)) {
        // Reset score and forfeit status
        await update(ref(database, `groupLobbies/${lobbyId}/groups/${gid}`), {
            score: 0,
            forfeited: null,
            forfeitedAt: null
        });

        // Remove players from group who are no longer in the lobby
        const groupPlayers = group.players || {};
        for (const pid of Object.keys(groupPlayers)) {
            if (!currentPlayers[pid]) {
                // Player left the lobby, remove from group
                await remove(ref(database, `groupLobbies/${lobbyId}/groups/${gid}/players/${pid}`));
            }
        }
    }

    // Reset all current players' groupId to null (unassign everyone)
    for (const pid of Object.keys(currentPlayers)) {
        await update(ref(database, `groupLobbies/${lobbyId}/players/${pid}`), {
            groupId: null,
            status: 'ONLINE'
        });
    }

    // Clear all group player assignments to start fresh
    for (const gid of Object.keys(groups)) {
        await remove(ref(database, `groupLobbies/${lobbyId}/groups/${gid}/players`));
    }

    // Reset lobby state
    await update(ref(database, `groupLobbies/${lobbyId}`), {
        status: 'LOBBY',
        battleConfig: null,
        endedAt: null,
        forfeitedBy: null
    });

    // Clear problem states and activity
    await remove(ref(database, `groupLobbies/${lobbyId}/problemStates`));
    await remove(ref(database, `groupLobbies/${lobbyId}/activity`));
}

// ==================== BATTLE ACTIVITY ====================

export async function updatePlayerActivity(lobbyId, playerId, problemIndex) {
    await update(ref(database, `groupLobbies/${lobbyId}/activity/${playerId}`), {
        currentProblemIndex: problemIndex,
        lastActiveAt: serverTimestamp()
    });
}

export async function solveProblem(lobbyId, groupId, problemId, playerId) {
    // Use transaction to prevent race conditions - key by groupId to allow parallel group solving
    const problemRef = ref(database, `groupLobbies/${lobbyId}/problemStates/${problemId}/${groupId}`);

    try {
        const result = await runTransaction(problemRef, (currentData) => {
            // If already solved by my group, abort
            if (currentData && currentData.solvedBy) {
                return; // Abort transaction
            }
            // Mark as solved by this player/group
            return {
                ...currentData,
                solvedBy: playerId,
                solvedByGroup: groupId,
                solvedAt: Date.now()
            };
        });

        // Transaction aborted = already solved by this group
        if (!result.committed) {
            return { success: false, reason: 'Already solved by your group' };
        }

        // Use transaction for score increment too (atomic)
        // Use transaction for score and time update
        const groupRef = ref(database, `groupLobbies/${lobbyId}/groups/${groupId}`);
        await runTransaction(groupRef, (group) => {
            if (!group) return group;
            return {
                ...group,
                score: (group.score || 0) + 1,
                lastSolvedAt: Date.now()
            };
        });

        return { success: true };
    } catch (error) {
        console.error('Solve problem error:', error);
        return { success: false, reason: error.message };
    }
}

export function subscribeToActivity(lobbyId, callback) {
    const activityRef = ref(database, `groupLobbies/${lobbyId}/activity`);
    return onValue(activityRef, (snapshot) => {
        callback(snapshot.val());
    });
}

export function subscribeToProblemStates(lobbyId, callback) {
    const statesRef = ref(database, `groupLobbies/${lobbyId}/problemStates`);
    return onValue(statesRef, (snapshot) => {
        callback(snapshot.val());
    });
}

// ==================== LEGACY FUNCTIONS (for compatibility) ====================

export async function joinGroup(lobbyId, groupId, player) {
    await assignPlayerToGroup(lobbyId, player.id, groupId, player);
}

export async function leaveGroup(lobbyId, groupId, playerId) {
    await removePlayerFromGroup(lobbyId, playerId, groupId);
}

export async function startAllBattles(lobbyId) {
    await startBattle(lobbyId);
}

export function updateProgress(lobbyId, groupId, playerId, progress, testsPassed) {
    update(ref(database, `groupLobbies/${lobbyId}/groups/${groupId}/players/${playerId}`), {
        progress,
        testsPassed
    });
}

// ==================== INVITE SYSTEM ====================

export async function sendInvite(targetPlayerId, lobbyId, hostName) {
    const inviteRef = push(ref(database, `users/${targetPlayerId}/invites`));
    await set(inviteRef, {
        type: 'GROUP_BATTLE',
        lobbyId,
        hostName,
        sentAt: serverTimestamp()
    });
    return inviteRef.key;
}

// ==================== CUSTOM PROBLEMS ====================

export async function addCustomProblem(lobbyId, problem) {
    const problemRef = push(ref(database, `groupLobbies/${lobbyId}/customProblems`));
    const problemId = problemRef.key;

    // Remove undefined values
    const data = {
        id: problemId,
        title: problem.title,
        description: problem.description || '',
        difficulty: problem.difficulty || 'MEDIUM',
        starterCode: problem.starterCode || '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your solution here\n    return 0;\n}',
        testCases: problem.testCases || [],
        sampleCases: problem.sampleCases || [],
        createdAt: serverTimestamp()
    };

    // Legacy support (optional)
    if (problem.expectedOutput) data.expectedOutput = problem.expectedOutput;

    await set(problemRef, data);

    return problemId;
}

export async function deleteCustomProblem(lobbyId, problemId) {
    await remove(ref(database, `groupLobbies/${lobbyId}/customProblems/${problemId}`));
}

export function subscribeToCustomProblems(lobbyId, callback) {
    const problemsRef = ref(database, `groupLobbies/${lobbyId}/customProblems`);
    return onValue(problemsRef, (snapshot) => {
        const problems = snapshot.val();
        callback(problems ? Object.values(problems) : []);
    });
}
