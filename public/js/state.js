/**
 * state.js
 * Módulo central de estado da aplicação Foco Hero v2.
 */

export function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const state = {
    isAppInitialized: false,
    activeView: 'focus', // 'focus', 'dashboard', 'shop', 'settings', 'help'
    zenMode: false,
    soundPanelOpen: false,
    isSoundPreviewing: false,
    previewThemeId: null,
    customAudios: [], // carregado do IndexedDB ({ id, name, mimeType, size, createdAt, blob })

    // Estado do Timer e da Sessão
    timerInterval: null,
    isRunning: false,
    isPaused: false,
    mode: 'focus', // 'focus', 'shortBreak', 'longBreak'
    timeRemaining: 0,
    totalTime: 0,
    endTime: null,
    adaptiveElapsed: 0,
    currentDate: getLocalDateString(),
    pomodoroSessionCount: 0,
    uninterruptedSessionsToday: 0,
    tasksAddedToday: 0,
    longBreaksToday: 0,
    startedBefore9AM: 0,

    // Estado das Tarefas
    tasks: [],
    selectedTaskId: null,
    showCompletedTasks: false,

    // Histórico Multi-dias (carregado do IndexedDB)
    history: [],

    // Configurações do Usuário
    settings: {
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4,
        theme: 'brasil_dark',
        focusMethod: 'pomodoro', // 'pomodoro', 'adaptativo'
        autoStartBreak: false,
        autoStartFocus: false,
        notificationsEnabled: false,
        soundEnabled: true,
        keepScreenAwake: false,
        soundscapes: {
            masterVolume: 0.65,
            pauseBehavior: 'mute', // 'mute' | 'duck' | 'continuous'
            syncWithTheme: false,
            fadeDuration: 1.5,
            activeLayers: {},
        },
    },

    // Estado de Gamificação
    gamification: {
        level: 1,
        xp: 0,
        coins: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastSessionDate: null,
        streakFreezes: 0,
        unlockedAchievements: [],
        unlockedThemes: [],
        unlockedSoundPacks: [],
        dailyMissions: [],
        completedMissions: [],
        lastMissionDate: null,
        changedThemesCount: new Set(),
    },

    // Estado do PWA e Áudio
    deferredInstallPrompt: null,
    wakeLockSentinel: null,
    audioContext: null,
    audioInitialized: false,
};
