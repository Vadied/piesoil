'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Form for creating a new co-editor account.
 * POSTs to /api/backoffice/users and redirects to /backoffice/users on success.
 */
export function UserForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/backoffice/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      })

      const data = (await res.json()) as { error?: string }

      if (res.ok) {
        router.push('/backoffice/users')
        router.refresh()
        return
      }

      setError(data.error ?? 'Si è verificato un errore. Riprova.')
    } catch {
      setError('Errore di rete. Riprova.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          placeholder="Mario Rossi"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          placeholder="mario@esempio.it"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password iniziale
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          placeholder="Minimo 8 caratteri"
        />
        <p className="mt-1 text-xs text-gray-500">
          La password viene cifrata prima di essere salvata. L'utente potrà cambiarla al primo accesso.
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-600 disabled:opacity-60"
        >
          {submitting ? 'Creazione…' : 'Crea account'}
        </button>
      </div>
    </form>
  )
}
