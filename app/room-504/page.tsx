"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useBackblazeRoomMedia } from "@/app/hooks/useBackblazeRoomMedia"
import { useBackblazeFolder } from "@/app/hooks/useBackblazeFolder"

// Image assets from Figma
const imgIcon = "https://www.figma.com/api/mcp/asset/413c5991-07a6-4e55-a5b4-8e8dac00545c"
const img4Floorplanmillersuffolk9 = "https://www.figma.com/api/mcp/asset/021ecc0a-a6ad-4461-bcdc-08d9b3c8f482"
const imgRectangle105 = "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-8.jpg"
const imgRectangle106 = "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-8.jpg"
const imgPhotoCameraFilledSvgrepoCom1 = "https://www.figma.com/api/mcp/asset/f68103fb-e07a-4951-a780-229a5c7bae83"
const imgImage1231 = "https://www.figma.com/api/mcp/asset/c2052f4a-6604-4ca6-8155-385b393776a3"
const imgImage611 = "https://www.figma.com/api/mcp/asset/f8432391-7578-44e7-b515-957080864be4"
const imgImage829 = "https://www.figma.com/api/mcp/asset/0eac0c08-3e2b-4d7c-8ab4-94adc1999cef"
const imgBed2SvgrepoCom1 = "https://www.figma.com/api/mcp/asset/f35d12af-7aee-4638-8c55-116beee505d4"
const imgMoneyBagSvgrepoCom1 = "https://www.figma.com/api/mcp/asset/548da9b9-d6a0-4641-bbe1-a2ffccc8a4f3"
const imgBathroomCleaningHousekeepingToiletSvgrepoCom1 = "https://www.figma.com/api/mcp/asset/ebf08e4d-fad3-4ea0-91b6-080d234f630a"
const imgUserMultipleSvgrepoCom1 = "https://www.figma.com/api/mcp/asset/8a436a4c-3131-4b77-9b90-334f192b8d99"
const img504Millersuffolk12 = "https://www.figma.com/api/mcp/asset/fd85d547-ceaf-42f2-9ef6-1e9b0e580b39"
const imgSnowAlt1SvgrepoCom1 = "https://www.figma.com/api/mcp/asset/5ac984a7-0ea6-4459-b368-2b69a6f07935"
const imgThermometerSvgrepoCom1 = "https://www.figma.com/api/mcp/asset/5616f374-c99e-4326-9626-7a521240eb0d"
const imgGroup264 = "https://www.figma.com/api/mcp/asset/cc7d259e-3f91-4f81-9a65-b7a200e7790b"
const imgVector = "https://www.figma.com/api/mcp/asset/a280e891-b3af-4500-82b9-3a47154dc3cf"
const imgGroup195 = "https://www.figma.com/api/mcp/asset/7e37f258-8105-4292-b6af-aaff41b1cd04"
const imgGroup199 = "https://www.figma.com/api/mcp/asset/f0e7c894-73e9-45d8-abac-21d493b89270"
const imgGroup198 = "https://www.figma.com/api/mcp/asset/632d6a8d-520d-45b5-af27-2bf6c838392d"
const imgVector1 = "https://www.figma.com/api/mcp/asset/31c88173-1323-4010-817e-f587bd0deda6"
const imgIcon1 = "https://www.figma.com/api/mcp/asset/3963417d-11bc-4c22-8509-79ecf045f665"
const imgDoorEmoji = "https://www.figma.com/api/mcp/asset/84583ca2-ddcf-4f91-ba35-6e5d6f23d90c"
const imgCurrencyEmoji = "https://www.figma.com/api/mcp/asset/a6dea601-9ea5-4178-abc2-4ff97fef4c72"
const imgEditEmoji = "https://www.figma.com/api/mcp/asset/17ad7b25-59d0-436c-90b4-ae8d0ba0d774"
const imgInSuiteEmoji = "https://www.figma.com/api/mcp/asset/fe89d1a7-adc2-4dd9-aaa6-5c76c1f5d0c7"

// Floor plan rule: the right panel always shows the floor plan for the floor the room is on.
// Room 504 is on floor 5 → use the floor 5 plan.
const imgFloorPlanForRoom = "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/5floorplanmillersuffolk.jpg"

// Room Plan assets
const imgImage8RoomPlan = "https://www.figma.com/api/mcp/asset/6a9c3dbd-c20b-4565-9ff4-fbd37f5f048e"
const imgGroup199RoomPlan = "https://www.figma.com/api/mcp/asset/c5d05af8-6d7b-4918-8ef6-ae7bbf5e9e1e"
const imgVectorRoomPlan = "https://www.figma.com/api/mcp/asset/f30ec3a6-3614-4493-82fd-71c99046e824"
const imgGroup195RoomPlan = "https://www.figma.com/api/mcp/asset/62de5bb8-7266-4652-b87f-5b959b58e89d"
const imgArrow1 = "https://www.figma.com/api/mcp/asset/8aaba230-db74-401b-8f19-75fff3238e55"

// Bathroom assets
const imgPhotoUploadSvgrepoCom11 = "https://www.figma.com/api/mcp/asset/fda3df7c-4914-443a-b387-a27563f4e0aa"
const imgBathr = "https://www.figma.com/api/mcp/asset/5aa41fc7-40ee-4c4a-943e-9832d2e7f752"
const imgPicture1 = "https://www.figma.com/api/mcp/asset/3f821368-02ad-4f63-999e-f3194268f28e"
const imgGroup195Bathroom = "https://www.figma.com/api/mcp/asset/b9d3f129-1c82-4606-b68f-856e15f42069"

// Photos/Videos assets
const imgAll = "https://www.figma.com/api/mcp/asset/24b4ea24-4125-44aa-b523-9a28833acbb3"
const imgPhotos = "https://www.figma.com/api/mcp/asset/313c64c1-900d-472a-abb6-f0e54ac5ed70"
const imgVideos = "https://www.figma.com/api/mcp/asset/436334e5-d97d-4aa8-ac05-3de017dd886a"
const imgBathroom = "https://www.figma.com/api/mcp/asset/4b31908c-11ee-49b7-997d-4eb2d98892dc"
const imgView = "https://www.figma.com/api/mcp/asset/849d483f-694e-4fe5-b6e2-942b299394db"

// Updates assets
const imgPhotoCameraFilledSvgrepoCom1Updates = "https://www.figma.com/api/mcp/asset/0b8a5939-1a54-431b-aaa6-08fa712769bd"
const imgSu10West407BViewFromTheDoorWithClosetBedDrawEmpty1 = "https://www.figma.com/api/mcp/asset/f354d222-a106-4bd1-96ac-466ac45ceeaa"
const imgEllipse186 = "https://www.figma.com/api/mcp/asset/6ed44e64-5b05-4985-bee9-cdf57d8782de"
const imgGroup255 = "https://www.figma.com/api/mcp/asset/00a702e4-ab86-4c91-932b-226b12f9f8d5"

type TabType = "Overview" | "Room Plan" | "Bathroom" | "Photos/Videos" | "Updates"

const tabs: TabType[] = ["Overview", "Room Plan", "Bathroom", "Photos/Videos", "Updates"]

const otherRooms = [
  { id: "406", title: "Double Suite", image: imgRectangle105 },
  { id: "608", title: "Double Suite", image: imgRectangle106 },
  { id: "702", title: "Double Suite", image: imgRectangle106 }
]

export default function Room504Page() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("Overview")
  const [isTabBarSticky, setIsTabBarSticky] = useState(false)
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false)
  const [showRatesModal, setShowRatesModal] = useState(false)
  const [activeUpdatesTab, setActiveUpdatesTab] = useState<"4WallsDorms" | "Students">("4WallsDorms")
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activePhotoFilter, setActivePhotoFilter] = useState<"Latest" | "All" | "Photos" | "Videos" | "Bathroom" | "View">("Latest")
  const [activeBathroomFilter, setActiveBathroomFilter] = useState<"All" | "Photos" | "Videos">("All")
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null)
  const tabBarRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLDivElement>(null)
  const leftPanelRef = useRef<HTMLDivElement>(null)

  // Floor plan zoom + pan state
  const [floorPlanScale, setFloorPlanScale] = useState(1)
  const [floorPlanOffset, setFloorPlanOffset] = useState({ x: 0, y: 0 })
  const floorPlanDragRef = useRef<{ isDragging: boolean; startX: number; startY: number; originX: number; originY: number }>({ isDragging: false, startX: 0, startY: 0, originX: 0, originY: 0 })

  const ZOOM_STEP = 0.25
  const MIN_SCALE = 0.5
  const MAX_SCALE = 4

  function handleZoomIn() {
    setFloorPlanScale(s => Math.min(s + ZOOM_STEP, MAX_SCALE))
  }
  function handleZoomOut() {
    setFloorPlanScale(s => {
      const next = Math.max(s - ZOOM_STEP, MIN_SCALE)
      // Reset offset if we return to base scale
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
  function handleFloorPlanMouseUp() {
    floorPlanDragRef.current.isDragging = false
  }

  // Fetch real media from Backblaze
  const { photos, loading: mediaLoading, error: mediaError } = useBackblazeRoomMedia("504", "Miller")

  // Fetch bathroom media from the shared Miller bathroom folder
  const { media: bathroomMedia, loading: bathroomLoading, error: bathroomError } = useBackblazeFolder(
    "Suffolk University Dorms/Miller/Average Miller Semi Private Bathroom/"
  )
  
  // Debug logging
  useEffect(() => {
    console.log("🏠 Room 504 Media Status:")
    console.log("  Loading:", mediaLoading)
    console.log("  Error:", mediaError)
    console.log("  Photos count:", photos.length)
    if (photos.length > 0) {
      console.log("  First photo:", photos[0])
    }
  }, [photos, mediaLoading, mediaError])

  // Filter photos based on active filter
  const getFilteredPhotos = () => {
    switch (activePhotoFilter) {
      case "Latest":
      case "All":
        return photos // Same content for both as requested
      case "Photos":
        return photos.filter(photo => photo.type === 'image')
      case "Videos":
        return photos.filter(photo => photo.type === 'video')
      case "Bathroom":
        // Filter for bathroom-related photos (you can adjust this logic)
        return photos.filter(photo => 
          photo.alt?.toLowerCase().includes('bathroom') || 
          photo.caption?.toLowerCase().includes('bathroom') ||
          photo.src?.toLowerCase().includes('bathroom') ||
          photo.src?.toLowerCase().includes('bath')
        )
      case "View":
        // Filter for view-related photos (you can adjust this logic)
        return photos.filter(photo => 
          photo.alt?.toLowerCase().includes('view') || 
          photo.caption?.toLowerCase().includes('view') ||
          photo.src?.toLowerCase().includes('view')
        )
      default:
        return photos
    }
  }

  const filteredPhotos = getFilteredPhotos()

  // Check if each filter category has content
  const hasPhotos = photos.some(photo => photo.type === 'image')
  const hasVideos = photos.some(photo => photo.type === 'video')
  const hasBathroom = photos.some(photo => 
    photo.alt?.toLowerCase().includes('bathroom') || 
    photo.caption?.toLowerCase().includes('bathroom') ||
    photo.src?.toLowerCase().includes('bathroom') ||
    photo.src?.toLowerCase().includes('bath')
  )
  const hasView = photos.some(photo => 
    photo.alt?.toLowerCase().includes('view') || 
    photo.caption?.toLowerCase().includes('view') ||
    photo.src?.toLowerCase().includes('view')
  )

  // Debug: Log what we're checking for bathroom detection
  console.log('🛁 Bathroom detection debug:')
  console.log('  Total photos:', photos.length)
  console.log('  Has bathroom photos:', hasBathroom)
  photos.forEach((photo, index) => {
    const alt = photo.alt?.toLowerCase() || ''
    const caption = photo.caption?.toLowerCase() || ''
    const src = photo.src?.toLowerCase() || ''
    const hasBathroomKeywords = alt.includes('bathroom') || caption.includes('bathroom') || src.includes('bathroom') || src.includes('bath')
    console.log(`  Photo ${index + 1}:`, { 
      src: photo.src.split('/').pop(), 
      alt, 
      caption, 
      hasBathroomKeywords 
    })
  })

  useEffect(() => {
    const handleScroll = () => {
      if (heroSectionRef.current) {
        const heroRect = heroSectionRef.current.getBoundingClientRect()
        setIsTabBarSticky(heroRect.bottom <= 0)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab)
  }

  const openFloorPlanModal = () => {
    setShowFloorPlanModal(true)
  }

  const closeFloorPlanModal = () => {
    setShowFloorPlanModal(false)
  }

  const openRatesModal = () => {
    setShowRatesModal(true)
  }

  const closeRatesModal = () => {
    setShowRatesModal(false)
  }

  const openGallery = (index: number) => {
    setCurrentImageIndex(index)
    setShowGalleryModal(true)
  }

  const closeGallery = () => {
    setShowGalleryModal(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photos.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!showGalleryModal) return
    
    if (e.key === 'ArrowRight') {
      nextImage()
    } else if (e.key === 'ArrowLeft') {
      previousImage()
    } else if (e.key === 'Escape') {
      closeGallery()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showGalleryModal, photos.length])

  // Handle video click - single click plays/pauses, double click opens gallery
  const handleVideoClick = (videoElement: HTMLVideoElement, galleryIndex: number) => {
    if (clickTimeout) {
      // Double click - clear timeout and open gallery
      clearTimeout(clickTimeout)
      setClickTimeout(null)
      openGallery(galleryIndex)
    } else {
      // Single click - set timeout to play/pause video
      const timeout = setTimeout(() => {
        if (videoElement.paused) {
          videoElement.play()
        } else {
          videoElement.pause()
        }
        setClickTimeout(null)
      }, 300) // 300ms delay to detect double click
      setClickTimeout(timeout)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] w-full relative md:flex md:h-screen md:overflow-hidden">
      {/* Left Panel - phone layout, scrollable vertically on md+ */}
      <div ref={leftPanelRef} className="md:w-[600px] md:flex-shrink-0 md:overflow-y-auto md:h-screen md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">
      {/* Header Section */}
      <div ref={heroSectionRef} className="relative">
        {/* Header Navigation */}
        <div className="flex items-center justify-between p-3">
          <button
            onClick={() => router.back()}
            className="w-12 h-12 flex items-center justify-center"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Room Title */}
        <div className="px-[14px] pb-[9px]">
          <h1 className="text-[22px] md:text-[27px] font-medium text-black tracking-[-0.264px] leading-normal">
            Room 504
          </h1>
          <p className="text-[16px] md:text-[19px] font-normal text-[#70757a] tracking-[-0.192px] leading-normal">
            Nathan R Miller Hall
          </p>
        </div>

        {/* Buttons Bar */}
        <div className="flex gap-2 items-center px-3 mb-4 overflow-x-auto scrollbar-hide md:overflow-x-visible md:flex-wrap">
          <div className="bg-[rgba(188,145,44,0.57)] flex gap-[6px] h-[42px] items-center px-[18px] py-[11px] rounded-full flex-shrink-0">
            <Image src={imgImage1231} alt="" width={21} height={21} />
            <span className="text-white text-[16px] md:text-[18px] font-medium tracking-[-0.192px]">
              Student Verified
            </span>
          </div>
          <div className="bg-[#ecf3fe] flex gap-[6px] h-[42px] items-center px-[18px] py-[11px] rounded-full flex-shrink-0">
            <Image src={imgImage611} alt="" width={14} height={14} />
            <span className="text-[#1b6ef3] text-[16px] md:text-[18px] font-medium tracking-[-0.192px]">
              Beds
            </span>
          </div>
          <div className="bg-[#ecf3fe] flex gap-[6px] items-center px-[18px] py-[10px] rounded-full flex-shrink-0">
            <Image src={imgImage829} alt="" width={21} height={22} />
            <span className="text-[#70757a] text-[16px] md:text-[18px] font-normal tracking-[-0.192px]">
              Shared Bathroom
            </span>
          </div>
        </div>

        {/* Media Section - Horizontally Scrollable with Photo/Card Pattern */}
        <div className="flex gap-[9px] items-center px-3 py-3 mb-1 overflow-x-auto scrollbar-hide">
          {/* Pattern: Photo → 2 Cards → Photo → 2 Cards → Photo → 2 Cards */}
          
          {/* First Photo/Video */}
          {mediaLoading ? (
            <div className="h-[337px] w-[190px] bg-gray-200 rounded-[14px] flex-shrink-0 animate-pulse" />
          ) : mediaError ? (
            <div className="h-[337px] w-[190px] bg-red-100 rounded-[14px] flex-shrink-0 flex items-center justify-center">
              <p className="text-red-600 text-sm text-center px-4">Failed to load media</p>
            </div>
          ) : photos.length > 0 ? (
            <div className="relative h-[337px] w-[190px] rounded-[14px] overflow-hidden flex-shrink-0 cursor-pointer">
              {photos[0].type === 'video' ? (
                <video 
                  ref={(el) => {
                    if (el) {
                      el.onclick = () => handleVideoClick(el, 0)
                    }
                  }}
                  src={photos[0].src} 
                  className="w-full h-full object-cover"
                  playsInline
                />
              ) : (
                <div onClick={() => openGallery(0)}>
                  <Image 
                    src={photos[0].src} 
                    alt={photos[0].alt || "Room 504 - Photo 1"}
                    fill
                    className="object-cover"
                    sizes="190px"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="h-[337px] w-[190px] bg-gray-100 rounded-[14px] flex-shrink-0 flex items-center justify-center">
              <p className="text-gray-500 text-sm text-center px-4">No media found</p>
            </div>
          )}
          
          {/* First Set of Cards - Money & Beds */}
          <div className="flex flex-col gap-[9px] flex-shrink-0">
            {/* Money Card */}
            <button
              onClick={openRatesModal}
              className="bg-white border border-[#dadce0] h-[164px] w-[400px] rounded-[15px] overflow-hidden shadow-md flex text-left hover:shadow-lg transition-shadow"
            >
              <div className="bg-[rgba(188,145,44,0.18)] w-[120px] flex-shrink-0 flex items-center justify-center">
                <Image src="/money-bag-icon.png" alt="" width={84} height={84} />
              </div>
              <div className="flex flex-col justify-center px-[24px]">
                <p className="text-[15px] md:text-[17px] font-normal text-[#70757a] tracking-[-0.18px] mb-[2px]">Annual Cost</p>
                <p className="text-[34px] md:text-[38px] font-medium text-[#202124] tracking-[-0.408px] leading-tight">$19,102</p>
                <p className="text-[16px] md:text-[18px] font-normal text-[#70757a] tracking-[-0.192px] mt-[2px]">Per Year</p>
              </div>
            </button>
            
            {/* Beds Card */}
            <a href="https://www.suffolk.edu/student-life/housing-dining/on-campus-housing/residence-halls/nathan-r-miller-hall" target="_blank" rel="noopener noreferrer" className="bg-white border border-[#dadce0] h-[164px] w-[400px] rounded-[15px] overflow-hidden shadow-md flex hover:shadow-lg transition-shadow">
              <div className="bg-[#ecf3fe] w-[120px] flex-shrink-0 flex items-center justify-center">
                <Image src={imgBed2SvgrepoCom1} alt="" width={66} height={66} />
              </div>
              <div className="flex flex-col justify-center px-[24px]">
                <p className="text-[15px] md:text-[17px] font-normal text-[#70757a] tracking-[-0.18px] mb-[2px]">Room Type</p>
                <p className="text-[34px] md:text-[38px] font-medium text-[#202124] tracking-[-0.408px] leading-tight whitespace-nowrap">Double</p>
                <p className="text-[16px] md:text-[18px] font-normal text-[#70757a] tracking-[-0.192px] mt-[2px]">2 Beds</p>
              </div>
            </a>
          </div>

          {/* Second Photo/Video */}
          {photos.length > 1 ? (
            <div className="relative h-[338px] w-[254px] rounded-[14px] overflow-hidden flex-shrink-0 cursor-pointer">
              {photos[1].type === 'video' ? (
                <video 
                  ref={(el) => {
                    if (el) {
                      el.onclick = () => handleVideoClick(el, 1)
                    }
                  }}
                  src={photos[1].src} 
                  className="w-full h-full object-cover"
                  playsInline
                />
              ) : (
                <div onClick={() => openGallery(1)}>
                  <Image 
                    src={photos[1].src} 
                    alt={photos[1].alt || "Room 504 - Photo 2"}
                    fill
                    className="object-cover"
                    sizes="254px"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="h-[338px] w-[254px] bg-gray-100 rounded-[14px] flex-shrink-0 flex items-center justify-center">
              <p className="text-gray-500 text-xs text-center px-4">Photo 2</p>
            </div>
          )}

          {/* Second Set of Cards - Suite & Bathroom */}
          <div className="flex flex-col gap-[9px] flex-shrink-0">
            {/* Suite Type Card */}
            <a href="https://www.suffolk.edu/student-life/housing-dining/on-campus-housing/residence-halls/nathan-r-miller-hall" target="_blank" rel="noopener noreferrer" className="bg-white border border-[#dadce0] h-[164px] w-[400px] rounded-[15px] overflow-hidden shadow-md flex hover:shadow-lg transition-shadow">
              <div className="bg-[#aecbfa] w-[120px] flex-shrink-0 flex items-center justify-center">
                <Image src={imgUserMultipleSvgrepoCom1} alt="" width={66} height={66} />
              </div>
              <div className="flex flex-col justify-center px-[24px]">
                <p className="text-[15px] md:text-[17px] font-normal text-[#70757a] tracking-[-0.18px] mb-[2px]">Layout Type</p>
                <p className="text-[34px] md:text-[38px] font-medium text-[#202124] tracking-[-0.408px] leading-tight whitespace-nowrap">Suite</p>
                <p className="text-[16px] md:text-[18px] font-normal text-[#70757a] tracking-[-0.192px] mt-[2px]">2 Rooms</p>
              </div>
            </a>
            
            {/* Bathroom Card */}
            <a href="https://www.suffolk.edu/student-life/housing-dining/on-campus-housing/residence-halls/nathan-r-miller-hall" target="_blank" rel="noopener noreferrer" className="bg-white border border-[#dadce0] h-[164px] w-[400px] rounded-[15px] overflow-hidden shadow-md flex hover:shadow-lg transition-shadow">
              <div className="bg-[#ecf3fe] w-[120px] flex-shrink-0 flex items-center justify-center">
                <Image src={imgBathroomCleaningHousekeepingToiletSvgrepoCom1} alt="" width={66} height={66} />
              </div>
              <div className="flex flex-col justify-center px-[24px]">
                <p className="text-[15px] md:text-[17px] font-normal text-[#70757a] tracking-[-0.18px] mb-[2px]">Shared</p>
                <p className="text-[34px] md:text-[38px] font-medium text-[#202124] tracking-[-0.408px] leading-tight whitespace-nowrap">Bathroom</p>
                <p className="text-[16px] md:text-[18px] font-normal text-[#70757a] tracking-[-0.192px] mt-[2px]">Semi-Private</p>
              </div>
            </a>
          </div>

          {/* Third Photo/Video */}
          {photos.length > 2 ? (
            <div className="relative h-[338px] w-[254px] rounded-[14px] overflow-hidden flex-shrink-0 cursor-pointer">
              {photos[2].type === 'video' ? (
                <video 
                  ref={(el) => {
                    if (el) {
                      el.onclick = () => handleVideoClick(el, 2)
                    }
                  }}
                  src={photos[2].src} 
                  className="w-full h-full object-cover"
                  playsInline
                />
              ) : (
                <div onClick={() => openGallery(2)}>
                  <Image 
                    src={photos[2].src} 
                    alt={photos[2].alt || "Room 504 - Photo 3"}
                    fill
                    className="object-cover"
                    sizes="254px"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="h-[338px] w-[254px] bg-gray-100 rounded-[14px] flex-shrink-0 flex items-center justify-center">
              <p className="text-gray-500 text-xs text-center px-4">Photo 3</p>
            </div>
          )}

          {/* Third Set of Cards - Thermostat & AC */}
          <div className="flex flex-col gap-[9px] flex-shrink-0">
            {/* Personal Thermostat Card */}
            <a href="https://www.suffolk.edu/student-life/housing-dining/on-campus-housing/residence-halls/nathan-r-miller-hall" target="_blank" rel="noopener noreferrer" className="bg-white border border-[#dadce0] h-[164px] w-[400px] rounded-[15px] overflow-hidden shadow-md flex hover:shadow-lg transition-shadow">
              <div className="bg-[#fce8e6] w-[120px] flex-shrink-0 flex items-center justify-center">
                <Image src={imgThermometerSvgrepoCom1} alt="" width={66} height={66} />
              </div>
              <div className="flex flex-col justify-center px-[24px]">
                <p className="text-[15px] md:text-[17px] font-normal text-[#70757a] tracking-[-0.18px] mb-[2px]">Personal</p>
                <p className="text-[34px] md:text-[38px] font-medium text-[#202124] tracking-[-0.408px] leading-tight whitespace-nowrap">Thermostat</p>
                <p className="text-[16px] md:text-[18px] font-normal text-[#70757a] tracking-[-0.192px] mt-[2px]">Control</p>
              </div>
            </a>
            
            {/* Personal Control of AC Card */}
            <a href="https://www.suffolk.edu/student-life/housing-dining/on-campus-housing/residence-halls/nathan-r-miller-hall" target="_blank" rel="noopener noreferrer" className="bg-white border border-[#dadce0] h-[164px] w-[400px] rounded-[15px] overflow-hidden shadow-md flex hover:shadow-lg transition-shadow">
              <div className="bg-[#e8f0fe] w-[120px] flex-shrink-0 flex items-center justify-center">
                <Image src={imgSnowAlt1SvgrepoCom1} alt="" width={66} height={66} />
              </div>
              <div className="flex flex-col justify-center px-[24px]">
                <p className="text-[15px] md:text-[17px] font-normal text-[#70757a] tracking-[-0.18px] mb-[2px]">Personal</p>
                <p className="text-[34px] md:text-[38px] font-medium text-[#202124] tracking-[-0.408px] leading-tight whitespace-nowrap">Central Air</p>
                <p className="text-[16px] md:text-[18px] font-normal text-[#70757a] tracking-[-0.192px] mt-[2px]">Control (AC)</p>
              </div>
            </a>
          </div>

          {/* Continue pattern with remaining photos */}
          {photos.slice(3).map((photo, index) => (
            <div 
              key={index + 3} 
              className="relative h-[338px] w-[254px] rounded-[14px] overflow-hidden flex-shrink-0 cursor-pointer"
            >
              {photo.type === 'video' ? (
                <video 
                  ref={(el) => {
                    if (el) {
                      el.onclick = () => handleVideoClick(el, index + 3)
                    }
                  }}
                  src={photo.src} 
                  className="w-full h-full object-cover"
                  playsInline
                />
              ) : (
                <div onClick={() => openGallery(index + 3)}>
                  <Image 
                    src={photo.src} 
                    alt={photo.alt || `Room 504 - Photo ${index + 4}`}
                    fill
                    className="object-cover"
                    sizes="254px"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tab Bar - Becomes Sticky */}
      <div 
        ref={tabBarRef}
        className={`${
          isTabBarSticky 
            ? "fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-[#f8f8f8] shadow-sm md:sticky md:top-0 md:left-auto md:transform-none" 
            : "relative"
        } w-full border-t border-b border-[#dadce0]`}
      >
        <div className="flex items-start px-[14px] py-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className="flex-1 flex flex-col items-center gap-2 py-2"
            >
              <span 
                className={`text-[18px] font-medium tracking-[-0.192px] text-center ${
                  activeTab === tab ? "text-[#0b57d0]" : "text-[#5e5e5e]"
                }`}
              >
                {tab}
              </span>
              {activeTab === tab && (
                <div className="w-full max-w-[65px] h-[3px] bg-[#0b57d0] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Spacer when tab bar is sticky */}
      {isTabBarSticky && <div className="h-[60px]" />}

      {/* Tab Content Area */}
      <div className="px-[14px] pt-0 pb-4">
        {activeTab === "Overview" && (
          <div className="space-y-6">
            {/* Overview Content */}
            <div className="border-b border-[#e3e3e3]">
              <div className="flex items-center gap-8 h-[62px] px-4 py-5 border-b border-[#e3e3e3]">
                <div className="flex-shrink-0 flex items-center justify-center min-w-[24px]">
                  <Image src={imgImage1231} alt="" width={22} height={22} />
                </div>
                <p className="text-[16px] md:text-[18px] font-medium text-[#b05b00] tracking-[-0.192px] flex-1">
                  Student Verified
                </p>
              </div>
              
              <div className="flex items-center gap-8 h-[62px] px-4 py-5 border-b border-[#dadce0]">
                <div className="flex-shrink-0 flex items-center justify-center min-w-[24px]">
                  <Image src={imgImage611} alt="" width={22} height={22} />
                </div>
                <p className="text-[16px] md:text-[18px] font-normal text-[#202124] tracking-[-0.192px] flex-1">
                  Double (2 Beds)
                </p>
              </div>
              
              <div className="flex items-center gap-8 h-[62px] px-4 py-5 border-b border-[#dadce0]">
                <div className="flex-shrink-0 flex items-center justify-center min-w-[24px]">
                  <Image src={imgInSuiteEmoji} alt="In Suite" width={24} height={24} />
                </div>
                <p className="text-[16px] md:text-[18px] font-normal text-[#202124] tracking-[-0.192px] flex-1">
                  In Suite
                </p>
              </div>
              
              <button 
                onClick={openRatesModal}
                className="flex items-center gap-8 h-[79px] px-4 py-5 border-b border-[#dadce0] w-full text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 flex items-center justify-center min-w-[24px]">
                  <Image src={imgCurrencyEmoji} alt="Currency" width={24} height={24} />
                </div>
                <div className="flex-1">
                  <p className="text-[16px] md:text-[18px] font-normal text-black tracking-[-0.192px]">
                    $19,135
                  </p>
                  <p className="text-[13px] md:text-[15px] text-[#757a7e]">
                    Reported by <span className="underline">Suffolk University</span>
                  </p>
                </div>
              </button>
              
            </div>

            {/* Call to Action */}
            <div className="flex justify-center">
              <button className="bg-[rgba(27,110,243,0.71)] h-[31px] px-4 rounded-[10px] flex items-center gap-2">
                <Image src={imgPhotoCameraFilledSvgrepoCom1} alt="" width={23} height={23} className="transform rotate-180 scale-y-[-1]" />
                <span className="text-white text-[16px] font-medium tracking-[-0.16px]">
                  Share Your Dorm Too
                </span>
              </button>
            </div>

          </div>
        )}

        {activeTab === "Room Plan" && (
          <div className="flex flex-col gap-4 pt-4">

            {/* Top row — floor plan image + info cards */}
            <div className="flex gap-3">

              {/* Floor plan image card */}
              <div className="rounded-[18px] overflow-hidden shadow-md flex-shrink-0 w-[184px] h-[222px] bg-white/90 backdrop-blur-sm">
                <Image
                  src={imgImage8RoomPlan}
                  alt="Room 504 Floor Plan"
                  width={184}
                  height={222}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info cards */}
              <div className="flex flex-col gap-3 flex-1">

                {/* Double (2 Beds) */}
                <div className="bg-white/90 backdrop-blur-sm rounded-[14px] shadow-md px-4 py-3 flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-[10px] bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Image src={imgImage611} alt="" width={22} height={22} />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-[#202124] leading-tight">
                      Double (2 Beds)
                    </p>
                    <p className="text-[12px] text-[#757a7e] leading-tight">
                      Reported by <span className="underline">Student</span>
                    </p>
                  </div>
                </div>

                {/* In Suite */}
                <div className="bg-white/90 backdrop-blur-sm rounded-[14px] shadow-md px-4 py-3 flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-[10px] bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Image src={imgInSuiteEmoji} alt="In Suite" width={24} height={24} />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-[#202124] leading-tight">
                      In Suite
                    </p>
                    <p className="text-[12px] text-[#757a7e] leading-tight">2 Rooms + Bathroom</p>
                  </div>
                </div>

                {/* Dimensions */}
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

            {/* Help banner */}
            <button className="w-full bg-[rgba(27,110,243,0.71)] hover:bg-[rgba(27,110,243,0.85)] transition-all rounded-[14px] py-3 px-5 flex items-center justify-between shadow-md">
              <p className="text-[18px] font-medium text-white">
                Reach Out If You Want to Help
              </p>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </button>

          </div>
        )}

        {activeTab === "Bathroom" && (
          <div className="relative pt-4">
            {/* Two Column Layout */}
            <div className="flex gap-3 mb-4">
              {/* Left Column - No Photos and In Suite Cards */}
              <div className="flex flex-col gap-3 flex-1">
                {/* No Photos Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-[14px] shadow-md px-4 py-3 flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-[10px] bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Image src={imgPhotoUploadSvgrepoCom11} alt="" width={22} height={22} />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-[#202124] leading-tight">
                      No Photos
                    </p>
                    <p className="text-[12px] text-[#757a7e] leading-tight">
                      Submitted
                    </p>
                  </div>
                </div>

                {/* In Suite Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-[14px] shadow-md px-4 py-3 flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-[10px] bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Image src={imgInSuiteEmoji} alt="In Suite" width={24} height={24} />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-[#202124] leading-tight">
                      In Suite
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Help Card */}
              <button 
                onClick={() => {
                  const subject = "Suffolk University, Nathan R Miller Hall, Room 504, Want to Help"
                  const emailBody = "Hi,\n\nI would like to help contribute to the room information:\n\nRoom: 504\nDorm: Nathan R Miller Hall\nCollege: Suffolk University\n\nI can help with:\n[Please describe how you'd like to help - photos, videos, room details, etc.]\n\nContact Information:\n[Your name and preferred contact method]\n\nThank you!"
                  window.location.href = `mailto:4wallsdorms@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
                }}
                className="bg-[rgba(27,110,243,0.71)] hover:bg-[rgba(27,110,243,0.85)] transition-all rounded-[14px] shadow-md flex-1 flex items-center justify-center px-4 py-3"
              >
                <p className="text-[18px] font-medium text-white leading-snug text-center">
                  Reach Out If You Want to Help
                </p>
              </button>
            </div>

            {/* Average Semi Private Miller Bathroom Bar */}
            <div className="bg-white/90 backdrop-blur-sm rounded-[14px] shadow-md px-4 py-3 flex items-center gap-3 mb-4">
              <div className="w-[36px] h-[36px] rounded-[10px] bg-amber-50 flex items-center justify-center flex-shrink-0">
                <span className="text-[18px]">🚿</span>
              </div>
              <p className="text-[15px] font-semibold text-[#202124] leading-tight">
                Average Semi Private Miller Bathroom
              </p>
            </div>

            {/* Photos and Videos Filter Buttons */}
            {(() => {
              const allThumb = bathroomMedia[0]
              const photoThumb = bathroomMedia.find(m => m.type === 'image')
              const videoThumb = bathroomMedia.find(m => m.type === 'video')
              return (
                <div className="flex gap-[10px] items-center overflow-x-auto scrollbar-hide mb-4">
                  {/* All */}
                  <button
                    onClick={() => setActiveBathroomFilter("All")}
                    className={`relative w-[154px] h-[211px] rounded-[12px] overflow-hidden flex-shrink-0 ${activeBathroomFilter === "All" ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <div className="absolute inset-0 bg-[#c0c0c0] rounded-[12px]" />
                    {allThumb && (
                      <Image
                        src={allThumb.src}
                        alt="All"
                        fill
                        className="absolute inset-0 w-full h-full object-cover opacity-70 rounded-[12px]"
                      />
                    )}
                    <div className="absolute left-3 bottom-2">
                      <p className="text-[22px] font-normal text-white tracking-[-0.264px]">All</p>
                    </div>
                  </button>

                  {/* Photos */}
                  <button
                    onClick={() => setActiveBathroomFilter("Photos")}
                    className={`relative w-[154px] h-[211px] rounded-[12px] overflow-hidden flex-shrink-0 ${activeBathroomFilter === "Photos" ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <div className="absolute inset-0 bg-[#c0c0c0] rounded-[12px]" />
                    {photoThumb && (
                      <Image
                        src={photoThumb.src}
                        alt="Bathroom Photo"
                        fill
                        className="absolute inset-0 w-full h-full object-cover opacity-70 rounded-[12px]"
                      />
                    )}
                    <div className="absolute left-3 bottom-2">
                      <p className="text-[22px] font-normal text-white tracking-[-0.264px]">Photos</p>
                    </div>
                  </button>

                  {/* Videos */}
                  <button
                    onClick={() => setActiveBathroomFilter("Videos")}
                    className={`relative w-[154px] h-[211px] rounded-[12px] overflow-hidden flex-shrink-0 ${activeBathroomFilter === "Videos" ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <div className="absolute inset-0 bg-[#c0c0c0] rounded-[12px]" />
                    {videoThumb && (
                      <video
                        src={videoThumb.src}
                        className="absolute inset-0 w-full h-full object-cover opacity-70 rounded-[12px]"
                        muted
                        playsInline
                      />
                    )}
                    <div className="absolute left-3 bottom-2">
                      <p className="text-[22px] font-normal text-white tracking-[-0.264px]">Videos</p>
                    </div>
                  </button>
                </div>
              )
            })()}

            {/* Bathroom Photo/Video Grid */}
            {bathroomLoading ? (
              <div className="grid grid-cols-2 gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-full h-[180px] bg-gray-200 rounded-[5px] animate-pulse" />
                ))}
              </div>
            ) : bathroomError ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <p className="text-[16px] font-medium text-[#5e5e5e] mb-1">Could not load bathroom media</p>
                <p className="text-[13px] text-[#70757a]">{bathroomError}</p>
              </div>
            ) : (() => {
              const filtered = activeBathroomFilter === "All"
                ? bathroomMedia
                : bathroomMedia.filter(p =>
                    activeBathroomFilter === "Photos" ? p.type === 'image' : p.type === 'video'
                  )

              if (filtered.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <p className="text-[18px] font-medium text-[#5e5e5e] tracking-[-0.216px] mb-2">
                      No {activeBathroomFilter === "All" ? "media" : activeBathroomFilter.toLowerCase()} yet
                    </p>
                    <p className="text-[14px] text-[#70757a]">
                      Be the first to submit bathroom content for Miller Hall.
                    </p>
                  </div>
                )
              }

              const leftCol = filtered.filter((_, i) => i % 2 === 0)
              const rightCol = filtered.filter((_, i) => i % 2 !== 0)

              return (
                <div className="grid grid-cols-2 gap-1">
                  <div className="space-y-1">
                    {leftCol.map((item, index) => (
                      <div key={`bath-left-${index}`} className="w-full rounded-[5px] overflow-hidden bg-[#d9d9d9]">
                        {item.type === 'video' ? (
                          <video src={item.src} className="w-full h-auto" controls playsInline />
                        ) : (
                          <Image src={item.src} alt={item.alt || `Bathroom ${index * 2 + 1}`} width={200} height={200} className="w-full h-auto" sizes="50vw" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {rightCol.map((item, index) => (
                      <div key={`bath-right-${index}`} className="w-full rounded-[5px] overflow-hidden bg-[#d9d9d9]">
                        {item.type === 'video' ? (
                          <video src={item.src} className="w-full h-auto" controls playsInline />
                        ) : (
                          <Image src={item.src} alt={item.alt || `Bathroom ${index * 2 + 2}`} width={200} height={200} className="w-full h-auto" sizes="50vw" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {activeTab === "Photos/Videos" && (
          <div className="relative">
            {/* Category Filter Row */}
            <div className="flex gap-[10px] items-center overflow-x-auto scrollbar-hide mb-4">
              {/* All */}
              <button 
                onClick={() => setActivePhotoFilter("All")}
                className={`relative h-[165px] w-[127px] rounded-[14px] overflow-hidden flex-shrink-0 ${
                  activePhotoFilter === "All" ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="absolute inset-0 bg-[#ececec] rounded-[14px]" />
                <div className="absolute inset-0 opacity-60 overflow-hidden rounded-[14px]">
                  <Image 
                    src={imgAll} 
                    alt="All" 
                    width={224} 
                    height={298} 
                    className="absolute h-[180.45%] left-[-32.76%] max-w-none top-[-44.44%] w-[175.83%]"
                  />
                </div>
                <p className="absolute left-3 bottom-8 text-[22px] font-medium text-white tracking-[-0.264px]">
                  All
                </p>
              </button>

              {/* Latest */}
              <button 
                onClick={() => setActivePhotoFilter("Latest")}
                className={`relative h-[165px] w-[127px] rounded-[14px] bg-[#ececec] overflow-hidden flex-shrink-0 ${
                  activePhotoFilter === "Latest" ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="absolute inset-0 opacity-60 overflow-hidden rounded-[14px]">
                  <Image 
                    src="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/503+%2B+504/sumiller504-bedroom-bothbeds-messy-imp-2.jpg"
                    alt="Latest" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute left-3 bottom-2 w-[99px]">
                  <p className="text-[22px] font-medium text-white tracking-[-0.264px] leading-normal">
                    Latest
                  </p>
                  <p className="text-[11px] font-normal text-[#dadce0] tracking-[-0.132px] leading-normal">
                    2024
                  </p>
                </div>
              </button>

              {/* Photos - Only show if there are photos */}
              {hasPhotos && (
                <button 
                  onClick={() => setActivePhotoFilter("Photos")}
                  className={`relative h-[165px] w-[127px] rounded-[14px] overflow-hidden flex-shrink-0 ${
                    activePhotoFilter === "Photos" ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-[#ececec] rounded-[14px]" />
                  <Image 
                    src={imgPhotos} 
                    alt="Photos" 
                    width={127} 
                    height={165} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 rounded-[14px]"
                  />
                  <p className="absolute left-3 bottom-8 text-[22px] font-medium text-white tracking-[-0.264px]">
                    Photos
                  </p>
                </button>
              )}

              {/* Videos - Only show if there are videos */}
              {hasVideos && (
                <button 
                  onClick={() => setActivePhotoFilter("Videos")}
                  className={`relative h-[165px] w-[127px] rounded-[14px] overflow-hidden flex-shrink-0 ${
                    activePhotoFilter === "Videos" ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-[#ececec] rounded-[14px]" />
                  <Image 
                    src={imgVideos} 
                    alt="Videos" 
                    width={127} 
                    height={165} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 rounded-[14px]"
                  />
                  <p className="absolute left-3 bottom-8 text-[22px] font-medium text-white tracking-[-0.264px]">
                    Videos
                  </p>
                </button>
              )}

              {/* Bathroom - Only show if there are bathroom photos */}
              {(hasBathroom || true) && (
                <button 
                  onClick={() => setActivePhotoFilter("Bathroom")}
                  className={`relative h-[165px] w-[127px] rounded-[14px] overflow-hidden flex-shrink-0 ${
                    activePhotoFilter === "Bathroom" ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-[#ececec] rounded-[14px]" />
                  <Image 
                    src={imgBathroom} 
                    alt="Bathroom" 
                    width={127} 
                    height={165} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 rounded-[14px]"
                  />
                  <p className="absolute left-3 bottom-8 text-[22px] font-medium text-white tracking-[-0.264px]">
                    Bathroom
                  </p>
                </button>
              )}

              {/* View - Only show if there are view photos */}
              {hasView && (
                <button 
                  onClick={() => setActivePhotoFilter("View")}
                  className={`relative h-[165px] w-[127px] rounded-[14px] overflow-hidden flex-shrink-0 ${
                    activePhotoFilter === "View" ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-[#ececec] rounded-[14px]" />
                  <Image 
                    src={imgView} 
                    alt="View" 
                    width={127} 
                    height={165} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 rounded-[14px]"
                  />
                  <p className="absolute left-3 bottom-8 text-[22px] font-medium text-white tracking-[-0.264px]">
                    View
                  </p>
                </button>
              )}
            </div>

            {/* Divider Lines */}
            <div className="relative mb-4">
              <div className="w-full h-px bg-[#d9d9d9] mb-12" />
              <div className="w-full h-px bg-[#d9d9d9]" />
              
              {/* Section Title */}
              <div className="absolute left-4 top-2 bg-[#f8f8f8] px-1">
                <h2 className="text-[24px] font-semibold text-black tracking-[-0.288px] leading-normal">
                  {activePhotoFilter}
                </h2>
              </div>
            </div>

            {/* Photo/Video Grid - Following Figma design exactly */}
            <div className="grid grid-cols-2 gap-1 pr-0">
              {/* Left Column */}
              <div className="space-y-1">
                  {filteredPhotos.slice(0, 3).map((photo, index) => {
                    const roundings = [
                      'rounded-tl-[10px] rounded-tr-[5px] rounded-bl-[5px] rounded-br-[5px]',
                      'rounded-[5px]',
                      'rounded-tl-[5px] rounded-tr-[5px] rounded-bl-[10px] rounded-br-[5px]'
                    ]
                    
                    return (
                      <div key={`left-${index}`} className={`w-full ${roundings[index]} overflow-hidden bg-[#d9d9d9]`}>
                        {photo.type === 'video' ? (
                          <video 
                            src={photo.src} 
                            className="w-full h-auto"
                            controls
                            playsInline
                          />
                        ) : (
                          <Image 
                            src={photo.src} 
                            alt={photo.alt || `Room 504 - Photo ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-auto"
                            sizes="(max-width: 402px) 50vw, 200px"
                          />
                        )}
                      </div>
                    )
                  })}
              </div>

              {/* Right Column */}
              <div className="space-y-1">
                {filteredPhotos.slice(3, 6).map((photo, index) => {
                  const roundings = [
                    'rounded-tl-[5px] rounded-tr-[10px] rounded-bl-[5px] rounded-br-[5px]',
                    'rounded-[5px]',
                    'rounded-tl-[5px] rounded-tr-[5px] rounded-bl-[5px] rounded-br-[10px]'
                  ]
                  
                  return (
                    <div key={`right-${index}`} className={`w-full ${roundings[index]} overflow-hidden bg-[#d9d9d9]`}>
                      {photo.type === 'video' ? (
                        <video 
                          src={photo.src} 
                          className="w-full h-auto"
                          controls
                          playsInline
                        />
                      ) : (
                        <Image 
                          src={photo.src} 
                          alt={photo.alt || `Room 504 - Photo ${index + 4}`}
                          width={200}
                          height={200}
                          className="w-full h-auto"
                          sizes="(max-width: 402px) 50vw, 200px"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Empty State for when no photos/videos found */}
            {filteredPhotos.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-center mb-6">
                  <h3 className="text-[24px] font-medium text-[#5e5e5e] tracking-[-0.288px] mb-2">
                    No {activePhotoFilter.toLowerCase()} found
                  </h3>
                  <p className="text-[16px] font-normal text-[#70757a] tracking-[-0.192px] leading-normal">
                    There are currently no {activePhotoFilter.toLowerCase()} available for this room.
                  </p>
                </div>
                
                <button 
                  onClick={() => {
                    // Future: Open photo/video submission form
                    alert('Photo/video submission feature coming soon!')
                  }}
                  className="bg-[#0b57d0] hover:bg-[#0842a0] text-white px-6 py-3 rounded-[8px] font-medium text-[16px] tracking-[-0.192px] transition-colors"
                >
                  Submit Photos/Videos
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "Updates" && (
          <div className="relative">
            {/* Filter Tabs */}
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setActiveUpdatesTab("4WallsDorms")}
                className={`h-[29px] w-[161px] rounded-[5px] shadow-sm flex items-center justify-center mr-4 transition-colors ${
                  activeUpdatesTab === "4WallsDorms" 
                    ? "bg-[rgba(217,217,217,0.8)] border-[0.3px] border-[rgba(0,0,0,0.03)]" 
                    : "bg-transparent hover:bg-gray-100"
                }`}
              >
                <p className={`text-[20px] font-normal tracking-[-0.24px] ${
                  activeUpdatesTab === "4WallsDorms" ? "text-black" : "text-[#5e5e5e]"
                }`}>
                  By 4WallsDorms
                </p>
              </button>
              
              <button 
                onClick={() => setActiveUpdatesTab("Students")}
                className={`h-[29px] px-4 rounded-[5px] flex items-center justify-center transition-colors ${
                  activeUpdatesTab === "Students" 
                    ? "bg-[rgba(217,217,217,0.8)] border-[0.3px] border-[rgba(0,0,0,0.03)] shadow-sm" 
                    : "bg-transparent hover:bg-gray-100"
                }`}
              >
                <p className={`text-[20px] font-normal tracking-[-0.24px] ${
                  activeUpdatesTab === "Students" ? "text-black" : "text-[#5e5e5e]"
                }`}>
                  By Students
                </p>
              </button>
            </div>

            {/* Divider Line */}
            <div className="w-full h-px bg-[#d9d9d9] mb-4" />

            {/* Content based on active tab */}
            {activeUpdatesTab === "4WallsDorms" && (
              /* Update Post by 4WallsDorms */
              <div className="bg-[#d9d9d9] border border-[rgba(0,0,0,0.2)] rounded-[10px] shadow-lg w-full overflow-hidden">
              {/* Post Header */}
              <div className="bg-[#d9d9d9] border-b border-[rgba(0,0,0,0.2)] h-[74px] rounded-t-[10px] flex items-center px-4">
                {/* Profile Picture */}
                <div className="w-[47px] h-[50px] mr-4 shrink-0">
                  <Image src={imgEllipse186} alt="Profile" width={47} height={50} className="w-full h-full object-cover" />
                </div>
                
                {/* Name and Title */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[22px] font-medium text-black tracking-[-0.264px] leading-normal">
                    Natalie
                  </h3>
                  <p className="text-[16px] font-normal text-[#70757a] tracking-[-0.192px] leading-normal">
                    Founder of 4WallsDorms
                  </p>
                </div>

                {/* Menu Dots */}
                <div className="w-[9px] h-[40px] shrink-0">
                  <Image src={imgGroup255} alt="Menu" width={9} height={40} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Post Image */}
              <div className="relative w-full aspect-[370/277]">
                <Image 
                  src={imgSu10West407BViewFromTheDoorWithClosetBedDrawEmpty1} 
                  alt="Dorm room" 
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>

              {/* Post Content */}
              <div className="p-5 space-y-4">
                <p className="text-[16px] font-medium text-black tracking-[-0.192px] leading-normal">
                  I started this to help students like me.
                </p>

                <p className="text-[16px] font-light text-black tracking-[-0.192px] leading-normal">
                  After falling off my lofted bed on the first day of college.
                </p>

                <p className="text-[18px] font-normal text-black tracking-[-0.216px] leading-normal">
                  Made me start to think.
                </p>

                <p className="text-[16px] font-light text-black tracking-[-0.192px] leading-normal">
                  My second year having a room with mice and walls that did not go fully to the ceiling.
                </p>

                <p className="text-[18px] font-normal text-black tracking-[-0.216px] leading-normal">
                  Made me build the site
                </p>

                <p className="text-[16px] font-light text-black tracking-[-0.192px] leading-normal">
                  My third year room had no heat in Mass winter
                </p>

                <p className="text-[18px] font-normal text-black tracking-[-0.216px] leading-normal">
                  Made me think:
                </p>

                <p className="text-[16px] font-medium italic text-black tracking-[-0.192px] leading-normal">
                  Why does it have to be this way?
                </p>

                <p className="text-[16px] font-light text-black tracking-[-0.192px] leading-normal">
                  I would not move into an apartment without at least seeing photos.
                </p>

                <p className="text-[16px] font-medium italic text-black tracking-[-0.192px] leading-normal">
                  Why I am spending the same amount not to be able to see?.
                </p>

                {/* Share Your Dorm Button */}
                <div className="flex justify-center mt-6">
                  <button className="bg-[rgba(27,110,243,0.71)] h-[31px] w-[196px] rounded-[10px] flex items-center justify-center gap-2">
                    <div className="w-[23px] h-[23px] transform rotate-180 scale-y-[-1]">
                      <Image src={imgPhotoCameraFilledSvgrepoCom1Updates} alt="" width={23} height={23} />
                    </div>
                    <span className="text-white text-[16px] font-medium tracking-[-0.16px]">
                      Share Your Dorm Too
                    </span>
                  </button>
                </div>
              </div>
              </div>
            )}

            {activeUpdatesTab === "Students" && (
              /* Student Updates Content */
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-lg p-8 w-full">
                  <h3 className="text-xl font-semibold text-gray-600 mb-4">No Student Updates Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Be the first student to share an update about Room 504!
                  </p>
                  <button 
                    onClick={() => {
                      const subject = "Suffolk University, Nathan R Miller Hall, Room 504, Share Your Experience"
                      const emailBody = "Hi,\n\nI would like to share my experience about Room 504:\n\nRoom: 504\nDorm: Nathan R Miller Hall\nCollege: Suffolk University\n\nMy Experience:\n[Please share your experience, tips, or information about this room]\n\nStudent Information:\n[Your name and year]\n\nThank you!"
                      window.location.href = `mailto:4wallsdorms@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
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

      {/* Footer Sections - Always visible regardless of active tab */}
      <div className="px-[14px] py-8 mt-8 border-t border-gray-200">
        {/* Other Rooms Section - Global Footer */}
        <div className="mb-8">
          <h2 className="text-[25px] font-bold text-black tracking-[-0.3px] mb-4">
            Other Rooms in Miller
          </h2>
          
          <div className="flex gap-3 w-full">
            {/* Floor Plan - Clickable, takes 2/3 of width */}
            <button 
              onClick={openFloorPlanModal}
              className="relative flex-[2] min-w-0 aspect-[248/291] rounded-[15px] overflow-hidden hover:opacity-90 transition-opacity"
            >
              <Image src={img4Floorplanmillersuffolk9} alt="Floor plan" fill sizes="66vw" className="object-cover" />
            </button>

            {/* Other Room Cards, takes 1/3 of width */}
            <div className="flex flex-col gap-[2px] shadow-lg flex-1 min-w-0">
              {otherRooms.map((room) => (
                <div key={room.id} className="relative flex-1 overflow-hidden">
                  <Image src={room.image} alt={room.title} fill sizes="33vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <p className="text-white text-[25px] font-bold tracking-[-0.8px] leading-none">
                      {room.id}
                    </p>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-[20px] font-semibold tracking-[-0.8px] leading-none truncate">
                      {room.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floor Plan Full Screen Modal */}
      {showFloorPlanModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          {/* Close button */}
          <button 
            onClick={closeFloorPlanModal}
            className="absolute top-4 right-4 z-60 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-2xl hover:bg-opacity-30 transition-colors"
          >
            ×
          </button>
          
          {/* Floor plan image */}
          <div className="relative max-w-full max-h-full">
            <Image 
              src={img4Floorplanmillersuffolk9} 
              alt="Miller Hall Floor Plan - Full View" 
              width={800} 
              height={940} 
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {/* Floor plan title */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              <h3 className="text-lg font-semibold">Miller Hall Floor Plan</h3>
              <p className="text-sm opacity-90">Tap anywhere to close</p>
            </div>
          </div>
          
          {/* Click anywhere to close */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={closeFloorPlanModal}
          />
        </div>
      )}

      {/* Dorm Rates Modal */}
      {showRatesModal && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={closeRatesModal}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto relative w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={closeRatesModal}
              className="absolute top-4 right-4 z-60 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xl transition-colors"
            >
              ×
            </button>
            
            {/* Modal Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Suffolk University Dorm Rates 2025-26</h2>
              
              {/* Rate Grid */}
              <div className="grid grid-cols-[2.5fr_1fr_1fr] gap-2 max-w-4xl mx-auto font-sans">
                {/* Headers */}
                <div className="font-bold bg-gray-200 p-3 border-b-2 border-black">Room Type</div>
                <div className="font-bold bg-gray-200 p-3 border-b-2 border-black">Annual Rate</div>
                <div className="font-bold bg-gray-200 p-3 border-b-2 border-black">Per Semester Rate</div>

                {/* Rows */}
                <div className="p-2 border-b border-gray-300 bg-white font-medium">Single Bedroom with kitchen</div>
                <div className="p-2 border-b border-gray-300 bg-white">20,956 dollars</div>
                <div className="p-2 border-b border-gray-300 bg-white">10,478 dollars</div>

                <div className="p-2 border-b border-gray-300 bg-white font-medium">Double bedroom with kitchen</div>
                <div className="p-2 border-b border-gray-300 bg-white">20,120 dollars</div>
                <div className="p-2 border-b border-gray-300 bg-white">10,060 dollars</div>

                <div className="p-2 border-b border-gray-300 bg-white font-medium">Triple bedroom with kitchen</div>
                <div className="p-2 border-b border-gray-300 bg-white">19,280 dollars</div>
                <div className="p-2 border-b border-gray-300 bg-white">9,640 dollars</div>

                <div className="p-2 border-b border-gray-300 bg-white font-medium">Studio Double with kitchen</div>
                <div className="p-2 border-b border-gray-300 bg-white">20,120 dollars</div>
                <div className="p-2 border-b border-gray-300 bg-white">10,060 dollars</div>

                <div className="p-2 border-b border-gray-300 bg-white font-medium">Studio Triple or Duplex Triple with kitchen</div>
                <div className="p-2 border-b border-gray-300 bg-white">19,280 dollars</div>
                <div className="p-2 border-b border-gray-300 bg-white">9,640 dollars</div>

                <div className="p-2 border-b border-gray-300 bg-white font-medium">Duplex Quad with kitchen</div>
                <div className="p-2 border-b border-gray-300 bg-white">18,456 dollars</div>
                <div className="p-2 border-b border-gray-300 bg-white">9,228 dollars</div>

                <div className="p-2 border-b border-gray-300 bg-white font-medium">Single Bedroom</div>
                <div className="p-2 border-b border-gray-300 bg-white">19,928 dollars</div>
                <div className="p-2 border-b border-gray-300 bg-white">9,964 dollars</div>

                <div className="p-2 border-b border-gray-300 bg-white font-medium bg-yellow-100">Double Bedroom</div>
                <div className="p-2 border-b border-gray-300 bg-white bg-yellow-100">19,102 dollars</div>
                <div className="p-2 border-b border-gray-300 bg-white bg-yellow-100">9,551 dollars</div>

                <div className="p-2 border-b border-gray-300 bg-white font-medium">Triple Bedroom</div>
                <div className="p-2 border-b border-gray-300 bg-white">18,286 dollars</div>
                <div className="p-2 border-b border-gray-300 bg-white">9,143 dollars</div>

                <div className="p-2 border-b border-gray-300 bg-white font-medium">Quad Bedroom</div>
                <div className="p-2 border-b border-gray-300 bg-white">17,480 dollars</div>
                <div className="p-2 border-b border-gray-300 bg-white">8,740 dollars</div>

                <div className="p-2 border-b border-gray-300 bg-white font-medium">5 person</div>
                <div className="p-2 border-b border-gray-300 bg-white">17,480 dollars</div>
                <div className="p-2 border-b border-gray-300 bg-white">8,740 dollars</div>

                <div className="p-2 border-b border-gray-300 bg-white font-medium">6 person</div>
                <div className="p-2 border-b border-gray-300 bg-white">17,480 dollars</div>
                <div className="p-2 border-b border-gray-300 bg-white">8,740 dollars</div>

                <div className="p-2 border-b border-gray-300 bg-white font-medium">8 person</div>
                <div className="p-2 border-b border-gray-300 bg-white">16,668 dollars</div>
                <div className="p-2 border-b border-gray-300 bg-white">8,334 dollars</div>
              </div>

              {/* Source Link */}
              <div className="mt-6 text-center">
                <a 
                  href="https://www.suffolk.edu/about/directory/student-account-services/tuition-fees/tuition-rates-2025-26#:~:text=Suffolk%20University%20tuition%20rates%20for%20students%20for%20the%202025%20%2D%202026%20academic%20year"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                >
                  https://www.suffolk.edu/about/directory/student-account-services/tuition-fees/tuition-rates-2025-26#:~:text=Suffolk%20University%20tuition%20rates%20for%20students%20for%20the%202025%20%2D%202026%20academic%20year
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && photos.length > 0 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col"
          onClick={closeGallery}
        >
          {/* Header with Close Button */}
          <div className="flex justify-end p-4 flex-shrink-0">
            <button 
              onClick={closeGallery}
              className="text-white text-3xl hover:text-gray-300 w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex items-center justify-center px-4 pb-20 relative min-h-0">
            {/* Previous Button */}
            {photos.length > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  previousImage()
                }}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl sm:text-4xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
              >
                ‹
              </button>
            )}

            {/* Next Button */}
            {photos.length > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl sm:text-4xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
              >
                ›
              </button>
            )}

            {/* Image/Video Display */}
            <div 
              className="w-full h-full flex items-center justify-center px-12 sm:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              {photos[currentImageIndex].type === 'video' ? (
                <video 
                  src={photos[currentImageIndex].src} 
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image 
                    src={photos[currentImageIndex].src} 
                    alt={photos[currentImageIndex].alt || `Room 504 - Photo ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                    priority
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer with Counter */}
          <div className="flex-shrink-0 pb-4">
            {/* Image Counter */}
            {photos.length > 1 && (
              <div className="text-center">
                <div className="inline-block text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {photos.length}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
      {/* End left panel */}

      {/* Right Panel - Floor Plan (iPad/Desktop only) */}
      <div
        className="hidden md:block md:flex-1 relative bg-white overflow-hidden"
        onWheel={(e) => {
          if (leftPanelRef.current) {
            leftPanelRef.current.scrollTop += e.deltaY
          }
        }}
      >
        {/* Floor plan image — zoomable & draggable */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ cursor: floorPlanScale > 1 ? "grab" : "default" }}
          onMouseDown={handleFloorPlanMouseDown}
          onMouseMove={handleFloorPlanMouseMove}
          onMouseUp={handleFloorPlanMouseUp}
          onMouseLeave={handleFloorPlanMouseUp}
        >
          {/* Floor plan matches the room's floor — Room 504 → Floor 5 plan */}
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
            <img
              src={imgFloorPlanForRoom}
              alt="Miller Hall Floor 5 Plan"
              draggable={false}
              className="max-w-full max-h-full object-contain select-none"
            />
          </div>
        </div>

        {/* Floor counter - progress bar style */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-[14px] shadow-md px-4 py-3 w-[160px]">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-500 tracking-widest">5th Floor</span>
            <div className="flex items-baseline gap-[3px]">
              <span className="text-[22px] font-bold text-indigo-600 leading-none">3</span>
              <span className="text-[14px] font-medium text-gray-400 leading-none">/</span>
              <span className="text-[14px] font-medium text-gray-400 leading-none">11</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
              style={{ width: `${(3 / 11) * 100}%` }}
            />
          </div>
        </div>


        {/* Minus / Plus zoom buttons - bottom right */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-[14px] shadow-md px-3 py-3 flex gap-2">
          {/* Minus */}
          <button
            aria-label="Zoom out"
            onClick={handleZoomOut}
            disabled={floorPlanScale <= MIN_SCALE}
            className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-30"
          >
            <div className="bg-gray-600 rounded-full h-[3px] w-[16px]" />
          </button>
          {/* Plus */}
          <button
            aria-label="Zoom in"
            onClick={handleZoomIn}
            disabled={floorPlanScale >= MAX_SCALE}
            className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 transition-colors disabled:opacity-30 relative"
          >
            <div className="bg-white rounded-full h-[3px] w-[16px] absolute" />
            <div className="bg-white rounded-full h-[16px] w-[3px] absolute" />
          </button>
        </div>
      </div>

    </div>
  )
}