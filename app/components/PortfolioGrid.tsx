"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const projects = [
  {
    id: 1,
    university: "Suffolk University",
    dormName: "Nathan R. Miller Hall",
    roomType: "Room 201 In Miller Hall",
    imageUrl: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg",
    category: "Double Room",
    link: "/dorms/miller-hall/room/201",
    buttonText: "View Room"
  },
  {
    id: 2,
    university: "Suffolk University",
    dormName: "Nathan R. Miller Hall",
    roomType: "Room 202 In Miller Hall",
    imageUrl: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-8.jpg",
    category: "Double Room",
    link: "/dorms/miller-hall/room/202",
    buttonText: "View Room"
  },
  {
    id: 3,
    university: "Suffolk University",
    dormName: "Nathan R. Miller Hall",
    roomType: "Room 205 In Miller Hall",
    imageUrl: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bedroom-empty-4.jpg",
    category: "Double Room",
    link: "/dorms/miller-hall/room/205",
    buttonText: "View Room"
  },
  {
    id: 4,
    university: "Suffolk University",
    dormName: "Nathan R. Miller Hall",
    roomType: "Room 206 In Miller Hall",
    imageUrl: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-11.jpg",
    category: "Double Room",
    link: "/dorms/miller-hall/room/206",
    buttonText: "View Room"
  },
  {
    id: 5,
    university: "Suffolk University",
    dormName: "Nathan R. Miller Hall",
    roomType: "Room 207 In Miller Hall",
    imageUrl: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-8.jpg",
    category: "Double Room",
    link: "/dorms/miller-hall/room/207",
    buttonText: "View Room"
  },

  {
    id: 13,
    university: "Suffolk University",
    dormName: "Nathan R. Miller Hall",
    roomType: "Room 407 In Miller Hall",
    imageUrl: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1007+%2B+1008/1008millersuffolk(3).jpg",
    category: "Double Room",
    link: "/dorms/miller-hall/room/407",
    buttonText: "View Room"
  },
  {
    id: 14,
    university: "Suffolk University",
    dormName: "Nathan R. Miller Hall",
    roomType: "Room 408 In Miller Hall",
    imageUrl: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+14/1407+%2B+1408/sumiller1407-view-empty-imp-6.jpg",
    category: "Double Room",
    link: "/dorms/miller-hall/room/408",
    buttonText: "View Room"
  },
  {
    id: 16,
    university: "Suffolk University",
    dormName: "Nathan R. Miller Hall",
    roomType: "Room 504",
    imageUrl: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/503+%2B+504/504millersuffolk(3).jpg",
    category: "Beautifully Decorated",
    description: "Two roommates coming together and building a beautiful place.",
    link: "/dorms/miller-hall/room/504",
    buttonText: "View Room"
  },
  {
    id: 17,
    university: "Suffolk University",
    dormName: "Nathan R. Miller Hall",
    roomType: "Room 608 In Miller Hall",
    imageUrl: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller608-plaque.png",
    category: "Double Room",
    link: "/dorms/miller-hall/room/608",
    buttonText: "View Room"
  },

  {
    id: 6,
    university: "Suffolk University",
    dormName: "Nathan R. Miller Hall",
    roomType: "Adjoining Rooms 201 + 202 In Miller Hall",
    imageUrl: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/sumillerfloorplanadjointedroom.PNG",
    category: "Double Room",
    link: "/dorms/miller-hall/communal/adjoining-room/201-202",
    buttonText: "View Adjoining Room"
  },
  {
    id: 7,
    university: "Suffolk University",
    dormName: "Nathan R. Miller Hall",
    roomType: "Adjoining Rooms 205 + 206 In Miller Hall",
    imageUrl: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/sumillerfloorplanadjointedroom.PNG",
    category: "Double Room",
    link: "/dorms/miller-hall/communal/adjoining-room/205-206",
    buttonText: "View Adjoining Room"
  },




]

// Define categories in specific order
const categories = ["All", "Single Room", "Double Room", "Triple Room", "Quad Room", "Suite", "Apartment"]

export default function PortfolioGrid() {
  const [filter, setFilter] = useState("All")

  const filteredProjects = filter === "All" ? projects : projects.filter((project) => project.category === filter)

  return (
    <section className="py-8 sm:py-12 lg:py-20 bg-background">
      <div className="w-full px-2 sm:px-3 lg:px-8">
        <motion.div
          className="text-center mb-6 sm:mb-8 lg:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Dorm Layouts</h2>
          <p className="mt-2 sm:mt-4 text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground">Explore different dorm rooms.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-4 sm:mb-6 lg:mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                filter === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full max-w-7xl mx-auto">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-background rounded-3xl shadow-lg overflow-hidden hover-lift transition-all duration-300 ease-in-out border-2 border-transparent hover:border-primary/10"
              >
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                  <Image
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.roomType}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <div className="text-sm sm:text-base font-medium text-primary mb-1">
                    {project.university}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2">
                    {project.dormName}
                  </h3>
                  <div className="text-sm sm:text-base text-muted-foreground">
                    {project.roomType}
                  </div>
                  {project.description && (
                    <div className="text-sm sm:text-base text-muted-foreground mb-4">
                      {project.description}
                    </div>
                  )}
                  <Link
                    href={project.link}
                    className="inline-block w-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-center py-2 px-4 rounded-lg font-medium hover:bg-[hsl(var(--accent))]/90 transition-colors"
                  >
                    {project.buttonText}
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
