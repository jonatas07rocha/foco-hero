/**
 * audio.js
 * Módulo para gerenciar efeitos sonoros via Web Audio API.
 */

import { state } from './state.js';

function getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!state.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            state.audioContext = new AudioCtx();
        }
    }
    return state.audioContext;
}

export function resumeAudio() {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
            state.audioInitialized = true;
        }).catch(() => {});
    } else {
        state.audioInitialized = true;
    }
}

function _playBeepInternal(ctx, frequency, duration, volume) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
}

export function playBeep(frequency = 800, duration = 200, volume = 0.3) {
    if (!state.settings.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
        ctx.resume().then(() => _playBeepInternal(ctx, frequency, duration, volume)).catch(() => {});
    } else {
        _playBeepInternal(ctx, frequency, duration, volume);
    }
}

export function playFinishSound() {
    if (!state.settings.soundEnabled) return;
    playBeep(523, 150, 0.4);
    setTimeout(() => playBeep(659, 150, 0.4), 200);
    setTimeout(() => playBeep(784, 300, 0.5), 400);
}
