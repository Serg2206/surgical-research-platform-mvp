import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Trim a slug to `maxLength` characters on a word (hyphen) boundary.
 * Mirrors lib/seo.ts optimizeSlug — duplicated here because
 * middleware runs on Edge Runtime and cannot import Node.js modules.
 */
function optimizeSlug(slug: string, maxLength = 60): string {
  if (slug.length <= maxLength) return slug

  const trimmed = slug.slice(0, maxLength)
  const lastHyphen = trimmed.lastIndexOf('-')

  if (lastHyphen > maxLength * 0.4) {
    return trimmed.slice(0, lastHyphen)
  }

  return trimmed
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only process /journal/* paths
  if (!pathname.startsWith('/journal/')) {
    return NextResponse.next()
  }

  // Extract the slug from the path
  const slug = pathname.replace('/journal/', '')

  // Skip if no slug (listing page) or already short enough
  if (!slug || slug.length <= 60) {
    return NextResponse.next()
  }

  // Optimize the slug
  const shortSlug = optimizeSlug(slug)

  // Only redirect if the slug actually changed
  if (shortSlug !== slug) {
    const url = request.nextUrl.clone()
    url.pathname = `/journal/${shortSlug}`

    // 301 Permanent Redirect — tells search engines the canonical is the short URL
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

// Matcher: only run middleware on journal article paths
export const config = {
  matcher: '/journal/:slug*',
}
