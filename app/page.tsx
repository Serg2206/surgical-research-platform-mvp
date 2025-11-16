
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Stethoscope, 
  BookOpen, 
  FileText, 
  Database, 
  MessageSquare, 
  Users,
  TrendingUp,
  Award,
  Zap,
  ArrowRight,
  Play
} from 'lucide-react'

const features = [
  {
    name: 'Курсы по хирургии',
    description: 'Структурированные курсы по различным хирургическим специальностям с видео-лекциями и интерактивными материалами',
    icon: BookOpen,
    color: 'text-blue-600 bg-blue-100',
    href: '/courses'
  },
  {
    name: 'Научные статьи',
    description: 'База знаний с актуальными исследованиями и публикациями в области хирургии',
    icon: FileText,
    color: 'text-green-600 bg-green-100',
    href: '/articles'
  },
  {
    name: 'FHIR Интеграция',
    description: 'Работа со стандартизированными медицинскими данными для исследований',
    icon: Database,
    color: 'text-purple-600 bg-purple-100',
    href: '/fhir'
  },
  {
    name: 'AI Поиск и Анализ',
    description: 'Интеллектуальный поиск и анализ медицинского контента с помощью ИИ',
    icon: MessageSquare,
    color: 'text-orange-600 bg-orange-100',
    href: '/ai-search'
  }
]

const stats = [
  { name: 'Активных курсов', value: '50+', icon: BookOpen },
  { name: 'Научных статей', value: '200+', icon: FileText },
  { name: 'Студентов', value: '1000+', icon: Users },
  { name: 'Экспертов', value: '25+', icon: Award },
]

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <header className="relative bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Stethoscope className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Surgical Research</h1>
                <p className="text-sm text-gray-600">Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Войти</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/auth/signup">Начать обучение</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                <Zap className="h-3 w-3 mr-1" />
                Powered by AI & FHIR
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Современная платформа для{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  хирургического образования
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Изучайте хирургию с использованием передовых технологий AI, работайте с FHIR данными 
                и получайте доступ к экспертным знаниям профессора Сергея Сушкова
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3" asChild>
                <Link href="/auth/signup">
                  <Play className="mr-2 h-5 w-5" />
                  Начать обучение
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
                <Link href="/courses">
                  Просмотреть курсы
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Доверяют профессионалы
            </h2>
            <p className="text-lg text-gray-600">
              Платформа для медицинского образования нового поколения
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Возможности платформы
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Комплексное решение для хирургического образования с интеграцией 
              современных технологий и стандартов
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <Card key={feature.name} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{feature.name}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="group-hover:text-blue-600" asChild>
                    <Link href={feature.href}>
                      Узнать больше
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Готовы начать обучение?
            </h2>
            <p className="text-xl text-blue-100">
              Присоединяйтесь к тысячам медицинских специалистов, которые используют 
              нашу платформу для профессионального развития
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
                asChild
              >
                <Link href="/auth/signup">
                  Создать аккаунт
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3"
                asChild
              >
                <Link href="/auth/signin">
                  У меня есть аккаунт
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="p-1 bg-blue-100 rounded-lg">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">Surgical Research Platform</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Разработано для профессора Сергея Сушкова
            </p>
            <div className="flex justify-center items-center text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              © 2024 MVP для хирургического образования и исследований
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
