"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface DormData {
  name: string
  displayName: string
  image: string
  description: string
  features: string[]
  link: string
  rooms: {
    id: string
    videos: string[]
  }[]
}

const dormData: DormData[] = [
  {
    name: "Miller Hall",
    displayName: "Miller Hall",
    image: "/miller-hall-suffolk.png",
    description: "Miller primarily houses first or second-year students in Jack and Jill accommodations with private bathrooms.",
    features: [
      "2-4 students per Jack and Jill rooms",
      "Right next to every academic building",
      "Common spaces on every other floor"
    ],
    link: "/dorms/miller-hall",
    rooms: [
      {
        id: "201",
        videos: [
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4"
        ]
      },
      {
        id: "301",
        videos: [
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4"
        ]
      },
      {
        id: "401",
        videos: [
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4"
        ]
      }
    ]
  },
  {
    name: "10 West",
    displayName: "10 West Residence Hall",
    image: "/10-west-residence-hall-suffolk-university.png",
    description: "10 West primarily houses second-year students in apartment-style and Jack and Jill accommodations, all with private bathrooms.",
    features: [
      "4-8 students per suite or apartment",
      "4 Elevators",
      "Study lounges and common spaces on multiple floors."
    ],
    link: "/dorms/10-west",
    rooms: [
      {
        id: "413",
        videos: [
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4"
        ]
      },
      {
        id: "513",
        videos: [
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4"
        ]
      },
      {
        id: "613",
        videos: [
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4"
        ]
      }
    ]
  },
  {
    name: "Smith Hall",
    displayName: "Smith Hall",
    image: "/placeholder.svg?key=lu3n7",
    description: "Smith provides traditional corridor-style living for first-year students with shared common spaces and amenities.",
    features: [
      "Every type of layout but apartment",
      "Communal bathrooms on each floor",
      "Community kitchen and lounge areas"
    ],
    link: "/dorms/smith-hall",
    rooms: [
      {
        id: "101",
        videos: [
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4"
        ]
      },
      {
        id: "201",
        videos: [
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4"
        ]
      },
      {
        id: "301",
        videos: [
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4"
        ]
      }
    ]
  },
  {
    name: "1 Court Street",
    displayName: "1 Court Street",
    image: "/1-court-street-residence-suffolk-university.png",
    description: "1 Court Street is a renovated hotel and provides traditional corridor-style living for first-year students.",
    features: [
      "Every type of layout but apartments",
      "Modern furnishings and fixtures",
      "Right next to the green and orange lines"
    ],
    link: "/dorms/1-court-street",
    rooms: [
      {
        id: "214",
        videos: [
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4"
        ]
      },
      {
        id: "314",
        videos: [
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4"
        ]
      },
      {
        id: "414",
        videos: [
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4"
        ]
      }
    ]
  },
  {
    name: "Modern Theatre",
    displayName: "Modern Theatre",
    image: "/suffolk-theatre-residence.png",
    description: "Modern Theatre residence hall houses second-year students in Jack and Jill/Adjoining rooms accommodations, all with private bathrooms. The building houses the Modern Theatre residence hall.",
    features: [
      "2-4 students per Adjoining rooms",
      "In the heart of the theater district",
      "A walk away from the Smith cafeteria"
    ],
    link: "/dorms/modern-theatre",
    rooms: [
      {
        id: "510",
        videos: [
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4"
        ]
      },
      {
        id: "610",
        videos: [
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4"
        ]
      },
      {
        id: "710",
        videos: [
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4",
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/suwest413A-video(4).mp4"
        ]
      }
    ]
  }
]

interface SlideshowProps {
  room: DormData['rooms'][0]
  onClose: () => void
}

function Slideshow({ room, onClose }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [showOverlay, setShowOverlay] = useState(true)

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % room.videos.length
    setCurrentIndex(newIndex)
    videoRefs.current[newIndex]?.play()
  }

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? room.videos.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    videoRefs.current[newIndex]?.play()
  }

  const handleMouseEnter = (index: number) => {
    if (index === currentIndex) {
      videoRefs.current[index]?.play()
    }
  }

  const handleMouseLeave = () => {
    videoRefs.current.forEach(video => {
      if (video) {
        video.pause()
        video.currentTime = 0
      }
    })
  }

  const handleCloseOverlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowOverlay(false)
  }

  return (
    <div 
      className="relative w-[270px] aspect-[9/16] overflow-hidden rounded-2xl shadow-lg bg-black transition-all duration-300 hover:opacity-100 hover:scale-105"
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="flex transition-transform duration-600 ease-in-out w-full h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {room.videos.map((videoSrc, index) => (
          <video
            key={index}
            ref={el => videoRefs.current[index] = el}
            src={videoSrc}
            muted
            playsInline
            className="flex-shrink-0 w-full h-full object-cover"
            onMouseEnter={() => handleMouseEnter(index)}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="absolute top-1/2 w-full flex justify-between transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none hover:pointer-events-auto z-10">
        <button
          onClick={prevSlide}
          className="bg-white border-none text-black text-xl p-3 cursor-pointer rounded-full shadow-md transition-all duration-300 hover:bg-gray-200 hover:scale-110 ml-2"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="bg-white border-none text-black text-xl p-3 cursor-pointer rounded-full shadow-md transition-all duration-300 hover:bg-gray-200 hover:scale-110 mr-2"
        >
          ❯
        </button>
      </div>

      {/* Bottom overlay */}
      {showOverlay && (
        <div className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 w-[85%] h-10 bg-white/85 rounded-lg flex justify-center items-center text-black text-sm font-medium shadow-md z-20 px-9 pr-3">
          Room {room.id}
          <button
            onClick={handleCloseOverlay}
            className="absolute top-1 right-1.5 bg-white border-none text-black text-base rounded-full w-6 h-6 cursor-pointer shadow-sm transition-all duration-300 hover:bg-gray-200 hover:scale-110 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default function DormExplorer() {
  const [selectedDorm, setSelectedDorm] = useState<DormData | null>(null)

  const handleDormSelect = (dorm: DormData) => {
    setSelectedDorm(dorm)
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 ml-2">Explore 5 Boston Dorms</h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row min-h-[600px] border border-gray-300 rounded-lg overflow-hidden">
          {/* Left Panel - Dorm Selection */}
          <div className="lg:w-[30%] w-full border-r border-gray-300 bg-gray-50 dark:bg-gray-800 overflow-y-auto p-2.5">
            {dormData.map((dorm) => (
              <button
                key={dorm.name}
                onClick={() => handleDormSelect(dorm)}
                className={`block w-full text-left p-3.5 border-none outline-none cursor-pointer transition-colors duration-300 text-base mb-1 rounded ${
                  selectedDorm?.name === dorm.name 
                    ? 'bg-gray-300 dark:bg-gray-600' 
                    : 'bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
                } text-black dark:text-white`}
              >
                {dorm.name}
              </button>
            ))}
          </div>

          {/* Right Panel - Content */}
          <div className="lg:w-[70%] w-full p-5 overflow-y-auto">
            {selectedDorm ? (
              <div>
                {/* Dorm Overview Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start md:items-center mb-8">
                  <div className="relative rounded-xl overflow-hidden">
                    <Image
                      src={selectedDorm.image}
                      alt={selectedDorm.displayName}
                      width={600}
                      height={300}
                      className="object-cover w-full h-[300px]"
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold">{selectedDorm.displayName}</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {selectedDorm.description}
                    </p>
                    <ul className="space-y-2">
                      {selectedDorm.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="mt-2" asChild>
                      <Link href={selectedDorm.link}>View Dorm Page</Link>
                    </Button>
                  </div>
                </div>

                {/* Video Slideshows Section */}
                <div className="flex justify-center items-center flex-wrap gap-5">
                  {selectedDorm.rooms.map((room) => (
                    <Slideshow
                      key={room.id}
                      room={room}
                      onClose={() => {}}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Welcome</h3>
                  <p className="text-gray-600 dark:text-gray-400">Select a dorm to view details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
