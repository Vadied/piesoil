import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserForm } from '@/components/backoffice'

export const metadata: Metadata = { title: 'Nuovo co-editor' }

export default async function NewUserPage() {
  const session = await getServerSession(authOptions)
  if (!session) return null

  // Only admins may create accounts.
  if (session.user.role !== 'ADMIN') {
    redirect('/backoffice/dashboard')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/backoffice/users"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
          aria-label="Torna agli utenti"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Utenti
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-900">Nuovo co-editor</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crea co-editor</h1>
        <p className="mt-1 text-sm text-gray-500">
          Il nuovo account avrà accesso al backoffice con il ruolo Co-editor.
        </p>
      </div>

      {/* Form card */}
      <div className="max-w-lg rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <UserForm />
      </div>
    </div>
  )
}
