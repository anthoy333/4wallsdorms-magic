"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { GraduationCap, Users, MapPin, ChevronLeft, ChevronRight, Filter, Play, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BackButton } from "@/app/components/BackButton"
import { getAllMillerHallRoomData } from "@/app/utils/millerHallRoomList"
import { checkRoomHasMedia, checkAdjoiningRoomHasMedia } from "@/app/utils/checkRoomHasMedia"
import { generateRoomThumbnail, fetchRoomMediaFiles } from "@/app/utils/generateRoomThumbnails"
import { RoomCard } from "@/app/components/RoomCard"
import Masonry from "react-masonry-css"

// Overview tabs
const overviewTabs = ["Overview", "Rooms", "Safety", "Amenities", "Move in"]

export default function MillerHallV2Page() {
  const [activeOverviewTab, setActiveOverviewTab] = useState("Rooms")
  const [filter, setFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("")
  const [amenitiesFilter, setAmenitiesFilter] = useState("")
  const [roomTypeFilter, setRoomTypeFilter] = useState("")
  const [floorFilter, setFloorFilter] = useState<number[]>([])
  const [allRooms, setAllRooms] = useState<Array<{ 
    id: number; 
    number: string; 
    type: string; 
    image?: string; 
    link: string; 
    isAdjoining?: boolean;
    thumbnail?: {
      type: 'image' | 'video';
      src: string;
      alt: string;
    }
  }>>([])
  const [roomsLoading, setRoomsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const roomsPerPage = 30

  // Carousel images with thumbnails (you can replace with actual images)
  const carouselImages = [
    {
      main: "/miller-hall-suffolk.png",
      thumbnail: "/miller-hall-suffolk.png",
      alt: "Miller Hall Exterior"
    },
    {
      main: "/miller-hall-suffolk.png", // Replace with different image
      thumbnail: "/miller-hall-suffolk.png", // Replace with different thumbnail
      alt: "Miller Hall Interior"
    },
    {
      main: "/miller-hall-suffolk.png", // Replace with different image
      thumbnail: "/miller-hall-suffolk.png", // Replace with different thumbnail
      alt: "Miller Hall Common Area"
    },
    {
      main: "/miller-hall-suffolk.png", // Replace with different image
      thumbnail: "/miller-hall-suffolk.png", // Replace with different thumbnail
      alt: "Miller Hall Room"
    },
    {
      main: "/miller-hall-suffolk.png", // Replace with different image
      thumbnail: "/miller-hall-suffolk.png", // Replace with different thumbnail
      alt: "Miller Hall Amenities"
    }
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  // Filter rooms to only show those with media
  useEffect(() => {
    const filterRoomsWithMedia = async () => {
      setRoomsLoading(true)
      const allRoomsData = getAllMillerHallRoomData()
      const roomsWithMedia: typeof allRoomsData = []
      let hasApiError = false

      // Check each room for media
      for (const room of allRoomsData) {
        try {
          if (room.isAdjoining) {
            const firstRoomNumber = room.number.split(' + ')[0]
            const hasMedia = await checkAdjoiningRoomHasMedia(firstRoomNumber, "Miller")
            if (hasMedia) {
              roomsWithMedia.push(room)
            }
          } else {
            const hasMedia = await checkRoomHasMedia(room.number, "Miller")
            if (hasMedia) {
              roomsWithMedia.push(room)
            }
          }
        } catch (error) {
          console.error(`Error checking media for room ${room.number}:`, error)
          hasApiError = true
          // If API fails, include the room anyway with a placeholder
          roomsWithMedia.push(room)
        }
      }

      // If we had API errors but no rooms with media, show all rooms with placeholders
      if (hasApiError && roomsWithMedia.length === 0) {
        console.warn("API errors detected, showing all rooms with placeholder images")
        roomsWithMedia.push(...allRoomsData)
      }

      // Generate thumbnails for each room
      const roomsWithThumbnails = await Promise.all(
        roomsWithMedia.map(async (room, index) => {
          try {
            // Fetch media files for this room (in real app, this would call Backblaze)
            const mediaFiles = await fetchRoomMediaFiles(room.number, "Miller")
            
            // Generate thumbnail using the priority system
            const thumbnail = generateRoomThumbnail(room.number, room.type, mediaFiles)
            
            const fallbackImage = room.isAdjoining 
              ? "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/sumillerfloorplanadjointedroom.PNG"
              : "/double-dorm-room.png"
            
            return {
              ...room,
              image: room.image || fallbackImage,
              thumbnail
            }
          } catch (error) {
            console.error(`Error generating thumbnail for room ${room.number}:`, error)
            // Return room with placeholder thumbnail
            const fallbackImage = room.isAdjoining 
              ? "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/sumillerfloorplanadjointedroom.PNG"
              : "/double-dorm-room.png"
            
            return {
              ...room,
              image: room.image || fallbackImage,
              thumbnail: {
                type: 'image' as const,
                src: fallbackImage,
                alt: `Room ${room.number} ${room.type} placeholder`
              }
            }
          }
        })
      )

      setAllRooms(roomsWithThumbnails)
      setRoomsLoading(false)
    }

    filterRoomsWithMedia()
  }, [])

  // Get unique floors from rooms
  const floors = Array.from(new Set(allRooms.map(room => {
    const roomNum = room.number.split(' + ')[0]
    return roomNum.length === 3 ? parseInt(roomNum[0]) : parseInt(roomNum.substring(0, 2))
  }))).sort((a, b) => b - a) // Sort descending

  const toggleFloor = (floor: number) => {
    setFloorFilter(prev => 
      prev.includes(floor) 
        ? prev.filter(f => f !== floor)
        : [...prev, floor]
    )
  }

  // Filter rooms based on all filters
  const filteredRooms = allRooms
    .filter((room) => {
      // Room type filter
      if (filter !== "all") {
        if (filter === "adjoining") {
          if (room.type !== "Adjoining") return false
        } else {
          if (room.type.toLowerCase() !== filter) return false
        }
      }

      // Room type dropdown filter
      if (roomTypeFilter && roomTypeFilter !== "all") {
        if (roomTypeFilter === "adjoining") {
          if (room.type !== "Adjoining") return false
        } else {
          if (room.type.toLowerCase() !== roomTypeFilter) return false
        }
      }

      // Floor filter
      if (floorFilter.length > 0) {
        const roomNum = room.number.split(' + ')[0]
        const roomFloor = roomNum.length === 3 ? parseInt(roomNum[0]) : parseInt(roomNum.substring(0, 2))
        if (!floorFilter.includes(roomFloor)) return false
      }

      return true
    })
    .sort((a, b) => {
      // Extract the first room number from each room (handles both regular and adjoining rooms)
      const getRoomNumber = (roomNumber: string): number => {
        const firstRoom = roomNumber.split(' + ')[0]
        return parseInt(firstRoom)
      }
      
      const roomNumA = getRoomNumber(a.number)
      const roomNumB = getRoomNumber(b.number)
      
      // Sort descending (highest number first)
      return roomNumB - roomNumA
    })

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filter, roomTypeFilter, floorFilter, amenitiesFilter, priceFilter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage)
  const startIndex = (currentPage - 1) * roomsPerPage
  const endIndex = startIndex + roomsPerPage
  const paginatedRooms = filteredRooms.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of rooms section
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-background">
      {/* Header Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6">
            <BackButton href="/dorms/suffolk-university" text="Suffolk University" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row gap-6 items-start md:items-end"
          >
            {/* Image Carousel */}
            <div className="relative w-full md:w-[400px] h-[250px] sm:h-[300px] bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={carouselImages[currentImageIndex].main}
                alt={carouselImages[currentImageIndex].alt}
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1.5 sm:p-2 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1.5 sm:p-2 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              {/* Progress Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                {currentImageIndex + 1}/{carouselImages.length}
              </div>
            </div>

            {/* Dorm Info */}
            <div className="flex-1 flex flex-col md:justify-end">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Miller Hall</h1>
                <p className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2">Nathan R. Miller Hall</p>
                <div className="flex items-start text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">10 Somerset Street, Boston, MA 02108</span>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6 mb-6 md:mb-8">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span className="text-sm">Sophomore</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">Co-ed</span>
                  </div>
                </div>
              </div>
              
              {/* Interactive Media Thumbnails */}
              <div className="grid grid-cols-3 gap-1 mt-4 md:mt-0 w-full" style={{ maxWidth: '400px' }}>
                {carouselImages.slice(0, 3).map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square bg-muted rounded-lg border border-border overflow-visible flex items-center justify-center transition-all duration-200 relative ${
                      currentImageIndex === index
                        ? 'border-primary ring-2 ring-primary/20 scale-105'
                        : 'hover:border-primary/50 hover:scale-102'
                    }`}
                    whileHover={{ scale: currentImageIndex === index ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-full h-full p-2">
                      <div className="w-full h-full rounded overflow-hidden">
                        <Image
                          src={image.thumbnail}
                          alt={image.alt}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    {/* Active indicator overlay */}
                    {currentImageIndex === index && (
                      <motion.div
                        className="absolute inset-0 bg-primary/10 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-3 h-3 bg-primary rounded-full" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section with Information Panel */}
      <section className="relative w-full h-[400px] md:h-[450px]">
        {/* Map Background */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src="https://www.google.com/maps/d/u/0/embed?mid=1KWzs9mXy1dtZnjnZRg-LWdf214g2FyE&ehbc=2E312F"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>
        
        {/* White Information Panel - 25% width on right */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/4 bg-white shadow-xl z-10 overflow-y-auto">
          <div className="p-6 md:p-8 space-y-6">
            {/* Header Section */}
            <div className="pb-4 border-b border-gray-200">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Miller Hall</h2>
              <p className="text-lg text-gray-600 font-medium">Nathan R. Miller Hall</p>
            </div>
            
            {/* Information Items */}
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Address</p>
                  <p className="text-base font-medium text-gray-900 leading-relaxed">10 Somerset Street, Boston, MA 02108</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Gender</p>
                  <p className="text-base font-medium text-gray-900">Co-ed</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <GraduationCap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Year</p>
                  <p className="text-base font-medium text-gray-900">Sophomore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Tabs Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-6 pb-0">
        <div className="container mx-auto max-w-6xl">
          <div className="relative">
            {/* Scrollable Tabs */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex items-end gap-0 min-w-max relative">
                {overviewTabs.map((tab) => {
                  const isActive = activeOverviewTab === tab
                  // Use specific colors for Overview, Safety, Rooms, and Move in tabs, teal for others
                  let activeColor = "#14b8a6" // default teal
                  let activeColorClass = "text-teal-600"
                  
                  if (tab === "Overview") {
                    activeColor = "#2c5697" // Dusk (same as Any filing cabinet button)
                    activeColorClass = "text-[#2c5697]"
                  } else if (tab === "Safety") {
                    activeColor = "#41b6e6" // Crystal (same as Amenities)
                    activeColorClass = "text-[#41b6e6]"
                  } else if (tab === "Rooms") {
                    activeColor = "#bc912c" // Suffolk Gold (same as Rooms filing cabinet button)
                    activeColorClass = "text-[#bc912c]"
                  } else if (tab === "Move in") {
                    activeColor = "#2c5697" // Dusk (same as Move-in filing cabinet button)
                    activeColorClass = "text-[#2c5697]"
                  }
                  
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveOverviewTab(tab)}
                      className={`relative px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                        isActive 
                          ? activeColorClass
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                      {/* Active tab underline - thick underline with appropriate color */}
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-1.5"
                          style={{ 
                            backgroundColor: activeColor,
                            zIndex: 10
                          }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
            {/* Bottom border line - gray line below all tabs */}
            <div className="border-b border-gray-300"></div>
          </div>
        </div>
      </section>

      {/* Overview Tab Content Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 pt-6">
        <div className="container mx-auto max-w-6xl">
          {/* Rooms Content */}
          {activeOverviewTab === "Rooms" && (
            <div className="space-y-6">
              {/* Filter Bar */}
              {/* Mobile: Scrollable Filter Bar */}
              <div className="md:hidden mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                  <motion.div
                    className="flex-shrink-0 snap-start"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filter
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    className="flex-shrink-0 snap-start"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPriceFilter(priceFilter ? "" : "price")}
                      className={`whitespace-nowrap ${priceFilter ? "bg-primary text-primary-foreground" : ""}`}
                    >
                      $ Price
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    className="flex-shrink-0 snap-start"
                    whileTap={{ scale: 0.95 }}
                  >
                    <select
                      value={amenitiesFilter}
                      onChange={(e) => setAmenitiesFilter(e.target.value)}
                      className="px-3 py-2 rounded-md border border-input bg-background text-sm whitespace-nowrap min-w-[110px] h-9"
                    >
                      <option value="">Amenities</option>
                      <option value="bathroom">Private Bath</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="ac">AC</option>
                    </select>
                  </motion.div>
                  
                  <motion.div
                    className="flex-shrink-0 snap-start"
                    whileTap={{ scale: 0.95 }}
                  >
                    <select
                      value={roomTypeFilter}
                      onChange={(e) => setRoomTypeFilter(e.target.value)}
                      className="px-3 py-2 rounded-md border border-input bg-background text-sm whitespace-nowrap min-w-[100px] h-9"
                    >
                      <option value="">Room Type</option>
                      <option value="all">All</option>
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="quad">Quad</option>
                      <option value="adjoining">Adjoining</option>
                    </select>
                  </motion.div>
                </div>
              </div>

              {/* Desktop: Wrapped Filter Bar */}
              <div className="hidden md:flex flex-wrap items-center gap-2 mb-6">
                <Button variant="outline" size="sm" className="gap-2 flex-shrink-0">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPriceFilter(priceFilter ? "" : "price")}
                  className={`flex-shrink-0 ${priceFilter ? "bg-primary text-primary-foreground" : ""}`}
                >
                  $ Price
                </Button>
                <select
                  value={amenitiesFilter}
                  onChange={(e) => setAmenitiesFilter(e.target.value)}
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm min-w-[120px]"
                >
                  <option value="">Amenities</option>
                  <option value="bathroom">Private Bathroom</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="ac">AC</option>
                </select>
                <select
                  value={roomTypeFilter}
                  onChange={(e) => setRoomTypeFilter(e.target.value)}
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm min-w-[120px]"
                >
                  <option value="">Room Type</option>
                  <option value="all">All</option>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="quad">Quad</option>
                  <option value="adjoining">Adjoining</option>
                </select>
              </div>

              {/* Rooms Grid with Floor List */}
              <div className="relative flex items-start gap-4">
                {/* Rooms Grid */}
                <div className="flex-1">
                  {roomsLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading rooms...</p>
                    </div>
                  ) : filteredRooms.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No rooms found matching your filters.</p>
                    </div>
                  ) : (
                    <>
                      <Masonry
                        breakpointCols={{
                          default: 4,
                          1280: 4,
                          1024: 3,
                          640: 2,
                          0: 2
                        }}
                        className="masonry-grid"
                        columnClassName="masonry-grid-column"
                      >
                        {paginatedRooms.map((room, index) => {
                        if (!room.thumbnail) return null
                        
                        return (
                          <RoomCard
                            key={room.id}
                            room={{
                              id: room.id,
                              number: room.number,
                              type: room.type,
                              link: room.link,
                              thumbnail: room.thumbnail
                            }}
                            index={index}
                          />
                        )
                      })}
                      </Masonry>
                      
                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8 mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="gap-2"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                              // Show first page, last page, current page, and pages around current
                              if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                              ) {
                                return (
                                  <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => goToPage(page)}
                                    className="min-w-[40px]"
                                  >
                                    {page}
                                  </Button>
                                )
                              } else if (
                                page === currentPage - 2 ||
                                page === currentPage + 2
                              ) {
                                return (
                                  <span key={page} className="px-2 text-muted-foreground">
                                    ...
                                  </span>
                                )
                              }
                              return null
                            })}
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="gap-2"
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      {/* Page info */}
                      {totalPages > 1 && (
                        <div className="text-center text-sm text-muted-foreground mb-4">
                          Showing {startIndex + 1}-{Math.min(endIndex, filteredRooms.length)} of {filteredRooms.length} rooms
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Floor Number List - Sticky Scrollable Circular Elevator Buttons (Only in Rooms Section) */}
                <div className="sticky top-20 flex-shrink-0 z-30 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
                  <div className="flex flex-col gap-2">
                    {floors.map((floor) => (
                      <motion.button
                        key={floor}
                        onClick={() => toggleFloor(floor)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors flex-shrink-0 ${
                          floorFilter.includes(floor)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary/50'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {floor}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Overview Tab Content */}
          {activeOverviewTab !== "Rooms" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-4">{activeOverviewTab}</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  We're working hard to bring you comprehensive {activeOverviewTab.toLowerCase()} information for Miller Hall.
                </p>
                <div className="bg-muted/30 rounded-lg p-8">
                  <h4 className="text-xl font-semibold mb-2">Coming Soon!</h4>
                  <p className="text-muted-foreground">
                    This section will include detailed information about {activeOverviewTab.toLowerCase()} at Miller Hall.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

