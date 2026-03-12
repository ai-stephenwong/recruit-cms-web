'use client'
import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'
import type { Job } from '@/types'

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  closed: 'bg-red-100 text-red-700',
  draft: 'bg-yellow-100 text-yellow-700',
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    const params: Record<string, string> = { page: String(page), limit: '20' }
    if (search) params.q = search
    if (status) params.status = status
    adminApi.getJobs(params)
      .then(r => { setJobs(r.jobs || []); setTotal(r.total || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page, status])

  async function toggleStatus(job: Job) {
    const newStatus = job.status === 'active' ? 'closed' : 'active'
    await adminApi.updateJob(job.id, { status: newStatus })
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: newStatus } : j))
  }

  async function deleteJob(id: number) {
    if (!confirm('Delete this job?')) return
    await adminApi.deleteJob(id)
    setJobs(prev => prev.filter(j => j.id !== id))
    setTotal(t => t - 1)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Jobs</h1>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap">
          <input type="text" placeholder="Search jobs..." value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
          <button onClick={load} className="px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-800">Search</button>
          <span className="ml-auto self-center text-sm text-gray-500">{total} jobs</span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Title</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Company</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Category</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{job.title}</div>
                      <div className="text-xs text-gray-400">{job.location}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{job.company_name || `Employer #${job.employer_id}`}</td>
                    <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{job.category}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[job.status] || 'bg-gray-100 text-gray-600'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => toggleStatus(job)}
                          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700">
                          {job.status === 'active' ? 'Close' : 'Activate'}
                        </button>
                        <button onClick={() => deleteJob(job.id)}
                          className="text-xs px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-red-600">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {jobs.length === 0 && <div className="p-8 text-center text-gray-400">No jobs found</div>}
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
