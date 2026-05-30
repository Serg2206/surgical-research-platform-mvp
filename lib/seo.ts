import type { Metadata } from 'next'

// ─── Constants ───────────────────────────────────────────────
const SITE_URL = 'https://proffssv.site'
const SITE_NAME = 'SSVproff Surgical Research Platform'
const TWITTER_HANDLE = '@SaleemHamilah'
const DEFAULT_LOCALE = 'ru_RU'

const PUBLISHER = {
  name: 'Витебский государственный медицинский университет',
  department: 'Кафедра общей хирургии',
  url: SITE_URL,
}

// ─── Types ───────────────────────────────────────────────────

export interface JournalMetaInput {
  /** Article title */
  title: string
  /** URL slug (will be optimized if too long) */
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
  wordCount?: number
}

// ─── optimizeSlug ────────────────────────────────────────────

/**
 * Trim a slug to `maxLength` characters on a word (hyphen) boundary.
 *
 * Examples:
 *   optimizeSlug('sepsis-in-surgery-pathophysiology-contemporary-management-an', 40)
 *   → 'sepsis-in-surgery-pathophysiology'
 */
export function optimizeSlug(slug: string, maxLength = 60): string {
  if (slug.length <= maxLength) return slug

  const trimmed = slug.slice(0, maxLength)
  const lastHyphen = trimmed.lastIndexOf('-')

  // If there's a reasonable hyphen boundary, cut there
  if (lastHyphen > maxLength * 0.4) {
    return trimmed.slice(0, lastHyphen)
  }

  return trimmed
}

// ─── generateJournalMeta ────────────────────────────────────

/**
 * Build full Next.js 14 `Metadata` for a journal article page.
 * Includes title, description, Open Graph, Twitter Card, canonical URL.
 */
export function generateJournalMeta(data: JournalMetaInput): Metadata {
  const canonicalSlug = optimizeSlug(data.slug)
  const canonicalUrl = `${SITE_URL}/journal/${canonicalSlug}`

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
          url: `${SITE_URL}/og-image.png`,
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
      images: [`${SITE_URL}/og-image.png`],
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
  const canonicalSlug = optimizeSlug(data.slug)
  const canonicalUrl = `${SITE_URL}/journal/${canonicalSlug}`

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
    ...(data.readingTime
      ? { wordCount: data.readingTime * 200 }
      : {}),
  }
}

// ─── Exports ─────────────────────────────────────────────────
export { SITE_URL, SITE_NAME, PUBLISHER }
