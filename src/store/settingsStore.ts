import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SettingsState {
  // Profile
  displayName: string
  title: string
  department: string
  phone: string

  // Notifications
  notifyLogin: boolean
  notifyPatientStatus: boolean
  notifyCriticalOnly: boolean
  emailDigest: boolean

  // Appearance
  compactMode: boolean
  defaultView: 'grid' | 'list'

  // Privacy
  showPhone: boolean
  activityVisible: boolean

  setProfile: (data: { displayName?: string; title?: string; department?: string; phone?: string }) => void
  setNotification: (key: keyof Pick<SettingsState, 'notifyLogin' | 'notifyPatientStatus' | 'notifyCriticalOnly' | 'emailDigest'>, val: boolean) => void
  setAppearance: (key: keyof Pick<SettingsState, 'compactMode'>, val: boolean) => void
  setDefaultView: (view: 'grid' | 'list') => void
  setPrivacy: (key: keyof Pick<SettingsState, 'showPhone' | 'activityVisible'>, val: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      displayName: '',
      title: 'Healthcare Administrator',
      department: 'Administration',
      phone: '',

      notifyLogin: true,
      notifyPatientStatus: true,
      notifyCriticalOnly: false,
      emailDigest: false,

      compactMode: false,
      defaultView: 'grid',

      showPhone: true,
      activityVisible: true,

      setProfile: (data) => set((s) => ({ ...s, ...data })),
      setNotification: (key, val) => set({ [key]: val }),
      setAppearance: (key, val) => set({ [key]: val }),
      setDefaultView: (view) => set({ defaultView: view }),
      setPrivacy: (key, val) => set({ [key]: val }),
    }),
    { name: 'mediflow-settings' }
  )
)
