import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatWidgetProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; label: string }
  iconColor?: string
  iconBg?: string
  className?: string
}

export function StatWidget({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-50',
  className,
}: StatWidgetProps) {
  const isPositive = trend && trend.value >= 0

  return (
    <div
      className={cn(
        'group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">{value}</p>
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', iconBg)}>
          <Icon className={cn('h-6 w-6', iconColor)} />
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
                isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              )}
            >
              {isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
          <span className="text-xs text-gray-500">{trend?.label ?? subtitle}</span>
        </div>
      )}
    </div>
  )
}
