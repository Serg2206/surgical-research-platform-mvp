
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Clock, User, PlayCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { getDifficultyLabel, getDifficultyColor, formatDuration } from '@/lib/utils'

interface CoursePageProps {
  params: {
    slug: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await prisma.course.findUnique({
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
      lessons: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          duration: true,
          order: true,
          published: true
        }
      },
      _count: {
        select: {
          enrollments: true
        }
      }
    }
  })

  if (!course || !course.published) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-3">
                      {course.category.name}
                    </Badge>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                      {course.title}
                    </h1>
                    <p className="text-gray-600 text-lg mb-4">
                      {course.shortDescription || course.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{course.author.fullName || course.author.name}</span>
                      </div>
                      {course.duration && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(course.duration * 60)}</span>
                        </div>
                      )}
                      <Badge className={getDifficultyColor(course.difficulty)}>
                        {getDifficultyLabel(course.difficulty)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <h3>Описание курса</h3>
                  <p>{course.description}</p>
                  
                  {course.learningObjectives && course.learningObjectives.length > 0 && (
                    <>
                      <h3>Цели обучения</h3>
                      <ul>
                        {course.learningObjectives.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {course.prerequisites && (
                    <>
                      <h3>Требования</h3>
                      <p>{course.prerequisites}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Записаться на курс</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {course.price === 0 ? 'Бесплатно' : `₽${course.price}`}
                    </div>
                    <p className="text-sm text-gray-600">
                      {course._count.enrollments} студент{course._count.enrollments === 1 ? '' : (course._count.enrollments < 5 ? 'а' : 'ов')} записались
                    </p>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" disabled>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Начать обучение
                  </Button>
                  <p className="text-xs text-center text-gray-500">
                    Функция записи будет доступна в полной версии
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Содержание курса
                </CardTitle>
                <CardDescription>
                  {course.lessons.length} урок{course.lessons.length === 1 ? '' : (course.lessons.length < 5 ? 'а' : 'ов')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.lessons.map((lesson, index) => (
                    <div key={lesson.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {lesson.title}
                        </p>
                        {lesson.duration && (
                          <p className="text-xs text-gray-500">
                            {formatDuration(lesson.duration)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
