
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

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
    const { query, context = 'search' } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Call LLM API for intelligent search
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `Вы помощник по поиску в медицинской образовательной платформе. 
            Анализируйте запрос пользователя и предоставляйте релевантные результаты поиска 
            по курсам хирургии, медицинским статьям и образовательным материалам.
            
            Отвечайте на русском языке и предоставляйте структурированную информацию.
            Если запрос связан с медицинскими процедурами, диагностикой или лечением, 
            предоставьте образовательную информацию, но напомните о необходимости 
            консультации с медицинскими специалистами.`
          },
          {
            role: 'user',
            content: `Поисковый запрос: "${query}"\nКонтекст: ${context}\n\nПожалуйста, помогите найти релевантную информацию и предоставьте рекомендации по обучению.`
          }
        ],
        stream: true,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    // Create a ReadableStream for streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()
        
        try {
          while (true) {
            const { done, value } = await reader?.read() ?? { done: true, value: undefined }
            if (done) break
            
            const chunk = decoder.decode(value)
            controller.enqueue(encoder.encode(chunk))
          }
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    // Also search in our database for relevant content
    const [courses, articles] = await Promise.all([
      prisma.course.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ]
        },
        include: {
          category: { select: { name: true } },
          author: { select: { name: true, fullName: true } }
        },
        take: 5
      }),
      prisma.article.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ]
        },
        include: {
          category: { select: { name: true } },
          author: { select: { name: true, fullName: true } }
        },
        take: 5
      })
    ])

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Search-Results': JSON.stringify({ courses, articles })
      },
    })

  } catch (error) {
    console.error('AI search error:', error)
    return NextResponse.json(
      { error: 'AI search failed' },
      { status: 500 }
    )
  }
}
