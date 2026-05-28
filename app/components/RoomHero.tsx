"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BackButton } from "./BackButton"

interface RoomHeroProps {
  backHref: string
  backText: string
  universityName: string
  universityLogoSrc?: string // Now optional
  universityHref?: string // Add university link prop
  showCertification?: boolean
  dormName?: string // Add dorm name prop
  dormHref?: string // Add dorm link prop
  roomTitle?: string  // Make optional
  primaryTitle?: string  // Add new prop for main title
  secondaryTitle?: string  // Add new prop for smaller title
  address: string
  featuredBadge?: string // Add featured badge prop
  occupancyBadge?: string // Add occupancy badge prop
  singlePersonBadge?: string // Add single person badge prop
}

export function RoomHero({
  backHref,
  backText,
  universityName,
  universityLogoSrc,
  universityHref,
  showCertification = false,
  dormName,
  dormHref,
  roomTitle,
  primaryTitle,
  secondaryTitle,
  address,
  featuredBadge,
  occupancyBadge,
  singlePersonBadge,
}: RoomHeroProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto max-w-5xl">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton href={backHref} text={backText} />
        </div>
        
        {/* Hero Content */}
        <div className="flex flex-col gap-4">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* University Badge */}
            {universityHref ? (
              <Link href={universityHref}>
                <span className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium shadow-sm border border-border hover:bg-white hover:shadow-md hover:scale-105 hover:border-primary/30 transition-all duration-200 cursor-pointer">
                  {universityLogoSrc && (
                    <Image
                      src={universityLogoSrc}
                      alt={universityName}
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                  )}
                  🏛️ {universityName}
                </span>
              </Link>
            ) : (
              <span className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium shadow-sm border border-border">
                {universityLogoSrc && (
                  <Image
                    src={universityLogoSrc}
                    alt={universityName}
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                )}
                🏛️ {universityName}
              </span>
            )}
            {/* Dorm Name Badge */}
            {dormName && (
              dormHref ? (
                <Link href={dormHref}>
                  <span className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium shadow-sm border border-border hover:bg-white hover:shadow-md hover:scale-105 hover:border-primary/30 transition-all duration-200 cursor-pointer">
                    🏠 {dormName}
                  </span>
                </Link>
              ) : (
                <span className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium shadow-sm border border-border">
                  🏠 {dormName}
                </span>
              )
            )}
            {/* Certification Badge */}
            {showCertification && (
              <div className="relative">
                <span 
                  className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium shadow-sm border border-border hover:bg-white hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip(!showTooltip)}
                >
                  🎓 Student Verified
                </span>
                
                {/* Tooltip */}
                {showTooltip && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-xl border border-border p-4 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="text-sm">
                      <p className="font-medium mb-2">Student sent in with Student Email or through Instagram.</p>
                      <p className="text-muted-foreground">
                        Example: john.doe@officialcampusemail.com
                      </p>
                    </div>
                    {/* Arrow */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-border rotate-45"></div>
                  </div>
                )}
              </div>
            )}
            
            {/* Featured Badge */}
            {featuredBadge && (
              <span className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium shadow-sm border border-border">
                {featuredBadge}
              </span>
            )}
            
            {/* Occupancy Badge */}
            {occupancyBadge && (
              <span className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium shadow-sm border border-border">
                {occupancyBadge}
              </span>
            )}

            {/* Single Person Badge */}
            {singlePersonBadge && (
              <span className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium shadow-sm border border-border">
                👤 {singlePersonBadge}
              </span>
            )}
          </div>

          {/* Room Title */}
          <div>
            {primaryTitle && secondaryTitle ? (
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{primaryTitle}</h1>
                <div className="flex items-center">
                  <span className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium shadow-sm border border-border">
                    {secondaryTitle}
                  </span>
                </div>
              </div>
            ) : (
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{roomTitle}</h1>
            )}
          </div>
          
          {/* Address */}
          <div className="flex items-center text-muted-foreground text-sm">
            📍 {address}
          </div>
        </div>
      </div>
    </section>
  )
}