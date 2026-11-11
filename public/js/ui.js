/**
 * ui.js
 * Centraliza referências aos elementos do DOM.
 */

export const dom = {};

export function initializeDOM() {
    dom.appContainer = document.getElementById('app-container');
    dom.themeColorMeta = document.getElementById('theme-color-meta');

    // Header & Zen Mode
    dom.zenModeBtn = document.getElementById('zen-mode-btn');
    dom.focusMethodToggle = document.getElementById('focus-method-toggle');

    // Timer e Controles Principais
    dom.timerDisplay = document.getElementById('timer-display');
    dom.startPauseBtn = document.getElementById('start-pause-btn');
    dom.finishAdaptiveBtn = document.getElementById('finish-adaptive-btn');
    dom.internalInterruptBtn = document.getElementById('internal-interrupt-btn');
    dom.externalInterruptBtn = document.getElementById('external-interrupt-btn');
    dom.progressRing = document.getElementById('progress-ring');

    // Painel de Tarefas
    dom.taskListEl = document.getElementById('task-list');
    dom.newTaskInput = document.getElementById('new-task-input');
    dom.newTaskTagSelect = document.getElementById('new-task-tag');
    dom.newTaskEstimateInput = document.getElementById('new-task-estimate');
    dom.newTaskEstimateLabel = document.getElementById('new-task-estimate-label');
    dom.addTaskBtn = document.getElementById('add-task-btn');
    dom.currentTaskDisplay = document.getElementById('current-task-display');
    dom.toggleCompletedTasksBtn = document.getElementById('toggle-completed-tasks-btn');
    dom.taskTagFilter = document.getElementById('task-tag-filter');

    // Controles Secundários
    dom.resetBtn = document.getElementById('reset-btn');
    dom.settingsBtn = document.getElementById('settings-btn');
    dom.dashboardBtn = document.getElementById('dashboard-btn');
    dom.shopBtn = document.getElementById('shop-btn');
    dom.helpBtn = document.getElementById('help-btn');
    dom.pomodoroCyclesEl = document.getElementById('pomodoro-cycles');

    // Gamificação na UI Principal
    dom.levelDisplay = document.getElementById('level-display');
    dom.xpDisplay = document.getElementById('xp-display');
    dom.xpNextLevelDisplay = document.getElementById('xp-next-level-display');
    dom.xpBarFill = document.getElementById('xp-bar-fill');
    dom.coinsDisplay = document.getElementById('coins-display');
    dom.streakDisplay = document.getElementById('streak-display');
    dom.streakFreezesDisplay = document.getElementById('streak-freezes-display');

    // Modais e Overlays
    dom.alertModalOverlay = document.getElementById('alert-modal-overlay');
    dom.alertModalCloseBtn = document.getElementById('alert-modal-close-btn');
    dom.sessionEndModalOverlay = document.getElementById('session-end-modal-overlay');
    dom.sessionEndCloseBtn = document.getElementById('session-end-close-btn');
    dom.settingsModalOverlay = document.getElementById('settings-modal-overlay');
    dom.settingsSaveBtn = document.getElementById('settings-save-btn');
    dom.helpModalOverlay = document.getElementById('help-modal-overlay');
    dom.helpModalCloseBtn = document.getElementById('help-modal-close-btn');
    dom.resetConfirmModalOverlay = document.getElementById('reset-confirm-modal-overlay');
    dom.resetConfirmKeepBtn = document.getElementById('reset-confirm-keep-btn');
    dom.resetConfirmClearBtn = document.getElementById('reset-confirm-clear-btn');
    dom.resetCancelBtn = document.getElementById('reset-cancel-btn');
    dom.dashboardModalOverlay = document.getElementById('dashboard-modal-overlay');
    dom.dashboardModalCloseBtn = document.getElementById('dashboard-modal-close-btn');

    // Configurações e Backup
    dom.xpGainDisplay = document.getElementById('xp-gain-display');
    dom.coinGainDisplay = document.getElementById('coin-gain-display');
    dom.focusDurationInput = document.getElementById('focus-duration');
    dom.shortBreakDurationInput = document.getElementById('short-break-duration');
    dom.longBreakDurationInput = document.getElementById('long-break-duration');
    dom.longBreakIntervalInput = document.getElementById('long-break-interval');
    dom.autoStartBreakCheckbox = document.getElementById('auto-start-break');
    dom.autoStartFocusCheckbox = document.getElementById('auto-start-focus');
    dom.notificationsToggleCheckbox = document.getElementById('notifications-toggle');
    dom.soundToggleCheckbox = document.getElementById('sound-toggle');
    dom.colorPaletteSelector = document.getElementById('color-palette-selector');
    dom.exportBackupBtn = document.getElementById('export-backup-btn');
    dom.importBackupBtn = document.getElementById('import-backup-btn');
    dom.importBackupInput = document.getElementById('import-backup-input');

    // Dashboard
    dom.dashboardStatsContent = document.getElementById('dashboard-stats-content');
    dom.dashboardMissionsContent = document.getElementById('dashboard-missions-content');
    dom.dashboardAchievementsContent = document.getElementById('dashboard-achievements-content');
    dom.dashboardCurrentStreak = document.getElementById('dashboard-current-streak');
    dom.dashboardLongestStreak = document.getElementById('dashboard-longest-streak');
    dom.dashboardFreezesCount = document.getElementById('dashboard-freezes-count');
    dom.dashboardWeeklySummary = document.getElementById('dashboard-weekly-summary');
    dom.dashboardWeeklyChart = document.getElementById('dashboard-weekly-chart');
    dom.dashboardInterruptionsSummary = document.getElementById('dashboard-interruptions-summary');
    dom.dashboardTagsSummary = document.getElementById('dashboard-tags-summary');
    dom.dashboardDailyReport = document.getElementById('dashboard-daily-report');

    // Toasts
    dom.achievementToast = document.getElementById('achievement-toast');
    dom.achievementToastName = document.getElementById('achievement-toast-name');
    dom.missionToast = document.getElementById('mission-toast');
    dom.missionToastName = document.getElementById('mission-toast-name');
    dom.missionToastEmoji = document.getElementById('mission-toast-emoji');

    // Banner PWA
    dom.installBanner = document.getElementById('install-banner');
    dom.installBtn = document.getElementById('install-btn');
    dom.installDismissBtn = document.getElementById('install-dismiss-btn');

    // Loja
    dom.shopBtn = document.getElementById('shop-btn');
    dom.shopModalOverlay = document.getElementById('shop-modal-overlay');
    dom.shopModalCloseBtn = document.getElementById('shop-modal-close-btn');
    dom.shopCoinsDisplay = document.getElementById('shop-coins-display');
    dom.shopFreezesDisplay = document.getElementById('shop-freezes-display');
    dom.shopCollectionsContainer = document.getElementById('shop-collections-container');

    // iOS & Ajuda
    dom.iosStartPromptModalOverlay = document.getElementById('ios-start-prompt-modal-overlay');
    dom.iosPromptConfirmBtn = document.getElementById('ios-prompt-confirm-btn');
    dom.iosPromptCancelBtn = document.getElementById('ios-prompt-cancel-btn');
    dom.iosPromptTitle = document.getElementById('ios-prompt-title');
    dom.iosPromptMessage = document.getElementById('ios-prompt-message');
    dom.helpContentPomodoro = document.getElementById('help-content-pomodoro');
    dom.helpContentAdaptativo = document.getElementById('help-content-adaptativo');
}
