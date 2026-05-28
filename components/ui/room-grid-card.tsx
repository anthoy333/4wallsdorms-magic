"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Room {
  id: number
  number: string
  type: string
  image: string
}

interface RoomGridCardProps {
  room: Room
  index: number
  onViewRoom?: (room: Room) => void
}

export function RoomGridCard({ room, index, onViewRoom }: RoomGridCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-background rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 bg-muted">
        {room.image ? (
          <Image
            src={room.image}
            alt={`Room ${room.number}`}
            width={600}
            height={300}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            <span>No image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold">Room {room.number}</h3>
            <p className="text-sm text-muted-foreground">{room.type} Room</p>
          </div>
          <Button 
            size="sm" 
            onClick={() => onViewRoom?.(room)}
          >
            View
          </Button>
        </div>
      </div>
    </motion.div>
  );
} 