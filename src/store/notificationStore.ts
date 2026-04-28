import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NotificationType = 'critical' | 'warning' | 'success' | 'info'

export interface AppNotification {
  id: string
  title: string
  message: string
  type: NotificationType
  timestamp: string // ISO string (serializable)
  read: boolean
  link?: string
}

interface NotificationStore {
  notifications: AppNotification[]
  add: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  remove: (id: string) => void
  clearAll: () => void
  unreadCount: () => number
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: 'n001',
          title: 'Critical Alert',
          message: 'Patient James Thornton admitted to ICU — immediate attention required.',
          type: 'critical',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          read: false,
          link: '/patients',
        },
        {
          id: 'n002',
          title: 'Status Update',
          message: 'Victor Huang — stroke assessment completed by Dr. Priya Nair.',
          type: 'warning',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          read: false,
          link: '/patients',
        },
        {
          id: 'n003',
          title: 'Patient Discharged',
          message: 'Eleanor Voss has been successfully discharged from Cardiology.',
          type: 'success',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          read: false,
          link: '/patients',
        },
        {
          id: 'n004',
          title: 'Lab Results Ready',
          message: 'New lab results are available for Chloe Davidson — Oncology.',
          type: 'info',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: true,
          link: '/patients',
        },
        {
          id: 'n005',
          title: 'Critical Vitals',
          message: 'Derek Sullivan — critical vitals alert. ICU nurse notified.',
          type: 'critical',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          read: true,
          link: '/patients',
        },
        {
          id: 'n006',
          title: 'Appointment Reminder',
          message: 'Sofia Ramirez has a follow-up with Dr. Aaron Blake tomorrow at 10:00 AM.',
          type: 'info',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          read: true,
          link: '/patients',
        },
        {
          id: 'n007',
          title: 'New Patient Admitted',
          message: 'Kwame Asante admitted to Endocrinology under Dr. Aaron Blake.',
          type: 'info',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          read: true,
          link: '/patients',
        },
      ],

      add: (n) =>
        set((state) => ({
          notifications: [
            {
              ...n,
              id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              timestamp: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ],
        })),

      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      remove: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearAll: () => set({ notifications: [] }),

      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: 'mediflow-notifications' }
  )
)
