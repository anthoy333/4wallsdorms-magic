"use client"

import { Button } from "@/components/ui/button"
import { FeatureList } from "@/components/ui/feature-list"
import Image from "next/image"
import Link from "next/link"

interface DormTabContentProps {
  name: string
  description: string
  image: string
  features: string[]
  link: string
  className?: string
}

export function DormTabContent({
  name,
  description,
  image,
  features,
  link,
  className = ""
}: DormTabContentProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative h-[300px] rounded-xl overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={name}
              width={600}
              height={300}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span>No image available</span>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">{name}</h3>
          <p className="text-muted-foreground">
            {description}
          </p>
          <FeatureList features={features} />
          <Button className="mt-2" asChild>
            <Link href={link}>View Dorm Rooms</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 