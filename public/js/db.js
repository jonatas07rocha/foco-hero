/**
 * db.js
 * Camada de acesso ao IndexedDB para estado atual e histórico multi-dias.
 */

const DB_NAME = 'focototal_db';
const DB_VERSION = 1;
const STORE_STATE = 'appState';
const STORE_HISTORY = 'dailyHistory';

let dbPromise = null;

export function isIndexedDBAvailable() {
    return typeof indexedDB !== 'undefined';
}

export function openDatabase() {
    if (!isIndexedDBAvailable()) {
        return Promise.resolve(null);
    }
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_STATE)) {
                db.createObjectStore(STORE_STATE);
            }
            if (!db.objectStoreNames.contains(STORE_HISTORY)) {
                db.createObjectStore(STORE_HISTORY, { keyPath: 'date' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
            dbPromise = null;
            reject(request.error);
        };
    });

    return dbPromise;
}

export async function saveAppStateToDB(snapshot) {
    const db = await openDatabase().catch(() => null);
    if (!db) return false;

    return new Promise((resolve) => {
        const tx = db.transaction(STORE_STATE, 'readwrite');
        tx.objectStore(STORE_STATE).put(snapshot, 'current');
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
    });
}

export async function loadAppStateFromDB() {
    const db = await openDatabase().catch(() => null);
    if (!db) return null;

    return new Promise((resolve) => {
        const tx = db.transaction(STORE_STATE, 'readonly');
        const req = tx.objectStore(STORE_STATE).get('current');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
    });
}

export async function saveDayHistoryToDB(daySummary) {
    const db = await openDatabase().catch(() => null);
    if (!db) return false;

    return new Promise((resolve) => {
        const tx = db.transaction(STORE_HISTORY, 'readwrite');
        tx.objectStore(STORE_HISTORY).put(daySummary);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
    });
}

export async function loadAllHistoryFromDB() {
    const db = await openDatabase().catch(() => null);
    if (!db) return [];

    return new Promise((resolve) => {
        const tx = db.transaction(STORE_HISTORY, 'readonly');
        const req = tx.objectStore(STORE_HISTORY).getAll();
        req.onsuccess = () => {
            const rows = Array.isArray(req.result) ? req.result : [];
            rows.sort((a, b) => a.date.localeCompare(b.date));
            resolve(rows);
        };
        req.onerror = () => resolve([]);
    });
}

export async function replaceHistoryInDB(historyArray) {
    const db = await openDatabase().catch(() => null);
    if (!db) return false;

    return new Promise((resolve) => {
        const tx = db.transaction(STORE_HISTORY, 'readwrite');
        const store = tx.objectStore(STORE_HISTORY);
        store.clear();
        (historyArray || []).forEach((item) => {
            if (item && item.date) {
                store.put(item);
            }
        });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
    });
}
