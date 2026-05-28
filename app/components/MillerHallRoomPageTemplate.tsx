"use client"

import { useState, useEffect, useRef, Fragment } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useBackblazeRoomMedia } from "@/app/hooks/useBackblazeRoomMedia"
import { useBackblazeFolder } from "@/app/hooks/useBackblazeFolder"
import type { MillerRoomConfig } from "@/app/utils/millerHallMapping"
import { toOrdinal } from "@/app/utils/millerHallMapping"

// Miller Hall thumbnail placeholder when a room has no Backblaze photo (per .cursor/rules/miller-hall-thumbnail-placeholder.mdc)
const MILLER_HALL_PLACEHOLDER_THUMB =
  "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg"

// ---------------------------------------------------------------------------
// Static filter-button thumbnails for Photos/Videos tab
// ---------------------------------------------------------------------------
const filterThumbAll      = "https://f005.backblazeb2.com/file/4wallsdorms/su_boston_west_elevator_buttons.jpg"
const filterThumbPhotos   = "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/407/su10west407a-view-from-out-of-the-room-with-desk-closet-bed-draws-empty.jpg"
const filterThumbVideos   = "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/407/su10west407b-view-from-the-door-with-closet-bed-draw-empty.jpg"
const filterThumbBathroom = "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/407/su10west407-bathroom-shower-sink-moved-in.jpg"
const filterThumbView     = "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/407/su10west407b-room-b-view-of-window-and-bed-closet-empty.jpg"

// ---------------------------------------------------------------------------
// Shared icon assets (same across all Miller Hall rooms)
// ---------------------------------------------------------------------------

type TabType = "Overview" | "Room Plan" | "Bathroom" | "Photos/Videos" | "Updates"
const tabs: TabType[] = ["Overview", "Room Plan", "Bathroom", "Photos/Videos", "Updates"]

/** Centred play-button badge. Pass visible=false while the video is playing to fade it out. */
function VideoPlayOverlay({ visible = true }: { visible?: boolean }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.2s ease" }}
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.52)", backdropFilter: "blur(2px)" }}>
        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  )
}

/** Room photo image that falls back to Miller Hall placeholder if the Backblaze proxy fails (403, network, etc.) */
function RoomPhotoImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
  width,
  height,
}: {
  src: string
  alt: string
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
  width?: number
  height?: number
}) {
  const [usePlaceholder, setUsePlaceholder] = useState(false)
  useEffect(() => {
    setUsePlaceholder(false)
  }, [src])
  const effectiveSrc = usePlaceholder ? MILLER_HALL_PLACEHOLDER_THUMB : src
  return (
    <Image
      src={effectiveSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setUsePlaceholder(true)}
    />
  )
}

interface Props {
  config: MillerRoomConfig
}

export function MillerHallRoomPageTemplate({ config }: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("Overview")
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false)
  const [showRatesModal, setShowRatesModal] = useState(false)
  const [activeUpdatesTab, setActiveUpdatesTab] = useState<"4WallsDorms" | "Students">("4WallsDorms")
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activePhotoFilter, setActivePhotoFilter] = useState<"Latest" | "All" | "Photos" | "Videos" | "Bathroom" | "View">("Latest")
  const [activeBathroomFilter, setActiveBathroomFilter] = useState<"All" | "Photos" | "Videos">("All")
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null)
  const [playingVideos, setPlayingVideos] = useState<Set<number>>(new Set())
  const heroSectionRef = useRef<HTMLDivElement>(null)
  const leftPanelRef = useRef<HTMLDivElement>(null)

  // Floor plan zoom + pan
  const [floorPlanScale, setFloorPlanScale] = useState(1)
  const [floorPlanOffset, setFloorPlanOffset] = useState({ x: 0, y: 0 })
  const floorPlanDragRef = useRef<{ isDragging: boolean; startX: number; startY: number; originX: number; originY: number }>({ isDragging: false, startX: 0, startY: 0, originX: 0, originY: 0 })

  const ZOOM_STEP = 0.25
  const MIN_SCALE = 0.5
  const MAX_SCALE = 4

  function handleZoomIn() { setFloorPlanScale(s => Math.min(s + ZOOM_STEP, MAX_SCALE)) }
  function handleZoomOut() {
    setFloorPlanScale(s => {
      const next = Math.max(s - ZOOM_STEP, MIN_SCALE)
      if (next <= 1) setFloorPlanOffset({ x: 0, y: 0 })
      return next
    })
  }
  function handleFloorPlanMouseDown(e: React.MouseEvent) {
    if (floorPlanScale <= 1) return
    floorPlanDragRef.current = { isDragging: true, startX: e.clientX, startY: e.clientY, originX: floorPlanOffset.x, originY: floorPlanOffset.y }
  }
  function handleFloorPlanMouseMove(e: React.MouseEvent) {
    if (!floorPlanDragRef.current.isDragging) return
    const dx = e.clientX - floorPlanDragRef.current.startX
    const dy = e.clientY - floorPlanDragRef.current.startY
    setFloorPlanOffset({ x: floorPlanDragRef.current.originX + dx, y: floorPlanDragRef.current.originY + dy })
  }
  function handleFloorPlanMouseUp() { floorPlanDragRef.current.isDragging = false }

  // Fetch room media from Backblaze
  const { photos, loading: mediaLoading, error: mediaError } = useBackblazeRoomMedia(config.roomNumber, "Miller")

  // Fetch bathroom media
  const { media: bathroomMedia, loading: bathroomLoading, error: bathroomError } = useBackblazeFolder(config.bathroomFolderPath)

  const getFilteredPhotos = () => {
    switch (activePhotoFilter) {
      case "Latest":
      case "All":
        return photos
      case "Photos":
        return photos.filter(p => p.type === 'image')
      case "Videos":
        return photos.filter(p => p.type === 'video')
      case "Bathroom":
        return photos.filter(p =>
          p.alt?.toLowerCase().includes('bathroom') ||
          p.caption?.toLowerCase().includes('bathroom') ||
          p.src?.toLowerCase().includes('bathroom') ||
          p.src?.toLowerCase().includes('bath')
        )
      case "View":
        return photos.filter(p =>
          p.alt?.toLowerCase().includes('view') ||
          p.caption?.toLowerCase().includes('view') ||
          p.src?.toLowerCase().includes('view')
        )
      default:
        return photos
    }
  }

  const filteredPhotos = getFilteredPhotos()
  const hasPhotos   = photos.some(p => p.type === 'image')
  const hasVideos   = photos.some(p => p.type === 'video')
  const hasBathroom = photos.some(p =>
    p.alt?.toLowerCase().includes('bathroom') ||
    p.caption?.toLowerCase().includes('bathroom') ||
    p.src?.toLowerCase().includes('bathroom') ||
    p.src?.toLowerCase().includes('bath')
  )
  const hasView = photos.some(p =>
    p.alt?.toLowerCase().includes('view') ||
    p.caption?.toLowerCase().includes('view') ||
    p.src?.toLowerCase().includes('view')
  )


  const openGallery    = (index: number) => { setCurrentImageIndex(index); setShowGalleryModal(true) }
  const closeGallery   = () => setShowGalleryModal(false)
  const nextImage      = () => setCurrentImageIndex(prev => (prev + 1) % photos.length)
  const previousImage  = () => setCurrentImageIndex(prev => (prev - 1 + photos.length) % photos.length)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!showGalleryModal) return
    if (e.key === 'ArrowRight') nextImage()
    else if (e.key === 'ArrowLeft') previousImage()
    else if (e.key === 'Escape') closeGallery()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showGalleryModal, photos.length])

  const handleVideoClick = (videoElement: HTMLVideoElement, galleryIndex: number) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      setClickTimeout(null)
      openGallery(galleryIndex)
    } else {
      const timeout = setTimeout(() => {
        if (videoElement.paused) videoElement.play()
        else videoElement.pause()
        setClickTimeout(null)
      }, 300)
      setClickTimeout(timeout)
    }
  }

  const markVideoPlaying = (idx: number) =>
    setPlayingVideos(prev => { const s = new Set(prev); s.add(idx); return s })
  const markVideoPaused = (idx: number) =>
    setPlayingVideos(prev => { const s = new Set(prev); s.delete(idx); return s })

  const emailSubjectBase = `Suffolk University, Nathan R Miller Hall, Room ${config.roomNumber}`

  return (
    <div className="min-h-screen bg-[#f8f8f8] w-full relative md:flex md:h-screen md:overflow-hidden">
      {/* Left Panel */}
      <div ref={leftPanelRef} className="md:w-[600px] md:flex-shrink-0 md:overflow-y-auto md:h-screen md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">

        {/* Header Section */}
        <div ref={heroSectionRef} className="relative">
          {/* Navigation */}
          <div className="flex items-center justify-between p-3">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 flex items-center justify-center"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Room Title */}
          <div className="px-[14px] pb-[9px]">
            <h1 className="text-[22px] md:text-[27px] font-medium text-black tracking-[-0.264px] leading-normal">
              Room {config.roomNumber}
            </h1>
            <p className="text-[16px] md:text-[19px] font-normal text-[#70757a] tracking-[-0.192px] leading-normal">
              {config.dormName}
            </p>
          </div>

          {/* Buttons Bar */}
          <div className="flex gap-2 items-center px-3 mb-4 overflow-x-auto scrollbar-hide md:overflow-x-visible md:flex-wrap">
            <div className="bg-[rgba(188,145,44,0.57)] flex gap-[6px] h-[42px] items-center px-[18px] py-[11px] rounded-full flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
              <span className="text-white text-[16px] md:text-[18px] font-medium tracking-[-0.192px]">Student Verified</span>
            </div>
            <div className="bg-[#ecf3fe] flex gap-[6px] h-[42px] items-center px-[18px] py-[11px] rounded-full flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#1b6ef3" aria-hidden="true">
                <path d="M20 10V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v3c-1.1 0-2 .9-2 2v5h1.33L4 19h1l.67-2h12.67l.67 2h1l.67-2H22v-5c0-1.1-.9-2-2-2zm-9 0H6V7h5v3zm7 0h-5V7h5v3z"/>
              </svg>
              <span className="text-[#1b6ef3] text-[16px] md:text-[18px] font-medium tracking-[-0.192px]">Beds</span>
            </div>
            <div className="bg-[#ecf3fe] flex gap-[6px] items-center px-[18px] py-[10px] rounded-full flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 24 24" fill="#70757a" aria-hidden="true">
                <path d="M21 10H7V7c0-.55.45-1 1-1s1 .45 1 1h2c0-1.65-1.35-3-3-3S5 5.35 5 7v3H3c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h.28L5 21h14l1.72-7H21c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1zm-9 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
              <span className="text-[#70757a] text-[16px] md:text-[18px] font-normal tracking-[-0.192px]">Shared Bathroom</span>
            </div>
          </div>

          {/* Media Strip — Photo → 2 Cards → Photo → 2 Cards → Photo → 2 Cards */}
          <div className="flex gap-[9px] items-center px-3 py-3 mb-1 overflow-x-auto scrollbar-hide">

            {/* Photo 1 */}
            {mediaLoading ? (
              <div className="h-[337px] w-[190px] bg-gray-200 rounded-[14px] flex-shrink-0 animate-pulse" />
            ) : mediaError ? (
              <div className="h-[337px] w-[190px] bg-red-100 rounded-[14px] flex-shrink-0 flex items-center justify-center">
                <p className="text-red-600 text-sm text-center px-4">Failed to load media</p>
              </div>
            ) : photos.length > 0 ? (
              <div className="relative h-[337px] w-[190px] rounded-[14px] overflow-hidden flex-shrink-0 cursor-pointer">
                {photos[0].type === 'video' ? (
                  <>
                    <video
                      ref={(el) => { if (el) el.onclick = () => handleVideoClick(el, 0) }}
                      src={photos[0].src} className="w-full h-full object-cover" playsInline muted preload="metadata"
                      onPlay={() => markVideoPlaying(0)} onPause={() => markVideoPaused(0)} onEnded={() => markVideoPaused(0)}
                    />
                    <VideoPlayOverlay visible={!playingVideos.has(0)} />
                  </>
                ) : (
                  <div onClick={() => openGallery(0)}>
                    <RoomPhotoImage src={photos[0].src} alt={photos[0].alt || `Room ${config.roomNumber} - Photo 1`} fill className="object-cover" sizes="190px" />
                  </div>
                )}
              </div>
            ) : (
              <div className="relative h-[337px] w-[190px] rounded-[14px] overflow-hidden flex-shrink-0 bg-gray-100">
                <Image src={MILLER_HALL_PLACEHOLDER_THUMB} alt="" fill className="object-cover" sizes="190px" />
              </div>
            )}

            {/* Cards 1: Annual Cost + Room Type */}
            <div className="flex flex-col gap-[9px] flex-shrink-0">
              <button
                onClick={() => setShowRatesModal(true)}
                className="bg-white border border-[#dadce0] h-[164px] w-[400px] rounded-[15px] overflow-hidden shadow-md flex text-left hover:shadow-lg transition-shadow"
              >
                <div className="bg-[rgba(188,145,44,0.18)] w-[120px] flex-shrink-0 flex items-center justify-center">
                  <Image src="/money-bag-icon.png" alt="" width={84} height={84} />
                </div>
                <div className="flex flex-col justify-center px-[24px]">
                  <p className="text-[15px] md:text-[17px] font-normal text-[#70757a] tracking-[-0.18px] mb-[2px]">Annual Cost</p>
                  <p className="text-[34px] md:text-[38px] font-medium text-[#202124] tracking-[-0.408px] leading-tight">{config.annualCost}</p>
                  <p className="text-[16px] md:text-[18px] font-normal text-[#70757a] tracking-[-0.192px] mt-[2px]">Per Year</p>
                </div>
              </button>

              <a
                href="https://www.suffolk.edu/student-life/housing-dining/on-campus-housing/residence-halls/nathan-r-miller-hall"
                target="_blank" rel="noopener noreferrer"
                className="bg-white border border-[#dadce0] h-[164px] w-[400px] rounded-[15px] overflow-hidden shadow-md flex hover:shadow-lg transition-shadow"
              >
                <div className="bg-[#ecf3fe] w-[120px] flex-shrink-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="66" height="66" viewBox="0 0 24 24" fill="#1b6ef3" aria-hidden="true">
                    <path d="M20 10V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v3c-1.1 0-2 .9-2 2v5h1.33L4 19h1l.67-2h12.67l.67 2h1l.67-2H22v-5c0-1.1-.9-2-2-2zm-9 0H6V7h5v3zm7 0h-5V7h5v3z"/>
                  </svg>
                </div>
                <div className="flex flex-col justify-center px-[24px]">
                  <p className="text-[15px] md:text-[17px] font-normal text-[#70757a] tracking-[-0.18px] mb-[2px]">Room Type</p>
                  <p className="text-[34px] md:text-[38px] font-medium text-[#202124] tracking-[-0.408px] leading-tight whitespace-nowrap">{config.roomTypeName}</p>
                  <p className="text-[16px] md:text-[18px] font-normal text-[#70757a] tracking-[-0.192px] mt-[2px]">{config.bedCount} Beds</p>
                </div>
              </a>
            </div>

            {/* Photo 2 */}
            {photos.length > 1 ? (
              <div className="relative h-[338px] w-[254px] rounded-[14px] overflow-hidden flex-shrink-0 cursor-pointer">
                {photos[1].type === 'video' ? (
                  <>
                    <video ref={(el) => { if (el) el.onclick = () => handleVideoClick(el, 1) }} src={photos[1].src} className="w-full h-full object-cover" playsInline muted preload="metadata"
                      onPlay={() => markVideoPlaying(1)} onPause={() => markVideoPaused(1)} onEnded={() => markVideoPaused(1)} />
                    <VideoPlayOverlay visible={!playingVideos.has(1)} />
                  </>
                ) : (
                  <div onClick={() => openGallery(1)}>
                    <RoomPhotoImage src={photos[1].src} alt={photos[1].alt || `Room ${config.roomNumber} - Photo 2`} fill className="object-cover" sizes="254px" />
                  </div>
                )}
              </div>
            ) : (
              <div className="relative h-[338px] w-[254px] rounded-[14px] overflow-hidden flex-shrink-0 bg-gray-100">
                <Image src={MILLER_HALL_PLACEHOLDER_THUMB} alt="" fill className="object-cover" sizes="254px" />
              </div>
            )}

            {/* Cards 2: Layout + Bathroom */}
            <div className="flex flex-col gap-[9px] flex-shrink-0">
              <a
                href="https://www.suffolk.edu/student-life/housing-dining/on-campus-housing/residence-halls/nathan-r-miller-hall"
                target="_blank" rel="noopener noreferrer"
                className="bg-white border border-[#dadce0] h-[164px] w-[400px] rounded-[15px] overflow-hidden shadow-md flex hover:shadow-lg transition-shadow"
              >
                <div className="bg-[#aecbfa] w-[120px] flex-shrink-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="66" height="66" viewBox="0 0 24 24" fill="#1b6ef3" aria-hidden="true">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <div className="flex flex-col justify-center px-[24px]">
                  <p className="text-[15px] md:text-[17px] font-normal text-[#70757a] tracking-[-0.18px] mb-[2px]">Layout Type</p>
                  <p className="text-[34px] md:text-[38px] font-medium text-[#202124] tracking-[-0.408px] leading-tight whitespace-nowrap">{config.layoutType}</p>
                  <p className="text-[16px] md:text-[18px] font-normal text-[#70757a] tracking-[-0.192px] mt-[2px]">{config.layoutSubtitle}</p>
                </div>
              </a>

              <a
                href="https://www.suffolk.edu/student-life/housing-dining/on-campus-housing/residence-halls/nathan-r-miller-hall"
                target="_blank" rel="noopener noreferrer"
                className="bg-white border border-[#dadce0] h-[164px] w-[400px] rounded-[15px] overflow-hidden shadow-md flex hover:shadow-lg transition-shadow"
              >
                <div className="bg-[#ecf3fe] w-[120px] flex-shrink-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="66" height="66" viewBox="0 0 24 24" fill="#1b6ef3" aria-hidden="true">
                    <path d="M21 10H7V7c0-.55.45-1 1-1s1 .45 1 1h2c0-1.65-1.35-3-3-3S5 5.35 5 7v3H3c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h.28L5 21h14l1.72-7H21c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1zm-9 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  </svg>
                </div>
                <div className="flex flex-col justify-center px-[24px]">
                  <p className="text-[15px] md:text-[17px] font-normal text-[#70757a] tracking-[-0.18px] mb-[2px]">{config.bathroomType}</p>
                  <p className="text-[34px] md:text-[38px] font-medium text-[#202124] tracking-[-0.408px] leading-tight whitespace-nowrap">{config.bathroomName}</p>
                  <p className="text-[16px] md:text-[18px] font-normal text-[#70757a] tracking-[-0.192px] mt-[2px]">{config.bathroomDescription}</p>
                </div>
              </a>
            </div>

            {/* Photo 3 */}
            {photos.length > 2 ? (
              <div className="relative h-[338px] w-[254px] rounded-[14px] overflow-hidden flex-shrink-0 cursor-pointer">
                {photos[2].type === 'video' ? (
                  <>
                    <video ref={(el) => { if (el) el.onclick = () => handleVideoClick(el, 2) }} src={photos[2].src} className="w-full h-full object-cover" playsInline muted preload="metadata"
                      onPlay={() => markVideoPlaying(2)} onPause={() => markVideoPaused(2)} onEnded={() => markVideoPaused(2)} />
                    <VideoPlayOverlay visible={!playingVideos.has(2)} />
                  </>
                ) : (
                  <div onClick={() => openGallery(2)}>
                    <RoomPhotoImage src={photos[2].src} alt={photos[2].alt || `Room ${config.roomNumber} - Photo 3`} fill className="object-cover" sizes="254px" />
                  </div>
                )}
              </div>
            ) : (
              <div className="relative h-[338px] w-[254px] rounded-[14px] overflow-hidden flex-shrink-0 bg-gray-100">
                <Image src={MILLER_HALL_PLACEHOLDER_THUMB} alt="" fill className="object-cover" sizes="254px" />
              </div>
            )}

            {/* Cards 3: Thermostat + AC (Miller Hall constants) */}
            <div className="flex flex-col gap-[9px] flex-shrink-0">
              <a
                href="https://www.suffolk.edu/student-life/housing-dining/on-campus-housing/residence-halls/nathan-r-miller-hall"
                target="_blank" rel="noopener noreferrer"
                className="bg-white border border-[#dadce0] h-[164px] w-[400px] rounded-[15px] overflow-hidden shadow-md flex hover:shadow-lg transition-shadow"
              >
                <div className="bg-[#fce8e6] w-[120px] flex-shrink-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="66" height="66" viewBox="0 0 24 24" fill="#e53935" aria-hidden="true">
                    <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-2V5c0-.55.45-1 1-1s1 .45 1 1v1h-1v1h1v1h-1v1h1v2h-2z"/>
                  </svg>
                </div>
                <div className="flex flex-col justify-center px-[24px]">
                  <p className="text-[15px] md:text-[17px] font-normal text-[#70757a] tracking-[-0.18px] mb-[2px]">Personal</p>
                  <p className="text-[34px] md:text-[38px] font-medium text-[#202124] tracking-[-0.408px] leading-tight whitespace-nowrap">Thermostat</p>
                  <p className="text-[16px] md:text-[18px] font-normal text-[#70757a] tracking-[-0.192px] mt-[2px]">Control</p>
                </div>
              </a>

              <a
                href="https://www.suffolk.edu/student-life/housing-dining/on-campus-housing/residence-halls/nathan-r-miller-hall"
                target="_blank" rel="noopener noreferrer"
                className="bg-white border border-[#dadce0] h-[164px] w-[400px] rounded-[15px] overflow-hidden shadow-md flex hover:shadow-lg transition-shadow"
              >
                <div className="bg-[#e8f0fe] w-[120px] flex-shrink-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="66" height="66" viewBox="0 0 24 24" fill="#1b6ef3" aria-hidden="true">
                    <path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22v-2z"/>
                  </svg>
                </div>
                <div className="flex flex-col justify-center px-[24px]">
                  <p className="text-[15px] md:text-[17px] font-normal text-[#70757a] tracking-[-0.18px] mb-[2px]">Personal</p>
                  <p className="text-[34px] md:text-[38px] font-medium text-[#202124] tracking-[-0.408px] leading-tight whitespace-nowrap">Central Air</p>
                  <p className="text-[16px] md:text-[18px] font-normal text-[#70757a] tracking-[-0.192px] mt-[2px]">Control (AC)</p>
                </div>
              </a>
            </div>

            {/* Remaining photos */}
            {photos.slice(3).map((photo, index) => (
              <div key={index + 3} className="relative h-[338px] w-[254px] rounded-[14px] overflow-hidden flex-shrink-0 cursor-pointer">
                {photo.type === 'video' ? (
                  <>
                    <video ref={(el) => { if (el) el.onclick = () => handleVideoClick(el, index + 3) }} src={photo.src} className="w-full h-full object-cover" playsInline muted preload="metadata"
                      onPlay={() => markVideoPlaying(index + 3)} onPause={() => markVideoPaused(index + 3)} onEnded={() => markVideoPaused(index + 3)} />
                    <VideoPlayOverlay visible={!playingVideos.has(index + 3)} />
                  </>
                ) : (
                  <div onClick={() => openGallery(index + 3)}>
                    <RoomPhotoImage src={photo.src} alt={photo.alt || `Room ${config.roomNumber} - Photo ${index + 4}`} fill className="object-cover" sizes="254px" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* End hero section */}

        {/* Tab Bar */}
        <div
          className="bg-[#f8f8f8] border-t border-b border-[#dadce0] w-full"
        >
          <div className="flex items-start overflow-x-auto scrollbar-hide px-[14px] py-2 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-shrink-0 flex flex-col items-center gap-2 py-2 px-3 sm:px-4"
              >
                <span className={`text-[14px] sm:text-[16px] md:text-[18px] font-medium tracking-[-0.16px] whitespace-nowrap ${activeTab === tab ? "text-[#0b57d0]" : "text-[#5e5e5e]"}`}>
                  {tab}
                </span>
                {activeTab === tab && <div className="w-full min-w-[40px] h-[3px] bg-[#0b57d0] rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-[14px] pt-0 pb-4">

          {/* ── Overview ── */}
          {activeTab === "Overview" && (
            <div className="space-y-6">
              <div className="border-b border-[#e3e3e3]">
                <div className="flex items-center gap-8 h-[62px] px-4 py-5 border-b border-[#e3e3e3]">
                  <div className="flex-shrink-0 flex items-center justify-center min-w-[24px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#b05b00" aria-hidden="true">
                      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                    </svg>
                  </div>
                  <p className="text-[16px] md:text-[18px] font-medium text-[#b05b00] tracking-[-0.192px] flex-1">Student Verified</p>
                </div>

                <div className="flex items-center gap-8 h-[62px] px-4 py-5 border-b border-[#dadce0]">
                  <div className="flex-shrink-0 flex items-center justify-center min-w-[24px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#1b6ef3" aria-hidden="true">
                      <path d="M20 10V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v3c-1.1 0-2 .9-2 2v5h1.33L4 19h1l.67-2h12.67l.67 2h1l.67-2H22v-5c0-1.1-.9-2-2-2zm-9 0H6V7h5v3zm7 0h-5V7h5v3z"/>
                    </svg>
                  </div>
                  <p className="text-[16px] md:text-[18px] font-normal text-[#202124] tracking-[-0.192px] flex-1">
                    {config.roomTypeName} ({config.bedCount} Beds)
                  </p>
                </div>

                <div className="flex items-center gap-8 h-[62px] px-4 py-5 border-b border-[#dadce0]">
                  <div className="flex-shrink-0 flex items-center justify-center min-w-[24px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1b6ef3" aria-hidden="true">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                  </div>
                  <p className="text-[16px] md:text-[18px] font-normal text-[#202124] tracking-[-0.192px] flex-1">
                    {config.layoutType === "Suite" ? "In Suite" : "Individual Room"}
                  </p>
                </div>

                <button
                  onClick={() => setShowRatesModal(true)}
                  className="flex items-center gap-8 h-[79px] px-4 py-5 border-b border-[#dadce0] w-full text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 flex items-center justify-center min-w-[24px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1b6ef3" aria-hidden="true">
                      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] md:text-[18px] font-normal text-black tracking-[-0.192px]">{config.annualCost}</p>
                    <p className="text-[13px] md:text-[15px] text-[#757a7e]">
                      Reported by <span className="underline">Suffolk University</span>
                    </p>
                  </div>
                </button>
              </div>

              <div className="flex justify-center">
                <button className="bg-[rgba(27,110,243,0.71)] h-[31px] px-4 rounded-[10px] flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="white" className="transform rotate-180 scale-y-[-1]" aria-hidden="true">
                    <path d="M12 15.2c1.77 0 3.2-1.43 3.2-3.2S13.77 8.8 12 8.8 8.8 10.23 8.8 12s1.43 3.2 3.2 3.2zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                  </svg>
                  <span className="text-white text-[16px] font-medium tracking-[-0.16px]">Share Your Dorm Too</span>
                </button>
              </div>
            </div>
          )}

          {/* ── Room Plan ── */}
          {activeTab === "Room Plan" && (
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex gap-3">
                <div className="rounded-[18px] overflow-hidden shadow-md flex-shrink-0 w-[184px] h-[222px] bg-white/90 backdrop-blur-sm">
                  <Image src={config.floorPlanUrl} alt={`Room ${config.roomNumber} Floor Plan`} width={184} height={222} className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  <div className="bg-white/90 backdrop-blur-sm rounded-[14px] shadow-md px-4 py-3 flex items-center gap-3">
                    <div className="w-[36px] h-[36px] rounded-[10px] bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#1b6ef3" aria-hidden="true">
                        <path d="M20 10V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v3c-1.1 0-2 .9-2 2v5h1.33L4 19h1l.67-2h12.67l.67 2h1l.67-2H22v-5c0-1.1-.9-2-2-2zm-9 0H6V7h5v3zm7 0h-5V7h5v3z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-[#202124] leading-tight">{config.roomTypeName} ({config.bedCount} Beds)</p>
                      <p className="text-[12px] text-[#757a7e] leading-tight">Reported by <span className="underline">Student</span></p>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm rounded-[14px] shadow-md px-4 py-3 flex items-center gap-3">
                    <div className="w-[36px] h-[36px] rounded-[10px] bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1b6ef3" aria-hidden="true">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-[#202124] leading-tight">
                        {config.layoutType === "Suite" ? "In Suite" : "Individual Room"}
                      </p>
                      <p className="text-[12px] text-[#757a7e] leading-tight">{config.layoutSubtitle} + Bathroom</p>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm rounded-[14px] shadow-md px-4 py-3 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Dimensions</span>
                    </div>
                    <p className="text-[22px] font-bold text-gray-800">Coming Soon</p>
                    <div className="w-full h-[3px] bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div className="h-full w-[40%] bg-indigo-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[rgba(27,110,243,0.71)] hover:bg-[rgba(27,110,243,0.85)] transition-all rounded-[14px] py-3 px-5 flex items-center justify-between shadow-md">
                <p className="text-[18px] font-medium text-white">Reach Out If You Want to Help</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </button>
            </div>
          )}

          {/* ── Bathroom ── */}
          {activeTab === "Bathroom" && (
            <div className="relative pt-4">
              <div className="flex gap-3 mb-4">
                <div className="flex flex-col gap-3 flex-1">
                  <div className="bg-white/90 backdrop-blur-sm rounded-[14px] shadow-md px-4 py-3 flex items-center gap-3">
                    <div className="w-[36px] h-[36px] rounded-[10px] bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#1b6ef3" aria-hidden="true">
                        <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-[#202124] leading-tight">No Photos</p>
                      <p className="text-[12px] text-[#757a7e] leading-tight">Submitted</p>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm rounded-[14px] shadow-md px-4 py-3 flex items-center gap-3">
                    <div className="w-[36px] h-[36px] rounded-[10px] bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1b6ef3" aria-hidden="true">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-[#202124] leading-tight">In Suite</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const subject = `${emailSubjectBase}, Want to Help`
                    const body = `Hi,\n\nI would like to help contribute to the room information:\n\nRoom: ${config.roomNumber}\nDorm: ${config.dormName}\nCollege: Suffolk University\n\nI can help with:\n[Please describe how you'd like to help]\n\nThank you!`
                    window.location.href = `mailto:4wallsdorms@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                  }}
                  className="bg-[rgba(27,110,243,0.71)] hover:bg-[rgba(27,110,243,0.85)] transition-all rounded-[14px] shadow-md flex-1 flex items-center justify-center px-4 py-3"
                >
                  <p className="text-[18px] font-medium text-white leading-snug text-center">Reach Out If You Want to Help</p>
                </button>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-[14px] shadow-md px-4 py-3 flex items-center gap-3 mb-4">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-[18px]">🚿</span>
                </div>
                <p className="text-[15px] font-semibold text-[#202124] leading-tight">Average Semi Private Miller Bathroom</p>
              </div>

              {/* Bathroom filter buttons */}
              {(() => {
                const allThumb   = bathroomMedia[0]
                const photoThumb = bathroomMedia.find(m => m.type === 'image')
                const videoThumb = bathroomMedia.find(m => m.type === 'video')
                return (
                  <div className="flex gap-[10px] items-center overflow-x-auto scrollbar-hide mb-4">
                    {(["All", "Photos", "Videos"] as const).map(filter => {
                      const thumb = filter === "All" ? allThumb : filter === "Photos" ? photoThumb : videoThumb
                      return (
                        <button
                          key={filter}
                          onClick={() => setActiveBathroomFilter(filter)}
                          className={`relative w-[154px] h-[211px] rounded-[12px] overflow-hidden flex-shrink-0 ${activeBathroomFilter === filter ? "ring-2 ring-blue-500" : ""}`}
                        >
                          <div className="absolute inset-0 bg-[#c0c0c0] rounded-[12px]" />
                          {thumb && (
                            filter === "Videos" && thumb.type === 'video' ? (
                              <>
                                <video src={thumb.src} className="absolute inset-0 w-full h-full object-cover opacity-70 rounded-[12px]" muted playsInline preload="metadata" />
                                <VideoPlayOverlay />
                              </>
                            ) : (
                              <Image src={thumb.src} alt={filter} fill className="absolute inset-0 w-full h-full object-cover opacity-70 rounded-[12px]" />
                            )
                          )}
                          <div className="absolute left-3 bottom-2">
                            <p className="text-[22px] font-normal text-white tracking-[-0.264px]">{filter}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )
              })()}

              {/* Bathroom grid */}
              {bathroomLoading ? (
                <div className="grid grid-cols-2 gap-1">
                  {[...Array(4)].map((_, i) => <div key={i} className="w-full h-[180px] bg-gray-200 rounded-[5px] animate-pulse" />)}
                </div>
              ) : bathroomError ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <p className="text-[16px] font-medium text-[#5e5e5e] mb-1">Could not load bathroom media</p>
                  <p className="text-[13px] text-[#70757a]">{bathroomError}</p>
                </div>
              ) : (() => {
                const filtered = activeBathroomFilter === "All"
                  ? bathroomMedia
                  : bathroomMedia.filter(p => activeBathroomFilter === "Photos" ? p.type === 'image' : p.type === 'video')
                if (filtered.length === 0) return (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <p className="text-[18px] font-medium text-[#5e5e5e] tracking-[-0.216px] mb-2">
                      No {activeBathroomFilter === "All" ? "media" : activeBathroomFilter.toLowerCase()} yet
                    </p>
                    <p className="text-[14px] text-[#70757a]">Be the first to submit bathroom content for Miller Hall.</p>
                  </div>
                )
                const leftCol  = filtered.filter((_, i) => i % 2 === 0)
                const rightCol = filtered.filter((_, i) => i % 2 !== 0)
                return (
                  <div className="grid grid-cols-2 gap-1">
                    <div className="space-y-1">
                      {leftCol.map((item, i) => (
                        <div key={`bath-l-${i}`} className="w-full rounded-[5px] overflow-hidden bg-[#d9d9d9]">
                          {item.type === 'video' ? <video src={item.src} className="w-full h-auto" controls playsInline /> : <RoomPhotoImage src={item.src} alt={item.alt || `Bathroom ${i * 2 + 1}`} width={200} height={200} className="w-full h-auto" sizes="50vw" />}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      {rightCol.map((item, i) => (
                        <div key={`bath-r-${i}`} className="w-full rounded-[5px] overflow-hidden bg-[#d9d9d9]">
                          {item.type === 'video' ? <video src={item.src} className="w-full h-auto" controls playsInline /> : <RoomPhotoImage src={item.src} alt={item.alt || `Bathroom ${i * 2 + 2}`} width={200} height={200} className="w-full h-auto" sizes="50vw" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* ── Photos/Videos ── */}
          {activeTab === "Photos/Videos" && (
            <div className="relative">
              <div className="flex gap-[10px] items-center overflow-x-auto scrollbar-hide mb-4">
                {/* All */}
                <button onClick={() => setActivePhotoFilter("All")} className={`relative h-[165px] w-[127px] rounded-[14px] overflow-hidden flex-shrink-0 ${activePhotoFilter === "All" ? "ring-2 ring-blue-500" : ""}`}>
                  <div className="absolute inset-0 bg-[#ececec] rounded-[14px]" />
                  <Image src={filterThumbAll} alt="All" fill className="object-cover opacity-70" sizes="127px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-[14px]" />
                  <p className="absolute left-3 bottom-2 text-[22px] font-medium text-white tracking-[-0.264px]">All</p>
                </button>

                {/* Latest */}
                {(() => {
                  const thumb = photos[0]
                  return (
                    <button onClick={() => setActivePhotoFilter("Latest")} className={`relative h-[165px] w-[127px] rounded-[14px] bg-[#ececec] overflow-hidden flex-shrink-0 ${activePhotoFilter === "Latest" ? "ring-2 ring-blue-500" : ""}`}>
                      {thumb && (
                        thumb.type === 'video'
                          ? <video src={thumb.src} className="absolute inset-0 w-full h-full object-cover opacity-70" muted playsInline preload="metadata" />
                          : <Image src={thumb.src} alt="Latest" fill className="object-cover opacity-70" sizes="127px" />
                      )}
                      {thumb?.type === 'video' && <VideoPlayOverlay />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-[14px]" />
                      <div className="absolute left-3 bottom-2 w-[99px]">
                        <p className="text-[22px] font-medium text-white tracking-[-0.264px] leading-normal">Latest</p>
                        <p className="text-[11px] font-normal text-[#dadce0] tracking-[-0.132px] leading-normal">2024</p>
                      </div>
                    </button>
                  )
                })()}

                {hasPhotos && (
                  <button onClick={() => setActivePhotoFilter("Photos")} className={`relative h-[165px] w-[127px] rounded-[14px] overflow-hidden flex-shrink-0 ${activePhotoFilter === "Photos" ? "ring-2 ring-blue-500" : ""}`}>
                    <div className="absolute inset-0 bg-[#ececec] rounded-[14px]" />
                    <Image src={filterThumbPhotos} alt="Photos" fill className="object-cover opacity-70" sizes="127px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-[14px]" />
                    <p className="absolute left-3 bottom-2 text-[22px] font-medium text-white tracking-[-0.264px]">Photos</p>
                  </button>
                )}

                {hasVideos && (
                  <button onClick={() => setActivePhotoFilter("Videos")} className={`relative h-[165px] w-[127px] rounded-[14px] overflow-hidden flex-shrink-0 ${activePhotoFilter === "Videos" ? "ring-2 ring-blue-500" : ""}`}>
                    <div className="absolute inset-0 bg-[#ececec] rounded-[14px]" />
                    <Image src={filterThumbVideos} alt="Videos" fill className="object-cover opacity-70" sizes="127px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-[14px]" />
                    <p className="absolute left-3 bottom-2 text-[22px] font-medium text-white tracking-[-0.264px]">Videos</p>
                  </button>
                )}

                {/* Always show Bathroom filter */}
                <button onClick={() => setActivePhotoFilter("Bathroom")} className={`relative h-[165px] w-[127px] rounded-[14px] overflow-hidden flex-shrink-0 ${activePhotoFilter === "Bathroom" ? "ring-2 ring-blue-500" : ""}`}>
                  <div className="absolute inset-0 bg-[#ececec] rounded-[14px]" />
                  <Image src={filterThumbBathroom} alt="Bathroom" fill className="object-cover opacity-70" sizes="127px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-[14px]" />
                  <p className="absolute left-3 bottom-2 text-[22px] font-medium text-white tracking-[-0.264px]">Bathroom</p>
                </button>

                {hasView && (
                  <button onClick={() => setActivePhotoFilter("View")} className={`relative h-[165px] w-[127px] rounded-[14px] overflow-hidden flex-shrink-0 ${activePhotoFilter === "View" ? "ring-2 ring-blue-500" : ""}`}>
                    <div className="absolute inset-0 bg-[#ececec] rounded-[14px]" />
                    <Image src={filterThumbView} alt="View" fill className="object-cover opacity-70" sizes="127px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-[14px]" />
                    <p className="absolute left-3 bottom-2 text-[22px] font-medium text-white tracking-[-0.264px]">View</p>
                  </button>
                )}
              </div>

              {/* Section title divider */}
              <div className="relative mb-4">
                <div className="w-full h-px bg-[#d9d9d9] mb-12" />
                <div className="w-full h-px bg-[#d9d9d9]" />
                <div className="absolute left-4 top-2 bg-[#f8f8f8] px-1">
                  <h2 className="text-[24px] font-semibold text-black tracking-[-0.288px] leading-normal">{activePhotoFilter}</h2>
                </div>
              </div>

              {/* 2-column masonry grid */}
              <div className="grid grid-cols-2 gap-1 pr-0">
                <div className="space-y-1">
                  {filteredPhotos.slice(0, 3).map((photo, index) => {
                    const roundings = [
                      'rounded-tl-[10px] rounded-tr-[5px] rounded-bl-[5px] rounded-br-[5px]',
                      'rounded-[5px]',
                      'rounded-tl-[5px] rounded-tr-[5px] rounded-bl-[10px] rounded-br-[5px]',
                    ]
                    return (
                      <div key={`left-${index}`} className={`w-full ${roundings[index]} overflow-hidden bg-[#d9d9d9]`}>
                        {photo.type === 'video'
                          ? <video src={photo.src} className="w-full h-auto" controls playsInline />
                          : <RoomPhotoImage src={photo.src} alt={photo.alt || `Room ${config.roomNumber} - Photo ${index + 1}`} width={200} height={200} className="w-full h-auto" sizes="(max-width: 402px) 50vw, 200px" />
                        }
                      </div>
                    )
                  })}
                </div>
                <div className="space-y-1">
                  {filteredPhotos.slice(3, 6).map((photo, index) => {
                    const roundings = [
                      'rounded-tl-[5px] rounded-tr-[10px] rounded-bl-[5px] rounded-br-[5px]',
                      'rounded-[5px]',
                      'rounded-tl-[5px] rounded-tr-[5px] rounded-bl-[5px] rounded-br-[10px]',
                    ]
                    return (
                      <div key={`right-${index}`} className={`w-full ${roundings[index]} overflow-hidden bg-[#d9d9d9]`}>
                        {photo.type === 'video'
                          ? <video src={photo.src} className="w-full h-auto" controls playsInline />
                          : <RoomPhotoImage src={photo.src} alt={photo.alt || `Room ${config.roomNumber} - Photo ${index + 4}`} width={200} height={200} className="w-full h-auto" sizes="(max-width: 402px) 50vw, 200px" />
                        }
                      </div>
                    )
                  })}
                </div>
              </div>

              {filteredPhotos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <h3 className="text-[24px] font-medium text-[#5e5e5e] tracking-[-0.288px] mb-2">No {activePhotoFilter.toLowerCase()} found</h3>
                  <p className="text-[16px] font-normal text-[#70757a] tracking-[-0.192px] leading-normal text-center">There are currently no {activePhotoFilter.toLowerCase()} available for this room.</p>
                </div>
              )}
            </div>
          )}

          {/* ── Updates ── */}
          {activeTab === "Updates" && (
            <div className="relative">
              <div className="flex items-center mb-6">
                {(["4WallsDorms", "Students"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveUpdatesTab(t)}
                    className={`h-[29px] px-4 rounded-[5px] flex items-center justify-center mr-4 transition-colors ${activeUpdatesTab === t ? "bg-[rgba(217,217,217,0.8)] border-[0.3px] border-[rgba(0,0,0,0.03)] shadow-sm" : "bg-transparent hover:bg-gray-100"}`}
                  >
                    <p className={`text-[20px] font-normal tracking-[-0.24px] ${activeUpdatesTab === t ? "text-black" : "text-[#5e5e5e]"}`}>
                      {t === "4WallsDorms" ? "By 4WallsDorms" : "By Students"}
                    </p>
                  </button>
                ))}
              </div>

              <div className="w-full h-px bg-[#d9d9d9] mb-4" />

              {activeUpdatesTab === "4WallsDorms" && (
                <div className="bg-[#d9d9d9] border border-[rgba(0,0,0,0.2)] rounded-[10px] shadow-lg w-full overflow-hidden">
                  <div className="bg-[#d9d9d9] border-b border-[rgba(0,0,0,0.2)] h-[74px] rounded-t-[10px] flex items-center px-4">
                    <div className="w-[47px] h-[50px] mr-4 shrink-0 rounded-full bg-[rgba(188,145,44,0.57)] flex items-center justify-center overflow-hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[22px] font-medium text-black tracking-[-0.264px] leading-normal">Natalie</h3>
                      <p className="text-[16px] font-normal text-[#70757a] tracking-[-0.192px] leading-normal">Founder of 4WallsDorms</p>
                    </div>
                    <div className="w-[9px] h-[40px] shrink-0 flex flex-col items-center justify-center gap-[6px]">
                      <div className="w-[4px] h-[4px] rounded-full bg-[#70757a]" />
                      <div className="w-[4px] h-[4px] rounded-full bg-[#70757a]" />
                      <div className="w-[4px] h-[4px] rounded-full bg-[#70757a]" />
                    </div>
                  </div>

                  <div className="relative w-full aspect-[370/277]">
                    <Image src={filterThumbVideos} alt="Dorm room" fill sizes="100vw" className="object-cover" />
                  </div>

                  <div className="p-5 space-y-4">
                    <p className="text-[16px] font-medium text-black tracking-[-0.192px] leading-normal">I started this to help students like me.</p>
                    <p className="text-[16px] font-light text-black tracking-[-0.192px] leading-normal">After falling off my lofted bed on the first day of college.</p>
                    <p className="text-[18px] font-normal text-black tracking-[-0.216px] leading-normal">Made me start to think.</p>
                    <p className="text-[16px] font-light text-black tracking-[-0.192px] leading-normal">My second year having a room with mice and walls that did not go fully to the ceiling.</p>
                    <p className="text-[18px] font-normal text-black tracking-[-0.216px] leading-normal">Made me build the site</p>
                    <p className="text-[16px] font-light text-black tracking-[-0.192px] leading-normal">My third year room had no heat in Mass winter</p>
                    <p className="text-[18px] font-normal text-black tracking-[-0.216px] leading-normal">Made me think:</p>
                    <p className="text-[16px] font-medium italic text-black tracking-[-0.192px] leading-normal">Why does it have to be this way?</p>
                    <p className="text-[16px] font-light text-black tracking-[-0.192px] leading-normal">I would not move into an apartment without at least seeing photos.</p>
                    <p className="text-[16px] font-medium italic text-black tracking-[-0.192px] leading-normal">Why I am spending the same amount not to be able to see?.</p>

                    <div className="flex justify-center mt-6">
                      <button className="bg-[rgba(27,110,243,0.71)] h-[31px] w-[196px] rounded-[10px] flex items-center justify-center gap-2">
                        <div className="w-[23px] h-[23px] transform rotate-180 scale-y-[-1]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                            <path d="M12 15.2c1.77 0 3.2-1.43 3.2-3.2S13.77 8.8 12 8.8 8.8 10.23 8.8 12s1.43 3.2 3.2 3.2zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                          </svg>
                        </div>
                        <span className="text-white text-[16px] font-medium tracking-[-0.16px]">Share Your Dorm Too</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeUpdatesTab === "Students" && (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-lg p-8 w-full">
                    <h3 className="text-xl font-semibold text-gray-600 mb-4">No Student Updates Yet</h3>
                    <p className="text-gray-500 mb-6">Be the first student to share an update about Room {config.roomNumber}!</p>
                    <button
                      onClick={() => {
                        const subject = `${emailSubjectBase}, Share Your Experience`
                        const body = `Hi,\n\nI would like to share my experience about Room ${config.roomNumber}:\n\nRoom: ${config.roomNumber}\nDorm: ${config.dormName}\nCollege: Suffolk University\n\nMy Experience:\n[Please share your experience, tips, or information about this room]\n\nThank you!`
                        window.location.href = `mailto:4wallsdorms@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                      }}
                      className="bg-[#1b6ef3] text-white px-6 py-3 rounded-lg hover:bg-[#1557cc] transition-colors"
                    >
                      Share Your Experience
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* End tab content */}

        {/* Footer — Other Rooms */}
        <div className="px-[14px] py-8 mt-8 border-t border-gray-200">
          <div className="mb-8">
            <h2 className="text-[25px] font-bold text-black tracking-[-0.3px] mb-4">Other Rooms in Miller</h2>
            <div className="flex gap-3 w-full">
              {/* Floor plan thumbnail — opens modal */}
              <button
                onClick={() => setShowFloorPlanModal(true)}
                className="relative flex-[2] min-w-0 aspect-[248/291] rounded-[15px] overflow-hidden hover:opacity-90 transition-opacity"
              >
                <Image src={config.floorPlanUrl} alt="Floor plan" fill sizes="66vw" className="object-cover" />
              </button>

              {/* Other room cards */}
              <div className="flex flex-col gap-[2px] shadow-lg flex-1 min-w-0">
                {config.otherRooms.map((room) => (
                  <a key={room.id} href={room.link} className="relative flex-1 overflow-hidden block">
                    <Image src={room.image} alt={room.title} fill sizes="33vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-2 left-2">
                      <p className="text-white text-[25px] font-bold tracking-[-0.8px] leading-none">{room.id}</p>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-[20px] font-semibold tracking-[-0.8px] leading-none truncate">{room.title}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Floor Plan Modal ── */}
        {showFloorPlanModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
            <button onClick={() => setShowFloorPlanModal(false)} className="absolute top-4 right-4 z-60 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-2xl hover:bg-opacity-30 transition-colors">×</button>
            <div className="relative max-w-full max-h-full">
              <Image src={config.floorPlanUrl} alt={`Miller Hall Floor ${config.floor} Plan`} width={800} height={940} className="max-w-full max-h-full object-contain rounded-lg" />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
                <h3 className="text-lg font-semibold">Miller Hall — Floor {config.floor}</h3>
                <p className="text-sm opacity-90">Tap anywhere to close</p>
              </div>
            </div>
            <div className="absolute inset-0 -z-10" onClick={() => setShowFloorPlanModal(false)} />
          </div>
        )}

        {/* ── Rates Modal ── */}
        {showRatesModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={() => setShowRatesModal(false)}>
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto relative w-full" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowRatesModal(false)} className="absolute top-4 right-4 z-60 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xl transition-colors">×</button>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Suffolk University Dorm Rates 2025-26</h2>
                <div className="grid grid-cols-[2.5fr_1fr_1fr] gap-2 max-w-4xl mx-auto font-sans">
                  <div className="font-bold bg-gray-200 p-3 border-b-2 border-black">Room Type</div>
                  <div className="font-bold bg-gray-200 p-3 border-b-2 border-black">Annual Rate</div>
                  <div className="font-bold bg-gray-200 p-3 border-b-2 border-black">Per Semester Rate</div>

                  {[
                    ["Single Bedroom with kitchen", "20,956", "10,478"],
                    ["Double bedroom with kitchen", "20,120", "10,060"],
                    ["Triple bedroom with kitchen", "19,280", "9,640"],
                    ["Studio Double with kitchen", "20,120", "10,060"],
                    ["Studio Triple or Duplex Triple with kitchen", "19,280", "9,640"],
                    ["Duplex Quad with kitchen", "18,456", "9,228"],
                    ["Single Bedroom", "19,928", "9,964"],
                    ["Double Bedroom", "19,102", "9,551"],
                    ["Triple Bedroom", "18,286", "9,143"],
                    ["Quad Bedroom", "17,480", "8,740"],
                    ["5 person", "17,480", "8,740"],
                    ["6 person", "17,480", "8,740"],
                    ["8 person", "16,668", "8,334"],
                  ].map(([label, annual, semester], index) => {
                    const isCurrentType = annual === config.annualCost.replace('$', '').replace(',', '')
                    const bg = isCurrentType ? "bg-yellow-100" : "bg-white"
                    return (
                      <Fragment key={`rate-row-${index}-${label}`}>
                        <div className={`p-2 border-b border-gray-300 font-medium ${bg}`}>{label}</div>
                        <div className={`p-2 border-b border-gray-300 ${bg}`}>${annual}</div>
                        <div className={`p-2 border-b border-gray-300 ${bg}`}>${semester}</div>
                      </Fragment>
                    )
                  })}
                </div>
                <div className="mt-6 text-center">
                  <a href="https://www.suffolk.edu/about/directory/student-account-services/tuition-fees/tuition-rates-2025-26" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline text-sm">
                    Suffolk University Official Tuition Rates 2025-26
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Gallery Modal ── */}
        {showGalleryModal && photos.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col" onClick={closeGallery}>
            <div className="flex justify-end p-4 flex-shrink-0">
              <button onClick={closeGallery} className="text-white text-3xl hover:text-gray-300 w-10 h-10 flex items-center justify-center">×</button>
            </div>
            <div className="flex-1 flex items-center justify-center px-4 pb-20 relative min-h-0">
              {photos.length > 1 && (
                <button onClick={e => { e.stopPropagation(); previousImage() }} className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl sm:text-4xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">‹</button>
              )}
              {photos.length > 1 && (
                <button onClick={e => { e.stopPropagation(); nextImage() }} className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl sm:text-4xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">›</button>
              )}
              <div className="w-full h-full flex items-center justify-center px-12 sm:px-16" onClick={e => e.stopPropagation()}>
                {photos[currentImageIndex].type === 'video' ? (
                  <video src={photos[currentImageIndex].src} className="max-w-full max-h-full w-auto h-auto object-contain" controls autoPlay playsInline />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <RoomPhotoImage src={photos[currentImageIndex].src} alt={photos[currentImageIndex].alt || `Room ${config.roomNumber} - Photo ${currentImageIndex + 1}`} fill className="object-contain" sizes="(max-width: 768px) 100vw, 90vw" priority />
                  </div>
                )}
              </div>
            </div>
            {photos.length > 1 && (
              <div className="flex-shrink-0 pb-4 text-center">
                <div className="inline-block text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">{currentImageIndex + 1} / {photos.length}</div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* End left panel */}

      {/* Right Panel — Zoomable Floor Plan (md+) */}
      <div
        className="hidden md:block md:flex-1 relative bg-white overflow-hidden"
        onWheel={e => { if (leftPanelRef.current) leftPanelRef.current.scrollTop += e.deltaY }}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ cursor: floorPlanScale > 1 ? "grab" : "default" }}
          onMouseDown={handleFloorPlanMouseDown}
          onMouseMove={handleFloorPlanMouseMove}
          onMouseUp={handleFloorPlanMouseUp}
          onMouseLeave={handleFloorPlanMouseUp}
        >
          <div
            className="absolute inset-0 flex items-center justify-center p-6"
            style={{
              transform: `scale(${floorPlanScale}) translate(${floorPlanOffset.x / floorPlanScale}px, ${floorPlanOffset.y / floorPlanScale}px)`,
              transformOrigin: "center center",
              transition: floorPlanDragRef.current?.isDragging ? "none" : "transform 0.2s ease",
              userSelect: "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={config.floorPlanUrl} alt={`Miller Hall Floor ${config.floor} Plan`} draggable={false} className="max-w-full max-h-full object-contain select-none" />
          </div>
        </div>

        {/* Floor indicator */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-[14px] shadow-md px-4 py-3 w-[160px]">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-500 tracking-widest">{toOrdinal(config.floor)} Floor</span>
            <div className="flex items-baseline gap-[3px]">
              <span className="text-[22px] font-bold text-indigo-600 leading-none">{config.roomPositionOnFloor}</span>
              <span className="text-[14px] font-medium text-gray-400 leading-none">/</span>
              <span className="text-[14px] font-medium text-gray-400 leading-none">{config.roomsOnFloor}</span>
            </div>
          </div>
          <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
              style={{ width: `${(config.roomPositionOnFloor / config.roomsOnFloor) * 100}%` }}
            />
          </div>
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-[14px] shadow-md px-3 py-3 flex gap-2">
          <button aria-label="Zoom out" onClick={handleZoomOut} disabled={floorPlanScale <= MIN_SCALE} className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-30">
            <div className="bg-gray-600 rounded-full h-[3px] w-[16px]" />
          </button>
          <button aria-label="Zoom in" onClick={handleZoomIn} disabled={floorPlanScale >= MAX_SCALE} className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 transition-colors disabled:opacity-30 relative">
            <div className="bg-white rounded-full h-[3px] w-[16px] absolute" />
            <div className="bg-white rounded-full h-[16px] w-[3px] absolute" />
          </button>
        </div>
      </div>
    </div>
  )
}
