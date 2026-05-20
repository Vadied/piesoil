'use client'

import { useEffect } from 'react'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Global error boundary — catches errors thrown inside the root layout itself.
 *
 * Because this replaces the root layout entirely, it must render its own
 * <html> and <body> shell. Displays a minimal Italian-language fallback page
 * with a retry button.
 */
export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="it">
      <body>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
            padding: '1.5rem',
            background: '#fff',
            color: '#111',
          }}
        >
          <p style={{ fontSize: '3rem', fontWeight: 700, color: '#ef4444', margin: 0 }}>500</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '1rem' }}>
            Errore critico dell&apos;applicazione
          </h1>
          <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
            Si è verificato un errore imprevisto. Prova a ricaricare la pagina.
          </p>
          {error.digest && (
            <p style={{ marginTop: '0.25rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#9ca3af' }}>
              Codice: {error.digest}
            </p>
          )}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button
              onClick={reset}
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '0.375rem',
                background: '#15803d',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Riprova
            </button>
            <a
              href="/"
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '0.375rem',
                background: '#fff',
                color: '#374151',
                border: '1px solid #d1d5db',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Torna alla home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
