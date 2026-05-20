'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type UserActionsProps = {
  userId: string
  userName: string
  disabled: boolean
}

/**
 * Inline row actions for a co-editor in the user management list.
 * Supports toggling the disabled flag and permanently deleting the account.
 * Both operations call the respective Route Handler and refresh the page on success.
 */
export function UserActions({ userId, userName, disabled }: UserActionsProps) {
  const router = useRouter()
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleToggleDisabled() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/backoffice/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disabled: !disabled }),
      })
      if (res.ok) {
        router.refresh()
        return
      }
      const data = (await res.json()) as { error?: string }
      setError(data.error ?? 'Errore durante l\'aggiornamento')
    } catch {
      setError('Errore di rete. Riprova.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/backoffice/users/${userId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.refresh()
        return
      }
      const data = (await res.json()) as { error?: string }
      setError(data.error ?? 'Errore durante l\'eliminazione')
      setConfirmingDelete(false)
    } catch {
      setError('Errore di rete. Riprova.')
      setConfirmingDelete(false)
    } finally {
      setBusy(false)
    }
  }

  if (error) {
    return (
      <span className="text-xs text-red-600" title={userName}>
        {error}
      </span>
    )
  }

  if (confirmingDelete) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="text-xs text-gray-500">Eliminare?</span>
        <button
          onClick={() => void handleDelete()}
          disabled={busy}
          className="text-xs font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
        >
          {busy ? '…' : 'Sì'}
        </button>
        <button
          onClick={() => setConfirmingDelete(false)}
          className="text-xs font-medium text-gray-500 hover:text-gray-700"
        >
          No
        </button>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-4">
      <button
        onClick={() => void handleToggleDisabled()}
        disabled={busy}
        className={[
          'text-sm font-medium transition-colors disabled:opacity-50',
          disabled
            ? 'text-green-600 hover:text-green-500'
            : 'text-amber-600 hover:text-amber-500',
        ].join(' ')}
        aria-label={disabled ? `Riattiva ${userName}` : `Disabilita ${userName}`}
      >
        {busy ? '…' : disabled ? 'Riattiva' : 'Disabilita'}
      </button>
      <button
        onClick={() => setConfirmingDelete(true)}
        className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
        aria-label={`Elimina ${userName}`}
      >
        Elimina
      </button>
    </span>
  )
}
