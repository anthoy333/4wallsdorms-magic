export type FakeRoom = {
  id: string
  roomNumber: string
  title: string
  roomType: string
  beds: number
  bathroomType: string
  annualCost: string
  description: string
  image: string
  features: string[]
}

export type FakeDorm = {
  id: string
  name: string
  address: string
  description: string
  image: string
  quickFacts: {
    label: string
    value: string
  }[]
  rooms: FakeRoom[]
}

export type FakeCollege = {
  id: string
  name: string
  city: string
  state: string
  description: string
  image: string
  dorms: FakeDorm[]
}

export const fakeColleges: FakeCollege[] = [
  {
    id: "suffolk",
    name: "Fake Suffolk University",
    city: "Boston",
    state: "MA",
    description:
      "This is fake data showing how one college page can automatically create dorm pages and room pages from the same data.",
    image: "/placeholder.svg",
    dorms: [
      {
        id: "miller-hall",
        name: "Fake Miller Hall",
        address: "73 Tremont Street, Boston, MA",
        description:
          "A fake dorm building used to show how a DormPageTemplate works.",
        image: "/placeholder.svg",
        quickFacts: [
          { label: "Room Types", value: "Singles, Doubles, Triples" },
          { label: "Bathrooms", value: "Shared Jack-and-Jill" },
          { label: "Best For", value: "First-year students" },
        ],
        rooms: [
          {
            id: "room-201",
            roomNumber: "201",
            title: "Room 201",
            roomType: "Double Room",
            beds: 2,
            bathroomType: "Shared Bathroom",
            annualCost: "$18,000",
            description:
              "A fake double room example. This page is generated from data, not manually rebuilt.",
            image: "/placeholder.svg",
            features: ["2 beds", "2 desks", "Shared bathroom", "Closet space"],
          },
          {
            id: "room-610",
            roomNumber: "610",
            title: "Room 610",
            roomType: "Triple Room",
            beds: 3,
            bathroomType: "Shared Bathroom",
            annualCost: "$16,500",
            description:
              "A fake triple room example using the exact same RoomPageTemplate as Room 201.",
            image: "/placeholder.svg",
            features: ["3 beds", "3 desks", "Shared bathroom", "Large window"],
          },
        ],
      },
      {
        id: "smith-hall",
        name: "Fake Smith Hall",
        address: "150 Fake Street, Boston, MA",
        description:
          "A second fake dorm to prove the same DormPageTemplate works for another building.",
        image: "/placeholder.svg",
        quickFacts: [
          { label: "Room Types", value: "Singles and Doubles" },
          { label: "Bathrooms", value: "Communal bathrooms" },
          { label: "Best For", value: "Students who want a classic dorm setup" },
        ],
        rooms: [
          {
            id: "room-304",
            roomNumber: "304",
            title: "Room 304",
            roomType: "Single Room",
            beds: 1,
            bathroomType: "Communal Bathroom",
            annualCost: "$20,000",
            description:
              "A fake single room. Notice it still gets the same buttons and layout automatically.",
            image: "/placeholder.svg",
            features: ["1 bed", "1 desk", "Closet", "Communal bathroom"],
          },
        ],
      },
    ],
  },
  {
    id: "dean",
    name: "Fake Dean College",
    city: "Franklin",
    state: "MA",
    description:
      "This is a second fake college proving the same templates can work for multiple schools.",
    image: "/placeholder.svg",
    dorms: [
      {
        id: "dean-main-hall",
        name: "Fake Dean Main Hall",
        address: "99 Fake Campus Road, Franklin, MA",
        description:
          "A fake Dean College dorm using the same dorm and room templates.",
        image: "/placeholder.svg",
        quickFacts: [
          { label: "Room Types", value: "Singles and Doubles" },
          { label: "Bathrooms", value: "Communal bathrooms" },
          { label: "Best For", value: "First-year students" },
        ],
        rooms: [
          {
            id: "room-101",
            roomNumber: "101",
            title: "Room 101",
            roomType: "Double Room",
            beds: 2,
            bathroomType: "Communal Bathroom",
            annualCost: "$15,000",
            description: "A fake Dean room using the same RoomPageTemplate.",
            image: "/placeholder.svg",
            features: ["2 beds", "2 desks", "Closet", "Communal bathroom"],
          },
        ],
      },
    ],
  },
]