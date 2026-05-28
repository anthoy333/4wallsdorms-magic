"use client"

import Hero from "./components/Hero"
import Marquee from "./components/Marquee"
import { motion } from "framer-motion"
import { NotificationSignupForm } from "@/components/ui/notification-signup-form"

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
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

      <Marquee />
    </>
  )
}
