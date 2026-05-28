"use client"

import { useRouter } from "next/navigation"
import { AdjoiningRoomPageTemplate } from "@/app/components/AdjoiningRoomPageTemplate"

export default function MillerHallAdjoiningRoom405406Page() {
  const router = useRouter()

  const adjoiningRoomData = {
    id: "405-406",
    title: "Miller Hall Adjoining Room 405 + 406",
    description:
      "An adjoining room setup in Miller Hall featuring two double rooms connected by a shared bathroom. This setup offers a good balance of privacy and community living.",
    roomNumbers: ["405", "406"],
    size: "450 sq ft total",
    occupancy: "4 students",
    features: [
      "Carpeted room",
      "Shared bathroom",
      "Lock behind you door",
      "Customizable thermostat",
      "TBD - Share your experience!",
    ],
    photos: [
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/floor+4/405+%2B+406/sumiller406-24-sec-empty.mp4",
        alt: "Room 406 Tour - 24 seconds",
        caption: "Room 406 Tour (Empty)",
        type: "video" as const,
        thumbnail:
          "https://f005.backblazeb2.com/file/4wallsdorms/Screenshot+2025-08-07+160651.png",
      },
    ],
    sharedSpaces: {
      bathroom: {
        name: "Jack and Jill Bathroom",
        description: "Private bathroom shared between rooms 405 and 406",
        features: [
          "1 Shower",
          "1 Toilet",
          "1 Sink",
          "1 Mirror",
          "Storage cabinet",
        ],
      },
      "bathroom-dimensions": {
        name: "Bathroom Dimensions",
        description:
          "Measurements for the shared bathroom space between rooms 405 and 406",
        features: [],
        dimensions: {
          width: "8 feet",
          length: "6 feet",
          ceilingHeight: "8 feet",
        },
      },
    },
    individualRooms: [
      {
        number: "405",
        type: "Double Room",
        description: "A spacious double room with two beds",
        image:
          "https://f005.backblazeb2.com/file/4wallsdorms/Screenshot+2025-08-07+160651.png",
      },
      {
        number: "406",
        type: "Double Room",
        description: "A spacious double room with two beds",
        image:
          "https://f005.backblazeb2.com/file/4wallsdorms/Screenshot+2025-08-07+160651.png",
      },
    ],
  }

  const relatedRooms = [
    {
      id: 1,
      type: "Rooms 407 + 408",
      description: "Adjoining rooms on the 4th floor",
      image:
        "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/floor+4/4floorplanmillersuffolk.jpg",
      link: "/dorms/miller-hall/communal/adjoining-room/407-408",
    },
    {
      id: 2,
      type: "Rooms 201 + 202",
      description: "Adjoining rooms on the 2nd floor",
      image:
        "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/2floorplanmillersuffolk.jpg",
      link: "/dorms/miller-hall/communal/adjoining-room/201-202",
    },
    {
      id: 3,
      type: "Rooms 205 + 206",
      description: "Adjoining rooms on the 2nd floor",
      image:
        "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bathroom-empty-13.jpg",
      link: "/dorms/miller-hall/communal/adjoining-room/205-206",
    },
  ]

  const handleIndividualRoomClick = (roomNumber: string) => {
    router.push(`/dorms/miller-hall/room/${roomNumber}`)
  }

  const handleRelatedRoomClick = (_roomType: string, link: string) => {
    router.push(link)
  }

  return (
    <AdjoiningRoomPageTemplate
      backHref="/dorms/miller-hall"
      backText="Miller Hall"
      universityName="Suffolk University"
      universityHref="/dorms/suffolk-university"
      dormName="Miller Hall"
      dormHref="/dorms/miller-hall"
      roomTitle="Adjoining Rooms 405 + 406"
      address="10 Somerset St, Boston, MA 02108, Floor 4"
      showCertification={true}
      adjoiningRoomData={adjoiningRoomData}
      floorPlanImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/floor+4/4floorplanmillersuffolk.jpg"
      floorPlanAlt="Rooms 405 + 406 floor plan — 4th floor"
      uploadDormLink="/upload-dorm?school=Suffolk%20University&campus=Boston&dorm=Miller%20Hall&floor=4&rooms=405-406"
      contactEmail="4wallsdorms@gmail.com"
      relatedRooms={relatedRooms}
      inspirationImage="https://res.cloudinary.com/dms1ipcii/image/upload/v1721604990/Suffolkphotos/10%20west/4%20Floor/407/su10west407c-room-view-from-the-outside-the-door-with-bed-and-posters-moved-in.jpg"
      inspirationImageAlt="Real decorated dorm room inspiration from Suffolk University students"
      onIndividualRoomClick={handleIndividualRoomClick}
      onRelatedRoomClick={handleRelatedRoomClick}
    />
  )
}
