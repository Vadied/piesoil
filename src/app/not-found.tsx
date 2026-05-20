import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pagina non trovata',
  description: 'La pagina che stai cercando non esiste o è stata spostata.',
}

/**
 * Custom 404 page rendered whenever Next.js cannot find a matching route or
 * when notFound() is called from a Server Component.
 *
 * Renders inside app/layout.tsx (root layout). The public header and footer
 * are only added by app/(public)/layout.tsx, so this page appears without
 * site navigation — which is intentional for a minimal error page.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-bold text-green-700">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900">Pagina non trovata</h1>
      <p className="mt-2 max-w-md text-gray-600">
        La pagina che stai cercando non esiste o è stata spostata. Controlla l&apos;indirizzo o
        torna alla home.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-green-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
      >
        Torna alla home
      </Link>
    </div>
  )
}
