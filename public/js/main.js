/**
 * main.js
 * Orquestrador principal da aplicação Foco Total v2 (Offline-First PWA).
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

        if (state.isRunning) {
            state.timerInterval = setInterval(handleTimerTick, 1000);
        }

        await saveState();
        renderIcons(document);
        registerServiceWorker();

        // Verifica virada de dia a cada minuto e ao voltar para a aba
        setInterval(handleRolloverCheck, 60000);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) handleRolloverCheck();
        });

        state.isAppInitialized = true;
    }

    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').catch((err) => {
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
        const hadInterruptionsThisSession = state.uninterruptedSessionsToday === 0 && state.tasks.some((t) => t.id === state.selectedTaskId && (t.internalInterruptions > 0 || t.externalInterruptions > 0));
        const { previousMode, focusDuration } = timer.switchMode();
        playFinishSound();
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);

        if (previousMode === 'focus') {
            const streakInfo = gamification.checkStreak();
            if (streakInfo) {
                if (streakInfo.freezesUsed > 0) {
                    ui.showModal(
                        dom.alertModalOverlay,
                        `Escudo de Sequência ativado! Sua sequência foi protegida e subiu para ${streakInfo.streak} dias (+${streakInfo.bonus} moedas).`
                    );
                } else if (streakInfo.bonus > 0) {
                    ui.showModal(
                        dom.alertModalOverlay,
                        `Sequência de ${streakInfo.streak} dias! Você ganhou ${streakInfo.bonus} moedas de bônus!`
                    );
                }
            }

            const rewards = gamification.calculateSessionRewards(focusDuration, !hadInterruptionsThisSession);
            const leveledUp = gamification.addXP(rewards.xp);
            gamification.addCoins(rewards.coins);

            if (leveledUp) {
                playBeep(659, 150, 0.4);
                setTimeout(() => playBeep(784, 300, 0.5), 200);
                ui.showModal(dom.alertModalOverlay, `Parabéns! Você alcançou o Nível ${state.gamification.level}!`);
            }

            const endMessage =
                state.settings.focusMethod === 'pomodoro'
                    ? 'Você completou um Pomodoro! Hora de fazer uma pausa.'
                    : 'Sessão de foco finalizada!';
            ui.showModal(dom.sessionEndModalOverlay, endMessage);
            sendNotification('Foco Total — Sessão Concluída!', endMessage);

            dom.xpGainDisplay.textContent = `+${rewards.xp} XP`;
            dom.coinGainDisplay.textContent =
                rewards.bonusCoins > 0
                    ? `+${rewards.coins} Moedas (inclui +${rewards.bonusCoins} bônus sem interrupção)`
                    : `+${rewards.coins} Moedas`;

            checkGains({ endedFocusSession: true });
        } else {
            const breakMsg = 'Pausa finalizada! Vamos voltar ao foco?';
            ui.showModal(dom.sessionEndModalOverlay, breakMsg);
            sendNotification('Foco Total — Pausa Finalizada!', breakMsg);
            checkGains();
        }

        startNextAutoSessionIfEnabled(previousMode);
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
        const tag = dom.newTaskTagSelect ? dom.newTaskTagSelect.value : 'Geral';
        const newTask = tasks.addTask(taskName, estimate, tag);
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
            saveState();
        } else {
            const startResult = timer.startTimer();
            if (startResult === 'NO_TASK') {
                ui.showModal(dom.alertModalOverlay, 'Por favor, selecione uma tarefa para iniciar o foco.');
            } else if (startResult) {
                if (state.mode === 'focus' && new Date().getHours() < 9) {
                    state.startedBefore9AM = 1;
                }
                state.timerInterval = setInterval(handleTimerTick, 1000);
                checkGains();
                saveState();
            }
        }
        ui.updateUI();
    }

    function triggerStartPause() {
        if (!state.audioInitialized) resumeAudio();
        if (dom.xpGainDisplay) dom.xpGainDisplay.textContent = '';
        if (dom.coinGainDisplay) dom.coinGainDisplay.textContent = '';

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

    // --- EVENT LISTENERS ---
    if (dom.zenModeBtn) {
        dom.zenModeBtn.addEventListener('click', () => {
            state.zenMode = !state.zenMode;
            ui.updateZenModeUI();
        });
    }

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
            eventTitle = `🎉 Fim do Foco: ${task ? task.name : 'Foco'}`;
            eventDescription = `Sua sessão de foco terminou. Hora de fazer uma pausa! Volte ao app: ${appUrl}`;
            duration = state.settings.focusDuration;
        } else {
            eventTitle = state.mode === 'shortBreak' ? '🚀 Fim da Pausa Curta' : '🏆 Fim da Pausa Longa';
            eventDescription = `Sua pausa acabou. Hora de voltar ao foco! Volte ao app: ${appUrl}`;
            duration = state.mode === 'shortBreak' ? state.settings.shortBreakDuration : state.settings.longBreakDuration;
        }

        const formatDT = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const eventStartTime = new Date(Date.now() + duration * 60 * 1000);
        const eventEndTime = new Date(eventStartTime.getTime() + 60 * 1000);

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//FocoTotal//PWA//PT',
            'BEGIN:VEVENT',
            `UID:${Date.now()}@focototal.app`,
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

    if (dom.resetConfirmKeepBtn) {
        dom.resetConfirmKeepBtn.addEventListener('click', async () => {
            await archiveDay(state.currentDate, { keepPendingTasks: true });
            ui.renderTasks();
            ui.renderDashboard();
            ui.updateUI();
            ui.hideModal(dom.resetConfirmModalOverlay);
            ui.showModal(dom.alertModalOverlay, 'Dia arquivado no histórico! As tarefas pendentes foram mantidas.');
        });
    }

    if (dom.resetConfirmClearBtn) {
        dom.resetConfirmClearBtn.addEventListener('click', async () => {
            await archiveDay(state.currentDate, { keepPendingTasks: false });
            ui.renderTasks();
            ui.renderDashboard();
            ui.updateUI();
            ui.hideModal(dom.resetConfirmModalOverlay);
            ui.showModal(dom.alertModalOverlay, 'Dia arquivado no histórico e lista limpa com sucesso!');
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

    if (dom.taskTagFilter) {
        dom.taskTagFilter.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-filter-tag]');
            if (!btn) return;
            state.selectedTagFilter = btn.dataset.filterTag;
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
                    ui.showModal(dom.alertModalOverlay, `Parabéns! Você alcançou o Nível ${state.gamification.level}!`);
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

    // Modais e Dashboard
    dom.settingsBtn.addEventListener('click', () => {
        ui.renderPaletteSelector();
        ui.showModal(dom.settingsModalOverlay);
    });

    dom.dashboardBtn.addEventListener('click', () => {
        ui.renderDashboard();
        ui.showModal(dom.dashboardModalOverlay);
    });

    if (dom.dashboardModalOverlay) {
        const tabButtons = dom.dashboardModalOverlay.querySelectorAll('.dashboard-tab');
        const tabContents = dom.dashboardModalOverlay.querySelectorAll('.dashboard-tab-content');

        tabButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                tabButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
                tabContents.forEach((content) => content.classList.toggle('hidden', content.id !== `dashboard-${tabName}-content`));
            });
        });
    }

    dom.shopBtn.addEventListener('click', () => {
        shop.renderShop();
        ui.showModal(dom.shopModalOverlay);
    });

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

    if (dom.shopModalCloseBtn) {
        dom.shopModalCloseBtn.addEventListener('click', () => shop.cancelThemePreview());
    }

    dom.helpBtn.addEventListener('click', () => {
        const isPomodoro = state.settings.focusMethod === 'pomodoro';
        dom.helpContentPomodoro.classList.toggle('hidden', !isPomodoro);
        dom.helpContentAdaptativo.classList.toggle('hidden', isPomodoro);
        ui.showModal(dom.helpModalOverlay);
    });

    if (dom.notificationsToggleCheckbox) {
        dom.notificationsToggleCheckbox.addEventListener('change', async (e) => {
            if (e.target.checked) {
                const perm = await requestNotificationPermission();
                if (perm !== 'granted') {
                    e.target.checked = false;
                    ui.showModal(dom.alertModalOverlay, 'Permissão de notificações não concedida no navegador.');
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

        ui.hideModal(dom.settingsModalOverlay);
        if (!state.isRunning && !state.isPaused) {
            timer.resetTimer('focus');
            ui.updateUI();
        }
        saveState();
    });

    // Exportar / Importar Backup JSON
    if (dom.exportBackupBtn) {
        dom.exportBackupBtn.addEventListener('click', () => {
            const json = exportBackupJSON();
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `focototal-backup-${getLocalDateString()}.json`;
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
                ui.updateUI();
                ui.hideModal(dom.settingsModalOverlay);
                ui.showModal(dom.alertModalOverlay, 'Backup restaurado com sucesso!');
            } catch (err) {
                ui.showModal(dom.alertModalOverlay, `Erro ao importar backup: ${err.message}`);
            } finally {
                dom.importBackupInput.value = '';
            }
        });
    }

    dom.colorPaletteSelector.addEventListener('click', (e) => {
        const target = e.target.closest('button[data-theme]');
        if (target) {
            state.settings.theme = target.dataset.theme;
            state.gamification.changedThemesCount.add(state.settings.theme);
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
            ui.showModal(dom.alertModalOverlay, 'Finalize ou zere a sessão atual antes de trocar de modo.');
        }
    });

    // Atalhos de teclado: Espaço (Play/Pause), N (Nova tarefa), Esc (Fechar modais / Sair do Zen)
    document.addEventListener('keydown', (e) => {
        const activeTag = document.activeElement?.tagName;
        const isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT';

        if (e.key === 'Escape') {
            const openOverlay = document.querySelector('.modal-overlay.visible');
            if (openOverlay) {
                if (openOverlay === dom.shopModalOverlay) shop.cancelThemePreview();
                ui.hideModal(openOverlay);
                return;
            }
            if (state.zenMode) {
                state.zenMode = false;
                ui.updateZenModeUI();
            }
            return;
        }

        if (isTyping) return;
        if (document.querySelector('.modal-overlay.visible')) return;

        if (e.code === 'Space') {
            e.preventDefault();
            triggerStartPause();
        } else if (e.key.toLowerCase() === 'n' && !state.zenMode) {
            e.preventDefault();
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

    // Fechar Modais
    [
        dom.alertModalOverlay,
        dom.settingsModalOverlay,
        dom.dashboardModalOverlay,
        dom.helpModalOverlay,
        dom.resetConfirmModalOverlay,
        dom.sessionEndModalOverlay,
        dom.shopModalOverlay,
        dom.iosStartPromptModalOverlay,
    ].forEach((overlay) => {
        if (!overlay) return;
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                if (overlay === dom.shopModalOverlay) shop.cancelThemePreview();
                ui.hideModal(overlay);
            }
        });
    });

    [
        dom.alertModalCloseBtn,
        dom.sessionEndCloseBtn,
        dom.dashboardModalCloseBtn,
        dom.helpModalCloseBtn,
        dom.resetCancelBtn,
        dom.shopModalCloseBtn,
    ].forEach((btn) => {
        if (btn) {
            btn.addEventListener('click', () => {
                const overlay = btn.closest('.modal-overlay');
                if (overlay === dom.shopModalOverlay) shop.cancelThemePreview();
                ui.hideModal(overlay);
            });
        }
    });

    initializeApp();
});
