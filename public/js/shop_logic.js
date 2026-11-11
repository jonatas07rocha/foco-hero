/**
 * shop_logic.js
 * Gerencia compra de temas, Escudo de Sequência, sazonalidade real e preview ao vivo de temas.
 */

import { shopCollections } from './shop.js';
import { themes } from './themes.js';
import { state } from './state.js';
import { dom } from './ui.js';
import { applyTheme, renderPaletteSelector, showModal, updateGamificationUI } from './ui_controller.js';
import { saveState } from './persistence.js';
import { playBeep } from './audio.js';
import { renderIcons } from './icons.js';

let previewTimeoutId = null;

export function findShopItem(itemId) {
    for (const collectionId in shopCollections) {
        if (shopCollections[collectionId].items[itemId]) {
            return shopCollections[collectionId].items[itemId];
        }
    }
    return null;
}

export function isItemAvailableNow(item, date = new Date()) {
    if (!item.months || !Array.isArray(item.months)) return true;
    const currentMonth = date.getMonth() + 1;
    return item.months.includes(currentMonth);
}

export function previewTheme(themeId, durationMs = 10000) {
    if (!themes[themeId]) return false;
    if (previewTimeoutId) clearTimeout(previewTimeoutId);

    state.previewThemeId = themeId;
    applyTheme(themeId);

    previewTimeoutId = setTimeout(() => {
        cancelThemePreview();
    }, durationMs);
    return true;
}

export function cancelThemePreview() {
    if (previewTimeoutId) {
        clearTimeout(previewTimeoutId);
        previewTimeoutId = null;
    }
    if (state.previewThemeId) {
        state.previewThemeId = null;
        applyTheme(state.settings.theme);
    }
}

export function renderShop() {
    if (dom.shopCoinsDisplay) dom.shopCoinsDisplay.textContent = state.gamification.coins;
    if (dom.shopFreezesDisplay) dom.shopFreezesDisplay.textContent = state.gamification.streakFreezes || 0;

    const container = dom.shopCollectionsContainer;
    if (!container) return;
    container.innerHTML = '';

    for (const collectionId in shopCollections) {
        const collection = shopCollections[collectionId];

        const collectionEl = document.createElement('div');
        collectionEl.innerHTML = `
            <h3 class="text-lg font-semibold text-primary-light mb-1">${collection.name}</h3>
            <p class="text-sm text-muted mb-3">${collection.description}</p>
            <div class="grid grid-cols-2 gap-3"></div>
        `;

        const itemsContainer = collectionEl.querySelector('.grid');
        for (const itemId in collection.items) {
            const item = collection.items[itemId];
            const itemEl = document.createElement('div');
            itemEl.className = 'p-3 rounded-lg flex flex-col items-center justify-between bg-gray-800 border border-gray-700';

            if (item.type === 'consumable') {
                const ownedCount = state.gamification.streakFreezes || 0;
                const isMaxed = ownedCount >= (item.maxOwned || 5);
                itemEl.innerHTML = `
                    <div class="w-full h-10 rounded mb-2 flex items-center justify-center bg-gray-900 border border-gray-600 text-primary-light">
                        <i data-lucide="shield" class="w-5 h-5 mr-2"></i>
                        <span class="font-bold text-sm">${ownedCount} / ${item.maxOwned || 5}</span>
                    </div>
                    <p class="font-semibold text-sm text-center">${item.name}</p>
                    <p class="text-xs text-muted text-center mb-3 mt-1">${item.description}</p>
                    <button data-item-id="${item.id}" class="buy-btn w-full text-sm font-bold py-2 px-3 rounded-lg transition-colors ${isMaxed ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-primary-focus hover:bg-primary-darker text-white'}" ${isMaxed ? 'disabled' : ''}>
                        ${isMaxed ? 'Limite Máximo' : `<div class="flex items-center justify-center"><i data-lucide="circle-dollar-sign" class="w-4 h-4 mr-2"></i> ${item.price}</div>`}
                    </button>
                `;
            } else {
                const themeObj = themes[item.themeId];
                const isOwned = state.gamification.unlockedThemes.includes(item.themeId);
                const isAvailable = isItemAvailableNow(item);
                const disabled = isOwned || !isAvailable;

                let btnLabel = `<div class="flex items-center justify-center"><i data-lucide="circle-dollar-sign" class="w-4 h-4 mr-2"></i> ${item.price}</div>`;
                if (isOwned) btnLabel = 'Adquirido';
                else if (!isAvailable) btnLabel = 'Fora de Época';

                itemEl.innerHTML = `
                    <div class="w-full h-10 rounded mb-2 border-2 border-gray-600 relative overflow-hidden" style="background-color: ${themeObj['--color-bg-shell']}; background-image: ${themeObj['--color-bg-main']}">
                        <button type="button" data-preview-theme="${item.themeId}" class="preview-btn absolute right-1 top-1 bg-black/60 hover:bg-black/80 text-white rounded p-1 text-xs" title="Pré-visualizar por 10s" aria-label="Pré-visualizar ${item.name}">
                            <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                    <p class="font-semibold text-sm text-center flex-grow">${item.name}</p>
                    <p class="text-xs text-muted text-center mb-2 min-h-[2rem]">${item.availability || ''}</p>
                    <button data-item-id="${item.id}" class="buy-btn w-full text-sm font-bold py-2 px-3 rounded-lg transition-colors ${disabled ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-primary-focus hover:bg-primary-darker text-white'}" ${disabled ? 'disabled' : ''}>
                        ${btnLabel}
                    </button>
                `;
            }
            itemsContainer.appendChild(itemEl);
        }
        container.appendChild(collectionEl);
    }

    renderIcons(container);
}

export function buyItem(itemId, now = new Date()) {
    const itemToBuy = findShopItem(itemId);
    if (!itemToBuy) {
        return { ok: false, reason: 'NOT_FOUND' };
    }

    if (itemToBuy.type === 'theme') {
        if (!isItemAvailableNow(itemToBuy, now)) {
            if (dom.alertModalOverlay) showModal(dom.alertModalOverlay, `Item sazonal indisponível no momento (${itemToBuy.availability}).`);
            return { ok: false, reason: 'OUT_OF_SEASON' };
        }
        if (state.gamification.unlockedThemes.includes(itemToBuy.themeId)) {
            return { ok: false, reason: 'ALREADY_OWNED' };
        }
    } else if (itemToBuy.type === 'consumable' && itemToBuy.id === 'STREAK_FREEZE') {
        if ((state.gamification.streakFreezes || 0) >= (itemToBuy.maxOwned || 5)) {
            if (dom.alertModalOverlay) showModal(dom.alertModalOverlay, 'Você já atingiu o limite máximo de Escudos de Sequência.');
            return { ok: false, reason: 'MAX_OWNED' };
        }
    }

    if (state.gamification.coins < itemToBuy.price) {
        if (dom.alertModalOverlay) showModal(dom.alertModalOverlay, 'Moedas insuficientes!');
        playBeep(440, 150, 0.3);
        return { ok: false, reason: 'INSUFFICIENT_COINS' };
    }

    state.gamification.coins -= itemToBuy.price;

    if (itemToBuy.type === 'theme') {
        state.gamification.unlockedThemes.push(itemToBuy.themeId);
        if (dom.alertModalOverlay) showModal(dom.alertModalOverlay, `Tema "${itemToBuy.name}" comprado com sucesso!`);
    } else if (itemToBuy.id === 'STREAK_FREEZE') {
        state.gamification.streakFreezes = (state.gamification.streakFreezes || 0) + 1;
        if (dom.alertModalOverlay) showModal(dom.alertModalOverlay, 'Escudo de Sequência adquirido! Ele protegerá sua sequência automaticamente.');
    }

    playBeep(880, 200, 0.4);
    cancelThemePreview();
    renderShop();
    updateGamificationUI();
    renderPaletteSelector();
    saveState();
    return { ok: true, item: itemToBuy };
}
