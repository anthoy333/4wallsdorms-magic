"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface FeaturedRoom {
  id: number
  title: string
  description: string
  image: string
  student: string
  year: string
}

interface FeaturedRoomCardProps {
  room: FeaturedRoom
  index: number
  baseUrl?: string
  showViewButton?: boolean
}

export function FeaturedRoomCard({ 
  room, 
  index, 
  baseUrl = "", 
  showViewButton = true 
}: FeaturedRoomCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative h-64 rounded-t-xl overflow-hidden bg-muted">
        {room.image ? (
          <Image
            src={room.image}
            alt={room.title}
            width={600}
            height={300}
            className="object-cover group-hover:scale-105 transition duration-300 w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span>No image available</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-background/80 rounded-full p-1">
          <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
        </div>
      </div>
      <div className="p-4 border border-t-0 rounded-b-xl">
        <h3 className="font-bold text-lg mb-1">{room.title}</h3>
        <p className="text-muted-foreground text-sm mb-2">{room.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            By {room.student}, {room.year}
          </span>
          {showViewButton && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`${baseUrl}/room/${room.id}`}>View Room</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
} 