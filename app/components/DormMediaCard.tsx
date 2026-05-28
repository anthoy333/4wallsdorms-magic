"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export interface MediaItem {
  type: "image" | "video"
  src: string
  alt?: string
  thumbnail?: string
}

export interface DormMediaCardProps {
  roomNumber: string
  dormName: string
  schoolName: string
  media: MediaItem[]
  detailsLink: string
}

export function DormMediaCard({
  roomNumber,
  dormName,
  schoolName,
  media,
  detailsLink,
}: DormMediaCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentMedia = media[currentIndex]

  // Auto-play video when navigating to a video item
  useEffect(() => {
    if (currentMedia?.type === "video" && videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().catch(() => {
        // Autoplay blocked, that's fine
      })
    }
  }, [currentIndex, currentMedia?.type])

  const goToNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (videoRef.current) {
        videoRef.current.pause()
      }
      if (currentIndex < media.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        setShowMoreInfo(false)
      } else {
        setShowMoreInfo(true)
      }
    },
    [currentIndex, media.length]
  )

  const goToPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (videoRef.current) {
        videoRef.current.pause()
      }
      setShowMoreInfo(false)
      setCurrentIndex((prev) => Math.max(0, prev - 1))
    },
    []
  )

  const getPreviewSrc = (item: MediaItem) => {
    if (item.type === "video") {
      return item.thumbnail || ""
    }
    return item.src
  }

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden bg-background cursor-pointer group"
      style={{
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        aspectRatio: "3/4",
      }}
      whileHover={{
        boxShadow:
          "0 8px 24px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)",
        y: -2,
      }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Area */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {showMoreInfo ? (
            <motion.div
              key="more-info"
              className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg font-bold mb-2">{dormName}</p>
              <p className="text-sm text-gray-300 mb-1">{schoolName}</p>
              <p className="text-xl font-black mb-6">Room {roomNumber}</p>
              <Link
                href={detailsLink}
                className="bg-white text-gray-900 font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-100 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                View Full Room
              </Link>
            </motion.div>
          ) : currentMedia?.type === "video" ? (
            <motion.div
              key={`video-${currentIndex}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                playsInline
                loop
                poster={currentMedia.thumbnail}
              >
                <source src={currentMedia.src} type="video/mp4" />
              </video>
            </motion.div>
          ) : (
            <motion.div
              key={`image-${currentIndex}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Image
                src={currentMedia?.src || ""}
                alt={currentMedia?.alt || `Room ${roomNumber}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gradient overlay for text readability */}
        {!showMoreInfo && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
        )}
      </div>

      {/* Room info overlay at bottom */}
      {!showMoreInfo && (
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white pointer-events-none">
          <p className="text-xs text-white/70 leading-tight">{schoolName}</p>
          <p className="text-xs text-white/70 leading-tight">{dormName}</p>
          <p className="text-base font-bold leading-tight">Room {roomNumber}</p>
        </div>
      )}

      {/* Media dot indicators */}
      {!showMoreInfo && media.length > 1 && (
        <div className="absolute top-3 left-0 right-0 flex justify-center gap-1 pointer-events-none">
          {media.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-4 bg-white"
                  : "w-1.5 bg-white/50"
              }`}
            />
          ))}
          {/* Extra dot for "more info" state */}
          <div
            className={`h-1 rounded-full transition-all duration-300 ${
              showMoreInfo ? "w-4 bg-white" : "w-1.5 bg-white/30"
            }`}
          />
        </div>
      )}

      {/* Navigation Buttons - shown on hover */}
      <AnimatePresence>
        {isHovered && !showMoreInfo && (
          <>
            {/* Prev button */}
            {currentIndex > 0 && (
              <motion.button
                key="prev"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={goToPrev}
                aria-label="Previous media"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
            )}

            {/* Next button */}
            <motion.button
              key="next"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={goToNext}
              aria-label="Next media"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </>
        )}

        {/* Back button when showing more info */}
        {isHovered && showMoreInfo && (
          <motion.button
            key="back"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={goToPrev}
            aria-label="Back to media"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Invisible link covering the card for navigation */}
      {!showMoreInfo && (
        <Link
          href={detailsLink}
          className="absolute inset-0 z-0"
          aria-label={`View details for Room ${roomNumber} at ${dormName}`}
        />
      )}
    </motion.div>
  )
}
