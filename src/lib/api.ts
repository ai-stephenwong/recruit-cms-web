import type { Job, User, Article, Analytics } from '@/types'
import { getToken } from './auth'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Request failed')
  return json
}

export const authApi = {
  login: async (email: string, password: string) => {
    const r = await req<{ access_token: string; user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    return { token: r.access_token, user: r.user }
  },
  me: () => req<{ user: User }>('/api/auth/me').then(r => r.user),
}

export const adminApi = {
  getAnalytics: () => req<Analytics>('/api/admin/analytics'),
  getJobs: async (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    const r = await req<{ data: Job[]; pagination: { total: number } }>(`/api/admin/jobs${qs}`)
    return { jobs: r.data, total: r.pagination.total }
  },
  getUsers: async (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    const r = await req<{ data: User[]; pagination: { total: number } }>(`/api/admin/users${qs}`)
    return { users: r.data, total: r.pagination.total }
  },
  deleteUser: (id: number) => req<{ message: string }>(`/api/admin/users/${id}`, { method: 'DELETE' }),
  updateJob: (id: number, data: Partial<Job>) =>
    req<{ data: Job }>(`/api/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(r => r.data),
  deleteJob: (id: number) => req<{ message: string }>(`/api/jobs/${id}`, { method: 'DELETE' }),
  getArticles: async () => {
    const r = await req<{ data: Article[]; pagination: { total: number } }>('/api/articles')
    return { articles: r.data }
  },
  createArticle: (data: Partial<Article>) =>
    req<{ data: Article }>('/api/articles', { method: 'POST', body: JSON.stringify(data) }).then(r => r.data),
  updateArticle: (id: number, data: Partial<Article>) =>
    req<{ data: Article }>(`/api/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(r => r.data),
  deleteArticle: (id: number) => req<{ message: string }>(`/api/articles/${id}`, { method: 'DELETE' }),
  getApplications: async (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    const r = await req<{ data: any[]; pagination: { total: number } }>(`/api/applications${qs}`)
    return { applications: r.data, total: r.pagination.total }
  },
}
