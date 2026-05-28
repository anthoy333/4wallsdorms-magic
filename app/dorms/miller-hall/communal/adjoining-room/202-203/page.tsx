"use client"

import { useRouter } from "next/navigation"
import { AdjoiningRoomPageTemplate } from "@/app/components/AdjoiningRoomPageTemplate"

export default function MillerHallAdjoiningRooms202203Page() {
  const router = useRouter()

  // Adjoining room data for rooms 202-203
  const adjoiningRoomData = {
    id: "202-203",
    title: "Miller Hall Adjoining Room 202 + 203",
    description: "Two connected double rooms on the second floor sharing a Jack and Jill bathroom, perfect for close friends or roommates who want both privacy and connection. These rooms feature updated furnishings and excellent natural light.",
    roomNumbers: ["202", "203"],
    size: "450 sq ft total",
    occupancy: "4 students",
    features: [
      "Extra-long twin beds",
      "Built-in desks and chairs",
      "Shared bathroom with adjacent room",
      "Individual closets",
      "Mini-fridge",
      "Microwave",
      "Air conditioning",
      "High-speed internet",
      "Updated flooring",
      "Large windows with city views"
    ],
    photos: [
      {
        src: "/placeholder.svg",
        alt: "Room 202-203 Walkthrough Video",
        caption: "Virtual Tour of Adjoining Rooms",
        type: "video" as const
      },
      {
        src: "/miller-hall-suffolk.png",
        alt: "Miller Hall Exterior - Rooms 202-203",
        caption: "Miller Hall Exterior View",
        type: "image" as const
      },
      {
        src: "/double-dorm-room.png",
        alt: "Room 202 Layout",
        caption: "Room 202 Standard Setup",
        type: "image" as const
      },
      {
        src: "/modern-double-dorm.png",
        alt: "Room 203 Layout",
        caption: "Room 203 Modern Setup",
        type: "image" as const
      },
      {
        src: "/placeholder.svg",
        alt: "Bathroom Tour Video",
        caption: "Shared Jack and Jill Bathroom",
        type: "video" as const
      },
      {
        src: "/jack-and-jill-dorm-floorplan.png",
        alt: "Rooms 202-203 Floor Plan",
        caption: "Detailed Floor Plan Layout",
        type: "image" as const
      }
    ],
    sharedSpaces: {
      bathroom: {
        name: "Jack and Jill Bathroom",
        description: "Modern shared bathroom connecting rooms 202 and 203",
        features: [
          "Shared toilet and sink",
          "Privacy locks on both doors"
        ]
      },
      "bathroom-dimensions": {
        name: "Bathroom Dimensions",
        description: "Detailed measurements for the shared bathroom space between rooms 202 and 203",
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
        number: "202",
        type: "Double Room",
        description: "Double room in adjoining setup",
        image: "/double-dorm-room.png"
      },
      {
        number: "203",
        type: "Double Room",
        description: "Double room in adjoining setup",
        image: "/modern-double-dorm.png"
      }
    ]
  }

  // Related rooms data
  const relatedRooms = [
    {
      id: 1,
      type: "Rooms 200-201",
      description: "Another adjoining room configuration on the same floor",
      image: "/jack-and-jill-dorm-floorplan.png"
    },
    {
      id: 2,
      type: "Single Room",
      description: "Perfect for students who prefer privacy",
      image: "/minimalist-dorm-room.png"
    },
    {
      id: 3,
      type: "Triple Room",
      description: "Spacious setup for three roommates",
      image: "/triple-dorm-room.png"
    }
  ]

  // Handle individual room navigation
  const handleIndividualRoomClick = (roomNumber: string) => {
    router.push(`/dorms/miller-hall/room/${roomNumber}`)
  }

  // Handle related room navigation  
  const handleRelatedRoomClick = (roomType: string) => {
    if (roomType === "Rooms 200-201") {
      router.push("/dorms/miller-hall/communal/adjoining-room/200-201")
    } else {
      console.log(`Navigate to ${roomType} page`)
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
      roomTitle="Adjoining Rooms 202 + 203"
      address="10 Somerset St, Boston, MA 02108, Floor 2"
      showCertification={true}

      // Adjoining room data
      adjoiningRoomData={adjoiningRoomData}
      floorPlanImage="/jack-and-jill-dorm-floorplan.png"
      floorPlanAlt="Rooms 202-203 Jack and Jill Floor Plan"

      // Upload and contact links
      uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=2&rooms=202-203"
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