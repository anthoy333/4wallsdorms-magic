"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface CampusTypeCardProps {
  icon: LucideIcon
  title: string
  description: string
  index: number
  className?: string
}

export function CampusTypeCard({ 
  icon: Icon, 
  title, 
  description, 
  index,
  className = ""
}: CampusTypeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
      className={`bg-background p-6 rounded-xl shadow-sm border border-border ${className}`}
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </motion.div>
  )
} 