import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Backoffice',
    template: '%s | Backoffice',
  },
}

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
