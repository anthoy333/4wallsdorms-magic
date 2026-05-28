"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Play, Camera, X, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { BackButton } from "@/app/components/BackButton"
import { RoomHero } from "@/app/components/RoomHero"
import { AdjoiningRoomPageTemplate } from "@/app/components/AdjoiningRoomPageTemplate"
import { InspirationSection } from "@/app/components/InspirationSection"
import { QuestionsSection } from "@/app/components/QuestionsSection"
import { useBackblazeAdjoiningRoomMedia } from "@/app/hooks/useBackblazeAdjoiningRoomMedia"
import { use } from "react"

// Enhanced RoomPhotoGallery component with carousel, arrows, and video support
function RoomPhotoGallery({ photos }: { photos: { src: string; alt: string; caption?: string; type?: 'image' | 'video' }[] }) {
  const [selected, setSelected] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const enhancedPhotos = photos.map(photo => ({
    ...photo,
    type: photo.type || 'image' // Default to image if type not specified
  }))

  const selectedMedia = enhancedPhotos[selected]

  return (
    <div className="flex flex-col gap-6 w-full mb-12">
      {/* Main Media Display */}
      <div 
        className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-border bg-gray-100 cursor-pointer"
        onClick={() => setIsLightboxOpen(true)}
      >
        {selectedMedia.type === 'video' ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {!isVideoPlaying ? (
              <>
                {selectedMedia.src ? (
                  <Image
                    src={selectedMedia.src}
                    alt={selectedMedia.alt || "Video thumbnail"}
                    width={600}
                    height={300}
                    className="object-cover opacity-70 w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Play className="h-16 w-16 text-white/50" />
                  </div>
                )}
                <Button
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsVideoPlaying(true)
                  }}
                  className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
                >
                  <Play className="h-8 w-8 text-white ml-1" />
                </Button>
              </>
            ) : (
              <video
                src={selectedMedia.src}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-contain"
                onEnded={() => setIsVideoPlaying(false)}
                onClick={(e) => e.stopPropagation()}
                style={{ pointerEvents: 'none' }}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ) : (
          selectedMedia.src ? (
            <Image
              src={selectedMedia.src}
              alt={selectedMedia.alt || "Room image"}
              width={600}
              height={300}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
              <span>No image available</span>
            </div>
          )
        )}
        
        {/* Navigation Arrows on Main Image */}
        {enhancedPhotos.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
              onClick={(e) => {
                e.stopPropagation()
                setSelected(selected === 0 ? enhancedPhotos.length - 1 : selected - 1)
              }}
              disabled={enhancedPhotos.length <= 1}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" 
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
              onClick={(e) => {
                e.stopPropagation()
                setSelected(selected === enhancedPhotos.length - 1 ? 0 : selected + 1)
              }}
              disabled={enhancedPhotos.length <= 1}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Media Counter */}
        {enhancedPhotos.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {selected + 1} / {enhancedPhotos.length}
          </div>
        )}
      </div>
      {/* Thumbnail Scrollable Bar */}
      {enhancedPhotos.length > 1 && (
        <div className="relative">
          <div 
            className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 pb-2"
            style={{ scrollbarWidth: 'thin' }}
          >
            {enhancedPhotos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelected(idx)
                  setIsVideoPlaying(false) // Reset video when switching
                }}
                className={`relative rounded-lg overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 flex-shrink-0 ${
                  selected === idx 
                    ? 'border-primary ring-2 ring-primary scale-105 shadow-lg' 
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ width: 100, height: 80 }}
                aria-label={`Show ${photo.type} ${photo.caption || photo.alt}`}
              >
                {photo.src ? (
                  <Image
                    src={photo.src}
                    alt={photo.alt || photo.caption || "Thumbnail"}
                    width={100}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                {/* Video indicator */}
                {photo.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                )}
                {/* Selection indicator */}
                {selected === idx && (
                  <div className="absolute inset-0 bg-primary/20"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-60 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-8 w-8 text-white" />
          </button>

          {/* Full Size Media */}
          <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center">
            {selectedMedia.type === 'video' ? (
              <video
                src={selectedMedia.src}
                autoPlay
                muted
                loop
                playsInline
                className="max-w-full max-h-full object-contain"
                style={{ pointerEvents: 'none' }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              selectedMedia.src ? (
                <Image
                  src={selectedMedia.src}
                  alt={selectedMedia.alt || "Room image"}
                  width={1200}
                  height={800}
                  className="object-contain w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center text-white">
                  <span>No image available</span>
                </div>
              )
            )}
          </div>

          {/* Navigation in Lightbox */}
          {enhancedPhotos.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => setSelected(selected === 0 ? enhancedPhotos.length - 1 : selected - 1)}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => setSelected(selected === enhancedPhotos.length - 1 ? 0 : selected + 1)}
              >
                <ArrowRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Media Counter in Lightbox */}
          {enhancedPhotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {selected + 1} / {enhancedPhotos.length}
            </div>
          )}
        </div>
      )}
      {/* Caption Display - REMOVED */}
    </div>
  );
}

// Types for different communal housing arrangements
type CommunalHousingType = "adjoining-room" | "apartment" | "suite" | "duplex"

interface CommunalSpaceData {
  id: string
  type: CommunalHousingType
  title: string
  description: string
  roomNumbers: string[]
  size: string
  occupancy: string
  features: string[]
  photos: { src: string; alt: string; caption?: string; type?: 'image' | 'video' }[]
  dimensions: { [key: string]: string }
  furniture: { name: string; dimensions: string }[]
  sharedSpaces: {
    [key: string]: {
      name: string
      description: string
      features: string[]
      image?: string
    }
  }
  individualRooms: {
    number: string
    type: string
    description: string
    image: string
  }[]
}

// Sample data for the communal space
const getCommunalSpaceData = (type: string, id: string): CommunalSpaceData => {
  return {
    id: id,
    type: type as CommunalHousingType,
    title: type === "adjoining-room" 
      ? `Miller Hall Adjoining Room ${id.replace('-', ' + ')}`
      : type === "apartment"
      ? `Miller Hall Apartment ${id}`
      : type === "suite" 
      ? `Miller Hall Suite ${id}`
      : `Miller Hall ${type.charAt(0).toUpperCase() + type.slice(1)} ${id}`,
    description: getDescriptionByType(type),
    roomNumbers: getRoomNumbersByType(type, id),
    size: "440 sq ft total",
    occupancy: "4 students",
    features: [
      "Extra-long twin beds",
      "Built-in desks and chairs",
      "Shared bathroom with adjacent room",
      "Individual closets",
      "Mini-fridge",
      "Microwave",
      "Air conditioning",
      "High-speed internet",
    ],
    photos: [
      {
        src: "/miller-hall-suffolk.png",
        alt: "Miller Hall Exterior",
        caption: "Miller Hall Exterior",
        type: "image" as const
      },
      {
        src: "/double-dorm-room.png",
        alt: "Room Layout",
        caption: "Standard Room Setup",
        type: "image" as const
      },
      {
        src: "/modern-double-dorm.png",
        alt: "Modern Furnishings",
        caption: "Modern Furnishings",
        type: "image" as const
      },
      {
        src: "/jack-and-jill-dorm-floorplan.png",
        alt: "Floor Plan Layout",
        caption: "Floor Plan Layout",
        type: "image" as const
      }
    ],
    dimensions: {
      "Room A": "14 feet × 16 feet",
      "Room B": "14 feet × 16 feet", 
      "Bathroom": "6 feet × 8 feet",
      "Ceiling Height": "9 feet"
    },
    furniture: [
      { name: "Twin XL Bed", dimensions: '39" × 80"' },
      { name: "Desk", dimensions: '42" × 24"' },
      { name: "Dresser", dimensions: '30" × 24" × 36"' },
      { name: "Closet", dimensions: '36" × 24" × 84"' },
      { name: "Mini-fridge", dimensions: '18" × 18" × 24"' }
    ],
    sharedSpaces: getSharedSpacesByType(type),
    individualRooms: getRoomNumbersByType(type, id).map((roomNum, index) => ({
      number: roomNum,
      type: "Double Room",
      description: "Comfortable double room with modern amenities",
      image: index === 0 ? "/double-dorm-room.png" : "/modern-double-dorm.png"
    }))
  }
}

function getDescriptionByType(type: string): string {
  switch(type) {
    case "adjoining-room":
      return "Two connected double rooms sharing a Jack and Jill bathroom, perfect for close friends or roommates who want both privacy and connection."
    case "apartment":
      return "Apartment-style living with multiple bedrooms, shared kitchen, living space, and bathroom facilities."
    case "suite":
      return "Suite arrangement with multiple bedrooms connected by shared common areas and bathroom facilities."
    case "duplex":
      return "Two-level living space with bedrooms and shared facilities across multiple floors."
    default:
      return "Communal living arrangement with shared facilities and multiple room configurations."
  }
}

function getRoomNumbersByType(type: string, id: string): string[] {
  switch(type) {
    case "adjoining-room":
      const [room1, room2] = id.split('-')
      return [room1, room2]
    case "apartment":
    case "suite":
    case "duplex":
      return [`${id}A`, `${id}B`, `${id}C`, `${id}D`]
    default:
      return [id]
  }
}

function getSharedSpacesByType(type: string): {
  [key: string]: {
    name: string
    description: string
    features: string[]
    image?: string
    dimensions?: {
      width: string
      length: string
      ceilingHeight: string
    }
  }
} {
  const allSpaces = {
    bathroom: {
      name: "Bathroom",
      description: "Modern bathroom facilities shared between rooms",
      features: []
    },
    "bathroom-dimensions": {
      name: "Bathroom Dimensions",
      description: "Detailed measurements for the shared bathroom space",
      features: [],
      dimensions: {
        width: "0 feet / 0 meters",
        length: "0 feet / 0 meters",
        ceilingHeight: "0 feet / 0 meters"
      }
    },
    kitchen: {
      name: "Kitchen",
      description: "Fully equipped kitchen for meal preparation",
      features: [
        "Full-size refrigerator",
        "Stovetop and oven",
        "Microwave",
        "Dishwasher",
        "Cabinet storage"
      ]
    },
    "living-space": {
      name: "Living Space",
      description: "Common area for relaxation and socializing",
      features: [
        "Comfortable seating",
        "Entertainment center",
        "Natural lighting",
        "Study space"
      ]
    },
    hallway: {
      name: "Hallway",
      description: "Connecting hallway between rooms and floors",
      features: [
        "Wide corridors",
        "Good lighting",
        "Storage closets",
        "Easy navigation"
      ]
    },
    closet: {
      name: "Closet",
      description: "Shared storage space for personal belongings",
      features: [
        "Built-in shelving",
        "Hanging rod space",
        "Good organization",
        "Secure access"
      ]
    }
  }

  switch(type) {
    case "adjoining-room":
      return {
        bathroom: allSpaces.bathroom,
        "bathroom-dimensions": allSpaces["bathroom-dimensions"]
      }
    case "apartment":
      return {
        bathroom: allSpaces.bathroom,
        kitchen: allSpaces.kitchen,
        "living-space": allSpaces["living-space"],
        closet: allSpaces.closet
      }
    case "suite":
      return {
        bathroom: allSpaces.bathroom,
        "living-space": allSpaces["living-space"],
        closet: allSpaces.closet
      }
    case "duplex":
      return {
        bathroom: allSpaces.bathroom,
        kitchen: allSpaces.kitchen,
        "living-space": allSpaces["living-space"],
        hallway: allSpaces.hallway,
        closet: allSpaces.closet
      }
    default:
      return {
        bathroom: allSpaces.bathroom
      }
  }
}

interface PageProps {
  params: Promise<{
    type: string
    id: string
  }>
}

export default function CommunalHousingPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const { type, id } = resolvedParams
  const router = useRouter()
  
  // Only allow specific IDs
  const allowedIds = ['200-201'] // Add other allowed IDs here
  
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [showPhotoGalleryPopup, setShowPhotoGalleryPopup] = useState(false)
  
  // Handle redirect on client side
  useEffect(() => {
    if (type === 'adjoining-room' && !allowedIds.includes(id)) {
      router.replace('/dorms/miller-hall/communal/adjoining-room/200-201')
      return
    }
  }, [type, id, router])
  
  // Don't render if we need to redirect
  if (type === 'adjoining-room' && !allowedIds.includes(id)) {
    return null
  }
  
  const spaceData = getCommunalSpaceData(type, id)

  // Handle individual room navigation
  const handleIndividualRoomClick = (roomNumber: string) => {
    // Navigate to the specific room page
    router.push(`/dorms/miller-hall/room/${roomNumber}`)
  }

  // Handle related room navigation
  const handleRelatedRoomClick = (roomType: string) => {
    // Navigate to the specific room type page
    console.log(`Navigate to ${roomType} page`)
  }

  // If this is an adjoining-room type, use the template
  if (type === 'adjoining-room') {
    // Extract the first room number from the ID (e.g., "200-201" -> "200")
    const firstRoomNumber = id.split('-')[0]
    
    // Fetch bathroom media from Backblaze for this adjoining room
    const { photos: bathroomPhotos, loading: photosLoading, error: photosError } = useBackblazeAdjoiningRoomMedia(firstRoomNumber, "Miller")
    
    // Transform the spaceData to match the template interface
    // Use Backblaze photos if available, otherwise fall back to placeholder photos
    const adjoiningRoomData = {
      id: spaceData.id,
      title: spaceData.title,
      description: spaceData.description,
      roomNumbers: spaceData.roomNumbers,
      size: spaceData.size,
      occupancy: spaceData.occupancy,
      features: spaceData.features,
      photos: bathroomPhotos.length > 0 ? bathroomPhotos : spaceData.photos.filter(photo => {
        // Filter out videos with invalid sources when using fallback
        if (photo.type === 'video') {
          return photo.src && 
                 photo.src.trim() !== '' && 
                 !photo.src.includes('placeholder.svg') &&
                 (photo.src.startsWith('http') || photo.src.startsWith('/'))
        }
        return true
      }),
      sharedSpaces: spaceData.sharedSpaces,
      individualRooms: spaceData.individualRooms
    }

    const relatedRooms = [
      {
        id: 1,
        type: "Single Room",
        description: "Perfect for students who prefer privacy",
        image: "/minimalist-dorm-room.png"
      },
      {
        id: 2,
        type: "Double Room", 
        description: "Shared room with one roommate",
        image: "/double-dorm-room.png"
      },
      {
        id: 3,
        type: "Triple Room",
        description: "Accommodates three students", 
        image: "/triple-dorm-room.png"
      }
    ]

    return (
      <AdjoiningRoomPageTemplate
        // Hero props
        backHref="/"
        backText="Home"
        universityName="Suffolk University"
        universityHref="/dorms/suffolk-university"
        dormName="Miller Hall"
        dormHref="/dorms/miller-hall"
        roomTitle={`Adjoining Rooms ${id.replace('-', ' + ')}`}
        address="10 Somerset St, Boston, MA 02108, Floor 2"
        showCertification={true}

        // Adjoining room data
        adjoiningRoomData={adjoiningRoomData}
        floorPlanImage="/jack-and-jill-dorm-floorplan.png"
        floorPlanAlt="Adjoining Rooms Floor Plan"

        // Upload and contact links
        uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=2"
        contactEmail="4wallsdorms@gmail.com"

        // Related rooms
        relatedRooms={relatedRooms}

        // Inspiration section
        inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
        inspirationImageAlt="Real decorated dorm room inspiration from a similar Suffolk University room"

      // Callbacks
      onIndividualRoomClick={handleIndividualRoomClick}
      onRelatedRoomClick={handleRelatedRoomClick}
      
      // Loading and error states
      photosLoading={photosLoading}
      photosError={photosError}
    />
  )
  }

  // Generate email subject prefix for this specific page
  const emailSubjectPrefix = `Suffolk Miller ${spaceData.title.replace('Miller Hall ', '')}`

  // For other types (apartment, suite, duplex), keep the original implementation
  return (
    <div className="bg-background">
      {/* RoomHero Section */}
      <RoomHero
        backHref="/"
        backText="Home"
        universityName="Suffolk University"
        universityHref="/dorms/suffolk-university"
        dormName="Miller Hall"
        dormHref="/dorms/miller-hall"
        showCertification={true}
        roomTitle={spaceData.title.replace('Miller Hall ', '')}
        address="790 7th Avenue, New York, NY 10019, United States"
      />
      {/* Room Photo Gallery */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-2 pb-10">
        <RoomPhotoGallery photos={spaceData.photos} />
        <div className="text-center mt-6">
          <Button size="lg" onClick={() => setShowPhotoGalleryPopup(true)}>
            Add Photos or Report Issues
          </Button>
        </div>
      </div>
      {/* Photo Gallery Popup */}
      {showPhotoGalleryPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-100 rounded-xl shadow-2xl max-w-md w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowPhotoGalleryPopup(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Popup Content */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Communal Space Gallery</h3>
              <p className="text-muted-foreground mb-8">Help Us, Help Millions!</p>

              <div className="space-y-4">
                {/* Add Photos Button */}
                <Button size="lg" className="w-full" asChild>
                  <Link href="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=8">
                    <Camera className="mr-2 h-5 w-5" />
                    Add Photos and Videos
                  </Link>
                </Button>

                {/* Report Issues Button */}
                <div>
                  <Button size="lg" variant="outline" className="w-full" asChild>
                    <Link href="mailto:4wallsdorms@gmail.com?subject=Suffolk Miller Communal Space Photo Gallery Issues">
                      Report Mistakes or Changes
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">***Use Your Student Email***</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Floor Plan Section */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Floor Plan</h2>
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden border border-border mb-6">
          <Image
            src="/jack-and-jill-dorm-floorplan.png"
            alt="Floor Plan"
            width={600}
            height={300}
            className="object-contain w-full h-full"
          />
        </div>
        <div className="text-center">
          <Button size="lg" asChild>
            <Link href={`mailto:4wallsdorms@gmail.com?subject=${emailSubjectPrefix} Floor Plan Update`}>
              Update With Your Student Take
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">***Use Your Student Email***</p>
        </div>
      </div>
      {/* Shared Spaces */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Shared Spaces</h2>

        <Tabs defaultValue={Object.keys(spaceData.sharedSpaces)[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
            {Object.entries(spaceData.sharedSpaces).map(([key, space]) => (
              <TabsTrigger key={key} value={key}>
                {space.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(spaceData.sharedSpaces).map(([key, space]) => (
            <TabsContent key={key} value={key} className="border rounded-lg p-6">
              {/* Call to Action Section for Bathroom Dimensions */}
              {key === "bathroom-dimensions" && (
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-1">We Need Your Help</h2>
                  <p className="text-lg text-muted-foreground mb-4">to Measure the Dorm Bathrooms!</p>
                  <Button asChild>
                    <Link href="/coming-soon">
                      Learn How?
                    </Link>
                  </Button>
                </div>
              )}

              {/* Call to Action Section for Bathroom */}
              {key === "bathroom" && (
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-1">We Need Your Help</h2>
                  <p className="text-lg text-muted-foreground mb-4">to Fill In the Dorm Information!</p>
                  <Button asChild>
                    <Link href="/coming-soon">
                      Learn How?
                    </Link>
                  </Button>
                </div>
              )}

              <h3 className="text-lg font-semibold mb-4">{space.name}</h3>
              <p className="text-muted-foreground mb-4">{space.description}</p>
              
              {/* Special layout for Bathroom Dimensions */}
              {key === "bathroom-dimensions" && (space as any).dimensions ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {Object.entries((space as any).dimensions).map(([dimKey, value], index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground capitalize">{dimKey.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-medium">{value as string}</span>
                    </div>
                  ))}
                </div>
              
              ) : (
                /* Regular layout for other tabs */
                (<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {space.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-3"></span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>)
              )}
              
              <div className="text-center">
                <Button size="lg" asChild>
                  <Link href={`mailto:4wallsdorms@gmail.com?subject=${emailSubjectPrefix} ${space.name} Update`}>
                    Update With Your Student Take
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">***Use Your Student Email***</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      {/* Individual Rooms Section */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Individual Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spaceData.individualRooms.map((room, index) => (
            <div
              key={room.number}
              className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
              onClick={() => handleIndividualRoomClick(room.number)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleIndividualRoomClick(room.number)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View ${room.number} room details`}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-muted">
                  {room.image ? (
                    <Image
                      src={room.image}
                      alt={`${room.number} Room`}
                      width={600}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      <span>No image</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{room.number} Room</h3>
                  <p className="text-muted-foreground text-sm mb-4">{room.type}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation() // Prevent card click when button is clicked
                      handleIndividualRoomClick(room.number)
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      {/* Floor Plan Section (Repeated) */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Floor Plan</h2>
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden border border-border mb-6">
          <Image
            src="/jack-and-jill-dorm-floorplan.png"
            alt="Detailed Floor Plan"
            width={600}
            height={300}
            className="object-contain w-full h-full"
          />
        </div>
        <div className="text-center">
          <Button size="lg" asChild>
            <Link href={`mailto:4wallsdorms@gmail.com?subject=${emailSubjectPrefix} Floor Plan Update`}>
              Update With Your Student Take
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">***Use Your Student Email***</p>
        </div>
      </div>
      {/* Inspired Section */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Image */}
          <div className="relative h-[400px] rounded-xl overflow-hidden">
            <Image
              src="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
              alt="Real decorated dorm room inspiration - student room with bed, posters, and personal touches"
              width={600}
              height={300}
              className="object-cover w-full h-full"
            />
          </div>
          
          {/* Right side - Content */}
          <div>
            <InspirationSection dormHref="/dorms/miller-hall" dormName="Miller Hall" />
          </div>
        </div>
      </div>
      {/* Other Room Types Section */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Other Room Types in Miller Hall</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Single Room", "Double Room", "Triple Room"].map((roomType, index) => (
            <div
              key={index}
              className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
              onClick={() => handleRelatedRoomClick(roomType)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleRelatedRoomClick(roomType)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View ${roomType} details`}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <Image
                    src="/placeholder.svg"
                    alt="Room placeholder"
                    width={600}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{roomType}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {index === 0
                      ? "Perfect for students who prefer privacy"
                      : index === 1
                        ? "Shared room with one roommate"
                        : "Accommodates three students"}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation() // Prevent card click when button is clicked
                      handleRelatedRoomClick(roomType)
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      {/* Questions Section */}
      <QuestionsSection 
        dormName="Miller Hall"
        dormHref="/dorms/miller-hall"
        contactEmail="4wallsdorms@gmail.com"
        universityName="Suffolk University"
      />
    </div>
  );
} 