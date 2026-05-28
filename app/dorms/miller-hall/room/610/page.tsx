"use client"

import { RoomPageTemplate } from "@/app/components/RoomPageTemplate"

export default function MillerHallRoom610Page() {
  return (
    <RoomPageTemplate
      // Navigation and header info
      backHref="/dorms/miller-hall"
      backText="Back to Miller Hall"
      universityName="Suffolk University"
      universityHref="/dorms/suffolk-university"
      dormName="Miller Hall"
      dormHref="/dorms/miller-hall"
      roomTitle="Room 610"
      address="10 Somerset St, Boston, MA 02108"
      showCertification={true}
      occupancyBadge="👤 Single"
      
      // Room details
      roomDetails={{
        name: "Room 610",
        description: "A cozy single room in Miller Hall with great natural lighting",
        size: "Single",
        occupancy: "1 student",
                 features: [
          "Carpeted room",
          "Private bathroom",
          "Lock behind you door",
          "Customizable thermostat",
          "TBD - Share your experience!"
        ],
        photos: [
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-27-sec-bedroom-imp-empty-1.mp4",
            alt: "Room 610 empty room tour",
            type: "video",
            thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-2.jpg"
          },
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-2.jpg",
            alt: "Room 610 view 1",
            type: "image"
          },
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-3.jpg",
            alt: "Room 610 view 2",
            type: "image"
          },
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-4.jpg",
            alt: "Room 610 view 3",
            type: "image"
          },
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-5.jpg",
            alt: "Room 610 view 4",
            type: "image"
          },
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-6.jpg",
            alt: "Room 610 view 5",
            type: "image"
          },
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-7.jpg",
            alt: "Room 610 view 6",
            type: "image"
          },
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-8.jpg",
            alt: "Room 610 view 7",
            type: "image"
          },
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-9.jpg",
            alt: "Room 610 view 8",
            type: "image"
          },
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-10.jpg",
            alt: "Room 610 view 9",
            type: "image"
          }
        ]
      }}

      // Room dimensions (placeholder - to be updated)
      dimensions={{
        width: "12 feet",
        length: "15 feet",
        ceilingHeight: "9 feet",
        windowSize: "4 feet x 6 feet"
      }}

      // Bathroom dimensions (placeholder - to be updated)
      bathroomDimensions={{
        width: "8 feet",
        length: "6 feet",
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
        x: 70,  // Adjust these coordinates based on actual floor plan
        y: 35,
        width: 12,
        height: 15
      }}

      // Links
      uploadDormLink="/upload-dorm"
      contactEmail="4wallsdorms@gmail.com"

      // Related rooms
      relatedRooms={[
        {
          id: 1,
          type: "Room 611",
          description: "Spacious quad room on the same floor",
          image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/611/sumiller611-plaque.png",
          link: "/dorms/miller-hall/room/611"
        },
        {
          id: 2,
          type: "Room 201",
          description: "Double room with shared bathroom",
          image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg",
          link: "/dorms/miller-hall/room/201"
        },
        {
          id: 3,
          type: "Room 206",
          description: "Double room with shared bathroom",
          image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-11.jpg",
          link: "/dorms/miller-hall/room/206"
        }
      ]}

      // Adjoining room info
      adjoiningRoomLink="/dorms/miller-hall/communal/adjoining-room/609-610"
      adjoiningRoomTitle="Miller Hall Adjoining Room 609 + 610"
      adjoiningRoomDescription="Experience connected living with a shared bathroom"
      adjoiningRoomImage="https://f005.backblazeb2.com/file/4wallsdorms/Screenshot+2025-08-07+160651.png"

      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Modern double dorm room inspiration"
    />
  )
}