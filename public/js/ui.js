/**
 * ui.js
 * Centraliza referências aos elementos do DOM.
 */

export const dom = {};

export function initializeDOM() {
    dom.appContainer = document.getElementById('app-container');
    dom.deviceShell = document.getElementById('device-shell');
    dom.themeColorMeta = document.getElementById('theme-color-meta');

    // Header & Zen Mode & Mini Timer & Paisagens Sonoras
    dom.soundTogglePanelBtn = document.getElementById('sound-toggle-panel-btn');
    dom.zenModeBtn = document.getElementById('zen-mode-btn');
    dom.focusMethodToggle = document.getElementById('focus-method-toggle');
    dom.miniTimerPill = document.getElementById('mini-timer-pill');
    dom.miniTimerDisplay = document.getElementById('mini-timer-display');

    // Mixer de Paisagens Sonoras
    dom.soundscapePanel = document.getElementById('soundscape-panel');
    dom.soundPreviewBtn = document.getElementById('sound-preview-btn');
    dom.soundClosePanelBtn = document.getElementById('sound-close-panel-btn');
    dom.soundMasterVolume = document.getElementById('sound-master-volume');
    dom.soundMasterVolumeValue = document.getElementById('sound-master-volume-value');
    dom.soundPauseBehavior = document.getElementById('sound-pause-behavior');
    dom.soundSyncTheme = document.getElementById('sound-sync-theme');
    dom.soundscapeBuiltInList = document.getElementById('soundscape-built-in-list');
    dom.soundscapeCustomList = document.getElementById('soundscape-custom-list');
    dom.importAudioBtn = document.getElementById('import-audio-btn');
    dom.importAudioInput = document.getElementById('import-audio-input');

    // Views no card principal & barra de navegação
    dom.viewFocus = document.getElementById('view-focus');
    dom.viewDashboard = document.getElementById('view-dashboard');
    dom.viewShop = document.getElementById('view-shop');
    dom.viewSettings = document.getElementById('view-settings');
    dom.viewHelp = document.getElementById('view-help');
    dom.bottomNav = document.getElementById('bottom-nav');

    // Visor Inteligente do Timer & Aviso Inline
    dom.timerPanel = document.getElementById('timer-panel');
    dom.timerRingView = document.getElementById('timer-ring-view');
    dom.timerScreenNotice = document.getElementById('timer-screen-notice');
    dom.screenNoticeBadge = document.getElementById('screen-notice-badge');
    dom.screenNoticeIcon = document.getElementById('screen-notice-icon');
    dom.screenNoticeTitle = document.getElementById('screen-notice-title');
    dom.screenNoticeSubtitle = document.getElementById('screen-notice-subtitle');
    dom.screenNoticeRewards = document.getElementById('screen-notice-rewards');
    dom.screenNoticeBar = document.getElementById('screen-notice-bar');
    dom.screenNoticeHint = document.getElementById('screen-notice-hint');
    dom.cardInlineNotice = document.getElementById('card-inline-notice');
    dom.inlineNoticeIcon = document.getElementById('inline-notice-icon');
    dom.inlineNoticeTitle = document.getElementById('inline-notice-title');
    dom.inlineNoticeSubtitle = document.getElementById('inline-notice-subtitle');
    dom.inlineNoticeQueue = document.getElementById('inline-notice-queue');

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
    dom.newTaskEstimateInput = document.getElementById('new-task-estimate');
    dom.newTaskEstimateLabel = document.getElementById('new-task-estimate-label');
    dom.addTaskBtn = document.getElementById('add-task-btn');
    dom.currentTaskDisplay = document.getElementById('current-task-display');
    dom.toggleCompletedTasksBtn = document.getElementById('toggle-completed-tasks-btn');
    dom.resetBtn = document.getElementById('reset-btn');
    dom.pomodoroCyclesEl = document.getElementById('pomodoro-cycles');

    // Gamificação na UI Principal
    dom.levelDisplay = document.getElementById('level-display');
    dom.xpDisplay = document.getElementById('xp-display');
    dom.xpNextLevelDisplay = document.getElementById('xp-next-level-display');
    dom.xpBarFill = document.getElementById('xp-bar-fill');
    dom.coinsDisplay = document.getElementById('coins-display');
    dom.streakDisplay = document.getElementById('streak-display');
    dom.streakFreezesDisplay = document.getElementById('streak-freezes-display');

    // Diálogos pontuais
    dom.resetConfirmModalOverlay = document.getElementById('reset-confirm-modal-overlay');
    dom.resetConfirmKeepBtn = document.getElementById('reset-confirm-keep-btn');
    dom.resetConfirmClearBtn = document.getElementById('reset-confirm-clear-btn');
    dom.resetCancelBtn = document.getElementById('reset-cancel-btn');

    // Configurações e Backup
    dom.settingsSaveBtn = document.getElementById('settings-save-btn');
    dom.focusDurationInput = document.getElementById('focus-duration');
    dom.shortBreakDurationInput = document.getElementById('short-break-duration');
    dom.longBreakDurationInput = document.getElementById('long-break-duration');
    dom.longBreakIntervalInput = document.getElementById('long-break-interval');
    dom.autoStartBreakCheckbox = document.getElementById('auto-start-break');
    dom.autoStartFocusCheckbox = document.getElementById('auto-start-focus');
    dom.notificationsToggleCheckbox = document.getElementById('notifications-toggle');
    dom.soundToggleCheckbox = document.getElementById('sound-toggle');
    dom.keepScreenAwakeCheckbox = document.getElementById('keep-screen-awake-toggle');
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
    dom.dashboardDailyReport = document.getElementById('dashboard-daily-report');

    // Banner PWA
    dom.installBanner = document.getElementById('install-banner');
    dom.installBtn = document.getElementById('install-btn');
    dom.installDismissBtn = document.getElementById('install-dismiss-btn');

    // Loja
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
