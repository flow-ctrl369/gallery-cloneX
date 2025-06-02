import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Suspense } from "react"
import Loading from "./loading"
import { AnimatePresence } from "framer-motion"

const inter = Inter({ subsets: ["latin"] })
const outfit = Outfit({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Abstra | Contemporary Art Gallery",
  description: "Discover extraordinary works from emerging and established artists at Abstra, your premier destination for contemporary art.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon */} 
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/abstra logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className={outfit.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
            <Header />
            <Suspense fallback={<Loading />}>
              <AnimatePresence mode="wait">
                {children}
              </AnimatePresence>
            </Suspense>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
