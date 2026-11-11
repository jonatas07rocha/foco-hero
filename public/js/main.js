/**
 * main.js
 * Orquestrador principal da aplicação Foco Hero v2 (Offline-First PWA).
 */

import { achievements } from './achievements.js';
import { state, getLocalDateString } from './state.js';
import { dom, initializeDOM } from './ui.js';
import {
    loadState,
    saveState,
    archiveDay,
    checkDayRollover,
    exportBackupJSON,
    importBackupJSON,
} from './persistence.js';
import { playBeep, playFinishSound, resumeAudio } from './audio.js';
import { requestNotificationPermission, sendNotification } from './notifications.js';
import { renderIcons } from './icons.js';
import { saveCustomAudioToDB, deleteCustomAudioFromDB } from './db.js';
import { getSuggestedSoundscapeForTheme } from './soundscapes.js';
import * as soundEngine from './sound_engine.js';
import * as gamification from './gamification.js';
import * as timer from './timer.js';
import * as tasks from './tasks.js';
import * as ui from './ui_controller.js';
import * as shop from './shop_logic.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeDOM();

    async function initializeApp() {
        if (state.isAppInitialized) return;

        await loadState();
        gamification.generateDailyMissions();

        ui.applyTheme(state.settings.theme);
        ui.updateMethodToggleUI();
        ui.renderTasks();
        ui.updateGamificationUI();
        ui.renderDashboard();
        ui.updateUI();
        ui.updateShowCompletedBtn();
        ui.renderSoundscapesPanel();
        ui.switchView('focus');

        if (state.isRunning) {
            state.timerInterval = setInterval(handleTimerTick, 1000);
            soundEngine.updatePlaybackForTimerState();
        }

        await saveState();
        renderIcons(document);
        registerServiceWorker();

        setInterval(handleRolloverCheck, 60000);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) handleRolloverCheck();
        });

        state.isAppInitialized = true;
    }

    function navigateTo(viewName) {
        if (state.activeView === 'shop' && viewName !== 'shop') {
            shop.cancelThemePreview();
        }
        if (state.zenMode && viewName !== 'focus') {
            state.zenMode = false;
            ui.updateZenModeUI();
        }

        if (viewName === 'dashboard') {
            ui.renderDashboard();
        } else if (viewName === 'shop') {
            shop.renderShop();
        } else if (viewName === 'settings') {
            ui.renderPaletteSelector();
        } else if (viewName === 'help') {
            const isPomodoro = state.settings.focusMethod === 'pomodoro';
            if (dom.helpContentPomodoro) dom.helpContentPomodoro.classList.toggle('hidden', !isPomodoro);
            if (dom.helpContentAdaptativo) dom.helpContentAdaptativo.classList.toggle('hidden', isPomodoro);
        }

        ui.switchView(viewName);
    }

    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            const hadController = Boolean(navigator.serviceWorker.controller);
            let reloaded = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (hadController && !reloaded) {
                    reloaded = true;
                    window.location.reload();
                }
            });
            navigator.serviceWorker
                .register('./sw.js')
                .then((reg) => reg.update().catch(() => {}))
                .catch((err) => {
                    console.warn('Service Worker não registrado:', err);
                });
        }
    }

    async function handleRolloverCheck() {
        const archivedDate = await checkDayRollover(getLocalDateString());
        if (archivedDate) {
            gamification.generateDailyMissions();
            ui.renderTasks();
            ui.renderDashboard();
            ui.updateUI();
            ui.updateGamificationUI();
            await saveState();
        }
    }

    function handleTimerTick() {
        const finished = timer.updateTimer();
        ui.updateTimerDisplay();
        if (finished) {
            handleSessionEnd();
        }
    }

    function startNextAutoSessionIfEnabled(previousMode) {
        const shouldAutoStart =
            (previousMode === 'focus' && state.settings.autoStartBreak) ||
            (previousMode !== 'focus' && state.settings.autoStartFocus);

        if (!shouldAutoStart) return;
        const result = timer.startTimer();
        if (result === true) {
            state.timerInterval = setInterval(handleTimerTick, 1000);
            ui.updateUI();
        }
    }

    function handleSessionEnd() {
        const hadInterruptionsThisSession =
            state.uninterruptedSessionsToday === 0 &&
            state.tasks.some((t) => t.id === state.selectedTaskId && (t.internalInterruptions > 0 || t.externalInterruptions > 0));
        const { previousMode, focusDuration } = timer.switchMode();
        playFinishSound();
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);

        if (previousMode === 'focus') {
            const rewards = gamification.calculateSessionRewards(focusDuration, !hadInterruptionsThisSession);
            const leveledUp = gamification.addXP(rewards.xp);
            gamification.addCoins(rewards.coins);

            const endMessage =
                state.settings.focusMethod === 'pomodoro'
                    ? 'Você completou um Pomodoro! Hora de fazer uma pausa.'
                    : 'Sessão de foco finalizada!';
            const rewardsText =
                rewards.bonusCoins > 0
                    ? `+${rewards.xp} XP • +${rewards.coins} Moedas (inclui +${rewards.bonusCoins} bônus)`
                    : `+${rewards.xp} XP • +${rewards.coins} Moedas`;

            ui.enqueueScreenNotice({
                badge: 'Sessão Finalizada',
                title: state.settings.focusMethod === 'pomodoro' ? 'Pomodoro Concluído!' : 'Foco Concluído!',
                subtitle: endMessage,
                rewardsText,
                icon: 'check-circle-2',
                accent: 'coin',
                durationMs: 5200,
            });
            sendNotification('Foco Hero — Sessão Concluída!', endMessage);

            const streakInfo = gamification.checkStreak();
            if (streakInfo) {
                if (streakInfo.freezesUsed > 0) {
                    ui.enqueueScreenNotice({
                        badge: 'Escudo Ativado',
                        title: `Sequência de ${streakInfo.streak} dias protegida!`,
                        subtitle: 'Um Escudo de Sequência salvou sua consistência.',
                        rewardsText: `+${streakInfo.bonus} Moedas`,
                        icon: 'shield',
                        accent: 'streak',
                        durationMs: 4500,
                    });
                } else if (streakInfo.bonus > 0) {
                    ui.enqueueScreenNotice({
                        badge: 'Sequência Diária',
                        title: `${streakInfo.streak} dias seguidos!`,
                        subtitle: 'Sua consistência está rendendo frutos.',
                        rewardsText: `+${streakInfo.bonus} Moedas de bônus`,
                        icon: 'flame',
                        accent: 'streak',
                        durationMs: 4200,
                    });
                }
            }

            if (leveledUp) {
                playBeep(659, 150, 0.4);
                setTimeout(() => playBeep(784, 300, 0.5), 200);
                ui.enqueueScreenNotice({
                    badge: 'Subiu de Nível',
                    title: `Nível ${state.gamification.level} Alcançado!`,
                    subtitle: 'Continue acumulando foco e conquistas.',
                    icon: 'sparkles',
                    accent: 'coin',
                    durationMs: 4500,
                });
            }

            checkGains({ endedFocusSession: true });
        } else {
            const breakMsg = 'Pausa finalizada! Vamos voltar ao foco?';
            ui.enqueueScreenNotice({
                badge: 'Fim da Pausa',
                title: 'Hora de Voltar!',
                subtitle: breakMsg,
                icon: 'coffee',
                accent: 'primary',
                durationMs: 4200,
            });
            sendNotification('Foco Hero — Pausa Finalizada!', breakMsg);
            checkGains();
        }

        startNextAutoSessionIfEnabled(previousMode);
        soundEngine.updatePlaybackForTimerState();
        ui.updateUI();
        ui.renderTasks();
        ui.renderDashboard();
        ui.updateGamificationUI();
        saveState();
    }

    function checkGains(context = {}) {
        const newMissions = gamification.checkMissionsProgress(context);
        newMissions.forEach((mission) => {
            ui.showToast('mission', mission);
            playBeep(700, 150, 0.4);
        });

        const newAchievements = gamification.checkForAchievements();
        newAchievements.forEach((key) => {
            ui.showToast('achievement', achievements[key]);
            playBeep(880, 200, 0.5);
        });

        if (newMissions.length > 0 || newAchievements.length > 0) {
            ui.renderDashboard();
            ui.updateGamificationUI();
            saveState();
        }
    }

    function handleAddTask() {
        const taskName = dom.newTaskInput.value.trim();
        const estimate = parseInt(dom.newTaskEstimateInput.value, 10);
        const newTask = tasks.addTask(taskName, estimate);
        if (newTask) {
            state.tasksAddedToday++;
            dom.newTaskInput.value = '';
            dom.newTaskEstimateInput.value = '1';
            playBeep(440, 100, 0.2);
            if (!state.selectedTaskId || state.tasks.find((t) => t.id === state.selectedTaskId)?.completed) {
                tasks.selectTask(newTask.id);
                timer.resetTimer('focus');
                ui.updateUI();
            }
            ui.renderTasks();
            checkGains();
            saveState();
        }
    }

    function handleStartPauseLogic() {
        if (state.isRunning) {
            timer.pauseTimer();
            soundEngine.updatePlaybackForTimerState();
            saveState();
        } else {
            const startResult = timer.startTimer();
            if (startResult === 'NO_TASK') {
                ui.enqueueScreenNotice({
                    badge: 'Atenção',
                    title: 'Selecione uma tarefa',
                    subtitle: 'Escolha ou crie uma tarefa abaixo para iniciar o foco.',
                    icon: 'list-plus',
                    accent: 'primary',
                    durationMs: 3600,
                });
            } else if (startResult) {
                if (state.mode === 'focus' && new Date().getHours() < 9) {
                    state.startedBefore9AM = 1;
                }
                state.timerInterval = setInterval(handleTimerTick, 1000);
                soundEngine.updatePlaybackForTimerState();
                checkGains();
                saveState();
            }
        }
        ui.updateUI();
    }

    function triggerStartPause() {
        if (!state.audioInitialized) resumeAudio();

        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isIOS && !state.isRunning && !state.isPaused && state.settings.focusMethod === 'pomodoro') {
            if (state.mode === 'focus') {
                dom.iosPromptTitle.textContent = 'Lembrete de Foco';
                dom.iosPromptMessage.textContent = 'Para garantir o alarme no final do foco, recomendamos criar um lembrete. Deseja fazer isso agora?';
            } else {
                dom.iosPromptTitle.textContent = 'Lembrete de Pausa';
                dom.iosPromptMessage.textContent = 'Para garantir o alarme no final da pausa, recomendamos criar um lembrete. Deseja fazer isso agora?';
            }
            ui.showModal(dom.iosStartPromptModalOverlay);
        } else {
            handleStartPauseLogic();
        }
    }

    // --- NAVEGAÇÃO NO CARD PRINCIPAL ---
    if (dom.bottomNav) {
        dom.bottomNav.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-nav-view]');
            if (!btn) return;
            navigateTo(btn.dataset.navView);
        });
    }

    if (dom.miniTimerPill) {
        dom.miniTimerPill.addEventListener('click', () => navigateTo('focus'));
    }

    if (dom.zenModeBtn) {
        dom.zenModeBtn.addEventListener('click', () => {
            state.zenMode = !state.zenMode;
            ui.updateZenModeUI();
        });
    }

    // --- EVENT LISTENERS DO TIMER & TAREFAS ---
    dom.startPauseBtn.addEventListener('click', triggerStartPause);

    if (dom.finishAdaptiveBtn) {
        dom.finishAdaptiveBtn.addEventListener('click', () => {
            if (state.settings.focusMethod === 'adaptativo' && state.mode === 'focus') {
                handleSessionEnd();
            }
        });
    }

    dom.internalInterruptBtn.addEventListener('click', () => {
        if (tasks.logInterruption('internal')) {
            playBeep(300, 120, 0.25);
            ui.renderTasks();
            ui.renderDashboard();
            saveState();
        }
    });

    dom.externalInterruptBtn.addEventListener('click', () => {
        if (tasks.logInterruption('external')) {
            playBeep(250, 120, 0.25);
            ui.renderTasks();
            ui.renderDashboard();
            saveState();
        }
    });

    dom.iosPromptConfirmBtn.addEventListener('click', () => {
        let duration, eventTitle, eventDescription;
        const appUrl = window.location.origin;

        if (state.mode === 'focus') {
            const task = state.tasks.find((t) => t.id === state.selectedTaskId);
            eventTitle = `Fim do Foco: ${task ? task.name : 'Foco'}`;
            eventDescription = `Sua sessão de foco terminou. Hora de fazer uma pausa! Volte ao app: ${appUrl}`;
            duration = state.settings.focusDuration;
        } else {
            eventTitle = state.mode === 'shortBreak' ? 'Fim da Pausa Curta' : 'Fim da Pausa Longa';
            eventDescription = `Sua pausa acabou. Hora de voltar ao foco! Volte ao app: ${appUrl}`;
            duration = state.mode === 'shortBreak' ? state.settings.shortBreakDuration : state.settings.longBreakDuration;
        }

        const formatDT = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const eventStartTime = new Date(Date.now() + duration * 60 * 1000);
        const eventEndTime = new Date(eventStartTime.getTime() + 60 * 1000);

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//FocoHero//PWA//PT',
            'BEGIN:VEVENT',
            `UID:${Date.now()}@focohero.app`,
            `DTSTAMP:${formatDT(new Date())}`,
            `DTSTART:${formatDT(eventStartTime)}`,
            `DTEND:${formatDT(eventEndTime)}`,
            `SUMMARY:${eventTitle}`,
            `DESCRIPTION:${eventDescription}`,
            `URL;VALUE=URI:${appUrl}`,
            'BEGIN:VALARM',
            'ACTION:DISPLAY',
            `DESCRIPTION:${eventDescription}`,
            'TRIGGER:-PT0S',
            'END:VALARM',
            'END:VEVENT',
            'END:VCALENDAR',
        ].join('\r\n');

        const base64Content = btoa(unescape(encodeURIComponent(icsContent)));
        window.location.href = `data:text/calendar;base64,${base64Content}`;

        handleStartPauseLogic();
        ui.hideModal(dom.iosStartPromptModalOverlay);
    });

    dom.iosPromptCancelBtn.addEventListener('click', () => {
        handleStartPauseLogic();
        ui.hideModal(dom.iosStartPromptModalOverlay);
    });

    // Encerrar / Arquivar Dia
    dom.resetBtn.addEventListener('click', () => ui.showModal(dom.resetConfirmModalOverlay));

    if (dom.timerScreenNotice) {
        dom.timerScreenNotice.addEventListener('click', () => ui.dismissCurrentScreenNotice());
    }
    if (dom.cardInlineNotice) {
        dom.cardInlineNotice.addEventListener('click', () => ui.dismissCurrentScreenNotice());
    }

    if (dom.resetConfirmKeepBtn) {
        dom.resetConfirmKeepBtn.addEventListener('click', async () => {
            await archiveDay(state.currentDate, { keepPendingTasks: true });
            soundEngine.updatePlaybackForTimerState();
            ui.renderTasks();
            ui.renderDashboard();
            ui.updateUI();
            ui.hideModal(dom.resetConfirmModalOverlay);
            ui.enqueueScreenNotice({
                badge: 'Dia Arquivado',
                title: 'Histórico Salvo!',
                subtitle: 'Suas tarefas pendentes foram mantidas para hoje.',
                icon: 'calendar-check',
                accent: 'primary',
            });
        });
    }

    if (dom.resetConfirmClearBtn) {
        dom.resetConfirmClearBtn.addEventListener('click', async () => {
            await archiveDay(state.currentDate, { keepPendingTasks: false });
            soundEngine.updatePlaybackForTimerState();
            ui.renderTasks();
            ui.renderDashboard();
            ui.updateUI();
            ui.hideModal(dom.resetConfirmModalOverlay);
            ui.enqueueScreenNotice({
                badge: 'Dia Arquivado',
                title: 'Histórico Salvo e Lista Limpa!',
                subtitle: 'Pronto para começar um novo dia.',
                icon: 'calendar-check',
                accent: 'primary',
            });
        });
    }

    // Tarefas
    dom.addTaskBtn.addEventListener('click', handleAddTask);
    dom.newTaskInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleAddTask();
    });

    if (dom.toggleCompletedTasksBtn) {
        dom.toggleCompletedTasksBtn.addEventListener('click', () => {
            tasks.toggleShowCompleted();
            ui.updateShowCompletedBtn();
            ui.renderTasks();
            saveState();
        });
    }

    dom.taskListEl.addEventListener('click', (e) => {
        if (e.target.matches('.task-edit-input')) return;

        const target = e.target.closest(
            '[data-id], [data-complete-id], [data-edit-id], [data-delete-id], [data-move-up-id], [data-move-down-id]'
        );
        if (!target) return;

        const id = parseInt(
            target.dataset.id ||
                target.dataset.completeId ||
                target.dataset.editId ||
                target.dataset.deleteId ||
                target.dataset.moveUpId ||
                target.dataset.moveDownId,
            10
        );

        if (target.matches('[data-complete-id]')) {
            const wasCompleted = tasks.toggleTaskCompleted(id);
            if (wasCompleted) {
                const leveledUp = gamification.addXP(10);
                gamification.addCoins(2);
                if (leveledUp) {
                    ui.enqueueScreenNotice({
                        badge: 'Subiu de Nível',
                        title: `Nível ${state.gamification.level} Alcançado!`,
                        subtitle: 'Parabéns pela conclusão das tarefas!',
                        icon: 'sparkles',
                        accent: 'coin',
                    });
                }
                checkGains();
            }
            if (state.isRunning && state.selectedTaskId === id) {
                timer.pauseTimer();
                timer.resetTimer('focus');
            }
        } else if (target.matches('[data-move-up-id]')) {
            tasks.moveTask(id, 'up');
        } else if (target.matches('[data-move-down-id]')) {
            tasks.moveTask(id, 'down');
        } else if (target.matches('[data-edit-id]')) {
            const inputSelector = tasks.toggleEditState(id);
            ui.renderTasks();
            if (inputSelector) {
                const inputEl = dom.taskListEl.querySelector(inputSelector);
                if (inputEl) inputEl.focus();
            }
            saveState();
            return;
        } else if (target.matches('[data-delete-id]')) {
            tasks.deleteTask(id);
        } else if (target.matches('[data-id]')) {
            tasks.selectTask(id);
            timer.resetTimer('focus');
        }

        ui.renderTasks();
        ui.updateUI();
        ui.updateGamificationUI();
        saveState();
    });

    dom.taskListEl.addEventListener('focusout', (e) => {
        if (e.target.matches('.task-edit-input')) {
            const id = parseInt(e.target.dataset.editInputId, 10);
            tasks.updateTaskName(id, e.target.value.trim());
            ui.renderTasks();
            saveState();
        }
    });

    dom.taskListEl.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' && e.target.matches('.task-edit-input')) {
            e.target.blur();
        }
    });

    // Abas internas do Dashboard
    if (dom.viewDashboard) {
        const tabButtons = dom.viewDashboard.querySelectorAll('.dashboard-tab');
        const tabContents = dom.viewDashboard.querySelectorAll('.dashboard-tab-content');

        tabButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                tabButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
                tabContents.forEach((content) => content.classList.toggle('hidden', content.id !== `dashboard-${tabName}-content`));
            });
        });
    }

    // Loja
    dom.shopCollectionsContainer.addEventListener('click', (e) => {
        const previewBtn = e.target.closest('[data-preview-theme]');
        if (previewBtn) {
            shop.previewTheme(previewBtn.dataset.previewTheme, 10000);
            return;
        }
        const buyButton = e.target.closest('.buy-btn');
        if (buyButton && !buyButton.disabled) {
            shop.buyItem(buyButton.dataset.itemId);
        }
    });

    // Configurações & Backup
    if (dom.notificationsToggleCheckbox) {
        dom.notificationsToggleCheckbox.addEventListener('change', async (e) => {
            if (e.target.checked) {
                const perm = await requestNotificationPermission();
                if (perm !== 'granted') {
                    e.target.checked = false;
                    ui.enqueueScreenNotice({
                        badge: 'Notificações',
                        title: 'Permissão Negada',
                        subtitle: 'Libere as notificações nas configurações do navegador.',
                        icon: 'bell',
                        accent: 'primary',
                    });
                }
            } else {
                state.settings.notificationsEnabled = false;
            }
        });
    }

    dom.settingsSaveBtn.addEventListener('click', () => {
        state.settings.focusDuration = Math.max(1, parseInt(dom.focusDurationInput.value, 10) || 25);
        state.settings.shortBreakDuration = Math.max(1, parseInt(dom.shortBreakDurationInput.value, 10) || 5);
        state.settings.longBreakDuration = Math.max(1, parseInt(dom.longBreakDurationInput.value, 10) || 15);
        state.settings.longBreakInterval = Math.max(1, parseInt(dom.longBreakIntervalInput.value, 10) || 4);
        state.settings.autoStartBreak = Boolean(dom.autoStartBreakCheckbox?.checked);
        state.settings.autoStartFocus = Boolean(dom.autoStartFocusCheckbox?.checked);
        state.settings.soundEnabled = dom.soundToggleCheckbox ? dom.soundToggleCheckbox.checked : true;

        if (!state.isRunning && !state.isPaused) {
            timer.resetTimer('focus');
            ui.updateUI();
        }
        saveState();
        navigateTo('focus');
    });

    if (dom.exportBackupBtn) {
        dom.exportBackupBtn.addEventListener('click', () => {
            const json = exportBackupJSON();
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `focohero-backup-${getLocalDateString()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    if (dom.importBackupBtn && dom.importBackupInput) {
        dom.importBackupBtn.addEventListener('click', () => dom.importBackupInput.click());
        dom.importBackupInput.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
                const text = await file.text();
                await importBackupJSON(text);
                ui.applyTheme(state.settings.theme);
                ui.updateMethodToggleUI();
                ui.renderTasks();
                ui.updateGamificationUI();
                ui.renderDashboard();
                ui.renderSoundscapesPanel();
                ui.updateUI();
                navigateTo('focus');
                ui.enqueueScreenNotice({
                    badge: 'Backup Local',
                    title: 'Backup Restaurado!',
                    subtitle: 'Seus dados e histórico foram importados com sucesso.',
                    icon: 'upload',
                    accent: 'primary',
                });
            } catch (err) {
                ui.enqueueScreenNotice({
                    badge: 'Erro no Backup',
                    title: 'Arquivo Inválido',
                    subtitle: err.message,
                    icon: 'x',
                    accent: 'primary',
                });
            } finally {
                dom.importBackupInput.value = '';
            }
        });
    }

    // --- PAISAGENS SONORAS (MIXER + MÚSICAS LOCAIS) ---
    if (dom.soundTogglePanelBtn) {
        dom.soundTogglePanelBtn.addEventListener('click', () => {
            state.soundPanelOpen = !state.soundPanelOpen;
            ui.renderSoundscapesPanel();
        });
    }

    if (dom.soundClosePanelBtn) {
        dom.soundClosePanelBtn.addEventListener('click', () => {
            state.soundPanelOpen = false;
            ui.renderSoundscapesPanel();
        });
    }

    if (dom.soundPreviewBtn) {
        dom.soundPreviewBtn.addEventListener('click', () => {
            state.isSoundPreviewing = !state.isSoundPreviewing;
            soundEngine.updatePlaybackForTimerState();
            ui.renderSoundscapesPanel();
        });
    }

    if (dom.soundMasterVolume) {
        dom.soundMasterVolume.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10) / 100;
            soundEngine.setMasterVolume(val);
            if (dom.soundMasterVolumeValue) {
                dom.soundMasterVolumeValue.textContent = `${e.target.value}%`;
            }
        });
        dom.soundMasterVolume.addEventListener('change', () => saveState());
    }

    if (dom.soundPauseBehavior) {
        dom.soundPauseBehavior.addEventListener('change', (e) => {
            state.settings.soundscapes.pauseBehavior = e.target.value;
            soundEngine.updatePlaybackForTimerState();
            saveState();
        });
    }

    if (dom.soundSyncTheme) {
        dom.soundSyncTheme.addEventListener('change', (e) => {
            state.settings.soundscapes.syncWithTheme = Boolean(e.target.checked);
            if (state.settings.soundscapes.syncWithTheme) {
                const suggested = getSuggestedSoundscapeForTheme(
                    state.settings.theme,
                    state.gamification.unlockedSoundPacks
                );
                state.settings.soundscapes.activeLayers = { [suggested]: 0.7 };
                soundEngine.updatePlaybackForTimerState();
                ui.renderSoundscapesPanel();
            }
            saveState();
        });
    }

    if (dom.soundscapePanel) {
        dom.soundscapePanel.addEventListener('click', async (e) => {
            const toggleBtn = e.target.closest('[data-sound-toggle]');
            if (toggleBtn && !toggleBtn.disabled) {
                soundEngine.toggleSoundLayer(toggleBtn.dataset.soundToggle, 0.7);
                ui.renderSoundscapesPanel();
                saveState();
                return;
            }

            const deleteBtn = e.target.closest('[data-delete-audio]');
            if (deleteBtn) {
                const rawId = deleteBtn.dataset.deleteAudio;
                const layerId = `custom:${rawId}`;
                if (state.settings.soundscapes?.activeLayers?.[layerId] !== undefined) {
                    delete state.settings.soundscapes.activeLayers[layerId];
                }
                state.customAudios = (state.customAudios || []).filter((a) => a.id !== rawId);
                soundEngine.revokeCustomAudioUrl(rawId);
                soundEngine.updatePlaybackForTimerState();
                await deleteCustomAudioFromDB(rawId);
                ui.renderSoundscapesPanel();
                saveState();
            }
        });

        dom.soundscapePanel.addEventListener('input', (e) => {
            const slider = e.target.closest('[data-sound-volume]');
            if (!slider) return;
            const vol = parseInt(slider.value, 10) / 100;
            soundEngine.setLayerVolume(slider.dataset.soundVolume, vol);
        });

        dom.soundscapePanel.addEventListener('change', (e) => {
            if (e.target.matches('[data-sound-volume]')) {
                saveState();
            }
        });
    }

    if (dom.importAudioBtn && dom.importAudioInput) {
        dom.importAudioBtn.addEventListener('click', () => dom.importAudioInput.click());
        dom.importAudioInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files || []);
            for (const file of files) {
                const track = {
                    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    name: file.name.replace(/\.[^/.]+$/, ''),
                    mimeType: file.type || 'audio/mpeg',
                    size: file.size,
                    createdAt: Date.now(),
                    blob: file,
                };
                await saveCustomAudioToDB(track);
                state.customAudios.push(track);
                state.settings.soundscapes.activeLayers[`custom:${track.id}`] = 0.75;
            }
            dom.importAudioInput.value = '';
            soundEngine.updatePlaybackForTimerState();
            ui.renderSoundscapesPanel();
            saveState();
        });
    }

    dom.colorPaletteSelector.addEventListener('click', (e) => {
        const target = e.target.closest('button[data-theme]');
        if (target) {
            state.settings.theme = target.dataset.theme;
            state.gamification.changedThemesCount.add(state.settings.theme);
            if (state.settings.soundscapes?.syncWithTheme) {
                const suggested = getSuggestedSoundscapeForTheme(
                    state.settings.theme,
                    state.gamification.unlockedSoundPacks
                );
                state.settings.soundscapes.activeLayers = { [suggested]: 0.7 };
                soundEngine.updatePlaybackForTimerState();
                ui.renderSoundscapesPanel();
            }
            ui.applyTheme(state.settings.theme);
            ui.renderPaletteSelector();
            ui.updateMethodToggleUI();
            ui.updateUI();
            checkGains();
            saveState();
        }
    });

    dom.focusMethodToggle.addEventListener('click', (e) => {
        const target = e.target.closest('.method-btn');
        if (target && !state.isRunning && !state.isPaused) {
            state.settings.focusMethod = target.dataset.method;
            ui.updateMethodToggleUI();
            timer.resetTimer('focus');
            ui.renderTasks();
            ui.updateUI();
            saveState();
        } else if (state.isRunning || state.isPaused) {
            ui.enqueueScreenNotice({
                badge: 'Modo de Foco',
                title: 'Sessão em Andamento',
                subtitle: 'Finalize ou zere a sessão atual antes de trocar de modo.',
                icon: 'timer',
                accent: 'primary',
            });
        }
    });

    // Atalhos de teclado: Espaço (Play/Pause), N (Nova tarefa), Esc (Fechar diálogo / aviso / sair do Zen / voltar ao Foco)
    document.addEventListener('keydown', (e) => {
        const activeTag = document.activeElement?.tagName;
        const isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT';

        if (e.key === 'Escape') {
            const openOverlay = document.querySelector('.modal-overlay.visible');
            if (openOverlay) {
                ui.hideModal(openOverlay);
                return;
            }
            if (ui.hasActiveScreenNotice()) {
                ui.dismissCurrentScreenNotice();
                return;
            }
            if (state.zenMode) {
                state.zenMode = false;
                ui.updateZenModeUI();
                return;
            }
            if (state.activeView !== 'focus') {
                navigateTo('focus');
            }
            return;
        }

        if (isTyping) return;
        if (document.querySelector('.modal-overlay.visible')) return;

        if (e.code === 'Space' && state.activeView === 'focus') {
            e.preventDefault();
            triggerStartPause();
        } else if (e.key.toLowerCase() === 'n' && !state.zenMode) {
            e.preventDefault();
            if (state.activeView !== 'focus') navigateTo('focus');
            dom.newTaskInput?.focus();
        }
    });

    // Banner PWA
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        state.deferredInstallPrompt = e;
        if (dom.installBanner) dom.installBanner.style.display = 'block';
    });

    if (dom.installBtn) {
        dom.installBtn.addEventListener('click', async () => {
            if (!state.deferredInstallPrompt) return;
            state.deferredInstallPrompt.prompt();
            await state.deferredInstallPrompt.userChoice;
            state.deferredInstallPrompt = null;
            if (dom.installBanner) dom.installBanner.style.display = 'none';
        });
    }

    if (dom.installDismissBtn) {
        dom.installDismissBtn.addEventListener('click', () => {
            if (dom.installBanner) dom.installBanner.style.display = 'none';
        });
    }

    // Fechar diálogos pontuais
    [
        dom.resetConfirmModalOverlay,
        dom.iosStartPromptModalOverlay,
    ].forEach((overlay) => {
        if (!overlay) return;
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) ui.hideModal(overlay);
        });
    });

    if (dom.resetCancelBtn) {
        dom.resetCancelBtn.addEventListener('click', () => ui.hideModal(dom.resetConfirmModalOverlay));
    }

    initializeApp();
});
