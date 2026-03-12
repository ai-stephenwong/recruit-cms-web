'use client'
import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'

const STATUS_BADGE: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700',
  viewed: 'bg-purple-100 text-purple-700',
  interview: 'bg-amber-100 text-amber-700',
  hired: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    const params: Record<string, string> = { page: String(page), limit: '20' }
    if (status) params.status = status
    adminApi.getApplications(params)
      .then(r => { setApplications(r.applications || []); setTotal(r.total || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page, status])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Applications</h1>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap items-center">
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="viewed">Viewed</option>
            <option value="interview">Interview</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
          <span className="ml-auto text-sm text-gray-500">{total} applications</span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No applications found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">ID</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Job</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Candidate</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Company</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((app: any) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 text-xs">#{app.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{app.job_title || `Job #${app.job_id}`}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{app.candidate_name || `Candidate #${app.candidate_id}`}</td>
                    <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{app.company_name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[app.status] || 'bg-gray-100 text-gray-600'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {new Date(app.applied_at).toLocaleDateString('en-HK')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > 20 && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">← Prev</button>
            <span className="text-sm text-gray-500">Page {page} of {Math.ceil(total / 20)}</span>
            <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}
              className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next →</button>
          </div>
        )}
      </div>
    </div>
  )
}
