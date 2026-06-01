
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import { 
  Stethoscope, 
  BookOpen, 
  FileText, 
  Database, 
  MessageSquare, 
  ShieldCheck,
  Award,
  Zap,
  ArrowRight,
  Play
} from 'lucide-react'

const features = [
  {
    name: 'Курсы по хирургии',
    description: 'Структурированные образовательные материалы по хирургии, клинической логике и тактике принятия решений',
    icon: BookOpen,
    color: 'text-blue-600 bg-blue-100',
    href: '/courses'
  },
  {
    name: 'Научные статьи',
    description: 'Публикации, обзоры и материалы для профессионального чтения без рекламного шума',
    icon: FileText,
    color: 'text-green-600 bg-green-100',
    href: '/articles'
  },
  {
    name: 'FHIR Интеграция',
    description: 'Инструменты для работы со стандартизированными медицинскими данными в исследовательских сценариях',
    icon: Database,
    color: 'text-teal-600 bg-teal-100',
    href: '/fhir'
  },
  {
    name: 'AI Поиск и Анализ',
    description: 'Поиск и анализ медицинского контента с ответственным использованием ИИ',
    icon: MessageSquare,
    color: 'text-amber-600 bg-amber-100',
    href: '/ai-search'
  }
]

const stats = [
  { name: 'Курсы и модули', value: 'Обучение', icon: BookOpen },
  { name: 'Статьи и обзоры', value: 'Знания', icon: FileText },
  { name: 'Клиническая ответственность', value: 'Позиция', icon: ShieldCheck },
  { name: 'Профессиональная экспертиза', value: 'Практика', icon: Award },
]

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="relative bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Stethoscope className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">SSVproff</div>
                <p className="text-sm text-gray-600">Образовательная платформа</p>
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
      <section className="relative py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                <Zap className="h-3 w-3 mr-1" />
                AI, FHIR и клиническое мышление
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                SSVproff
              </h1>
              <p className="text-2xl font-semibold text-gray-800 max-w-3xl mx-auto">
                Платформа для хирургического образования, научных материалов и профессионального развития.
              </p>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Курсы, статьи и инструменты для врачей, ординаторов и студентов, которым важны структура, клиническая логика и ответственность.
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
              Что уже собрано на платформе
            </h2>
            <p className="text-lg text-gray-600">
              Основные разделы SSVproff без неподтверждённых цифр и лишних обещаний
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
      <section className="py-20 bg-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Начните с курсов и статей
            </h2>
            <p className="text-xl text-blue-100">
              Материалы платформы предназначены для профессионального обучения и не заменяют клинические протоколы, очную помощь и решение лечащего врача.
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

      <Footer />
    </div>
  )
}
