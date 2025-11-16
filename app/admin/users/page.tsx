
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, ShieldCheck } from 'lucide-react'

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Управление пользователями</h1>
            <Badge className="bg-orange-100 text-orange-800">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Только для администраторов
            </Badge>
          </div>
          <p className="text-gray-600">
            Управление пользователями и их ролями в системе
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Функциональность в разработке</CardTitle>
            <CardDescription>
              Данная страница находится в разработке и будет доступна в полной версии платформы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Управление пользователями
              </h3>
              <p className="text-gray-600 mb-4">
                В полной версии здесь будут доступны функции управления пользователями, 
                назначения ролей и модерации контента
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
