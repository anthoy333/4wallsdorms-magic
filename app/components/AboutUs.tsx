"use client"

import { motion } from "framer-motion"
import { DormMediaCard, type MediaItem } from "@/app/components/DormMediaCard"

const sampleDormRooms: {
  roomNumber: string
  dormName: string
  schoolName: string
  detailsLink: string
  media: MediaItem[]
}[] = [
  {
    roomNumber: "1005",
    dormName: "Miller Hall",
    schoolName: "Suffolk University",
    detailsLink: "/dorms/miller-hall/room/1005",
    media: [
      {
        type: "video",
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1005+%2B+1006/1005millersuffolk.mp4",
        alt: "Room 1005 video tour",
        thumbnail:
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1005+%2B+1006/1005millersuffolk(1).jpg",
      },
      {
        type: "image",
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1005+%2B+1006/1005millersuffolk(1).jpg",
        alt: "Room 1005 - View 1",
      },
      {
        type: "image",
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1005+%2B+1006/1005millersuffolk(2).jpg",
        alt: "Room 1005 - View 2",
      },
    ],
  },
  {
    roomNumber: "610",
    dormName: "Miller Hall",
    schoolName: "Suffolk University",
    detailsLink: "/dorms/miller-hall/room/610",
    media: [
      {
        type: "video",
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-27-sec-bedroom-imp-empty-1.mp4",
        alt: "Room 610 video tour",
        thumbnail:
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-2.jpg",
      },
      {
        type: "image",
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-2.jpg",
        alt: "Room 610 - View 1",
      },
      {
        type: "image",
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-3.jpg",
        alt: "Room 610 - View 2",
      },
    ],
  },
  {
    roomNumber: "611",
    dormName: "Miller Hall",
    schoolName: "Suffolk University",
    detailsLink: "/dorms/miller-hall/room/611",
    media: [
      {
        type: "video",
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/611/sumiller611-full-42-sec-empty.mp4",
        alt: "Room 611 video tour",
        thumbnail:
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-bedroom-imp-3.jpg",
      },
    ],
  },
  {
    roomNumber: "602",
    dormName: "Miller Hall",
    schoolName: "Suffolk University",
    detailsLink: "/dorms/miller-hall/room/602",
    media: [
      {
        type: "image",
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-bedroom-imp-3.jpg",
        alt: "Room 602 - View 1",
      },
      {
        type: "video",
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-bedroom-22-sec-imp-2.mp4",
        alt: "Room 602 bedroom tour",
        thumbnail:
          "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-bedroom-imp-3.jpg",
      },
      {
        type: "image",
        src: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-bedroom-imp-4.jpg",
        alt: "Room 602 - View 2",
      },
    ],
  },
]

export default function AboutUs() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="container mx-auto">
        <motion.h2
          className="text-5xl font-black mb-8 text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Us
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h3 className="text-3xl font-bold mb-4 text-white">We are Creative Innovators</h3>
            <p className="text-gray-300 mb-6">
              At CreativeAgency, we blend cutting-edge technology with artistic vision to create digital experiences
              that captivate and inspire. Our team of passionate designers, developers, and strategists work tirelessly
              to push the boundaries of what's possible in the digital realm.
            </p>
            <p className="text-gray-300">
              With a focus on innovation and user-centric design, we've helped countless brands transform their digital
              presence and connect with their audience in meaningful ways.
            </p>
          </motion.div>
          <motion.div
            className="relative h-96"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg transform rotate-3"></div>
            <div className="absolute inset-0 bg-gray-800 rounded-lg transform -rotate-3 flex items-center justify-center">
              <p className="text-2xl font-bold text-white">Creative Team at Work</p>
            </div>
          </motion.div>
        </div>

        {/* Explore Dorm Rooms section */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold mb-2 text-center text-white">Explore Dorm Rooms</h3>
          <p className="text-gray-400 text-center mb-10 text-sm">
            Hover over a card and use the arrows to browse photos &amp; videos
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleDormRooms.map((room, index) => (
              <motion.div
                key={room.roomNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <DormMediaCard
                  roomNumber={room.roomNumber}
                  dormName={room.dormName}
                  schoolName={room.schoolName}
                  media={room.media}
                  detailsLink={room.detailsLink}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
