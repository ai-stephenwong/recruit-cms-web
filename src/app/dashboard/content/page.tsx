'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminApi } from '@/lib/api'
import type { Article } from '@/types'

export default function ContentPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getArticles()
      .then(r => setArticles(r.articles || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function deleteArticle(id: number) {
    if (!confirm('Delete this article?')) return
    await adminApi.deleteArticle(id)
    setArticles(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Articles</h1>
        <Link href="/dashboard/content/new"
          className="px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-800">
          + New Article
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="mb-4">No articles yet</p>
            <Link href="/dashboard/content/new" className="text-blue-600 hover:underline text-sm">Create your first article</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">Title</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Slug</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Published</th>
                <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {articles.map(article => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{article.title}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell font-mono">{article.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                    {article.published_at ? new Date(article.published_at).toLocaleDateString('en-HK') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/dashboard/content/${article.id}`}
                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700">Edit</Link>
                      <button onClick={() => deleteArticle(article.id)}
                        className="text-xs px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-red-600">Delete</button>
                    </div>
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
