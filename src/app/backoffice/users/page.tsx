import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { UserActions } from '@/components/backoffice'

export const metadata: Metadata = { title: 'Gestione utenti' }

// Always fetch fresh — user list is admin-only and changes must be visible immediately.
export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const session = await getServerSession(authOptions)
  if (!session) return null

  // Only admins may access user management.
  if (session.user.role !== 'ADMIN') {
    redirect('/backoffice/dashboard')
  }

  const users = await prisma.user.findMany({
    where: { role: 'CO_EDITOR' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      disabled: true,
      createdAt: true,
      _count: { select: { articles: true } },
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utenti</h1>
          <p className="mt-1 text-sm text-gray-500">Co-editor registrati nel sistema</p>
        </div>
        <Link
          href="/backoffice/users/new"
          className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuovo co-editor
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {users.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-500">Nessun co-editor trovato.</p>
            <Link
              href="/backoffice/users/new"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-600"
            >
              Crea il primo co-editor
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Utente
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Stato
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Articoli
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Creato il
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Azioni</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name ?? '—'}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-400">{user.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={[
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          user.disabled
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700',
                        ].join(' ')}
                      >
                        {user.disabled ? 'Disabilitato' : 'Attivo'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {user._count.articles}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {user.createdAt.toLocaleDateString('it-IT')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <UserActions
                        userId={user.id}
                        userName={user.name ?? user.email}
                        disabled={user.disabled}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
