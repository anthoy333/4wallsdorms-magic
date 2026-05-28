"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Camera, Share, Star, Upload, Info, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DormHeroSection } from "@/components/ui/dorm-hero-section"
import { FeaturedRoomCard } from "@/components/ui/featured-room-card"
import { RoomGridCard } from "@/components/ui/room-grid-card"
import { ShareDormCTA } from "@/components/ui/share-dorm-cta"
import { CommonSpacesSection } from "@/components/ui/common-spaces-section"
import SuffolkDorms from "@/app/components/SuffolkDorms"
import { getTenWestRoomInfo } from "@/app/utils/tenWestMapping"
import { generateRoomThumbnail, fetchRoomMediaFiles } from "@/app/utils/generateRoomThumbnails"
import { discoverTenWestRoomsWithMedia } from "@/app/utils/discoverTenWestRooms"


export default function TenWestPage() {
  const [filter, setFilter] = useState("all")
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
  const [currentPage, setCurrentPage] = useState(1)
  const roomsPerPage = 30
  
  // Sample data for featured dorm rooms
  const featuredRooms = [
    {
      id: 1,
      title: "Double Suite Room",
      description: "Efficient layout with two extra-long twin beds and shared living space",
      image: "/minimalist-dorm-room.png",
      student: "Taylor M.",
      year: "Junior",
    },
    {
      id: 2,
      title: "Triple Suite Setup",
      description: "Spacious arrangement for three roommates with personal study areas",
      image: "/boho-dorm-warmth.png",
      student: "Jordan P.",
      year: "Sophomore",
    },
    {
      id: 3,
      title: "Quad Suite Layout",
      description: "Efficient use of space for four roommates with common living area",
      image: "/tech-dorm-room.png",
      student: "Riley K.",
      year: "Senior",
    },
  ]

  // Fallback images for rooms without specific photos
  const fallbackImages = [
    "/double-dorm-room.png",
    "/triple-dorm-room.png", 
    "/modern-double-dorm.png",
    "/modern-triple-dorm.png",
    "/modern-quad-dorm.png",
    "/jack-and-jill-dorm-floorplan.png",
    "/minimalist-dorm-room.png",
    "/quad-dorm-room.png"
  ]

  // Utility function to get fallback image based on room type
  const getFallbackImage = (roomType: string) => {
    switch (roomType.toLowerCase()) {
      case "single":
        return "/minimalist-dorm-room.png"
      case "double":
        return "/double-dorm-room.png"
      case "triple":
        return "/triple-dorm-room.png"
      case "quad":
        return "/quad-dorm-room.png"
      case "studio":
        return "/modern-dorm-study-room.png"
      case "apartment":
        return "/modern-dorm-lounge.png"
      case "adjoining":
        return "/jack-and-jill-dorm-floorplan.png"
      default:
        return "/double-dorm-room.png"
    }
  }

  // Discover and load rooms dynamically from Backblaze - only show rooms with actual media
  useEffect(() => {
    const loadAllRooms = async () => {
      setRoomsLoading(true)
      
      try {
        // Discover which rooms actually have media in Backblaze
        const roomNumbersWithMedia = await discoverTenWestRoomsWithMedia()
        
        console.log(`📋 Discovered ${roomNumbersWithMedia.length} rooms with media in Backblaze`)
        
        if (roomNumbersWithMedia.length === 0) {
          console.warn("⚠️ No rooms with media found in Backblaze")
          setAllRooms([])
          setRoomsLoading(false)
          return
        }

        // Build room data for each discovered room
        const roomsData = []
        let roomId = 1
        
        for (const roomNumber of roomNumbersWithMedia) {
          const roomInfo = getTenWestRoomInfo(roomNumber)
          
          // Determine room type display name
          let roomTypeDisplay = "Apartment"
          if (roomInfo.type === 'studio') {
            roomTypeDisplay = "Studio Apartment"
          } else if (roomInfo.type === 'standard-apartment') {
            roomTypeDisplay = "Standard Apartment"
          } else if (roomInfo.type === 'semi-private-apartment') {
            roomTypeDisplay = "Semi-Private Apartment"
          } else if (roomInfo.type === 'suite') {
            roomTypeDisplay = "Suite"
          } else if (roomInfo.type === 'duplex-apartment') {
            roomTypeDisplay = "Duplex Apartment"
          }
          
          // Add individual room entry
          roomsData.push({
            id: roomId++,
            number: roomNumber,
            type: roomTypeDisplay,
            link: `/dorms/10-west/room/${roomNumber}`,
            isAdjoining: false,
            hasSharedSpace: roomInfo.hasSharedSpace
          })
          
          // Add shared space entry if applicable (not for Studio Apartments)
          if (roomInfo.hasSharedSpace) {
            roomsData.push({
              id: roomId++,
              number: roomNumber,
              type: `${roomTypeDisplay} (Shared Space)`,
              link: `/dorms/10-west/communal/shared-space/${roomNumber}`,
              isAdjoining: true,
              hasSharedSpace: true
            })
          }
        }

        // Generate thumbnails for each room
        const roomsWithThumbnails = await Promise.all(
          roomsData.map(async (room) => {
            try {
              // For shared space entries, use the base room number
              const roomNumberForMedia = room.number
              
              // Fetch media files for this room from Backblaze
              const mediaFiles = await fetchRoomMediaFiles(roomNumberForMedia, "10 West")
              
              // Generate thumbnail using the priority system
              const thumbnail = generateRoomThumbnail(room.number, room.type, mediaFiles)
              
              const fallbackImage = room.isAdjoining 
                ? "/jack-and-jill-dorm-floorplan.png"
                : getFallbackImage(room.type)
              
              return {
                ...room,
                image: room.image || fallbackImage,
                thumbnail
              }
            } catch (error) {
              console.error(`Error generating thumbnail for room ${room.number}:`, error)
              const fallbackImage = room.isAdjoining 
                ? "/jack-and-jill-dorm-floorplan.png"
                : getFallbackImage(room.type)
              
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
        console.log(`✅ Loaded ${roomsWithThumbnails.length} total entries (rooms + shared spaces) from ${roomNumbersWithMedia.length} unique rooms`)
      } catch (error) {
        console.error("❌ Failed to load rooms:", error)
        setAllRooms([])
        setRoomsLoading(false)
      }
    }

    loadAllRooms()
  }, [])

  // Filter rooms based on selected filter
  const filteredRooms = allRooms.filter((room) => {
    if (filter === "all") return true
    
    const roomTypeLower = room.type.toLowerCase()
    
    if (filter === "suite") {
      // Show rooms that are Suites or have shared spaces
      return roomTypeLower.includes("suite") || roomTypeLower.includes("shared space") || room.isAdjoining
    }
    
    if (filter === "studio") {
      return roomTypeLower.includes("studio")
    }
    
    if (filter === "apartment") {
      // Match any apartment type (Standard, Semi-Private, Duplex)
      return roomTypeLower.includes("apartment")
    }
    
    // For single, double, triple, quad - these are sub-room types within apartments/suites
    // Since 10 West rooms are apartments/suites, we might not have these as main types
    // But check if the type contains these words
    if (filter === "single" || filter === "double" || filter === "triple" || filter === "quad") {
      return roomTypeLower.includes(filter)
    }
    
    // Default: try to match the filter in the room type
    return roomTypeLower.includes(filter.toLowerCase())
  })

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

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

  // Sample data for common spaces
  const commonSpaces = [
    {
      id: 1,
      name: "Community Lounge",
      description: "Comfortable lounge areas for socializing and studying with fellow residents",
      image: "/modern-dorm-lounge.png",
    },
    {
      id: 2,
      name: "Laundry Facilities",
      description: "On-site laundry room with washers and dryers available for resident use",
      image: "/modern-dorm-laundry.png",
    },
    {
      id: 3,
      name: "Study Spaces",
      description: "Quiet study areas with desks and seating for individual or group work",
      image: "/modern-dorm-study-room.png",
    },
  ]



  return (
    <div className="bg-background">
      {/* Hero Section */}
      <DormHeroSection
        title="10 West Residence Hall"
        address="10 West St, Boston, MA 02111"
        description="Located in the heart of downtown Boston, 10 West Street is home to approximately 300 sophomore, junior, and senior students. This residence hall features suite-style accommodations with private bathrooms and is just steps away from the Boston Common, Downtown Crossing, and the Theatre District."
        image="/10-west-residence-hall-suffolk-university.png"
        backButtonHref="/dorms"
        backButtonText="All Dorms"
      />
      {/* Featured Dorm Rooms Section - Hidden for now */}
      {false && (
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Dorm Rooms</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Check out these beautifully decorated rooms from current and former residents. Want your room featured?
              Share your photos with us!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full max-w-7xl mx-auto">
            {featuredRooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: room.id * 0.1 }}
                className="bg-background rounded-3xl shadow-lg overflow-hidden hover-lift transition-all duration-300 ease-in-out border-2 border-transparent hover:border-primary/10"
              >
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                  <Image
                    src={room.image || "/placeholder.svg"}
                    alt={room.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-background/80 rounded-full p-1">
                    <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="text-sm sm:text-base font-medium text-primary mb-1">
                    Room {room.id}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2">
                    {room.title}
                  </h3>
                  <div className="text-sm sm:text-base text-muted-foreground mb-4">
                    {room.description}
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500 hover:border-yellow-600"
                    asChild
                  >
                    <Link href={room.link || "#"}>View Room</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}
      {/* All Dorm Rooms Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore All Rooms</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Browse through all the different room types we've collected from 10 West Residence Hall.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-4 sm:mb-6 lg:mb-8">
            <button
              onClick={() => setFilter("all")}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("single")}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                filter === "single"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Single
            </button>
            <button
              onClick={() => setFilter("double")}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                filter === "double"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Double
            </button>
            <button
              onClick={() => setFilter("triple")}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                filter === "triple"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Triple
            </button>
            <button
              onClick={() => setFilter("quad")}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                filter === "quad"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Quad
            </button>
            <button
              onClick={() => setFilter("studio")}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                filter === "studio"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Studio
            </button>
            <button
              onClick={() => setFilter("apartment")}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                filter === "apartment"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Apartment
            </button>
            <button
              onClick={() => setFilter("suite")}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                filter === "suite"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Suite
            </button>
          </div>

          {roomsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading rooms...</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No rooms found matching your filters.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Total rooms loaded: {allRooms.length} | Filter: {filter}
              </p>
            </div>
          ) : (
            <>
            <div className="grid md:grid-cols-3 gap-6">
              {paginatedRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-background rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48">
                      {room.thumbnail?.type === 'video' ? (
                        <video
                          src={room.thumbnail.src}
                          className="object-cover w-full h-full"
                          muted
                          playsInline
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => {
                            e.currentTarget.pause()
                            e.currentTarget.currentTime = 0
                          }}
                        />
                      ) : (
                        <Image
                          src={room.thumbnail?.src || room.image || "/placeholder.svg"}
                          alt={room.thumbnail?.alt || `Room ${room.number}`}
                          width={400}
                          height={192}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">Room {room.number}</h3>
                          <p className="text-sm text-muted-foreground">{room.type} Room</p>
                        </div>
                        <Button size="sm" asChild>
                          <Link href={room.link || "#"}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-2">
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
                
                {/* Page info */}
                <div className="text-center text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredRooms.length)} of {filteredRooms.length} rooms
                </div>
              </div>
            )}
            </>
          )}
        </div>
      </section>
      {/* Call to Action Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-primary/10 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Share Your Dorm Room</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Help future students by sharing photos and details of your dorm room. Your contribution makes a
                difference!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/upload-dorm">
                  <Upload className="mr-2 h-4 w-4" /> Share Your Room
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Info className="mr-2 h-4 w-4" /> Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Common Spaces Section - Hidden for now */}
      {false && (
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get to Know the Dorm</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore the common spaces and amenities available to all residents of 10 West Residence Hall.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {commonSpaces.map((space) => (
              <Card key={space.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={space.image || "/placeholder.svg"}
                    alt={space.name}
                    width={400}
                    height={192}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{space.name}</h3>
                  <p className="text-muted-foreground text-sm">{space.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      )}
      {/* Floor Layout Section - Hidden for now */}
      {false && (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Floor Layouts</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Learn about the apartment-style and Jack and Jill room layouts at 10 West Residence Hall.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-4">Suite-Style Layout</h3>
              <p className="text-muted-foreground mb-4">
                10 West Street features suite-style accommodations where 2-8 students share a common living area and
                bathroom facilities. Each suite includes fully furnished bedrooms, a shared living space, and private
                bathroom facilities.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Extra-long twin beds with mattresses</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Desks with chairs and dressers</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Private bathroom with shower</span>
                </li>
              </ul>
            </div>
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden border border-border">
              <Image
                src="/jack-and-jill-dorm-floorplan.png"
                alt="Apartment-Style Layout"
                width={600}
                height={320}
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 relative h-64 md:h-80 rounded-xl overflow-hidden border border-border">
              <Image
                src="/dorm-floor-plan.png"
                alt="Typical Floor Layout"
                width={600}
                height={320}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-xl font-bold mb-4">Building Features</h3>
              <p className="text-muted-foreground mb-4">
                10 West Street is a 10-story building that houses approximately 300 students. The building includes
                various amenities designed to enhance the residential experience.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Study lounges on multiple floors</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>On-site laundry facilities</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>24-hour security and controlled building access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      )}
      {/* Share Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Help Future Students</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Your photos and insights can help incoming students prepare for their new home. Share your experience today!
          </p>
          <Button size="lg" asChild>
            <Link href="/upload-dorm">
              <Share className="mr-2 h-4 w-4" /> Share Your Dorm Room
            </Link>
          </Button>
        </div>
      </section>

      {/* Suffolk Dorms Section */}
      <SuffolkDorms />
    </div>
  );
}
