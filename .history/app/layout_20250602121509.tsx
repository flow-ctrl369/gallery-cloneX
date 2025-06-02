import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AnimatePresenceWrapper from "@/components/animate-presence-wrapper"

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
      <body className={outfit.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
            <Header />
            <AnimatePresenceWrapper>
              {children}
            </AnimatePresenceWrapper>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
