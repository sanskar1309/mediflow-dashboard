import { useState } from 'react'
import { Search, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Badge } from '@/components/atoms/Badge'
import { PatientCard, PatientRow } from '@/components/molecules/PatientCard'
import { PatientCardSkeleton } from '@/components/atoms/Skeleton'
import { usePatients } from '@/hooks/usePatients'
import { useSettingsStore } from '@/store/settingsStore'
import { cn } from '@/lib/utils'
import type { PatientStatus, PatientCondition, ViewMode } from '@/types/patient'

const STATUS_OPTIONS: { label: string; value: PatientStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Stable', value: 'stable' },
  { label: 'Monitoring', value: 'monitoring' },
  { label: 'Critical', value: 'critical' },
  { label: 'Discharged', value: 'discharged' },
]

const CONDITIONS: PatientCondition[] = [
  'Hypertension',
  'Diabetes',
  'Cardiac Arrest',
  'Pneumonia',
  'Fracture',
  'Asthma',
  'Appendicitis',
  'Stroke',
  'Kidney Disease',
  'Cancer',
]

export function PatientDetailsPage() {
  const { defaultView } = useSettingsStore()
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView)

  const {
    filteredPatients,
    filters,
    loading,
    setFilters,
    updateStatus,
  } = usePatients()

  const hasActiveFilters = filters.status !== 'all' || filters.condition !== 'all'

  const clearFilters = () => setFilters({ search: '', status: 'all', condition: 'all' })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
          <p className="mt-1 text-sm text-gray-500">
            {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              viewMode === 'grid'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <List className="h-4 w-4" />
            List
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, condition, doctor…"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* Status filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value as PatientStatus | 'all' })}
          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label === 'All' ? 'All Statuses' : opt.label}
            </option>
          ))}
        </select>

        {/* Condition filter */}
        <select
          value={filters.condition}
          onChange={(e) =>
            setFilters({ condition: e.target.value as PatientCondition | 'all' })
          }
          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Conditions</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <Button variant="outline" size="default" onClick={clearFilters} className="gap-1.5">
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Active filter tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.status !== 'all' && (
            <Badge variant="outline" className="gap-1">
              Status: {filters.status}
              <button onClick={() => setFilters({ status: 'all' })} className="ml-1 hover:text-red-500">
                ×
              </button>
            </Badge>
          )}
          {filters.condition !== 'all' && (
            <Badge variant="outline" className="gap-1">
              {filters.condition}
              <button onClick={() => setFilters({ condition: 'all' })} className="ml-1 hover:text-red-500">
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
              : 'flex flex-col gap-3'
          )}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <PatientCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20">
          <SlidersHorizontal className="h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-500">No patients match your filters</p>
          <Button variant="ghost" className="mt-3 text-blue-600" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 animate-fade-in">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} onStatusChange={updateStatus} />
          ))}
        </div>
      ) : (
        <div className="animate-fade-in overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="py-3 pl-6 pr-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Condition
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Doctor
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Ward
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Last Visit
                  </th>
                  <th className="py-3 pl-4 pr-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <PatientRow
                    key={patient.id}
                    patient={patient}
                    onStatusChange={updateStatus}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
            <p className="text-sm text-gray-500">
              Showing {filteredPatients.length} of {filteredPatients.length} patients
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
