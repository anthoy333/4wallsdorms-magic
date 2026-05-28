"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface MediaItem {
  src: string
  alt: string
  type: 'video' | 'image'
  thumbnail?: string
}

interface VerticalVideoPlayerProps {
  media: MediaItem[]
}

export function VerticalVideoPlayer({ media }: VerticalVideoPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [scrubberPosition, setScrubberPosition] = useState(0)
  const [showTimePopup, setShowTimePopup] = useState(false)
  const [timePopupPosition, setTimePopupPosition] = useState(0)
  const [timePopupTime, setTimePopupTime] = useState("0:00")
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentMedia = media[currentIndex]

  // Update current time and duration
  useEffect(() => {
    const video = videoRef.current
    if (!video || currentMedia.type !== 'video') return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    
    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    
    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [currentIndex, currentMedia.type])

  // Update scrubber position based on current time
  useEffect(() => {
    if (!isDragging && duration > 0) {
      const progress = (currentTime / duration) * 100
      setScrubberPosition(progress)
    }
  }, [currentTime, duration, isDragging])

  // Format time as MM:SS or H:MM:SS
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Handle play/pause
  const togglePlay = () => {
    if (currentMedia.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle progress bar interaction
  const handleProgressInteraction = (clientX: number) => {
    if (!progressBarRef.current || currentMedia.type !== 'video') return
    
    const rect = progressBarRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    
    setScrubberPosition(percentage)
    
    if (videoRef.current && duration > 0) {
      const newTime = (percentage / 100) * duration
      setTimePopupTime(formatTime(newTime))
      setTimePopupPosition(percentage)
    }
  }

  // Handle touch/mouse start
  const handleStart = (clientX: number) => {
    if (currentMedia.type !== 'video') return
    setIsDragging(true)
    setShowTimePopup(true)
    handleProgressInteraction(clientX)
  }

  // Handle touch/mouse move
  const handleMove = (clientX: number) => {
    if (!isDragging) return
    handleProgressInteraction(clientX)
  }

  // Handle touch/mouse end
  const handleEnd = () => {
    if (!isDragging || currentMedia.type !== 'video') return
    
    setIsDragging(false)
    setShowTimePopup(false)
    
    if (videoRef.current && duration > 0) {
      const newTime = (scrubberPosition / 100) * duration
      videoRef.current.currentTime = newTime
    }
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX)
    }
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleStart(touch.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      e.preventDefault()
      const touch = e.touches[0]
      handleMove(touch.clientX)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    handleEnd()
  }

  // Navigation
  const goToPrevious = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
    setCurrentTime(0)
    setScrubberPosition(0)
  }

  const goToNext = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
    setCurrentTime(0)
    setScrubberPosition(0)
  }

  // Reset when media changes
  useEffect(() => {
    if (currentMedia.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0
      setCurrentTime(0)
      setScrubberPosition(0)
      setIsPlaying(false)
    }
  }, [currentIndex])

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[9/16] bg-black overflow-hidden"
    >
      {/* Media Display */}
      {currentMedia.type === 'video' ? (
        <video
          ref={videoRef}
          src={currentMedia.src}
          className="w-full h-full object-contain"
          playsInline
          muted
          loop={false}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      ) : (
        <Image
          src={currentMedia.src}
          alt={currentMedia.alt}
          fill
          className="object-contain"
        />
      )}

      {/* Controls Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end">
        {/* Bottom Controls Bar */}
        <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent pb-4 pt-8 px-4">
          {/* Progress Bar Container */}
          {currentMedia.type === 'video' && (
            <div className="relative mb-4 py-2 -my-2">
              {/* Progress Bar Background */}
              <div 
                ref={progressBarRef}
                className="relative h-1 bg-white/30 rounded-full cursor-pointer touch-none"
                style={{ touchAction: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Progress Fill */}
                <div 
                  className="absolute left-0 top-0 h-full bg-white rounded-full transition-all"
                  style={{ width: `${scrubberPosition}%` }}
                />
                
                {/* Scrubber Handle */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all z-10"
                  style={{ left: `clamp(0px, calc(${scrubberPosition}% - 8px), calc(100% - 16px))` }}
                />
              </div>

              {/* Time Popup */}
              {showTimePopup && (
                <div 
                  className="absolute bottom-6 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10"
                  style={{ 
                    left: `clamp(0px, calc(${timePopupPosition}% - 20px), calc(100% - 50px))`
                  }}
                >
                  {timePopupTime}
                </div>
              )}
            </div>
          )}

          {/* Controls Row */}
          <div className="flex items-center justify-between">
            {/* Play Button (Left) */}
            {currentMedia.type === 'video' && (
              <button
                onClick={togglePlay}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 text-white" fill="white" />
                ) : (
                  <Play className="h-6 w-6 text-white ml-0.5" fill="white" />
                )}
              </button>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Navigation Arrows (Right) */}
            {media.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevious}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={goToNext}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
                  aria-label="Next"
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

