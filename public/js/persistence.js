/**
 * persistence.js
 * Persistência local-first com IndexedDB, migração automática de localStorage,
 * virada de dia automática e Exportação/Importação JSON.
 */

import { state, getLocalDateString } from './state.js';
import { dom } from './ui.js';
import {
    saveAppStateToDB,
    loadAppStateFromDB,
    saveDayHistoryToDB,
    loadAllHistoryFromDB,
    replaceHistoryInDB,
} from './db.js';
import { buildDaySummary } from './analytics.js';
import { resetTimer, resetDayCounters } from './timer.js';

const LEGACY_STORAGE_KEY = 'pomodoroAppState';

export function serializeState() {
    return {
        version: 2,
        currentDate: state.currentDate,
        tasks: state.tasks,
        selectedTaskId: state.selectedTaskId,
        pomodoroSessionCount: state.pomodoroSessionCount,
        uninterruptedSessionsToday: state.uninterruptedSessionsToday,
        tasksAddedToday: state.tasksAddedToday,
        longBreaksToday: state.longBreaksToday,
        startedBefore9AM: state.startedBefore9AM,
        showCompletedTasks: state.showCompletedTasks,
        selectedTagFilter: state.selectedTagFilter,
        settings: { ...state.settings },
        gamification: {
            ...state.gamification,
            changedThemesCount: Array.from(state.gamification.changedThemesCount || []),
        },
        timerState: {
            isRunning: state.isRunning,
            isPaused: state.isPaused,
            mode: state.mode,
            endTime: state.endTime,
            totalTime: state.totalTime,
            timeRemaining: state.timeRemaining,
            adaptiveElapsed: state.adaptiveElapsed,
        },
    };
}

export function hydrateState(savedState) {
    if (!savedState) return;

    state.currentDate = savedState.currentDate || getLocalDateString();
    state.tasks = Array.isArray(savedState.tasks)
        ? savedState.tasks.map((t) => ({ tag: 'Geral', ...t, isEditing: false }))
        : [];
    state.selectedTaskId = savedState.selectedTaskId ?? null;
    state.pomodoroSessionCount = savedState.pomodoroSessionCount || 0;
    state.uninterruptedSessionsToday = savedState.uninterruptedSessionsToday || 0;
    state.tasksAddedToday = savedState.tasksAddedToday || 0;
    state.longBreaksToday = savedState.longBreaksToday || 0;
    state.startedBefore9AM = savedState.startedBefore9AM || 0;
    state.showCompletedTasks = Boolean(savedState.showCompletedTasks);
    state.selectedTagFilter = savedState.selectedTagFilter || 'Todas';

    if (savedState.settings) {
        Object.assign(state.settings, savedState.settings);
    }
    if (savedState.gamification) {
        Object.assign(state.gamification, savedState.gamification);
    }
    state.gamification.changedThemesCount = new Set(savedState.gamification?.changedThemesCount || []);
    if (typeof state.gamification.streakFreezes !== 'number') {
        state.gamification.streakFreezes = 0;
    }

    if (savedState.timerState) {
        const ts = savedState.timerState;
        state.mode = ts.mode || 'focus';
        state.totalTime = ts.totalTime || 0;

        if (ts.isRunning && ts.endTime) {
            if (state.settings.focusMethod === 'pomodoro' || state.mode !== 'focus') {
                if (ts.endTime > Date.now()) {
                    state.isRunning = true;
                    state.isPaused = false;
                    state.endTime = ts.endTime;
                    state.timeRemaining = Math.round((ts.endTime - Date.now()) / 1000);
                }
            } else {
                state.isRunning = true;
                state.isPaused = false;
                state.endTime = ts.endTime;
                state.adaptiveElapsed = Math.max(0, Math.round((Date.now() - ts.endTime) / 1000));
                state.timeRemaining = state.adaptiveElapsed;
            }
        } else if (ts.isPaused) {
            state.isRunning = false;
            state.isPaused = true;
            state.timeRemaining = ts.timeRemaining || 0;
            state.adaptiveElapsed = ts.adaptiveElapsed || 0;
        }
    }

    if (dom.focusDurationInput) dom.focusDurationInput.value = state.settings.focusDuration;
    if (dom.shortBreakDurationInput) dom.shortBreakDurationInput.value = state.settings.shortBreakDuration;
    if (dom.longBreakDurationInput) dom.longBreakDurationInput.value = state.settings.longBreakDuration;
    if (dom.longBreakIntervalInput) dom.longBreakIntervalInput.value = state.settings.longBreakInterval;
    if (dom.autoStartBreakCheckbox) dom.autoStartBreakCheckbox.checked = Boolean(state.settings.autoStartBreak);
    if (dom.autoStartFocusCheckbox) dom.autoStartFocusCheckbox.checked = Boolean(state.settings.autoStartFocus);
    if (dom.notificationsToggleCheckbox) dom.notificationsToggleCheckbox.checked = Boolean(state.settings.notificationsEnabled);
    if (dom.soundToggleCheckbox) dom.soundToggleCheckbox.checked = state.settings.soundEnabled !== false;
}

export async function saveState() {
    const snapshot = serializeState();
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(snapshot));
        }
    } catch (error) {
        console.error('Erro ao salvar espelho no localStorage:', error);
    }
    await saveAppStateToDB(snapshot);
}

export async function archiveDay(dateStr = state.currentDate, { keepPendingTasks = true } = {}) {
    const summary = buildDaySummary(dateStr);
    const hasActivity =
        summary.focusTimeSeconds > 0 ||
        summary.pomodorosCompleted > 0 ||
        summary.tasksCompleted > 0 ||
        summary.internalInterruptions > 0 ||
        summary.externalInterruptions > 0;

    if (hasActivity) {
        const existingIdx = state.history.findIndex((h) => h.date === summary.date);
        if (existingIdx >= 0) {
            const prev = state.history[existingIdx];
            const mergedByTag = { ...(prev.byTag || {}) };
            Object.entries(summary.byTag || {}).forEach(([tag, secs]) => {
                mergedByTag[tag] = (mergedByTag[tag] || 0) + secs;
            });
            const merged = {
                date: summary.date,
                focusTimeSeconds: (prev.focusTimeSeconds || 0) + summary.focusTimeSeconds,
                pomodorosCompleted: (prev.pomodorosCompleted || 0) + summary.pomodorosCompleted,
                tasksCompleted: (prev.tasksCompleted || 0) + summary.tasksCompleted,
                internalInterruptions: (prev.internalInterruptions || 0) + summary.internalInterruptions,
                externalInterruptions: (prev.externalInterruptions || 0) + summary.externalInterruptions,
                byTag: mergedByTag,
            };
            state.history[existingIdx] = merged;
            await saveDayHistoryToDB(merged);
        } else {
            state.history.push(summary);
            state.history.sort((a, b) => a.date.localeCompare(b.date));
            await saveDayHistoryToDB(summary);
        }
    }

    resetDayCounters({ keepPendingTasks });
    state.currentDate = getLocalDateString();
    await saveState();
    return summary;
}

export async function checkDayRollover(todayStr = getLocalDateString()) {
    if (state.currentDate && state.currentDate !== todayStr) {
        const archivedDate = state.currentDate;
        await archiveDay(archivedDate, { keepPendingTasks: true });
        state.currentDate = todayStr;
        await saveState();
        return archivedDate;
    }
    state.currentDate = todayStr;
    return null;
}

export async function loadState() {
    let savedState = await loadAppStateFromDB();

    if (!savedState && typeof localStorage !== 'undefined') {
        try {
            const legacyJSON = localStorage.getItem(LEGACY_STORAGE_KEY);
            if (legacyJSON) {
                savedState = JSON.parse(legacyJSON);
            }
        } catch (error) {
            console.error('Erro ao ler localStorage:', error);
        }
    }

    state.history = await loadAllHistoryFromDB();

    if (savedState) {
        hydrateState(savedState);
        await checkDayRollover();
    } else {
        state.currentDate = getLocalDateString();
    }

    if (!state.isRunning && !state.isPaused) {
        resetTimer(state.mode);
    }
}

export function exportBackupJSON() {
    return JSON.stringify(
        {
            app: 'Foco Total',
            version: 2,
            exportedAt: new Date().toISOString(),
            appState: serializeState(),
            history: state.history || [],
        },
        null,
        2
    );
}

export async function importBackupJSON(jsonText) {
    const parsed = JSON.parse(jsonText);
    if (!parsed || typeof parsed !== 'object' || !parsed.appState) {
        throw new Error('Arquivo de backup inválido.');
    }

    hydrateState(parsed.appState);
    state.history = Array.isArray(parsed.history) ? parsed.history : [];
    await replaceHistoryInDB(state.history);
    await saveState();
    return true;
}
