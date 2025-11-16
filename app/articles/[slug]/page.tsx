
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Clock, User, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: {
      author: {
        select: {
          name: true,
          fullName: true,
          specialization: true
        }
      },
      category: {
        select: {
          name: true,
          color: true
        }
      },
      tags: {
        include: {
          tag: {
            select: {
              name: true,
              slug: true,
              color: true
            }
          }
        }
      }
    }
  })

  if (!article || !article.published) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary">
                {article.category.name}
              </Badge>
              {article.tags.map((articleTag) => (
                <Badge 
                  key={articleTag.tag.slug} 
                  variant="outline"
                  style={{ 
                    borderColor: articleTag.tag.color || undefined,
                    color: articleTag.tag.color || undefined 
                  }}
                >
                  {articleTag.tag.name}
                </Badge>
              ))}
            </div>
            
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </CardTitle>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{article.author.fullName || article.author.name}</span>
              </div>
              {article.readTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime} мин чтения</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="prose max-w-none">
              {article.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return <h1 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>
                }
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{paragraph.slice(3)}</h2>
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{paragraph.slice(4)}</h3>
                }
                if (paragraph.trim() === '') {
                  return <br key={index} />
                }
                return <p key={index} className="mb-4">{paragraph}</p>
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
