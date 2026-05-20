'use client'

import { useEffect } from 'react'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * App-level error boundary for the App Router.
 *
 * Catches unexpected runtime errors thrown during rendering of any nested
 * route segment. Renders inside the root layout so the site header and
 * footer remain visible. Displays a friendly Italian-language message with a
 * retry button that calls Next.js's built-in reset() to re-render the segment.
 */
export default function AppError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl font-bold text-red-500">500</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900">
        Si è verificato un errore imprevisto
      </h1>
      <p className="mt-2 text-gray-600">
        Qualcosa è andato storto. Prova a ricaricare la pagina o torna alla home.
      </p>
      {error.digest && (
        <p className="mt-1 font-mono text-xs text-gray-400">Codice: {error.digest}</p>
      )}
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="rounded-md bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
        >
          Riprova
        </button>
        <a
          href="/"
          className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        >
          Torna alla home
        </a>
      </div>
    </div>
  )
}
