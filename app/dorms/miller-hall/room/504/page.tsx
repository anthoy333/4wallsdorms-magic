"use client"

import { RoomPageTemplate } from "@/app/components/RoomPageTemplate"

export default function MillerHallRoom504Page() {
  const roomDetails = {
    name: "Room 504",
    description: "A beautifully decorated double room in Miller Hall featuring modern amenities and excellent natural light. This room is part of an adjoining room setup with Room 503.",
    size: "225 sq ft",
    occupancy: "Double",
    features: [
      "Carpeted room",
      "Shared bathroom with Room 503",
      "Lock behind you door",
      "Customizable thermostat",
      "TBD - Share your experience!"
    ],
    photos: [
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/503+%2B+504/504millersuffolk.mp4",
        alt: "Room 504 Tour",
        caption: "Room Tour",
        type: "video" as const,
        thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/503+%2B+504/504millersuffolk(3).jpg"
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/503+%2B+504/504millersuffolk(1).jpg",
        alt: "Room 504 View 1",
        caption: "Room View 1",
        type: "image" as const
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/503+%2B+504/504millersuffolk(2).jpg",
        alt: "Room 504 View 2",
        caption: "Room View 2",
        type: "image" as const
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/503+%2B+504/504millersuffolk(3).jpg",
        alt: "Room 504 View 3",
        caption: "Room View 3",
        type: "image" as const
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/503+%2B+504/504millersuffolk(4).jpg",
        alt: "Room 504 View 4",
        caption: "Room View 4",
        type: "image" as const
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/503+%2B+504/504millersuffolk.jpg",
        alt: "Room 504 View 5",
        caption: "Room View 5",
        type: "image" as const
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
    note: "Shared with Room 503"
  }

  const furniture = [
    {
      name: "Twin XL Bed",
      imperial: "80\" x 36\"",
      metric: "203cm x 91cm"
    },
    {
      name: "Desk",
      imperial: "42\" x 24\"",
      metric: "107cm x 61cm"
    },
    {
      name: "Chair",
      imperial: "24\" x 24\"",
      metric: "61cm x 61cm"
    },
    {
      name: "Dresser",
      imperial: "30\" x 24\"",
      metric: "76cm x 61cm"
    },
    {
      name: "Closet",
      imperial: "36\" x 24\"",
      metric: "91cm x 61cm"
    }
  ]

  const relatedRooms = [
    {
      id: 1,
      type: "Room 602",
      description: "Double room on the 6th floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-plaque-imp-7.jpg",
      link: "/dorms/miller-hall/room/602"
    },
    {
      id: 2,
      type: "Room 610",
      description: "Single room on the 6th floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-2.jpg",
      link: "/dorms/miller-hall/room/610"
    },
    {
      id: 3,
      type: "Room 611",
      description: "Quad room on the 6th floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/611/sumiller611-plaque.png",
      link: "/dorms/miller-hall/room/611"
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
      roomTitle="Room 504"
      address="10 Somerset St, Boston, MA 02108, Floor 5, Room 504"
      showCertification={true}
      featuredBadge="⭐Featured Room"
      occupancyBadge="👥 Double"

      // Room data
      roomDetails={roomDetails}
      dimensions={dimensions}
      bathroomDimensions={bathroomDimensions}
      furniture={furniture}
      floorPlanImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/5floorplanmillersuffolk.jpg"
      floorPlanAlt="Room 504 Floor Plan Layout - 5th Floor"

      // Adjoining room section
      adjoiningRoomLink="/dorms/miller-hall/communal/adjoining-room/503-504"
      adjoiningRoomTitle="503 + 504"
      adjoiningRoomDescription="This room is part of an adjoining room setup with Room 503, sharing a Jack and Jill bathroom."
      adjoiningRoomImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/sumillerfloorplanadjointedroom.PNG"

      // Upload and contact links
      uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=5&room=504"
      contactEmail="4wallsdorms@gmail.com"

      // Related rooms
      relatedRooms={relatedRooms}

      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration from Suffolk University students"
    />
  )
}