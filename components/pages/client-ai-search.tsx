
'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Send, 
  Loader2, 
  MessageSquare, 
  User, 
  Bot,
  Search,
  BookOpen,
  FileText,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface SearchResult {
  courses: Array<{
    id: string
    title: string
    slug: string
    description: string
    category: { name: string }
    author: { name: string | null, fullName: string | null }
  }>
  articles: Array<{
    id: string
    title: string
    slug: string
    excerpt: string | null
    category: { name: string }
    author: { name: string | null, fullName: string | null }
  }>
}

export function ClientAISearch() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Необходима авторизация</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Войдите в систему для использования AI поиска
            </p>
            <Button asChild>
              <Link href="/auth/signin">Войти</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: input.trim(),
          context: 'chat'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      // Parse search results from headers
      const searchResultsHeader = response.headers.get('X-Search-Results')
      if (searchResultsHeader) {
        try {
          setSearchResults(JSON.parse(searchResultsHeader))
        } catch (e) {
          console.error('Failed to parse search results:', e)
        }
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      if (reader) {
        let buffer = ''
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk

          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                break
              }
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content || ''
                if (content) {
                  assistantMessage.content += content
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === assistantMessage.id 
                        ? { ...msg, content: assistantMessage.content }
                        : msg
                    )
                  )
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка при обработке вашего запроса. Попробуйте еще раз.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              AI Консультант
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Задайте вопрос о хирургии, медицинских процедурах или найдите нужные курсы</p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-blue-600 ml-3' 
                          : 'bg-gray-200 mr-3'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatDate(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Анализирую запрос...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            <form onSubmit={handleSubmit} className="flex space-x-2 pt-4 border-t">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Задайте вопрос о хирургии, поищите курсы..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Search Results Sidebar */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Результаты поиска
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchResults ? (
              <div className="space-y-4">
                {searchResults.courses.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Курсы
                    </h4>
                    <div className="space-y-2">
                      {searchResults.courses.map((course) => (
                        <Link
                          key={course.id}
                          href={`/courses/${course.slug}`}
                          className="block p-2 border rounded hover:bg-gray-50"
                        >
                          <h5 className="font-medium text-sm text-gray-900 line-clamp-2">
                            {course.title}
                          </h5>
                          <p className="text-xs text-gray-600 mt-1">
                            {course.category.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.articles.length > 0 && (
                  <div>
                    <Separator />
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center pt-4">
                      <FileText className="h-4 w-4 mr-1" />
                      Статьи
                    </h4>
                    <div className="space-y-2">
                      {searchResults.articles.map((article) => (
                        <Link
                          key={article.id}
                          href={`/articles/${article.slug}`}
                          className="block p-2 border rounded hover:bg-gray-50"
                        >
                          <h5 className="font-medium text-sm text-gray-900 line-clamp-2">
                            {article.title}
                          </h5>
                          <p className="text-xs text-gray-600 mt-1">
                            {article.category.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.courses.length === 0 && searchResults.articles.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Нет результатов поиска
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                Результаты поиска появятся здесь после запроса
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs" asChild>
              <Link href="/courses">
                <BookOpen className="h-3 w-3 mr-2" />
                Все курсы
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs" asChild>
              <Link href="/articles">
                <FileText className="h-3 w-3 mr-2" />
                Все статьи
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs" asChild>
              <Link href="/fhir">
                <Search className="h-3 w-3 mr-2" />
                FHIR Данные
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
