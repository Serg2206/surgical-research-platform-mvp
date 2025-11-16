
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const resourceType = searchParams.get('resourceType')

    const where: any = {}
    if (resourceType) {
      where.resourceType = resourceType
    }

    const resources = await prisma.fHIRResource.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            fullName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching FHIR resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { resourceType, data } = body

    if (!resourceType || !data) {
      return NextResponse.json(
        { error: 'ResourceType and data are required' },
        { status: 400 }
      )
    }

    // Validate that data is a valid object
    if (typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Data must be a valid JSON object' },
        { status: 400 }
      )
    }

    // Extract FHIR ID from data if available
    const fhirId = data.id || null
    const status = data.status || null

    const resource = await prisma.fHIRResource.create({
      data: {
        resourceType,
        fhirId,
        data,
        status,
        authorId: session.user.id,
        syncedAt: new Date()
      },
      include: {
        author: {
          select: {
            name: true,
            fullName: true
          }
        }
      }
    })

    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    console.error('Error creating FHIR resource:', error)
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    )
  }
}
