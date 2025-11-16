
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
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Search,
  Filter,
  PlayCircle,
  GraduationCap
} from 'lucide-react'
import { getDifficultyLabel, getDifficultyColor, formatDuration, formatDate } from '@/lib/utils'

interface SearchParams {
  search?: string
  category?: string
  difficulty?: string
  page?: string
}

export default async function CoursesPage({ 
  searchParams 
}: { 
  searchParams: SearchParams 
}) {
  const search = searchParams?.search || ''
  const category = searchParams?.category || ''
  const difficulty = searchParams?.difficulty || ''
  const page = parseInt(searchParams?.page || '1')
  const limit = 12

  // Build where clause
  const where: any = { published: true }
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }
  
  if (category) {
    where.category = { slug: category }
  }
  
  if (difficulty) {
    where.difficulty = difficulty
  }

  // Fetch data
  const [courses, categories, totalCount] = await Promise.all([
    prisma.course.findMany({
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
            color: true,
            icon: true
          }
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.category.findMany({
      where: {
        courses: {
          some: {
            published: true
          }
        }
      },
      orderBy: { name: 'asc' }
    }),
    prisma.course.count({ where })
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Курсы по хирургии</h1>
          </div>
          <p className="text-gray-600">
            Изучайте хирургические дисциплины с экспертами в области медицины
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск курсов..."
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

              <Select defaultValue={difficulty || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Сложность" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Любая сложность</SelectItem>
                  <SelectItem value="BEGINNER">Начинающий</SelectItem>
                  <SelectItem value="INTERMEDIATE">Средний</SelectItem>
                  <SelectItem value="ADVANCED">Продвинутый</SelectItem>
                  <SelectItem value="EXPERT">Эксперт</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-blue-600 hover:bg-blue-700">
                <Filter className="h-4 w-4 mr-2" />
                Применить фильтры
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Найдено {totalCount} курс{totalCount === 1 ? '' : (totalCount < 5 ? 'а' : 'ов')}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Страница {page} из {totalPages}</span>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {courses.map((course) => (
              <Card key={course.id} className="group hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center">
                    {course.coverImage ? (
                      <Image
                        src={course.coverImage}
                        alt={course.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    ) : (
                      <BookOpen className="h-12 w-12 text-blue-400" />
                    )}
                  </div>
                  {course.featured && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Рекомендуемый
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <Badge className={getDifficultyColor(course.difficulty)}>
                      {getDifficultyLabel(course.difficulty)}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2">
                        {course.category.name}
                      </Badge>
                      <CardTitle className="line-clamp-2 text-lg">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">
                        {course.shortDescription || course.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <GraduationCap className="h-4 w-4" />
                        <span>{course.author.fullName || course.author.name}</span>
                      </div>
                      {course.duration && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(course.duration * 60)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <PlayCircle className="h-4 w-4" />
                        <span>{course._count.lessons} урок{course._count.lessons === 1 ? '' : (course._count.lessons < 5 ? 'а' : 'ов')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course._count.enrollments} студент{course._count.enrollments === 1 ? '' : (course._count.enrollments < 5 ? 'а' : 'ов')}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      asChild
                    >
                      <Link href={`/courses/${course.slug}`}>
                        Изучать курс
                        <PlayCircle className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Курсы не найдены
              </h3>
              <p className="text-gray-600 mb-4">
                Попробуйте изменить критерии поиска или фильтры
              </p>
              <Button variant="outline" asChild>
                <Link href="/courses">Сбросить фильтры</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            {page > 1 && (
              <Button variant="outline" asChild>
                <Link href={`/courses?page=${page - 1}&search=${search}&category=${category}&difficulty=${difficulty}`}>
                  Предыдущая
                </Link>
              </Button>
            )}
            
            <span className="px-4 py-2 text-sm text-gray-600">
              Страница {page} из {totalPages}
            </span>
            
            {page < totalPages && (
              <Button variant="outline" asChild>
                <Link href={`/courses?page=${page + 1}&search=${search}&category=${category}&difficulty=${difficulty}`}>
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
