"use client"

import { RoomPageTemplate } from "@/app/components/RoomPageTemplate"

export default function MillerHallRoom908Page() {
  // Room details for specific room 908
  const roomDetails = {
    name: "Room 908 - Miller Hall",
    description:
      "This is a specific double room on the 9th floor of Miller Hall featuring a Jack and Jill bathroom setup. Room 908 has been recently renovated with modern furnishings and offers great views of the campus.",
    size: "220 sq ft",
    occupancy: "2 students",
    features: [
      "Extra-long twin beds",
      "Built-in desks and chairs", 
      "Shared bathroom with Room 906",
      "Individual closets",
      "Mini-fridge",
      "Microwave",
      "Air conditioning",
      "High-speed internet",
      "Recently renovated",
      "Campus view windows"
    ],
    photos: [
      {
        src: "/miller-hall-suffolk.png",
        alt: "Miller Hall Exterior - Room 908",
        caption: "Miller Hall Exterior",
        type: "image" as const
      },
      {
        src: "/double-dorm-room.png",
        alt: "Room 908 Layout",
        caption: "Room 908 Double Room Setup",
        type: "image" as const
      },
      {
        src: "/modern-double-dorm.png",
        alt: "Room 908 Modern Furnishings",
        caption: "Recently Renovated Furnishings",
        type: "image" as const
      },
      {
        src: "/jack-and-jill-dorm-floorplan.png",
        alt: "Room 908 Jack and Jill Bathroom Layout",
        caption: "Shared Bathroom Layout with Room 906",
        type: "image" as const
      }
    ],
  }

  // Room dimensions (could be actual measurements for this specific room)
  const dimensions = {
    width: "12 feet / 3.66 meters",
    length: "18 feet / 5.49 meters", 
    ceilingHeight: "8.5 feet / 2.59 meters",
    windowSize: "4 feet × 6 feet / 1.22 × 1.83 meters",
  }

  // Bathroom dimensions
  const bathroomDimensions = {
    width: "6 feet / 1.83 meters",
    length: "8 feet / 2.44 meters",
    ceilingHeight: "8.5 feet / 2.59 meters",
  }

  // Furniture measurements for this specific room
  const furniture = [
    { name: "Twin XL Bed", imperial: '38" x 80"', metric: '97 × 203 cm' },
    { name: "Desk", imperial: '48" x 24"', metric: '122 x 61 cm' },
    { name: "Dresser", imperial: '32" x 18" x 30"', metric: '81 × 46 × 76 cm' },
    { name: "Closet", imperial: '36" x 24" x 84"', metric: '91 × 61 × 213 cm' },
    { name: "Mini-fridge", imperial: '19" x 17" x 18"', metric: '48 × 43 × 46 cm' },
  ]

  // Related rooms data
  const relatedRooms = [
    {
      id: 1,
      type: "Room 906 (Adjacent)",
      description: "Shares Jack and Jill bathroom with Room 908",
      image: "/modern-double-dorm.png"
    },
    {
      id: 2,
      type: "Room 910", 
      description: "Similar double room layout down the hall",
      image: "/double-dorm-room.png"
    },
    {
      id: 3,
      type: "Room 904",
      description: "Corner room with slightly different layout", 
      image: "/minimalist-dorm-room.png"
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
      roomTitle="Room 908"
      address="10 Somerset St, Boston, MA 02108, Floor 9"
      showCertification={true}

      // Room data
      roomDetails={roomDetails}
      dimensions={dimensions}
      bathroomDimensions={bathroomDimensions}
      furniture={furniture}
      floorPlanImage="/jack-and-jill-dorm-floorplan.png"
      floorPlanAlt="Room 908 Floor Plan - Jack and Jill Layout"

      // Upload and contact links
      uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=9&room=908"
      contactEmail="4wallsdorms@gmail.com"

      // Related rooms
      relatedRooms={relatedRooms}

      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration from a similar Suffolk University room"
    />
  )
} 