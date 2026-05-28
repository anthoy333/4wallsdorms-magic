"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Camera, X, ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { RoomHero } from "./RoomHero"
import { InspirationSection } from "./InspirationSection"
import { QuestionsSection } from "./QuestionsSection"
import { OtherRoomsInMillerHall } from "./OtherRoomsInMillerHall"

// Enhanced RoomPhotoGallery component with scrollable thumbnails
function RoomPhotoGallery({ photos }: { photos: { src: string; alt: string; caption?: string; type?: 'image' | 'video'; thumbnail?: string }[] }) {
  const [selected, setSelected] = useState(0)
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
            {selectedMedia.src && selectedMedia.src.trim() !== '' ? (
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
                onError={(e) => {
                  // Handle video load errors gracefully
                  console.error('Video failed to load:', selectedMedia.src)
                  const video = e.target as HTMLVideoElement;
                  video.style.display = 'none'
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white">
                <Camera className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-sm opacity-75">No video available</p>
              </div>
            )}
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

      {/* Shared Space Media Title - Between main photo and carousel */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-2">Shared Space Media</h2>
        <p className="text-sm text-muted-foreground">***Individual Rooms Below***</p>
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

// Types for adjoining room data
interface AdjoiningRoomPhoto {
  src: string
  alt: string
  caption?: string
  type?: 'image' | 'video'
  thumbnail?: string
}

interface SharedSpace {
  name: string
  description: string
  features: string[]
  dimensions?: {
    width: string
    length: string
    ceilingHeight: string
  }
}

interface IndividualRoom {
  number: string
  type: string
  description: string
  image: string
}

interface AdjoiningRoomData {
  id: string
  title: string
  description: string
  roomNumbers: string[]
  size: string
  occupancy: string
  features: string[]
  photos: AdjoiningRoomPhoto[]
  sharedSpaces: {
    [key: string]: SharedSpace
  }
  individualRooms: IndividualRoom[]
}

interface AdjoiningRoomPageTemplateProps {
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

  // Adjoining room data
  adjoiningRoomData: AdjoiningRoomData
  floorPlanImage: string
  floorPlanAlt: string

  // Upload and contact links
  uploadDormLink: string
  contactEmail: string
  
  // Related rooms (optional)
  relatedRooms?: Array<{
    id: number
    type: string
    description: string
    image: string
    link: string
  }>

  // Inspiration section (optional)
  inspirationImage?: string
  inspirationImageAlt?: string

  // Callbacks for individual room navigation (optional)
  onIndividualRoomClick?: (roomNumber: string) => void
  onRelatedRoomClick?: (roomType: string, link: string) => void
}

export function AdjoiningRoomPageTemplate({
  backHref,
  backText,
  universityName,
  universityHref,
  dormName,
  dormHref,
  roomTitle,
  address,
  showCertification = true,
  adjoiningRoomData,
  floorPlanImage,
  floorPlanAlt,
  uploadDormLink,
  contactEmail,
  relatedRooms,
  inspirationImage,
  inspirationImageAlt,
  onIndividualRoomClick,
  onRelatedRoomClick,
  photosLoading = false,
  photosError = null
}: AdjoiningRoomPageTemplateProps) {
  const [showPhotoGalleryPopup, setShowPhotoGalleryPopup] = useState(false)

  // Generate email subject prefix for this specific page
  const emailSubjectPrefix = `${universityName} ${dormName} ${roomTitle}`

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
      />

      {/* Shared Space Media Section */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-2 pb-10">
        {photosLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-lg">Loading bathroom photos and videos...</p>
          </div>
        ) : photosError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-red-500">
            <AlertCircle className="h-12 w-12 mb-4" />
            <p className="text-lg font-semibold">Error loading media:</p>
            <p className="text-sm text-muted-foreground">{photosError}</p>
          </div>
        ) : adjoiningRoomData.photos && adjoiningRoomData.photos.length > 0 ? (
          <>
            <RoomPhotoGallery photos={adjoiningRoomData.photos} />
            <div className="text-center mt-6">
              <Button size="lg" onClick={() => setShowPhotoGalleryPopup(true)}>
                Add Photos or Report Issues
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Camera className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">No bathroom photos or videos available yet.</p>
            <div className="text-center mt-6">
              <Button size="lg" onClick={() => setShowPhotoGalleryPopup(true)}>
                Add Photos or Report Issues
              </Button>
            </div>
          </div>
        )}
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
              <h3 className="text-2xl font-bold mb-2">Adjoining Room Gallery</h3>
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
                    <Link href={`mailto:${contactEmail}?subject=${emailSubjectPrefix} Photo Gallery Issues`}>
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
            src={floorPlanImage}
            alt={floorPlanAlt}
            fill
            className="object-contain"
          />
        </div>
        <div className="text-center">
          <Button size="lg" asChild>
            <Link href={`mailto:${contactEmail}?subject=${emailSubjectPrefix} Floor Plan Update`}>
              Update With Your Student Take
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">***Use Your Student Email***</p>
        </div>
      </div>

      {/* Shared Spaces */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Shared Spaces</h2>

        <Tabs defaultValue={Object.keys(adjoiningRoomData.sharedSpaces)[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
            {Object.entries(adjoiningRoomData.sharedSpaces).map(([key, space]) => (
              <TabsTrigger key={key} value={key}>
                {space.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(adjoiningRoomData.sharedSpaces).map(([key, space]) => (
            <TabsContent key={key} value={key} className="border rounded-lg p-6">
              {/* Call to Action Section for dimensions */}
              {key.includes("dimensions") && (
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-1">We Need Your Help</h2>
                  <p className="text-lg text-muted-foreground mb-4">to Measure the Shared Spaces!</p>
                  <Button asChild>
                    <Link href="/coming-soon">
                      Learn How?
                    </Link>
                  </Button>
                </div>
              )}

              {/* Call to Action Section for regular spaces */}
              {!key.includes("dimensions") && (
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-1">We Need Your Help</h2>
                  <p className="text-lg text-muted-foreground mb-4">to Fill In the Space Information!</p>
                  <Button asChild>
                    <Link href="/coming-soon">
                      Learn How?
                    </Link>
                  </Button>
                </div>
              )}

              <h3 className="text-lg font-semibold mb-4">{space.name}</h3>
              <p className="text-muted-foreground mb-4">{space.description}</p>
              
              {/* Special layout for dimensions */}
              {space.dimensions ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {Object.entries(space.dimensions).map(([dimKey, value], index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground capitalize">{dimKey.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                /* Regular layout for features */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {space.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-3"></span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-center">
                <Button size="lg" asChild>
                  <Link href={`mailto:${contactEmail}?subject=${emailSubjectPrefix} ${space.name} Update`}>
                    {key.includes("dimensions") ? "Update With Dimensions" : "Update With Your Student Take"}
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
          {adjoiningRoomData.individualRooms.map((room, index) => (
            <div
              key={room.number}
              className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
              onClick={() => onIndividualRoomClick?.(room.number)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onIndividualRoomClick?.(room.number)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View ${room.number} room details`}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <Image
                    src={room.image || "/placeholder.svg"}
                    alt={`${room.number} in ${dormName}`}
                    width={400}
                    height={192}
                    className="object-cover w-full h-48"
                  />
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
                      onIndividualRoomClick?.(room.number)
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

      {/* Inspiration Section */}
      {inspirationImage && (
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Image */}
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src={inspirationImage}
                alt={inspirationImageAlt || "Real decorated adjoining room inspiration"}
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
      )}

      {/* Questions Section */}
      <QuestionsSection 
        dormName={dormName}
        dormHref={dormHref}
        contactEmail={contactEmail}
        universityName={universityName}
      />

      {/* Related Rooms Section */}
      {relatedRooms && relatedRooms.length > 0 && (
        <OtherRoomsInMillerHall rooms={relatedRooms} onRelatedRoomClick={onRelatedRoomClick} />
      )}
    </div>
  )
} 