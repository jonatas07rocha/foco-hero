/**
 * notifications.js
 * Módulo para notificações nativas do navegador (Web Notifications API).
 */

import { state } from './state.js';

export function isNotificationSupported() {
    return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission() {
    if (!isNotificationSupported()) return 'unsupported';
    return Notification.permission;
}

export async function requestNotificationPermission() {
    if (!isNotificationSupported()) return 'unsupported';
    if (Notification.permission === 'granted') {
        state.settings.notificationsEnabled = true;
        return 'granted';
    }
    if (Notification.permission === 'denied') {
        state.settings.notificationsEnabled = false;
        return 'denied';
    }
    try {
        const permission = await Notification.requestPermission();
        state.settings.notificationsEnabled = permission === 'granted';
        return permission;
    } catch {
        return 'denied';
    }
}

export async function sendNotification(title, body) {
    if (!state.settings.notificationsEnabled || !isNotificationSupported()) return;
    if (Notification.permission !== 'granted') return;

    const options = {
        body,
        icon: './icon-192x192.png',
        badge: './icon-192x192.png',
        tag: 'foco-hero-timer',
        renotify: true,
    };

    try {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration && registration.showNotification) {
                await registration.showNotification(title, options);
                return;
            }
        }
        new Notification(title, options);
    } catch (error) {
        console.warn('Não foi possível exibir notificação:', error);
    }
}
