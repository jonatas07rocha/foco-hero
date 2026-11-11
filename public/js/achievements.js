// achievements.js

/**
 * Estrutura de uma Conquista:
 * key: Identificador único da conquista (usado no código).
 * name: O nome da conquista que aparece para o usuário.
 * description: O que o usuário precisa fazer para desbloqueá-la.
 * emoji: Um ícone para representar a conquista.
 */

export const achievements = {
    // --- Conquistas de Ação ---
    FIRST_STEP: { 
        name: 'Primeiro Passo', 
        description: 'Complete sua primeira sessão de foco.', 
        emoji: '🚀' 
    },
    FOCUSED_BEGINNER: { 
        name: 'Iniciante Focado', 
        description: 'Complete 5 sessões de foco.', 
        emoji: '🎯' 
    },
    TASK_MASTER: { 
        name: 'Mestre das Tarefas', 
        description: 'Complete 10 tarefas em um dia.', 
        emoji: '✔️' 
    },
    MARATHONER: { 
        name: 'Maratonista', 
        description: 'Foque por um total de 4 horas em um dia.', 
        emoji: '🏃' 
    },
    
    // --- Conquistas de Consistência ---
    STREAK_STARTER: { 
        name: 'Começando a Pegar Fogo', 
        description: 'Alcance uma sequência de 3 dias.', 
        emoji: '🔥' 
    },
    ON_FIRE: { 
        name: 'Em Chamas!', 
        description: 'Alcance uma sequência de 7 dias.', 
        emoji: '🔥🔥' 
    },
    
    // --- Conquistas de Recurso ---
    COIN_COLLECTOR: { 
        name: 'Colecionador de Moedas', 
        description: 'Acumule 500 moedas.', 
        emoji: '💰' 
    },

    // --- Conquistas de Nível (Jornada do Foco) ---

    // Fase 1: O Iniciante
    LEVEL_5: { 
        name: 'Nível 5', 
        description: 'Alcance o nível 5.', 
        emoji: '⭐' 
    },
    LEVEL_10: { 
        name: 'Nível 10', 
        description: 'Alcance o nível 10. Você concluiu a fase de iniciação!', 
        emoji: '🌟' 
    },

    // Fase 2: O Praticante
    LEVEL_15: {
        name: 'Praticante Dedicado',
        description: 'Alcance o nível 15.',
        emoji: '🎓'
    },
    LEVEL_20: {
        name: 'Veterano do Foco',
        description: 'Alcance o nível 20.',
        emoji: '🎖️'
    },
    LEVEL_25: {
        name: 'Especialista em Foco',
        description: 'Alcance o nível 25. Você está no meio da jornada!',
        emoji: '🏆'
    },
    LEVEL_30: {
        name: 'Mestre da Produtividade',
        description: 'Alcance o nível 30. A consistência é sua aliada.',
        emoji: '🧠'
    },

    // Fase 3: O Mestre
    LEVEL_35: {
        name: 'Virtuoso do Tempo',
        description: 'Alcance o nível 35.',
        emoji: '🎼'
    },
    LEVEL_40: {
        name: 'Guru do Foco',
        description: 'Alcance o nível 40.',
        emoji: '🧘'
    },
    LEVEL_45: {
        name: 'Titã da Concentração',
        description: 'Alcance o nível 45.',
        emoji: '🗿'
    },
    LEVEL_50: {
        name: 'Lenda do Foco',
        description: 'Alcançou o nível 50. Você dominou a arte do foco!',
        emoji: '👑'
    }
};
