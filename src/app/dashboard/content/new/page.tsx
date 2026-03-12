'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { adminApi } from '@/lib/api'

export default function NewArticlePage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', slug: '', body: '', status: 'draft' as 'draft' | 'published' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }
  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await adminApi.createArticle(form)
      router.push('/dashboard/content')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/content" className="text-sm text-blue-600 hover:underline">← Content</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">New Article</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={form.title} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={e => { set('title', e.target.value); set('slug', autoSlug(e.target.value)) }} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input type="text" value={form.slug} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={e => set('slug', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body *</label>
            <textarea rows={12} value={form.body} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={e => set('body', e.target.value)} placeholder="Write your article content here..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-3">
              {(['draft', 'published'] as const).map(s => (
                <label key={s} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm capitalize ${
                  form.status === s ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'
                }`}>
                  <input type="radio" name="status" value={s} checked={form.status === s}
                    onChange={() => set('status', s)} className="sr-only" />
                  {s}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Link href="/dashboard/content" className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">Cancel</Link>
            <button type="submit" disabled={saving}
              className="px-6 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
