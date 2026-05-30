import type { Metadata } from 'next'

// ─── Constants (env-aware with safe fallbacks) ───────────────
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://proffssv.site'

const SITE_NAME = 'SSVproff Surgical Research Platform'

const TWITTER_HANDLE =
  process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@SaleemHamilah'

const DEFAULT_LOCALE = 'ru_RU'

/** Default OG image — used when no article-specific image exists */
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

const PUBLISHER = {
  name: 'Витебский государственный медицинский университет',
  department: 'Кафедра общей хирургии',
  url: SITE_URL,
}

// ─── Types ───────────────────────────────────────────────────

export interface JournalMetaInput {
  /** Article title */
  title: string
  /** URL slug */
  slug: string
  /** ISO date string (YYYY-MM-DD) */
  date: string
  /** Author names */
  authors: string[]
  /** Tag / keyword list */
  tags: string[]
  /** Short abstract / description */
  abstract: string
  /** Digital Object Identifier (optional) */
  doi?: string | null
  /** Reading time in minutes */
  readingTime?: number
  /** Article-specific OG image URL (optional, falls back to default) */
  ogImage?: string | null
}

export interface JsonLdArticle {
  '@context': string
  '@type': string
  headline: string
  author: { '@type': string; name: string }[]
  datePublished: string
  abstract: string
  keywords: string[]
  publisher: {
    '@type': string
    name: string
    url: string
  }
  mainEntityOfPage: {
    '@type': string
    '@id': string
  }
  inLanguage: string
  isAccessibleForFree: boolean
  image?: string
  wordCount?: number
}

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Resolve the OG image URL.
 * If `imageUrl` is a relative path, prepend SITE_URL.
 * Falls back to the default OG image.
 */
function resolveOgImage(imageUrl?: string | null): string {
  if (!imageUrl) return DEFAULT_OG_IMAGE

  // Already absolute
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  // Relative → absolute
  return `${SITE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
}

// ─── optimizeSlug ────────────────────────────────────────────

/**
 * Trim a slug to `maxLength` characters on a word (hyphen) boundary.
 *
 * Examples:
 *   optimizeSlug('some-very-long-slug-that-exceeds-sixty-characters-limit-here', 40)
 *   → 'some-very-long-slug-that-exceeds'
 */
export function optimizeSlug(slug: string, maxLength = 60): string {
  if (slug.length <= maxLength) return slug

  const trimmed = slug.slice(0, maxLength)
  const lastHyphen = trimmed.lastIndexOf('-')

  if (lastHyphen > maxLength * 0.4) {
    return trimmed.slice(0, lastHyphen)
  }

  return trimmed
}

// ─── generateJournalMeta ────────────────────────────────────

/**
 * Build full Next.js 14 `Metadata` for a journal article page.
 * Reads SITE_URL / TWITTER_HANDLE from env (set in .env or Vercel Dashboard).
 */
export function generateJournalMeta(data: JournalMetaInput): Metadata {
  const canonicalUrl = `${SITE_URL}/journal/${data.slug}`
  const ogImageUrl = resolveOgImage(data.ogImage)

  const description =
    data.abstract.length > 160
      ? data.abstract.slice(0, 157) + '...'
      : data.abstract

  return {
    title: data.title,
    description,
    keywords: data.tags,
    authors: data.authors.map((name) => ({ name })),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: data.title,
      description,
      type: 'article',
      locale: DEFAULT_LOCALE,
      url: canonicalUrl,
      siteName: SITE_NAME,
      publishedTime: data.date,
      authors: data.authors,
      tags: data.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: data.title,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
  }
}

// ─── generateArticleJsonLd ──────────────────────────────────

/**
 * Build a JSON-LD structured data object for schema.org MedicalScholarlyArticle.
 */
export function generateArticleJsonLd(data: JournalMetaInput): JsonLdArticle {
  const canonicalUrl = `${SITE_URL}/journal/${data.slug}`
  const ogImageUrl = resolveOgImage(data.ogImage)

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalScholarlyArticle',
    headline: data.title,
    author: data.authors.map((name) => ({
      '@type': 'Person',
      name,
    })),
    datePublished: data.date,
    abstract: data.abstract,
    keywords: data.tags,
    image: ogImageUrl,
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER.name,
      url: PUBLISHER.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    inLanguage: 'ru',
    isAccessibleForFree: true,
    ...(data.readingTime ? { wordCount: data.readingTime * 200 } : {}),
  }
}

// ─── Exports ─────────────────────────────────────────────────
export { SITE_URL, SITE_NAME, PUBLISHER, DEFAULT_OG_IMAGE }
