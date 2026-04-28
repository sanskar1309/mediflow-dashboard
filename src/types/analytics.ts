export interface MonthlyStats {
  month: string
  admissions: number
  discharges: number
  criticalCases: number
}

export interface ConditionDistribution {
  name: string
  value: number
  color: string
}

export interface PatientTrend {
  date: string
  patients: number
  recovered: number
}

export interface DashboardStats {
  totalPatients: number
  activeCases: number
  criticalAlerts: number
  recoveryRate: number
  totalDoctors: number
  bedsOccupied: number
}
