"use client"

import { useRouter } from "next/navigation"
import { AdjoiningRoomPageTemplate } from "@/app/components/AdjoiningRoomPageTemplate"

export default function MillerHallAdjoiningRoom609610Page() {
  const router = useRouter()

  // Adjoining room data for rooms 609-610
  const adjoiningRoomData = {
    id: "609-610",
    title: "Miller Hall Adjoining Room 609 + 610",
    description: "Two connected rooms on the sixth floor sharing a Jack and Jill bathroom.",
    roomNumbers: ["609", "610"],
    size: "[number of sq ft total] sq ft total",
    occupancy: "3 students",
    features: [
      "Carpeted room",
      "Shared bathroom",
      "Lock behind you door",
      "Customizable thermostat",
      "TBD - Share your experience!"
    ],
    photos: [
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Screenshot+2025-08-07+160651.png",
        alt: "Shared bathroom - No uploads yet",
        caption: "Shared Jack and Jill Bathroom - Empty",
        type: "image" as const
      }
    ],
    sharedSpaces: {
      bathroom: {
        name: "Jack and Jill Bathroom",
        description: "Modern shared bathroom connecting rooms 609 and 610",
        features: [
          "Shared bathroom",
          "Privacy locks on both doors",
          "Storage space",
          "Lighting",
          "TBD - Share your experience!"
        ]
      },
      "bathroom-dimensions": {
        name: "Bathroom Dimensions",
        description: "Detailed measurements for the shared bathroom space between rooms 609 and 610",
        features: [],
        dimensions: {
          width: "TBD feet / TBD meters",
          length: "TBD feet / TBD meters",
          ceilingHeight: "TBD feet / TBD meters"
        }
      }
    },
    individualRooms: [
      {
        number: "609",
        type: "Double Room",
        description: "Double room in adjoining setup",
        image: "https://f005.backblazeb2.com/file/4wallsdorms/Screenshot+2025-08-07+160651.png"
      },
      {
        number: "610", 
        type: "Single Room",
        description: "Single room in adjoining setup",
        image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-2.jpg"
      }
    ]
  }

  // Related rooms data
  const relatedRooms = [
    {
      id: 1,
      type: "Room 611",
      description: "Quad room on the 6th floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/611/sumiller611-plaque.png",
      link: "/dorms/miller-hall/room/611"
    },
    {
      id: 2,
      type: "Room 602",
      description: "Double room on the 6th floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-plaque-imp-7.jpg",
      link: "/dorms/miller-hall/room/602"
    },
    {
      id: 3,
      type: "Room 608",
      description: "Double room on the 6th floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller608-plaque.png",
      link: "/dorms/miller-hall/room/608"
    }
  ]

  // Handle individual room navigation
  const handleIndividualRoomClick = (roomNumber: string) => {
    router.push(`/dorms/miller-hall/room/${roomNumber}`)
  }

  // Handle related room navigation  
  const handleRelatedRoomClick = (roomType: string, link?: string) => {
    if (link) {
      router.push(link)
    }
  }

  return (
    <AdjoiningRoomPageTemplate
      // Hero props
      backHref="/dorms/miller-hall"
      backText="Miller Hall"
      universityName="Suffolk University"
      universityHref="/dorms/suffolk-university"
      dormName="Miller Hall"
      dormHref="/dorms/miller-hall"
      roomTitle="Adjoining Rooms 609 + 610"
      address="10 Somerset St, Boston, MA 02108, Floor 6"
      showCertification={true}

      // Adjoining room data
      adjoiningRoomData={adjoiningRoomData}
      floorPlanImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/6floorplanmillersuffolk.jpg"
      floorPlanAlt="Rooms 609-610 Jack and Jill Floor Plan"

      // Upload and contact links
      uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=6&rooms=609-610"
      contactEmail="4wallsdorms@gmail.com"

      // Related rooms
      relatedRooms={relatedRooms}

      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration from Suffolk University students"

      // Callbacks
      onIndividualRoomClick={handleIndividualRoomClick}
      onRelatedRoomClick={handleRelatedRoomClick}
    />
  )
}