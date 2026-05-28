import "./globals.css"
import { Inter, Playfair_Display } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Header from "./components/Header"
import Footer from "./components/Footer"
import type React from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ 
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-playfair"
})

export const metadata = {
  title: "4WallsDorms - Dorm Room Planning Made Easy",
  description: "Plan your dorm room layout before you pack. Visualize your space and coordinate with roommates.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${inter.className} min-h-screen bg-background text-foreground antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="w-full">{children}</main>
          <Footer />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
