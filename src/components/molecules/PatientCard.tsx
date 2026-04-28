import { useEffect, useRef, useState } from 'react'
import { User, Calendar, Stethoscope, Phone, MoreVertical, Check } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { formatDate, cn } from '@/lib/utils'
import type { Patient, PatientStatus } from '@/types/patient'

const STATUS_OPTIONS: { value: PatientStatus; label: string; dot: string; text: string }[] = [
  { value: 'stable',     label: 'Stable',     dot: 'bg-emerald-500', text: 'text-emerald-700' },
  { value: 'monitoring', label: 'Monitoring', dot: 'bg-amber-500',   text: 'text-amber-700'   },
  { value: 'critical',   label: 'Critical',   dot: 'bg-red-500',     text: 'text-red-700'     },
  { value: 'discharged', label: 'Discharged', dot: 'bg-gray-400',    text: 'text-gray-500'    },
]

const statusColors: Record<PatientStatus, string> = {
  stable:     'bg-emerald-100 text-emerald-700',
  monitoring: 'bg-amber-100 text-amber-700',
  critical:   'bg-red-100 text-red-700',
  discharged: 'bg-gray-100 text-gray-500',
}

const avatarColors: string[] = [
  'bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500',
  'bg-rose-500',  'bg-teal-500',  'bg-indigo-500',  'bg-cyan-500',
]

function getAvatarColor(id: string): string {
  return avatarColors[id.charCodeAt(id.length - 1) % avatarColors.length]
}

function StatusDropdown({
  current,
  onSelect,
  onClose,
}: {
  current: PatientStatus
  onSelect: (s: PatientStatus) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute right-0 top-8 z-50 min-w-[150px] overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-lg animate-fade-in"
    >
      <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
        Set status
      </p>
      {STATUS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => { onSelect(opt.value); onClose() }}
          className={cn(
            'flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-gray-50',
            opt.value === current ? 'font-semibold' : 'text-gray-700'
          )}
        >
          <span className={cn('h-2 w-2 rounded-full flex-shrink-0', opt.dot)} />
          <span className={opt.value === current ? opt.text : ''}>{opt.label}</span>
          {opt.value === current && <Check className="ml-auto h-3.5 w-3.5 text-gray-400" />}
        </button>
      ))}
    </div>
  )
}

interface PatientCardProps {
  patient: Patient
  onStatusChange?: (id: string, status: PatientStatus) => void
}

export function PatientCard({ patient, onStatusChange }: PatientCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="group flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-100 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${getAvatarColor(patient.id)}`}>
            {patient.avatarInitials}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
            <p className="text-xs text-gray-500">{patient.age}y · {patient.gender} · {patient.bloodType}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={patient.status}>{patient.status}</Badge>
          {onStatusChange && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => setOpen((o) => !o)}
                title="Change status"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
              {open && (
                <StatusDropdown
                  current={patient.status}
                  onSelect={(s) => onStatusChange(patient.id, s)}
                  onClose={() => setOpen(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Stethoscope className="h-3.5 w-3.5 text-gray-400" />
          <span className="truncate">{patient.condition}</span>
          <span className="ml-auto text-xs text-gray-400">{patient.ward}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-3.5 w-3.5 text-gray-400" />
          <span className="truncate">{patient.doctor}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span>Last visit: {formatDate(patient.lastVisit)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="h-3.5 w-3.5 text-gray-400" />
          <span>{patient.phone}</span>
        </div>
      </div>
    </div>
  )
}

export function PatientRow({ patient, onStatusChange }: PatientCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <tr className="group border-b border-gray-50 transition-colors hover:bg-blue-50/30">
      <td className="py-3 pl-6 pr-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${getAvatarColor(patient.id)}`}>
            {patient.avatarInitials}
          </div>
          <div>
            <p className="font-medium text-gray-900">{patient.name}</p>
            <p className="text-xs text-gray-500">{patient.age}y · {patient.gender}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{patient.condition}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[patient.status]}`}>
          {patient.status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{patient.doctor}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{patient.ward}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(patient.lastVisit)}</td>
      <td className="py-3 pl-4 pr-6 text-right">
        {onStatusChange && (
          <div className="relative inline-block">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
              onClick={() => setOpen((o) => !o)}
              title="Change status"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            {open && (
              <StatusDropdown
                current={patient.status}
                onSelect={(s) => onStatusChange(patient.id, s)}
                onClose={() => setOpen(false)}
              />
            )}
          </div>
        )}
      </td>
    </tr>
  )
}
