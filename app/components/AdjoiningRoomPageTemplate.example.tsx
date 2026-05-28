/*
 * AdjoiningRoomPageTemplate Usage Example
 * 
 * This file shows how to use the AdjoiningRoomPageTemplate component to create
 * adjoining room pages quickly and consistently.
 */

"use client"

import { useRouter } from "next/navigation"
import { AdjoiningRoomPageTemplate } from "./AdjoiningRoomPageTemplate"

export default function ExampleAdjoiningRoomPage() {
  const router = useRouter()

  // Define adjoining room-specific data
  const adjoiningRoomData = {
    id: "XXX-XXX", // Room numbers separated by dash
    title: "Dorm Name Adjoining Room XXX + XXX",
    description: "Detailed description of the adjoining room setup, including special features and shared amenities.",
    roomNumbers: ["XXX", "XXX"], // Array of individual room numbers
    size: "XXX sq ft total",
    occupancy: "X students",
    features: [
      "Feature 1",
      "Feature 2",
      "Shared bathroom with adjacent room",
      "Feature 4",
      // Add more features...
    ],
    photos: [
      {
        src: "/path/to/image-or-video.jpg",
        alt: "Alt text for media",
        caption: "Caption for the media",
        type: "image" as const // or "video"
      },
      // Add more photos/videos...
    ],
    sharedSpaces: {
      bathroom: {
        name: "Bathroom",
        description: "Description of the shared bathroom",
        features: [
          "Feature 1",
          "Feature 2",
          // Add bathroom features...
        ]
      },
      "bathroom-dimensions": {
        name: "Bathroom Dimensions",
        description: "Detailed measurements for the shared bathroom space",
        features: [], // Usually empty for dimensions
        dimensions: {
          width: "X feet / X meters",
          length: "X feet / X meters",
          ceilingHeight: "X feet / X meters"
        }
      },
      // Add more shared spaces if needed (kitchen, living area, etc.)
    },
    individualRooms: [
      {
        number: "XXX",
        type: "Room Type (e.g., Double Room)",
        description: "Brief description of this specific room",
        image: "/path/to/room-image.jpg"
      },
      {
        number: "XXX",
        type: "Room Type (e.g., Double Room)",
        description: "Brief description of this specific room",
        image: "/path/to/room-image.jpg"
      }
    ]
  }

  // Optional: Define related rooms
  const relatedRooms = [
    {
      id: 1,
      type: "Room Type",
      description: "Brief description",
      image: "/path/to/image.jpg"
    },
    // Add more related rooms...
  ]

  // Handle individual room navigation
  const handleIndividualRoomClick = (roomNumber: string) => {
    router.push(`/dorms/dorm-name/room/${roomNumber}`)
  }

  // Handle related room navigation  
  const handleRelatedRoomClick = (roomType: string) => {
    // Add your navigation logic here
    console.log(`Navigate to ${roomType} page`)
  }

  return (
    <AdjoiningRoomPageTemplate
      // Navigation and breadcrumb props
      backHref="/dorms/dorm-name"
      backText="Dorm Name"
      universityName="University Name"
      universityHref="/dorms/university-name"
      dormName="Dorm Name"
      dormHref="/dorms/dorm-name"
      roomTitle="Adjoining Rooms XXX + XXX"
      address="Full address with floor info"
      showCertification={true} // Optional: default is true

      // Adjoining room content data
      adjoiningRoomData={adjoiningRoomData}
      floorPlanImage="/path/to/floorplan.jpg"
      floorPlanAlt="Alt text for floor plan"

      // Contact and upload functionality
      uploadDormLink="/upload-dorm?school=University&campus=Campus&dorm=Dorm&floor=X&rooms=XXX-XXX"
      contactEmail="contact@example.com"

      // Optional sections
      relatedRooms={relatedRooms} // Optional: shows related rooms section
      inspirationImage="/path/to/inspiration.jpg" // Optional: shows inspiration section
      inspirationImageAlt="Alt text for inspiration image" // Optional

      // Navigation callbacks
      onIndividualRoomClick={handleIndividualRoomClick} // Optional: custom navigation for individual rooms
      onRelatedRoomClick={handleRelatedRoomClick} // Optional: custom navigation for related rooms
    />
  )
}

/*
 * Key Benefits of Using AdjoiningRoomPageTemplate:
 * 
 * 1. Consistency: All adjoining room pages will have the same layout and functionality
 * 2. Maintainability: Updates to the template affect all adjoining room pages
 * 3. Developer Experience: Much less code needed for each adjoining room page
 * 4. Feature Complete: Includes photo gallery, shared spaces tabs, lightbox, responsive design
 * 5. Reusability: Can be used for any adjoining room across different universities
 * 6. Specialized for Adjoining Rooms: Handles shared spaces, individual room navigation, and specific UX patterns
 * 
 * Differences from RoomPageTemplate:
 * - Focuses on shared spaces (bathroom, kitchen, etc.) rather than individual room specs
 * - Includes individual room cards with navigation to specific room pages
 * - Uses scrollable thumbnail gallery instead of carousel for better mobile UX
 * - Specialized tabs for shared space features and dimensions
 * - Built-in navigation callbacks for room and related content
 * 
 * To create a new adjoining room page:
 * 1. Create a new page.tsx file in the appropriate adjoining room directory
 * 2. Import AdjoiningRoomPageTemplate
 * 3. Define your adjoining room-specific data
 * 4. Set up navigation callbacks (optional but recommended)
 * 5. Pass the data to AdjoiningRoomPageTemplate
 * 6. Done! 
 * 
 * Example directory structure:
 * /dorms/miller-hall/communal/adjoining-room/200-201/page.tsx
 * /dorms/miller-hall/communal/adjoining-room/202-203/page.tsx
 * /dorms/another-dorm/communal/adjoining-room/101-102/page.tsx
 */ 