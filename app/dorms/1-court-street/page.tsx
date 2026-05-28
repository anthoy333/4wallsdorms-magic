"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Camera, Check, Info, MapPin, Share, Star, Upload, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BackButton } from "@/app/components/BackButton"
import SuffolkDorms from "@/app/components/SuffolkDorms"

export default function OneCourtStreetPage() {
  const [filter, setFilter] = useState("all")
  
  // Sample data for featured dorm rooms
  const featuredRooms = [
    {
      id: 1,
      title: "Dazzling Single Room",
      description: "Bright lights",
      image: "/minimalist-dorm-room.png",
      student: "Riley J.",
      year: "Freshman",
    },
    {
      id: 2,
      title: "Spacious Double Room",
      description: "Lots of space for two roommates",
      image: "/boho-dorm-warmth.png",
      student: "Taylor M.",
      year: "Freshman",
    },
    {
      id: 3,
      title: "Welcoming Quad Room",
      description: "Created a space for friends to gather",
      image: "/tech-dorm-room.png",
      student: "Jordan P.",
      year: "Freshman",
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
      case "5person":
        return "/modern-dorm-lounge.png"
      case "6person":
        return "/modern-dorm-lounge.png"
      case "8person":
        return "/modern-dorm-lounge.png"
      case "adjoining":
        return "/jack-and-jill-dorm-floorplan.png"
      default:
        return "/double-dorm-room.png"
    }
  }

  // Sample data for all dorm rooms
  const allRooms = [
    // Individual Rooms
    { id: 1, number: "201", type: "Single", image: "/double-dorm-room.png", link: "/dorms/1-court-street/room/201" },
    { id: 2, number: "202", type: "Single", image: "/double-dorm-room.png", link: "/dorms/1-court-street/room/202" },
    { id: 3, number: "203", type: "Double", image: "/triple-dorm-room.png", link: "/dorms/1-court-street/room/203" },
    { id: 4, number: "204", type: "Double", image: "/triple-dorm-room.png", link: "/dorms/1-court-street/room/204" },
    { id: 5, number: "205", type: "Triple", image: "/quad-dorm-room.png", link: "/dorms/1-court-street/room/205" },
    { id: 6, number: "206", type: "Triple", image: "/quad-dorm-room.png", link: "/dorms/1-court-street/room/206" },
    { id: 7, number: "301", type: "Single", image: "/modern-double-dorm.png", link: "/dorms/1-court-street/room/301" },
    { id: 8, number: "302", type: "Single", image: "/modern-double-dorm.png", link: "/dorms/1-court-street/room/302" },
    { id: 9, number: "303", type: "Double", image: "/modern-triple-dorm.png", link: "/dorms/1-court-street/room/303" },
    { id: 10, number: "304", type: "Double", image: "/modern-triple-dorm.png", link: "/dorms/1-court-street/room/304" },
    { id: 11, number: "305", type: "Double", image: "/modern-triple-dorm.png", link: "/dorms/1-court-street/room/305" },
    { id: 12, number: "306", type: "Triple", image: "/modern-quad-dorm.png", link: "/dorms/1-court-street/room/306" },
    { id: 13, number: "401", type: "Triple", image: "/modern-quad-dorm.png", link: "/dorms/1-court-street/room/401" },
    { id: 14, number: "402", type: "Quad", image: "/modern-quad-dorm.png", link: "/dorms/1-court-street/room/402" },
    { id: 15, number: "403", type: "Quad", image: "/modern-quad-dorm.png", link: "/dorms/1-court-street/room/403" },
    { id: 16, number: "501", type: "5person", image: "/modern-dorm-lounge.png", link: "/dorms/1-court-street/room/501" },
    { id: 17, number: "502", type: "5person", image: "/modern-dorm-lounge.png", link: "/dorms/1-court-street/room/502" },
    { id: 18, number: "601", type: "6person", image: "/modern-dorm-lounge.png", link: "/dorms/1-court-street/room/601" },
    { id: 19, number: "602", type: "6person", image: "/modern-dorm-lounge.png", link: "/dorms/1-court-street/room/602" },
    { id: 20, number: "701", type: "8person", image: "/modern-dorm-lounge.png", link: "/dorms/1-court-street/room/701" },
    { id: 21, number: "702", type: "8person", image: "/modern-dorm-lounge.png", link: "/dorms/1-court-street/room/702" },
  ]

  // Sample data for common spaces
  const commonSpaces = [
    {
      id: 1,
      name: "Main Lounge",
      description: "Modern lounge with comfortable seating and study areas",
      image: "/modern-dorm-lounge.png",
    },
    {
      id: 2,
      name: "Laundry Facilities",
      description: "State-of-the-art laundry room with 10 washers and 10 dryers",
      image: "/modern-dorm-laundry.png",
    },
    {
      id: 3,
      name: "Study Lounge",
      description: "Quiet study space with individual and group workstations",
      image: "/modern-dorm-study-room.png",
    },
  ]

  interface OtherRoomsSectionProps {
    title: string
    rooms: RoomItem[]
    buttonStyle?: "blue" | "default" | "outline"
    buttonText?: string
    gridCols?: "1" | "2" | "3"
    onRoomClick?: (room: RoomItem) => void
  }

  interface RoomItem {
    id: number
    type: string
    description: string
    image: string
    link?: string
    roomNumbers?: string // For "202-203" style
  }


  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-6">
            <BackButton href="/dorms" text="All Dorms" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-[300px] rounded-xl overflow-hidden">
              <Image
                src="/1-court-street-residence-suffolk-university.png"
                alt="1 Court Street Residence Hall"
                width={600}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">1 Court Street Residence Hall</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>1 Court Street, Boston, MA 02108</span>
              </div>
              <p className="text-lg text-muted-foreground">
                Located right next to Government Center and Historic Faneuil Hall, 1 Court Street is a renovated hotel
                that provides traditional corridor-style living for first-year students with modern furnishings and
                fixtures.
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
      {/* All Dorm Rooms Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore All Rooms</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Browse through all the different room types we've collected from 1 Court Street Residence Hall.
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
              onClick={() => setFilter("5person")}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                filter === "5person"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              5 Person
            </button>
            <button
              onClick={() => setFilter("6person")}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                filter === "6person"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              6 Person
            </button>
            <button
              onClick={() => setFilter("8person")}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                filter === "8person"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              8 Person
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
                        {allRooms
              .filter((room) => {
                if (filter === "all") return true
                if (filter === "5person") return room.type === "5person"
                if (filter === "6person") return room.type === "6person"
                if (filter === "8person") return room.type === "8person"
                return room.type.toLowerCase() === filter
              })
              .map((room) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: room.id * 0.1 }}
                  className="bg-background rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={room.image || "/placeholder.svg"}
                      alt={`Room ${room.number}`}
                      width={400}
                      height={192}
                      className="object-cover w-full h-full"
                    />
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
              Explore the common spaces and amenities available to all residents of 1 Court Street.
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
              Learn about the traditional corridor-style layouts and floor plans at 1 Court Street, a renovated hotel
              converted into student housing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-4">Traditional Corridor Layout</h3>
              <p className="text-muted-foreground mb-4">
                1 Court Street features traditional corridor-style living with rooms arranged along hallways. This
                layout reflects the building's history as a hotel, with modern updates for student living.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Single, double, and triple rooms available</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Communal bathrooms shared by floor residents</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Modern furnishings from recent renovation</span>
                </li>
              </ul>
            </div>
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden border border-border">
              <Image
                src="/jack-and-jill-dorm-floorplan.png"
                alt="Traditional Corridor Layout"
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
              <h3 className="text-xl font-bold mb-4">Typical Floor Layout</h3>
              <p className="text-muted-foreground mb-4">
                Each floor in 1 Court Street follows a similar layout pattern with student rooms arranged along
                corridors and shared facilities centrally located for convenient access.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Two communal bathrooms per floor</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Community kitchen on each floor</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Laundry facilities on the second floor</span>
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
