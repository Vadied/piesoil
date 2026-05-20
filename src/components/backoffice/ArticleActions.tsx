'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ArticleActionsProps = {
  articleId: string
  articleTitle: string
}

/**
 * Inline delete control for an article row in the backoffice list.
 * Shows a confirmation prompt before calling DELETE /api/backoffice/articles/:id.
 * On success, refreshes the current route so the server component re-fetches.
 */
export function ArticleActions({ articleId, articleTitle }: ArticleActionsProps) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete() {
    setDeleting(true)
    setError(null)

    try {
      const res = await fetch(`/api/backoffice/articles/${articleId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.refresh()
        return
      }

      const data = (await res.json()) as { error?: string }
      setError(data.error ?? 'Errore durante l\'eliminazione')
      setConfirming(false)
    } catch {
      setError('Errore di rete. Riprova.')
      setConfirming(false)
    } finally {
      setDeleting(false)
    }
  }

  if (error) {
    return (
      <span className="text-xs text-red-600" title={articleTitle}>
        {error}
      </span>
    )
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="text-xs text-gray-500">Eliminare?</span>
        <button
          onClick={() => void handleDelete()}
          disabled={deleting}
          className="text-xs font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
        >
          {deleting ? '…' : 'Sì'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs font-medium text-gray-500 hover:text-gray-700"
        >
          No
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
      aria-label={`Elimina ${articleTitle}`}
    >
      Elimina
    </button>
  )
}
