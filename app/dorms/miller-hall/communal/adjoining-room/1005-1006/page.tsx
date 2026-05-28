"use client"

import { useRouter } from "next/navigation"
import { AdjoiningRoomPageTemplate } from "@/app/components/AdjoiningRoomPageTemplate"

export default function MillerHallAdjoiningRoom1005_1006Page() {
  const router = useRouter()

  const adjoiningRoomData = {
    title: "Miller Hall Rooms 1005 + 1006",
    description: "Two connected double rooms on the tenth floor sharing a Jack and Jill bathroom.",
    roomNumbers: ["1005", "1006"],
    size: "450 sq ft total",
    occupancy: "4 students",
    photos: [
      {
        type: "video",
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1005+%2B+1006/1005millersuffolk.mp4",
        alt: "Rooms 1005 + 1006 shared bathroom video tour",
        thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1005+%2B+1006/1005millersuffolk(1).jpg"
      }
    ],
    features: [
      "Carpeted rooms",
      "Shared bathroom between rooms",
      "Lock behind you door",
      "Customizable thermostat",
      "TBD - Share your experience!"
    ],
    sharedSpaces: [
      {
        id: 1,
        type: "Bathroom",
        features: [
          "Shared bathroom between rooms",
          "Full bathroom with shower",
          "Storage space for toiletries",
          "TBD - Share your experience!"
        ],
        media: [
          {
            type: "video",
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1005+%2B+1006/1005millersuffolk.mp4",
            thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1005+%2B+1006/1005millersuffolk(1).jpg"
          }
        ]
      }
    ],
    individualRooms: [
      {
        id: 1,
        number: "1005",
        type: "Double",
        media: [
          {
            type: "video",
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1005+%2B+1006/1005millersuffolk.mp4",
            thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1005+%2B+1006/1005millersuffolk(1).jpg"
          }
        ]
      },
      {
        id: 2,
        number: "1006",
        type: "Double",
        media: [
          {
            type: "image",
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Screenshot+2025-08-07+160651.png",
            thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Screenshot+2025-08-07+160651.png",
            alt: "No uploads yet"
          }
        ]
      }
    ],
    floorPlanImage: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/10floorplanmillersuffolk.jpg",
    floorPlanAlt: "10th Floor Plan - Miller Hall Suffolk University"
  }

  // Related rooms data
  const relatedRooms = [
    {
      id: 1,
      type: "Room 610",
      description: "Single room on the 6th floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-2.jpg",
      link: "/dorms/miller-hall/room/610"
    },
    {
      id: 2,
      type: "Room 611",
      description: "Quad room on the 6th floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/611/sumiller611-plaque.png",
      link: "/dorms/miller-hall/room/611"
    },
    {
      id: 3,
      type: "Room 602",
      description: "Double room on the 6th floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-plaque-imp-7.jpg",
      link: "/dorms/miller-hall/room/602"
    }
  ]

  return (
    <AdjoiningRoomPageTemplate
      // Hero props
      backHref="/dorms/miller-hall"
      backText="Miller Hall"
      universityName="Suffolk University"
      universityHref="/"
      dormName="Miller Hall"
      dormHref="/dorms/miller-hall"
      roomTitle="Rooms 1005 + 1006"
      address="10 Somerset St, Boston, MA 02108"
      showCertification={true}
      
      // Room data
      adjoiningRoomData={adjoiningRoomData}
      floorPlanImage={adjoiningRoomData.floorPlanImage}
      floorPlanAlt={adjoiningRoomData.floorPlanAlt}
      
      // Upload and contact links
      uploadDormLink="/upload-dorm"
      contactEmail="4wallsdorms@gmail.com"
      
      // Related rooms
      relatedRooms={relatedRooms}
      
      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration from Suffolk University students"
      
      // Callbacks
      onIndividualRoomClick={(roomNumber) => {
        router.push(`/dorms/miller-hall/room/${roomNumber}`)
      }}
      onRelatedRoomClick={(roomType, link) => {
        if (link) {
          router.push(link)
        }
      }}
    />
  )
}