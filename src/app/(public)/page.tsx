import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">Home</h1>
    </div>
  )
}
