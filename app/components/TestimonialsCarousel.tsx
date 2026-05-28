"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    image: "/minimalist-dorm-room.png",
    title: "Thousands of Dollars Nightmare!",
    type: "Parent",
    text: "I drove 7 hours to move my daughter in, rented a U-Haul, and packed everything we thought she'd need. Got there and we had majorly over-packed. I planned on returning to U-Haul in the city and bought a flight home but I had to drive all 7 hours back. What should have been $500 turned into thousands of dollars nightmare.",
  },
  {
    id: 2,
    image: "/boho-dorm-warmth.png",
    title: "Helping Even When It Is Messy",
    type: "Student",
    text: "I shared photos and videos of my dorm room even though the only ones I could find were a little messy, but I want to help out because I wish I knew what my dorm room looked like before moving in. It would have saved me money, stress, and time.",
  },
  {
    id: 3,
    image: "/tech-dorm-room.png",
    title: "No More Excuses",
    type: "Parent",
    text: "Being able to see the dorm room saved hundreds of dollars by being able to plan with my son's roommates. Third time moving a kid into a dorm and I did not have to make excuses about putting off buying till after move in, because I did not know how much space he had. I was able to take advantage of all the college sales.",
  },
  {
    id: 4,
    image: "/double-dorm-room.png",
    title: "Students Lets Help Each Other Out",
    type: "Student",
    text: "When I move out, I'm def sending in my room because without seeing my dorm room first, I would have had no idea how to organize. I got my roommates on it too, and we made the best of our room. Y'all better start posting your rooms too so I can see my room for next year!",
  },
]

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary/10 to-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">What Families Are Saying</h2>
        </motion.div>

        <div className="relative max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-background rounded-2xl shadow-lg border border-border overflow-hidden"
            >
              <div className="relative">
                <Image
                  src={currentTestimonial.image || "/placeholder.svg"}
                  alt="Dorm room"
                  width={600}
                  height={400}
                  className="object-cover w-full aspect-[3/2]"
                />
              </div>

              <div className="p-3 md:p-4">
                <h3 className="text-lg md:text-xl font-bold mb-2">{currentTestimonial.title}</h3>

                <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wide">
                  {currentTestimonial.type}
                </p>

                <p className="text-sm text-muted-foreground leading-relaxed">"{currentTestimonial.text}"</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
