import { usePatientStore } from '@/store/patientStore'
import { useSettingsStore } from '@/store/settingsStore'
import { notificationService } from '@/services/notificationService'
import type { Patient } from '@/types/patient'

export function usePatients() {
  const store = usePatientStore()
  const filteredPatients = store.getFilteredPatients()

  const updateStatus = (id: string, status: Patient['status']) => {
    const patient = store.patients.find((p) => p.id === id)
    store.updatePatientStatus(id, status)

    if (patient) {
      const { notifyPatientStatus, notifyCriticalOnly } = useSettingsStore.getState()
      const shouldNotify = notifyPatientStatus && (!notifyCriticalOnly || status === 'critical')
      if (shouldNotify) {
        notificationService.showPatientStatusNotification(patient.name, status)
      }
    }
  }

  return {
    patients: store.patients,
    filteredPatients,
    filters: store.filters,
    loading: store.loading,
    setFilters: store.setFilters,
    updateStatus,
  }
}
