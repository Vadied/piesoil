import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Terra Bonifica',
    template: '%s | Terra Bonifica',
  },
  description:
    'Ricerca, sviluppo e divulgazione su tecniche innovative di bonifica e rigenerazione del suolo contaminato.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
