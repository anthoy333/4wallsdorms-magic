"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const testimonials = [
  {
    quote:
      "4WallsDorms saved me so much stress during move-in day. I knew exactly how my room would look and what would fit before I even arrived on campus.",
    author: "Jane Doe",
    position: "Freshman, State University",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "My roommate and I used 4WallsDorms to coordinate our room setup. It helped us avoid bringing duplicate items and made sure our styles would work together.",
    author: "John Smith",
    position: "Sophomore, Tech Institute",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "As a parent, I appreciated being able to help my daughter plan her dorm room without the guesswork. The visualization tool was incredibly helpful.",
    author: "Emily Brown",
    position: "Parent of Freshman",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="container mx-auto">
        <motion.h2
          className="text-5xl font-black mb-16 text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          What Students Say
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              className="bg-gray-800 p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.author}
                  width={50}
                  height={50}
                  className="rounded-full mr-4"
                  style={{
                    maxWidth: "100%",
                    height: "auto"
                  }} />
                <div>
                  <p className="font-bold text-white">{testimonial.author}</p>
                  <p className="text-gray-400">{testimonial.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
