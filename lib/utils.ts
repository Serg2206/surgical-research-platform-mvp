
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { UserRole } from "@prisma/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} мин`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours} час${hours === 1 ? '' : (hours < 5 ? 'а' : 'ов')}`
  }
  return `${hours}ч ${remainingMinutes}м`
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'BEGINNER':
      return 'text-green-600 bg-green-50'
    case 'INTERMEDIATE':
      return 'text-blue-600 bg-blue-50'
    case 'ADVANCED':
      return 'text-orange-600 bg-orange-50'
    case 'EXPERT':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'BEGINNER':
      return 'Начинающий'
    case 'INTERMEDIATE':
      return 'Средний'
    case 'ADVANCED':
      return 'Продвинутый'
    case 'EXPERT':
      return 'Эксперт'
    default:
      return 'Не указан'
  }
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'STUDENT':
      return 'Студент'
    case 'TEACHER':
      return 'Преподаватель'
    case 'ADMIN':
      return 'Администратор'
    default:
      return 'Пользователь'
  }
}

export function canEditCourse(userRole: UserRole, courseAuthorId: string, userId: string): boolean {
  return userRole === 'ADMIN' || courseAuthorId === userId
}

export function canCreateContent(userRole: UserRole): boolean {
  return userRole === 'ADMIN' || userRole === 'TEACHER'
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function formatProgress(completed: number, total: number): string {
  if (total === 0) return '0%'
  const percentage = Math.round((completed / total) * 100)
  return `${percentage}%`
}

export function getCategoryIcon(categorySlug: string): string {
  const iconMap: Record<string, string> = {
    'gastroenterology': '🫀',
    'oncology': '🔬',
    'general-surgery': '⚕️',
    'cardiology': '💓',
    'neurosurgery': '🧠',
    'orthopedics': '🦴',
    'pediatrics': '👶',
    'trauma': '🚨',
    'emergency': '🆘',
    'research': '📊',
  }
  return iconMap[categorySlug] || '📚'
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'published':
    case 'active':
      return 'text-green-600 bg-green-50'
    case 'in-progress':
    case 'draft':
      return 'text-blue-600 bg-blue-50'
    case 'pending':
      return 'text-yellow-600 bg-yellow-50'
    case 'cancelled':
    case 'inactive':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}
