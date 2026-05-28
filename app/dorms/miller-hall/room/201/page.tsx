"use client"

import { RoomPageTemplate } from "@/app/components/RoomPageTemplate"
import { useBackblazeRoomMedia } from "@/app/hooks/useBackblazeRoomMedia"

export default function MillerHallRoom201Page() {
  // Fetch photos/videos from Backblaze automatically
  const { photos: backblazePhotos, loading: photosLoading, error: photosError } = useBackblazeRoomMedia("201", "Miller")

  // Debug logging
  console.log("📸 Room 201 - Photos loading:", photosLoading)
  console.log("📸 Room 201 - Photos count:", backblazePhotos.length)
  console.log("📸 Room 201 - Photos error:", photosError)
  if (backblazePhotos.length > 0) {
    console.log("📸 Room 201 - First photo:", backblazePhotos[0])
  }

  // Room 201 data - photos will be loaded from Backblaze
  const roomDetails = {
    name: "Room 201",
    description: "A spacious double room in Miller Hall featuring modern amenities and excellent natural light. This room is part of an adjoining room setup with Room 202, sharing a Jack and Jill bathroom.",
    size: "225 sq ft",
    occupancy: "Double",
    features: [
      "Carpeted room",
      "Shared bathroom with Room 202",
      "Lock behind you door",
      "Customizable thermostat",
      "TBD - Share your experience!"
    ],
    // Use photos from Backblaze - show them even while loading if we have some
    photos: backblazePhotos
  }

  // Room dimensions (keeping existing placeholder values as per rules)
  const dimensions = {
    width: "TBD feet / TBD meters",
    length: "TBD feet / TBD meters", 
    ceilingHeight: "TBD feet / TBD meters",
    windowSize: "TBD feet x TBD feet / TBD x TBD"
  }

  // Bathroom dimensions (keeping existing placeholder values)
  const bathroomDimensions = {
    width: "TBD feet / TBD meters",
    length: "TBD feet / TBD meters",
    ceilingHeight: "TBD feet / TBD meters"
  }

  // Furniture measurements (keeping existing placeholder values)
  const furniture = [
    {
      name: "Twin XL Bed",
      imperial: "TBD\" x TBD\" x TBD\"",
      metric: "TBD cm x TBD cm x TBD cm"
    },
    {
      name: "Desk",
      imperial: "TBD\" x TBD\" x TBD\"", 
      metric: "TBD cm x TBD cm x TBD cm"
    },
    {
      name: "Chair",
      imperial: "TBD\" x TBD\" x TBD\"",
      metric: "TBD cm x TBD cm x TBD cm"
    },
    {
      name: "Dresser",
      imperial: "TBD\" x TBD\" x TBD\"",
      metric: "TBD cm x TBD cm x TBD cm"
    },
    {
      name: "Closet",
      imperial: "TBD\" x TBD\" x TBD\"",
      metric: "TBD cm x TBD cm x TBD cm"
    }
  ]

  // Related rooms
  const relatedRooms = [
    {
      id: 1,
      type: "Room 202",
      description: "Adjoining room sharing the same bathroom",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller202-plaque.png",
      link: "/dorms/miller-hall/room/202"
    },
    {
      id: 2,
      type: "Room 205",
      description: "Double room on the same floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bedroom-empty-8.jpg",
      link: "/dorms/miller-hall/room/205"
    },
    {
      id: 3,
      type: "Room 206",
      description: "Double room with shared bathroom",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-8.jpg",
      link: "/dorms/miller-hall/room/206"
    }
  ]

  return (
    <RoomPageTemplate
      // Hero props
      backHref="/dorms/miller-hall/communal/adjoining-room/201-202"
      backText="Adjoining Rooms 201 + 202"
      universityName="Suffolk University"
      universityHref="/dorms/suffolk-university"
      dormName="Miller Hall"
      dormHref="/dorms/miller-hall"
      roomTitle="Room 201"
      address="10 Somerset St, Boston, MA 02108, Floor 2, Room 201"
      showCertification={true}
      occupancyBadge="👥 Double"

      // Room data
      roomDetails={roomDetails}
      dimensions={dimensions}
      bathroomDimensions={bathroomDimensions}
      furniture={furniture}
      floorPlanImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/2floorplanmillersuffolk.jpg"
      floorPlanAlt="Room 201 Floor Plan Layout - 2nd Floor"
      roomCoordinates={{
        x: 35,
        y: 30,
        width: 25,
        height: 20
      }}

      // Upload and contact links
      uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=2&room=201"
      contactEmail="4wallsdorms@gmail.com"

      // Related rooms
      relatedRooms={relatedRooms}

      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration from Suffolk University students"

      // Adjoining room section
      adjoiningRoomLink="/dorms/miller-hall/communal/adjoining-room/201-202"
      adjoiningRoomTitle="201 + 202"
      adjoiningRoomDescription="This room is part of an adjoining room setup with Room 202, sharing a Jack and Jill bathroom."
      adjoiningRoomImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/sumillerfloorplanadjointedroom.PNG"
      
      // Loading and error states
      photosLoading={photosLoading}
      photosError={photosError}
    />
  )
} 