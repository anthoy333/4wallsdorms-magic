/*
 * RoomPageTemplate Usage Example
 * 
 * This file shows how to use the RoomPageTemplate component to create
 * individual room pages quickly and consistently.
 */

"use client"

import { RoomPageTemplate } from "./RoomPageTemplate"

export default function ExampleRoomPage() {
  // Define room-specific data
  const roomDetails = {
    name: "Example Room Name",
    description: "Detailed description of the room, including special features and layout details.",
    size: "220 sq ft",
    occupancy: "2 students",
    features: [
      "Feature 1",
      "Feature 2", 
      "Feature 3",
      // Add more features...
    ],
    photos: [
      {
        src: "/path/to/image.jpg",
        alt: "Alt text for image",
        caption: "Caption for the image",
        type: "image" as const // or "video"
      },
      // Add more photos...
    ],
  }

  // Define room dimensions
  const dimensions = {
    width: "XX feet / XX meters",
    length: "XX feet / XX meters", 
    ceilingHeight: "XX feet / XX meters",
    windowSize: "XX feet × XX feet / XX × XX meters",
  }

  // Define bathroom dimensions
  const bathroomDimensions = {
    width: "XX feet / XX meters",
    length: "XX feet / XX meters",
    ceilingHeight: "XX feet / XX meters",
  }

  // Define furniture measurements
  const furniture = [
    { name: "Item Name", imperial: 'XX" x XX"', metric: 'XX × XX cm' },
    // Add more furniture items...
  ]

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

  return (
    <RoomPageTemplate
      // Navigation and breadcrumb props
      backHref="/dorms/dorm-name"
      backText="Dorm Name"
      universityName="University Name"
      universityHref="/dorms/university-name"
      dormName="Dorm Name"
      dormHref="/dorms/dorm-name"
      roomTitle="Room XXX"
      address="Full address with floor info"
      showCertification={true} // Optional: default is true

      // Room content data
      roomDetails={roomDetails}
      dimensions={dimensions}
      bathroomDimensions={bathroomDimensions}
      furniture={furniture}
      floorPlanImage="/path/to/floorplan.jpg"
      floorPlanAlt="Alt text for floor plan"

      // Contact and upload functionality
      uploadDormLink="/upload-dorm?school=University&campus=Campus&dorm=Dorm&floor=X&room=XXX"
      contactEmail="contact@example.com"

      // Optional sections
      relatedRooms={relatedRooms} // Optional: shows related rooms section
      inspirationImage="/path/to/inspiration.jpg" // Optional: shows inspiration section
      inspirationImageAlt="Alt text for inspiration image" // Optional
    />
  )
}

/*
 * Key Benefits of Using RoomPageTemplate:
 * 
 * 1. Consistency: All room pages will have the same layout and functionality
 * 2. Maintainability: Updates to the template affect all room pages
 * 3. Developer Experience: Much less code needed for each room page
 * 4. Feature Complete: Includes photo gallery, tabs, lightbox, responsive design
 * 5. Reusability: Can be used for any dorm room across different universities
 * 
 * To create a new room page:
 * 1. Create a new page.tsx file in the appropriate room directory
 * 2. Import RoomPageTemplate
 * 3. Define your room-specific data
 * 4. Pass the data to RoomPageTemplate
 * 5. Done! 
 */ 