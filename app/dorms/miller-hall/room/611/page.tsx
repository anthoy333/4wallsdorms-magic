"use client"

import { RoomPageTemplate } from "@/app/components/RoomPageTemplate"

export default function MillerHallRoom611Page() {
  return (
    <RoomPageTemplate
      // Navigation and header info
      backHref="/dorms/miller-hall"
      backText="Back to Miller Hall"
      universityName="Suffolk University"
      universityHref="/dorms/suffolk-university"
      dormName="Miller Hall"
      dormHref="/dorms/miller-hall"
      roomTitle="Room 611"
      address="10 Somerset St, Boston, MA 02108"
      showCertification={true}
      occupancyBadge="👥 Quad"
      
      // Room details
      roomDetails={{
        name: "Room 611",
        description: "A spacious quad room in Miller Hall perfect for four students",
        size: "Quad",
        occupancy: "4 students",
                 features: [
           "Carpeted room",
           "Private bathroom",
           "Lock behind you door",
           "Customizable thermostat",
           "TBD - Share your experience!"
         ],
        photos: [
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/611/sumiller611-full-42-sec-empty.mp4",
            alt: "Room 611 empty room tour",
            type: "video",
            thumbnail: "/quad-dorm-room.png"  // Using a default thumbnail since no specific image was provided
          }
        ]
      }}

      // Room dimensions (placeholder - to be updated)
      dimensions={{
        width: "24 feet",
        length: "30 feet",
        ceilingHeight: "9 feet",
        windowSize: "4 feet x 6 feet"
      }}

      // Bathroom dimensions (placeholder - to be updated)
      bathroomDimensions={{
        width: "8 feet",
        length: "10 feet",
        ceilingHeight: "9 feet"
      }}

      // Furniture measurements (placeholder - to be updated)
      furniture={[
        {
          name: "Bed",
          imperial: "80\" x 36\"",
          metric: "203cm x 91cm"
        },
        {
          name: "Desk",
          imperial: "42\" x 24\"",
          metric: "107cm x 61cm"
        },
        {
          name: "Dresser",
          imperial: "30\" x 24\"",
          metric: "76cm x 61cm"
        }
      ]}

      // Floor plan
      floorPlanImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/6floorplanmillersuffolk.jpg"
      floorPlanAlt="6th Floor Plan - Miller Hall"
      roomCoordinates={{
        x: 75,  // Adjust these coordinates based on actual floor plan
        y: 35,
        width: 25,
        height: 30
      }}

      // Links
      uploadDormLink="/upload-dorm"
      contactEmail="4wallsdorms@gmail.com"

      // Related rooms
      relatedRooms={[
        {
          id: 1,
          type: "Room 610",
          description: "Single room on the same floor",
          image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-2.jpg",
          link: "/dorms/miller-hall/room/610"
        },
        {
          id: 2,
          type: "Room 205",
          description: "Double room with shared bathroom",
          image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bedroom-empty-4.jpg",
          link: "/dorms/miller-hall/room/205"
        },
        {
          id: 3,
          type: "Room 608",
          description: "Double room with shared bathroom",
          image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller608-plaque.png",
          link: "/dorms/miller-hall/room/608"
        }
      ]}

      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Modern quad dorm room inspiration"
    />
  )
}
