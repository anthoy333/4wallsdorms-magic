"use client"

import { RoomPageTemplate } from "@/app/components/RoomPageTemplate"
import { useBackblazeRoomMedia } from "@/app/hooks/useBackblazeRoomMedia"
import { getTenWestRoomInfo, getAllTenWestRooms } from "@/app/utils/tenWestMapping"
import { useRouter } from "next/navigation"
import { useEffect, use } from "react"

interface PageProps {
  params: Promise<{
    roomNumber: string
  }>
}

export default function TenWestRoomPage({ params }: PageProps) {
  const { roomNumber } = use(params)
  const router = useRouter()
  
  // Validate room number exists in 10 West
  const allRooms = getAllTenWestRooms()
  const roomInfo = getTenWestRoomInfo(roomNumber)
  
  useEffect(() => {
    // Redirect to 404 if room doesn't exist
    if (!allRooms.includes(roomNumber) || !roomInfo) {
      router.push('/404')
    }
  }, [roomNumber, allRooms, roomInfo, router])
  
  // If invalid room, return null (will redirect)
  if (!allRooms.includes(roomNumber) || !roomInfo) {
    return null
  }

  // Fetch photos/videos from Backblaze automatically
  const { photos: backblazePhotos, loading: photosLoading, error: photosError } = useBackblazeRoomMedia(roomNumber, "10 West")
  
  // Debug logging
  console.log(`📸 10 West Room ${roomNumber} - Photos loading:`, photosLoading)
  console.log(`📸 10 West Room ${roomNumber} - Photos count:`, backblazePhotos.length)
  console.log(`📸 10 West Room ${roomNumber} - Photos error:`, photosError)
  if (backblazePhotos.length > 0) {
    console.log(`📸 10 West Room ${roomNumber} - First photo:`, backblazePhotos[0])
  }

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

  // Generate room description
  let description = `A ${roomTypeDisplay.toLowerCase()} in 10 West Residence Hall`
  const floorDisplay = typeof roomInfo.floor === 'string' ? roomInfo.floor : `Floor ${roomInfo.floor}`
  description += ` on ${floorDisplay}.`
  
  if (roomInfo.hasSharedSpace) {
    description += " This room has shared spaces including bathroom, kitchen, and common areas."
  }

  // Room details
  const roomDetails = {
    name: `Room ${roomNumber}`,
    description: description,
    size: "TBD sq ft",
    occupancy: roomTypeDisplay,
    features: [
      "Fully furnished",
      roomInfo.hasSharedSpace ? "Shared bathroom and common spaces" : "Private or shared bathroom",
      "Lock behind you door",
      "Customizable thermostat",
      "TBD - Share your experience!"
    ],
    photos: backblazePhotos
  }

  // Room dimensions (placeholder values)
  const dimensions = {
    width: "TBD feet / TBD meters",
    length: "TBD feet / TBD meters", 
    ceilingHeight: "TBD feet / TBD meters",
    windowSize: "TBD feet x TBD feet / TBD x TBD"
  }

  // Bathroom dimensions (placeholder values)
  const bathroomDimensions = {
    width: "TBD feet / TBD meters",
    length: "TBD feet / TBD meters",
    ceilingHeight: "TBD feet / TBD meters"
  }

  // Furniture measurements (placeholder values)
  const furniture = [
    {
      item: "Bed",
      width: "TBD feet / TBD meters",
      length: "TBD feet / TBD meters",
      height: "TBD feet / TBD meters"
    },
    {
      item: "Desk",
      width: "TBD feet / TBD meters",
      length: "TBD feet / TBD meters",
      height: "TBD feet / TBD meters"
    },
    {
      item: "Closet",
      width: "TBD feet / TBD meters",
      length: "TBD feet / TBD meters",
      height: "TBD feet / TBD meters"
    }
  ]

  const floorDisplayForAddress = typeof roomInfo.floor === 'string' ? roomInfo.floor : `Floor ${roomInfo.floor}`

  return (
    <RoomPageTemplate
      backHref="/dorms/10-west"
      backText="10 West Residence Hall"
      universityName="Suffolk University"
      universityHref="/dorms/suffolk-university"
      dormName="10 West Residence Hall"
      dormHref="/dorms/10-west"
      roomTitle={`Room ${roomNumber}`}
      address={`10 West St, Boston, MA 02111, ${floorDisplayForAddress}`}
      showCertification={true}
      roomDetails={roomDetails}
      dimensions={dimensions}
      bathroomDimensions={bathroomDimensions}
      furniture={furniture}
      photosLoading={photosLoading}
      photosError={photosError}
    />
  )
}

