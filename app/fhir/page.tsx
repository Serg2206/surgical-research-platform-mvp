
import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Database, 
  Plus, 
  User,
  Activity,
  Stethoscope,
  Loader2,
  Eye,
  FileText,
  Calendar,
  Zap
} from 'lucide-react'
import Link from 'next/link'

const FHIR_RESOURCE_TYPES = [
  { value: 'Patient', label: 'Пациент', icon: User },
  { value: 'Procedure', label: 'Процедура', icon: Stethoscope },
  { value: 'Observation', label: 'Наблюдение', icon: Activity },
]

const SAMPLE_DATA = {
  Patient: {
    resourceType: "Patient",
    id: "example-patient-1",
    name: [
      {
        use: "official",
        family: "Иванов",
        given: ["Иван", "Петрович"]
      }
    ],
    gender: "male",
    birthDate: "1980-05-15"
  },
  Procedure: {
    resourceType: "Procedure",
    id: "example-procedure-1",
    status: "completed",
    code: {
      text: "Лапароскопическая аппендэктомия"
    },
    subject: {
      reference: "Patient/example-patient-1",
      display: "Иванов Иван Петрович"
    }
  },
  Observation: {
    resourceType: "Observation",
    id: "example-observation-1",
    status: "final",
    code: {
      text: "Систолическое артериальное давление"
    },
    valueQuantity: {
      value: 120,
      unit: "mmHg"
    }
  }
}

function FHIRFallback() {
  return (
    <div className="space-y-6">
      <div className="h-64 bg-white rounded-lg border flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Загрузка FHIR интеграции...</p>
        </div>
      </div>
    </div>
  )
}

function FHIRContent() {
  return (
    <>
      <Tabs defaultValue="examples" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="examples">Примеры</TabsTrigger>
          <TabsTrigger value="about">О FHIR</TabsTrigger>
        </TabsList>

        <TabsContent value="examples">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Примеры FHIR ресурсов</CardTitle>
                <CardDescription>
                  Готовые примеры для изучения стандарта FHIR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {FHIR_RESOURCE_TYPES.map((type) => (
                    <Card key={type.value} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-center space-x-2">
                          <type.icon className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-lg">{type.label}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto max-h-32">
                          {JSON.stringify(SAMPLE_DATA[type.value as keyof typeof SAMPLE_DATA], null, 2)}
                        </pre>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full mt-3"
                          disabled
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Просмотр
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>О стандарте FHIR</CardTitle>
              <CardDescription>
                Fast Healthcare Interoperability Resources
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                FHIR (Fast Healthcare Interoperability Resources) — это стандарт для обмена данными 
                в здравоохранении, разработанный HL7 International. Он определяет способы 
                представления, хранения и обмена медицинскими данными между различными системами.
              </p>
              <h4>Основные преимущества:</h4>
              <ul>
                <li>Стандартизированный формат данных</li>
                <li>REST API для интеграции</li>
                <li>Поддержка современных веб-технологий</li>
                <li>Модульная архитектура ресурсов</li>
              </ul>
              <div className="mt-6">
                <Button disabled className="bg-gray-400">
                  <Plus className="h-4 w-4 mr-2" />
                  Создать ресурс (в разработке)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default function FHIRPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">FHIR Интеграция</h1>
            <Badge className="bg-blue-100 text-blue-800">
              <Zap className="h-3 w-3 mr-1" />
              MVP Demo
            </Badge>
          </div>
          <p className="text-gray-600">
            Работа со стандартизированными медицинскими данными в формате FHIR
          </p>
        </div>

        <Suspense fallback={<FHIRFallback />}>
          <FHIRContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
