const CACHE_NAME = 'Tareas-v1';
const urlsToCache = [
  './',
  './index.html',
  './index.php',
  './style.css',

  // JS principales
  './script.js',
  './regist_serviceWorker.js',

  // Archivos en /js/
  './js/main.js',
  './js/render.js',
  './js/modal.js',
  './js/storage.js',
  './js/utils.js',
  './js/filters.js',
  './js/theme.js',

  // Imagen
  './assets/img/to-do.png',

  // Manifest
  './manifest.json',

  // Iconos si los tienes en ./assets/icons/
  './assets/icons/copy.svg',
  './assets/icons/danger.svg',
  './assets/icons/edit.png',
  './assets/icons/edit.svg',
  './assets/icons/file-pen.svg',
  './assets/icons/info.svg',
  './assets/icons/list-plus.svg',
  './assets/icons/list-todo.svg',
  './assets/icons/moon.svg',
  './assets/icons/plus.svg',
  './assets/icons/share.svg',
  './assets/icons/success.svg',
  './assets/icons/sun.svg',
  './assets/icons/trash.svg',
  './assets/icons/warning.svg',
  './assets/icons/icon-512x512.png',
];

// Install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
      .catch(err => console.error('❌ Falló el cache', err))
  );
});

// Activate
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME];
  e.waitUntil(
    caches.keys()
      .then(names =>
        Promise.all(
          names.map(name => {
            if (!cacheWhitelist.includes(name)) {
              return caches.delete(name);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});

// Sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncPendingTasks());
  }
});

async function syncPendingTasks() {
  console.log('🔁 Sincronizando tareas...');
  return Promise.resolve();
}
