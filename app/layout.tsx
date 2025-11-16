
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/providers/auth-provider"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: "Surgical Research Platform - Платформа хирургического образования",
    template: "%s | Surgical Research Platform"
  },
  description: "Современная платформа для хирургического образования и научных исследований. Курсы, статьи, AI-поиск и FHIR интеграция.",
  keywords: ["хирургия", "медицинское образование", "научные исследования", "курсы", "FHIR"],
  authors: [{ name: "Prof. Sergey Sushkov" }],
  creator: "Surgical Research Platform",
  publisher: "Surgical Research Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    title: "Surgical Research Platform - Платформа хирургического образования",
    description: "Современная платформа для хирургического образования и научных исследований",
    siteName: "Surgical Research Platform",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Surgical Research Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Surgical Research Platform - Платформа хирургического образования",
    description: "Современная платформа для хирургического образования и научных исследований",
    images: ["/og-image.png"]
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
