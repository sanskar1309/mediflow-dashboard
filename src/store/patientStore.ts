import { create } from 'zustand'
import type { Patient, PatientFilters, ViewMode } from '@/types/patient'
import { mockPatients } from '@/data/mockData'

interface PatientStore {
  patients: Patient[]
  filters: PatientFilters
  viewMode: ViewMode
  loading: boolean
  setViewMode: (mode: ViewMode) => void
  setFilters: (filters: Partial<PatientFilters>) => void
  updatePatientStatus: (id: string, status: Patient['status']) => void
  getFilteredPatients: () => Patient[]
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  patients: mockPatients,
  filters: { search: '', status: 'all', condition: 'all' },
  viewMode: 'grid',
  loading: false,

  setViewMode: (mode) => set({ viewMode: mode }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  updatePatientStatus: (id, status) =>
    set((state) => ({
      patients: state.patients.map((p) => (p.id === id ? { ...p, status } : p)),
    })),

  getFilteredPatients: () => {
    const { patients, filters } = get()
    return patients.filter((p) => {
      const matchesSearch =
        filters.search === '' ||
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.condition.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.doctor.toLowerCase().includes(filters.search.toLowerCase())
      const matchesStatus = filters.status === 'all' || p.status === filters.status
      const matchesCondition =
        filters.condition === 'all' || p.condition === filters.condition
      return matchesSearch && matchesStatus && matchesCondition
    })
  },
}))
