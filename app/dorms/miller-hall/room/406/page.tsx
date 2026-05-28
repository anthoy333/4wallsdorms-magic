"use client"

import { RoomPageTemplate } from "@/app/components/RoomPageTemplate"

export default function MillerHallRoom406Page() {
  const roomDetails = {
    name: "Room 406",
    description: "A comfortable double room in Miller Hall featuring modern amenities and excellent natural light. This room is part of an adjoining room setup with Room 405.",
    size: "225 sq ft",
    occupancy: "Double",
    features: [
      "Carpeted room",
      "Shared bathroom with Room 405",
      "Lock behind you door",
      "Customizable thermostat",
      "TBD - Share your experience!"
    ],
    photos: [
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/floor+4/405+%2B+406/sumiller406-24-sec-empty.mp4",
        alt: "Room 406 Tour - 24 seconds",
        caption: "Room Tour (Empty)",
        type: "video" as const,
        thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Screenshot+2025-08-07+160651.png"
      }
    ]
  }

  const dimensions = {
    width: "12 feet",
    length: "16 feet"
  }

  const bathroomDimensions = {
    width: "8 feet",
    length: "6 feet",
    note: "Shared with Room 405"
  }

  const furniture = [
    "2 Twin XL Beds",
    "2 Desks",
    "2 Desk Chairs",
    "2 Dressers",
    "2 Closets",
    "1 Mirror"
  ]

  const relatedRooms = [
    {
      id: 1,
      type: "Room 405",
      description: "Connected double room sharing bathroom",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Screenshot+2025-08-07+160651.png"
    },
    {
      id: 2,
      type: "Room 202",
      description: "Similar double room on floor 2",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg"
    }
  ]

  return (
    <RoomPageTemplate
      // Hero props
      backHref="/dorms/miller-hall"
      backText="Miller Hall"
      universityName="Suffolk University"
      universityHref="/dorms/suffolk-university"
      dormName="Miller Hall"
      dormHref="/dorms/miller-hall"
      roomTitle="Room 406"
      address="10 Somerset St, Boston, MA 02108, Floor 4, Room 406"
      showCertification={true}
      occupancyBadge="👥 Double"

      // Room data
      roomDetails={roomDetails}
      dimensions={dimensions}
      bathroomDimensions={bathroomDimensions}
      furniture={furniture}
      floorPlanImage="https://f005.backblazeb2.com/file/4wallsdorms/Screenshot+2025-08-07+160651.png"
      floorPlanAlt="Room 406 Floor Plan Layout - 4th Floor"

      // Adjoining room section
      adjoiningRoomLink="/dorms/miller-hall/communal/adjoining-room/405-406"
      adjoiningRoomTitle="405 + 406"
      adjoiningRoomDescription="This room is part of an adjoining room setup with Room 405, sharing a Jack and Jill bathroom."
      adjoiningRoomImage="https://f005.backblazeb2.com/file/4wallsdorms/Screenshot+2025-08-07+160651.png"

      // Upload and contact links
      uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=4&room=406"
      contactEmail="4wallsdorms@gmail.com"

      // Related rooms
      relatedRooms={relatedRooms}

      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration from Suffolk University students"
    />
  )
}