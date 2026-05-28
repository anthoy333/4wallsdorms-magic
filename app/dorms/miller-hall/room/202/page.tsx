"use client"

import { RoomPageTemplate } from "@/app/components/RoomPageTemplate"

export default function MillerHallRoom202Page() {
  // Room 202 data with 202-specific video
  const roomDetails = {
    name: "Room 202",
    description: "A modern double room in Miller Hall featuring contemporary amenities and excellent natural light. This room is part of an adjoining room setup with Room 201, sharing a Jack and Jill bathroom.",
    size: "225 sq ft",
    occupancy: "Double",
    features: [
      "Carpeted room",
      "Shared bathroom with Room 201",
      "Lock behind you door",
      "Customizable thermostat",
      "TBD - Share your experience!"
    ],
    photos: [
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller202-full-33-sec-empty.mp4",
        alt: "Room 202 Complete Tour - 33 seconds",
        caption: "Full Room Tour (Empty)",
        type: "video" as const,
        thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/sumillerfloorplanadjointedroom.PNG"
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
      type: "Room 201",
      description: "Adjoining room sharing the same bathroom",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg",
      link: "/dorms/miller-hall/room/201"
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
      roomTitle="Room 202"
      address="10 Somerset St, Boston, MA 02108, Floor 2, Room 202"
      showCertification={true}
      occupancyBadge="👥 Double"

      // Room data
      roomDetails={roomDetails}
      dimensions={dimensions}
      bathroomDimensions={bathroomDimensions}
      furniture={furniture}
      floorPlanImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/2floorplanmillersuffolk.jpg"
      floorPlanAlt="Room 202 Floor Plan Layout - 2nd Floor"

      // Upload and contact links
      uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=2&room=202"
      contactEmail="4wallsdorms@gmail.com"

      // Related rooms
      relatedRooms={relatedRooms}

      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration from Suffolk University students"

      // Adjoining room section
      adjoiningRoomLink="/dorms/miller-hall/communal/adjoining-room/201-202"
      adjoiningRoomTitle="201 + 202"
      adjoiningRoomDescription="This room is part of an adjoining room setup with Room 201, sharing a Jack and Jill bathroom."
      adjoiningRoomImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/sumillerfloorplanadjointedroom.PNG"
    />
  )
} 