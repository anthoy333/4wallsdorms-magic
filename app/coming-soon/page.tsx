"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Clock, Bell, Share } from "lucide-react"
import Link from "next/link"
import { BackButton } from "@/app/components/BackButton"

export default function ComingSoonPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6">
          <BackButton href="/dorms/explore" text="Explore Dorms" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <Clock className="h-12 w-12 text-primary" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">Coming Soon</h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            We're currently working on adding this campus to our platform. Check back soon for detailed information about
            dorm rooms, residence halls, and campus amenities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="flex items-center gap-2" asChild>
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
                Get Notified When Available
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="/dorms/explore">Explore Other Campuses</Link>
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-lg text-muted-foreground mb-4">
              Have photos or videos of this campus? Help future students by sharing them!
            </p>
            <Button size="lg" className="flex items-center gap-2" asChild>
                              <Link href="/upload-dorm">
                <Share className="h-5 w-5" />
                Share Your Dorm Room
              </Link>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Want to see this campus added sooner?</p>
            <p>
              Let us know by{" "}
              <Link href="/notifications" className="text-primary underline">
                submitting a request
              </Link>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
