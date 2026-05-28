"use client"

import { MapPin } from "lucide-react"
import Image from "next/image"
import { BackButton } from "@/app/components/BackButton"

interface DormHeroSectionProps {
  title: string
  address: string
  description: string
  image: string
  backButtonHref: string
  backButtonText: string
  className?: string
}

export function DormHeroSection({
  title,
  address,
  description,
  image,
  backButtonHref,
  backButtonText,
  className = ""
}: DormHeroSectionProps) {
  return (
    <section className={`relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background ${className}`}>
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6">
          <BackButton href={backButtonHref} text={backButtonText} />
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-[300px] rounded-xl overflow-hidden bg-muted">
            {image ? (
              <Image
                src={image}
                alt={title}
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

          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{address}</span>
            </div>
            <p className="text-lg text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 