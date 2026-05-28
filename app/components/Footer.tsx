"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Instagram, Facebook, Youtube, Mail } from "lucide-react"

const ROUTES_WITHOUT_FOOTER = ["/room-504"]

export default function Footer() {
  const pathname = usePathname()
  const [email, setEmail] = useState("")

  if (ROUTES_WITHOUT_FOOTER.some(route => pathname.startsWith(route))) return null
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwe_736VVg_LVGYTnhhYjpF65ULKK2OT0JllRh8xvCaKEX7nVb7IcZAgN5352iq4xPj/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: email,
          source: "footer_subscription"
        })
      })

      if (response.ok) {
        setMessage("✅ Thank you for subscribing!")
        setEmail("")
      } else {
        setMessage("❌ Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error("Subscription error:", error)
      setMessage("❌ Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <footer className="bg-background border-t border-border">
      <div className="w-full px-2 sm:px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold">4WallsDorms</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Helping students and families prepare for move-in day.</p>
          </div>

          {/* Stay Updated Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to our update list to see the new campuses and dorm rooms coming in daily.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "..." : "Subscribe"}
                </Button>
              </div>
              {message && (
                <p className={`text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-border">
          {/* Social Media Section */}
          <div className="mt-4 lg:mt-6 text-center">
            <h4 className="text-lg sm:text-xl font-semibold mb-4 lg:mb-6">Follow Us</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 font-bold">
              Designed & Developed with ❤️ by Students for Students.
            </p>
            <div className="flex justify-center gap-2 sm:gap-3">
              <Button variant="ghost" size="sm" className="sm:size-lg" asChild>
                <Link href="#" aria-label="Instagram">
                  <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="sm:size-lg" asChild>
                <Link href="#" aria-label="TikTok">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="sm:size-lg" asChild>
                <Link href="#" aria-label="Facebook">
                  <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="sm:size-lg" asChild>
                <Link href="#" aria-label="YouTube">
                  <Youtube className="h-5 w-5 sm:h-6 sm:w-6" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="sm:size-lg" asChild>
                <Link href="#" aria-label="Email">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="sm:size-lg" asChild>
                <Link href="#" aria-label="GoFundMe">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
