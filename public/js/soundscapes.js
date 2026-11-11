/**
 * soundscapes.js
 * Catálogo de paisagens sonoras procedurais (Web Audio API) e vínculo sugerido com temas.
 */

export const builtInSoundscapes = [
    {
        id: 'rain',
        name: 'Chuva Suave',
        description: 'Chuva constante filtrada para foco contínuo.',
        icon: 'cloud-rain',
        packId: null, // Gratuito
    },
    {
        id: 'brown_noise',
        name: 'Ruído Marrom',
        description: 'Grave acolhedor ideal para leitura e código.',
        icon: 'radio',
        packId: null,
    },
    {
        id: 'pink_noise',
        name: 'Ruído Rosa',
        description: 'Espectro equilibrado para bloquear distrações.',
        icon: 'waves',
        packId: null,
    },
    {
        id: 'white_noise',
        name: 'Ruído Branco',
        description: 'Mascaramento sonoro limpo e suave.',
        icon: 'sparkles',
        packId: null,
    },
    {
        id: 'wind',
        name: 'Brisa & Vento',
        description: 'Ondulações leves de vento na natureza.',
        icon: 'wind',
        packId: null,
    },
    {
        id: 'fireplace',
        name: 'Lareira',
        description: 'Fogo crepitante e calor acústico.',
        icon: 'flame',
        packId: 'PACK_ZEN',
    },
    {
        id: 'ocean',
        name: 'Ondas do Mar',
        description: 'Ciclo lento de maré indo e voltando.',
        icon: 'waves',
        packId: 'PACK_ZEN',
    },
    {
        id: 'binaural_focus',
        name: 'Onda Alfa 10Hz',
        description: 'Batimento binaural suave para concentração.',
        icon: 'brain',
        packId: 'PACK_SYNTH',
    },
    {
        id: 'space_drone',
        name: 'Synth Drone',
        description: 'Acorde ambiente profundo para Deep Work.',
        icon: 'compass',
        packId: 'PACK_SYNTH',
    },
];

export const THEME_SOUNDSCAPE_MAP = {
    natureza_floresta: ['rain', 'wind'],
    acre_dark: ['rain', 'wind'],
    amazonas_light: ['rain', 'wind'],
    natureza_praias: ['ocean', 'pink_noise'],
    rio_de_janeiro_light: ['ocean', 'pink_noise'],
    ceara_light: ['ocean', 'pink_noise'],
    santa_catarina_light: ['ocean', 'pink_noise'],
    natureza_cerrado: ['wind', 'brown_noise'],
    natureza_pantanal: ['wind', 'rain'],
    mato_grosso_light: ['wind', 'brown_noise'],
    zen_light: ['binaural_focus', 'pink_noise'],
    abstrato_estrelas: ['space_drone', 'pink_noise'],
    abstrato_aquarela: ['rain', 'pink_noise'],
    tech_matrix: ['space_drone', 'brown_noise'],
    tech_cyberpunk: ['rain', 'space_drone'],
    tech_vaporwave: ['space_drone', 'pink_noise'],
    tech_hightech: ['binaural_focus', 'white_noise'],
    seasonal_natal: ['fireplace', 'rain'],
    seasonal_festa_junina: ['fireplace', 'wind'],
};

export function isSoundscapeUnlocked(sound, unlockedPacks = []) {
    if (!sound) return false;
    if (!sound.packId) return true;
    return Array.isArray(unlockedPacks) && unlockedPacks.includes(sound.packId);
}

export function getSuggestedSoundscapeForTheme(themeId, unlockedPacks = []) {
    const candidates = THEME_SOUNDSCAPE_MAP[themeId] || ['brown_noise', 'rain'];
    for (const id of candidates) {
        const sound = builtInSoundscapes.find((s) => s.id === id);
        if (sound && isSoundscapeUnlocked(sound, unlockedPacks)) {
            return sound.id;
        }
    }
    return 'brown_noise';
}
