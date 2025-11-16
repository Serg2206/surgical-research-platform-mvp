
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FileText, 
  Clock, 
  User, 
  Star,
  Search,
  Filter,
  Eye,
  Calendar
} from 'lucide-react'
import { formatDate, truncateText } from '@/lib/utils'

interface SearchParams {
  search?: string
  category?: string
  page?: string
}

export default async function ArticlesPage({ 
  searchParams 
}: { 
  searchParams: SearchParams 
}) {
  const search = searchParams?.search || ''
  const category = searchParams?.category || ''
  const page = parseInt(searchParams?.page || '1')
  const limit = 12

  // Build where clause
  const where: any = { published: true }
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ]
  }
  
  if (category) {
    where.category = { slug: category }
  }

  // Fetch data
  const [articles, categories, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
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
            slug: true,
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
      },
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.category.findMany({
      where: {
        articles: {
          some: {
            published: true
          }
        }
      },
      orderBy: { name: 'asc' }
    }),
    prisma.article.count({ where })
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Научные статьи</h1>
          </div>
          <p className="text-gray-600">
            База знаний с актуальными исследованиями и публикациями в области хирургии
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск статей..."
                  defaultValue={search}
                  className="pl-10"
                />
              </div>
              
              <Select defaultValue={category || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div></div> {/* Empty space */}

              <Button className="bg-green-600 hover:bg-green-700">
                <Filter className="h-4 w-4 mr-2" />
                Применить фильтры
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Найдено {totalCount} стат{totalCount === 1 ? 'ья' : (totalCount < 5 ? 'ьи' : 'ей')}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Страница {page} из {totalPages}</span>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="space-y-6 mb-8">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
                  {/* Article Image */}
                  <div className="lg:col-span-1">
                    <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                      {article.coverImage ? (
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <FileText className="h-12 w-12 text-green-400" />
                      )}
                    </div>
                    {article.featured && (
                      <div className="mt-2">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Рекомендуемая
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="lg:col-span-3 space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
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
                      
                      <Link href={`/articles/${article.slug}`}>
                        <h2 className="text-xl font-bold text-gray-900 hover:text-green-600 transition-colors mb-3 line-clamp-2">
                          {article.title}
                        </h2>
                      </Link>
                      
                      <p className="text-gray-600 line-clamp-3">
                        {article.excerpt || truncateText(article.content, 200)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
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

                      <Button variant="outline" asChild>
                        <Link href={`/articles/${article.slug}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Читать
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Статьи не найдены
              </h3>
              <p className="text-gray-600 mb-4">
                Попробуйте изменить критерии поиска или фильтры
              </p>
              <Button variant="outline" asChild>
                <Link href="/articles">Сбросить фильтры</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            {page > 1 && (
              <Button variant="outline" asChild>
                <Link href={`/articles?page=${page - 1}&search=${search}&category=${category}`}>
                  Предыдущая
                </Link>
              </Button>
            )}
            
            <span className="px-4 py-2 text-sm text-gray-600">
              Страница {page} из {totalPages}
            </span>
            
            {page < totalPages && (
              <Button variant="outline" asChild>
                <Link href={`/articles?page=${page + 1}&search=${search}&category=${category}`}>
                  Следующая
                </Link>
              </Button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
