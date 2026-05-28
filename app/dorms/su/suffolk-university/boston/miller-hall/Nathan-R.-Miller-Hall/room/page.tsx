import Link from "next/link"
import { notFound } from "next/navigation"
import {
  getAllMillerHallRooms,
  getMillerHallRoomInfo,
  MILLER_HALL_BASE_PATH,
  MILLER_HALL_PLACEHOLDER_THUMBNAIL,
  MILLER_ROOMS_WITH_MEDIA,
} from "@/app/utils/millerHallMapping"
import { getMillerRoomsWithMedia } from "@/app/lib/discoverMillerRooms"

const NAVY = "#15284b"
const GOLD = "#bc912c"

export const dynamic = "force-dynamic"

type RoomTypeFilter = "single" | "double" | "quad" | "accessible" | "suite"

const TYPE_LABELS: Record<RoomTypeFilter, string> = {
  single: "Single",
  double: "Double",
  quad: "Quad",
  accessible: "Accessible",
  suite: "Suite",
}

function getRoomSubtitle(roomNumber: string): string {
  const info = getMillerHallRoomInfo(roomNumber)
  const beds =
    info.type === "quad" ? "4 Beds" :
    info.type === "single" ? "1 Bed" : "2 Beds"
  const suite = info.adjoiningRoom ? " · In Suite" : ""
  return `${beds}${suite}`
}

function isValidFilter(value: string | undefined): value is RoomTypeFilter {
  return value === "single" || value === "double" || value === "quad" || value === "accessible" || value === "suite"
}

function matchesType(roomNumber: string, type: RoomTypeFilter): boolean {
  const info = getMillerHallRoomInfo(roomNumber)
  if (type === "accessible") return !!info.isAccessible
  if (type === "suite") return !!info.adjoiningRoom
  if (type === "single") return info.type === "single"
  if (type === "quad") return info.type === "quad"
  // New rule: base room type pages include rooms regardless of suite/accessibility overlap.
  return info.type === "double"
}

interface PageProps {
  searchParams: Promise<{ type?: string }>
}

export default async function MillerHallRoomTypePage({ searchParams }: PageProps) {
  const { type } = await searchParams

  if (!isValidFilter(type)) {
    notFound()
  }

  const filteredRooms = getAllMillerHallRooms().filter((roomNumber) => matchesType(roomNumber, type))

  let discoveredRooms: Array<{ roomNumber: string; thumbnailUrl: string; title: string }> = []
  try {
    const { rooms } = await getMillerRoomsWithMedia()
    discoveredRooms = rooms
  } catch {
  }

  const roomsWithMedia = discoveredRooms.length > 0 ? discoveredRooms : MILLER_ROOMS_WITH_MEDIA
  const mediaMap = new Map(roomsWithMedia.map((r) => [r.roomNumber, r]))

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <div className="max-w-[900px] mx-auto px-4 sm:px-8 pb-10">
        <div className="flex items-center gap-2 pt-4 pb-2">
          <Link
            href={MILLER_HALL_BASE_PATH}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#f0f0f0] transition-colors"
            aria-label="Back to Miller Hall"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>

        <div className="px-[4px] pb-4">
          <h1 className="text-[24px] sm:text-[30px] font-semibold text-black tracking-[-0.6px]">
            {TYPE_LABELS[type]} Rooms
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#70757a] tracking-[-0.2px]">
            Nathan R. Miller Hall
          </p>
          <p className="text-[14px] text-[#868782] tracking-[-0.8px] mt-1">
            {filteredRooms.length} Rooms
          </p>
        </div>

        <div className="h-px bg-[#e5e5e5]" />

        {filteredRooms.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[17px] text-[#868782] tracking-[-0.5px]">No {TYPE_LABELS[type].toLowerCase()} rooms found.</p>
          </div>
        ) : (
          <div className="pt-2">
            {filteredRooms.map((roomNumber, i) => {
              const media = mediaMap.get(roomNumber)
              const hasRealMedia = !!media && media.thumbnailUrl !== MILLER_HALL_PLACEHOLDER_THUMBNAIL
              const badgeColor = hasRealMedia ? (i % 2 === 0 ? NAVY : GOLD) : "#c0392b"

              return (
                <div key={roomNumber}>
                  {i > 0 && <div className="h-px bg-[#e5e5e5]" />}
                  <Link href={`${MILLER_HALL_BASE_PATH}/room/${roomNumber}`}>
                    <div className="flex items-center gap-3 py-[13px] hover:bg-[#f0f0f0] -mx-2 px-2 rounded-[10px] transition-colors">
                      <div
                        className="relative flex-shrink-0 rounded-[8px] overflow-hidden flex items-center justify-center"
                        style={{ width: 64, height: 50, background: badgeColor }}
                      >
                        {hasRealMedia && media?.thumbnailUrl && (
                          <img
                            src={media.thumbnailUrl}
                            alt=""
                            className="absolute inset-0 object-cover size-full opacity-30 pointer-events-none"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <span className="relative z-10 text-[17px] font-black text-white tracking-[-0.1px]">
                          {roomNumber}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[17px] font-medium text-black tracking-[-0.5px]">
                          Room {roomNumber}
                        </p>
                        <p className="text-[14px] text-[#868782] tracking-[-0.5px]">
                          {TYPE_LABELS[type]} · {getRoomSubtitle(roomNumber)}
                          {hasRealMedia && (
                            <span className="ml-1.5 inline-flex items-center gap-0.5 text-[#15284b]">
                              ·{" "}
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="inline">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                              </svg>{" "}
                              Has Media
                            </span>
                          )}
                        </p>
                      </div>

                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c0c0c0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
