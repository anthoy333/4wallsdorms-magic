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

export default function ModernTheatrePage() {
  const [filter, setFilter] = useState("all")
  
  // Sample data for featured dorm rooms
  const featuredRooms = [
    {
      id: 1,
      title: "Dazzling Single Room",
      description: "Bright lights",
      image: "/minimalist-dorm-room.png",
      student: "Casey R.",
      year: "Freshman",
    },
    {
      id: 2,
      title: "Spacious Double Room",
      description: "Lots of space for two roommates",
      image: "/boho-dorm-warmth.png",
      student: "Morgan L.",
      year: "Sophomore",
    },
    {
      id: 3,
      title: "Welcoming Quad Room",
      description: "Created a space for friends to gather",
      image: "/tech-dorm-room.png",
      student: "Drew K.",
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
      case "adjoining":
        return "/jack-and-jill-dorm-floorplan.png"
      default:
        return "/double-dorm-room.png"
    }
  }

  // Sample data for all dorm rooms
  const allRooms = [
    // Individual Rooms
    { id: 1, number: "101", type: "Single", image: "/double-dorm-room.png", link: "/dorms/modern-theatre/room/101" },
    { id: 2, number: "102", type: "Single", image: "/double-dorm-room.png", link: "/dorms/modern-theatre/room/102" },
    { id: 3, number: "103", type: "Double", image: "/triple-dorm-room.png", link: "/dorms/modern-theatre/room/103" },
    { id: 4, number: "104", type: "Double", image: "/triple-dorm-room.png", link: "/dorms/modern-theatre/room/104" },
    { id: 5, number: "105", type: "Triple", image: "/quad-dorm-room.png", link: "/dorms/modern-theatre/room/105" },
    { id: 6, number: "201", type: "Single", image: "/modern-double-dorm.png", link: "/dorms/modern-theatre/room/201" },
    { id: 7, number: "202", type: "Single", image: "/modern-double-dorm.png", link: "/dorms/modern-theatre/room/202" },
    { id: 8, number: "203", type: "Double", image: "/modern-triple-dorm.png", link: "/dorms/modern-theatre/room/203" },
    { id: 9, number: "204", type: "Double", image: "/modern-triple-dorm.png", link: "/dorms/modern-theatre/room/204" },
    { id: 10, number: "205", type: "Triple", image: "/modern-quad-dorm.png", link: "/dorms/modern-theatre/room/205" },
    { id: 11, number: "301", type: "Triple", image: "/modern-quad-dorm.png", link: "/dorms/modern-theatre/room/301" },
    { id: 12, number: "302", type: "Triple", image: "/modern-quad-dorm.png", link: "/dorms/modern-theatre/room/302" },
    // Adjoining Rooms
    { id: 13, number: "101-102", type: "Adjoining", image: "/jack-and-jill-dorm-floorplan.png", link: "/dorms/modern-theatre/communal/adjoining-room/101-102" },
    { id: 14, number: "103-104", type: "Adjoining", image: "/jack-and-jill-dorm-floorplan.png", link: "/dorms/modern-theatre/communal/adjoining-room/103-104" },
    { id: 15, number: "201-202", type: "Adjoining", image: "/jack-and-jill-dorm-floorplan.png", link: "/dorms/modern-theatre/communal/adjoining-room/201-202" },
    { id: 16, number: "203-204", type: "Adjoining", image: "/jack-and-jill-dorm-floorplan.png", link: "/dorms/modern-theatre/communal/adjoining-room/203-204" },
  ]

  // Sample data for common spaces
  const commonSpaces = [
    {
      id: 1,
      name: "Performance Studio",
      description: "Dedicated space for theater rehearsals and creative workshops",
      image: "/modern-dorm-lounge.png",
    },
    {
      id: 2,
      name: "Costume Workshop",
      description: "Creative space for costume design and theatrical arts",
      image: "/modern-dorm-laundry.png",
    },
    {
      id: 3,
      name: "Theater Lounge",
      description: "Community space for theater students to collaborate and socialize",
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
                src="/suffolk-theatre-residence.png"
                alt="Modern Theatre Residence"
                width={600}
                height={300}
                className="object-cover w-full h-[300px]"
              />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Modern Theatre Residence</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>10 Tremont St, Boston, MA 02108</span>
              </div>
              <p className="text-lg text-muted-foreground">
                Located in the heart of Boston's theater district, Modern Theatre Residence provides a unique living experience 
                for theater and performing arts students, with dedicated creative spaces and proximity to cultural venues.
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
              Browse through all the different room types we've collected from Modern Theatre.
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

          <div className="grid md:grid-cols-3 gap-6">
                        {allRooms
              .filter((room) => {
                if (filter === "all") return true
                if (filter === "adjoining") return room.type === "Adjoining"
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
                  <div className="relative">
                    <Image
                      src={room.image || "/placeholder.svg"}
                      alt={`Room ${room.number}`}
                      width={400}
                      height={192}
                      className="object-cover w-full h-48"
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
              <h2 className="text-3xl font-bold mb-4">Share Your Theater Dorm Room</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Help future theater students by sharing photos and details of your dorm room. Your contribution makes a
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
              Explore the creative spaces and amenities available to all residents of Modern Theatre Residence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {commonSpaces.map((space) => (
              <Card key={space.id} className="overflow-hidden">
                <div className="relative">
                  <Image
                    src={space.image || "/placeholder.svg"}
                    alt={space.name}
                    width={400}
                    height={192}
                    className="object-cover w-full h-48"
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

      {/* Floor Layout Section */}
      {/* Floor Layout Section - Hidden for now */}
      {false && (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Floor Layouts</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Learn about the theater residence room layouts and floor plans at Modern Theatre.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-4">Theater-Inspired Layout</h3>
              <p className="text-muted-foreground mb-4">
                Modern Theatre Residence features creative spaces designed specifically for theater students, with 
                dedicated performance areas and collaborative zones that foster artistic expression.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Performance studios on every floor</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Creative collaboration spaces</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Proximity to Boston's theater district</span>
                </li>
              </ul>
            </div>
            <div className="relative rounded-xl overflow-hidden border border-border">
              <Image
                src="/dorm-floor-plan.png"
                alt="Modern Theatre Floor Layout"
                width={600}
                height={320}
                className="object-contain w-full h-64 md:h-80"
              />
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 relative rounded-xl overflow-hidden border border-border">
              <Image
                src="/jack-and-jill-dorm-floorplan.png"
                alt="Theater Residence Room Layout"
                width={600}
                height={320}
                className="object-contain w-full h-64 md:h-80"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-xl font-bold mb-4">Creative Living Spaces</h3>
              <p className="text-muted-foreground mb-4">
                Each floor features a mix of single, double, and triple rooms designed to accommodate different 
                theater student needs, with common areas that encourage artistic collaboration and performance practice.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Dedicated performance practice rooms</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Costume and prop storage areas</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Collaborative creative spaces</span>
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
          <h2 className="text-3xl font-bold mb-4">Help Future Theater Students</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Your photos and insights can help incoming theater students prepare for their creative journey. Share your experience today!
          </p>
          <Button size="lg" asChild>
            <Link href="/upload-dorm">
              <Share className="mr-2 h-4 w-4" /> Share Your Theater Dorm Room
            </Link>
          </Button>
        </div>
      </section>

      {/* Suffolk Dorms Section */}
      <SuffolkDorms />
    </div>
  );
} 