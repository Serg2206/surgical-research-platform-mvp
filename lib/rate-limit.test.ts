import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { isRateLimited } from './rate-limit'

describe('isRateLimited', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows requests up to the limit', () => {
    const key = 'user-a'
    expect(isRateLimited(key, 3, 60_000)).toBe(false)
    expect(isRateLimited(key, 3, 60_000)).toBe(false)
    expect(isRateLimited(key, 3, 60_000)).toBe(false)
  })

  it('blocks the request that exceeds the limit', () => {
    const key = 'user-b'
    isRateLimited(key, 2, 60_000)
    isRateLimited(key, 2, 60_000)
    expect(isRateLimited(key, 2, 60_000)).toBe(true)
  })

  it('tracks distinct keys independently', () => {
    isRateLimited('user-c', 1, 60_000)
    expect(isRateLimited('user-c', 1, 60_000)).toBe(true)
    expect(isRateLimited('user-d', 1, 60_000)).toBe(false)
  })

  it('allows requests again once the window has elapsed', () => {
    const key = 'user-e'
    isRateLimited(key, 1, 60_000)
    expect(isRateLimited(key, 1, 60_000)).toBe(true)

    vi.setSystemTime(60_001)

    expect(isRateLimited(key, 1, 60_000)).toBe(false)
  })
})
