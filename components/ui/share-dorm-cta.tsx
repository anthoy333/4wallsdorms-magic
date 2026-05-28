"use client"

import { Button } from "@/components/ui/button"
import { Upload, Info } from "lucide-react"
import Link from "next/link"

interface ShareDormCTAProps {
  className?: string
  title?: string
  description?: string
  showLearnMore?: boolean
}

export function ShareDormCTA({ 
  className = "",
  title = "Share Your Dorm Room",
  description = "Help future students by sharing photos and details of your dorm room. Your contribution makes a difference!",
  showLearnMore = true
}: ShareDormCTAProps) {
  return (
    <section className={`py-10 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="container mx-auto max-w-4xl">
        <div className="bg-primary/10 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/upload-dorm">
                <Upload className="mr-2 h-4 w-4" /> Share Your Room
              </Link>
            </Button>
            {showLearnMore && (
              <Button variant="outline" size="lg">
                <Info className="mr-2 h-4 w-4" /> Learn More
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
} 