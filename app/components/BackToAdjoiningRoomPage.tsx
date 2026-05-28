"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

interface BackToAdjoiningRoomPageProps {
  roomNumbers: string
  adjoiningRoomLink: string
  roomImage: string
}

export function BackToAdjoiningRoomPage({ roomNumbers, adjoiningRoomLink, roomImage }: BackToAdjoiningRoomPageProps) {
  // Rotating thumbnails for carousel
  const rotatingThumbnails = [
    "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-bedroom-imp-4.jpg",
    "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bathroom-empty-13.jpg",
    "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+12/1207+%2B+1208/sumiller1207-bedroom-cool-layout-imp-empty-4.jpg",
    "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-8.jpg",
    "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+14/1407+%2B+1408/sumiller1407-bedroom-empty-imp-4.jpg"
  ]
  
  // Use provided image if available, otherwise use a specific rotating thumbnail
  const displayImage = roomImage || "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bathroom-empty-13.jpg"
  
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-12">
      <h2 className="text-2xl font-bold mb-6">Adjoining Room</h2>
      <div className="max-w-md">
        <Link href={adjoiningRoomLink} className="block">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            {/* Image Section */}
            <div className="relative h-48">
              <Image
                src={displayImage}
                alt={`Adjoining room ${roomNumbers}`}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Content Section */}
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Rooms {roomNumbers}</h3>
              <p className="text-muted-foreground mb-4">This room shares a Jack and Jill bathroom.</p>
              <Button className="w-full" asChild>
                <div>
                  View Details
                </div>
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
} 