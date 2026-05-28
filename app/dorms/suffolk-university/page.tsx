"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { GraduationCap, Users, ChevronLeft, ChevronRight, Share } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BackButton } from "@/app/components/BackButton"

// Dorm data structure
const dorms = [
  {
    id: "miller",
    shortName: "Miller",
    fullName: "Nathan R. Miller Hall",
    address: "10 Somerset Street, Boston, MA 02108, USA",
    studentType: "Sophomore",
    gender: "Co-ed",
    image: "/miller-hall-suffolk.png",
    link: "/dorms/miller-hall"
  },
  {
    id: "smith",
    shortName: "Smith",
    fullName: "Smith Hall",
    address: "150 Tremont Street, Boston, MA, 02111, USA",
    studentType: "Freshman",
    gender: "Co-ed",
    image: "/placeholder.svg?height=300&width=400",
    link: "/dorms/smith-hall"
  },
  {
    id: "10west",
    shortName: "10 West",
    fullName: "10 West Street Dorm",
    address: "10 West Street, Boston, MA, 02111, USA",
    studentType: "Sophomore",
    gender: "Co-ed",
    image: "/10-west-residence-hall-suffolk-university.png",
    link: "/dorms/10-west"
  },
  {
    id: "theatre",
    shortName: "Modern",
    fullName: "Modern Theatre Residence Hall",
    address: "10 West Street, Boston, MA, 02111, USA",
    studentType: "Sophomore",
    gender: "Co-ed",
    image: "/suffolk-theatre-residence.png",
    link: "/dorms/modern-theatre"
  },
  {
    id: "court",
    shortName: "Court",
    fullName: "1 Court Street Dorm",
    address: "1 Court St, Boston, MA 02108",
    studentType: "Freshman",
    gender: "Co-ed",
    image: "/1-court-street-residence-suffolk-university.png",
    link: "/dorms/1-court-street"
  }
]

// Placeholder images for carousel (you can replace these with actual images)
const carouselImages = [
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600"
]

const filterTabs = ["Any", "Dorms", "Safety", "Transportation", "Resources", "Dinning Halls"]

export default function SuffolkUniversityPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeFilter, setActiveFilter] = useState("Any")

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  return (
    <div className="bg-background">
      {/* Header Section with Image Carousel */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6">
            <BackButton href="/dorms" text="All Campuses" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row gap-6 items-start"
          >
            {/* Image Carousel */}
            <div className="relative w-full md:w-[400px] h-[300px] bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={carouselImages[currentImageIndex]}
                alt="Suffolk University"
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              {/* Progress Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1}/{carouselImages.length}
              </div>
            </div>

            {/* University Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Suffolk University</h1>
              <p className="text-lg text-muted-foreground">10 Somerset Street, Boston, MA 02108</p>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Interlocking Tabs Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-0">
        <div className="container mx-auto max-w-6xl">
          {/* Tabs container */}
          <div className="relative pt-4 px-2 sm:px-4 pb-0">
            {/* Interlocking Tabs - Desktop: single row, Mobile: wrap into rows of 3 */}
            <div className="flex flex-wrap items-center gap-0 md:flex-nowrap">
              {filterTabs.map((tab, index) => {
                const isActive = activeFilter === tab
                const isFirst = index === 0
                const isLast = index === filterTabs.length - 1
                const positionInRow = index % 3 // Position in row (0, 1, 2)
                const isFirstInRow = positionInRow === 0
                const isLastInRow = positionInRow === 2 || isLast
                const isFirstRow = index < 3
                
                // Suffolk University Brand Color palette for tabs
                const tabColors = [
                  'bg-[#2c5697]',     // Any - Dusk (Suffolk blue variant)
                  'bg-[#bc912c]',     // Dorms - Suffolk Gold
                  'bg-[#40c1ac]',     // Safety - Mermaid (safety green)
                  'bg-[#565294]',     // Transportation - Purple Rain
                  'bg-[#41b6e6]',     // Resources - Crystal (light blue)
                  'bg-[#ff6900]',     // Dinning Halls - Blaze (orange)
                ]
                
                const tabColor = tabColors[index] || 'bg-[#2c5697]'
                
                // Desktop: interlocking clipPath
                let desktopClipPath
                if (isFirst && isLast) {
                  desktopClipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                } else if (isFirst) {
                  desktopClipPath = 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)'
                } else if (isLast) {
                  desktopClipPath = 'polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px)'
                } else {
                  desktopClipPath = 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%, 0 10px)'
                }
                
                return (
                  <div
                    key={tab}
                    className={`relative overflow-hidden flex-1 basis-1/3 md:flex-none md:basis-auto ${
                      isFirst ? 'md:ml-0' : 'md:-ml-[10px]'
                    }`}
                    style={{
                      // Mobile: rounded corners on first row only
                      borderRadius: isFirstRow && isFirstInRow ? '12px 0 0 0' : 
                                   isFirstRow && isLastInRow ? '0 12px 0 0' : '0',
                    }}
                  >
                    {/* Mobile: simple button with border-radius */}
                    <motion.button
                      onClick={() => setActiveFilter(tab)}
                      className={`relative ${tabColor} font-semibold text-xs sm:text-sm text-gray-100 uppercase transition-all duration-200 w-full md:hidden ${
                        isActive 
                          ? 'z-20 shadow-lg px-3 py-2' 
                          : 'z-10 hover:z-15 px-3 pt-2 pb-1'
                      }`}
                      style={{
                        borderRadius: isFirstRow && isFirstInRow ? '12px 0 0 0' : 
                                     isFirstRow && isLastInRow ? '0 12px 0 0' : '0',
                      }}
                      whileHover={{ 
                        scale: isActive ? 1 : 1.02,
                        y: isActive ? 0 : -2
                      }}
                    >
                      {tab}
                    </motion.button>
                    
                    {/* Desktop: interlocking button with clipPath */}
                    <motion.button
                      onClick={() => setActiveFilter(tab)}
                      className={`hidden md:block relative ${tabColor} font-semibold text-sm text-gray-100 uppercase transition-all duration-200 w-full ${
                        isActive 
                          ? 'z-20 shadow-lg px-6 py-3' 
                          : 'z-10 hover:z-15 px-6 pt-3 pb-1'
                      }`}
                      style={{
                        clipPath: desktopClipPath,
                      }}
                      whileHover={{ 
                        scale: isActive ? 1 : 1.02,
                        y: isActive ? 0 : -2
                      }}
                    >
                      {tab}
                    </motion.button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Tab Content Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 pt-0">
        <div className="container mx-auto max-w-6xl">
          {/* Dorms Content */}
          {activeFilter === "Dorms" && (
            <div className="space-y-6">
              {dorms.map((dorm) => (
                <Link key={dorm.id} href={dorm.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row gap-6 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                  {/* Image on Left */}
                  <div className="w-full md:w-[300px] min-h-[200px] max-h-[400px] flex-shrink-0">
                    <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      <Image
                        src={dorm.image}
                        alt={dorm.fullName}
                        width={300}
                        height={400}
                        className="object-contain w-full h-full max-h-[400px]"
                      />
                    </div>
                  </div>

                  {/* Text on Right */}
                  <div className="flex-1 flex flex-col">
                    <div className="space-y-2 mb-4">
                      <h3 className="text-2xl font-bold">{dorm.shortName}</h3>
                      <p className="text-lg font-semibold text-muted-foreground">{dorm.fullName}</p>
                      <p className="text-sm text-muted-foreground">{dorm.address}</p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span className="text-sm">{dorm.studentType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm">{dorm.gender}</span>
                        </div>
                      </div>
                    </div>
                    {/* Small image grid placeholder below text */}
                    <div className="grid grid-cols-6 gap-1 mt-auto">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-muted rounded border border-border overflow-hidden flex items-center justify-center"
                        >
                          {/* Placeholder for vertical/horizontal photos */}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                </Link>
              ))}
            </div>
          )}

          {/* Coming Soon Content for other tabs */}
          {activeFilter !== "Dorms" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-4">{activeFilter}</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  We're working hard to bring you comprehensive {activeFilter.toLowerCase()} information for Suffolk University.
                </p>
                <div className="bg-muted/30 rounded-lg p-8">
                  <h4 className="text-xl font-semibold mb-2">Coming Soon!</h4>
                  <p className="text-muted-foreground">
                    This section will include detailed information about {activeFilter.toLowerCase()} at Suffolk University.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
      {/* More Coming Soon Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/20">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">More Coming Soon</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're continuously expanding our coverage of Suffolk University. Stay tuned for more detailed information
              about dining options, campus resources, transportation, and student life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/notifications">Get Notified of Updates</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dorms">Browse All Dorm Rooms</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
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
    </div>
  );
}
