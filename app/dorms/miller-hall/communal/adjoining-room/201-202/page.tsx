"use client"

import { useRouter } from "next/navigation"
import { AdjoiningRoomPageTemplate } from "@/app/components/AdjoiningRoomPageTemplate"
import { useBackblazeAdjoiningRoomMedia } from "@/app/hooks/useBackblazeAdjoiningRoomMedia"

export default function MillerHallAdjoiningRooms201202Page() {
  const router = useRouter()
  
  // Fetch bathroom media from Backblaze for this adjoining room
  // Using room 201 to get the shared folder path (201 + 202)
  const { photos: bathroomPhotos, loading: photosLoading, error: photosError } = useBackblazeAdjoiningRoomMedia("201", "Miller")

  // Adjoining room data for rooms 201-202
  const adjoiningRoomData = {
    id: "201-202",
    title: "Miller Hall Adjoining Room 201 + 202",
    description: "Two connected double rooms on the second floor sharing a Jack and Jill bathroom.",
    roomNumbers: ["201", "202"],
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
    photos: bathroomPhotos, // Use photos from Backblaze
    sharedSpaces: {
      bathroom: {
        name: "Jack and Jill Bathroom",
        description: "Modern shared bathroom connecting rooms 201 and 202",
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
        description: "Detailed measurements for the shared bathroom space between rooms 201 and 202",
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
        number: "201",
        type: "Double Room",
        description: "Double room in adjoining setup",
        image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg"
      },
      {
        number: "202", 
        type: "Double Room",
        description: "Double room in adjoining setup",
        image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-bedroom-imp-4.jpg"
      }
    ]
  }

  // Related rooms data
  const relatedRooms = [
    {
      id: 1,
      type: "Rooms 205-206",
      description: "Adjoining rooms on the 2nd floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bathroom-empty-13.jpg",
      link: "/dorms/miller-hall/communal/adjoining-room/205-206"
    },
    {
      id: 2,
      type: "Rooms 203-204",
      description: "Adjoining rooms on the 2nd floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg",
      link: "/dorms/miller-hall/communal/adjoining-room/203-204"
    },
    {
      id: 3,
      type: "Rooms 207-208",
      description: "Adjoining rooms on the 2nd floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg",
      link: "/dorms/miller-hall/communal/adjoining-room/207-208"
    }
  ]

  // Handle individual room navigation
  const handleIndividualRoomClick = (roomNumber: string) => {
    router.push(`/dorms/miller-hall/room/${roomNumber}`)
  }

  // Handle related room navigation  
  const handleRelatedRoomClick = (roomType: string, link: string) => {
    router.push(link)
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
      roomTitle="Adjoining Rooms 201 + 202"
      address="10 Somerset St, Boston, MA 02108, Floor 2"
      showCertification={true}

      // Adjoining room data
      adjoiningRoomData={adjoiningRoomData}
      floorPlanImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/2floorplanmillersuffolk.jpg"
      floorPlanAlt="Rooms 201-202 Jack and Jill Floor Plan - 2nd Floor"

      // Upload and contact links
      uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=2&rooms=201-202"
      contactEmail="4wallsdorms@gmail.com"

      // Related rooms
      relatedRooms={relatedRooms}

      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration from Suffolk University students"

      // Callbacks
      onIndividualRoomClick={handleIndividualRoomClick}
      onRelatedRoomClick={handleRelatedRoomClick}
      
      // Loading and error states
      photosLoading={photosLoading}
      photosError={photosError}
    />
  )
} 