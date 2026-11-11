import test from 'node:test';
import assert from 'node:assert/strict';

// Mock mínimo de ambiente DOM/Browser antes de importar módulos que referenciam document/localStorage
const storageMap = new Map();
globalThis.localStorage = {
    getItem: (k) => (storageMap.has(k) ? storageMap.get(k) : null),
    setItem: (k, v) => storageMap.set(k, String(v)),
    removeItem: (k) => storageMap.delete(k),
    clear: () => storageMap.clear(),
};

const { state, getLocalDateString } = await import('../public/js/state.js');
const tasks = await import('../public/js/tasks.js');
const timer = await import('../public/js/timer.js');
const gamification = await import('../public/js/gamification.js');
const shopLogic = await import('../public/js/shop_logic.js');
const persistence = await import('../public/js/persistence.js');
const analytics = await import('../public/js/analytics.js');
const soundscapes = await import('../public/js/soundscapes.js');
const soundEngine = await import('../public/js/sound_engine.js');
const shop = await import('../public/js/shop.js');
const themeEffects = await import('../public/js/theme_effects.js');
const {
    escapeHtml,
    enqueueScreenNotice,
    hasActiveScreenNotice,
    dismissCurrentScreenNotice,
    clearAllScreenNotices,
} = await import('../public/js/ui_controller.js');

function resetTestState() {
    clearAllScreenNotices();
    storageMap.clear();
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    state.isRunning = false;
    state.isPaused = false;
    state.mode = 'focus';
    state.timeRemaining = 0;
    state.totalTime = 0;
    state.endTime = null;
    state.adaptiveElapsed = 0;
    state.currentDate = getLocalDateString();
    state.pomodoroSessionCount = 0;
    state.uninterruptedSessionsToday = 0;
    state.tasksAddedToday = 0;
    state.longBreaksToday = 0;
    state.startedBefore9AM = 0;
    state.tasks = [];
    state.selectedTaskId = null;
    state.showCompletedTasks = false;
    state.history = [];
    state.settings = {
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4,
        theme: 'brasil_dark',
        focusMethod: 'pomodoro',
        autoStartBreak: false,
        autoStartFocus: false,
        notificationsEnabled: false,
        soundEnabled: false,
        keepScreenAwake: false,
        soundscapes: {
            masterVolume: 0.65,
            pauseBehavior: 'mute',
            syncWithTheme: false,
            fadeDuration: 1.5,
            activeLayers: {},
        },
    };
    state.gamification = {
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
    };
}

test('tasks: adiciona, reordena e registra interrupções', () => {
    resetTestState();
    const t1 = tasks.addTask('Revisar Direito', 2);
    const t2 = tasks.addTask('Deploy API', 3);

    assert.equal(t1.pomodoroEstimate, 2);
    assert.equal(t2.pomodoroEstimate, 3);
    assert.equal(state.tasks.length, 2);

    assert.equal(tasks.moveTask(t2.id, 'up'), true);
    assert.equal(state.tasks[0].id, t2.id);
    assert.equal(tasks.moveTask(t2.id, 'up'), false);

    tasks.selectTask(t1.id);
    state.isRunning = true;
    assert.equal(tasks.logInterruption('internal'), true);
    assert.equal(tasks.logInterruption('external'), true);
    assert.equal(t1.internalInterruptions, 1);
    assert.equal(t1.externalInterruptions, 1);
});

test('timer: modo Adaptativo pausa sem encerrar e acumula tempo até finalizar', () => {
    resetTestState();
    state.settings.focusMethod = 'adaptativo';
    const task = tasks.addTask('Deep Work', 1, 'Projeto');
    tasks.selectTask(task.id);

    assert.equal(timer.startTimer(), true);
    // Simula 180s decorridos
    state.endTime = Date.now() - 180 * 1000;
    const finishedOnTick = timer.updateTimer();
    assert.equal(finishedOnTick, false);
    assert.ok(state.adaptiveElapsed >= 180);

    // Pausa sem encerrar a sessão
    timer.pauseTimer();
    assert.equal(state.isRunning, false);
    assert.equal(state.isPaused, true);
    assert.equal(task.focusTime, 0);

    // Retoma e finaliza
    assert.equal(timer.startTimer(), true);
    state.endTime = Date.now() - 200 * 1000;
    timer.updateTimer();
    const { previousMode, focusDuration } = timer.switchMode();
    assert.equal(previousMode, 'focus');
    assert.ok(focusDuration >= 200);
    assert.ok(task.focusTime >= 200);
});

test('gamification: recompensas proporcionais e proteção com Escudo de Sequência', () => {
    resetTestState();
    const rewards = gamification.calculateSessionRewards(25 * 60, true);
    assert.equal(rewards.xp, 38); // round(25 * 1.5)
    assert.equal(rewards.bonusCoins, 3);
    assert.equal(rewards.coins, 13); // floor(25/3)+2 + 3

    // Simula último foco há 2 dias (1 dia perdido) com 1 escudo disponível
    const twoDaysAgo = new Date('2026-11-08T10:00:00');
    const today = new Date('2026-11-10T10:00:00');
    state.gamification.currentStreak = 5;
    state.gamification.longestStreak = 5;
    state.gamification.streakFreezes = 1;
    state.gamification.lastSessionDate = twoDaysAgo.toISOString();

    const streakResult = gamification.checkStreak(today);
    assert.equal(streakResult.freezesUsed, 1);
    assert.equal(streakResult.streak, 6);
    assert.equal(state.gamification.streakFreezes, 0);

    // Se perder outro dia sem escudo, reinicia para 1
    const twoDaysLater = new Date('2026-11-12T10:00:00');
    const brokenResult = gamification.checkStreak(twoDaysLater);
    assert.equal(brokenResult.freezesUsed, 0);
    assert.equal(brokenResult.streak, 1);
});

test('shop_logic: sazonalidade real e compra de Escudo de Sequência', () => {
    resetTestState();
    const carnaval = shopLogic.findShopItem('CARNAVAL');
    assert.equal(shopLogic.isItemAvailableNow(carnaval, new Date('2026-02-15T12:00:00')), true);
    assert.equal(shopLogic.isItemAvailableNow(carnaval, new Date('2026-10-15T12:00:00')), false);

    state.gamification.coins = 500;
    const blockedSeasonal = shopLogic.buyItem('CARNAVAL', new Date('2026-10-15T12:00:00'));
    assert.equal(blockedSeasonal.ok, false);
    assert.equal(blockedSeasonal.reason, 'OUT_OF_SEASON');

    const buyFreeze = shopLogic.buyItem('STREAK_FREEZE');
    assert.equal(buyFreeze.ok, true);
    assert.equal(state.gamification.streakFreezes, 1);
    assert.equal(state.gamification.coins, 380);
});

test('persistence & analytics: virada de dia arquiva histórico e mantém pendentes + backup JSON', async () => {
    resetTestState();
    state.currentDate = '2026-11-09';
    const doneTask = tasks.addTask('Tarefa Concluída', 1);
    doneTask.completed = true;
    doneTask.focusTime = 1500;
    doneTask.pomodorosCompleted = 1;

    const pendingTask = tasks.addTask('Tarefa Pendente', 2);
    pendingTask.focusTime = 600;

    const archived = await persistence.checkDayRollover('2026-11-10');
    assert.equal(archived, '2026-11-09');
    assert.equal(state.history.length, 1);
    assert.equal(state.history[0].focusTimeSeconds, 2100);
    assert.equal(state.history[0].pomodorosCompleted, 1);

    // Tarefa concluída foi arquivada; pendente permaneceu zerada para hoje
    assert.equal(state.tasks.length, 1);
    assert.equal(state.tasks[0].name, 'Tarefa Pendente');
    assert.equal(state.tasks[0].focusTime, 0);

    // Testa Exportar e Importar backup JSON
    pendingTask.focusTime = 300;
    const backupText = persistence.exportBackupJSON();
    resetTestState();
    await persistence.importBackupJSON(backupText);
    assert.equal(state.history.length, 1);
    assert.equal(state.tasks.length, 1);

    const weekly = analytics.getWeeklyAggregates(7, new Date('2026-11-10T12:00:00'));
    assert.equal(weekly.totalFocusSeconds, 2100);
    assert.equal(weekly.totalPomodoros, 1);
});

test('ui_controller: escapeHtml neutraliza payload XSS', () => {
    const escaped = escapeHtml('<img src=x onerror="alert(1)"> & \'teste\'');
    assert.equal(escaped, '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;teste&#39;');
});

test('soundscapes & sound_engine: camadas, pausas, vínculo com tema e compra de pacote', () => {
    resetTestState();

    // Tema Praias cai para pink_noise enquanto PACK_ZEN estiver bloqueado
    assert.equal(soundscapes.getSuggestedSoundscapeForTheme('natureza_praias', []), 'pink_noise');

    // Compra pacote PACK_ZEN na loja
    state.gamification.coins = 200;
    const buyRes = shopLogic.buyItem('SOUND_PACK_ZEN');
    assert.equal(buyRes.ok, true);
    assert.ok(state.gamification.unlockedSoundPacks.includes('PACK_ZEN'));
    assert.equal(soundscapes.getSuggestedSoundscapeForTheme('natureza_praias', state.gamification.unlockedSoundPacks), 'ocean');

    // Mixer de múltiplas camadas e volumes
    assert.equal(soundEngine.toggleSoundLayer('rain', 0.8), true);
    assert.equal(soundEngine.toggleSoundLayer('ocean', 0.5), true);
    soundEngine.setLayerVolume('rain', 0.6);
    assert.equal(state.settings.soundscapes.activeLayers.rain, 0.6);

    // Comportamento nas pausas: mute, duck (25%), continuous
    soundEngine.setMasterVolume(0.8);
    state.settings.soundscapes.pauseBehavior = 'mute';
    assert.equal(soundEngine.getTargetMasterGain({ isBreak: true }), 0);

    state.settings.soundscapes.pauseBehavior = 'duck';
    assert.ok(Math.abs(soundEngine.getTargetMasterGain({ isBreak: true }) - 0.2) < 1e-9);

    state.settings.soundscapes.pauseBehavior = 'continuous';
    assert.equal(soundEngine.getTargetMasterGain({ isBreak: true }), 0.8);
    clearAllScreenNotices();
});

test('ui_controller: fila de notificações no visor do timer', () => {
    resetTestState();
    assert.equal(hasActiveScreenNotice(), false);

    enqueueScreenNotice({ badge: 'Missão', title: 'Aviso 1', durationMs: 5000 });
    enqueueScreenNotice({ badge: 'Conquista', title: 'Aviso 2', durationMs: 5000 });
    assert.equal(hasActiveScreenNotice(), true);

    dismissCurrentScreenNotice();
    assert.equal(hasActiveScreenNotice(), true);

    dismissCurrentScreenNotice();
    assert.equal(hasActiveScreenNotice(), false);
});

test('theme_effects: efeitos visuais cobrem todos os 16 temas compráveis incluindo Matriz', () => {
    assert.equal(themeEffects.getEffectForTheme('tech_matrix'), 'matrix');
    assert.equal(themeEffects.getEffectForTheme('brasil_dark'), null);

    const shopThemes = Object.values(shop.shopCollections)
        .flatMap((col) => Object.values(col.items))
        .filter((item) => item.type === 'theme')
        .map((item) => item.themeId);

    assert.equal(shopThemes.length, 16);
    for (const themeId of shopThemes) {
        assert.ok(themeEffects.getEffectForTheme(themeId), `Efeito ausente para ${themeId}`);
    }

    assert.doesNotThrow(() => themeEffects.applyThemeEffect('tech_matrix'));
    assert.doesNotThrow(() => themeEffects.applyThemeEffect('brasil_dark'));
});

test('tasks & persistence: edição rápida de nome/estimativa e keepScreenAwake', async () => {
    resetTestState();
    const task = tasks.addTask('Estudar Rust', 2);
    tasks.toggleEditState(task.id);
    assert.equal(task.isEditing, true);

    tasks.updateTask(task.id, '  Estudar Rust Async  ', '5');
    assert.equal(task.name, 'Estudar Rust Async');
    assert.equal(task.pomodoroEstimate, 5);
    assert.equal(task.isEditing, false);

    // Ignora valores vazios ou inválidos preservando o que já estava válido
    tasks.updateTask(task.id, '   ', '0');
    assert.equal(task.name, 'Estudar Rust Async');
    assert.equal(task.pomodoroEstimate, 5);

    state.settings.keepScreenAwake = true;
    await persistence.saveState();
    state.settings.keepScreenAwake = false;
    await persistence.loadState();
    assert.equal(state.settings.keepScreenAwake, true);
});
