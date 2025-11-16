
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName, role, specialization, institution } = body

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with role validation
    const validRole = role && Object.values(UserRole).includes(role) ? role : UserRole.STUDENT

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        name: fullName,
        role: validRole,
        specialization: specialization || null,
        institution: institution || null,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        specialization: true,
        institution: true,
        createdAt: true
      }
    })

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
