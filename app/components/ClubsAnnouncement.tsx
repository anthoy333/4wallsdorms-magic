"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ClubsAnnouncement() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-secondary/10">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 relative z-10 text-center lg:text-left"
        >
          We are Helping Clubs too!
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <div className="space-y-6">
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground">
                We are working with Club Leaders to build a calendar that allows students to view all 
              </p>
              <ul className="text-lg sm:text-xl md:text-2xl text-muted-foreground list-none space-y-2">
                <li className="font-bold flex items-center gap-2">
                  <span className="text-[hsl(var(--accent))]">•</span> Club Meetings
                </li>
                <li className="font-bold flex items-center gap-2">
                  <span className="text-[hsl(var(--accent))]">•</span> Events
                </li>
                <li className="font-bold flex items-center gap-2">
                  <span className="text-[hsl(var(--accent))]">•</span> Networking
                </li>
                <li className="font-bold flex items-center gap-2">
                  <span className="text-[hsl(var(--accent))]">•</span> Plays
                </li>
                <li className="font-bold flex items-center gap-2">
                  <span className="text-[hsl(var(--accent))]">•</span> Sports Games
                </li>
                <li className="font-bold flex items-center gap-2">
                  <span className="text-[hsl(var(--accent))]">•</span> And More All in One Place
                </li>
              </ul>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground">
                Currently, this is the first draft. We will have more clubs coming your way!
              </p>
              <div className="mt-8 flex justify-center lg:justify-start">
                <Link href="/suffolk-campus-event-calendar">
                  <Button 
                    size="lg" 
                    className="text-xl sm:text-2xl lg:text-3xl px-10 py-7 font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-shadow rounded-xl border-2 border-[hsl(var(--accent))]"
                  >
                    Suffolk Campus Event Calendar
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full h-full flex items-center justify-center lg:-mt-16"
          >
            <img
              src="https://f005.backblazeb2.com/file/4wallsdorms/clubs/Screenshotofclubcalendar2025-09-04.png"
              alt="Suffolk Club Calendar Preview"
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}