"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface RoomThumbnail {
  type: 'image' | 'video'
  src: string
  alt: string
}

interface RoomCardProps {
  room: {
    id: number
    number: string
    type: string
    link: string
    thumbnail: RoomThumbnail
  }
  index: number
}

export function RoomCard({ room, index }: RoomCardProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const lastClickRef = useRef<number>(0)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Ensure video starts paused
  useEffect(() => {
    if (room.thumbnail.type === 'video' && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      videoRef.current.muted = true
    }
  }, [room.thumbnail.type])

  const handleMediaClick = (e: React.MouseEvent) => {
    // For images: always navigate to room page (Link handles this, no preventDefault needed)
    if (room.thumbnail.type === 'image') {
      return
    }
    
    // For videos: handle single click (play/pause) and double click (navigate)
    if (room.thumbnail.type === 'video') {
      e.preventDefault()
      e.stopPropagation()
      
      const currentTime = Date.now()
      const timeSinceLastClick = currentTime - lastClickRef.current
      
      // Double-click detection (within 300ms)
      if (timeSinceLastClick < 300 && timeSinceLastClick > 0) {
        // Double click: navigate to room page
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current)
          clickTimeoutRef.current = null
        }
        if (videoRef.current) {
          videoRef.current.pause()
        }
        router.push(room.link)
        lastClickRef.current = 0 // Reset to prevent triple-click issues
        return
      }
      
      // Single click: toggle play/pause
      lastClickRef.current = currentTime
      
      // Clear any existing timeout
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
      
      // Wait to see if this is part of a double click
      clickTimeoutRef.current = setTimeout(() => {
        // This was a single click: toggle play/pause
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play()
            setIsVideoPlaying(true)
          } else {
            videoRef.current.pause()
            setIsVideoPlaying(false)
          }
        }
        clickTimeoutRef.current = null
      }, 300)
    }
  }

  const handleVideoEnd = () => {
    setIsVideoPlaying(false)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleMediaClick(e as any)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    // Handle touch events for mobile double-tap detection
    if (room.thumbnail.type === 'video') {
      e.preventDefault()
      e.stopPropagation()
      
      const currentTime = Date.now()
      const timeSinceLastTap = currentTime - lastClickRef.current
      
      // Double-tap detection (within 300ms)
      if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
        // Double tap: navigate to room page
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current)
          clickTimeoutRef.current = null
        }
        if (videoRef.current) {
          videoRef.current.pause()
        }
        router.push(room.link)
        lastClickRef.current = 0 // Reset to prevent triple-tap issues
        return
      }
      
      // Single tap: toggle play/pause
      lastClickRef.current = currentTime
      
      // Clear any existing timeout
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
      
      // Wait to see if this is part of a double tap
      clickTimeoutRef.current = setTimeout(() => {
        // This was a single tap: toggle play/pause
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play()
            setIsVideoPlaying(true)
          } else {
            videoRef.current.pause()
            setIsVideoPlaying(false)
          }
        }
        clickTimeoutRef.current = null
      }, 300)
    }
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="break-inside-avoid mb-4"
    >
      <Link href={room.link} className="block">
        <div 
          className="bg-background rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group border-0"
          style={{
            // iOS-inspired soft shadow
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
          }}
          onMouseEnter={(e) => {
            // Enhanced shadow on hover (iOS-like elevation)
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            // Reset shadow
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {/* Media Area */}
          <div 
            className="relative bg-muted overflow-hidden rounded-t-2xl"
            onClick={handleMediaClick}
            onTouchStart={handleTouchStart}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`${room.thumbnail.type === 'video' ? 'Video' : 'Image'} for Room ${room.number}, ${room.type} room`}
          >
            {room.thumbnail.type === 'video' ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-auto object-cover"
                  style={{
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  muted
                  playsInline
                  loop
                  onEnded={handleVideoEnd}
                  onPlay={() => {
                    // Ensure video stays muted
                    if (videoRef.current) {
                      videoRef.current.muted = true
                    }
                  }}
                  onPause={() => {
                    setIsVideoPlaying(false)
                  }}
                  poster={room.thumbnail.src} // Use thumbnail as poster if available
                >
                  <source src={room.thumbnail.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Play button overlay - show when paused */}
                {!isVideoPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div 
                      className="bg-white/95 rounded-full p-4 backdrop-blur-sm"
                      style={{
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <Play className="h-6 w-6 sm:h-7 sm:w-7 text-primary fill-primary ml-1" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <Image
                  src={room.thumbnail.src}
                  alt={room.thumbnail.alt}
                  width={400}
                  height={300}
                  className="w-full h-auto"
                  style={{
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  loading={index < 6 ? "eager" : "lazy"}
                  priority={index < 3}
                />
                
                {/* Subtle hover overlay for images - indicates clickability */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
              </>
            )}
          </div>

          {/* Footer Area - Always visible with Room Number and Room Type */}
          <div className="p-4 bg-background rounded-b-2xl">
            <div className="space-y-1">
              {/* Room Number - First line, bold */}
              <div className="text-sm font-bold text-foreground leading-tight">
                Room {room.number}
              </div>
              {/* Room Type - Second line, bold */}
              <div className="text-sm font-bold text-muted-foreground leading-tight">
                {room.type}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
