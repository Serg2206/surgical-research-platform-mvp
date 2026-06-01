
import Link from 'next/link'
import { Stethoscope, Heart, Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="p-1 bg-blue-100 rounded-lg">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">SSVproff</h3>
              </div>
            </Link>
            <p className="text-gray-600 max-w-md mb-4">
              Образовательная платформа для хирургии, клинического мышления и профессионального развития медицинских специалистов.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Создано с любовью к медицине</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Платформа</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/courses" className="hover:text-blue-600 transition-colors">
                  Курсы
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-blue-600 transition-colors">
                  Статьи
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-blue-600 transition-colors">
                  Тарифы
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  О платформе
                </Link>
              </li>
            </ul>
          </div>

          {/* Directions */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Направления</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span>Неотложная хирургия</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span>Клиническое мышление</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-purple-500" />
                <span>Научные публикации</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-orange-500" />
                <span>Медицинские технологии</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Документы</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                  Конфиденциальность
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 transition-colors">
                  Условия
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-blue-600 transition-colors">
                  Возвраты
                </Link>
              </li>
              <li>
                <Link href="/medical-disclaimer" className="hover:text-blue-600 transition-colors">
                  Медицинский дисклеймер
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2026 SSVproff. Все права защищены.
            </p>
            <p className="text-sm text-gray-600 mt-2 md:mt-0">
              Образовательные материалы не заменяют клинические протоколы и медицинскую помощь.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
