"use client"

import { useRouter } from "next/navigation"
import { AdjoiningRoomPageTemplate } from "@/app/components/AdjoiningRoomPageTemplate"

export default function MillerHallAdjoiningRooms205206Page() {
  const router = useRouter()

  // Adjoining room data for rooms 205-206
  const adjoiningRoomData = {
    id: "205-206",
    title: "Miller Hall Adjoining Room 205 + 206",
    description: "Two connected double rooms on the second floor sharing a Jack and Jill bathroom.",
    roomNumbers: ["205", "206"],
    size: "[number of sq ft total] sq ft total",
    occupancy: "4 students",
    features: [
      "Carpeted room",
      "Adjoining bathroom",
      "Lock behind you door",
      "Customizable thermostat",
      "Extra-long twin beds",
      "Built-in desks and chairs",
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
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205%2B206-full-56-sec-empty-1.mp4",
        alt: "Room 205-206 Full Tour Video",
        caption: "Complete Adjoining Room Tour - Empty",
        type: "video" as const,
        thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bathroom-empty-14.jpg"
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205%2B206-bathroom-empty-3.jpg",
        alt: "Room 205-206 Bathroom",
        caption: "Shared Jack and Jill Bathroom - Empty",
        type: "image" as const
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bathroom-empty-14.jpg",
        alt: "Room 205-206 Bathroom Detail 1",
        caption: "Bathroom Detail View 1",
        type: "image" as const
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bathroom-empty-15.jpg",
        alt: "Room 205-206 Bathroom Detail 2",
        caption: "Bathroom Detail View 2",
        type: "image" as const
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bathroom-empty-16.jpg",
        alt: "Room 205-206 Bathroom Detail 3",
        caption: "Bathroom Detail View 3",
        type: "image" as const
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bathroom-empty-17.jpg",
        alt: "Room 205-206 Bathroom Detail 4",
        caption: "Bathroom Detail View 4",
        type: "image" as const
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bathroom-empty-18.jpg",
        alt: "Room 205-206 Bathroom Detail 5",
        caption: "Bathroom Detail View 5",
        type: "image" as const
      }
    ],
    sharedSpaces: {
      bathroom: {
        name: "Jack and Jill Bathroom",
        description: "Modern shared bathroom connecting rooms 205 and 206",
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
        description: "Detailed measurements for the shared bathroom space between rooms 205 and 206",
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
        number: "205",
        type: "Double Room",
        description: "Double room in adjoining setup",
        image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bedroom-empty-4.jpg"
      },
      {
        number: "206", 
        type: "Double Room",
        description: "Double room in adjoining setup",
        image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-8.jpg"
      }
    ]
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
      description: "Spacious quad room on the 6th floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/611/sumiller611-plaque.png",
      link: "/dorms/miller-hall/room/611"
    },
    {
      id: 3,
      type: "Room 602",
      description: "Double room with shared bathroom",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-plaque-imp-7.jpg",
      link: "/dorms/miller-hall/room/602"
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
      roomTitle="Adjoining Rooms 205 + 206"
      address="10 Somerset St, Boston, MA 02108, Floor 2"
      showCertification={true}

      // Adjoining room data
      adjoiningRoomData={adjoiningRoomData}
      floorPlanImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/2floorplanmillersuffolk.jpg"
      floorPlanAlt="Rooms 205-206 Jack and Jill Floor Plan"

      // Upload and contact links
      uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=2&rooms=205-206"
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