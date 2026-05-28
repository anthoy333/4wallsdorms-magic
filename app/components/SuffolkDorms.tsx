"use client"

import { motion } from "framer-motion"
import { SuffolkDormsExplorer } from "./SuffolkDormsExplorer"

export default function SuffolkDorms() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Explore 5 Boston Dorms</h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            We&apos;ve mapped 5 residence halls / dorms for you to explore.
          </p>
        </motion.div>

        <SuffolkDormsExplorer />
      </div>
    </section>
  )
}
