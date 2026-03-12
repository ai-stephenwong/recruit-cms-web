'use client'
import { useEffect, useState } from 'react'
import StatsCard from '@/components/StatsCard'
import { adminApi } from '@/lib/api'
import type { Analytics } from '@/types'

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Partial<Analytics>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getAnalytics()
      .then(setAnalytics)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="p-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 h-24 animate-pulse" />)}
      </div>
    </div>
  )

  const stats = [
    { title: 'Total Users', value: analytics.totalUsers || 0, icon: '👥', color: 'bg-blue-50' },
    { title: 'Active Jobs', value: analytics.activeJobs || 0, icon: '💼', color: 'bg-green-50' },
    { title: 'Applications', value: analytics.totalApplications || 0, icon: '📋', color: 'bg-purple-50' },
    { title: "Today's Reg.", value: analytics.todayRegistrations || 0, icon: '🆕', color: 'bg-amber-50' },
  ]

  const appByStatus = analytics.applicationsByStatus || {}

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Application status breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Applications by Status</h2>
          <div className="space-y-3">
            {[
              { key: 'submitted', label: 'Submitted', color: 'bg-blue-500' },
              { key: 'viewed', label: 'Viewed', color: 'bg-purple-500' },
              { key: 'interview', label: 'Interview', color: 'bg-amber-500' },
              { key: 'hired', label: 'Hired', color: 'bg-green-500' },
              { key: 'rejected', label: 'Rejected', color: 'bg-red-500' },
            ].map(s => {
              const total = analytics.totalApplications || 1
              const count = appByStatus[s.key] || 0
              const pct = Math.round((count / total) * 100)
              return (
                <div key={s.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{s.label}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className={`h-2 rounded-full ${s.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Platform Summary</h2>
          <dl className="space-y-3 text-sm">
            {[
              { label: 'Total Jobs (all)', value: analytics.totalJobs || 0 },
              { label: 'Active Jobs', value: analytics.activeJobs || 0 },
              { label: 'New Jobs (30d)', value: analytics.newJobsLast30Days || 0 },
              { label: 'Total Applications', value: analytics.totalApplications || 0 },
            ].map(item => (
              <div key={item.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                <dt className="text-gray-500">{item.label}</dt>
                <dd className="font-semibold text-gray-900">{item.value.toLocaleString()}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
