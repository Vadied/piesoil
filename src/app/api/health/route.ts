import { NextResponse } from 'next/server'

// Cloud Run liveness probe endpoint.
// Returns 200 as long as the Node.js process is reachable; no DB call is made
// so it stays cheap and never blocks on database connectivity issues.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    { status: 200 },
  )
}
