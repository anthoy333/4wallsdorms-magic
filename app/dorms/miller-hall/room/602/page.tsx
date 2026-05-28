"use client"

import { RoomPageTemplate } from "@/app/components/RoomPageTemplate"

export default function MillerHallRoom602Page() {
  return (
    <RoomPageTemplate
      // Navigation and header info
      backHref="/dorms/miller-hall"
      backText="Back to Miller Hall"
      universityName="Suffolk University"
      universityHref="/dorms/suffolk-university"
      dormName="Miller Hall"
      dormHref="/dorms/miller-hall"
      roomTitle="Room 602"
      address="10 Somerset St, Boston, MA 02108"
      showCertification={true}
      
      // Room details
      roomDetails={{
        name: "Room 602",
        description: "A spacious double room in Miller Hall with great natural lighting",
        size: "Double",
        occupancy: "2 students",
        features: [
          "Carpeted room",
          "Shared bathroom with Room 601",
          "Lock behind you door",
          "Customizable thermostat",
          "TBD - Share your experience!"
        ],
        photos: [
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-plaque-imp-7.jpg",
            alt: "Room 602 plaque",
            type: "image"
          },
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-bedroom-22-sec-imp-2.mp4",
            alt: "Room 602 bedroom tour",
            type: "video",
            thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-bedroom-imp-3.jpg"
          },
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-20-sec-bedroom-empty-imp-1.mp4",
            alt: "Room 602 empty room tour",
            type: "video",
            thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-bedroom-imp-4.jpg"
          },
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-bedroom-imp-3.jpg",
            alt: "Room 602 bedroom view",
            type: "image"
          },
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-bedroom-imp-4.jpg",
            alt: "Room 602 another angle",
            type: "image"
          },
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-bedroom-imp-5.jpg",
            alt: "Room 602 furniture view",
            type: "image"
          },
          {
            src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-bedroom-imp-6.jpg",
            alt: "Room 602 complete view",
            type: "image"
          }
        ]
      }}

      // Room dimensions (placeholder - to be updated)
      dimensions={{
        width: "15 feet",
        length: "20 feet",
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
        x: 65,  // Adjust these coordinates based on actual floor plan
        y: 35,
        width: 15,
        height: 20
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
          type: "Room 610",
          description: "Single room on the same floor",
          image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-2.jpg",
          link: "/dorms/miller-hall/room/610"
        },
        {
          id: 3,
          type: "Room 202",
          description: "Double room with shared bathroom",
          image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg",
          link: "/dorms/miller-hall/room/202"
        }
      ]}

      // Adjoining room info
      adjoiningRoomLink="/dorms/miller-hall/communal/adjoining-room/601-602"
      adjoiningRoomTitle="Miller Hall Adjoining Room 601 + 602"
      adjoiningRoomDescription="Experience connected living with a shared bathroom"
      adjoiningRoomImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-plaque-imp-7.jpg"

      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration from Suffolk University students"
    />
  )
}
