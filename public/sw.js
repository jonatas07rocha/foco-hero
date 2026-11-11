const CACHE_NAME = 'focohero-v2.0.12';

const CORE_ASSETS = [
    './',
    './index.html',
    './landing.html',
    './landing.css',
    './styles.css',
    './fonts/InterVariable.woff2',
    './manifest.json',
    './icon-180x180.png',
    './icon-192x192.png',
    './icon-512x512.png',
    './js/main.js',
    './js/state.js',
    './js/db.js',
    './js/persistence.js',
    './js/timer.js',
    './js/tasks.js',
    './js/gamification.js',
    './js/analytics.js',
    './js/shop.js',
    './js/shop_logic.js',
    './js/themes.js',
    './js/theme_effects.js',
    './js/achievements.js',
    './js/missions.js',
    './js/audio.js',
    './js/soundscapes.js',
    './js/sound_engine.js',
    './js/notifications.js',
    './js/icons.js',
    './js/ui.js',
    './js/ui_controller.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(CORE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;

    // Network-First com fallback para Cache: online sempre recebe arquivos consistentes da mesma versão; offline usa o cache.
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response && response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
