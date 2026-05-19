import type { Session } from 'next-auth'
import { SignOutButton } from './SignOutButton'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Amministratore',
  CO_EDITOR: 'Co-editor',
}

interface TopBarProps {
  session: Session
}

export function TopBar({ session }: TopBarProps) {
  const user = session.user
  const roleLabel = ROLE_LABELS[user.role] ?? user.role

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      <div />

      <div className="flex items-center gap-4">
        {/* User info */}
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{user.name ?? user.email}</p>
          <p className="text-xs text-gray-500">{roleLabel}</p>
        </div>

        {/* Avatar */}
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name ?? 'Avatar'}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
            {(user.name ?? user.email ?? '?').charAt(0).toUpperCase()}
          </div>
        )}

        <SignOutButton />
      </div>
    </header>
  )
}
