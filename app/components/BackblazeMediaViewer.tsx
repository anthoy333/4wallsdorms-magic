"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Play, Loader2, AlertCircle, X, ArrowLeft, ArrowRight, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BackblazeFile {
  fileName: string
  fileId: string
  contentLength: number
  contentType: string
  uploadTimestamp: number
  type: 'image' | 'video' | 'unknown'
  url: string
}

interface BackblazeMediaViewerProps {
  folder: string // e.g., "Campus/Oct/Building/Floor/Room/"
  title?: string
  className?: string
}

/**
 * BackblazeMediaViewer Component
 * 
 * Fetches and displays all photos and videos from a Backblaze B2 folder.
 * All Backblaze API calls happen server-side - this component only calls our secure API routes.
 * 
 * Usage:
 * <BackblazeMediaViewer folder="Suffolk University Dorms/Miller/Floor 2/201/" />
 */
export function BackblazeMediaViewer({ 
  folder, 
  title = "Room Media",
  className = "" 
}: BackblazeMediaViewerProps) {
  const [files, setFiles] = useState<BackblazeFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState<{ [key: number]: boolean }>({})

  // Filter files to only show images and videos
  const mediaFiles = files.filter(file => file.type === 'image' || file.type === 'video')

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/backblaze/list?folder=${encodeURIComponent(folder)}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Failed to fetch files: ${response.statusText}`)
        }
        
        const data = await response.json()
        setFiles(data.files || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load media files")
        console.error("Error fetching Backblaze files:", err)
      } finally {
        setLoading(false)
      }
    }

    if (folder) {
      fetchFiles()
    }
  }, [folder])

  const handlePrevious = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setSelectedIndex(prev => (prev === 0 ? mediaFiles.length - 1 : prev - 1))
    setIsVideoPlaying({}) // Reset video playing state
  }

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setSelectedIndex(prev => (prev === mediaFiles.length - 1 ? 0 : prev + 1))
    setIsVideoPlaying({}) // Reset video playing state
  }

  const handleVideoToggle = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setIsVideoPlaying(prev => ({ ...prev, [index]: !prev[index] }))
  }

  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading media...</p>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-8 w-8 text-destructive mb-4" />
          <p className="text-destructive font-medium mb-2">Error loading media</p>
          <p className="text-sm text-muted-foreground text-center">{error}</p>
        </CardContent>
      </Card>
    )
  }

  // Empty state
  if (mediaFiles.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Camera className="h-8 w-8 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No media files found in this folder</p>
        </CardContent>
      </Card>
    )
  }

  const selectedFile = mediaFiles[selectedIndex]

  return (
    <div className={className}>
      {title && (
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
      )}

      {/* Main Media Display */}
      <div className="flex flex-col gap-6 w-full mb-6">
        <div 
          className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-border bg-gray-100 cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        >
          {selectedFile.type === 'video' ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              {!isVideoPlaying[selectedIndex] ? (
                <>
                  {/* Video thumbnail/preview */}
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <Button
                      size="lg"
                      onClick={(e) => handleVideoToggle(selectedIndex, e)}
                      className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all z-10"
                    >
                      <Play className="h-8 w-8 text-white ml-1" />
                    </Button>
                  </div>
                </>
              ) : (
                <video
                  src={selectedFile.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  controlsList="nodownload nofullscreen noremoteplayback"
                  disablePictureInPicture
                  className="w-full h-full object-contain"
                  onClick={(e) => {
                    e.stopPropagation()
                    const video = e.target as HTMLVideoElement
                    if (video.paused) {
                      video.play()
                    } else {
                      video.pause()
                    }
                  }}
                  onVolumeChange={(e) => {
                    // Force mute if user tries to unmute
                    const video = e.target as HTMLVideoElement
                    if (!video.muted) {
                      video.muted = true
                    }
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ) : (
            <Image
              src={selectedFile.url}
              alt={selectedFile.fileName}
              fill
              className="object-cover"
              unoptimized // Backblaze files are already optimized
              priority // Priority loading for main display image
            />
          )}

          {/* Navigation Arrows */}
          {mediaFiles.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg z-10"
                onClick={handlePrevious}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg z-10"
                onClick={handleNext}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Media counter */}
          {mediaFiles.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {mediaFiles.length}
            </div>
          )}
        </div>

        {/* Thumbnail Grid */}
        {mediaFiles.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {mediaFiles.map((file, index) => (
              <div
                key={file.fileId}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  index === selectedIndex
                    ? 'border-primary ring-2 ring-primary'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => {
                  setSelectedIndex(index)
                  setIsVideoPlaying({}) // Reset video state when changing selection
                }}
              >
                {file.type === 'image' ? (
                  <Image
                    src={file.url}
                    alt={file.fileName}
                    fill
                    className="object-cover"
                    unoptimized
                    loading={index < 8 ? "eager" : "lazy"} // Load first 8 thumbnails eagerly, rest lazily
                  />
                ) : (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <Play className="h-6 w-6 text-white/70" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          {mediaFiles.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                onClick={handlePrevious}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                onClick={handleNext}
              >
                <ArrowRight className="h-6 w-6" />
              </Button>
            </>
          )}

          <div
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedFile.type === 'video' ? (
              <video
                src={selectedFile.url}
                autoPlay
                muted
                loop
                playsInline
                controls
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                className="max-w-full max-h-full object-contain"
                onClick={(e) => {
                  e.stopPropagation()
                  const video = e.target as HTMLVideoElement
                  if (video.paused) {
                    video.play()
                  } else {
                    video.pause()
                  }
                }}
                onVolumeChange={(e) => {
                  const video = e.target as HTMLVideoElement
                  if (!video.muted) {
                    video.muted = true
                  }
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={selectedFile.url}
                alt={selectedFile.fileName}
                width={1920}
                height={1080}
                className="max-w-full max-h-full object-contain"
                unoptimized
              />
            )}
          </div>

          {/* Lightbox counter */}
          {mediaFiles.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {selectedIndex + 1} / {mediaFiles.length}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

