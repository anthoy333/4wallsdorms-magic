"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
interface RoomType {
  id: number
  type: string
  description: string
  image: string
  link?: string
}

interface DormRoomsAtSuffolkProps {
  rooms: RoomType[]
}

export function DormRoomsAtSuffolk({ rooms }: DormRoomsAtSuffolkProps) {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div>
          <h2 className="text-2xl font-bold mb-6">Dorm Rooms at Suffolk</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms.map((roomType, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative">
                  <Image
                    src={roomType.image}
                    alt={`${roomType.type} at Suffolk`}
                    width={400}
                    height={192}
                    className="object-cover w-full h-48"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{roomType.type}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {roomType.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                    asChild
                  >
                    <Link href={roomType.link || "/dorms"}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
