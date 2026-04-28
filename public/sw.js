// MediFlow Service Worker
const CACHE_NAME = 'mediflow-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      ),
    ])
  )
})

self.addEventListener('fetch', () => {
  // Pass-through — no offline caching for this app
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const data = event.notification.data ?? {}

  let url = '/'
  if (data.type === 'login') url = '/dashboard'
  if (data.type === 'patient-status') url = '/patients'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(self.location.origin))
      if (existing) {
        existing.focus()
        existing.navigate(url)
      } else {
        self.clients.openWindow(url)
      }
    })
  )
})

self.addEventListener('push', (event) => {
  if (!event.data) return
  const payload = event.data.json()
  event.waitUntil(
    self.registration.showNotification(payload.title ?? 'MediFlow', {
      body: payload.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: payload.tag ?? 'mediflow',
      data: payload.data ?? {},
    })
  )
})
