// Friends Service - Manage friend relationships in Firebase
import { database } from '../firebase';
import { ref, get, set, remove, onValue, off, push } from 'firebase/database';

/**
 * Send a friend request to another user
 */
export async function sendFriendRequest(fromUser, toUserId) {
    try {
        // Check if target user exists using leaderboard (publicly readable)
        const leaderboardRef = ref(database, `leaderboard/${toUserId}`);
        const leaderboardSnapshot = await get(leaderboardRef);

        if (!leaderboardSnapshot.exists()) {
            return { success: false, error: 'User not found' };
        }

        // Check if already friends
        try {
            const friendRef = ref(database, `users/${fromUser.id}/friends/${toUserId}`);
            const friendSnapshot = await get(friendRef);
            if (friendSnapshot.exists()) {
                return { success: false, error: 'Already friends with this user' };
            }
        } catch (e) {
            // Ignore permission errors for this check
        }

        // Check if request already sent
        try {
            const existingRequestRef = ref(database, `users/${toUserId}/friendRequests/${fromUser.id}`);
            const existingRequest = await get(existingRequestRef);
            if (existingRequest.exists()) {
                return { success: false, error: 'Friend request already sent' };
            }
        } catch (e) {
            // Ignore - will try to send anyway
        }

        // Send the request
        const requestRef = ref(database, `users/${toUserId}/friendRequests/${fromUser.id}`);
        await set(requestRef, {
            from: {
                id: fromUser.id,
                name: fromUser.name,
                avatar: fromUser.avatar || null
            },
            sentAt: Date.now()
        });

        return { success: true };
    } catch (error) {
        console.error('Send friend request error:', error);
        return { success: false, error: error.message || 'Failed to send request' };
    }
}

/**
 * Accept a friend request
 */
export async function acceptFriendRequest(userId, fromUser) {
    try {
        // Add to both users' friends lists
        const myFriendRef = ref(database, `users/${userId}/friends/${fromUser.id}`);
        const theirFriendRef = ref(database, `users/${fromUser.id}/friends/${userId}`);

        // Get my info - try leaderboard first (publicly readable), then stats
        let myData = null;
        try {
            const myLeaderboardRef = ref(database, `leaderboard/${userId}`);
            const myLeaderboard = await get(myLeaderboardRef);
            if (myLeaderboard.exists()) {
                myData = myLeaderboard.val();
            }
        } catch (e) {
            // Fallback to stats
            try {
                const myStatsRef = ref(database, `users/${userId}/stats`);
                const myStats = await get(myStatsRef);
                myData = myStats.val();
            } catch (e2) {
                // Use minimal data
            }
        }

        await set(myFriendRef, {
            id: fromUser.id,
            name: fromUser.name,
            avatar: fromUser.avatar || null,
            addedAt: Date.now()
        });

        await set(theirFriendRef, {
            id: userId,
            name: myData?.name || 'Unknown',
            avatar: myData?.avatar || null,
            addedAt: Date.now()
        });

        // Remove the friend request
        const requestRef = ref(database, `users/${userId}/friendRequests/${fromUser.id}`);
        await remove(requestRef);

        return { success: true };
    } catch (error) {
        console.error('Accept friend request error:', error);
        return { success: false, error: error.message || 'Failed to accept request' };
    }
}

/**
 * Decline a friend request
 */
export async function declineFriendRequest(userId, fromUserId) {
    const requestRef = ref(database, `users/${userId}/friendRequests/${fromUserId}`);
    await remove(requestRef);
    return { success: true };
}

/**
 * Remove a friend
 */
export async function removeFriend(userId, friendId) {
    const myFriendRef = ref(database, `users/${userId}/friends/${friendId}`);
    const theirFriendRef = ref(database, `users/${friendId}/friends/${userId}`);

    await remove(myFriendRef);
    await remove(theirFriendRef);

    return { success: true };
}

/**
 * Get all friends for a user
 */
export async function getFriends(userId) {
    const friendsRef = ref(database, `users/${userId}/friends`);
    const snapshot = await get(friendsRef);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.entries(data).map(([id, friend]) => ({
        id,
        ...friend
    }));
}

/**
 * Subscribe to friends list updates
 */
export function subscribeToFriends(userId, callback) {
    const friendsRef = ref(database, `users/${userId}/friends`);

    const unsubscribe = onValue(friendsRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const friends = Object.entries(data).map(([id, friend]) => ({
                id,
                ...friend
            }));
            callback(friends);
        } else {
            callback([]);
        }
    });

    return () => off(friendsRef);
}

/**
 * Get pending friend requests
 */
export async function getFriendRequests(userId) {
    const requestsRef = ref(database, `users/${userId}/friendRequests`);
    const snapshot = await get(requestsRef);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.entries(data).map(([id, request]) => ({
        id,
        ...request
    }));
}

/**
 * Subscribe to incoming friend requests
 */
export function subscribeToFriendRequests(userId, callback) {
    const requestsRef = ref(database, `users/${userId}/friendRequests`);

    const unsubscribe = onValue(requestsRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const requests = Object.entries(data).map(([id, request]) => ({
                id,
                ...request
            }));
            callback(requests);
        } else {
            callback([]);
        }
    });

    return () => off(requestsRef);
}

/**
 * Search for a user by their ID
 * Uses the leaderboard path which is publicly readable
 */
export async function searchUserById(userId) {
    // First try leaderboard (publicly readable)
    const leaderboardRef = ref(database, `leaderboard/${userId}`);
    const leaderboardSnapshot = await get(leaderboardRef);

    if (leaderboardSnapshot.exists()) {
        const data = leaderboardSnapshot.val();
        return {
            id: userId,
            name: data.name,
            avatar: data.avatar,
            rating: data.rating,
            rank: getRankFromRating(data.rating)
        };
    }

    // Fallback: try user stats (might fail if rules are strict)
    try {
        const userRef = ref(database, `users/${userId}/stats`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            return {
                id: userId,
                name: data.name,
                avatar: data.avatar,
                rating: data.rating,
                rank: data.rank
            };
        }
    } catch (error) {
        console.log('User stats not accessible, user may not exist');
    }

    return null;
}

/**
 * Helper to get rank from rating
 */
function getRankFromRating(rating) {
    if (rating >= 2500) return 'Legendary';
    if (rating >= 2000) return 'Master';
    if (rating >= 1600) return 'Diamond';
    if (rating >= 1400) return 'Platinum';
    if (rating >= 1200) return 'Gold';
    if (rating >= 1000) return 'Silver';
    return 'Bronze';
}

/**
 * Get friend's online status
 */
export async function getFriendOnlineStatus(friendId) {
    const onlineRef = ref(database, `online_players/${friendId}`);
    const snapshot = await get(onlineRef);
    return snapshot.exists() ? snapshot.val() : null;
}

/**
 * Subscribe to friends' online statuses with stale data filtering
 */
export function subscribeToFriendsOnlineStatus(friendIds, callback) {
    const unsubscribes = [];
    const rawStatuses = {};
    const STALE_TIMEOUT = 120000; // 2 minutes

    // Helper to filter and emit
    const checkAndEmit = () => {
        const now = Date.now();
        const filteredStatuses = {};

        Object.keys(rawStatuses).forEach(fid => {
            const data = rawStatuses[fid];
            // Only consider online if data exists AND has a recent lastSeen
            // This implicitly filters out old "zombie" sessions without lastSeen
            if (data && data.lastSeen && (now - data.lastSeen < STALE_TIMEOUT)) {
                filteredStatuses[fid] = data;
            }
        });

        callback(filteredStatuses);
    };

    friendIds.forEach(friendId => {
        const onlineRef = ref(database, `online_players/${friendId}`);
        const unsub = onValue(onlineRef, (snapshot) => {
            if (snapshot.exists()) {
                rawStatuses[friendId] = snapshot.val();
            } else {
                delete rawStatuses[friendId];
            }
            checkAndEmit();
        });
        unsubscribes.push(() => off(onlineRef));
    });

    // Periodically check for stale users even if no database update occurred
    // This handles cases where a user crashed (heartbeat stopped)
    const interval = setInterval(checkAndEmit, 10000);

    return () => {
        clearInterval(interval);
        unsubscribes.forEach(unsub => unsub());
    };
}
