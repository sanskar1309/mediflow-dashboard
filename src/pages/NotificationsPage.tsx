import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { cn } from '@/lib/utils'
import { useNotificationStore, type AppNotification, type NotificationType } from '@/store/notificationStore'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

const TYPE_META: Record<NotificationType, { icon: React.ReactNode; bg: string; border: string; label: string }> = {
  critical: {
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    bg: 'bg-red-50',
    border: 'border-red-100',
    label: 'Critical',
  },
  warning: {
    icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    label: 'Warning',
  },
  success: {
    icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    label: 'Success',
  },
  info: {
    icon: <Info className="h-5 w-5 text-blue-500" />,
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    label: 'Info',
  },
}

const DOT_COLOR: Record<NotificationType, string> = {
  critical: 'bg-red-500',
  warning: 'bg-amber-500',
  success: 'bg-emerald-500',
  info: 'bg-blue-500',
}

type FilterType = 'all' | NotificationType | 'unread'

function NotificationCard({ n }: { n: AppNotification }) {
  const { markRead, remove } = useNotificationStore()
  const navigate = useNavigate()
  const meta = TYPE_META[n.type]

  const handleClick = () => {
    markRead(n.id)
    if (n.link) navigate(n.link)
  }

  return (
    <div
      className={cn(
        'group relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-md',
        n.read
          ? 'border-gray-100 bg-white'
          : `${meta.border} ${meta.bg}`
      )}
      onClick={handleClick}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
          n.read ? 'bg-gray-100' : meta.bg
        )}
      >
        {meta.icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className={cn('text-sm', n.read ? 'font-medium text-gray-700' : 'font-semibold text-gray-900')}>
              {n.title}
            </p>
            {!n.read && (
              <span className={cn('h-2 w-2 rounded-full flex-shrink-0', DOT_COLOR[n.type])} />
            )}
          </div>
          <span className="flex-shrink-0 text-xs text-gray-400">{timeAgo(n.timestamp)}</span>
        </div>
        <p className="mt-1 text-sm text-gray-500 leading-relaxed">{n.message}</p>
        <div className="mt-2 flex items-center gap-3">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold',
              n.type === 'critical' && 'bg-red-100 text-red-700',
              n.type === 'warning' && 'bg-amber-100 text-amber-700',
              n.type === 'success' && 'bg-emerald-100 text-emerald-700',
              n.type === 'info' && 'bg-blue-100 text-blue-700'
            )}
          >
            {meta.label}
          </span>
          {!n.read && (
            <button
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
              onClick={(e) => { e.stopPropagation(); markRead(n.id) }}
            >
              Mark as read
            </button>
          )}
        </div>
      </div>

      {/* Dismiss */}
      <button
        className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => { e.stopPropagation(); remove(n.id) }}
        title="Dismiss"
      >
        <X className="h-4 w-4 text-gray-400 hover:text-red-400" />
      </button>
    </div>
  )
}

export function NotificationsPage() {
  const [filter, setFilter] = useState<FilterType>('all')
  const { notifications, markAllRead, clearAll, unreadCount } = useNotificationStore()
  const count = unreadCount()

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read
    if (filter === 'all') return true
    return n.type === filter
  })

  const filterOptions: { value: FilterType; label: string; count?: number }[] = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count },
    { value: 'critical', label: 'Critical', count: notifications.filter((n) => n.type === 'critical').length },
    { value: 'warning', label: 'Warning', count: notifications.filter((n) => n.type === 'warning').length },
    { value: 'success', label: 'Success', count: notifications.filter((n) => n.type === 'success').length },
    { value: 'info', label: 'Info', count: notifications.filter((n) => n.type === 'info').length },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="mt-1 text-sm text-gray-500">
            {count > 0 ? `${count} unread notification${count > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAll} className="gap-1.5 text-red-600 hover:border-red-200 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        {filterOptions.map((opt) => (
          opt.count !== undefined && opt.count === 0 && opt.value !== 'all' && opt.value !== 'unread' ? null : (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                filter === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              {opt.label}
              {opt.count !== undefined && opt.count > 0 && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                    filter === opt.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  )}
                >
                  {opt.count}
                </span>
              )}
            </button>
          )
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20">
          <Bell className="h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-500">
            {filter === 'unread' ? 'No unread notifications' : 'No notifications here'}
          </p>
          {filter !== 'all' && (
            <Button variant="ghost" className="mt-2 text-blue-600 text-sm" onClick={() => setFilter('all')}>
              View all
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          {/* Group: unread first */}
          {filtered.some((n) => !n.read) && (
            <div className="space-y-3">
              {filter === 'all' && (
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Unread</p>
              )}
              {filtered.filter((n) => !n.read).map((n) => (
                <NotificationCard key={n.id} n={n} />
              ))}
            </div>
          )}
          {filtered.some((n) => !n.read) && filtered.some((n) => n.read) && (
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gray-50 px-3 text-xs text-gray-400">Earlier</span>
              </div>
            </div>
          )}
          {filtered.some((n) => n.read) && (
            <div className="space-y-3">
              {filter === 'all' && filtered.some((n) => !n.read) && (
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Read</p>
              )}
              {filtered.filter((n) => n.read).map((n) => (
                <NotificationCard key={n.id} n={n} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
