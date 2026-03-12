// Service Worker for offline upload queue management
// Registered via vite-plugin-pwa

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Background sync for offline uploads
self.addEventListener('sync', (event) => {
  if (event.tag === 'upload-queue') {
    event.waitUntil(syncUploads());
  }
});

async function syncUploads() {
  // Notify all clients to process the offline queue
  const allClients = await clients.matchAll({ type: 'window' });
  allClients.forEach((client) => {
    client.postMessage({ type: 'SYNC_UPLOADS' });
  });
}
