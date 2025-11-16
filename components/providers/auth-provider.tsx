
'use client'

import { SessionProvider } from "next-auth/react"
import { ReactNode, useEffect, useState } from "react"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-background">{children}</div>
  }

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
