import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Accedi',
}

// LoginForm reads searchParams via useSearchParams(), which requires a Suspense
// boundary to avoid a build-time bail-out to client-side rendering.
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
