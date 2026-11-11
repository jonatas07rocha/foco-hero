/**
 * sound_engine.js
 * Motor de Paisagens Sonoras (Web Audio API procedural + áudios customizados em IndexedDB).
 * Suporta múltiplas camadas simultâneas, fade-in/fade-out suave e comportamento configurável nas pausas.
 */

import { state } from './state.js';

const activeNodes = new Map(); // id -> { layerGain, cleanup }
const customObjectUrls = new Map(); // custom:<id> -> objectUrl

let audioCtx = null;
let masterGain = null;
let noiseBuffers = null;
let fadeStopTimeout = null;
let isEnginePlaying = false;

function ensureAudioGraph() {
    if (typeof window === 'undefined') return null;
    if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        audioCtx = state.audioContext || new Ctx();
        state.audioContext = audioCtx;
    }
    if (!masterGain) {
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

function getNoiseBuffers(ctx) {
    if (noiseBuffers) return noiseBuffers;
    const length = ctx.sampleRate * 3;

    const createBuffer = (fillFn) => {
        const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        fillFn(data);
        return buffer;
    };

    const white = createBuffer((data) => {
        for (let i = 0; i < length; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.45;
        }
    });

    const pink = createBuffer((data) => {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < length; i++) {
            const w = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + w * 0.0555179;
            b1 = 0.99332 * b1 + w * 0.0750759;
            b2 = 0.96900 * b2 + w * 0.1538520;
            b3 = 0.86650 * b3 + w * 0.3104856;
            b4 = 0.55000 * b4 + w * 0.5329522;
            b5 = -0.7616 * b5 - w * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.06;
            b6 = w * 0.115926;
        }
    });

    const brown = createBuffer((data) => {
        let lastOut = 0;
        for (let i = 0; i < length; i++) {
            const w = Math.random() * 2 - 1;
            lastOut = (lastOut + 0.02 * w) / 1.02;
            data[i] = lastOut * 2.2;
        }
    });

    const crackle = createBuffer((data) => {
        for (let i = 0; i < length; i++) {
            data[i] = Math.random() < 0.0025 ? (Math.random() * 2 - 1) * 0.7 : 0;
        }
    });

    noiseBuffers = { white, pink, brown, crackle };
    return noiseBuffers;
}

function createProceduralLayer(ctx, soundId, layerGain) {
    const buffers = getNoiseBuffers(ctx);
    const disposables = [];

    const makeLoop = (buf) => {
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        src.start();
        disposables.push(() => {
            try { src.stop(); } catch {}
            src.disconnect();
        });
        return src;
    };

    if (soundId === 'white_noise') {
        const src = makeLoop(buffers.white);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 5500;
        src.connect(filter).connect(layerGain);
    } else if (soundId === 'pink_noise') {
        const src = makeLoop(buffers.pink);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 3200;
        src.connect(filter).connect(layerGain);
    } else if (soundId === 'brown_noise') {
        const src = makeLoop(buffers.brown);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 600;
        src.connect(filter).connect(layerGain);
    } else if (soundId === 'rain') {
        const body = makeLoop(buffers.pink);
        const bodyFilter = ctx.createBiquadFilter();
        bodyFilter.type = 'lowpass';
        bodyFilter.frequency.value = 1350;
        body.connect(bodyFilter).connect(layerGain);

        const drizzle = makeLoop(buffers.white);
        const drizzleFilter = ctx.createBiquadFilter();
        drizzleFilter.type = 'bandpass';
        drizzleFilter.frequency.value = 3400;
        drizzleFilter.Q.value = 0.8;
        const drizzleGain = ctx.createGain();
        drizzleGain.gain.value = 0.22;
        drizzle.connect(drizzleFilter).connect(drizzleGain).connect(layerGain);
    } else if (soundId === 'wind') {
        const src = makeLoop(buffers.pink);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 380;
        filter.Q.value = 2.4;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.08;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 180;
        lfo.connect(lfoGain).connect(filter.frequency);
        lfo.start();
        disposables.push(() => {
            try { lfo.stop(); } catch {}
            lfo.disconnect();
        });

        src.connect(filter).connect(layerGain);
    } else if (soundId === 'fireplace') {
        const rumble = makeLoop(buffers.brown);
        const low = ctx.createBiquadFilter();
        low.type = 'lowpass';
        low.frequency.value = 260;
        rumble.connect(low).connect(layerGain);

        const crack = makeLoop(buffers.crackle);
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 2400;
        bp.Q.value = 1.4;
        const crackGain = ctx.createGain();
        crackGain.gain.value = 0.45;
        crack.connect(bp).connect(crackGain).connect(layerGain);
    } else if (soundId === 'ocean') {
        const src = makeLoop(buffers.pink);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 650;

        const waveGain = ctx.createGain();
        waveGain.gain.value = 0.55;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.11;
        const lfoFilterGain = ctx.createGain();
        lfoFilterGain.gain.value = 420;
        const lfoAmpGain = ctx.createGain();
        lfoAmpGain.gain.value = 0.35;

        lfo.connect(lfoFilterGain).connect(filter.frequency);
        lfo.connect(lfoAmpGain).connect(waveGain.gain);
        lfo.start();
        disposables.push(() => {
            try { lfo.stop(); } catch {}
            lfo.disconnect();
        });

        src.connect(filter).connect(waveGain).connect(layerGain);
    } else if (soundId === 'binaural_focus') {
        const merger = ctx.createChannelMerger(2);
        const left = ctx.createOscillator();
        const right = ctx.createOscillator();
        left.type = 'sine';
        right.type = 'sine';
        left.frequency.value = 200;
        right.frequency.value = 210; // 10Hz Alpha

        const soft = ctx.createGain();
        soft.gain.value = 0.14;

        left.connect(merger, 0, 0);
        right.connect(merger, 0, 1);
        merger.connect(soft).connect(layerGain);

        left.start();
        right.start();
        disposables.push(() => {
            try { left.stop(); right.stop(); } catch {}
            left.disconnect();
            right.disconnect();
        });
    } else if (soundId === 'space_drone') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 420;

        const padGain = ctx.createGain();
        padGain.gain.value = 0.08;
        filter.connect(padGain).connect(layerGain);

        [110, 164.81, 220].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            osc.type = idx === 1 ? 'triangle' : 'sine';
            osc.frequency.value = freq;
            osc.connect(filter);
            osc.start();
            disposables.push(() => {
                try { osc.stop(); } catch {}
                osc.disconnect();
            });
        });
    }

    return () => {
        disposables.forEach((fn) => fn());
        layerGain.disconnect();
    };
}

function createCustomAudioLayer(ctx, customId, layerGain) {
    const rawId = customId.replace('custom:', '');
    const track = (state.customAudios || []).find((a) => a.id === rawId);
    if (!track || !track.blob) return null;

    let url = customObjectUrls.get(customId);
    if (!url) {
        url = URL.createObjectURL(track.blob);
        customObjectUrls.set(customId, url);
    }

    const audioEl = new Audio(url);
    audioEl.loop = true;
    audioEl.crossOrigin = 'anonymous';
    const mediaSrc = ctx.createMediaElementSource(audioEl);
    mediaSrc.connect(layerGain);
    audioEl.play().catch(() => {});

    return () => {
        audioEl.pause();
        audioEl.src = '';
        mediaSrc.disconnect();
        layerGain.disconnect();
    };
}

function syncActiveLayers(ctx) {
    const layersConfig = state.settings.soundscapes?.activeLayers || {};
    const desiredIds = Object.keys(layersConfig);

    for (const [id, entry] of activeNodes.entries()) {
        if (!desiredIds.includes(id)) {
            entry.cleanup();
            activeNodes.delete(id);
        } else {
            entry.layerGain.gain.setTargetAtTime(layersConfig[id], ctx.currentTime, 0.05);
        }
    }

    for (const id of desiredIds) {
        if (activeNodes.has(id)) continue;
        const layerGain = ctx.createGain();
        layerGain.gain.setValueAtTime(layersConfig[id], ctx.currentTime);
        layerGain.connect(masterGain);

        const cleanup = id.startsWith('custom:')
            ? createCustomAudioLayer(ctx, id, layerGain)
            : createProceduralLayer(ctx, id, layerGain);

        if (cleanup) {
            activeNodes.set(id, { layerGain, cleanup });
        } else {
            layerGain.disconnect();
        }
    }
}

function stopAllNodesImmediate() {
    for (const entry of activeNodes.values()) {
        entry.cleanup();
    }
    activeNodes.clear();
    isEnginePlaying = false;
}

export function getTargetMasterGain({ isBreak = false } = {}) {
    const cfg = state.settings.soundscapes || {};
    const base = typeof cfg.masterVolume === 'number' ? cfg.masterVolume : 0.65;
    if (!isBreak) return Math.max(0, Math.min(1, base));
    if (cfg.pauseBehavior === 'mute') return 0;
    if (cfg.pauseBehavior === 'duck') return Math.max(0, Math.min(1, base * 0.25));
    return Math.max(0, Math.min(1, base));
}

export function fadeIn({ isBreak = false } = {}) {
    const layers = state.settings.soundscapes?.activeLayers || {};
    if (Object.keys(layers).length === 0) return;

    const targetGain = getTargetMasterGain({ isBreak });
    if (targetGain <= 0.001) {
        fadeOut();
        return;
    }

    const ctx = ensureAudioGraph();
    if (!ctx || !masterGain) return;

    if (fadeStopTimeout) {
        clearTimeout(fadeStopTimeout);
        fadeStopTimeout = null;
    }

    syncActiveLayers(ctx);
    const fadeSec = state.settings.soundscapes?.fadeDuration ?? 1.5;
    const now = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(Math.max(0.0001, masterGain.gain.value), now);
    masterGain.gain.linearRampToValueAtTime(targetGain, now + fadeSec);
    isEnginePlaying = true;
}

export function fadeOut() {
    if (!audioCtx || !masterGain || activeNodes.size === 0) {
        isEnginePlaying = false;
        return;
    }

    if (fadeStopTimeout) clearTimeout(fadeStopTimeout);

    const fadeSec = state.settings.soundscapes?.fadeDuration ?? 1.5;
    const now = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(Math.max(0.0001, masterGain.gain.value), now);
    masterGain.gain.linearRampToValueAtTime(0.0001, now + fadeSec);

    fadeStopTimeout = setTimeout(() => {
        stopAllNodesImmediate();
        fadeStopTimeout = null;
    }, Math.ceil(fadeSec * 1000) + 50);
}

export function updatePlaybackForTimerState() {
    const hasLayers = Object.keys(state.settings.soundscapes?.activeLayers || {}).length > 0;
    if (!hasLayers) {
        fadeOut();
        return;
    }

    if (state.isSoundPreviewing) {
        fadeIn({ isBreak: false });
        return;
    }

    if (!state.isRunning) {
        fadeOut();
        return;
    }

    const isBreak = state.mode !== 'focus';
    const behavior = state.settings.soundscapes?.pauseBehavior || 'mute';
    if (isBreak && behavior === 'mute') {
        fadeOut();
    } else {
        fadeIn({ isBreak });
    }
}

export function toggleSoundLayer(soundId, defaultVolume = 0.7) {
    if (!state.settings.soundscapes) return false;
    const layers = state.settings.soundscapes.activeLayers;
    if (Object.prototype.hasOwnProperty.call(layers, soundId)) {
        delete layers[soundId];
    } else {
        layers[soundId] = defaultVolume;
    }
    updatePlaybackForTimerState();
    return Object.prototype.hasOwnProperty.call(layers, soundId);
}

export function setLayerVolume(soundId, volume) {
    const layers = state.settings.soundscapes?.activeLayers;
    if (!layers || !Object.prototype.hasOwnProperty.call(layers, soundId)) return;
    layers[soundId] = Math.max(0, Math.min(1, Number(volume)));
    if (isEnginePlaying && audioCtx) {
        syncActiveLayers(audioCtx);
    }
}

export function setMasterVolume(volume) {
    if (!state.settings.soundscapes) return;
    state.settings.soundscapes.masterVolume = Math.max(0, Math.min(1, Number(volume)));
    if (isEnginePlaying && audioCtx && masterGain) {
        const isBreak = state.isRunning && state.mode !== 'focus';
        const target = getTargetMasterGain({ isBreak });
        masterGain.gain.setTargetAtTime(Math.max(0.0001, target), audioCtx.currentTime, 0.05);
    }
}

export function revokeCustomAudioUrl(customId) {
    const key = customId.startsWith('custom:') ? customId : `custom:${customId}`;
    const url = customObjectUrls.get(key);
    if (url && typeof URL !== 'undefined') {
        URL.revokeObjectURL(url);
        customObjectUrls.delete(key);
    }
}

export function isSoundEngineActive() {
    return isEnginePlaying;
}
