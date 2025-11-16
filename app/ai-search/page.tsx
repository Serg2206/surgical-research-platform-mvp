
import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ClientAISearch } from '@/components/pages/client-ai-search'
import { Sparkles, Loader2 } from 'lucide-react'

function AISearchFallback() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="h-[600px] flex items-center justify-center bg-white rounded-lg border">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Загрузка AI поиска...</p>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="h-32 bg-white rounded-lg border flex items-center justify-center">
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default function AISearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AI Поиск и Анализ</h1>
          </div>
          <p className="text-gray-600">
            Используйте искусственный интеллект для поиска и анализа медицинского контента
          </p>
        </div>

        <Suspense fallback={<AISearchFallback />}>
          <ClientAISearch />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
