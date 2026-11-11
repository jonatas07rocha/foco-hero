/**
 * gamification.js
 * Módulo com lógica de gamificação rebalanceada:
 * XP e moedas proporcionais ao tempo focado + bônus sem interrupção + Escudo de Sequência.
 */

import { state } from './state.js';
import { achievements } from './achievements.js';
import { missionsData } from './missions.js';

export const xpForNextLevel = () => Math.floor(100 * Math.pow(1.5, state.gamification.level - 1));

export function addXP(amount) {
    if (!amount || amount <= 0) return false;
    state.gamification.xp += amount;
    let leveledUp = false;
    let nextLevelXP = xpForNextLevel();
    while (state.gamification.xp >= nextLevelXP) {
        state.gamification.xp -= nextLevelXP;
        state.gamification.level++;
        leveledUp = true;
        nextLevelXP = xpForNextLevel();
    }
    return leveledUp;
}

export function addCoins(amount) {
    if (!amount || amount <= 0) return;
    state.gamification.coins += amount;
}

/**
 * Rebalanceamento econômico:
 * - 1.5 XP por minuto focado (arredondado para cima quando >= 60s)
 * - 1 moeda a cada 3 minutos focados (mínimo 2 moedas para sessões >= 1 min)
 * - Bônus de +3 moedas quando a sessão termina com sequência sem interrupções >= 1
 */
export function calculateSessionRewards(focusDurationSeconds, uninterruptedBonusEligible = false) {
    const minutes = Math.floor((focusDurationSeconds || 0) / 60);
    if (minutes <= 0) {
        return { xp: 0, coins: 0, bonusCoins: 0 };
    }
    const xp = Math.max(1, Math.round(minutes * 1.5));
    const baseCoins = Math.max(2, Math.floor(minutes / 3) + 2);
    const bonusCoins = uninterruptedBonusEligible ? 3 : 0;
    return { xp, coins: baseCoins + bonusCoins, bonusCoins };
}

export function unlockAchievement(key) {
    if (!state.gamification.unlockedAchievements.includes(key)) {
        state.gamification.unlockedAchievements.push(key);
        return true;
    }
    return false;
}

export function checkForAchievements() {
    const stats = getDailyStats();
    const unlockedNow = [];
    if (stats.pomodorosCompletedToday >= 1 && unlockAchievement('FIRST_STEP')) unlockedNow.push('FIRST_STEP');
    if (stats.pomodorosCompletedToday >= 5 && unlockAchievement('FOCUSED_BEGINNER')) unlockedNow.push('FOCUSED_BEGINNER');
    if (stats.tasksCompletedToday >= 10 && unlockAchievement('TASK_MASTER')) unlockedNow.push('TASK_MASTER');
    if (stats.focusTimeToday >= 14400 && unlockAchievement('MARATHONER')) unlockedNow.push('MARATHONER');
    if (state.gamification.currentStreak >= 3 && unlockAchievement('STREAK_STARTER')) unlockedNow.push('STREAK_STARTER');
    if (state.gamification.currentStreak >= 7 && unlockAchievement('ON_FIRE')) unlockedNow.push('ON_FIRE');
    if (state.gamification.coins >= 500 && unlockAchievement('COIN_COLLECTOR')) unlockedNow.push('COIN_COLLECTOR');
    for (const lvl of [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]) {
        const key = `LEVEL_${lvl}`;
        if (state.gamification.level >= lvl && achievements[key] && unlockAchievement(key)) {
            unlockedNow.push(key);
        }
    }
    return unlockedNow;
}

export function checkMissionsProgress(context = {}) {
    const stats = getDailyStats();
    const allMissions = [
        ...state.gamification.dailyMissions,
        ...Object.values(missionsData).filter((m) => m.type === 'secret'),
    ];
    const completedNow = [];
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    allMissions.forEach((mission) => {
        if (state.gamification.completedMissions.includes(mission.id)) return;
        let completed = false;
        if (mission.type === 'daily') {
            const currentProgress = stats[mission.metric] || 0;
            if (currentProgress >= mission.goal) completed = true;
        } else if (mission.type === 'secret') {
            const sessionEndedFocus = context.endedFocusSession === true;
            if (mission.id === 'SECRET_NIGHT_OWL' && (state.isRunning || sessionEndedFocus) && hour >= 22) completed = true;
            if (mission.id === 'SECRET_EARLY_BIRD' && state.isRunning && hour < 6) completed = true;
            if (mission.id === 'SECRET_LUNCH_FOCUS' && sessionEndedFocus && hour >= 12 && hour < 14) completed = true;
            if (mission.id === 'SECRET_THEME_EXPLORER' && state.gamification.changedThemesCount.size >= 3) completed = true;
            if (mission.id === 'SECRET_WEEKEND_WARRIOR' && sessionEndedFocus && (dayOfWeek === 0 || dayOfWeek === 6)) completed = true;
            if (mission.id === 'SECRET_CLEAN_SLATE' && state.tasks.length > 0 && state.tasks.every((t) => t.completed)) completed = true;
            if (mission.id === 'SECRET_STREAK_15_DAYS' && state.gamification.currentStreak >= 15) completed = true;
            if (mission.id === 'SECRET_PERFECT_STREAK' && state.gamification.currentStreak >= 30) completed = true;
            if (mission.id === 'SECRET_LEVEL_25' && state.gamification.level >= 25) completed = true;
        }

        if (completed) {
            state.gamification.completedMissions.push(mission.id);
            addXP(mission.rewards.xp);
            addCoins(mission.rewards.coins);
            completedNow.push(mission);
        }
    });
    return completedNow;
}

/**
 * Verifica e atualiza a sequência de dias de foco, usando Escudos de Sequência se houver dias perdidos.
 */
export function checkStreak(referenceDate = new Date()) {
    const today = new Date(referenceDate);
    today.setHours(0, 0, 0, 0);

    if (!state.gamification.lastSessionDate) {
        state.gamification.currentStreak = 1;
        state.gamification.lastSessionDate = today.toISOString();
        if (state.gamification.longestStreak < 1) {
            state.gamification.longestStreak = 1;
        }
        return { streak: 1, bonus: 0, freezesUsed: 0 };
    }

    const lastSession = new Date(state.gamification.lastSessionDate);
    lastSession.setHours(0, 0, 0, 0);

    const diffDays = Math.round((today.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
        return null;
    }

    let bonusCoins = 0;
    let freezesUsed = 0;
    const missedDays = diffDays - 1;

    if (missedDays === 0) {
        state.gamification.currentStreak++;
        bonusCoins = state.gamification.currentStreak * 2;
        addCoins(bonusCoins);
    } else if (state.gamification.streakFreezes >= missedDays) {
        state.gamification.streakFreezes -= missedDays;
        freezesUsed = missedDays;
        state.gamification.currentStreak++;
        bonusCoins = state.gamification.currentStreak * 2;
        addCoins(bonusCoins);
    } else {
        state.gamification.currentStreak = 1;
    }

    if (state.gamification.currentStreak > state.gamification.longestStreak) {
        state.gamification.longestStreak = state.gamification.currentStreak;
    }

    state.gamification.lastSessionDate = today.toISOString();
    return { streak: state.gamification.currentStreak, bonus: bonusCoins, freezesUsed };
}

export function generateDailyMissions() {
    const today = new Date().toISOString().slice(0, 10);
    if (state.gamification.lastMissionDate === today && state.gamification.dailyMissions.length > 0) return;

    const allDailyMissions = Object.values(missionsData).filter((m) => m.type === 'daily');
    const shuffled = [...allDailyMissions].sort(() => 0.5 - Math.random());
    state.gamification.dailyMissions = shuffled.slice(0, 3);

    state.gamification.completedMissions = state.gamification.completedMissions.filter(
        (id) => missionsData[id]?.type === 'secret'
    );
    state.gamification.lastMissionDate = today;
    state.gamification.changedThemesCount.clear();
}

export function getDailyStats() {
    return {
        focusTimeToday: state.tasks.reduce((acc, task) => acc + (task.focusTime || 0), 0),
        tasksCompletedToday: state.tasks.filter((t) => t.completed).length,
        pomodorosCompletedToday: state.tasks.reduce((acc, task) => acc + (task.pomodorosCompleted || 0), 0),
        uninterruptedSessionsToday: state.uninterruptedSessionsToday,
        tasksAddedToday: state.tasksAddedToday,
        longBreaksToday: state.longBreaksToday,
        startedBefore9AM: state.startedBefore9AM,
    };
}
