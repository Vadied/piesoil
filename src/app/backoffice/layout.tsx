import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Sidebar } from '@/components/backoffice/Sidebar'
import { TopBar } from '@/components/backoffice/TopBar'

// Metadata only applies to routes that do NOT define their own.
// Protected routes override the title template via their own metadata export.
export const metadata: Metadata = {
  title: {
    default: 'Backoffice',
    template: '%s | Backoffice',
  },
}

// This layout wraps all /backoffice/* routes, including the login page.
// When the session is absent (login page, pre-auth), children are rendered
// without the shell so the login form appears unframed.
// When the session is present, the full sidebar + top-bar shell is rendered.
// Auth redirects for protected routes are handled by the middleware
// (src/middleware.ts) before this layout runs.
export default async function BackofficeLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar session={session} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
