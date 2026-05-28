"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Share } from "lucide-react"
import Link from "next/link"
import { BackButton } from "@/app/components/BackButton"
import { BostonUniversitiesSection } from "@/app/components/BostonUniversitiesSection"
import { NotificationSignupForm } from "@/components/ui/notification-signup-form"

export default function DormsPage() {
  return (
    <div className="bg-background">
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <BackButton href="/" text="Home Page" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-10 text-center"
          >
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Our Dorm Library</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Pick your school to explore residence halls. We began with Suffolk—help us map the rest of Boston.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-primary/5 to-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="mb-10 text-center"
          >
            <h2 className="mb-2 text-2xl font-bold md:text-3xl">Boston-area universities</h2>
            <p className="text-muted-foreground">More campuses coming soon—send a photo to add yours.</p>
          </motion.div>
          <BostonUniversitiesSection />
        </div>
      </section>

      <section className="bg-gradient-to-b from-background to-secondary/20 px-4 py-10 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <NotificationSignupForm />
          </motion.div>
        </div>
      </section>

      <section className="bg-primary/5 px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold">Help future students</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Your photos and insights help incoming students prepare. Share your dorm today.
          </p>
          <Button size="lg" asChild>
            <Link href="/upload-dorm">
              <Share className="mr-2 h-4 w-4" />
              Share your dorm room
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
