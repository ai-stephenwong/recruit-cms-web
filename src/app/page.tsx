'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, getUser } from '@/lib/auth'
export default function RootPage() {
  const router = useRouter()
  useEffect(() => {
    const token = getToken()
    const user = getUser()
    if (token && user?.role === 'admin') router.replace('/dashboard')
    else router.replace('/login')
  }, [])
  return null
}
