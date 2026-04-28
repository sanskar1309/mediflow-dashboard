import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card'
import { conditionDistribution, patientTrends, monthlyStats } from '@/data/mockData'

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-lg">
      <p className="mb-2 text-xs font-semibold text-gray-600">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const PieTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: { name: string; value: number; payload: { color: string } }[]
}) => {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-lg">
      <div className="flex items-center gap-2 text-xs">
        <div className="h-2 w-2 rounded-full" style={{ background: item.payload.color }} />
        <span className="text-gray-600">{item.name}:</span>
        <span className="font-semibold text-gray-900">{item.value} patients</span>
      </div>
    </div>
  )
}

export function AnalyticsPage() {
  const total = conditionDistribution.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <p className="mt-1 text-gray-500">Detailed insights into patient trends and case data.</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Avg Stay (days)', value: '6.4', change: '-0.8' },
          { label: 'Readmission Rate', value: '4.2%', change: '-1.1%' },
          { label: 'Bed Turnover', value: '12.3', change: '+0.9' },
          { label: 'Mortality Rate', value: '0.8%', change: '-0.2%' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-medium text-gray-500">{kpi.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="mt-1 text-xs font-medium text-emerald-600">{kpi.change} vs last mo.</p>
          </div>
        ))}
      </div>

      {/* Patient trends area chart */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Census Trend</CardTitle>
          <p className="text-sm text-gray-500">Total patients vs recovered — last 6 months</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={patientTrends}>
              <defs>
                <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="recoveredGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="patients"
                name="Total Patients"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#patientGrad)"
              />
              <Area
                type="monotone"
                dataKey="recovered"
                name="Recovered"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#recoveredGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie + bar row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Condition distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Condition Distribution</CardTitle>
            <p className="text-sm text-gray-500">{total} patients by primary diagnosis</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={conditionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {conditionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {conditionDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span className="truncate text-xs text-gray-600">{item.name}</span>
                  <span className="ml-auto text-xs font-semibold text-gray-900">
                    {((item.value / total) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly line chart */}
        <Card>
          <CardHeader>
            <CardTitle>Critical Cases Trend</CardTitle>
            <p className="text-sm text-gray-500">Monthly critical admissions</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="criticalCases"
                  name="Critical Cases"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="admissions"
                  name="Admissions"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {monthlyStats.slice(-3).map((m) => (
                <div key={m.month} className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-xs text-gray-500">{m.month}</p>
                  <p className="text-lg font-bold text-gray-900">{m.admissions}</p>
                  <p className="text-[10px] text-gray-400">admissions</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admissions vs discharges bar */}
      <Card>
        <CardHeader>
          <CardTitle>Admissions vs Discharges</CardTitle>
          <p className="text-sm text-gray-500">6-month comparative analysis</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyStats} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="admissions" name="Admissions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="discharges" name="Discharges" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
