"use client"

import { RoomPageTemplate } from "@/app/components/RoomPageTemplate"
import { useBackblazeRoomMedia } from "@/app/hooks/useBackblazeRoomMedia"
import { getMillerHallRoomInfo, getAllMillerHallRooms } from "@/app/utils/millerHallMapping"
import { useRouter } from "next/navigation"
import { useEffect, use } from "react"

interface PageProps {
  params: Promise<{
    roomNumber: string
  }>
}

export default function MillerHallRoomPage({ params }: PageProps) {
  const { roomNumber } = use(params)
  const router = useRouter()
  
  // Validate room number exists in Miller Hall
  const allRooms = getAllMillerHallRooms()
  const roomInfo = getMillerHallRoomInfo(roomNumber)
  
  useEffect(() => {
    // Redirect to 404 if room doesn't exist or is a common area
    if (!allRooms.includes(roomNumber) || !roomInfo || roomInfo.type === 'common' || roomInfo.type === 'public-bathroom') {
      router.push('/404')
    }
  }, [roomNumber, allRooms, roomInfo, router])
  
  // If invalid room, return null (will redirect)
  if (!allRooms.includes(roomNumber) || !roomInfo || roomInfo.type === 'common' || roomInfo.type === 'public-bathroom') {
    return null
  }

  // Fetch photos/videos from Backblaze automatically
  const { photos: backblazePhotos, loading: photosLoading, error: photosError } = useBackblazeRoomMedia(roomNumber, "Miller")

  // Redirect to 404 if no media found after loading completes
  useEffect(() => {
    if (!photosLoading && backblazePhotos.length === 0 && !photosError) {
      router.push('/404')
    }
  }, [photosLoading, backblazePhotos.length, photosError, router])
  
  // Don't render if no media (will redirect)
  if (!photosLoading && backblazePhotos.length === 0 && !photosError) {
    return null
  }

  // Determine room type display name
  let roomTypeDisplay = "Double"
  if (roomInfo.type === 'single') {
    roomTypeDisplay = "Single"
  } else if (roomInfo.type === 'quad') {
    roomTypeDisplay = "Quad"
  }

  // Generate room description
  let description = `A ${roomTypeDisplay.toLowerCase()} room in Miller Hall on floor ${roomInfo.floor}.`
  if (roomInfo.adjoiningRoom) {
    description += ` This room is part of an adjoining room setup with Room ${roomInfo.adjoiningRoom}, sharing a Jack and Jill bathroom.`
  }
  if (roomInfo.isAccessible) {
    description += " This room is accessible."
  }

  // Room details
  const roomDetails = {
    name: `Room ${roomNumber}`,
    description: description,
    size: "TBD sq ft",
    occupancy: roomTypeDisplay,
    features: [
      "Carpeted room",
      roomInfo.adjoiningRoom ? `Shared bathroom with Room ${roomInfo.adjoiningRoom}` : "Private or shared bathroom",
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

  return (
    <RoomPageTemplate
      backHref="/dorms/miller-hall"
      backText="Miller Hall"
      universityName="Suffolk University"
      universityHref="/dorms/suffolk-university"
      dormName="Miller Hall"
      dormHref="/dorms/miller-hall"
      roomTitle={`Room ${roomNumber}`}
      address={`10 Somerset St, Boston, MA 02108, Floor ${roomInfo.floor}`}
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

