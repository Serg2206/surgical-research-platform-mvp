import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { UserRole } from '@prisma/client'

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }))
vi.mock('@/lib/auth', () => ({ authOptions: {} }))
vi.mock('@/lib/db', () => ({
  prisma: {
    fHIRResource: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({ id: 'r1' }),
    },
  },
}))

import { getServerSession } from 'next-auth'
import { GET, POST } from './route'

const mockedGetServerSession = vi.mocked(getServerSession)

function sessionWith(role: UserRole | null) {
  if (!role) return null
  return { user: { id: 'u1', role } } as any
}

describe('/api/fhir/resources RBAC', () => {
  beforeEach(() => {
    mockedGetServerSession.mockReset()
  })

  it('GET rejects unauthenticated requests', async () => {
    mockedGetServerSession.mockResolvedValue(sessionWith(null))
    const res = await GET(new NextRequest('http://localhost/api/fhir/resources'))
    expect(res.status).toBe(401)
  })

  it('GET rejects a plain USER/STUDENT role', async () => {
    mockedGetServerSession.mockResolvedValue(sessionWith(UserRole.STUDENT))
    const res = await GET(new NextRequest('http://localhost/api/fhir/resources'))
    expect(res.status).toBe(401)
  })

  it('GET allows ADMIN', async () => {
    mockedGetServerSession.mockResolvedValue(sessionWith(UserRole.ADMIN))
    const res = await GET(new NextRequest('http://localhost/api/fhir/resources'))
    expect(res.status).toBe(200)
  })

  it('GET allows TEACHER', async () => {
    mockedGetServerSession.mockResolvedValue(sessionWith(UserRole.TEACHER))
    const res = await GET(new NextRequest('http://localhost/api/fhir/resources'))
    expect(res.status).toBe(200)
  })

  it('POST rejects a non-clinical role even with a valid body', async () => {
    mockedGetServerSession.mockResolvedValue(sessionWith(UserRole.STUDENT))
    const res = await POST(
      new NextRequest('http://localhost/api/fhir/resources', {
        method: 'POST',
        body: JSON.stringify({ resourceType: 'Patient', data: { status: 'active' } }),
      })
    )
    expect(res.status).toBe(401)
  })
})
