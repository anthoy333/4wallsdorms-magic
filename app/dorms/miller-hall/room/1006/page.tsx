"use client"

import { useRouter } from "next/navigation"
import { RoomPageTemplate } from "@/app/components/RoomPageTemplate"

export default function MillerHallRoom1006Page() {
  const router = useRouter()

  const roomDetails = {
    title: "Room 1006",
    description: "A double room in Miller Hall with a shared bathroom.",
    type: "Double",
    size: "225 sq ft",
    occupancy: "2 students",
    features: [
      "Carpeted room",
      "Shared bathroom with Room 1005",
      "Lock behind you door",
      "Customizable thermostat",
      "TBD - Share your experience!"
    ],
    photos: [
      {
        type: "image",
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Screenshot+2025-08-07+160651.png",
        alt: "No uploads yet"
      }
    ],
    floorPlanImage: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/10floorplanmillersuffolk.jpg",
    floorPlanAlt: "10th Floor Plan - Miller Hall Suffolk University",
    roomCoordinates: {
      x: 20,
      y: 20,
      width: 15,
      height: 15
    }
  }

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
    <RoomPageTemplate
      // Hero props
      backHref="/dorms/miller-hall"
      backText="Miller Hall"
      universityName="Suffolk University"
      universityHref="/"
      dormName="Miller Hall"
      dormHref="/dorms/miller-hall"
      roomTitle="Room 1006"
      address="10 Somerset St, Boston, MA 02108"
      showCertification={true}
      
      // Room data
      roomDetails={roomDetails}
      dimensions={{
        width: "TBD",
        length: "TBD",
        ceilingHeight: "TBD",
        windowSize: "TBD"
      }}
      bathroomDimensions={{
        width: "TBD",
        length: "TBD",
        ceilingHeight: "TBD"
      }}
      furniture={[
        { name: "Bed", imperial: "TBD", metric: "TBD" },
        { name: "Desk", imperial: "TBD", metric: "TBD" },
        { name: "Closet", imperial: "TBD", metric: "TBD" },
        { name: "Dresser", imperial: "TBD", metric: "TBD" }
      ]}
      floorPlanImage={roomDetails.floorPlanImage}
      floorPlanAlt={roomDetails.floorPlanAlt}
      roomCoordinates={roomDetails.roomCoordinates}
      
      // Upload and contact links
      uploadDormLink="/upload-dorm"
      contactEmail="4wallsdorms@gmail.com"
      
      // Related rooms
      relatedRooms={relatedRooms}
      
      // Adjoining room section
      adjoiningRoomLink="/dorms/miller-hall/communal/adjoining-room/1005-1006"
      adjoiningRoomTitle="Miller Hall Rooms 1005 + 1006"
      adjoiningRoomDescription="Two connected double rooms sharing a bathroom"
      adjoiningRoomImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1005+%2B+1006/1005millersuffolk(1).jpg"
      
      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration from Suffolk University students"
      
      // Navigation callbacks
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
