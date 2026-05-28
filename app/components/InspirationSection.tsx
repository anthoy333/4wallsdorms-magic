"use client"

import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import Link from "next/link"

interface InspirationSectionProps {
  dormHref: string
  dormName: string
}

export function InspirationSection({ dormHref, dormName }: InspirationSectionProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Inspired or Want to Help?</h2>
      <p className="text-lg text-muted-foreground mb-8">
        Share your own decorated, messy, or empty room and help inspire and safe future students from the stress! Your creativity or decorated room could be featured first on our page.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" asChild>
          <Link href="/upload-dorm">
            <Camera className="mr-2 h-4 w-4" />
            Submit Your Room
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/coming-soon">
            Featured Rooms
          </Link>
        </Button>
      </div>
    </div>
  )
} 