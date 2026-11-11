// achievements.js

/**
 * Estrutura de uma Conquista:
 * key: Identificador único da conquista (usado no código).
 * name: O nome da conquista que aparece para o usuário.
 * description: O que o usuário precisa fazer para desbloqueá-la.
 * icon: Nome do ícone SVG em icons.js.
 */

export const achievements = {
    // --- Conquistas de Ação ---
    FIRST_STEP: {
        name: 'Primeiro Passo',
        description: 'Complete sua primeira sessão de foco.',
        icon: 'rocket',
    },
    FOCUSED_BEGINNER: {
        name: 'Iniciante Focado',
        description: 'Complete 5 sessões de foco.',
        icon: 'target',
    },
    TASK_MASTER: {
        name: 'Mestre das Tarefas',
        description: 'Complete 10 tarefas em um dia.',
        icon: 'check-check',
    },
    MARATHONER: {
        name: 'Maratonista',
        description: 'Foque por um total de 4 horas em um dia.',
        icon: 'timer',
    },

    // --- Conquistas de Consistência ---
    STREAK_STARTER: {
        name: 'Começando a Pegar Fogo',
        description: 'Alcance uma sequência de 3 dias.',
        icon: 'flame',
    },
    ON_FIRE: {
        name: 'Em Chamas!',
        description: 'Alcance uma sequência de 7 dias.',
        icon: 'zap',
    },

    // --- Conquistas de Recurso ---
    COIN_COLLECTOR: {
        name: 'Colecionador de Moedas',
        description: 'Acumule 500 moedas.',
        icon: 'circle-dollar-sign',
    },

    // --- Conquistas de Nível (Jornada do Foco) ---
    LEVEL_5: {
        name: 'Nível 5',
        description: 'Alcance o nível 5.',
        icon: 'star',
    },
    LEVEL_10: {
        name: 'Nível 10',
        description: 'Alcance o nível 10. Você concluiu a fase de iniciação!',
        icon: 'sparkles',
    },
    LEVEL_15: {
        name: 'Praticante Dedicado',
        description: 'Alcance o nível 15.',
        icon: 'graduation-cap',
    },
    LEVEL_20: {
        name: 'Veterano do Foco',
        description: 'Alcance o nível 20.',
        icon: 'award',
    },
    LEVEL_25: {
        name: 'Especialista em Foco',
        description: 'Alcance o nível 25. Você está no meio da jornada!',
        icon: 'trophy',
    },
    LEVEL_30: {
        name: 'Mestre da Produtividade',
        description: 'Alcance o nível 30. A consistência é sua aliada.',
        icon: 'brain',
    },
    LEVEL_35: {
        name: 'Virtuoso do Tempo',
        description: 'Alcance o nível 35.',
        icon: 'music',
    },
    LEVEL_40: {
        name: 'Guru do Foco',
        description: 'Alcance o nível 40.',
        icon: 'compass',
    },
    LEVEL_45: {
        name: 'Titã da Concentração',
        description: 'Alcance o nível 45.',
        icon: 'gem',
    },
    LEVEL_50: {
        name: 'Lenda do Foco',
        description: 'Alcançou o nível 50. Você dominou a arte do foco!',
        icon: 'crown',
    },
};
