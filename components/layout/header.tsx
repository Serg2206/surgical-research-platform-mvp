
import Link from 'next/link'
import { Suspense } from 'react'
import { Stethoscope } from 'lucide-react'
import { ClientHeader } from './client-header'

interface HeaderProps {
  onSearch?: (query: string) => void
}

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-1 bg-blue-100 rounded-lg">
              <Stethoscope className="h-6 w-6 text-blue-600" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">Surgical Research</h1>
              <p className="text-xs text-gray-600">Platform</p>
            </div>
          </Link>
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </header>
  )
}

export function Header({ onSearch }: HeaderProps) {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <ClientHeader onSearch={onSearch} />
    </Suspense>
  )
}
