"use client"

import { RoomPageTemplate } from "@/app/components/RoomPageTemplate"

export default function MillerHallRoom207Page() {
  // Room 207 data with all 207-specific photos/videos
  const roomDetails = {
    name: "Room 207",
    description: "A comfortable double room in Miller Hall featuring modern amenities and excellent natural light. Located on the second floor, this room offers a spacious layout perfect for two roommates.",
    size: "225 sq ft",
    occupancy: "Double",
    features: [
      "Carpeted room",
      "Individual bathroom", 
      "Lock behind you door",
      "Customizable thermostat",
      "TBD - Share your experience!"
    ],
    photos: [
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/207/sumiller207-02-sec-plaque-empty-1.mp4",
        alt: "Room 207 Door Plaque - 2 seconds",
        caption: "Room 207 Entrance with Plaque (Empty)",
        type: "video" as const,
        thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-8.jpg"
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/207/sumiller207-full-31-sec-empty-2.mp4",
        alt: "Room 207 Complete Tour - 31 seconds",
        caption: "Complete Room Tour (Empty)",
        type: "video" as const,
        thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-8.jpg"
      }
    ]
  }

  // Room dimensions (keeping existing placeholder values as per rules)
  const dimensions = {
    width: "TBD feet / TBD meters",
    length: "TBD feet / TBD meters", 
    ceilingHeight: "TBD feet / TBD meters",
    windowSize: "TBD feet x TBD feet / TBD x TBD"
  }

  // Bathroom dimensions (keeping existing placeholder values)
  const bathroomDimensions = {
    width: "TBD feet / TBD meters",
    length: "TBD feet / TBD meters",
    ceilingHeight: "TBD feet / TBD meters"
  }

  // Furniture measurements (keeping existing placeholder values)
  const furniture = [
    {
      name: "Twin XL Bed",
      imperial: "TBD\" x TBD\" x TBD\"",
      metric: "TBD cm x TBD cm x TBD cm"
    },
    {
      name: "Desk",
      imperial: "TBD\" x TBD\" x TBD\"", 
      metric: "TBD cm x TBD cm x TBD cm"
    },
    {
      name: "Chair",
      imperial: "TBD\" x TBD\" x TBD\"",
      metric: "TBD cm x TBD cm x TBD cm"
    },
    {
      name: "Dresser",
      imperial: "TBD\" x TBD\" x TBD\"",
      metric: "TBD cm x TBD cm x TBD cm"
    },
    {
      name: "Closet",
      imperial: "TBD\" x TBD\" x TBD\"",
      metric: "TBD cm x TBD cm x TBD cm"
    }
  ]

  // Related rooms
  const relatedRooms = [
    {
      id: 1,
      type: "Room 205",
      description: "Double room with shared bathroom",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bedroom-empty-4.jpg",
      link: "/dorms/miller-hall/room/205"
    },
    {
      id: 2,
      type: "Room 206",
      description: "Double room with shared bathroom",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-8.jpg",
      link: "/dorms/miller-hall/room/206"
    },
    {
      id: 3,
      type: "Room 201",
      description: "Double room with shared bathroom",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg",
      link: "/dorms/miller-hall/room/201"
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
      roomTitle="Room 207"
      address="10 Somerset St, Boston, MA 02108, Floor 2, Room 207"
      showCertification={true}
      occupancyBadge="👥 Double"

      // Room data
      roomDetails={roomDetails}
      dimensions={dimensions}
      bathroomDimensions={bathroomDimensions}
      furniture={furniture}
      floorPlanImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/2floorplanmillersuffolk.jpg"
      floorPlanAlt="Room 207 Floor Plan Layout - 2nd Floor"

      // Upload and contact links
      uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=2&room=207"
      contactEmail="4wallsdorms@gmail.com"

      // Related rooms
      relatedRooms={relatedRooms}

      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration from Suffolk University students"
    />
  )
}