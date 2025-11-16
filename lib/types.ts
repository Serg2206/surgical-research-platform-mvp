
import { User, Course, Article, Category, Lesson, UserRole } from "@prisma/client"

export type { UserRole }

export interface ExtendedUser extends User {
  _count?: {
    courses: number
    articles: number
    enrollments: number
  }
}

export interface CourseWithDetails extends Course {
  author: User
  category: Category
  lessons: Lesson[]
  _count?: {
    enrollments: number
    lessons: number
  }
}

export interface ArticleWithDetails extends Article {
  author: User
  category: Category
  tags: {
    tag: {
      id: string
      name: string
      slug: string
      color: string | null
    }
  }[]
}

export interface SearchFilters {
  query?: string
  category?: string
  difficulty?: string
  role?: UserRole
  published?: boolean
  featured?: boolean
}

export interface FHIRPatient {
  resourceType: "Patient"
  id?: string
  name?: Array<{
    use?: string
    family?: string
    given?: string[]
  }>
  gender?: "male" | "female" | "other" | "unknown"
  birthDate?: string
  address?: Array<{
    use?: string
    line?: string[]
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }>
}

export interface FHIRProcedure {
  resourceType: "Procedure"
  id?: string
  status: "preparation" | "in-progress" | "not-done" | "on-hold" | "stopped" | "completed" | "entered-in-error" | "unknown"
  code?: {
    coding?: Array<{
      system?: string
      code?: string
      display?: string
    }>
    text?: string
  }
  subject?: {
    reference?: string
    display?: string
  }
  performedDateTime?: string
  performer?: Array<{
    actor?: {
      reference?: string
      display?: string
    }
    role?: {
      coding?: Array<{
        system?: string
        code?: string
        display?: string
      }>
    }
  }>
  outcome?: {
    coding?: Array<{
      system?: string
      code?: string
      display?: string
    }>
    text?: string
  }
}

export interface FHIRObservation {
  resourceType: "Observation"
  id?: string
  status: "registered" | "preliminary" | "final" | "amended" | "corrected" | "cancelled" | "entered-in-error" | "unknown"
  category?: Array<{
    coding?: Array<{
      system?: string
      code?: string
      display?: string
    }>
  }>
  code?: {
    coding?: Array<{
      system?: string
      code?: string
      display?: string
    }>
    text?: string
  }
  subject?: {
    reference?: string
    display?: string
  }
  effectiveDateTime?: string
  valueQuantity?: {
    value?: number
    unit?: string
    system?: string
    code?: string
  }
  valueString?: string
  component?: Array<{
    code?: {
      coding?: Array<{
        system?: string
        code?: string
        display?: string
      }>
      text?: string
    }
    valueQuantity?: {
      value?: number
      unit?: string
      system?: string
      code?: string
    }
  }>
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface AISearchResult {
  type: "course" | "article" | "lesson"
  id: string
  title: string
  description: string
  relevanceScore: number
  url: string
}
