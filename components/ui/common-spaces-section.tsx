"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface CommonSpace {
  id: number
  name: string
  description: string
  image: string
}

interface CommonSpacesSectionProps {
  dormName: string
  commonSpaces: CommonSpace[]
  className?: string
}

export function CommonSpacesSection({ 
  dormName, 
  commonSpaces, 
  className = "" 
}: CommonSpacesSectionProps) {
  return (
    <section className={`py-10 px-4 sm:px-6 lg:px-8 bg-secondary/10 ${className}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Get to Know the Dorm</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore the common spaces and amenities available to all residents of {dormName}.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {commonSpaces.map((space) => (
            <Card key={space.id} className="overflow-hidden">
              <div className="relative h-48 bg-muted">
                {space.image ? (
                  <Image
                    src={space.image}
                    alt={space.name}
                    width={600}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    <span>No image</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{space.name}</h3>
                <p className="text-muted-foreground text-sm">{space.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 