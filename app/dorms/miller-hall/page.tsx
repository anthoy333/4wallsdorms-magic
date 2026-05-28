"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Camera, Check, ChevronLeft, ChevronRight, Info, MapPin, Share, Star, Upload, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BackButton } from "@/app/components/BackButton"
import SuffolkDorms from "@/app/components/SuffolkDorms"
import { InspirationSection } from "@/app/components/InspirationSection"
import { getAllMillerHallRoomData } from "@/app/utils/millerHallRoomList"
import { checkRoomHasMedia, checkAdjoiningRoomHasMedia } from "@/app/utils/checkRoomHasMedia"
import { generateRoomThumbnail, fetchRoomMediaFiles } from "@/app/utils/generateRoomThumbnails"

export default function MillerHallPage() {
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
      title: "Room 504 - Double Room",
      description: "Beautifully decorated double room with modern amenities",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/503+%2B+504/504millersuffolk(3).jpg",
      student: "Current Student",
      year: "2024",
      link: "/dorms/miller-hall/room/504"
    },
    {
      id: 2,
      title: "Bright Triple Setup",
      description: "Warm colors",
      image: "/boho-dorm-warmth.png",
      student: "Sam T.",
      year: "Freshman",
    },
    {
      id: 3,
      title: "Modern Quad Layout",
      description: "Efficient use of space for four roommates",
      image: "/tech-dorm-room.png",
      student: "Alex K.",
      year: "Sophomore",
    },
  ]

  // Load all rooms dynamically
  useEffect(() => {
    const loadAllRooms = async () => {
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
            // For adjoining rooms, use the first room number for fetching media
            const roomNumberForMedia = room.isAdjoining 
              ? room.number.split(' + ')[0]
              : room.number
            
            // Fetch media files for this room
            const mediaFiles = await fetchRoomMediaFiles(roomNumberForMedia, "Miller")
            
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

    loadAllRooms()
  }, [])

  // Filter rooms based on selected filter
  const filteredRooms = allRooms.filter((room) => {
    if (filter === "all") return true
    if (filter === "adjoining") return room.type === "Adjoining"
    return room.type.toLowerCase() === filter
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
      name: "Study Lounge",
      description: "Quiet study space with individual desks and comfortable seating",
      image: "/modern-dorm-lounge.png",
    },
    {
      id: 2,
      name: "Laundry Room",
      description: "Modern laundry facilities with 6 washers and 6 dryers",
      image: "/modern-dorm-laundry.png",
    },
    {
      id: 3,
      name: "Community Kitchen",
      description: "Fully equipped kitchen for student use on alternating floors",
      image: "/modern-dorm-study-room.png",
    },
  ]



  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-6">
            <BackButton href="/dorms" text="All Dorms" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src="/miller-hall-suffolk.png"
                alt="Miller Hall"
                width={600}
                height={300}
                className="object-cover w-full h-[300px]"
              />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Miller Hall</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>10 Somerset St, Boston, MA 02108</span>
              </div>
              <p className="text-lg text-muted-foreground">
                Located in the heart of campus, Miller Hall primarily houses first or second-year students in Jack and
                Jill accommodations with private bathrooms, offering convenient access to all academic buildings.
              </p>
            </div>
          </div>
        </div>
      </section>
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

      {/* Inspiration Section - Hidden for now */}
      {false && (
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Image */}
          <div className="relative rounded-xl overflow-hidden">
            <Image
              src="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
              alt="Real decorated dorm room inspiration from Suffolk University students"
              width={600}
              height={400}
              className="object-cover w-full h-[400px]"
            />
          </div>
          
          {/* Right side - Content */}
          <div>
            <InspirationSection dormHref="/dorms/miller-hall" dormName="Miller Hall" />
          </div>
        </div>
      </div>
      )}
      {/* All Dorm Rooms Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore All Rooms</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Browse through all the different room types we've collected from Miller Hall.
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
              onClick={() => setFilter("adjoining")}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                filter === "adjoining"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Adjoining Rooms
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
                      {room.thumbnail ? (
                        room.thumbnail.type === 'video' ? (
                          <div className="relative w-full h-full bg-black">
                            <video
                              src={room.thumbnail.src}
                              className="object-cover w-full h-full"
                              muted
                              loop
                              playsInline
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black/50 rounded-full p-2">
                                <Camera className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          </div>
                        ) : (
                    <Image
                            src={room.thumbnail.src}
                            alt={room.thumbnail.alt}
                      width={400}
                      height={192}
                            className="object-cover w-full h-full"
                          />
                        )
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">No image</span>
                        </div>
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
      {/* Hidden Sections */}
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
