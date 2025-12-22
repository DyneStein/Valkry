// User Stats Service - Track real player statistics in Firebase
import { database } from '../firebase';
import { ref, get, set, update, onValue, off, query, orderByChild, limitToLast } from 'firebase/database';

/**
 * Initialize stats for a new user or get existing stats
 * Always updates avatar and name for existing users to keep them in sync
 */
export async function initUserStats(userId, userName, userAvatar = null) {
    const statsRef = ref(database, `users/${userId}/stats`);
    const snapshot = await get(statsRef);

    if (!snapshot.exists()) {
        // New user - create initial stats
        const initialStats = {
            name: userName,
            avatar: userAvatar,
            battles: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            winRate: 0,
            currentStreak: 0,
            bestStreak: 0,
            rating: 1000,
            rank: 'Bronze',
            totalTimeSpent: 0,
            fastestWin: null,
            createdAt: Date.now(),
            lastBattleAt: null
        };
        await set(statsRef, initialStats);

        // Also create leaderboard entry
        const leaderboardRef = ref(database, `leaderboard/${userId}`);
        await set(leaderboardRef, {
            name: userName,
            avatar: userAvatar,
            rating: 1000,
            wins: 0,
            streak: 0,
            updatedAt: Date.now()
        });

        // Increment global player count
        await incrementGlobalStats('player');

        return initialStats;
    }

    // Existing user - always update avatar and name to keep in sync with auth
    const existingStats = snapshot.val();
    if (userAvatar || userName) {
        const updates = {};
        if (userAvatar && existingStats.avatar !== userAvatar) {
            updates.avatar = userAvatar;
        }
        if (userName && existingStats.name !== userName) {
            updates.name = userName;
        }

        if (Object.keys(updates).length > 0) {
            await update(statsRef, updates);

            // Also update leaderboard
            const leaderboardRef = ref(database, `leaderboard/${userId}`);
            await update(leaderboardRef, updates);
        }
    }

    return { ...existingStats, avatar: userAvatar || existingStats.avatar, name: userName || existingStats.name };
}

/**
 * Update user avatar in stats
 */
export async function updateUserAvatar(userId, avatar) {
    const statsRef = ref(database, `users/${userId}/stats`);
    await update(statsRef, { avatar });

    // Also update leaderboard
    const leaderboardRef = ref(database, `leaderboard/${userId}`);
    await update(leaderboardRef, { avatar });
}

/**
 * Get user stats
 */
export async function getUserStats(userId) {
    const statsRef = ref(database, `users/${userId}/stats`);
    const snapshot = await get(statsRef);
    return snapshot.exists() ? snapshot.val() : null;
}

/**
 * Subscribe to user stats updates
 */
export function subscribeToUserStats(userId, callback) {
    const statsRef = ref(database, `users/${userId}/stats`);
    const unsubscribe = onValue(statsRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        }
    });
    return () => off(statsRef);
}

/**
 * Calculate rank based on rating
 */
function calculateRank(rating) {
    if (rating >= 2500) return 'Legendary';
    if (rating >= 2000) return 'Master';
    if (rating >= 1600) return 'Diamond';
    if (rating >= 1400) return 'Platinum';
    if (rating >= 1200) return 'Gold';
    if (rating >= 1000) return 'Silver';
    return 'Bronze';
}

/**
 * Record a battle result and update stats
 */
export async function recordBattleResult(userId, won, battleDuration, opponentRating = 1000) {
    const statsRef = ref(database, `users/${userId}/stats`);
    const snapshot = await get(statsRef);

    if (!snapshot.exists()) return;

    const stats = snapshot.val();

    // Calculate rating change (ELO-like system)
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - stats.rating) / 400));
    const actualScore = won ? 1 : 0;
    const kFactor = stats.battles < 30 ? 40 : 20; // Higher K for new players
    const ratingChange = Math.round(kFactor * (actualScore - expectedScore));

    const newRating = Math.max(0, stats.rating + ratingChange);
    const newStreak = won ? stats.currentStreak + 1 : 0;
    const newBestStreak = Math.max(stats.bestStreak, newStreak);
    const newBattles = stats.battles + 1;
    const newWins = stats.wins + (won ? 1 : 0);
    const newLosses = stats.losses + (won ? 0 : 1);
    const newWinRate = Math.round((newWins / newBattles) * 100);

    // Track fastest win
    let fastestWin = stats.fastestWin;
    if (won && battleDuration) {
        if (!fastestWin || battleDuration < fastestWin) {
            fastestWin = battleDuration;
        }
    }

    const updatedStats = {
        battles: newBattles,
        wins: newWins,
        losses: newLosses,
        winRate: newWinRate,
        rating: newRating,
        rank: calculateRank(newRating),
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        totalTimeSpent: stats.totalTimeSpent + (battleDuration || 0),
        fastestWin,
        lastBattleAt: Date.now()
    };

    await update(statsRef, updatedStats);

    // Also update leaderboard entry
    await updateLeaderboard(userId, stats.name, newRating, newWins, newStreak, stats.avatar);

    return updatedStats;
}

/**
 * Update leaderboard entry
 */
async function updateLeaderboard(userId, name, rating, wins, streak, avatar = null) {
    const leaderboardRef = ref(database, `leaderboard/${userId}`);
    await set(leaderboardRef, {
        name,
        avatar,
        rating,
        wins,
        streak,
        updatedAt: Date.now()
    });
}

/**
 * Get top players from leaderboard
 */
export async function getLeaderboard(limit = 50) {
    const leaderboardRef = ref(database, 'leaderboard');
    const snapshot = await get(leaderboardRef);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    const players = Object.entries(data).map(([id, player]) => ({
        id,
        ...player
    }));

    // Sort by rating descending
    players.sort((a, b) => b.rating - a.rating);

    // Add rank numbers
    return players.slice(0, limit).map((player, index) => ({
        ...player,
        rank: index + 1
    }));
}

/**
 * Subscribe to leaderboard updates
 */
export function subscribeToLeaderboard(callback, limit = 50) {
    const leaderboardRef = ref(database, 'leaderboard');

    const unsubscribe = onValue(leaderboardRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const players = Object.entries(data).map(([id, player]) => ({
                id,
                ...player
            }));
            players.sort((a, b) => b.rating - a.rating);
            callback(players.slice(0, limit).map((player, index) => ({
                ...player,
                rank: index + 1
            })));
        } else {
            callback([]);
        }
    });

    return () => off(leaderboardRef);
}

/**
 * Get global stats (total players, battles today, etc.)
 */
export async function getGlobalStats() {
    const statsRef = ref(database, 'globalStats');
    const snapshot = await get(statsRef);

    if (!snapshot.exists()) {
        return { totalPlayers: 0, battlesToday: 0, totalBattles: 0 };
    }

    return snapshot.val();
}

/**
 * Increment global stats counters
 */
export async function incrementGlobalStats(type) {
    const statsRef = ref(database, 'globalStats');
    const snapshot = await get(statsRef);

    const current = snapshot.exists() ? snapshot.val() : { totalPlayers: 0, battlesToday: 0, totalBattles: 0, lastResetDate: null };

    // Reset daily counter if new day
    const today = new Date().toDateString();
    if (current.lastResetDate !== today) {
        current.battlesToday = 0;
        current.lastResetDate = today;
    }

    if (type === 'player') {
        current.totalPlayers = (current.totalPlayers || 0) + 1;
    } else if (type === 'battle') {
        current.battlesToday = (current.battlesToday || 0) + 1;
        current.totalBattles = (current.totalBattles || 0) + 1;
    }

    await set(statsRef, current);
    return current;
}

/**
 * Get user's achievements
 */
export async function getUserAchievements(userId) {
    const achievementsRef = ref(database, `users/${userId}/achievements`);
    const snapshot = await get(achievementsRef);
    return snapshot.exists() ? snapshot.val() : {};
}

/**
 * Check and award achievements based on stats
 */
export async function checkAchievements(userId, stats) {
    const achievementsRef = ref(database, `users/${userId}/achievements`);
    const snapshot = await get(achievementsRef);
    const current = snapshot.exists() ? snapshot.val() : {};

    const newAchievements = [];

    // Define achievements
    const achievementDefs = [
        { id: 'first_battle', name: 'First Blood', desc: 'Complete your first battle', check: () => stats.battles >= 1 },
        { id: 'first_win', name: 'Victory!', desc: 'Win your first battle', check: () => stats.wins >= 1 },
        { id: 'streak_3', name: 'On Fire', desc: 'Win 3 battles in a row', check: () => stats.bestStreak >= 3 },
        { id: 'streak_5', name: 'Unstoppable', desc: 'Win 5 battles in a row', check: () => stats.bestStreak >= 5 },
        { id: 'streak_10', name: 'Legendary', desc: 'Win 10 battles in a row', check: () => stats.bestStreak >= 10 },
        { id: 'battles_10', name: 'Veteran', desc: 'Complete 10 battles', check: () => stats.battles >= 10 },
        { id: 'battles_50', name: 'Warrior', desc: 'Complete 50 battles', check: () => stats.battles >= 50 },
        { id: 'battles_100', name: 'Champion', desc: 'Complete 100 battles', check: () => stats.battles >= 100 },
        { id: 'rating_1200', name: 'Gold Rank', desc: 'Reach 1200 rating', check: () => stats.rating >= 1200 },
        { id: 'rating_1600', name: 'Diamond Rank', desc: 'Reach 1600 rating', check: () => stats.rating >= 1600 },
        { id: 'rating_2000', name: 'Master Rank', desc: 'Reach 2000 rating', check: () => stats.rating >= 2000 },
        { id: 'speed_demon', name: 'Speed Demon', desc: 'Win a battle in under 60 seconds', check: () => stats.fastestWin && stats.fastestWin < 60 },
    ];

    for (const achievement of achievementDefs) {
        if (!current[achievement.id] && achievement.check()) {
            current[achievement.id] = {
                unlockedAt: Date.now(),
                name: achievement.name,
                desc: achievement.desc
            };
            newAchievements.push(achievement);
        }
    }

    if (newAchievements.length > 0) {
        await set(achievementsRef, current);
    }

    return { all: current, new: newAchievements };
}
