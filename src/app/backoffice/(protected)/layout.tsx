// This route-group layout is intentionally a no-op.
// The backoffice auth shell and session check live in
// src/app/backoffice/layout.tsx (conditional rendering based on session).
export default function ProtectedGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
