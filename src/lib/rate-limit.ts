/**
 * In-process sliding-window rate limiter.
 *
 * Cloud Run note: each instance maintains its own in-memory store.
 * Horizontal scaling means a determined attacker can bypass per-instance
 * limits by hitting different instances. This is the accepted trade-off for
 * a stateless, dependency-free approach. For stronger guarantees, replace
 * the Map with a shared store (e.g. Redis / Memorystore).
 *
 * Default policy: 10 attempts per IP within a 15-minute window.
 */

type WindowEntry = { timestamps: number[] }

const store = new Map<string, WindowEntry>()

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 10

// Periodically sweep stale entries so the Map does not grow indefinitely in
// long-running processes. Entries are considered stale when all their
// timestamps have fallen outside the window.
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    const fresh = entry.timestamps.filter((t) => now - t < WINDOW_MS)
    if (fresh.length === 0) {
      store.delete(key)
    } else {
      entry.timestamps = fresh
    }
  }
}, 5 * 60 * 1000) // run every 5 minutes

/**
 * Records a request attempt for the given key and returns whether it is
 * allowed (true) or rate-limited (false).
 *
 * @param key - Typically the client IP address.
 */
export function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const entry = store.get(key) ?? { timestamps: [] }

  // Remove timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS)

  if (entry.timestamps.length >= MAX_REQUESTS) {
    store.set(key, entry)
    return false
  }

  entry.timestamps.push(now)
  store.set(key, entry)
  return true
}

/**
 * Extracts the best available client IP from a NextRequest-compatible
 * headers object. Cloud Run places the real client IP in `x-forwarded-for`.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; the leftmost is the
    // original client when the proxy is trusted.
    return forwarded.split(',')[0].trim()
  }
  return headers.get('x-real-ip') ?? 'unknown'
}
