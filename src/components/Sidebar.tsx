'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clearAuth } from '@/lib/auth'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/jobs', label: 'Jobs', icon: '💼' },
  { href: '/dashboard/users', label: 'Users', icon: '👥' },
  { href: '/dashboard/employers', label: 'Employers', icon: '🏢' },
  { href: '/dashboard/content', label: 'Content', icon: '📝' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  function logout() { clearAuth(); router.push('/login') }

  return (
    <aside className="w-60 bg-slate-800 min-h-screen flex flex-col">
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Recruit CMS</p>
            <p className="text-slate-400 text-xs">Admin Portal</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-slate-700">
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-700 hover:text-white w-full transition-colors">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}
