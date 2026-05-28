"use client"

import { AdjoiningRoomPageTemplate } from "@/app/components/AdjoiningRoomPageTemplate"

export default function MillerHallAdjoiningRoom503504Page() {
  const adjoiningRoomData = {
    id: "503-504",
    title: "Rooms 503 + 504",
    description: "An adjoining room setup in Miller Hall featuring two double rooms connected by a shared bathroom. This setup offers a perfect balance of privacy and community living.",
    roomNumbers: ["503", "504"],
    size: "450 sq ft total",
    occupancy: "4 Students",
    features: [
      "Shared bathroom between rooms",
      "Individual temperature control",
      "Carpeted rooms",
      "Lock behind you door",
      "TBD - Share your experience!"
    ],
    photos: [
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/503+%2B+504/504millersuffolk.mp4",
        alt: "Room 504 Tour",
        caption: "Room 504 Tour",
        type: "video" as const,
        thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/503+%2B+504/504millersuffolk(3).jpg"
      }
    ],
    sharedSpaces: {
      bathroom: {
        name: "Shared Bathroom",
        description: "A private bathroom shared between both rooms with modern fixtures and ample storage.",
        features: [
          "Full-size shower",
          "Toilet",
          "Sink with mirror",
          "Storage cabinet",
          "Towel hooks"
        ]
      },
      dimensions: {
        name: "Room Dimensions",
        description: "Detailed measurements of the shared spaces.",
        features: ["TBD - Help us measure!"],
        dimensions: {
          width: "8 feet",
          length: "6 feet",
          ceilingHeight: "8 feet"
        }
      }
    },
    individualRooms: [
      {
        number: "503",
        type: "Double Room",
        description: "Spacious double room with modern amenities",
        image: "https://f005.backblazeb2.com/file/4wallsdorms/Screenshot+2025-08-07+160651.png"
      },
      {
        number: "504",
        type: "Double Room",
        description: "Beautifully decorated double room with modern amenities",
        image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/503+%2B+504/504millersuffolk(3).jpg"
      }
    ]
  }

  const relatedRooms = [
    {
      id: 1,
      type: "Rooms 201 + 202",
      description: "Two Doubles in Adjoining room on floor 2",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/2floorplanmillersuffolk.jpg"
    },
    {
      id: 2,
      type: "Rooms 205 + 206",
      description: "Two Doubles in Adjoining room on floor 2",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/2floorplanmillersuffolk.jpg"
    }
  ]

  return (
    <AdjoiningRoomPageTemplate
      // Hero props
      backHref="/dorms/miller-hall"
      backText="Miller Hall"
      universityName="Suffolk University"
      universityHref="/dorms/suffolk-university"
      dormName="Miller Hall"
      dormHref="/dorms/miller-hall"
      roomTitle="Rooms 503 + 504"
      address="10 Somerset St, Boston, MA 02108, Floor 5, Rooms 503 + 504"
      showCertification={true}
      occupancyBadge="👥 4 Students"

      // Room data
      adjoiningRoomData={adjoiningRoomData}
      floorPlanImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/5floorplanmillersuffolk.jpg"
      floorPlanAlt="Rooms 503 + 504 Floor Plan Layout - 5th Floor"

      // Upload and contact links
      uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=5&room=503-504"
      contactEmail="4wallsdorms@gmail.com"

      // Related rooms
      relatedRooms={relatedRooms}

      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration from Suffolk University students"
    />
  )
}