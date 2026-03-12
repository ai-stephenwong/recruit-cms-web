'use client'
import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'
import type { User } from '@/types'

export default function EmployersPage() {
  const [employers, setEmployers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getUsers({ role: 'employer', limit: '100' })
      .then(r => setEmployers(r.users || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function deleteEmployer(id: number) {
    if (!confirm('Delete this employer account and all their job listings?')) return
    await adminApi.deleteUser(id)
    setEmployers(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Employer Accounts</h1>
      <div className="bg-white rounded-xl border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : employers.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No employer accounts</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Joined</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {employers.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 text-xs">#{emp.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{emp.email}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {new Date(emp.created_at).toLocaleDateString('en-HK')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteEmployer(emp.id)}
                      className="text-xs px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
