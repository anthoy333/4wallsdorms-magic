"use client"

import { motion } from "framer-motion"
import { BackButton } from "@/app/components/BackButton"
import { NotificationSignupForm } from "@/components/ui/notification-signup-form"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-6">
            <BackButton href="/" text="Home Page" />
          </div>
        </div>
      </div>

      {/* Notification Sign-up Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <NotificationSignupForm 
              title="Stay Updated"
              description="Want to know when we add your university? Sign up for email or text notifications and be the first to know when your campus joins the 4WallsDorms community."
            />
          </motion.div>
        </div>
      </section>
    </div>
  )
}
