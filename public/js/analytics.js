/**
 * analytics.js
 * Cálculo de estatísticas semanais, distribuição por categoria (tags) e análise de interrupções.
 */

import { state, getLocalDateString } from './state.js';

export function buildDaySummary(dateString = state.currentDate) {
    const byTag = {};
    let focusTimeSeconds = 0;
    let pomodorosCompleted = 0;
    let internalInterruptions = 0;
    let externalInterruptions = 0;

    state.tasks.forEach((task) => {
        const ft = task.focusTime || 0;
        focusTimeSeconds += ft;
        pomodorosCompleted += task.pomodorosCompleted || 0;
        internalInterruptions += task.internalInterruptions || 0;
        externalInterruptions += task.externalInterruptions || 0;

        const tag = task.tag || 'Geral';
        if (ft > 0) {
            byTag[tag] = (byTag[tag] || 0) + ft;
        }
    });

    return {
        date: dateString,
        focusTimeSeconds,
        pomodorosCompleted,
        tasksCompleted: state.tasks.filter((t) => t.completed).length,
        internalInterruptions,
        externalInterruptions,
        byTag,
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
            byTag: {},
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

    const tagTotals = {};
    series.forEach((d) => {
        Object.entries(d.byTag || {}).forEach(([tag, secs]) => {
            tagTotals[tag] = (tagTotals[tag] || 0) + secs;
        });
    });

    const sortedTags = Object.entries(tagTotals)
        .map(([tag, seconds]) => ({ tag, seconds }))
        .sort((a, b) => b.seconds - a.seconds);

    return {
        series,
        totalFocusSeconds,
        totalPomodoros,
        totalInternal,
        totalExternal,
        sortedTags,
    };
}
