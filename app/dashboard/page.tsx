
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Clock, 
  Star,
  PlayCircle,
  Plus,
  ArrowRight,
  BarChart3,
  Users,
  Database,
  MessageSquare
} from 'lucide-react'
import { formatDate, getDifficultyLabel, getDifficultyColor } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Fetch dashboard data
  const [userStats, recentCourses, featuredArticles, recentProgress] = await Promise.all([
    // User statistics
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: {
          select: {
            enrollments: true,
            courses: true,
            articles: true,
            chatSessions: true,
          }
        }
      }
    }),

    // Recent courses
    prisma.course.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true, fullName: true } },
        category: { select: { name: true, color: true } },
        _count: { select: { enrollments: true, lessons: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 6
    }),

    // Featured articles
    prisma.article.findMany({
      where: { published: true, featured: true },
      include: {
        author: { select: { name: true, fullName: true } },
        category: { select: { name: true, color: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 4
    }),

    // User's recent progress
    prisma.progress.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          select: {
            title: true,
            slug: true,
            coverImage: true,
            difficulty: true
          }
        }
      },
      orderBy: { lastAccessedAt: 'desc' },
      take: 5
    })
  ])

  const quickStats = [
    {
      title: 'Мои курсы',
      value: userStats?._count?.enrollments || 0,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-100',
      href: '/courses'
    },
    {
      title: 'Создано курсов',
      value: userStats?._count?.courses || 0,
      icon: Plus,
      color: 'text-green-600 bg-green-100',
      href: '/courses/create',
      adminOnly: true
    },
    {
      title: 'Статьи',
      value: userStats?._count?.articles || 0,
      icon: FileText,
      color: 'text-purple-600 bg-purple-100',
      href: '/articles'
    },
    {
      title: 'AI Сессии',
      value: userStats?._count?.chatSessions || 0,
      icon: MessageSquare,
      color: 'text-orange-600 bg-orange-100',
      href: '/ai-search'
    }
  ]

  const isAdmin = session.user.role === 'ADMIN'
  const isTeacher = session.user.role === 'TEACHER' || isAdmin

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать, {session.user.name}!
          </h1>
          <p className="text-gray-600">
            {session.user.specialization 
              ? `Специализация: ${session.user.specialization}`
              : 'Продолжайте изучение хирургических дисциплин'
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats
            .filter(stat => !stat.adminOnly || isTeacher)
            .map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="mt-3 p-0 h-auto" asChild>
                  <Link href={stat.href}>
                    Перейти <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Progress */}
          {recentProgress.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Мой прогресс
                </CardTitle>
                <CardDescription>
                  Последние изученные курсы
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentProgress.map((progress) => (
                  <div key={progress.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <Link
                          href={`/courses/${progress.course.slug}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {progress.course.title}
                        </Link>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getDifficultyColor(progress.course.difficulty)}>
                            {getDifficultyLabel(progress.course.difficulty)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Прогресс: {progress.completedLessons} из {progress.totalLessons}</span>
                        <span>{Math.round(progress.progressPercentage)}%</span>
                      </div>
                      <Progress value={progress.progressPercentage} className="h-2" />
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/courses">
                    Все мои курсы
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recent Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Новые курсы
              </CardTitle>
              <CardDescription>
                Последние добавленные курсы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCourses.slice(0, 4).map((course) => (
                <div key={course.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="font-medium text-gray-900 hover:text-blue-600 block truncate"
                    >
                      {course.title}
                    </Link>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {course.category.name}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {course._count.lessons} уроков
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/courses/${course.slug}`}>
                      <PlayCircle className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/courses">
                  Все курсы
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Рекомендуемые статьи
                </CardTitle>
                <CardDescription>
                  Избранные научные публикации
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredArticles.slice(0, 3).map((article) => (
                  <div key={article.id} className="border rounded-lg p-4">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="font-medium text-gray-900 hover:text-blue-600 block mb-2"
                    >
                      {article.title}
                    </Link>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.author.fullName || article.author.name}</span>
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/articles">
                    Все статьи
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
              <CardDescription>
                Основные функции платформы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/ai-search">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI Поиск и Чат
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/fhir">
                  <Database className="h-4 w-4 mr-2" />
                  FHIR Данные
                </Link>
              </Button>
              {isAdmin && (
                <>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/users">
                      <Users className="h-4 w-4 mr-2" />
                      Управление пользователями
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/analytics">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Аналитика
                    </Link>
                  </Button>
                </>
              )}
              {isTeacher && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/courses/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Создать курс
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
