/**
 * ui_controller.js
 * Manipulação do DOM, sanitização anti-XSS, Modo Zen, Dashboard analítico e temas.
 */

import { state, TASK_TAGS } from './state.js';
import { dom } from './ui.js';
import { themes } from './themes.js';
import { achievements } from './achievements.js';
import { xpForNextLevel, getDailyStats } from './gamification.js';
import { shopCollections } from './shop.js';
import { getWeeklyAggregates } from './analytics.js';
import { renderIcons } from './icons.js';

export function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function toCssColor(colorValue) {
    if (!colorValue) return '';
    const trimmed = String(colorValue).trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('rgb') || trimmed.startsWith('hsl')) {
        return trimmed;
    }
    return `rgb(${trimmed})`;
}

export function renderTagFilter() {
    if (!dom.taskTagFilter) return;
    const filters = ['Todas', ...TASK_TAGS];
    dom.taskTagFilter.innerHTML = filters
        .map((tag) => {
            const active = state.selectedTagFilter === tag;
            return `<button type="button" data-filter-tag="${escapeHtml(tag)}" class="px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${active ? 'bg-primary-focus text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}">${escapeHtml(tag)}</button>`;
        })
        .join('');
}

export function renderTasks() {
    renderTagFilter();
    if (!dom.taskListEl) return;

    let tasksToRender = state.showCompletedTasks ? state.tasks : state.tasks.filter((t) => !t.completed);
    if (state.selectedTagFilter && state.selectedTagFilter !== 'Todas') {
        tasksToRender = tasksToRender.filter((t) => (t.tag || 'Geral') === state.selectedTagFilter);
    }

    dom.taskListEl.innerHTML =
        tasksToRender.length === 0
            ? '<p class="text-muted text-center text-sm py-2">Nenhuma tarefa neste filtro. Adicione uma abaixo!</p>'
            : '';

    tasksToRender.forEach((task) => {
        const taskEl = document.createElement('div');
        taskEl.className = `task-item p-3 rounded-lg border-2 border-transparent cursor-pointer ${task.id === state.selectedTaskId ? 'selected' : ''} ${task.completed ? 'opacity-60' : ''}`;
        taskEl.dataset.id = task.id;

        const safeName = escapeHtml(task.name);
        const safeTag = escapeHtml(task.tag || 'Geral');

        taskEl.innerHTML = `
        <div class="flex justify-between items-center gap-2">
            <div class="flex items-center min-w-0 flex-grow">
                <button type="button" data-complete-id="${task.id}" class="complete-btn text-muted hover:text-green-500 mr-2.5 flex-shrink-0" aria-label="Marcar tarefa ${safeName} como concluída">
                    <i data-lucide="${task.completed ? 'check-square' : 'square'}" class="w-5 h-5"></i>
                </button>
                ${
                    task.isEditing
                        ? `<input type="text" value="${safeName}" class="task-edit-input rounded px-2 py-1 text-sm flex-grow mx-1 border-2 border-primary focus:outline-none" data-edit-input-id="${task.id}" aria-label="Editar nome da tarefa ${safeName}">`
                        : `<div class="min-w-0 flex-grow">
                               <span class="task-name block truncate text-sm ${task.completed ? 'line-through' : ''}">${safeName}</span>
                               <span class="inline-block text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-primary-light font-semibold mt-0.5">${safeTag}</span>
                           </div>`
                }
            </div>
            <div class="flex items-center space-x-0.5 flex-shrink-0">
                <button type="button" data-move-up-id="${task.id}" class="text-muted hover:text-white transition-colors p-1 rounded-md" title="Mover para cima" aria-label="Mover tarefa para cima"><i data-lucide="arrow-up" class="w-3.5 h-3.5"></i></button>
                <button type="button" data-move-down-id="${task.id}" class="text-muted hover:text-white transition-colors p-1 rounded-md" title="Mover para baixo" aria-label="Mover tarefa para baixo"><i data-lucide="arrow-down" class="w-3.5 h-3.5"></i></button>
                <button type="button" data-edit-id="${task.id}" class="edit-btn text-muted hover:text-primary transition-colors p-1 rounded-md" aria-label="${task.isEditing ? 'Salvar edição' : 'Editar tarefa'}"><i data-lucide="${task.isEditing ? 'save' : 'pencil'}" class="w-4 h-4"></i></button>
                <button type="button" data-delete-id="${task.id}" class="delete-btn text-muted hover:text-red-500 transition-colors p-1 rounded-md" aria-label="Excluir tarefa"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </div>
        </div>
        <div class="grid ${state.settings.focusMethod === 'pomodoro' ? 'grid-cols-4' : 'grid-cols-3'} gap-1 items-center mt-2 pl-7 text-xs text-center">
            ${state.settings.focusMethod === 'pomodoro' ? `<span class="text-muted font-bold flex items-center justify-center" title="Pomodoros"><i data-lucide="check-circle-2" class="w-4 h-4 mr-1 text-green-500"></i>${task.pomodorosCompleted}/${task.pomodoroEstimate}</span>` : ''}
            <span class="text-muted font-bold flex items-center justify-center" title="Tempo de Foco"><i data-lucide="clock" class="w-4 h-4 mr-1 text-primary-light"></i>${formatTime(task.focusTime)}</span>
            <span class="text-muted font-bold flex items-center justify-center" title="Interrupções Internas"><i data-lucide="zap-off" class="w-4 h-4 mr-1"></i>${task.internalInterruptions}</span>
            <span class="text-muted font-bold flex items-center justify-center" title="Interrupções Externas"><i data-lucide="user-x" class="w-4 h-4 mr-1"></i>${task.externalInterruptions}</span>
        </div>`;
        dom.taskListEl.appendChild(taskEl);
    });

    updateCurrentTaskDisplay();
    renderIcons(dom.taskListEl);
}

export function renderMissions() {
    if (!dom.dashboardMissionsContent) return;
    dom.dashboardMissionsContent.innerHTML = '';

    if (state.gamification.dailyMissions.length === 0) {
        dom.dashboardMissionsContent.innerHTML = '<p class="text-muted text-center">Nenhuma missão para hoje. Volte amanhã!</p>';
        return;
    }
    const stats = getDailyStats();

    state.gamification.dailyMissions.forEach((mission) => {
        const isCompleted = state.gamification.completedMissions.includes(mission.id);
        const currentProgress = Math.min(stats[mission.metric] || 0, mission.goal);
        const progressPercent = (currentProgress / mission.goal) * 100;

        const el = document.createElement('div');
        el.className = `mission-item p-4 rounded-lg ${isCompleted ? 'completed' : ''}`;
        el.innerHTML = `
            <div class="flex items-start space-x-4">
                <span class="text-3xl">${mission.emoji}</span>
                <div class="flex-grow">
                    <p class="font-bold">${escapeHtml(mission.title)}</p>
                    <p class="text-sm text-muted">${escapeHtml(mission.description)}</p>
                    <div class="flex items-center text-xs mt-2 space-x-4">
                        <span style="color: rgb(var(--color-xp-bar));"><strong>+${mission.rewards.xp}</strong> XP</span>
                        <span class="text-coin"><strong>+${mission.rewards.coins}</strong> Moedas</span>
                    </div>
                </div>
            </div>
            <div class="mt-3">
                <div class="w-full bg-gray-700 rounded-full h-2.5">
                    <div class="mission-progress-bar h-2.5 rounded-full" style="width: ${progressPercent}%"></div>
                </div>
                <p class="text-right text-xs mt-1 text-muted">${Math.floor(currentProgress)} / ${mission.goal}</p>
            </div>
        `;
        dom.dashboardMissionsContent.appendChild(el);
    });
}

export function renderAchievements() {
    if (!dom.dashboardAchievementsContent) return;
    dom.dashboardAchievementsContent.innerHTML = '';

    Object.keys(achievements).forEach((key) => {
        const achievement = achievements[key];
        const isUnlocked = state.gamification.unlockedAchievements.includes(key);
        const el = document.createElement('div');
        el.className = `achievement-item p-4 rounded-lg flex items-center space-x-4 ${isUnlocked ? 'unlocked' : 'opacity-60'}`;
        el.innerHTML = `
            <span class="text-5xl">${achievement.emoji}</span>
            <div>
                <p class="font-bold">${escapeHtml(achievement.name)}</p>
                <p class="text-sm text-muted">${escapeHtml(achievement.description)}</p>
            </div>
        `;
        dom.dashboardAchievementsContent.appendChild(el);
    });
}

export function renderDashboard() {
    if (dom.dashboardCurrentStreak) dom.dashboardCurrentStreak.textContent = state.gamification.currentStreak;
    if (dom.dashboardLongestStreak) dom.dashboardLongestStreak.textContent = state.gamification.longestStreak;
    if (dom.dashboardFreezesCount) dom.dashboardFreezesCount.textContent = state.gamification.streakFreezes || 0;

    const weekly = getWeeklyAggregates(7);

    if (dom.dashboardWeeklySummary) {
        dom.dashboardWeeklySummary.innerHTML = `
            <div class="bg-gray-800/70 p-2.5 rounded-lg text-center">
                <p class="text-lg font-bold text-primary-light">${formatTime(weekly.totalFocusSeconds)}</p>
                <p class="text-[11px] text-muted">Foco (7 dias)</p>
            </div>
            <div class="bg-gray-800/70 p-2.5 rounded-lg text-center">
                <p class="text-lg font-bold text-green-400">${weekly.totalPomodoros}</p>
                <p class="text-[11px] text-muted">Pomodoros</p>
            </div>
            <div class="bg-gray-800/70 p-2.5 rounded-lg text-center">
                <p class="text-lg font-bold text-amber-400">${weekly.totalInternal + weekly.totalExternal}</p>
                <p class="text-[11px] text-muted">Interrupções</p>
            </div>
        `;
    }

    if (dom.dashboardWeeklyChart) {
        const maxSeconds = Math.max(60, ...weekly.series.map((d) => d.focusTimeSeconds));
        dom.dashboardWeeklyChart.innerHTML = weekly.series
            .map((day) => {
                const heightPct = day.focusTimeSeconds > 0 ? Math.max(8, Math.round((day.focusTimeSeconds / maxSeconds) * 100)) : 3;
                const mins = Math.round(day.focusTimeSeconds / 60);
                return `
                    <div class="flex flex-col items-center flex-1 h-full justify-end" title="${day.date}: ${formatTime(day.focusTimeSeconds)} (${day.pomodorosCompleted} ciclos)">
                        <span class="text-[10px] text-muted mb-1">${mins > 0 ? `${mins}m` : ''}</span>
                        <div class="w-full max-w-[28px] rounded-t-md transition-all ${day.focusTimeSeconds > 0 ? 'bg-primary-focus' : 'bg-gray-700'}" style="height: ${heightPct}%;"></div>
                        <span class="text-[11px] font-semibold mt-1 text-muted">${day.label}</span>
                    </div>
                `;
            })
            .join('');
    }

    if (dom.dashboardInterruptionsSummary) {
        dom.dashboardInterruptionsSummary.innerHTML = `
            <div class="flex justify-between text-xs mb-1">
                <span>Internas (distração própria)</span>
                <span class="font-bold">${weekly.totalInternal}</span>
            </div>
            <div class="flex justify-between text-xs">
                <span>Externas (pessoas / avisos)</span>
                <span class="font-bold">${weekly.totalExternal}</span>
            </div>
        `;
    }

    if (dom.dashboardTagsSummary) {
        if (weekly.sortedTags.length === 0) {
            dom.dashboardTagsSummary.innerHTML = '<p class="text-xs text-muted">Sem sessões registradas nos últimos 7 dias.</p>';
        } else {
            const totalSecs = weekly.totalFocusSeconds || 1;
            dom.dashboardTagsSummary.innerHTML = weekly.sortedTags
                .map((entry) => {
                    const pct = Math.round((entry.seconds / totalSecs) * 100);
                    return `
                        <div>
                            <div class="flex justify-between text-xs mb-0.5">
                                <span class="font-semibold">${escapeHtml(entry.tag)}</span>
                                <span class="text-muted">${formatTime(entry.seconds)} (${pct}%)</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-1.5">
                                <div class="bg-primary-focus h-1.5 rounded-full" style="width: ${pct}%"></div>
                            </div>
                        </div>
                    `;
                })
                .join('');
        }
    }

    if (dom.dashboardDailyReport) {
        if (state.tasks.length === 0) {
            dom.dashboardDailyReport.innerHTML = '<p class="text-muted text-center text-sm">Nenhuma tarefa para exibir.</p>';
        } else {
            let statsHTML = '';
            [...state.tasks]
                .sort((a, b) => Number(a.completed) - Number(b.completed))
                .forEach((task) => {
                    statsHTML += `
                    <div class="stats-item p-3 rounded-lg ${task.completed ? 'opacity-60' : ''}">
                        <div class="flex justify-between items-center gap-2">
                            <p class="font-bold truncate ${task.completed ? 'line-through' : ''}">${escapeHtml(task.name)}</p>
                            <span class="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-primary-light font-semibold flex-shrink-0">${escapeHtml(task.tag || 'Geral')}</span>
                        </div>
                        <div class="grid grid-cols-4 gap-2 mt-2 text-center text-xs">
                            <div><p class="text-xs text-muted">Foco</p><p class="font-semibold">${formatTime(task.focusTime)}</p></div>
                            <div><p class="text-xs text-muted">Ciclos</p><p class="font-semibold">${task.pomodorosCompleted}/${task.pomodoroEstimate}</p></div>
                            <div><p class="text-xs text-muted">Int. Interna</p><p class="font-semibold">${task.internalInterruptions}</p></div>
                            <div><p class="text-xs text-muted">Int. Externa</p><p class="font-semibold">${task.externalInterruptions}</p></div>
                        </div>
                    </div>`;
                });
            dom.dashboardDailyReport.innerHTML = statsHTML;
        }
    }

    renderMissions();
    renderAchievements();
}

export function renderPaletteSelector() {
    if (!dom.colorPaletteSelector) return;
    dom.colorPaletteSelector.innerHTML = '';

    const paidThemeIds = new Set();
    for (const collectionId in shopCollections) {
        for (const itemId in shopCollections[collectionId].items) {
            const item = shopCollections[collectionId].items[itemId];
            if (item.themeId) paidThemeIds.add(item.themeId);
        }
    }

    const defaultThemes = Object.keys(themes).filter((themeId) => !paidThemeIds.has(themeId));
    const availableThemeIds = new Set([...defaultThemes, ...state.gamification.unlockedThemes]);

    availableThemeIds.forEach((themeId) => {
        if (!themes[themeId]) return;

        const theme = themes[themeId];
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.theme = themeId;
        button.title = theme.name;
        button.className = `h-12 rounded-lg border-2 transition-all transform flex flex-col items-center justify-center p-1 text-xs font-semibold ${state.settings.theme === themeId ? 'border-white scale-105' : 'border-transparent'}`;
        button.style.backgroundColor = theme['--color-bg-shell'];
        button.style.color = theme['--color-text-muted'];
        button.innerHTML = `<div class="w-full h-4 rounded" style="background-color: rgb(${theme['--color-primary-rgb']})"></div><span class="mt-1 truncate w-full text-center">${escapeHtml(theme.name.split(' ')[0])}</span>`;
        dom.colorPaletteSelector.appendChild(button);
    });
}

export function updateGamificationUI() {
    const nextLevelXP = xpForNextLevel();
    if (dom.levelDisplay) dom.levelDisplay.textContent = state.gamification.level;
    if (dom.xpDisplay) dom.xpDisplay.textContent = state.gamification.xp;
    if (dom.xpNextLevelDisplay) dom.xpNextLevelDisplay.textContent = nextLevelXP;
    if (dom.xpBarFill) dom.xpBarFill.style.width = `${Math.min(100, (state.gamification.xp / nextLevelXP) * 100)}%`;
    if (dom.coinsDisplay) dom.coinsDisplay.textContent = state.gamification.coins;
    if (dom.streakDisplay) dom.streakDisplay.textContent = state.gamification.currentStreak;
    if (dom.streakFreezesDisplay) dom.streakFreezesDisplay.textContent = state.gamification.streakFreezes || 0;
}

export function updateTimerDisplay() {
    const totalSecondsAbs = Math.max(0, Math.abs(state.timeRemaining));
    const hours = Math.floor(totalSecondsAbs / 3600);
    const minutes = Math.floor((totalSecondsAbs % 3600) / 60);
    const seconds = totalSecondsAbs % 60;
    const display =
        hours > 0
            ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (dom.timerDisplay) dom.timerDisplay.textContent = display;
    document.title = `${display} - Foco Total`;

    if (dom.progressRing) {
        const circumference = 2 * Math.PI * 45;
        const progress =
            state.settings.focusMethod === 'pomodoro' || state.mode !== 'focus'
                ? state.totalTime > 0
                    ? (state.totalTime - state.timeRemaining) / state.totalTime
                    : 0
                : state.isRunning || state.isPaused
                    ? 1
                    : 0;
        dom.progressRing.style.strokeDasharray = circumference;
        dom.progressRing.style.strokeDashoffset = circumference * (1 - progress);
    }
}

export function updateCurrentTaskDisplay() {
    const task = state.tasks.find((t) => t.id === state.selectedTaskId);
    if (dom.currentTaskDisplay) {
        dom.currentTaskDisplay.textContent = task ? task.name : 'Nenhuma tarefa selecionada';
    }
    if (!dom.pomodoroCyclesEl) return;
    dom.pomodoroCyclesEl.innerHTML = '';
    if (state.settings.focusMethod !== 'pomodoro' || !state.settings.longBreakInterval || state.settings.longBreakInterval <= 0) return;

    const cyclesToShow = state.pomodoroSessionCount % state.settings.longBreakInterval;
    for (let i = 0; i < state.settings.longBreakInterval; i++) {
        const icon =
            i < cyclesToShow
                ? '<i data-lucide="check-circle-2" class="text-green-500 w-4 h-4"></i>'
                : '<i data-lucide="circle" class="text-muted w-4 h-4"></i>';
        dom.pomodoroCyclesEl.innerHTML += `<span class="transition-all">${icon}</span>`;
    }
    renderIcons(dom.pomodoroCyclesEl);
}

export function updateZenModeUI() {
    document.body.classList.toggle('zen-mode', state.zenMode);
    if (dom.zenModeBtn) {
        dom.zenModeBtn.title = state.zenMode ? 'Sair do Modo Zen' : 'Modo Zen';
        dom.zenModeBtn.setAttribute('aria-label', state.zenMode ? 'Sair do Modo Zen' : 'Ativar Modo Zen');
        dom.zenModeBtn.innerHTML = `<i data-lucide="${state.zenMode ? 'minimize-2' : 'maximize-2'}" class="w-4 h-4"></i>`;
        renderIcons(dom.zenModeBtn);
    }
}

export function updateUI() {
    updateTimerDisplay();
    const currentTheme = themes[state.previewThemeId || state.settings.theme] || themes.brasil_dark;

    if (dom.progressRing) {
        if (state.mode === 'shortBreak') dom.progressRing.style.stroke = toCssColor(currentTheme['--color-break-short']);
        else if (state.mode === 'longBreak') dom.progressRing.style.stroke = toCssColor(currentTheme['--color-break-long']);
        else dom.progressRing.style.stroke = `rgb(${currentTheme['--color-primary-rgb']})`;

        dom.progressRing.classList.toggle('breathing', state.settings.focusMethod === 'adaptativo' && state.mode === 'focus' && state.isRunning);
    }

    const btnIcon = state.isRunning ? 'pause' : 'play';
    const btnBgClass = state.isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-primary-focus hover:bg-primary-darker';
    const ariaLabelText = state.isRunning ? 'Pausar Timer' : 'Iniciar Timer';

    if (dom.startPauseBtn) {
        dom.startPauseBtn.className = `w-20 h-20 text-white font-bold rounded-full text-base transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center ${btnBgClass}`;
        dom.startPauseBtn.innerHTML = `<i data-lucide="${btnIcon}" class="w-8 h-8 ${btnIcon === 'play' ? 'pl-1' : ''}"></i>`;
        dom.startPauseBtn.setAttribute('aria-label', ariaLabelText);
        renderIcons(dom.startPauseBtn);
    }

    if (dom.finishAdaptiveBtn) {
        const showFinishAdaptive =
            state.settings.focusMethod === 'adaptativo' &&
            state.mode === 'focus' &&
            (state.isRunning || (state.isPaused && state.adaptiveElapsed > 0));
        dom.finishAdaptiveBtn.style.display = showFinishAdaptive ? 'flex' : 'none';
    }

    if (dom.internalInterruptBtn) {
        dom.internalInterruptBtn.style.display = state.isRunning && state.mode === 'focus' ? 'flex' : 'none';
    }
    if (dom.externalInterruptBtn) {
        dom.externalInterruptBtn.style.display = state.isRunning && state.mode === 'focus' ? 'flex' : 'none';
    }

    updateCurrentTaskDisplay();
    updateZenModeUI();
}

export function updateMethodToggleUI() {
    document.querySelectorAll('#focus-method-toggle .method-btn').forEach((btn) => {
        const isSelected = btn.dataset.method === state.settings.focusMethod;
        btn.classList.toggle('bg-primary-focus', isSelected);
        btn.classList.toggle('text-white', isSelected);
        const isDarkTheme = state.settings.theme.includes('_dark') || state.settings.theme.includes('tech_');
        btn.classList.toggle(isDarkTheme ? 'text-gray-400' : 'text-gray-500', !isSelected);
    });
    if (dom.pomodoroCyclesEl) dom.pomodoroCyclesEl.style.display = state.settings.focusMethod === 'pomodoro' ? 'flex' : 'none';
    if (dom.newTaskEstimateInput) dom.newTaskEstimateInput.style.display = state.settings.focusMethod === 'pomodoro' ? 'inline-block' : 'none';
    if (dom.newTaskEstimateLabel) dom.newTaskEstimateLabel.style.display = state.settings.focusMethod === 'pomodoro' ? 'inline-block' : 'none';
}

export function updateShowCompletedBtn() {
    if (dom.toggleCompletedTasksBtn) {
        dom.toggleCompletedTasksBtn.textContent = state.showCompletedTasks ? 'Ocultar Concluídas' : 'Mostrar Concluídas';
        dom.toggleCompletedTasksBtn.classList.toggle('active', state.showCompletedTasks);
    }
}

export function showModal(modalOverlay, message) {
    if (!modalOverlay) return;
    const messageElId = modalOverlay.id.replace('-overlay', '-message');
    const messageEl = document.getElementById(messageElId);
    if (messageEl && message) messageEl.textContent = message;
    modalOverlay.classList.add('visible');
}

export function hideModal(modalOverlay) {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('visible');
}

export function showToast(type, data) {
    let toastEl, nameEl, emojiEl;
    if (type === 'achievement') {
        toastEl = dom.achievementToast;
        nameEl = dom.achievementToastName;
        emojiEl = null;
    } else {
        toastEl = dom.missionToast;
        nameEl = dom.missionToastName;
        emojiEl = dom.missionToastEmoji;
    }
    if (!toastEl || !nameEl) return;
    nameEl.textContent = data.name || data.title;
    if (emojiEl && data.emoji) emojiEl.textContent = data.emoji;
    toastEl.classList.add('show');
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 4000);
}

export function applyTheme(themeName) {
    const theme = themes[themeName] || themes.brasil_dark;
    const root = document.documentElement;
    Object.keys(theme).forEach((key) => {
        if (key !== 'name') root.style.setProperty(key, theme[key]);
    });
    if (dom.themeColorMeta) {
        dom.themeColorMeta.setAttribute('content', theme['--color-bg-shell']);
    }
}

export function formatTime(totalSeconds) {
    if (!totalSeconds || totalSeconds < 1) return '0m';
    const minutes = Math.floor(totalSeconds / 60);
    if (minutes < 1) return `${totalSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) return `${hours}h ${remainingMinutes}m`;
    return `${minutes}m`;
}
