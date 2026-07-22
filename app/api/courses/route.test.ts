import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { UserRole } from '@prisma/client'

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }))
vi.mock('@/lib/auth', () => ({ authOptions: {} }))
vi.mock('@/lib/db', () => ({
  prisma: {
    course: {
      create: vi.fn().mockResolvedValue({ id: 'c1' }),
    },
  },
}))

import { getServerSession } from 'next-auth'
import { POST } from './route'

const mockedGetServerSession = vi.mocked(getServerSession)

function sessionWith(role: UserRole | null) {
  if (!role) return null
  return { user: { id: 'u1', role } } as any
}

const validBody = {
  title: 'Test course',
  description: 'A description',
  categoryId: 'cat1',
}

describe('/api/courses POST RBAC', () => {
  beforeEach(() => {
    mockedGetServerSession.mockReset()
  })

  it('rejects unauthenticated requests', async () => {
    mockedGetServerSession.mockResolvedValue(sessionWith(null))
    const res = await POST(
      new NextRequest('http://localhost/api/courses', {
        method: 'POST',
        body: JSON.stringify(validBody),
      })
    )
    expect(res.status).toBe(401)
  })

  it('rejects a non-ADMIN role (e.g. TEACHER)', async () => {
    mockedGetServerSession.mockResolvedValue(sessionWith(UserRole.TEACHER))
    const res = await POST(
      new NextRequest('http://localhost/api/courses', {
        method: 'POST',
        body: JSON.stringify(validBody),
      })
    )
    expect(res.status).toBe(401)
  })

  it('allows ADMIN with a valid body', async () => {
    mockedGetServerSession.mockResolvedValue(sessionWith(UserRole.ADMIN))
    const res = await POST(
      new NextRequest('http://localhost/api/courses', {
        method: 'POST',
        body: JSON.stringify(validBody),
      })
    )
    expect(res.status).toBe(201)
  })
})
