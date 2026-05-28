import { RoomPageTemplate } from "@/app/components/RoomPageTemplate"

export default function MillerHallRoom702Page() {
  const roomDetails = {
    name: "Room 702",
    description: "A double room in Miller Hall with a shared bathroom.",
    size: "225 sq ft",
    occupancy: "2 students",
    features: [
      "Carpeted room",
      "Shared bathroom with Room 701",
      "Lock behind you door",
      "Customizable thermostat",
      "TBD - Share your experience!"
    ],
    photos: [
      {
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+7/701+%2B+702/sumiller702%2B701-50-sec-messy-empty.mp4",
        alt: "Room 702 video tour",
        type: "video" as const,
        thumbnail: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+7/701+%2B+702/sumiller702-plaque.png"
      }
    ]
  }

  const dimensions = {
    width: "TBD",
    length: "TBD",
    ceilingHeight: "TBD",
    windowSize: "TBD"
  }

  const bathroomDimensions = {
    width: "TBD",
    length: "TBD",
    ceilingHeight: "TBD"
  }

  const furniture = [
    { name: "Bed", imperial: "TBD", metric: "TBD" },
    { name: "Desk", imperial: "TBD", metric: "TBD" },
    { name: "Chair", imperial: "TBD", metric: "TBD" },
    { name: "Dresser", imperial: "TBD", metric: "TBD" },
    { name: "Closet", imperial: "TBD", metric: "TBD" }
  ]

  const relatedRooms = [
    {
      id: 1,
      type: "Room 610",
      description: "Single room on the 6th floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-2.jpg",
      link: "/dorms/miller-hall/room/610"
    },
    {
      id: 2,
      type: "Room 611",
      description: "Quad room on the 6th floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/611/sumiller611-plaque.png",
      link: "/dorms/miller-hall/room/611"
    },
    {
      id: 3,
      type: "Room 602",
      description: "Double room on the 6th floor",
      image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-plaque-imp-7.jpg",
      link: "/dorms/miller-hall/room/602"
    }
  ]

  return (
    <RoomPageTemplate
      backHref="/dorms/miller-hall"
      backText="Miller Hall"
      universityName="Suffolk University"
      universityHref="/dorms/suffolk-university"
      dormName="Miller Hall"
      dormHref="/dorms/miller-hall"
      roomTitle="Room 702"
      address="8 Ashburton Place, Boston, MA"
      showCertification={true}
      featuredBadge="Double Room"
      occupancyBadge="2 students"
      roomDetails={roomDetails}
      dimensions={dimensions}
      bathroomDimensions={bathroomDimensions}
      furniture={furniture}
      floorPlanImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+7/7floorplanmillersuffolk.jpg"
      floorPlanAlt="7th Floor Plan - Miller Hall Suffolk University"
      roomCoordinates={{
        x: 20,
        y: 20,
        width: 15,
        height: 15
      }}
      uploadDormLink="/upload-dorm"
      contactEmail="4wallsdorms@gmail.com"
      relatedRooms={relatedRooms}
      inspirationImage="https://f005.backblazeb2.com/file/4wallsdorms/boho-dorm-warmth.png"
      inspirationImageAlt="Boho dorm room inspiration with warm colors"
    />
  )
}
