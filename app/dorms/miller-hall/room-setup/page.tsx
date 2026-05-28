"use client"

import { RoomPageTemplate } from "@/app/components/RoomPageTemplate"

export default function MillerHallRoomSetupPage() {
  // Room details
  const roomDetails = {
    name: "Double Room - Miller Hall",
    description:
      "This spacious double room in Miller Hall features a Jack and Jill bathroom setup shared with the adjacent room. Each side accommodates two students with modern furnishings and ample storage space.",
    size: "220 sq ft",
    occupancy: "2 students",
    features: [
      "Extra-long twin beds",
      "Built-in desks and chairs",
      "Shared bathroom with adjacent room",
      "Individual closets",
      "Mini-fridge",
      "Microwave",
      "Air conditioning",
      "High-speed internet",
    ],
    photos: [
      {
        src: "/miller-hall-suffolk.png",
        alt: "Miller Hall Exterior",
        caption: "Miller Hall Exterior",
        type: "image" as const
      },
      {
        src: "/placeholder.svg", // This would be a video file in production
        alt: "Room Tour Video",
        caption: "Virtual Room Tour",
        type: "video" as const
      },
      {
        src: "/double-dorm-room.png",
        alt: "Double Room Layout",
        caption: "Standard Double Room Setup",
        type: "image" as const
      },
      {
        src: "/modern-double-dorm.png",
        alt: "Modern Double Room",
        caption: "Modern Furnishings",
        type: "image" as const
      },
      {
        src: "/placeholder.svg", // Another video in the middle
        alt: "Bathroom Tour Video",
        caption: "Jack and Jill Bathroom Tour",
        type: "video" as const
      },
      {
        src: "/jack-and-jill-dorm-floorplan.png",
        alt: "Jack and Jill Bathroom Layout",
        caption: "Jack and Jill Bathroom Layout",
        type: "image" as const
      }
    ],
  }

  // Room dimensions
  const dimensions = {
    width: "0 feet / 0 meters",
    length: "0 feet / 0 meters",
    ceilingHeight: "0 feet / 0 meters",
    windowSize: "0 feet × 0 feet / 0 × 0 meters",
  }

  // Bathroom dimensions
  const bathroomDimensions = {
    width: "0 feet / 0 meters",
    length: "0 feet / 0 meters",
    ceilingHeight: "0 feet / 0 meters",
  }

  // Furniture measurements
  const furniture = [
    { name: "Twin XL Bed", imperial: '0" x 0"', metric: '0 × 0 cm' },
    { name: "Desk", imperial: '0" x 0"', metric: '0 x 0 cm' },
    { name: "Dresser", imperial: '0" x 0" x 0"', metric: '0 × 0 × 0 cm' },
    { name: "Closet", imperial: '0" x 0" x 0"', metric: '0 × 0 × 0 cm' },
    { name: "Mini-fridge", imperial: '0" x 0" x 0"', metric: '0 × 0 × 0 cm' },
  ]

  // Related rooms data
  const relatedRooms = [
    {
      id: 1,
      type: "Single Room",
      description: "Perfect for students who prefer privacy",
      image: "/minimalist-dorm-room.png"
    },
    {
      id: 2,
      type: "Triple Room", 
      description: "Spacious setup for three roommates",
      image: "/triple-dorm-room.png"
    },
    {
      id: 3,
      type: "Quad Room",
      description: "Efficient layout for four students", 
      image: "/quad-dorm-room.png"
    }
  ]

  return (
    <RoomPageTemplate
      // Hero props
        backHref="/"
        backText="Home"
        universityName="Suffolk University"
        universityHref="/dorms/suffolk-university"
        dormName="Miller Hall"
        dormHref="/dorms/miller-hall"
        roomTitle="Room 000"
        address="790 7th Avenue, New York, NY 10019, United States"
      showCertification={true}

      // Room data
      roomDetails={roomDetails}
      dimensions={dimensions}
      bathroomDimensions={bathroomDimensions}
      furniture={furniture}
      floorPlanImage="/jack-and-jill-dorm-floorplan.png"
      floorPlanAlt="Miller Hall Double Room Floor Plan"

      // Upload and contact links
      uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=8"
      contactEmail="4wallsdorms@gmail.com"

      // Related rooms
      relatedRooms={relatedRooms}

      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration - student room with bed, posters, and personal touches"
    />
  )
}
