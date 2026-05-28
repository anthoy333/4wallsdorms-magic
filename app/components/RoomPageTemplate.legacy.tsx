"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Camera, X, ArrowLeft, ArrowRight } from "lucide-react"
import { SplitViewFloorPlan } from "./SplitViewFloorPlan"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { RoomHero } from "./RoomHero"
import { InspirationSection } from "./InspirationSection"
import { QuestionsSection } from "./QuestionsSection"
import { BackToAdjoiningRoomPage } from "./BackToAdjoiningRoomPage"
import { OtherRoomsInMillerHall } from "./OtherRoomsInMillerHall"

// Enhanced RoomPhotoGallery component with carousel thumbnails
function RoomPhotoGallery({ photos }: { photos: { src: string; alt: string; caption?: string; type?: 'image' | 'video'; thumbnail?: string }[] }) {
  const [selected, setSelected] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const enhancedPhotos = photos.map(photo => ({
    ...photo,
    type: photo.type || 'image' // Default to image if type not specified
  }))

  // Reset selected index when photos change
  useEffect(() => {
    if (photos.length > 0 && selected >= photos.length) {
      setSelected(0)
    }
  }, [photos.length, selected])

  // Handle empty photos array
  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Camera className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No photos or videos available for this room yet.</p>
      </div>
    )
  }

  // Ensure selected index is valid
  const validSelected = Math.min(selected, enhancedPhotos.length - 1)
  const selectedMedia = enhancedPhotos[validSelected]
  
  // Safety check
  if (!selectedMedia) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Camera className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No photos or videos available for this room yet.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full mb-12">
      {/* Main Media Display */}
      <div 
        className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-border bg-gray-100 cursor-pointer"
        onClick={() => setIsLightboxOpen(true)}
      >
        {selectedMedia.type === 'video' ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              src={selectedMedia.src}
              autoPlay
              muted
              loop
              playsInline
              controls
              controlsList="nodownload nofullscreen noremoteplayback"
              disablePictureInPicture
              className="w-full h-full object-contain"
              onClick={(e) => {
                e.stopPropagation()
                const video = e.target as HTMLVideoElement;
                if (video.paused) {
                  video.play();
                } else {
                  video.pause();
                }
              }}
              style={{ 
                pointerEvents: 'auto',
              }}
              onVolumeChange={(e) => {
                // Force mute if user tries to unmute
                const video = e.target as HTMLVideoElement;
                if (!video.muted) {
                  video.muted = true;
                }
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <Image
            src={selectedMedia.src || "/placeholder.svg"}
            alt={selectedMedia.alt}
            fill
            className="object-cover"
          />
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

        {/* Navigation Dots - Bottom Center */}
        {enhancedPhotos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2">
            {enhancedPhotos.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelected(idx)
                }}
                className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full transition-all duration-200"
                aria-label={`Go to slide ${idx + 1}`}
              >
                {selected === idx ? (
                  <div className="h-1 w-8 bg-white rounded-full"></div>
                ) : (
                  <div className="h-2 w-2 bg-white/50 rounded-full hover:bg-white/70"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsLightboxOpen(false)
            }}
            className="absolute top-4 right-4 z-60 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-8 w-8 text-white" />
          </button>

          {/* Full Size Media */}
          <div 
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.type === 'video' ? (
              <video
                src={selectedMedia.src}
                autoPlay
                muted
                loop
                playsInline
                controls
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                className="max-w-full max-h-full object-contain"
                onClick={(e) => {
                  e.stopPropagation()
                  const video = e.target as HTMLVideoElement;
                  if (video.paused) {
                    video.play();
                  } else {
                    video.pause();
                  }
                }}
                style={{ 
                  pointerEvents: 'auto',
                }}
                onVolumeChange={(e) => {
                  // Force mute if user tries to unmute
                  const video = e.target as HTMLVideoElement;
                  if (!video.muted) {
                    video.muted = true;
                  }
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={selectedMedia.src || "/placeholder.svg"}
                alt={selectedMedia.alt}
                fill
                className="object-contain"
              />
            )}
          </div>

          {/* Navigation in Lightbox */}
          {enhancedPhotos.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelected(selected === 0 ? enhancedPhotos.length - 1 : selected - 1)
                }}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelected(selected === enhancedPhotos.length - 1 ? 0 : selected + 1)
                }}
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

    </div>
  )
}

// Room data types
interface RoomPhoto {
  src: string
  alt: string
  caption?: string
  type?: 'image' | 'video'
  thumbnail?: string
}

interface RoomDimensions {
  width: string
  length: string
  ceilingHeight: string
  windowSize: string
}

interface BathroomDimensions {
  width: string
  length: string
  ceilingHeight: string
}

interface FurnitureItem {
  name: string
  imperial: string
  metric: string
}

interface RoomDetails {
  name: string
  description: string
  size: string
  occupancy: string
  features: string[]
  photos: RoomPhoto[]
}

interface RoomPageTemplateProps {
  // Hero props
  backHref: string
  backText: string
  universityName: string
  universityHref?: string
  dormName: string
  dormHref: string
  roomTitle: string
  address: string
  showCertification?: boolean
  featuredBadge?: string
  occupancyBadge?: string

  // Room data
  roomDetails: RoomDetails
  dimensions: RoomDimensions
  bathroomDimensions: BathroomDimensions
  furniture: FurnitureItem[]
  floorPlanImage?: string
  floorPlanAlt?: string
  roomCoordinates?: {
    x: number
    y: number
    width: number
    height: number
  }

  // Upload and contact links
  uploadDormLink: string
  contactEmail: string
  
  // Related rooms (optional)
  relatedRooms?: Array<{
    id: number
    type: string
    description: string
    image: string
  }>

  // Inspiration section (optional)
  inspirationImage?: string
  inspirationImageAlt?: string

  // Adjoining room section (optional)
  adjoiningRoomLink?: string
  adjoiningRoomTitle?: string
  adjoiningRoomDescription?: string
  adjoiningRoomImage?: string
}

export function RoomPageTemplate({
  backHref,
  backText,
  universityName,
  universityHref,
  dormName,
  dormHref,
  roomTitle,
  address,
  showCertification = true,
  featuredBadge,
  occupancyBadge,
  roomDetails,
  dimensions,
  bathroomDimensions,
  furniture,
  floorPlanImage,
  floorPlanAlt,
  roomCoordinates,
  uploadDormLink,
  contactEmail,
  relatedRooms,
  inspirationImage,
  inspirationImageAlt,
  adjoiningRoomLink,
  adjoiningRoomTitle,
  adjoiningRoomDescription,
  adjoiningRoomImage
}: RoomPageTemplateProps) {
  const [showPhotoGalleryPopup, setShowPhotoGalleryPopup] = useState(false)

  return (
    <div className="bg-background">
      {/* RoomHero Section */}
      <RoomHero
        backHref={backHref}
        backText={backText}
        universityName={universityName}
        universityHref={universityHref}
        dormName={dormName}
        dormHref={dormHref}
        showCertification={showCertification}
        roomTitle={roomTitle}
        address={address}
        featuredBadge={featuredBadge}
        occupancyBadge={occupancyBadge}
      />

      {/* Room Photo Gallery */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-2 pb-10">
        <RoomPhotoGallery photos={roomDetails.photos} />
        {roomDetails.photos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Loading photos from Backblaze...</p>
            <p className="text-sm text-muted-foreground">Check the browser console (F12) for details.</p>
          </div>
        )}
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
              <h3 className="text-2xl font-bold mb-2">Dorm Room Gallery</h3>
              <p className="text-muted-foreground mb-8">Help Us, Help Millions!</p>

              <div className="space-y-4">
                {/* Add Photos Button */}
                <Button size="lg" className="w-full" asChild>
                  <Link href={uploadDormLink}>
                    <Camera className="mr-2 h-5 w-5" />
                    Add Photos and Videos
                  </Link>
                </Button>

                {/* Report Issues Button */}
                <div>
                  <Button size="lg" variant="outline" className="w-full" asChild>
                    <Link href={`mailto:${contactEmail}?subject=${universityName} ${dormName} ${roomTitle} Photo Gallery Issues`}>
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

      {/* Room Specifications */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Room Specifications</h2>

        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="dimensions">Room Dimensions</TabsTrigger>
            <TabsTrigger value="furniture">Furniture Measurements</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="border rounded-lg p-6">
            {/* Call to Action Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-1">We Need Your Help</h2>
              <p className="text-lg text-muted-foreground mb-4">to Fill In the Dorm Information!</p>
              <Button asChild>
                <Link href="/coming-soon">
                  Learn How?
                </Link>
              </Button>
            </div>

            <h3 className="text-lg font-semibold mb-4">Room Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {roomDetails.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-3"></span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button size="lg" asChild>
                <Link href={`mailto:${contactEmail}?subject=${universityName} ${dormName} ${roomTitle} Features Update`}>
                  Update With Your Student Take
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">***Use Your Student Email***</p>
            </div>
          </TabsContent>

          <TabsContent value="dimensions" className="border rounded-lg p-6">
            {/* Call to Action Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-1">We Need Your Help</h2>
              <p className="text-lg text-muted-foreground mb-4">to Measure the Dorm Rooms!</p>
              <Button asChild>
                <Link href="/coming-soon">
                  Learn How?
                </Link>
              </Button>
            </div>

            <h3 className="text-lg font-semibold mb-4">Room Dimensions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {Object.entries(dimensions).map(([key, _], index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="font-medium">TBD</span>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold mb-4">Bathroom Dimensions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {Object.entries(bathroomDimensions).map(([key, _], index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="font-medium">TBD</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" asChild>
                <Link href={`mailto:${contactEmail}?subject=${universityName} ${dormName} ${roomTitle} Room Dimensions Update`}>
                  Update With Your Student Take
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">***Use Your Student Email***</p>
            </div>
          </TabsContent>

          <TabsContent value="furniture" className="border rounded-lg p-6">
            {/* Call to Action Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-1">We Need Your Help</h2>
              <p className="text-lg text-muted-foreground mb-4">to Measure the Dorm Furniture!</p>
              <Button asChild>
                <Link href="/coming-soon">
                  Learn How?
                </Link>
              </Button>
            </div>

            <h3 className="text-lg font-semibold mb-4">Furniture Measurements</h3>
            
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 mb-4 pb-2 border-b font-semibold">
              <span className="text-muted-foreground"></span>
              <span className="text-center">Imperial (USA)</span>
              <span className="text-center">Metric</span>
            </div>
            
            {/* Table Rows */}
            <div className="space-y-4 mb-6">
              {furniture.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center border-b pb-2">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="text-center font-medium">TBD</span>
                  <span className="text-center font-medium">TBD</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button size="lg" asChild>
                <Link href={`mailto:${contactEmail}?subject=${universityName} ${dormName} ${roomTitle} Furniture Measurements Update`}>
                  Update With Your Student Take
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">***Use Your Student Email***</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floor Plan */}
      {floorPlanImage && (
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Floor Plan</h2>
          <div className="mb-6">
            <SplitViewFloorPlan
              floorPlanImage={floorPlanImage}
              floorPlanAlt={floorPlanAlt || `Floor plan for ${roomTitle}`}
              roomNumber={roomTitle.replace("Room ", "")}
              roomCoordinates={roomCoordinates || {
                x: 20,  // Default coordinates if none provided
                y: 20,
              width: 15,
              height: 15
            }}
          />
        </div>
        <div className="text-center">
          <Button size="lg" asChild>
            <Link href={`mailto:${contactEmail}?subject=${encodeURIComponent(`${universityName} ${dormName} ${roomTitle} Floor Plan Update`)}`}>
              Update With Your Student Take
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">***Use Your Student Email***</p>
        </div>
      </div>
      )}

      {/* Adjoining Room Section */}
      {adjoiningRoomLink && (
        <BackToAdjoiningRoomPage
          roomNumbers={adjoiningRoomTitle?.replace("Miller Hall Adjoining Room ", "").replace(" + ", " + ") || "201 + 202"}
          adjoiningRoomLink={adjoiningRoomLink}
          roomImage={adjoiningRoomImage || "https://f005.backblazeb2.com/file/4wallsdorms/Screenshot+2025-08-07+160651.png"}
        />
      )}

      {/* Inspired or Want to Help Section */}
      {inspirationImage && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left side - Image */}
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  src={inspirationImage}
                  alt={inspirationImageAlt || "Real decorated dorm room inspiration"}
                  width={600}
                  height={400}
                  className="object-cover w-full h-[400px]"
                />
              </div>
              
              {/* Right side - Content */}
              <div>
                <InspirationSection dormHref={dormHref} dormName={dormName} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Questions Section */}
      <QuestionsSection 
        dormName={dormName}
        dormHref={dormHref}
        contactEmail={contactEmail}
        universityName={universityName}
      />

      {/* Other Rooms in Miller Hall */}
      {relatedRooms && relatedRooms.length > 0 && (
        <OtherRoomsInMillerHall rooms={relatedRooms} />
      )}
    </div>
  )
}