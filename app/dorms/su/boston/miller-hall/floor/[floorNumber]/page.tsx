import Link from "next/link"
import { notFound } from "next/navigation"
import {
  getAllMillerHallRooms,
  getMillerHallRoomInfo,
  getMillerHallFloorPlanUrl,
  MILLER_ROOMS_WITH_MEDIA,
} from "@/app/utils/millerHallMapping"
import { getMillerRoomsWithMedia } from "@/app/lib/discoverMillerRooms"

// ─── Constants ────────────────────────────────────────────────────────────────

const NAVY = "#15284b"
const GOLD = "#bc912c"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFloorFromRoom(roomNumber: string): number {
  if (roomNumber.length === 3) return parseInt(roomNumber.charAt(0))
  if (roomNumber.length === 4) return parseInt(roomNumber.substring(0, 2))
  return 1
}

function getRoomTypeName(roomNumber: string): string {
  const info = getMillerHallRoomInfo(roomNumber)
  if (info.isAccessible) return "Accessible"
  switch (info.type) {
    case "single": return "Single"
    case "quad":   return "Quad"
    default:       return "Double"
  }
}

function getRoomSubtitle(roomNumber: string): string {
  const info = getMillerHallRoomInfo(roomNumber)
  const beds =
    info.type === "quad"   ? "4 Beds" :
    info.type === "single" ? "1 Bed"  : "2 Beds"
  const suite = info.adjoiningRoom ? " · In Suite" : ""
  return `${beds}${suite}`
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ floorNumber: string }>
}

export default async function MillerHallFloorPage({ params }: PageProps) {
  const { floorNumber: floorParam } = await params
  const floorNumber = parseInt(floorParam)

  if (isNaN(floorNumber) || floorNumber < 1 || floorNumber > 19) {
    notFound()
  }

  const allRooms    = getAllMillerHallRooms()
  const floorRooms  = allRooms.filter(r => getFloorFromRoom(r) === floorNumber)
  const floorPlanUrl = getMillerHallFloorPlanUrl(floorNumber)
  const accentColor  = floorNumber % 2 === 0 ? GOLD : NAVY

  // Prefer Backblaze-discovered rooms with media; fallback to static list if discovery fails
  let discoveredRooms: Array<{ roomNumber: string; thumbnailUrl: string; title: string }> = []
  try {
    const { rooms } = await getMillerRoomsWithMedia()
    discoveredRooms = rooms
  } catch {
    // e.g. missing Backblaze env — use static list
  }
  const roomsWithMedia = discoveredRooms.length > 0 ? discoveredRooms : MILLER_ROOMS_WITH_MEDIA
  const mediaMap = new Map(roomsWithMedia.map((r) => [r.roomNumber, r]))

  return (
    <div className="min-h-screen bg-[#f8f8f8] w-full relative md:flex md:h-screen md:overflow-hidden">

      {/* ════════════════════════════════════════
          LEFT PANEL — Room list
      ════════════════════════════════════════ */}
      <div className="md:w-[600px] md:flex-shrink-0 md:overflow-y-auto md:h-screen md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">

        {/* Back navigation */}
        <div className="flex items-center p-3">
          <Link
            href="/dorms/su/boston/miller-hall"
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#f0f0f0] transition-colors"
            aria-label="Back to Miller Hall"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>

        {/* Floor header */}
        <div className="px-[14px] pb-4">
          <h1 className="text-[22px] md:text-[27px] font-medium text-black tracking-[-0.264px] leading-normal">
            Floor {floorNumber}
          </h1>
          <p className="text-[16px] md:text-[19px] font-normal text-[#70757a] tracking-[-0.192px] leading-normal">
            Nathan R. Miller Hall
          </p>
          <p className="text-[14px] text-[#868782] tracking-[-0.8px] mt-1">
            {floorRooms.length} Rooms
          </p>
        </div>

        <div className="mx-4 h-px bg-[#e5e5e5]" />

        {/* Room list */}
        {floorRooms.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-[17px] text-[#868782] tracking-[-0.5px]">No rooms on this floor.</p>
          </div>
        ) : (
          <div className="px-4 pb-10">
            {floorRooms.map((roomNumber, i) => {
              const media      = mediaMap.get(roomNumber)
              const typeName   = getRoomTypeName(roomNumber)
              const subtitle   = getRoomSubtitle(roomNumber)
              const badgeColor = media ? (i % 2 === 0 ? NAVY : GOLD) : "#c0392b"

              return (
                <div key={roomNumber}>
                  {i > 0 && <div className="h-px bg-[#e5e5e5]" />}
                  <Link href={`/dorms/su/boston/miller-hall/room/${roomNumber}`}>
                    <div className="flex items-center gap-3 py-[13px] hover:bg-[#f0f0f0] -mx-2 px-2 rounded-[10px] transition-colors">

                      {/* Room number badge */}
                      <div
                        className="relative flex-shrink-0 rounded-[8px] overflow-hidden flex items-center justify-center"
                        style={{ width: 64, height: 50, background: badgeColor }}
                      >
                        {media?.thumbnailUrl && (
                          <img
                            src={media.thumbnailUrl}
                            alt=""
                            className="absolute inset-0 object-cover size-full opacity-30 pointer-events-none"
                          />
                        )}
                        <span className="relative z-10 text-[17px] font-black text-white tracking-[-0.1px]">
                          {roomNumber}
                        </span>
                      </div>

                      {/* Room info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[17px] font-medium text-black tracking-[-0.5px]">
                          Room {roomNumber}
                        </p>
                        <p className="text-[14px] text-[#868782] tracking-[-0.5px]">
                          {typeName} · {subtitle}
                          {media && (
                            <span className="ml-1.5 inline-flex items-center gap-0.5 text-[#15284b]">
                              ·{" "}
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="inline">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                              </svg>{" "}
                              Has Media
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Chevron */}
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

        {/* Mobile — Floor Plan card */}
        <div className="md:hidden px-4 pb-10">
          <div className="h-px bg-[#e5e5e5] mb-4" />
          <h2 className="text-[18px] font-semibold text-black tracking-[-0.8px] mb-3">Floor Plan</h2>
          <div
            className="relative rounded-[15px] overflow-hidden flex items-end"
            style={{ background: accentColor, height: 220 }}
          >
            <img
              src={floorPlanUrl}
              alt={`Floor ${floorNumber} plan`}
              className="absolute inset-0 w-full h-full object-contain"
            />
            <p className="relative z-10 m-4 text-[17px] font-semibold text-white tracking-[-0.5px] drop-shadow">
              Floor {floorNumber} Plan
            </p>
          </div>
        </div>

      </div>

      {/* ════════════════════════════════════════
          RIGHT PANEL — Floor Plan (md+)
      ════════════════════════════════════════ */}
      <div className="hidden md:flex md:flex-1 md:h-screen md:overflow-hidden items-center justify-center relative bg-[#f8f8f8]">
        {/* Floor plan image */}
        <img
          src={floorPlanUrl}
          alt={`Floor ${floorNumber} plan`}
          className="absolute inset-0 w-full h-full object-contain"
        />

      </div>

    </div>
  )
}
