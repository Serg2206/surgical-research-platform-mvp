// In-memory sliding-window rate limiter. Per-instance only — resets on
// redeploy/restart and does not coordinate across multiple Vercel instances.
// Good enough to stop casual abuse of paid external APIs; swap for
// Upstash/Redis if the app scales to multiple concurrent instances.

const hits = new Map<string, number[]>()

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs)

  if (timestamps.length >= limit) {
    hits.set(key, timestamps)
    return true
  }

  timestamps.push(now)
  hits.set(key, timestamps)
  return false
}
