'use client'
import type { User } from '@/types'
const TOKEN_KEY = 'cms_token'
const USER_KEY = 'cms_user'
export const getToken = () => typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
}
export const setAuth = (token: string, user: User) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
