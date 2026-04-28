import {
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  Stethoscope,
  BedDouble,
} from 'lucide-react'
import { StatWidget } from '@/components/molecules/StatWidget'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { dashboardStats, recentActivity, monthlyStats } from '@/data/mockData'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const activityTypeStyles = {
  critical: 'bg-red-500',
  warning: 'bg-amber-500',
  success: 'bg-emerald-500',
  info: 'bg-blue-500',
}

export function DashboardPage() {
  const { user } = useAuthStore()
  const firstName = user?.displayName?.split(' ')[0] ?? 'Admin'

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Good morning, {firstName}</h2>
        <p className="mt-1 text-gray-500">
          Here's what's happening at your facility today.
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatWidget
          title="Total Patients"
          value={dashboardStats.totalPatients}
          icon={Users}
          trend={{ value: 8.2, label: 'vs last month' }}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatWidget
          title="Active Cases"
          value={dashboardStats.activeCases}
          icon={Activity}
          trend={{ value: 3.1, label: 'vs last week' }}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatWidget
          title="Critical Alerts"
          value={dashboardStats.criticalAlerts}
          icon={AlertTriangle}
          trend={{ value: -12.5, label: 'vs yesterday' }}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
        <StatWidget
          title="Recovery Rate"
          value={`${dashboardStats.recoveryRate}%`}
          icon={TrendingUp}
          trend={{ value: 2.4, label: 'vs last month' }}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatWidget
          title="Medical Staff"
          value={dashboardStats.totalDoctors}
          icon={Stethoscope}
          subtitle="Doctors on duty"
          iconColor="text-cyan-600"
          iconBg="bg-cyan-50"
        />
        <StatWidget
          title="Beds Occupied"
          value={`${dashboardStats.bedsOccupied}/200`}
          icon={BedDouble}
          subtitle="81.5% capacity"
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
        />
      </div>

      {/* Chart + Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Admissions & Discharges</CardTitle>
            <p className="text-sm text-gray-500">Last 6 months overview</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyStats} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <Bar dataKey="admissions" name="Admissions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="discharges" name="Discharges" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="criticalCases" name="Critical" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-sm text-gray-500">Live facility updates</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div
                  className={cn(
                    'mt-1.5 h-2 w-2 flex-shrink-0 rounded-full',
                    activityTypeStyles[item.type as keyof typeof activityTypeStyles]
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-700 leading-snug">{item.message}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick status overview */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Status Overview</CardTitle>
          <p className="text-sm text-gray-500">Current distribution of patient statuses</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: 'Stable', count: 142, variant: 'stable' as const, pct: 57 },
              { label: 'Monitoring', count: 81, variant: 'monitoring' as const, pct: 33 },
              { label: 'Critical', count: 14, variant: 'critical' as const, pct: 6 },
              { label: 'Discharged', count: 11, variant: 'discharged' as const, pct: 4 },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <Badge variant={s.variant}>{s.label}</Badge>
                  <span className="text-xs text-gray-500">{s.pct}%</span>
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900">{s.count}</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                  <div
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      s.variant === 'stable' && 'bg-emerald-500',
                      s.variant === 'monitoring' && 'bg-amber-500',
                      s.variant === 'critical' && 'bg-red-500',
                      s.variant === 'discharged' && 'bg-gray-400'
                    )}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
