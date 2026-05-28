"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { BackButton } from "@/app/components/BackButton"
import FilingCabinetNav from "@/app/components/FilingCabinetNav"
import { motion } from "framer-motion"

function CampusContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  return (
    <div className="bg-background min-h-screen">
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6">
            <BackButton href="/" text="Home Page" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            {searchQuery && (
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">
                  Search Results for: "{searchQuery}"
                </h1>
                <p className="text-muted-foreground">
                  Find dorms and rooms at your campus
                </p>
              </div>
            )}
            <FilingCabinetNav />
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default function CampusPage() {
  return (
    <Suspense fallback={
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <CampusContent />
    </Suspense>
  )
}

