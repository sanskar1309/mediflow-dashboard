export type PatientStatus = 'stable' | 'monitoring' | 'critical' | 'discharged'
export type PatientCondition =
  | 'Hypertension'
  | 'Diabetes'
  | 'Cardiac Arrest'
  | 'Pneumonia'
  | 'Fracture'
  | 'Asthma'
  | 'Appendicitis'
  | 'Stroke'
  | 'Kidney Disease'
  | 'Cancer'

export interface Patient {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female'
  condition: PatientCondition
  status: PatientStatus
  lastVisit: string
  admittedDate: string
  doctor: string
  ward: string
  avatarInitials: string
  bloodType: string
  phone: string
}

export interface PatientFilters {
  search: string
  status: PatientStatus | 'all'
  condition: PatientCondition | 'all'
}

export type ViewMode = 'grid' | 'list'
