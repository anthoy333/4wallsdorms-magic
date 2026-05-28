"use client"

import { RoomPageTemplate } from "@/app/components/RoomPageTemplate"

export default function MillerHallRoom206Page() {
  // Room 206 data with all 206-specific photos/videos
  const roomDetails = {
    name: "Room 206",
    description: "A spacious double room in Miller Hall featuring modern amenities and excellent natural light. This room is part of an adjoining room setup with Room 205, sharing a Jack and Jill bathroom.",
    size: "225 sq ft",
    occupancy: "Double",
    features: [
      "Carpeted room",
      "Shared bathroom with Room 205",
      "Lock behind you door",
      "Customizable thermostat",
      "TBD - Share your experience!"
    ],
    photos: [
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205%2B206-full-56-sec-empty-1.mp4",
        alt: "Room 206 Full Tour Video",
        caption: "Complete Room Tour (Empty)",
        type: "video" as const,
        thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-8.jpg"
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-11.jpg",
        alt: "Room 206 Bedroom View 1",
        caption: "Bedroom Overview 1",
        type: "image" as const
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-8.jpg",
        alt: "Room 206 Bedroom View 2",
        caption: "Bedroom Overview 2",
        type: "image" as const
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-9.jpg",
        alt: "Room 206 Bedroom View 3",
        caption: "Bedroom Overview 3",
        type: "image" as const
      }
    ]
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
      type: "Room 205",
      description: "Adjoining room sharing the same bathroom",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bedroom-empty-4.jpg",
      link: "/dorms/miller-hall/room/205"
    },
    {
      id: 2,
      type: "Room 201",
      description: "Double room on the same floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg",
      link: "/dorms/miller-hall/room/201"
    },
    {
      id: 3,
      type: "Room 202",
      description: "Double room with shared bathroom",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller202-plaque.png",
      link: "/dorms/miller-hall/room/202"
    }
  ]

  return (
    <RoomPageTemplate
      // Hero props
      backHref="/dorms/miller-hall/communal/adjoining-room/205-206"
      backText="Adjoining Rooms 205 + 206"
      universityName="Suffolk University"
      universityHref="/dorms/suffolk-university"
      dormName="Miller Hall"
      dormHref="/dorms/miller-hall"
      roomTitle="Room 206"
      address="10 Somerset St, Boston, MA 02108, Floor 2, Room 206"
      showCertification={true}
      occupancyBadge="👥 Double"

      // Room data
      roomDetails={roomDetails}
      dimensions={dimensions}
      bathroomDimensions={bathroomDimensions}
      furniture={furniture}
      floorPlanImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/2floorplanmillersuffolk.jpg"
      floorPlanAlt="Room 206 Floor Plan Layout - 2nd Floor"

      // Upload and contact links
      uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=2&room=206"
      contactEmail="4wallsdorms@gmail.com"

      // Related rooms
      relatedRooms={relatedRooms}

      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration from Suffolk University students"

      // Adjoining room section
      adjoiningRoomLink="/dorms/miller-hall/communal/adjoining-room/205-206"
      adjoiningRoomTitle="205 + 206"
      adjoiningRoomDescription="This room is part of an adjoining room setup with Room 205, sharing a Jack and Jill bathroom."
    />
  )
} 