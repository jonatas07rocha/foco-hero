// missions.js

/**
 * Estrutura de uma Missão:
 * id: Identificador único da missão.
 * type: 'daily' (aparece aleatoriamente a cada dia) ou 'secret' (desbloqueada por uma ação específica).
 * title: O nome da missão.
 * description: O que o usuário precisa fazer.
 * emoji: Um ícone para representar a missão.
 * rewards: { xp: number, coins: number } - Recompensas ao completar.
 * metric: A chave de dados que a missão rastreia (ex: 'focusTimeToday', 'tasksCompletedToday').
 * goal: O valor numérico que o usuário precisa alcançar na métrica.
 */

export const missionsData = {
    // --- MISSÕES DIÁRIAS (Total: 22) ---
    // A cada dia, algumas destas serão selecionadas aleatoriamente.

    // --- Missões de Tempo de Foco ---
    DAILY_FOCUS_30M: {
        id: 'DAILY_FOCUS_30M',
        type: 'daily',
        title: 'Foco Rápido',
        description: 'Acumule 30 minutos de foco total.',
        emoji: '⏱️',
        rewards: { xp: 20, coins: 5 },
        metric: 'focusTimeToday',
        goal: 1800 // 30 minutos em segundos
    },
    DAILY_FOCUS_60M: {
        id: 'DAILY_FOCUS_60M',
        type: 'daily',
        title: 'Sessão Produtiva',
        description: 'Acumule 1 hora de foco total.',
        emoji: '⏳',
        rewards: { xp: 50, coins: 15 },
        metric: 'focusTimeToday',
        goal: 3600 // 60 minutos em segundos
    },
    DAILY_FOCUS_90M: {
        id: 'DAILY_FOCUS_90M',
        type: 'daily',
        title: 'Concentração Elevada',
        description: 'Acumule 90 minutos de foco total.',
        emoji: '⚡',
        rewards: { xp: 90, coins: 30 },
        metric: 'focusTimeToday',
        goal: 5400 // 90 minutos em segundos
    },
    DAILY_FOCUS_120M: {
        id: 'DAILY_FOCUS_120M',
        type: 'daily',
        title: 'Imersão Profunda',
        description: 'Acumule 2 horas de foco total.',
        emoji: '🧠',
        rewards: { xp: 120, coins: 40 },
        metric: 'focusTimeToday',
        goal: 7200 // 120 minutos em segundos
    },
    DAILY_FOCUS_180M: {
        id: 'DAILY_FOCUS_180M',
        type: 'daily',
        title: 'Maratona Mental',
        description: 'Acumule 3 horas de foco total.',
        emoji: '🏃',
        rewards: { xp: 200, coins: 75 },
        metric: 'focusTimeToday',
        goal: 10800 // 180 minutos em segundos
    },

    // --- Missões de Ciclos Pomodoro ---
    DAILY_COMPLETE_2_POMODOROS: {
        id: 'DAILY_COMPLETE_2_POMODOROS',
        type: 'daily',
        title: 'Dois é Bom',
        description: 'Complete 2 ciclos Pomodoro.',
        emoji: '🍅✌️',
        rewards: { xp: 25, coins: 10 },
        metric: 'pomodorosCompletedToday',
        goal: 2
    },
    DAILY_COMPLETE_4_POMODOROS: {
        id: 'DAILY_COMPLETE_4_POMODOROS',
        type: 'daily',
        title: 'Poder Pomodoro',
        description: 'Complete 4 ciclos Pomodoro.',
        emoji: '🍅💪',
        rewards: { xp: 60, coins: 20 },
        metric: 'pomodorosCompletedToday',
        goal: 4
    },
    DAILY_COMPLETE_6_POMODOROS: {
        id: 'DAILY_COMPLETE_6_POMODOROS',
        type: 'daily',
        title: 'Força Pomodoro',
        description: 'Complete 6 ciclos Pomodoro.',
        emoji: '🍅🚀',
        rewards: { xp: 100, coins: 35 },
        metric: 'pomodorosCompletedToday',
        goal: 6
    },
    DAILY_COMPLETE_8_POMODOROS: {
        id: 'DAILY_COMPLETE_8_POMODOROS',
        type: 'daily',
        title: 'Super Pomodoro',
        description: 'Complete 8 ciclos Pomodoro.',
        emoji: '🍅🔥',
        rewards: { xp: 150, coins: 50 },
        metric: 'pomodorosCompletedToday',
        goal: 8
    },
    DAILY_COMPLETE_10_POMODOROS: {
        id: 'DAILY_COMPLETE_10_POMODOROS',
        type: 'daily',
        title: 'Mestre Pomodoro',
        description: 'Complete 10 ciclos Pomodoro.',
        emoji: '🍅👑',
        rewards: { xp: 250, coins: 80 },
        metric: 'pomodorosCompletedToday',
        goal: 10
    },

    // --- Missões de Tarefas ---
    DAILY_ADD_5_TASKS: {
        id: 'DAILY_ADD_5_TASKS',
        type: 'daily',
        title: 'Planejador',
        description: 'Adicione 5 novas tarefas à sua lista hoje.',
        emoji: '🗒️',
        rewards: { xp: 15, coins: 5 },
        metric: 'tasksAddedToday',
        goal: 5
    },
    DAILY_ADD_10_TASKS: {
        id: 'DAILY_ADD_10_TASKS',
        type: 'daily',
        title: 'Arquiteto do Dia',
        description: 'Adicione 10 novas tarefas à sua lista hoje.',
        emoji: '🏗️',
        rewards: { xp: 30, coins: 10 },
        metric: 'tasksAddedToday',
        goal: 10
    },
    DAILY_COMPLETE_1_TASK: {
        id: 'DAILY_COMPLETE_1_TASK',
        type: 'daily',
        title: 'O Primeiro Passo',
        description: 'Conclua sua primeira tarefa do dia.',
        emoji: '✅',
        rewards: { xp: 10, coins: 5 },
        metric: 'tasksCompletedToday',
        goal: 1
    },
    DAILY_COMPLETE_3_TASKS: {
        id: 'DAILY_COMPLETE_3_TASKS',
        type: 'daily',
        title: 'Trio de Tarefas',
        description: 'Conclua 3 tarefas da sua lista.',
        emoji: '✅✅✅',
        rewards: { xp: 30, coins: 10 },
        metric: 'tasksCompletedToday',
        goal: 3
    },
    DAILY_COMPLETE_5_TASKS: {
        id: 'DAILY_COMPLETE_5_TASKS',
        type: 'daily',
        title: 'Manda-Chuva das Tarefas',
        description: 'Conclua 5 tarefas da sua lista.',
        emoji: '🏆',
        rewards: { xp: 75, coins: 25 },
        metric: 'tasksCompletedToday',
        goal: 5
    },
    DAILY_COMPLETE_7_TASKS: {
        id: 'DAILY_COMPLETE_7_TASKS',
        type: 'daily',
        title: 'Imparável',
        description: 'Conclua 7 tarefas da sua lista.',
        emoji: '🚀',
        rewards: { xp: 120, coins: 40 },
        metric: 'tasksCompletedToday',
        goal: 7
    },
    DAILY_COMPLETE_10_TASKS: {
        id: 'DAILY_COMPLETE_10_TASKS',
        type: 'daily',
        title: 'Dizimador de Tarefas',
        description: 'Conclua 10 tarefas da sua lista.',
        emoji: '💥',
        rewards: { xp: 200, coins: 60 },
        metric: 'tasksCompletedToday',
        goal: 10
    },

    // --- Missões de Consistência ---
    DAILY_NO_INTERRUPTIONS_2: {
        id: 'DAILY_NO_INTERRUPTIONS_2',
        type: 'daily',
        title: 'Foco Inabalável',
        description: 'Complete 2 sessões de foco seguidas sem interrupções.',
        emoji: '🧘',
        rewards: { xp: 50, coins: 15 },
        metric: 'uninterruptedSessionsToday',
        goal: 2
    },
    DAILY_NO_INTERRUPTIONS_3: {
        id: 'DAILY_NO_INTERRUPTIONS_3',
        type: 'daily',
        title: 'Mente Blindada',
        description: 'Complete 3 sessões de foco seguidas sem interrupções.',
        emoji: '🛡️',
        rewards: { xp: 80, coins: 25 },
        metric: 'uninterruptedSessionsToday',
        goal: 3
    },
    DAILY_NO_INTERRUPTIONS_4: {
        id: 'DAILY_NO_INTERRUPTIONS_4',
        type: 'daily',
        title: 'Na Zona',
        description: 'Complete 4 sessões de foco seguidas sem interrupções.',
        emoji: '🧘‍♂️✨',
        rewards: { xp: 120, coins: 40 },
        metric: 'uninterruptedSessionsToday',
        goal: 4
    },
    DAILY_LONG_BREAK: {
        id: 'DAILY_LONG_BREAK',
        type: 'daily',
        title: 'Pausa Merecida',
        description: 'Complete um ciclo inteiro e faça uma pausa longa.',
        emoji: '☕',
        rewards: { xp: 40, coins: 10 },
        metric: 'longBreaksToday',
        goal: 1
    },
    DAILY_EARLY_START: {
        id: 'DAILY_EARLY_START',
        type: 'daily',
        title: 'Começando Cedo',
        description: 'Inicie sua primeira sessão de foco antes das 9h.',
        emoji: '🌅',
        rewards: { xp: 30, coins: 10 },
        metric: 'startedBefore9AM',
        goal: 1
    },

    // --- DESAFIOS SECRETOS (Total: 9) ---
    // Estes são verificados constantemente e aparecem quando completados.
    SECRET_NIGHT_OWL: {
        id: 'SECRET_NIGHT_OWL',
        type: 'secret',
        title: 'Coruja da Noite',
        description: 'Completou uma sessão de foco após as 22h.',
        emoji: '🦉',
        rewards: { xp: 100, coins: 30 },
    },
    SECRET_EARLY_BIRD: {
        id: 'SECRET_EARLY_BIRD',
        type: 'secret',
        title: 'Pássaro Madrugador',
        description: 'Iniciou uma sessão de foco antes das 6h.',
        emoji: '🐦',
        rewards: { xp: 100, coins: 30 },
    },
    SECRET_LUNCH_FOCUS: {
        id: 'SECRET_LUNCH_FOCUS',
        type: 'secret',
        title: 'Foco no Almoço',
        description: 'Completou uma sessão de foco entre 12h e 14h.',
        emoji: '🥪',
        rewards: { xp: 75, coins: 20 },
    },
    SECRET_THEME_EXPLORER: {
        id: 'SECRET_THEME_EXPLORER',
        type: 'secret',
        title: 'Explorador de Temas',
        description: 'Experimentou 3 temas diferentes em um dia.',
        emoji: '🎨',
        rewards: { xp: 50, coins: 10 },
    },
    SECRET_WEEKEND_WARRIOR: {
        id: 'SECRET_WEEKEND_WARRIOR',
        type: 'secret',
        title: 'Guerreiro de Fim de Semana',
        description: 'Completou uma sessão de foco em um sábado ou domingo.',
        emoji: '🛡️',
        rewards: { xp: 100, coins: 25 },
    },
    SECRET_CLEAN_SLATE: {
        id: 'SECRET_CLEAN_SLATE',
        type: 'secret',
        title: 'Tudo em Ordem',
        description: 'Completou todas as tarefas que você adicionou hoje.',
        emoji: '🎉',
        rewards: { xp: 150, coins: 50 },
    },
    SECRET_STREAK_15_DAYS: {
        id: 'SECRET_STREAK_15_DAYS',
        type: 'secret',
        title: 'Super Sequência',
        description: 'Manteve sua sequência por 15 dias.',
        emoji: '🗓️🔥',
        rewards: { xp: 300, coins: 100 },
    },
    SECRET_PERFECT_STREAK: {
        id: 'SECRET_PERFECT_STREAK',
        type: 'secret',
        title: 'Sequência Perfeita',
        description: 'Manteve sua sequência por 30 dias.',
        emoji: '🗓️✨',
        rewards: { xp: 500, coins: 200 },
    },
    SECRET_LEVEL_25: {
        id: 'SECRET_LEVEL_25',
        type: 'secret',
        title: 'Lenda do Foco',
        description: 'Alcançou o nível 25.',
        emoji: '🌟👑',
        rewards: { xp: 1000, coins: 300 },
    },
};
