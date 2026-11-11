/**
 * shop.js
 * Catálogo da loja: utilitários (Escudo de Sequência) e coleções de temas (com janelas sazonais reais).
 */

export const shopCollections = {
    UTILITIES: {
        name: 'Proteção & Utilitários',
        description: 'Itens para proteger sua consistência diária.',
        items: {
            STREAK_FREEZE: {
                id: 'STREAK_FREEZE',
                name: 'Escudo de Sequência',
                description: 'Protege sua sequência automaticamente caso você falhe um dia.',
                price: 120,
                type: 'consumable',
                maxOwned: 5,
            },
        },
    },
    SOUNDSCAPES: {
        name: 'Pacotes Sonoros',
        description: 'Novas atmosferas procedurais 100% offline para o mixer.',
        items: {
            SOUND_PACK_ZEN: {
                id: 'SOUND_PACK_ZEN',
                name: 'Pacote Zen & Lareira',
                description: 'Desbloqueia Lareira Crepitante e Ondas do Mar.',
                price: 150,
                type: 'sound_pack',
                packId: 'PACK_ZEN',
                icon: 'flame',
            },
            SOUND_PACK_SYNTH: {
                id: 'SOUND_PACK_SYNTH',
                name: 'Pacote Synth & Alfa',
                description: 'Desbloqueia Onda Alfa 10Hz e Synth Drone.',
                price: 180,
                type: 'sound_pack',
                packId: 'PACK_SYNTH',
                icon: 'headphones',
            },
        },
    },
    NATUREZA: {
        name: 'Coleção Paisagens Brasileiras',
        description: 'Temas inspirados na beleza natural do Brasil.',
        items: {
            FLORESTA_AMAZONICA: {
                id: 'FLORESTA_AMAZONICA',
                name: 'Tema Floresta Amazônica',
                price: 350,
                type: 'theme',
                themeId: 'natureza_floresta',
            },
            CERRADO_SUNSET: {
                id: 'CERRADO_SUNSET',
                name: 'Tema Cerrado ao Entardecer',
                price: 300,
                type: 'theme',
                themeId: 'natureza_cerrado',
            },
            PRAIAS_NORDESTE: {
                id: 'PRAIAS_NORDESTE',
                name: 'Tema Praias do Nordeste',
                price: 350,
                type: 'theme',
                themeId: 'natureza_praias',
            },
            PANTANAL: {
                id: 'PANTANAL',
                name: 'Tema Pantanal',
                price: 300,
                type: 'theme',
                themeId: 'natureza_pantanal',
            },
        },
    },
    MINIMALIST: {
        name: 'Coleção Abstratos & Minimalistas',
        description: 'Temas limpos e suaves para máxima tranquilidade e foco.',
        items: {
            ZEN_LIGHT: {
                id: 'ZEN_LIGHT',
                name: 'Tema Zen (Claro)',
                price: 300,
                type: 'theme',
                themeId: 'zen_light',
            },
            ENERGIA_TOTAL: {
                id: 'ENERGIA_TOTAL',
                name: 'Tema Energia Total',
                price: 250,
                type: 'theme',
                themeId: 'abstrato_energia',
            },
            CEU_ESTRELADO: {
                id: 'CEU_ESTRELADO',
                name: 'Tema Céu Estrelado',
                price: 400,
                type: 'theme',
                themeId: 'abstrato_estrelas',
            },
            AQUARELA: {
                id: 'AQUARELA',
                name: 'Tema Aquarela',
                price: 350,
                type: 'theme',
                themeId: 'abstrato_aquarela',
            },
        },
    },
    TECH: {
        name: 'Coleção Tecnologia & Ficção Científica',
        description: 'Para uma imersão profunda em ambientes digitais e futuristas.',
        items: {
            MATRIX_DARK: {
                id: 'MATRIX_DARK',
                name: 'Tema Matriz',
                price: 350,
                type: 'theme',
                themeId: 'tech_matrix',
            },
            VAPORWAVE: {
                id: 'VAPORWAVE',
                name: 'Tema Vaporwave',
                price: 400,
                type: 'theme',
                themeId: 'tech_vaporwave',
            },
            HIGH_TECH: {
                id: 'HIGH_TECH',
                name: 'Tema Minimalista High-Tech',
                price: 300,
                type: 'theme',
                themeId: 'tech_hightech',
            },
            CYBERPUNK: {
                id: 'CYBERPUNK',
                name: 'Tema Cyberpunk',
                price: 450,
                type: 'theme',
                themeId: 'tech_cyberpunk',
            },
        },
    },
    SEASONAL: {
        name: 'Coleção Sazonal',
        description: 'Itens exclusivos liberados apenas durante sua temporada especial!',
        seasonal: true,
        items: {
            CARNAVAL: {
                id: 'CARNAVAL',
                name: 'Tema Carnaval',
                price: 500,
                type: 'theme',
                themeId: 'seasonal_carnaval',
                months: [2, 3],
                availability: 'Disponível em Fevereiro e Março.',
            },
            FESTA_JUNINA: {
                id: 'FESTA_JUNINA',
                name: 'Tema Festa Junina',
                price: 500,
                type: 'theme',
                themeId: 'seasonal_festa_junina',
                months: [6, 7],
                availability: 'Disponível em Junho e Julho.',
            },
            HALLOWEEN: {
                id: 'HALLOWEEN',
                name: 'Tema Halloween',
                price: 500,
                type: 'theme',
                themeId: 'seasonal_halloween',
                months: [10],
                availability: 'Disponível em Outubro.',
            },
            NATAL: {
                id: 'NATAL',
                name: 'Tema Natalino',
                price: 500,
                type: 'theme',
                themeId: 'seasonal_natal',
                months: [12],
                availability: 'Disponível em Dezembro.',
            },
        },
    },
};
