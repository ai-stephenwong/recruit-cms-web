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
  login: (email: string, password: string) =>
    req<{ token: string; user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => req<User>('/api/auth/me'),
}

export const adminApi = {
  getAnalytics: () => req<Analytics>('/api/admin/analytics'),
  getJobs: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return req<{ jobs: Job[]; total: number }>(`/api/admin/jobs${qs}`)
  },
  getUsers: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return req<{ users: User[]; total: number }>(`/api/admin/users${qs}`)
  },
  deleteUser: (id: number) => req<{ message: string }>(`/api/admin/users/${id}`, { method: 'DELETE' }),
  updateJob: (id: number, data: Partial<Job>) =>
    req<Job>(`/api/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteJob: (id: number) => req<{ message: string }>(`/api/jobs/${id}`, { method: 'DELETE' }),
  getArticles: () => req<{ articles: Article[] }>('/api/articles'),
  createArticle: (data: Partial<Article>) =>
    req<Article>('/api/articles', { method: 'POST', body: JSON.stringify(data) }),
  updateArticle: (id: number, data: Partial<Article>) =>
    req<Article>(`/api/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteArticle: (id: number) => req<{ message: string }>(`/api/articles/${id}`, { method: 'DELETE' }),
}
