
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cleanOptionalText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, maxLength) : null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
    const specialization = cleanOptionalText(body.specialization, 120)
    const institution = cleanOptionalText(body.institution, 160)

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, пароль и полное имя обязательны' },
        { status: 400 }
      )
    }

    if (!emailPattern.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: 'Некорректный email' },
        { status: 400 }
      )
    }

    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { error: 'Пароль должен содержать от 8 до 128 символов' },
        { status: 400 }
      )
    }

    if (fullName.length < 2 || fullName.length > 120) {
      return NextResponse.json(
        { error: 'Полное имя должно содержать от 2 до 120 символов' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        name: fullName,
        role: UserRole.STUDENT,
        specialization,
        institution,
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
        message: 'Пользователь создан',
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
