"use client"

import { motion } from "framer-motion"

const features = [
  {
    title: "Anonymous",
    description: "Sending your dorm room with no names attached.",
    icon: "🔒",
  },
  {
    title: "See",
    description: "Explore verified student dorm layouts.",
    icon: "👁️",
  },
  {
    title: "Buy",
    description: "Avoid overpacking and coordinate with roommates.",
    icon: "🛒",
  },
  {
    title: "Furniture Library",
    description: "Measurements for all your dorm furniture.",
    icon: "🛋️",
  },
  {
    title: "Roommate Sharing",
    description: "Collaborate with your roommate on a shared design.",
    icon: "👥",
  },
  {
    title: "Packing Checklist",
    description: "Generate a customized packing list based on your room.",
    icon: "✅",
  },
]

export default function FeatureCarousel() {
  return (
    <div className="py-8 sm:py-12 lg:py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full px-2 sm:px-3 lg:px-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 lg:mb-12 text-foreground">Plan With Confidence</h2>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full max-w-6xl">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background rounded-2xl shadow-lg p-2 sm:p-3 md:p-4 lg:p-6 hover:shadow-xl transition-all duration-300 ease-in-out border border-border hover:border-primary/20 text-center"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 md:mb-6 flex justify-center">{feature.icon}</div>
                <h3 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 text-foreground">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
