'use client'
import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'
import type { User } from '@/types'

const ROLE_BADGE: Record<string, string> = {
  candidate: 'bg-blue-100 text-blue-700',
  employer: 'bg-purple-100 text-purple-700',
  admin: 'bg-red-100 text-red-700',
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    const params: Record<string, string> = { page: String(page), limit: '20' }
    if (search) params.q = search
    if (role) params.role = role
    adminApi.getUsers(params)
      .then(r => { setUsers(r.users || []); setTotal(r.total || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page, role])

  async function deleteUser(id: number) {
    if (!confirm('Delete this user and all their data?')) return
    await adminApi.deleteUser(id)
    setUsers(prev => prev.filter(u => u.id !== id))
    setTotal(t => t - 1)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Users</h1>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap">
          <input type="text" placeholder="Search by email..." value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={role} onChange={e => { setRole(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="">All Roles</option>
            <option value="candidate">Candidate</option>
            <option value="employer">Employer</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={load} className="px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-800">Search</button>
          <span className="ml-auto self-center text-sm text-gray-500">{total} users</span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 font-medium text-gray-500">Role</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Joined</th>
                <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 text-xs">#{user.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${ROLE_BADGE[user.role] || 'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {new Date(user.created_at).toLocaleDateString('en-HK')}
                  </td>
                  <td className="px-4 py-3">
                    {user.role !== 'admin' && (
                      <button onClick={() => deleteUser(user.id)}
                        className="text-xs px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-red-600">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {users.length === 0 && !loading && <div className="p-8 text-center text-gray-400">No users found</div>}
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
