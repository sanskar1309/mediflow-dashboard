import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, Search, X, CheckCheck, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { useNotificationStore, type AppNotification, type NotificationType } from '@/store/notificationStore'
import { cn } from '@/lib/utils'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const typeIcon: Record<NotificationType, React.ReactNode> = {
  critical: <AlertTriangle className="h-4 w-4 text-red-500" />,
  warning: <AlertCircle className="h-4 w-4 text-amber-500" />,
  success: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  info: <Info className="h-4 w-4 text-blue-500" />,
}

const typeDot: Record<NotificationType, string> = {
  critical: 'bg-red-500',
  warning: 'bg-amber-500',
  success: 'bg-emerald-500',
  info: 'bg-blue-500',
}

function NotificationItem({ n, onClose }: { n: AppNotification; onClose: () => void }) {
  const { markRead, remove } = useNotificationStore()
  const navigate = useNavigate()

  const handleClick = () => {
    markRead(n.id)
    if (n.link) {
      navigate(n.link)
      onClose()
    }
  }

  return (
    <div
      className={cn(
        'group flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50',
        !n.read && 'bg-blue-50/40'
      )}
      onClick={handleClick}
    >
      <div className="mt-0.5 flex-shrink-0">{typeIcon[n.type]}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm', !n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700')}>
            {n.title}
          </p>
          <span className="flex-shrink-0 text-[10px] text-gray-400">{timeAgo(n.timestamp)}</span>
        </div>
        <p className="mt-0.5 text-xs leading-snug text-gray-500">{n.message}</p>
      </div>
      <button
        className="mt-0.5 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => { e.stopPropagation(); remove(n.id) }}
        title="Dismiss"
      >
        <X className="h-3.5 w-3.5 text-gray-400 hover:text-red-400" />
      </button>
      {!n.read && (
        <div className={cn('mt-1.5 h-2 w-2 flex-shrink-0 rounded-full', typeDot[n.type])} />
      )}
    </div>
  )
}

interface NavbarProps {
  onMenuClick: () => void
  title: string
}

export function Navbar({ onMenuClick, title }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { notifications, markAllRead, unreadCount } = useNotificationStore()
  const count = unreadCount()
  const recent = notifications.slice(0, 6)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-100 bg-white/80 px-6 backdrop-blur-md">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden w-64 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input className="pl-9 text-sm" placeholder="Search…" />
          </div>
        </div>

        {/* Bell button + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setDropdownOpen((o) => !o)}
          >
            <Bell className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Button>

          {dropdownOpen && (
            <div className="animate-fade-in absolute right-0 top-12 z-50 w-96 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {count > 0 && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                      {count} new
                    </span>
                  )}
                </div>
                {count > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Items */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {recent.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <Bell className="h-8 w-8 opacity-30" />
                    <p className="mt-2 text-sm">No notifications</p>
                  </div>
                ) : (
                  recent.map((n) => (
                    <NotificationItem key={n.id} n={n} onClose={() => setDropdownOpen(false)} />
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-gray-100 px-4 py-2.5">
                  <button
                    onClick={() => { navigate('/notifications'); setDropdownOpen(false) }}
                    className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    View all {notifications.length} notifications →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
