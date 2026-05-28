"use client"

import { AdjoiningRoomPageTemplate } from "@/app/components/AdjoiningRoomPageTemplate"

export default function MillerHallAdjoiningRoom407408Page() {
  const adjoiningRoomData = {
    id: "407-408",
    title: "Rooms 407 + 408",
    description: "An adjoining room setup in Miller Hall featuring two double rooms connected by a shared bathroom. This setup offers a perfect balance of privacy and community living.",
    roomNumbers: ["407", "408"],
    size: "450 sq ft total",
    occupancy: "4 Students",
    features: [
      "Shared bathroom between rooms",
      "Individual temperature control",
      "Carpeted rooms",
      "Lock behind you door",
      "TBD - Share your experience!"
    ],
    photos: [
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/floor+4/407+%2B+408/sumiller407-16-sec-empty.mp4",
        alt: "Room 407 Tour - 16 seconds",
        caption: "Room 407 Tour (Empty)",
        type: "video" as const,
        thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1007+%2B+1008/1008millersuffolk(3).jpg"
      },
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/floor+4/407+%2B+408/sumiller408-12-sec-empty.mp4",
        alt: "Room 408 Tour - 12 seconds",
        caption: "Room 408 Tour (Empty)",
        type: "video" as const,
        thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+14/1407+%2B+1408/sumiller1407-view-empty-imp-6.jpg"
      }
    ],
    sharedSpaces: {
      bathroom: {
        name: "Shared Bathroom",
        description: "A private bathroom shared between both rooms with modern fixtures and ample storage.",
        features: [
          "Full-size shower",
          "Toilet",
          "Sink with mirror",
          "Storage cabinet",
          "Towel hooks"
        ]
      },
      dimensions: {
        name: "Room Dimensions",
        description: "Detailed measurements of the shared spaces.",
        features: ["TBD - Help us measure!"],
        dimensions: {
          width: "8 feet",
          length: "6 feet",
          ceilingHeight: "8 feet"
        }
      }
    },
    individualRooms: [
      {
        number: "407",
        type: "Double Room",
        description: "Spacious double room with modern amenities",
        image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1007+%2B+1008/1008millersuffolk(3).jpg"
      },
      {
        number: "408",
        type: "Double Room",
        description: "Spacious double room with modern amenities",
        image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+14/1407+%2B+1408/sumiller1407-view-empty-imp-6.jpg"
      }
    ]
  }

  const relatedRooms = [
    {
      id: 1,
      type: "Rooms 201 + 202",
      description: "Two Doubles in Adjoining room on floor 2",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/2floorplanmillersuffolk.jpg"
    },
    {
      id: 2,
      type: "Rooms 205 + 206",
      description: "Two Doubles in Adjoining room on floor 2",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/2floorplanmillersuffolk.jpg"
    }
  ]

  return (
    <AdjoiningRoomPageTemplate
      // Hero props
      backHref="/dorms/miller-hall"
      backText="Miller Hall"
      universityName="Suffolk University"
      universityHref="/dorms/suffolk-university"
      dormName="Miller Hall"
      dormHref="/dorms/miller-hall"
      roomTitle="Rooms 407 + 408"
      address="10 Somerset St, Boston, MA 02108, Floor 4, Rooms 407 + 408"
      showCertification={true}
      occupancyBadge="👥 4 Students"

      // Room data
      adjoiningRoomData={adjoiningRoomData}
      floorPlanImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/floor+4/4floorplanmillersuffolk.jpg"
      floorPlanAlt="Rooms 407 + 408 Floor Plan Layout - 4th Floor"

      // Upload and contact links
      uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=4&room=407-408"
      contactEmail="4wallsdorms@gmail.com"

      // Related rooms
      relatedRooms={relatedRooms}

      // Inspiration section
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration from Suffolk University students"
    />
  )
}