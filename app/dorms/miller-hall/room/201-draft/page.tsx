"use client"

import { useState, useEffect, useRef } from "react"
import React from "react"
import Image from "next/image"
import { SplitViewFloorPlan } from "@/app/components/SplitViewFloorPlan"

export default function MillerHallRoom201DraftPage() {
  const [mediaModalOpen, setMediaModalOpen] = useState(false)
  const [laundryModalOpen, setLaundryModalOpen] = useState(false)
  const [acModalOpen, setAcModalOpen] = useState(false)
  const [lockModalOpen, setLockModalOpen] = useState(false)
  const [thermostatModalOpen, setThermostatModalOpen] = useState(false)
  const [priceModalOpen, setPriceModalOpen] = useState(false)
  const [priceSearchTerm, setPriceSearchTerm] = useState("")
  const [floorPlanModalOpen, setFloorPlanModalOpen] = useState(false)
  const [lockIdeaModalOpen, setLockIdeaModalOpen] = useState(false)
  const [currentMedia, setCurrentMedia] = useState<{ src: string; type: "image" | "video" } | null>(null)
  const [activeTab, setActiveTab] = useState("Overview")
  const [hoursExpanded, setHoursExpanded] = useState(false)

  // Hours logic
  const getCurrentStatus = () => {
    const now = new Date()
    const day = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = now.getHours()
    const minute = now.getMinutes()
    const currentTime = hour * 60 + minute // minutes since midnight

    // Monday = 1, Friday = 5
    if (day >= 1 && day <= 5) {
      const openTime = 9 * 60 // 9:00 AM
      const closeTime = 17 * 60 // 5:00 PM

      if (currentTime >= openTime && currentTime < closeTime) {
        return {
          status: "Open",
          closesAt: "5:00 PM",
          closesDay: "today"
        }
      } else if (currentTime < openTime) {
        return {
          status: "Closed",
          opensAt: "9:00 AM",
          opensDay: "today"
        }
      } else {
        // Closed, opens next Monday
        const daysUntilMonday = day === 0 ? 1 : 8 - day
        return {
          status: "Closed",
          opensAt: "9:00 AM",
          opensDay: daysUntilMonday === 1 ? "tomorrow" : `in ${daysUntilMonday} days`
        }
      }
    } else {
      // Weekend - closed
      const daysUntilMonday = day === 0 ? 1 : 8 - day
      return {
        status: "Closed",
        opensAt: "9:00 AM",
        opensDay: daysUntilMonday === 1 ? "tomorrow" : `in ${daysUntilMonday} days`
      }
    }
  }

  const getDayStatus = (dayIndex: number) => {
    // dayIndex: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    if (dayIndex >= 1 && dayIndex <= 5) {
      return {
        open: true,
        hours: "9:00 AM – 5:00 PM"
      }
    } else {
      return {
        open: false,
        hours: "Closed"
      }
    }
  }

  const getDayName = (dayIndex: number) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return days[dayIndex]
  }

  const currentStatus = getCurrentStatus()

  // Dorm rates data
  const dormRates = [
    { type: "Single Bedroom with kitchen", annual: "20,956 dollars", semester: "10,478 dollars" },
    { type: "Double bedroom with kitchen", annual: "20,120 dollars", semester: "10,060 dollars" },
    { type: "Triple bedroom with kitchen", annual: "19,280 dollars", semester: "9,640 dollars" },
    { type: "Studio Double with kitchen", annual: "20,120 dollars", semester: "10,060 dollars" },
    { type: "Studio Triple or Duplex Triple with kitchen", annual: "19,280 dollars", semester: "9,640 dollars" },
    { type: "Duplex Quad with kitchen", annual: "18,456 dollars", semester: "9,228 dollars" },
    { type: "Single Bedroom", annual: "19,928 dollars", semester: "9,964 dollars" },
    { type: "Double Bedroom", annual: "19,102 dollars", semester: "9,551 dollars" },
    { type: "Triple Bedroom", annual: "18,286 dollars", semester: "9,143 dollars" },
    { type: "Quad Bedroom", annual: "17,480 dollars", semester: "8,740 dollars" },
    { type: "5 person", annual: "17,480 dollars", semester: "8,740 dollars" },
    { type: "6 person", annual: "17,480 dollars", semester: "8,740 dollars" },
    { type: "8 person", annual: "16,668 dollars", semester: "8,334 dollars" },
  ]

  const filteredDormRates = dormRates.filter((rate) =>
    rate.type.toLowerCase().includes(priceSearchTerm.toLowerCase())
  )

  const openMediaModal = (src: string, type: "image" | "video") => {
    setCurrentMedia({ src, type })
    setMediaModalOpen(true)
  }

  const closeMediaModal = () => {
    setMediaModalOpen(false)
    setCurrentMedia(null)
  }

  const openLaundryModal = () => {
    setLaundryModalOpen(true)
  }

  const closeLaundryModal = () => {
    setLaundryModalOpen(false)
  }

  const openAcModal = () => {
    setAcModalOpen(true)
  }

  const closeAcModal = () => {
    setAcModalOpen(false)
  }

  const openLockModal = () => {
    setLockModalOpen(true)
  }

  const closeLockModal = () => {
    setLockModalOpen(false)
  }

  const openThermostatModal = () => {
    setThermostatModalOpen(true)
  }

  const closeThermostatModal = () => {
    setThermostatModalOpen(false)
  }

  const openPriceModal = () => {
    setPriceModalOpen(true)
  }

  const closePriceModal = () => {
    setPriceModalOpen(false)
    setPriceSearchTerm("") // Reset search when closing
  }

  const openFloorPlanModal = () => {
    setFloorPlanModalOpen(true)
  }

  const closeFloorPlanModal = () => {
    setFloorPlanModalOpen(false)
  }

  const openLockIdeaModal = () => {
    setLockIdeaModalOpen(true)
  }

  const closeLockIdeaModal = () => {
    setLockIdeaModalOpen(false)
  }

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lockIdeaModalOpen) {
          closeLockIdeaModal()
        } else if (floorPlanModalOpen) {
          closeFloorPlanModal()
        } else if (priceModalOpen) {
          closePriceModal()
        } else if (thermostatModalOpen) {
          closeThermostatModal()
        } else if (lockModalOpen) {
          closeLockModal()
        } else if (acModalOpen) {
          closeAcModal()
        } else if (laundryModalOpen) {
          closeLaundryModal()
        } else if (mediaModalOpen) {
          closeMediaModal()
        }
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [mediaModalOpen, laundryModalOpen, acModalOpen, lockModalOpen, thermostatModalOpen, priceModalOpen, floorPlanModalOpen, lockIdeaModalOpen])

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (mediaModalOpen || laundryModalOpen || acModalOpen || lockModalOpen || thermostatModalOpen || priceModalOpen || floorPlanModalOpen || lockIdeaModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mediaModalOpen, laundryModalOpen, acModalOpen, lockModalOpen, thermostatModalOpen, priceModalOpen, floorPlanModalOpen, lockIdeaModalOpen])

  return (
    <main
      className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-16 sm:px-6 lg:px-10 lg:pt-20 bg-white text-black antialiased"
      role="main"
      aria-label="Room details page"
    >
      {/* TOP PART (text + beds/bath + pill buttons) */}
      <section className="space-y-6">
        <header className="max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Room 201
          </h1>
          <p className="mt-2 text-lg text-black/80 sm:text-xl">
            Nathan R. Miller Hall • Suffolk University
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-black/5 px-4 py-2 font-semibold text-black">
            👥 Double
          </span>
          <span className="rounded-full bg-black/5 px-4 py-2 font-semibold text-black">
            🛏️ 2 Beds
          </span>
          <span className="rounded-full bg-black/5 px-4 py-2 font-semibold text-black">
            🚿 Semi Private Bathroom
          </span>
        </div>
      </section>

      {/* MEDIA STRIP */}
      <section>
        <div className="overflow-x-auto overflow-y-hidden -webkit-overflow-scrolling-touch scrollbar-gutter-stable-both-edges w-full px-3 py-3">
          <div className="flex w-max items-start gap-3" aria-label="Scrollable media tiles">
            {/* 1) PLAQUE PHOTO */}
            <button
              type="button"
              onClick={() =>
                openMediaModal(
                  "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg",
                  "image"
                )
              }
              className="relative h-[420px] w-[280px] overflow-hidden rounded-[28px] shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-black hover:opacity-90 transition-opacity"
              aria-label="Open plaque photo"
              title="Open plaque photo"
            >
              <Image
                src="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg"
                alt="Room 201 plaque photo"
                fill
                className="object-cover"
                sizes="280px"
              />
            </button>

            {/* 2) AMENITIES GROUP */}
            <section className="grid h-[420px] w-[420px] grid-cols-2 gap-6" aria-label="Amenities">
              <button
                onClick={openLaundryModal}
                type="button"
                className="grid h-[198px] w-[198px] place-items-center rounded-[28px] bg-[#2e3240] text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-white hover:bg-[#3a3f50] transition-colors"
                aria-label="Laundry"
                title="View laundry information"
              >
                <svg className="h-24 w-24" viewBox="0 0 120 120" fill="none" aria-hidden="true">
                  <rect x="20" y="16" width="80" height="88" rx="10" stroke="white" strokeWidth="7" />
                  <rect x="30" y="26" width="22" height="14" rx="3" stroke="white" strokeWidth="7" />
                  <circle cx="82" cy="33" r="5" fill="white" />
                  <circle cx="60" cy="66" r="22" stroke="white" strokeWidth="7" />
                  <path d="M48 66c6-10 18-10 24 0" stroke="white" strokeWidth="7" strokeLinecap="round" />
                  <path d="M44 100h32" stroke="white" strokeWidth="7" strokeLinecap="round" />
                </svg>
              </button>

              <button
                onClick={openFloorPlanModal}
                type="button"
                className="grid h-[198px] w-[198px] place-items-center rounded-[28px] bg-[#2e3240] text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-white hover:bg-[#3a3f50] transition-colors"
                aria-label="Floor Plan"
                title="View floor plan"
              >
                <svg className="h-24 w-24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 4h16v16H4V4z" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 8h16" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M4 12h16" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M4 16h16" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M8 4v16" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M16 4v16" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M4 4l4 3 4-3 4 3 4-3" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div
                className="col-span-2 flex h-[198px] items-center justify-center rounded-[28px] bg-[#2e3240] px-10 text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]"
                aria-label="Carpet floor"
                role="img"
              >
                <div className="flex items-center gap-8">
                  <svg className="h-20 w-20" viewBox="0 0 120 120" fill="none" aria-hidden="true">
                    <rect x="16" y="16" width="88" height="88" rx="8" stroke="white" strokeWidth="7" />
                    <path d="M28 92l64-64" stroke="white" strokeWidth="7" strokeLinecap="round" />
                    <path d="M44 96l56-56" stroke="white" strokeWidth="7" strokeLinecap="round" opacity="0.9" />
                    <path d="M20 60l40-40" stroke="white" strokeWidth="7" strokeLinecap="round" opacity="0.9" />
                  </svg>
                  <div className="text-[46px] font-extrabold leading-[1.05]">
                    <div>Carpet</div>
                    <div>Floor</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3) VIDEO TILE (bedroom #1) */}
            <button
              type="button"
              onClick={() =>
                openMediaModal(
                  "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-bedroom-9-sec-empty-imp-1.mp4",
                  "video"
                )
              }
              className="relative h-[420px] w-[300px] overflow-hidden rounded-[28px] shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-black hover:opacity-90 transition-opacity group"
              aria-label="Play bedroom video 1"
              title="Play bedroom video 1"
              onMouseEnter={(e) => {
                const video = e.currentTarget.querySelector("video") as HTMLVideoElement
                if (video) {
                  video.play().catch(() => {})
                }
              }}
              onMouseLeave={(e) => {
                const video = e.currentTarget.querySelector("video") as HTMLVideoElement
                if (video) {
                  video.pause()
                }
              }}
            >
              <video
                className="w-full h-full object-cover"
                muted
                playsInline
                loop
                preload="metadata"
                aria-hidden="true"
              >
                <source
                  src="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-bedroom-9-sec-empty-imp-1.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 grid place-items-center bg-black/10 group-hover:opacity-0 transition-opacity">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white/90">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                    <path d="M8 5v14l12-7z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </button>

            {/* 4) LOCK / AC / PRICE GROUP */}
            <section className="grid h-[420px] w-[520px] grid-cols-2 gap-6" aria-label="Features and price">
              <button
                onClick={openLockModal}
                type="button"
                className="grid h-[198px] w-[248px] place-items-center rounded-[28px] bg-[#2e3240] text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-white hover:bg-[#3a3f50] transition-colors"
                aria-label="Lock feature"
                title="View lock information"
              >
                <svg className="h-24 w-24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                  <rect x="6" y="11" width="12" height="10" rx="2" stroke="white" strokeWidth="2.4" />
                  <path d="M12 15v3" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>

              <button
                onClick={openAcModal}
                type="button"
                className="grid h-[198px] w-[248px] place-items-center rounded-[28px] bg-[#2e3240] text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-white hover:bg-[#3a3f50] transition-colors"
                aria-label="Air conditioning"
                title="View air conditioning information"
              >
                <div className="text-[72px] font-extrabold tracking-tight leading-none">AC</div>
              </button>

              <button
                onClick={openPriceModal}
                type="button"
                className="col-span-2 flex h-[198px] items-center justify-center rounded-[28px] bg-[#2e3240] px-10 text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-white hover:bg-[#3a3f50] transition-colors"
                aria-label="Annual price"
                title="View room rates"
              >
                <div className="flex items-center gap-10">
                  <div className="text-[96px] font-extrabold leading-none">$</div>
                  <div className="text-[44px] font-extrabold leading-tight">
                    <div>$19,102</div>
                    <div>Annual</div>
                  </div>
                </div>
              </button>
            </section>

            {/* 5) VIDEO TILE (bedroom #2) */}
            <button
              type="button"
              onClick={() =>
                openMediaModal(
                  "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-bedroom-21-sec-empty-imp-2.mp4",
                  "video"
                )
              }
              className="relative h-[420px] w-[300px] overflow-hidden rounded-[28px] shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-black hover:opacity-90 transition-opacity group"
              aria-label="Play bedroom video 2"
              title="Play bedroom video 2"
              onMouseEnter={(e) => {
                const video = e.currentTarget.querySelector("video") as HTMLVideoElement
                if (video) {
                  video.play().catch(() => {})
                }
              }}
              onMouseLeave={(e) => {
                const video = e.currentTarget.querySelector("video") as HTMLVideoElement
                if (video) {
                  video.pause()
                }
              }}
            >
              <video
                className="w-full h-full object-cover"
                muted
                playsInline
                loop
                preload="metadata"
                aria-hidden="true"
              >
                <source
                  src="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-bedroom-21-sec-empty-imp-2.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 grid place-items-center bg-black/10 group-hover:opacity-0 transition-opacity">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white/90">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                    <path d="M8 5v14l12-7z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </button>

            {/* 6) SOCIAL GROUP */}
            <section className="grid h-[420px] w-[420px] grid-cols-2 gap-6" aria-label="Social and contact">
              <button
                onClick={openThermostatModal}
                type="button"
                className="grid h-[198px] w-[198px] place-items-center rounded-[28px] bg-[#2e3240] text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-black hover:bg-[#3a3f50] transition-colors"
                aria-label="Personal thermostat"
                title="View personal thermostat information"
              >
                <svg className="h-20 w-20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M14 14.76V5a2 2 0 1 0-4 0v9.76a4 4 0 1 0 4 0Z"
                    stroke="white"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M12 9v3" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>

              <a
                href="https://suffolk.campuslabs.com/engage/organization/millerhall"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-[198px] w-[198px] place-items-center rounded-[28px] bg-[#2e3240] text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-black hover:bg-[#3a3f50] transition-colors"
                aria-label="Suffolk University"
                title="Suffolk University"
              >
                <div className="text-[64px] font-extrabold tracking-tight">SU</div>
              </a>

              <a
                href="https://www.instagram.com/suffolkreslife/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-[198px] w-[198px] place-items-center rounded-[28px] bg-[#2e3240] text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-black hover:bg-[#3a3f50] transition-colors"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg className="h-24 w-24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="5" y="5" width="14" height="14" rx="4" stroke="white" strokeWidth="2.4" />
                  <circle cx="12" cy="12" r="3.5" stroke="white" strokeWidth="2.4" />
                  <circle cx="16.8" cy="7.2" r="1" fill="white" />
                </svg>
              </a>

              <a
                href="https://www.suffolk.edu/student-life/housing-dining/on-campus-housing/residence-halls/nathan-r-miller-hall"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-[198px] w-[198px] place-items-center rounded-[28px] bg-[#2e3240] text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-black hover:bg-[#3a3f50] transition-colors"
                aria-label="Website"
                title="Miller Hall Website"
              >
                <svg className="h-24 w-24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2.4" />
                  <path d="M2 12h20" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="white" strokeWidth="2.4" />
                </svg>
              </a>
            </section>
          </div>
        </div>
      </section>

      {/* OVERVIEW/DIMENSIONS SECTION */}
      <section className="mt-8 px-4 sm:px-6 lg:px-10">
        <div className="max-w-3xl">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-black/20 mb-6">
            <button
              onClick={() => setActiveTab("Overview")}
              className={`pb-3 text-base font-medium transition-colors ${
                activeTab === "Overview"
                  ? "text-black border-b-2 border-black"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("Dimensions")}
              className={`pb-3 text-base font-medium transition-colors ${
                activeTab === "Dimensions"
                  ? "text-black border-b-2 border-black"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Dimensions
            </button>
      </div>

          {/* Overview Tab Content */}
          {activeTab === "Overview" && (
            <div className="space-y-4">
              {/* Room Number */}
              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
                <p className="text-base text-black">Room 201</p>
              </div>

              {/* Student Verified */}
              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                <p className="text-base text-black">Student Verified</p>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 mt-0.5 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              <div>
                  <p className="text-base text-black">10 Somerset St, Boston, MA 02108</p>
                  <p className="text-sm text-black/60 mt-1">Nathan R. Miller Hall, Floor 2</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href="tel:6173053260" className="text-base text-black hover:underline">
                  617-305-3260
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16v12H4V6z" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
                <a href="mailto:reslife@suffolk.edu" className="text-base text-black hover:underline">
                  reslife@suffolk.edu
                </a>
              </div>

              {/* Hours Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <div className="flex items-center gap-2 w-full">
                    <span className={`text-base font-medium ${currentStatus.status === "Open" ? "text-green-600" : "text-black"}`}>
                      {currentStatus.status}
                    </span>
                    <span className="text-base text-black/40">·</span>
                    {currentStatus.status === "Open" ? (
                      <span className="text-base text-black">
                        Closes {currentStatus.closesAt} {currentStatus.closesDay}
                      </span>
                    ) : (
                      <span className="text-base text-black">
                        Opens {currentStatus.opensAt} {currentStatus.opensDay}
                      </span>
                    )}
                    <button
                      onClick={() => setHoursExpanded(!hoursExpanded)}
                      className="text-black/60 hover:text-black transition-colors"
                      aria-label="Toggle hours"
                    >
                      <svg
                        className={`h-4 w-4 transition-transform ${hoursExpanded ? "rotate-180" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </div>
                </div>

                {hoursExpanded && (
                  <div className="ml-8 space-y-1 text-sm">
                    {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => {
                      const dayStatus = getDayStatus(dayIndex)
                      const dayName = getDayName(dayIndex)
                      const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                      return (
                        <div key={dayIndex} className="flex justify-between">
                          <span className="text-black/80">{fullDayNames[dayIndex]}</span>
                          {dayStatus.open ? (
                            <span className="text-black/80">{dayStatus.hours}</span>
                          ) : (
                            <span className="text-red-600 font-medium">Closed</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Suggest an edit button */}
              <button
                type="button"
                className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-sm font-medium"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Suggest an edit
              </button>
            </div>
          )}

          {/* Dimensions Tab Content */}
          {activeTab === "Dimensions" && (
            <div className="py-4">
              <p className="text-base text-black/80">Room dimensions information will be displayed here.</p>
            </div>
          )}
        </div>
      </section>

      {/* SHARE SPACE SECTION - INDEPENDENT FROM MEDIA STRIP ABOVE */}
      <section className="mt-8">
        <div className="px-4 sm:px-6 lg:px-10 mb-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Shared Space
            </h2>
          </div>
        </div>
        {/* Share Space Media Strip - Independent section, changes here won't affect the media strip above */}
        <div className="overflow-x-auto overflow-y-hidden -webkit-overflow-scrolling-touch scrollbar-gutter-stable-both-edges w-full px-3 py-3">
          <div className="flex w-max items-start gap-3" aria-label="Share Space scrollable media tiles">
            {/* Shared Bathroom, Room 202, and Adjoining Room */}
            <div className="flex flex-col gap-3">
              {/* Top Row: Shared Bathroom and Room 202 */}
              <div className="flex gap-3">
                {/* 1) Shared Bathroom Block */}
                <div className="flex h-[198px] w-[248px] items-center gap-4 rounded-[28px] bg-[#2e3240] px-6 text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
                  <svg className="h-20 w-20 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: 'scaleX(-1)' }}>
                    <rect x="5" y="4" width="14" height="16" rx="2" stroke="white" strokeWidth="2.4" />
                    <path d="M5 8h14" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                    <path d="M8 4V2a1 1 0 0 1 1-1h6a1 1 0 0 1 1v2" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                    <circle cx="12" cy="14" r="2.5" stroke="white" strokeWidth="2.4" />
                    <path d="M8 18h8" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                    <path d="M6 20h12" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                  <div className="text-[18px] font-extrabold leading-tight">
                    <div>Shared</div>
                    <div>Bathroom</div>
                  </div>
                </div>

                {/* 2) Room 202 Block */}
                <a
                  href="/dorms/miller-hall/room/202"
                  className="grid h-[198px] w-[198px] place-items-center rounded-[28px] bg-[#2e3240] text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-white hover:bg-[#3a3f50] transition-colors"
                  aria-label="Room 202"
                  title="View Room 202"
                >
                  <svg className="h-24 w-24 mb-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="6" y="8" width="12" height="12" rx="2" stroke="white" strokeWidth="2.4" />
                    <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                    <circle cx="12" cy="14" r="1.5" fill="white" />
                  </svg>
                  <div className="text-center text-[18px] font-extrabold leading-tight">
                    Room<br />202
                  </div>
                </a>
              </div>

              {/* 3) Adjoining Room Block */}
              <div className="flex h-[198px] w-[248px] items-center gap-4 rounded-[28px] bg-[#2e3240] px-6 text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
                <svg className="h-20 w-20 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2.4" />
                  <path d="M9 3v18" stroke="white" strokeWidth="2.4" />
                  <circle cx="12" cy="12" r="1.5" fill="white" />
                </svg>
                <div className="text-[18px] font-extrabold leading-tight">
                  <div>Adjoining</div>
                  <div>Room</div>
                </div>
              </div>
            </div>

            {/* 3) First Bathroom Video */}
            <button
              type="button"
              onClick={() =>
                openMediaModal(
                  "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-10-sec-bathroom-messy-imp-4.mp4",
                  "video"
                )
              }
              className="relative h-[420px] w-[300px] overflow-hidden rounded-[28px] shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-black hover:opacity-90 transition-opacity group"
              aria-label="Play bathroom video 1"
              title="Play bathroom video 1"
              onMouseEnter={(e) => {
                const video = e.currentTarget.querySelector("video") as HTMLVideoElement
                if (video) {
                  video.play().catch(() => {})
                }
              }}
              onMouseLeave={(e) => {
                const video = e.currentTarget.querySelector("video") as HTMLVideoElement
                if (video) {
                  video.pause()
                }
              }}
            >
              <video
                className="w-full h-full object-cover"
                muted
                playsInline
                loop
                preload="metadata"
                aria-hidden="true"
              >
                <source
                  src="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-10-sec-bathroom-messy-imp-4.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 grid place-items-center bg-black/10 group-hover:opacity-0 transition-opacity">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white/90">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                    <path d="M8 5v14l12-7z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </button>

            {/* 2) Second Bathroom Video */}
            <button
              type="button"
              onClick={() =>
                openMediaModal(
                  "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-bathroom-18-sec-messy-imp-5.mp4",
                  "video"
                )
              }
              className="relative h-[420px] w-[300px] overflow-hidden rounded-[28px] shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-black hover:opacity-90 transition-opacity group"
              aria-label="Play bathroom video 2"
              title="Play bathroom video 2"
              onMouseEnter={(e) => {
                const video = e.currentTarget.querySelector("video") as HTMLVideoElement
                if (video) {
                  video.play().catch(() => {})
                }
              }}
              onMouseLeave={(e) => {
                const video = e.currentTarget.querySelector("video") as HTMLVideoElement
                if (video) {
                  video.pause()
                }
              }}
            >
              <video
                className="w-full h-full object-cover"
                muted
                playsInline
                loop
                preload="metadata"
                aria-hidden="true"
              >
                <source
                  src="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-bathroom-18-sec-messy-imp-5.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 grid place-items-center bg-black/10 group-hover:opacity-0 transition-opacity">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white/90">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                    <path d="M8 5v14l12-7z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>
        {/* Share Space Buttons */}
        <div className="overflow-x-auto overflow-y-hidden -webkit-overflow-scrolling-touch scrollbar-gutter-stable-both-edges w-full px-3 py-3">
          <div className="flex w-max items-start gap-3" aria-label="Share Space tiles">
            {/* 1) Shared Bathroom */}
            <div className="flex h-[198px] w-[248px] items-center gap-4 rounded-[28px] bg-[#2e3240] px-6 text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
              <svg className="h-20 w-20 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="4" y="6" width="16" height="14" rx="2" stroke="white" strokeWidth="2.4" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="12" cy="13" r="2" stroke="white" strokeWidth="2.4" />
                <path d="M8 20h8" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              <div className="text-[18px] font-extrabold leading-tight">
                <div>Shared</div>
                <div>Bathroom</div>
              </div>
            </div>

            {/* 2) Adjoining Room */}
            <div className="flex h-[198px] w-[248px] items-center gap-4 rounded-[28px] bg-[#2e3240] px-6 text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
              <svg className="h-20 w-20 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="5" width="8" height="14" rx="1" stroke="white" strokeWidth="2.4" />
                <rect x="13" y="5" width="8" height="14" rx="1" stroke="white" strokeWidth="2.4" />
                <path d="M6 12h2M16 12h2" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              <div className="text-[18px] font-extrabold leading-tight">
                <div>Adjoining</div>
                <div>Room</div>
              </div>
            </div>

            {/* 3) Room 202 Button */}
            <a
              href="/dorms/miller-hall/room/202"
              className="grid h-[198px] w-[198px] place-items-center rounded-[28px] bg-[#2e3240] text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-white hover:bg-[#3a3f50] transition-colors"
              aria-label="Room 202"
              title="View Room 202"
            >
              <svg className="h-24 w-24 mb-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="6" y="8" width="12" height="12" rx="2" stroke="white" strokeWidth="2.4" />
                <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="12" cy="14" r="1.5" fill="white" />
              </svg>
              <div className="text-center text-[18px] font-extrabold leading-tight">
                Room<br />202
              </div>
            </a>

            {/* 4) Floor Plan Button */}
            <button
              onClick={openFloorPlanModal}
              type="button"
              className="grid h-[198px] w-[198px] place-items-center rounded-[28px] bg-[#2e3240] text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-white hover:bg-[#3a3f50] transition-colors"
              aria-label="Floor Plan"
              title="View floor plan"
            >
              <svg className="h-24 w-24 mb-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 4h16v16H4V4z" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 8h16" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M4 12h16" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M4 16h16" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M8 4v16" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M16 4v16" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M4 4l4 3 4-3 4 3 4-3" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-center text-[18px] font-extrabold leading-tight">
                Floor<br />Plan
              </div>
            </button>

            {/* 5) First Bathroom Video */}
            <button
              type="button"
              onClick={() =>
                openMediaModal(
                  "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-10-sec-bathroom-messy-imp-4.mp4",
                  "video"
                )
              }
              className="relative h-[420px] w-[300px] overflow-hidden rounded-[28px] shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-black hover:opacity-90 transition-opacity group"
              aria-label="Play bathroom video 1"
              title="Play bathroom video 1"
              onMouseEnter={(e) => {
                const video = e.currentTarget.querySelector("video") as HTMLVideoElement
                if (video) {
                  video.play().catch(() => {})
                }
              }}
              onMouseLeave={(e) => {
                const video = e.currentTarget.querySelector("video") as HTMLVideoElement
                if (video) {
                  video.pause()
                }
              }}
            >
              <video
                className="w-full h-full object-cover"
                muted
                playsInline
                loop
                preload="metadata"
                aria-hidden="true"
              >
                <source
                  src="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-10-sec-bathroom-messy-imp-4.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 grid place-items-center bg-black/10 group-hover:opacity-0 transition-opacity">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white/90">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                    <path d="M8 5v14l12-7z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </button>

            {/* 6) Lock Idea Button */}
            <button
              onClick={openLockIdeaModal}
              type="button"
              className="grid h-[198px] w-[198px] place-items-center rounded-[28px] bg-[#2e3240] text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-white hover:bg-[#3a3f50] transition-colors"
              aria-label="Lock idea"
              title="View lock idea"
            >
              <svg className="h-20 w-20 mb-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2v2M6 6l1.4 1.4M18 6l-1.4 1.4M12 10v4M8 14h8" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="12" cy="18" r="4" stroke="white" strokeWidth="2.4" />
                <path d="M12 14v4" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              <div className="text-center text-[18px] font-extrabold leading-tight">
                Lock<br />idea
              </div>
            </button>

            {/* 7) Other Rooms Button */}
            <button
              type="button"
              className="grid h-[198px] w-[198px] place-items-center rounded-[28px] bg-[#2e3240] text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-white hover:bg-[#3a3f50] transition-colors"
              aria-label="Other Rooms"
              title="Other Rooms"
            >
              <svg className="h-24 w-24 mb-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 3h8v8H3z" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13 3h8v8h-8z" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 13h8v8H3z" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13 13h8v8h-8z" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-center text-[18px] font-extrabold leading-tight">
                Other<br />Rooms
              </div>
            </button>

            {/* 8) Locks on both Doors */}
            <div className="flex h-[198px] w-[248px] items-center gap-4 rounded-[28px] bg-[#2e3240] px-6 text-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
              <svg className="h-20 w-20 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2.4" />
                <path d="M9 3v18" stroke="white" strokeWidth="2.4" />
                <circle cx="12" cy="12" r="1.5" fill="white" />
              </svg>
              <div className="text-[18px] font-extrabold leading-tight">
                <div>Locks on</div>
                <div>both Doors</div>
              </div>
            </div>

            {/* 9) Second Bathroom Video */}
            <button
              type="button"
              onClick={() =>
                openMediaModal(
                  "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-bathroom-18-sec-messy-imp-5.mp4",
                  "video"
                )
              }
              className="relative h-[420px] w-[300px] overflow-hidden rounded-[28px] shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-black hover:opacity-90 transition-opacity group"
              aria-label="Play bathroom video 2"
              title="Play bathroom video 2"
              onMouseEnter={(e) => {
                const video = e.currentTarget.querySelector("video") as HTMLVideoElement
                if (video) {
                  video.play().catch(() => {})
                }
              }}
              onMouseLeave={(e) => {
                const video = e.currentTarget.querySelector("video") as HTMLVideoElement
                if (video) {
                  video.pause()
                }
              }}
            >
              <video
                className="w-full h-full object-cover"
                muted
                playsInline
                loop
                preload="metadata"
                aria-hidden="true"
              >
                <source
                  src="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-bathroom-18-sec-messy-imp-5.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 grid place-items-center bg-black/10 group-hover:opacity-0 transition-opacity">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white/90">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                    <path d="M8 5v14l12-7z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* MEDIA MODAL */}
      {mediaModalOpen && currentMedia && (
        <div
          className="fixed inset-0 z-[100]"
          role="dialog"
          aria-modal="true"
          aria-label="Media viewer"
        >
          <div className="absolute inset-0 bg-black/70" onClick={closeMediaModal}></div>
          <div className="relative mx-auto mt-8 w-[min(1000px,92vw)] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-3 px-2 pb-3">
              <div className="text-sm font-semibold text-black">Media</div>
              <button
                type="button"
                onClick={closeMediaModal}
                className="rounded-xl border border-black/20 px-3 py-2 text-sm font-semibold hover:bg-black/5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black"
                aria-label="Close media viewer"
              >
                Close
              </button>
            </div>
            {currentMedia.type === "image" ? (
              <Image
                src={currentMedia.src}
                alt="Expanded photo"
                width={1000}
                height={800}
                className="w-full max-h-[65vh] rounded-xl object-contain sm:max-h-[70vh] md:max-h-[75vh] lg:max-h-[80vh]"
              />
            ) : (
              <video
                src={currentMedia.src}
                className="w-full max-h-[65vh] rounded-xl bg-black sm:max-h-[70vh] md:max-h-[75vh] lg:max-h-[80vh]"
                controls
                playsInline
                autoPlay
              />
            )}
          </div>
        </div>
      )}

      {/* LAUNDRY MODAL */}
      {laundryModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-8"
          role="dialog"
          aria-modal="true"
          aria-label="Laundry information"
        >
          <div className="absolute inset-0 bg-black/70" onClick={closeLaundryModal}></div>
          <div className="relative max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-3 px-2 pb-3">
              <div className="text-sm font-semibold text-black">Laundry Website</div>
              <button
                type="button"
                onClick={closeLaundryModal}
                className="rounded-xl border border-black/20 px-3 py-2 text-sm font-semibold hover:bg-black/5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black"
                aria-label="Close laundry viewer"
              >
                Close
              </button>
            </div>
            <div className="px-2 pb-4">
              <img
                src="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/dorm-room-page/sumillerdormlaundrywebsite.png"
                alt="Miller Hall Laundry Website"
                className="h-auto max-h-[80vh] max-w-full rounded-xl object-contain mb-4 block"
              />
              <a
                href="https://laundryconnect.net/Suffolk_University/miller.html"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border-[3px] border-black bg-[#2e3240] px-6 py-4 text-center text-lg font-extrabold text-white hover:bg-[#3a3f50] transition-colors focus-visible:outline focus-visible:outline-4 focus-visible:outline-black"
              >
                Open Laundry Website
              </a>
            </div>
          </div>
        </div>
      )}

      {/* AC MODAL */}
      {acModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-8"
          role="dialog"
          aria-modal="true"
          aria-label="Air conditioning information"
        >
          <div className="absolute inset-0 bg-black/70" onClick={closeAcModal}></div>
          <div className="relative max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-3 px-2 pb-3">
              <div className="text-sm font-semibold text-black">Air Conditioning</div>
              <button
                type="button"
                onClick={closeAcModal}
                className="rounded-xl border border-black/20 px-3 py-2 text-sm font-semibold hover:bg-black/5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black"
                aria-label="Close AC viewer"
              >
                Close
              </button>
            </div>
            <div className="px-2 pb-4">
              <img
                src="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/dorm-room-page/sumillerdormac.png"
                alt="Miller Hall Air Conditioning"
                className="h-auto max-h-[80vh] max-w-full rounded-xl object-contain block"
              />
            </div>
          </div>
        </div>
      )}

      {/* LOCK MODAL */}
      {lockModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-8"
          role="dialog"
          aria-modal="true"
          aria-label="Lock information"
        >
          <div className="absolute inset-0 bg-black/70" onClick={closeLockModal}></div>
          <div className="relative max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-3 px-2 pb-3">
              <div className="text-sm font-semibold text-black">Always Lock Dorm</div>
              <button
                type="button"
                onClick={closeLockModal}
                className="rounded-xl border border-black/20 px-3 py-2 text-sm font-semibold hover:bg-black/5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black"
                aria-label="Close lock viewer"
              >
                Close
              </button>
            </div>
            <div className="px-2 pb-4">
              <img
                src="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/dorm-room-page/sumillerdormalwayslockdorm.png"
                alt="Miller Hall Lock Information"
                className="h-auto max-h-[80vh] max-w-full rounded-xl object-contain block"
              />
            </div>
          </div>
        </div>
      )}

      {/* PERSONAL THERMOSTAT MODAL */}
      {thermostatModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-8"
          role="dialog"
          aria-modal="true"
          aria-label="Personal thermostat information"
        >
          <div className="absolute inset-0 bg-black/70" onClick={closeThermostatModal}></div>
          <div className="relative max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-3 px-2 pb-3">
              <div className="text-sm font-semibold text-black">Personal Thermostat</div>
              <button
                type="button"
                onClick={closeThermostatModal}
                className="rounded-xl border border-black/20 px-3 py-2 text-sm font-semibold hover:bg-black/5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black"
                aria-label="Close thermostat viewer"
              >
                Close
              </button>
            </div>
            <div className="px-2 pb-4">
              <img
                src="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/dorm-room-page/sumillerdormpersonalthermostat.png"
                alt="Miller Hall Personal Thermostat"
                className="h-auto max-h-[80vh] max-w-full rounded-xl object-contain block"
              />
            </div>
          </div>
        </div>
      )}

      {/* PRICE MODAL */}
      {priceModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-8"
          role="dialog"
          aria-modal="true"
          aria-label="Room rates information"
        >
          <div className="absolute inset-0 bg-black/70" onClick={closePriceModal}></div>
          <div className="relative max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-3 px-2 pb-3">
              <div className="text-sm font-semibold text-black">Room Rates</div>
              <button
                type="button"
                onClick={closePriceModal}
                className="rounded-xl border border-black/20 px-3 py-2 text-sm font-semibold hover:bg-black/5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black"
                aria-label="Close price viewer"
              >
                Close
              </button>
            </div>
            <div className="px-2 pb-4">
              {/* Search Bar */}
              <div className="mb-4 max-w-[900px] mx-auto">
                <input
                  type="text"
                  value={priceSearchTerm}
                  onChange={(e) => setPriceSearchTerm(e.target.value)}
                  placeholder="Search room types (e.g., single, double, triple...)"
                  className="w-full px-4 py-3 rounded-xl border-2 border-black/20 focus:border-black focus:outline-none text-base font-medium"
                />
      </div>
      
              {/* Table */}
              <div className="grid grid-cols-[2.5fr_1fr_1fr] gap-[10px] p-5 max-w-[900px] mx-auto font-sans">
                <div className="font-bold bg-[#e8e8e8] p-[10px] border-b-2 border-black">Room Type</div>
                <div className="font-bold bg-[#e8e8e8] p-[10px] border-b-2 border-black">Annual Rate</div>
                <div className="font-bold bg-[#e8e8e8] p-[10px] border-b-2 border-black">Per Semester Rate</div>
                
                {filteredDormRates.length > 0 ? (
                  filteredDormRates.map((rate, index) => (
                    <React.Fragment key={index}>
                      <div className="p-2 border-b border-[#ccc] bg-white font-medium">
                        {rate.type}
                      </div>
                      <div className="p-2 border-b border-[#ccc] bg-white">
                        {rate.annual}
                      </div>
                      <div className="p-2 border-b border-[#ccc] bg-white">
                        {rate.semester}
                      </div>
                    </React.Fragment>
                  ))
                ) : (
                  <div className="col-span-3 p-4 text-center text-gray-500">
                    No room types found matching "{priceSearchTerm}"
                  </div>
                )}
              </div>
              <a
                href="https://www.suffolk.edu/about/directory/student-account-services/tuition-fees/tuition-rates-2025-26#:~:text=Suffolk%20University%20tuition%20rates%20for%20students%20for%20the%202025%20%2D%202026%20academic%20year."
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 rounded-xl border-[3px] border-black bg-[#2e3240] px-6 py-4 text-center text-lg font-extrabold text-white hover:bg-[#3a3f50] transition-colors focus-visible:outline focus-visible:outline-4 focus-visible:outline-black"
              >
                View Full Tuition Rates
              </a>
            </div>
          </div>
        </div>
      )}

      {/* FLOOR PLAN MODAL */}
      {floorPlanModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-4 pb-4"
          role="dialog"
          aria-modal="true"
          aria-label="Floor Plan"
        >
          <div className="absolute inset-0 bg-black/70" onClick={closeFloorPlanModal}></div>
          <div className="relative w-full max-w-[95vw] max-h-[95vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-3 px-2 pb-3 sticky top-0 bg-white z-10">
              <div className="text-sm font-semibold text-black">Floor Plan</div>
              <button
                type="button"
                onClick={closeFloorPlanModal}
                className="rounded-xl border border-black/20 px-3 py-2 text-sm font-semibold hover:bg-black/5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black"
                aria-label="Close floor plan viewer"
              >
                Close
              </button>
            </div>
            <div className="px-2 pb-4">
              <SplitViewFloorPlan
                floorPlanImage="https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/2floorplanmillersuffolk.jpg"
                floorPlanAlt="Room 201 Floor Plan Layout - 2nd Floor"
                roomNumber="201"
                roomCoordinates={{
                  x: 35,
                  y: 30,
                  width: 25,
                  height: 20
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* LOCK IDEA MODAL */}
      {lockIdeaModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-8"
          role="dialog"
          aria-modal="true"
          aria-label="Lock idea information"
        >
          <div className="absolute inset-0 bg-black/70" onClick={closeLockIdeaModal}></div>
          <div className="relative max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-3 px-2 pb-3">
              <div className="text-sm font-semibold text-black">Lock Idea</div>
              <button
                type="button"
                onClick={closeLockIdeaModal}
                className="rounded-xl border border-black/20 px-3 py-2 text-sm font-semibold hover:bg-black/5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black"
                aria-label="Close lock idea viewer"
              >
                Close
              </button>
            </div>
            <div className="px-2 pb-4">
              <p className="text-base text-black/80">Lock idea information will be displayed here.</p>
            </div>
      </div>
    </div>
      )}
    </main>
  )
}
