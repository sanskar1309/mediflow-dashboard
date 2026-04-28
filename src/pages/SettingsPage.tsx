import { useState } from 'react'
import {
  User,
  Bell,
  Palette,
  Shield,
  LogOut,
  Save,
  Check,
  ChevronRight,
  LayoutGrid,
  List,
  Building2,
  Phone,
  Stethoscope,
} from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useSettingsStore } from '@/store/settingsStore'
import { authService } from '@/services/authService'
import { useNavigate } from 'react-router-dom'

// ── Toggle component ──────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        checked ? 'bg-blue-600' : 'bg-gray-200'
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div className="divide-y divide-gray-50">{children}</div>
    </div>
  )
}

// ── Setting row ───────────────────────────────────────────────────────────────
function SettingRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

// ── Nav tabs ──────────────────────────────────────────────────────────────────
type Tab = 'profile' | 'notifications' | 'appearance' | 'privacy' | 'danger'

const TABS: { value: Tab; label: string; icon: React.ElementType }[] = [
  { value: 'profile',       label: 'Profile',       icon: User      },
  { value: 'notifications', label: 'Notifications', icon: Bell      },
  { value: 'appearance',    label: 'Appearance',    icon: Palette   },
  { value: 'privacy',       label: 'Privacy',       icon: Shield    },
  { value: 'danger',        label: 'Danger Zone',   icon: LogOut    },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile')
  const [saved, setSaved] = useState(false)
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const settings = useSettingsStore()

  // local profile form state
  const [displayName, setDisplayName] = useState(settings.displayName || user?.displayName || '')
  const [title, setTitle]             = useState(settings.title)
  const [department, setDepartment]   = useState(settings.department)
  const [phone, setPhone]             = useState(settings.phone || user?.email || '')

  function handleSaveProfile() {
    settings.setProfile({ displayName, title, department, phone })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleLogout() {
    await authService.logout()
    navigate('/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">Manage your account preferences and configuration.</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar nav */}
        <aside className="w-full lg:w-56 flex-shrink-0">
          <nav className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            {TABS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors',
                  tab === value
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50',
                  value === 'danger' && tab !== 'danger' && 'text-red-500 hover:bg-red-50',
                  value === 'danger' && tab === 'danger' && 'bg-red-50 text-red-700'
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                <ChevronRight className={cn('h-4 w-4 opacity-40', tab === value && 'opacity-100')} />
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-4 animate-fade-in">

          {/* ── Profile ── */}
          {tab === 'profile' && (
            <>
              {/* Avatar */}
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center gap-5 px-6 py-5">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
                    {(displayName || user?.displayName || user?.email || 'U')
                      .split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{displayName || user?.displayName || 'Admin'}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {settings.title}
                    </span>
                  </div>
                </div>
              </div>

              <Section icon={User} title="Personal Information" description="Update your name and contact details">
                <div className="space-y-4 px-6 py-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your full name"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Job Title</label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Healthcare Administrator"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Department</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Administration"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Email</label>
                    <Input value={user?.email ?? ''} disabled className="bg-gray-50 text-gray-400" />
                    <p className="mt-1 text-xs text-gray-400">Email is managed by Firebase Authentication.</p>
                  </div>
                </div>
              </Section>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="gap-2 min-w-[120px]">
                  {saved ? (
                    <><Check className="h-4 w-4" /> Saved!</>
                  ) : (
                    <><Save className="h-4 w-4" /> Save Changes</>
                  )}
                </Button>
              </div>
            </>
          )}

          {/* ── Notifications ── */}
          {tab === 'notifications' && (
            <Section icon={Bell} title="Notification Preferences" description="Control when and how you receive alerts">
              <SettingRow
                label="Login notifications"
                description="Get notified when you sign in to MediFlow"
              >
                <Toggle
                  checked={settings.notifyLogin}
                  onChange={(v) => settings.setNotification('notifyLogin', v)}
                />
              </SettingRow>
              <SettingRow
                label="Patient status changes"
                description="Receive alerts when a patient's status is updated"
              >
                <Toggle
                  checked={settings.notifyPatientStatus}
                  onChange={(v) => settings.setNotification('notifyPatientStatus', v)}
                />
              </SettingRow>
              <SettingRow
                label="Critical alerts only"
                description="Only notify for critical status changes, suppress others"
              >
                <Toggle
                  checked={settings.notifyCriticalOnly}
                  onChange={(v) => settings.setNotification('notifyCriticalOnly', v)}
                />
              </SettingRow>
              <SettingRow
                label="Daily email digest"
                description="Receive a summary of activity every morning at 8 AM"
              >
                <Toggle
                  checked={settings.emailDigest}
                  onChange={(v) => settings.setNotification('emailDigest', v)}
                />
              </SettingRow>
            </Section>
          )}

          {/* ── Appearance ── */}
          {tab === 'appearance' && (
            <>
              <Section icon={Palette} title="Display" description="Customise how the dashboard looks">
                <SettingRow
                  label="Compact mode"
                  description="Reduce spacing and padding for a denser layout"
                >
                  <Toggle
                    checked={settings.compactMode}
                    onChange={(v) => settings.setAppearance('compactMode', v)}
                  />
                </SettingRow>
                <SettingRow
                  label="Default patient view"
                  description="Choose grid or list as the default on the Patients page"
                >
                  <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
                    {(['grid', 'list'] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => settings.setDefaultView(v)}
                        className={cn(
                          'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                          settings.defaultView === v
                            ? 'bg-white text-blue-700 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        )}
                      >
                        {v === 'grid' ? <LayoutGrid className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>
                </SettingRow>
              </Section>

              <Section icon={Palette} title="Theme" description="Colour scheme preferences">
                <SettingRow label="Colour theme" description="Dark mode coming in a future release">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Light (default)</span>
                </SettingRow>
              </Section>
            </>
          )}

          {/* ── Privacy ── */}
          {tab === 'privacy' && (
            <>
              <Section icon={Shield} title="Profile Visibility" description="Control what others can see about you">
                <SettingRow
                  label="Show phone number"
                  description="Display your phone number to other staff members"
                >
                  <Toggle
                    checked={settings.showPhone}
                    onChange={(v) => settings.setPrivacy('showPhone', v)}
                  />
                </SettingRow>
                <SettingRow
                  label="Activity status"
                  description="Let others see when you were last active"
                >
                  <Toggle
                    checked={settings.activityVisible}
                    onChange={(v) => settings.setPrivacy('activityVisible', v)}
                  />
                </SettingRow>
              </Section>

              <Section icon={Shield} title="Compliance" description="HIPAA & data handling">
                <SettingRow label="HIPAA compliance mode" description="Always on — cannot be disabled">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <Check className="h-3 w-3" /> Active
                  </span>
                </SettingRow>
                <SettingRow label="Data encryption" description="All patient data encrypted at rest and in transit">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <Check className="h-3 w-3" /> AES-256
                  </span>
                </SettingRow>
                <SettingRow label="Audit logging" description="All access and edits are logged automatically">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <Check className="h-3 w-3" /> Enabled
                  </span>
                </SettingRow>
              </Section>
            </>
          )}

          {/* ── Danger zone ── */}
          {tab === 'danger' && (
            <div className="overflow-hidden rounded-xl border border-red-100 bg-white shadow-sm">
              <div className="border-b border-red-100 bg-red-50 px-6 py-4">
                <h3 className="font-semibold text-red-700">Danger Zone</h3>
                <p className="text-xs text-red-500">Actions here are irreversible or have significant impact.</p>
              </div>
              <div className="divide-y divide-gray-50">
                <div className="flex items-center justify-between gap-6 px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Sign out</p>
                    <p className="text-xs text-gray-500">End your current session and return to the login page.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 border-red-200 text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-6 px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Clear local data</p>
                    <p className="text-xs text-gray-500">Reset all cached settings and notification data stored in this browser.</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      localStorage.removeItem('mediflow-settings')
                      localStorage.removeItem('mediflow-notifications')
                      window.location.reload()
                    }}
                  >
                    Clear data
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-6 px-6 py-4 opacity-50">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Delete account</p>
                    <p className="text-xs text-gray-500">Permanently delete your account and all associated data.</p>
                  </div>
                  <Button variant="destructive" size="sm" disabled>
                    Delete account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
