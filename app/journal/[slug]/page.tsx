import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, Calendar, ArrowLeft, BookOpen, ExternalLink } from 'lucide-react'
import { getJournalArticle, getJournalSlugs } from '@/lib/journal'
import { renderMarkdown } from '@/lib/markdown'
import { generateJournalMeta, generateArticleJsonLd } from '@/lib/seo'

interface JournalPageProps {
  params: {
    slug: string
  }
}

// ─── Static generation ───────────────────────────────────────
export async function generateStaticParams() {
  const slugs = getJournalSlugs()
  return slugs.map((slug) => ({ slug }))
}

// ─── SEO metadata (Open Graph, Twitter, canonical) ───────────
export async function generateMetadata({ params }: JournalPageProps): Promise<Metadata> {
  const article = getJournalArticle(params.slug)

  if (!article) {
    return {
      title: 'Статья не найдена',
      description: 'Запрашиваемая статья не найдена в журнале.',
      robots: { index: false, follow: false },
    }
  }

  return generateJournalMeta({
    title: article.title,
    slug: article.slug,
    date: article.date,
    authors: article.authors ?? [],
    tags: article.tags ?? [],
    abstract: article.abstract ?? '',
    doi: article.doi ?? null,
    readingTime: article.readingTime ?? 5,
  })
}

// ─── Page component ─────────────────────────────────────────
export default function JournalArticlePage({ params }: JournalPageProps) {
  const article = getJournalArticle(params.slug)

  if (!article) {
    notFound()
  }

  // Safe defaults for rendering
  const authors = article.authors ?? []
  const tags = article.tags ?? []
  const abstract = article.abstract ?? ''
  const readingTime = article.readingTime ?? 5
  const date = article.date ?? new Date().toISOString().slice(0, 10)

  const contentHtml = renderMarkdown(article.content ?? '')

  // Build JSON-LD structured data
  const jsonLd = generateArticleJsonLd({
    title: article.title,
    slug: article.slug,
    date,
    authors,
    tags,
    abstract,
    doi: article.doi ?? null,
    readingTime,
  })

  return (
    <>
      {/* JSON-LD structured data — placed in <head> via Next.js App Router */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back link */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/journal" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад к журналу
              </Link>
            </Button>
          </div>

          {/* Article card */}
          <Card>
            <CardHeader className="pb-4">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-green-100 text-green-800">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Научная статья
                </Badge>
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
                {article.title}
              </CardTitle>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {authors.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{authors.join(', ')}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(date).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} мин чтения</span>
                </div>
              </div>

              {/* DOI */}
              {article.doi && (
                <div className="mt-3 text-sm">
                  <span className="text-gray-500">DOI: </span>
                  <a
                    href={`https://doi.org/${article.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    {article.doi}
                    <ExternalLink className="h-3 w-3 inline ml-1" />
                  </a>
                </div>
              )}
            </CardHeader>

            {/* Abstract */}
            {abstract && (
              <div className="px-6 pb-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <h4 className="text-sm font-semibold text-green-800 mb-1">Аннотация</h4>
                  <p className="text-sm text-green-700 leading-relaxed">{abstract}</p>
                </div>
              </div>
            )}

            {/* Content */}
            <CardContent>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </CardContent>
          </Card>

          {/* Citation block */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Цитировать:</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded font-mono break-all">
                {authors.join(', ')}. {article.title}.{' '}
                <em>SSVproff Journal</em>. {new Date(date).getFullYear()}.
                {article.doi ? ` DOI: ${article.doi}` : ''}
              </p>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  )
}
