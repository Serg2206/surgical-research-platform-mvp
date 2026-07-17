import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'surgical-research-platform',
    timestamp: new Date().toISOString(),
  })
}
