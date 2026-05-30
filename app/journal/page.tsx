import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Clock, Users, Calendar, ArrowRight } from 'lucide-react'
import { getAllJournalArticles } from '@/lib/journal'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Научный журнал — SSVproff',
  description: 'Научные статьи по хирургии, онкохирургии и AI в медицине от проф. Сушкова С.В.',
}

export default function JournalPage() {
  const articles = getAllJournalArticles()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Научный журнал</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Научные статьи и исследования в области хирургии, онкохирургии и применения 
            искусственного интеллекта в медицине.
          </p>
        </div>

        {/* Articles */}
        {articles.length > 0 ? (
          <div className="space-y-6">
            {articles.map((article) => (
              <Card key={article.slug} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge className="bg-green-100 text-green-800">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Статья
                    </Badge>
                    {article.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">⭐ Рекомендуемая</Badge>
                    )}
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>

                  <Link href={`/journal/${article.slug}`}>
                    <CardTitle className="text-xl font-bold text-gray-900 hover:text-green-600 transition-colors cursor-pointer">
                      {article.title}
                    </CardTitle>
                  </Link>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{article.authors.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(article.date).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readingTime} мин</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.abstract}</p>
                  <Button variant="outline" asChild>
                    <Link href={`/journal/${article.slug}`}>
                      Читать статью
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Статьи скоро появятся
              </h3>
              <p className="text-gray-600">
                Научные публикации находятся в процессе подготовки
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}
