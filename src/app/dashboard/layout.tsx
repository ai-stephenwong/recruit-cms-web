'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { getToken, getUser } from '@/lib/auth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  useEffect(() => {
    const token = getToken()
    const user = getUser()
    if (!token || user?.role !== 'admin') router.replace('/login')
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
