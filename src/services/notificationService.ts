import { useNotificationStore } from '@/store/notificationStore'
import type { NotificationType } from '@/store/notificationStore'

const log = (...args: unknown[]) => console.log('[MediFlow Notify]', ...args)
const warn = (...args: unknown[]) => console.warn('[MediFlow Notify]', ...args)

function pushToStore(
  title: string,
  message: string,
  type: NotificationType,
  link?: string
) {
  useNotificationStore.getState().add({ title, message, type, link })
}

export const notificationService = {
  async register(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      warn('Service workers not supported')
      return
    }
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      log('SW registered, scope:', reg.scope)
    } catch (err) {
      warn('SW registration failed:', err)
    }
  },

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      warn('Notification API not available')
      return false
    }
    log('Current permission:', Notification.permission)
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') {
      warn('Notifications are blocked — user must unblock in browser settings')
      return false
    }
    const result = await Notification.requestPermission()
    log('Permission result:', result)
    return result === 'granted'
  },

  async show(title: string, body: string, tag: string): Promise<void> {
    log('show() called —', title, body)

    if (!('Notification' in window)) {
      warn('Notification API missing, cannot show notification')
      return
    }

    if (Notification.permission !== 'granted') {
      warn('Permission not granted, skipping notification. Current:', Notification.permission)
      return
    }

    try {
      const n = new Notification(title, {
        body,
        icon: '/favicon.svg',
        tag,
        requireInteraction: false,
      })
      n.onerror = (e) => warn('Notification.onerror:', e)
      log('Notification created successfully')
    } catch (err) {
      warn('new Notification() threw:', err)
    }
  },

  async showLoginNotification(name: string): Promise<void> {
    log('showLoginNotification called for:', name)
    const title = 'Welcome to MediFlow'
    const message = `Hello, ${name}! You are now logged in.`
    pushToStore(title, message, 'success', '/dashboard')
    const granted = await this.requestPermission()
    if (!granted) return
    await this.show(title, message, 'mediflow-login')
  },

  async showPatientStatusNotification(patientName: string, status: string): Promise<void> {
    log('showPatientStatusNotification:', patientName, status)
    const title = 'Patient Status Update'
    const message = `${patientName}'s status changed to ${status.toUpperCase()}.`
    const type = status === 'critical' ? 'critical' : status === 'monitoring' ? 'warning' : 'success'
    pushToStore(title, message, type, '/patients')
    const granted = await this.requestPermission()
    if (!granted) return
    await this.show(title, message, `patient-${patientName}`)
  },
}
