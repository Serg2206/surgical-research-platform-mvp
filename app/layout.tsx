
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/providers/auth-provider"

const inter = Inter({ subsets: ["latin", "cyrillic"] })
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://proffssv.site"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SSVproff — образовательная платформа по хирургии",
    template: "%s | SSVproff"
  },
  description: "SSVproff: курсы, статьи и научно-образовательные материалы по хирургии, неотложной абдоминальной хирургии и медицинским технологиям.",
  keywords: ["SSVproff", "хирургия", "медицинское образование", "неотложная абдоминальная хирургия", "курсы"],
  authors: [{ name: "Prof. Sergey Sushkov" }],
  creator: "SSVproff",
  publisher: "SSVproff",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    title: "SSVproff — образовательная платформа по хирургии",
    description: "Курсы, статьи и научно-образовательные материалы для профессионального развития хирургов.",
    siteName: "SSVproff",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SSVproff"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SSVproff — образовательная платформа по хирургии",
    description: "Курсы, статьи и научно-образовательные материалы для профессионального развития хирургов.",
    images: ["/og-image.png"]
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  alternates: {
    canonical: siteUrl,
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
