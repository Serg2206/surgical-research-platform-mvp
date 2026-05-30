import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const JOURNAL_DIR = path.join(process.cwd(), 'content', 'journal')
const METADATA_DIR = path.join(process.cwd(), 'metadata', 'journal')

export interface JournalArticle {
  slug: string
  title: string
  date: string
  authors: string[]
  tags: string[]
  abstract: string
  content: string
  readingTime: number
  published: boolean
  featured: boolean
  doi: string | null
  citations: string[]
}

export interface JournalFrontmatter {
  title: string
  slug: string
  date: string
  authors: string[]
  tags: string[]
  abstract: string
}

export interface JournalMetadata {
  slug: string
  published: boolean
  featured: boolean
  readingTime: number
  doi: string | null
  citations: string[]
}

/**
 * Get all journal article slugs for static generation
 */
export function getJournalSlugs(): string[] {
  if (!fs.existsSync(JOURNAL_DIR)) return []
  
  return fs.readdirSync(JOURNAL_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(JOURNAL_DIR, file), 'utf-8'))
      return data.slug || file.replace(/\.md$/, '')
    })
}

/**
 * Get metadata for a journal article
 */
function getMetadata(fileSlug: string): JournalMetadata {
  const metaPath = path.join(METADATA_DIR, `${fileSlug}.json`)
  
  if (fs.existsSync(metaPath)) {
    return JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
  }
  
  // Default metadata
  return {
    slug: fileSlug,
    published: true,
    featured: false,
    readingTime: 5,
    doi: null,
    citations: [],
  }
}

/**
 * Find the markdown file by frontmatter slug.
 */
function findFileBySlug(slug: string): string | null {
  if (!fs.existsSync(JOURNAL_DIR)) return null
  
  const files = fs.readdirSync(JOURNAL_DIR).filter((f) => f.endsWith('.md'))
  
  // 1. Exact match on frontmatter slug
  for (const file of files) {
    const raw = fs.readFileSync(path.join(JOURNAL_DIR, file), 'utf-8')
    const { data } = matter(raw)
    if (data.slug === slug) return file
  }
  
  // 2. Exact match by filename
  const direct = `${slug}.md`
  if (files.includes(direct)) return direct
  
  return null
}

/**
 * Get a single journal article by slug
 */
export function getJournalArticle(slug: string): JournalArticle | null {
  const fileName = findFileBySlug(slug)
  if (!fileName) return null
  
  const filePath = path.join(JOURNAL_DIR, fileName)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const frontmatter = data as JournalFrontmatter
  
  const fileSlug = fileName.replace(/\.md$/, '')
  const meta = getMetadata(fileSlug)
  
  if (!meta.published) return null
  
  return {
    slug: frontmatter.slug || fileSlug,
    title: frontmatter.title,
    date: String(frontmatter.date),
    authors: frontmatter.authors || [],
    tags: frontmatter.tags || [],
    abstract: frontmatter.abstract || '',
    content,
    readingTime: meta.readingTime,
    published: meta.published,
    featured: meta.featured,
    doi: meta.doi,
    citations: meta.citations,
  }
}

/**
 * Get all published journal articles (for listing page)
 */
export function getAllJournalArticles(): JournalArticle[] {
  if (!fs.existsSync(JOURNAL_DIR)) return []
  
  const files = fs.readdirSync(JOURNAL_DIR).filter((f) => f.endsWith('.md'))
  
  const articles = files
    .map((file) => {
      const fileSlug = file.replace(/\.md$/, '')
      const raw = fs.readFileSync(path.join(JOURNAL_DIR, file), 'utf-8')
      const { data, content } = matter(raw)
      const frontmatter = data as JournalFrontmatter
      const meta = getMetadata(fileSlug)
      
      if (!meta.published) return null
      
      return {
        slug: frontmatter.slug || fileSlug,
        title: frontmatter.title,
        date: String(frontmatter.date),
        authors: frontmatter.authors || [],
        tags: frontmatter.tags || [],
        abstract: frontmatter.abstract || '',
        content,
        readingTime: meta.readingTime,
        published: meta.published,
        featured: meta.featured,
        doi: meta.doi,
        citations: meta.citations,
      } as JournalArticle
    })
    .filter(Boolean) as JournalArticle[]
  
  // Sort by date descending
  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  return articles
}
