/**
 * analytics.js
 * Cálculo de estatísticas semanais e análise de interrupções.
 */

import { state, getLocalDateString } from './state.js';

export function buildDaySummary(dateString = state.currentDate) {
    let focusTimeSeconds = 0;
    let pomodorosCompleted = 0;
    let internalInterruptions = 0;
    let externalInterruptions = 0;

    state.tasks.forEach((task) => {
        focusTimeSeconds += task.focusTime || 0;
        pomodorosCompleted += task.pomodorosCompleted || 0;
        internalInterruptions += task.internalInterruptions || 0;
        externalInterruptions += task.externalInterruptions || 0;
    });

    return {
        date: dateString,
        focusTimeSeconds,
        pomodorosCompleted,
        tasksCompleted: state.tasks.filter((t) => t.completed).length,
        internalInterruptions,
        externalInterruptions,
    };
}

export function getLastNDaysStats(days = 7, referenceDate = new Date()) {
    const todayStr = getLocalDateString(referenceDate);
    const todayLive = buildDaySummary(todayStr);

    const historyMap = new Map();
    (state.history || []).forEach((item) => {
        if (item && item.date) historyMap.set(item.date, item);
    });
    historyMap.set(todayStr, todayLive);

    const result = [];
    const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(referenceDate);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        const dateStr = getLocalDateString(d);
        const entry = historyMap.get(dateStr) || {
            date: dateStr,
            focusTimeSeconds: 0,
            pomodorosCompleted: 0,
            tasksCompleted: 0,
            internalInterruptions: 0,
            externalInterruptions: 0,
        };
        result.push({
            ...entry,
            label: weekdayNames[d.getDay()],
        });
    }

    return result;
}

export function getWeeklyAggregates(days = 7, referenceDate = new Date()) {
    const series = getLastNDaysStats(days, referenceDate);
    const totalFocusSeconds = series.reduce((sum, d) => sum + (d.focusTimeSeconds || 0), 0);
    const totalPomodoros = series.reduce((sum, d) => sum + (d.pomodorosCompleted || 0), 0);
    const totalInternal = series.reduce((sum, d) => sum + (d.internalInterruptions || 0), 0);
    const totalExternal = series.reduce((sum, d) => sum + (d.externalInterruptions || 0), 0);

    return {
        series,
        totalFocusSeconds,
        totalPomodoros,
        totalInternal,
        totalExternal,
    };
}
