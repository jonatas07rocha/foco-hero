/**
 * timer.js
 * Módulo com a lógica do cronômetro Pomodoro e Adaptativo (com pausa no modo Adaptativo).
 */

import { state } from './state.js';

export function startTimer() {
    if (state.isRunning) return false;
    if (!state.selectedTaskId && state.mode === 'focus') return 'NO_TASK';

    if (state.settings.focusMethod === 'pomodoro' || state.mode !== 'focus') {
        if (state.timeRemaining <= 0) {
            state.timeRemaining = (state.settings[`${state.mode}Duration`] || 25) * 60;
            state.totalTime = state.timeRemaining;
        }
        state.endTime = Date.now() + state.timeRemaining * 1000;
    } else {
        // Modo Adaptativo: retoma a partir de adaptiveElapsed / timeRemaining
        state.adaptiveElapsed = state.adaptiveElapsed || state.timeRemaining || 0;
        state.timeRemaining = state.adaptiveElapsed;
        state.totalTime = 1;
        state.endTime = Date.now() - state.adaptiveElapsed * 1000; // usado como startTimestamp
    }

    state.isRunning = true;
    state.isPaused = false;
    return true;
}

export function pauseTimer() {
    if (!state.isRunning) return;
    state.isRunning = false;
    state.isPaused = true;
    clearInterval(state.timerInterval);
    state.timerInterval = null;

    if (state.settings.focusMethod === 'pomodoro' || state.mode !== 'focus') {
        if (state.endTime) {
            state.timeRemaining = Math.max(0, Math.round((state.endTime - Date.now()) / 1000));
        }
    } else if (state.endTime) {
        state.adaptiveElapsed = Math.max(0, Math.round((Date.now() - state.endTime) / 1000));
        state.timeRemaining = state.adaptiveElapsed;
    }
}

export function updateTimer() {
    let finished = false;
    if (state.settings.focusMethod === 'pomodoro' || state.mode !== 'focus') {
        const remaining = Math.round((state.endTime - Date.now()) / 1000);
        if (remaining > 0) {
            state.timeRemaining = remaining;
        } else {
            state.timeRemaining = 0;
            clearInterval(state.timerInterval);
            state.timerInterval = null;
            finished = true;
        }
    } else {
        state.adaptiveElapsed = Math.max(0, Math.round((Date.now() - state.endTime) / 1000));
        state.timeRemaining = state.adaptiveElapsed;
    }
    return finished;
}

export function switchMode() {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    state.isRunning = false;
    state.isPaused = false;

    const previousMode = state.mode;
    let focusDuration = 0;

    if (previousMode === 'focus') {
        state.uninterruptedSessionsToday++;
        const task = state.tasks.find((t) => t.id === state.selectedTaskId);
        if (state.settings.focusMethod === 'pomodoro') {
            focusDuration = state.settings.focusDuration * 60;
            state.pomodoroSessionCount++;
            if (task) {
                task.pomodorosCompleted++;
                task.focusTime += focusDuration;
            }
            state.mode = (state.pomodoroSessionCount % state.settings.longBreakInterval === 0) ? 'longBreak' : 'shortBreak';
        } else {
            focusDuration = state.adaptiveElapsed || state.timeRemaining || 0;
            if (task) {
                task.focusTime += focusDuration;
            }
            state.mode = 'focus';
        }
    } else {
        if (previousMode === 'longBreak') {
            state.longBreaksToday++;
        }
        state.mode = 'focus';
    }

    state.endTime = null;
    state.adaptiveElapsed = 0;
    resetTimer();
    return { previousMode, focusDuration };
}

export function resetTimer(forceMode = null) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    state.isRunning = false;
    state.isPaused = false;
    state.endTime = null;
    state.adaptiveElapsed = 0;
    state.mode = forceMode || state.mode;

    if (state.settings.focusMethod === 'pomodoro' || state.mode !== 'focus') {
        state.timeRemaining = (state.settings[`${state.mode}Duration`] || 25) * 60;
        state.totalTime = state.timeRemaining;
    } else {
        state.timeRemaining = 0;
        state.totalTime = 1;
    }
}

export function resetDayCounters({ keepPendingTasks = true } = {}) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    state.isRunning = false;
    state.isPaused = false;

    if (keepPendingTasks) {
        state.tasks = state.tasks
            .filter((t) => !t.completed)
            .map((t) => ({
                ...t,
                pomodorosCompleted: 0,
                internalInterruptions: 0,
                externalInterruptions: 0,
                focusTime: 0,
                isEditing: false,
            }));
        if (state.selectedTaskId && !state.tasks.some((t) => t.id === state.selectedTaskId)) {
            state.selectedTaskId = state.tasks[0]?.id || null;
        }
    } else {
        state.tasks = [];
        state.selectedTaskId = null;
    }

    state.pomodoroSessionCount = 0;
    state.uninterruptedSessionsToday = 0;
    state.tasksAddedToday = 0;
    state.longBreaksToday = 0;
    state.startedBefore9AM = 0;
    resetTimer('focus');
}
