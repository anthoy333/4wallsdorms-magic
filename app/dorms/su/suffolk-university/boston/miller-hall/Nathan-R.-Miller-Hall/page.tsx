import Link from "next/link"
import {
  MILLER_HALL_BASE_PATH,
  MILLER_HALL_PLACEHOLDER_THUMBNAIL,
  getAllMillerHallRooms,
  getMillerHallFloorPlanUrl,
  getMillerHallRoomInfo,
} from "@/app/utils/millerHallMapping"
import { getMillerRoomsWithMedia } from "@/app/lib/discoverMillerRooms"

// ─── Constants ────────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic"

const NAVY = "#15284b"
const GOLD = "#bc912c"

const FLOORS = Array.from({ length: 19 }, (_, i) => i + 1)

// Generic room photo used as subtle 50%-opacity background on every floor tile
const FLOOR_TILE_BG =
  "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+14/1407+%2B+1408/1407/sumiller1407-bedroom-empty-imp-2.jpg"

const EVEN_FLOOR_PLAN_URL = "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/floor+plans/su10west-floorplan-4-2.jpg"
const ODD_FLOOR_PLAN_URL = getMillerHallFloorPlanUrl(5)
const DOUBLE_ROOM_TYPE_BG =
  "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+14/1407+%2B+1408/1407/sumiller1407-bedroom-empty-imp-2.jpg"

const ACCESSIBLE_SVG_ICON = (
  <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
    <circle cx="12" cy="4" r="2" />
    <path d="M10 9h4v5h3l1 2H14v5h-2v-5H9l-1-2h2V9z" />
  </svg>
) as React.ReactNode

const SUITE_SVG_ICON = (
  <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
) as React.ReactNode

// ─── Room-selection logic ─────────────────────────────────────────────────────
//
// Rules:
//  1. "New Room Big" rectangles → rooms with ≥ 1 photo (thumbnailUrl set), max 2.
//  2. "New Room Small" grid cards → next rooms with photos in the list (2 cards).
//  3. "Latest Rooms Added" sidebar / mobile list → always exactly 4 entries.
//     Remaining rooms fill the slots; empty slots become placeholder cards.

const BIG_COUNT = 2
const SMALL_COUNT = 2
const LATEST_COUNT = 4

type RoomEntry = {
  roomNumber: string
  title: string
  thumbnailUrl: string
  floor: number
  type: "single" | "double" | "quad"
  isAccessible?: boolean
  adjoiningRoom?: string
}
type MaybeRoom = RoomEntry | null

function isPlaceholderPhoto(thumbnailUrl: string): boolean {
  if (!thumbnailUrl) return true
  if (thumbnailUrl === MILLER_HALL_PLACEHOLDER_THUMBNAIL) return true
  return false
}

function getRoomDisplayTitle(info: ReturnType<typeof getMillerHallRoomInfo>): string {
  if (info.isAccessible) return "Accessible"
  if (info.adjoiningRoom) return "Double Suite"
  if (info.type === "single") return "Single"
  if (info.type === "quad") return "Quad"
  return "Double"
}

function buildRoomSections(roomEntries: RoomEntry[]): {
  bigRooms: RoomEntry[]
  smallRooms: RoomEntry[]
  latestRooms: MaybeRoom[]
} {
  // Only rooms with a real room-interior photo (not the placeholder plaque) qualify for the photo-grid.
  const withPhotos = roomEntries.filter((r) => !isPlaceholderPhoto(r.thumbnailUrl))

  const bigRooms = withPhotos.slice(0, BIG_COUNT)
  const smallRooms = withPhotos.slice(BIG_COUNT, BIG_COUNT + SMALL_COUNT)

  // Everything that wasn't shown in the big/small grid feeds Latest Rooms Added.
  const usedSet = new Set([...bigRooms, ...smallRooms].map((r) => r.roomNumber))
  const remaining = roomEntries.filter((r) => !usedSet.has(r.roomNumber))

  // Keep the original behavior: if we ever have < LATEST_COUNT rooms, pad with null placeholders.
  const latestRooms: MaybeRoom[] = [
    ...remaining.slice(0, LATEST_COUNT),
    ...Array<null>(Math.max(0, LATEST_COUNT - remaining.length)).fill(null),
  ]

  return { bigRooms, smallRooms, latestRooms }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MillerHallPage() {
  const allRooms = getAllMillerHallRooms()

  let discoveredRooms: Array<{ roomNumber: string; thumbnailUrl: string }> = []
  try {
    const res = await getMillerRoomsWithMedia()
    discoveredRooms = res.rooms
  } catch {
    // If Backblaze discovery fails, we still render using placeholders.
  }

  const mediaMap = new Map(discoveredRooms.map((r) => [r.roomNumber, r]))

  const roomEntries: RoomEntry[] = allRooms.map((roomNumber) => {
    const info = getMillerHallRoomInfo(roomNumber)
    const discovered = mediaMap.get(roomNumber)
    const thumbnailUrl = discovered?.thumbnailUrl ?? MILLER_HALL_PLACEHOLDER_THUMBNAIL
    return {
      roomNumber,
      title: getRoomDisplayTitle(info),
      thumbnailUrl,
      floor: info.floor,
      type: info.type,
      isAccessible: info.isAccessible,
      adjoiningRoom: info.adjoiningRoom,
    }
  })

  const { bigRooms, smallRooms, latestRooms } = buildRoomSections(roomEntries)

  // Tablet (sm–lg): first big room is the large card; remaining big + smalls fill the column
  const featuredRoom = bigRooms[0] ?? null
  const tabletSmallRooms = [...bigRooms.slice(1), ...smallRooms].slice(0, 2)

  // Laptop (lg+): all big rooms stacked left, all small rooms stacked right
  const laptopBigRooms = bigRooms
  const laptopSmallRooms = smallRooms

  // Per-floor thumbnail: pick the first real room photo on that floor.
  const floorThumbUrlByFloor = new Map<number, string>()
  for (const floor of FLOORS) {
    const thumb = roomEntries.find((r) => r.floor === floor && !isPlaceholderPhoto(r.thumbnailUrl))
    if (thumb?.thumbnailUrl) floorThumbUrlByFloor.set(floor, thumb.thumbnailUrl)
  }

  const roomTypeCards = [
    {
      name: "Single",
      bedCount: 1,
      color: GOLD,
      svgIcon: null as React.ReactNode,
      match: (r: RoomEntry) => r.type === "single",
    },
    {
      name: "Double",
      bedCount: 2,
      color: NAVY,
      svgIcon: null as React.ReactNode,
      match: (r: RoomEntry) => r.type === "double",
    },
    {
      name: "Quad",
      bedCount: 4,
      color: GOLD,
      svgIcon: null as React.ReactNode,
      match: (r: RoomEntry) => r.type === "quad",
    },
    {
      name: "Accessible",
      bedCount: 1,
      color: NAVY,
      svgIcon: ACCESSIBLE_SVG_ICON,
      match: (r: RoomEntry) => !!r.isAccessible,
    },
    {
      name: "Suite",
      bedCount: 2,
      color: GOLD,
      svgIcon: SUITE_SVG_ICON,
      match: (r: RoomEntry) => !!r.adjoiningRoom,
    },
  ].map((card) => {
    const thumbRoom = roomEntries.find((r) => card.match(r) && !isPlaceholderPhoto(r.thumbnailUrl))
    return {
      ...card,
      thumbnail:
        card.name === "Double"
          ? DOUBLE_ROOM_TYPE_BG
          : (thumbRoom?.thumbnailUrl ?? null),
    }
  })

  return (
    <div className="min-h-screen bg-background">

      {/* ════════════════════════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b border-[#e5e5e5]">
        <div
          className="absolute inset-0 bg-[rgba(217,217,217,0.25)]"
          style={{ backdropFilter: "blur(4px)" }}
        />
        <div className="relative px-[30px] lg:px-[60px] pt-[55px] pb-5 sm:pt-[60px] sm:pb-6 flex items-start gap-4">
          {/* Building thumbnail */}
          <div
            className="relative flex-shrink-0 rounded-[5px] overflow-hidden bg-[#d9d9d9]"
            style={{ width: 97, height: 99 }}
          >
            <img
              src={FLOOR_TILE_BG}
              alt="Miller Hall"
              className="absolute inset-0 size-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-[22px] sm:text-[30px] font-bold text-black tracking-[-0.8px] leading-tight">
              Miller Hall
            </h1>
            <p className="text-[14px] sm:text-[19px] text-black opacity-40 tracking-[-0.24px] mt-0.5">
              Nathan R. Miller Hall
            </p>
            <p className="text-[13px] sm:text-[15px] text-[#868782] tracking-[-0.8px] mt-1 mb-3">
              {allRooms.length} Rooms
            </p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════════════════════ */}
      <div className="px-4 sm:px-[30px] lg:px-[60px]">

        {/* ── BROWSE BY FLOOR ── */}
        <section className="pt-6 pb-6">
          <h2 className="text-[20px] sm:text-[25px] font-semibold text-black tracking-[-0.8px] mb-4">
            Browse by Floor
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {FLOORS.map((floor) => (
              <Link
                key={floor}
                href={`${MILLER_HALL_BASE_PATH}/floor/${floor}`}
              >
                <div
                  className="relative flex-shrink-0 rounded-[15px] overflow-hidden flex items-center justify-center"
                  style={{
                    width: 88,
                    height: 88,
                    background: floor % 2 !== 0 ? GOLD : NAVY,
                  }}
                >
                  <img
                    src={FLOOR_TILE_BG}
                    alt=""
                    className="absolute inset-0 object-cover size-full opacity-50 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <span className="relative z-10 text-[40px] font-black text-white tracking-[-0.8px] leading-none">
                    {floor}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="h-px bg-[#e5e5e5]" />

        {/* ── MOBILE: Room Type ── */}
        <section className="sm:hidden pt-6 pb-6">
          <h2 className="text-[20px] font-semibold text-black tracking-[-0.8px] mb-4">
            Room Type
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {roomTypeCards.map((type) => (
              <Link
                key={type.name}
                href={`${MILLER_HALL_BASE_PATH}/room?type=${type.name.toLowerCase()}`}
              >
                <div
                  className="relative flex-shrink-0 rounded-[20px] overflow-hidden flex items-end"
                  style={{ width: 169, height: 216, background: type.color }}
                >
                  {type.thumbnail && (
                    <img src={type.thumbnail} alt="" className="absolute inset-0 object-cover size-full opacity-70 pointer-events-none" referrerPolicy="no-referrer" />
                  )}
                  <p className="relative z-10 m-3 text-[20px] font-semibold text-white tracking-[-0.8px]">
                    {type.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="sm:hidden h-px bg-[#e5e5e5]" />

        {/* ── MOBILE: Latest Rooms Added ── */}
        <section className="sm:hidden pt-6 pb-6">
          <h2 className="text-[20px] font-semibold text-black tracking-[-0.8px] mb-4">
            Latest Rooms Added
          </h2>
          <div>
            {latestRooms.map((room, i) => (
              <div key={room?.roomNumber ?? `placeholder-${i}`}>
                {i > 0 && <div className="h-px bg-[#e5e5e5]" />}
                {room ? (
                  <Link href={`${MILLER_HALL_BASE_PATH}/room/${room.roomNumber}`}>
                    <div className="flex items-center gap-3 py-[14px]">
                      <RoomBadge roomNumber={room.roomNumber} thumbnailUrl={room.thumbnailUrl} index={i} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[17px] font-medium text-black tracking-[-0.8px] truncate">
                          {room.title}
                        </p>
                        <p className="text-[15px] text-[#868782] tracking-[-0.8px]">
                          Room {room.roomNumber}
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <PlaceholderRow index={i} />
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="sm:hidden h-px bg-[#e5e5e5]" />

        {/* ── MOBILE: Floor Plans ── */}
        <section className="sm:hidden pt-6 pb-10">
          <h2 className="text-[20px] font-semibold text-black tracking-[-0.8px] mb-4">
            Floor Plans
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            <FloorPlanCard label="Even Floor Plans" color={GOLD} imgUrl={EVEN_FLOOR_PLAN_URL} className="w-[169px] h-[216px] rounded-[20px]" />
            <FloorPlanCard label="Odd Floor Plans"  color={NAVY} imgUrl={ODD_FLOOR_PLAN_URL}  className="w-[169px] h-[216px] rounded-[20px]" />
          </div>
        </section>

        {/* ── TABLET (sm–lg): 1 big + 2 small + sidebar ── */}
        <section className="hidden sm:block lg:hidden pt-8 pb-6">
          <h2 className="text-[25px] font-semibold text-black tracking-[-0.8px] mb-5">
            New Rooms
          </h2>
          <div className="flex gap-4 items-start">
            <div className="flex gap-4 flex-1 min-w-0" style={{ height: 294 }}>
              {featuredRoom && (
                <Link
                  href={`${MILLER_HALL_BASE_PATH}/room/${featuredRoom.roomNumber}`}
                  className="relative flex-shrink-0 rounded-[15px] overflow-hidden"
                  style={{ width: 263, height: 294 }}
                >
                  <RoomPhoto room={featuredRoom} titleSize="big" />
                </Link>
              )}
              <div className="flex flex-col gap-4 flex-1 min-w-0 h-full">
                {tabletSmallRooms.map((room) => (
                  <Link
                    key={room.roomNumber}
                    href={`${MILLER_HALL_BASE_PATH}/room/${room.roomNumber}`}
                    className="relative rounded-[15px] overflow-hidden flex-1"
                  >
                    <RoomPhoto room={room} titleSize="small" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 overflow-hidden" style={{ width: 256, height: 294 }}>
              <LatestRoomsSidebar rooms={latestRooms} />
            </div>
          </div>
        </section>

        {/* ── LAPTOP (lg+): [Big 1] [Big 2] [Small 1 / Small 2 stacked] [Sidebar] ── */}
        <section className="hidden lg:block pt-8 pb-6">
          <h2 className="text-[25px] font-semibold text-black tracking-[-0.8px] mb-5">
            New Rooms
          </h2>
          <div className="flex gap-4 items-start">
            {laptopBigRooms[0] && (
              <Link
                href={`${MILLER_HALL_BASE_PATH}/room/${laptopBigRooms[0].roomNumber}`}
                className="relative flex-shrink-0 rounded-[15px] overflow-hidden"
                style={{ width: 263, height: 294 }}
              >
                <RoomPhoto room={laptopBigRooms[0]} titleSize="big" />
              </Link>
            )}
            {laptopBigRooms[1] && (
              <Link
                href={`${MILLER_HALL_BASE_PATH}/room/${laptopBigRooms[1].roomNumber}`}
                className="relative flex-shrink-0 rounded-[15px] overflow-hidden"
                style={{ width: 263, height: 294 }}
              >
                <RoomPhoto room={laptopBigRooms[1]} titleSize="big" />
              </Link>
            )}
            <div className="flex flex-col gap-3 flex-shrink-0" style={{ width: 155, height: 294 }}>
              {laptopSmallRooms.map((room) => (
                <Link
                  key={room.roomNumber}
                  href={`${MILLER_HALL_BASE_PATH}/room/${room.roomNumber}`}
                  className="relative rounded-[15px] overflow-hidden flex-1"
                >
                  <RoomPhoto room={room} titleSize="small" />
                </Link>
              ))}
            </div>
            <div className="flex-1 min-w-0 overflow-hidden" style={{ maxWidth: 256, height: 294 }}>
              <LatestRoomsSidebar rooms={latestRooms} />
            </div>
          </div>
        </section>

        <div className="hidden sm:block h-px bg-[#e5e5e5]" />

        {/* ── TABLET/LAPTOP: Floor Plans + Room Type side by side ── */}
        <div className="hidden sm:flex sm:gap-10 lg:gap-16 pt-6 pb-10">

          <section className="mb-6 sm:mb-0 flex-shrink-0">
            <h2 className="text-[25px] font-semibold text-black tracking-[-0.8px] mb-4">
              Floor Plans
            </h2>
            <div className="sm:flex lg:hidden gap-4">
              <FloorPlanCard label="Even Floor Plans" color={GOLD} imgUrl={EVEN_FLOOR_PLAN_URL} className="w-[209px] h-[339px] rounded-[15px]" />
              <FloorPlanCard label="Odd Floor Plans"  color={NAVY} imgUrl={ODD_FLOOR_PLAN_URL}  className="w-[209px] h-[339px] rounded-[15px]" />
            </div>
            <div className="hidden lg:flex gap-4">
              <FloorPlanCard label="Even Floor Plans" color={GOLD} imgUrl={EVEN_FLOOR_PLAN_URL} className="w-[355px] h-[339px] rounded-[15px]" />
              <FloorPlanCard label="Odd Floor Plans"  color={NAVY} imgUrl={ODD_FLOOR_PLAN_URL}  className="w-[354px] h-[339px] rounded-[15px]" />
            </div>
          </section>

          <section className="flex-1 min-w-0">
            <h2 className="text-[25px] font-semibold text-black tracking-[-0.8px] mb-4">
              Room Type
            </h2>
            <div className="flex flex-col gap-2">
              {roomTypeCards.map((type) => (
                <Link
                  key={type.name}
                  href={`${MILLER_HALL_BASE_PATH}/room?type=${type.name.toLowerCase()}`}
                >
                  <div className="flex items-center bg-[#f5f5f5] hover:bg-[#ececec] transition-colors rounded-[10px] overflow-hidden h-[59px]">
                    <div
                      className="relative flex-shrink-0 h-[59px] w-[78px] rounded-bl-[10px] rounded-tl-[10px] overflow-hidden flex items-center justify-center"
                      style={{ background: type.color }}
                    >
                      {type.thumbnail && (
                        <img src={type.thumbnail} alt="" className="absolute inset-0 object-cover size-full opacity-70 pointer-events-none" referrerPolicy="no-referrer" />
                      )}
                      <span className="relative z-10 text-[30px] font-extrabold text-white tracking-[-0.1px] leading-none flex items-center justify-center">
                        {type.svgIcon ?? type.bedCount}
                      </span>
                    </div>
                    <div className="flex-1 px-4">
                      <p className="text-[20px] font-bold text-black tracking-[-0.8px]">{type.name}</p>
                      <p className="text-[15px] text-[#868782] tracking-[-0.8px]"># Rooms — # Videos</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  )
}

function RoomPhoto({
  room,
  titleSize,
}: {
  room: { roomNumber: string; title: string; thumbnailUrl: string }
  titleSize: "big" | "small"
}) {
  return (
    <>
      <div className="absolute inset-0 bg-[#d9d9d9]">
        <img src={room.thumbnailUrl} alt={room.title} className="size-full object-cover opacity-70" referrerPolicy="no-referrer" />
      </div>
      <div className="absolute bottom-3 left-3 right-3">
        <p className={`font-bold text-white tracking-[-0.8px] leading-none ${titleSize === "big" ? "text-[25px]" : "text-[22px]"}`}>
          {room.roomNumber}
        </p>
        <p className={`font-semibold text-white tracking-[-0.8px] truncate ${titleSize === "big" ? "text-[20px]" : "text-[17px]"}`}>
          {room.title}
        </p>
      </div>
    </>
  )
}

function LatestRoomsSidebar({ rooms }: { rooms: MaybeRoom[] }) {
  return (
    <div className="h-full rounded-[15px] flex flex-col" style={{ background: "#f5f5f5" }}>
      <div className="px-4 pt-3 pb-2 flex flex-col">
        <h3 className="text-[20px] font-semibold text-black tracking-[-0.8px] mb-1.5">Latest Rooms Added</h3>
        <div>
          {rooms.map((room, i) => (
            <div key={room?.roomNumber ?? `placeholder-${i}`}>
              {i > 0 && <div className="h-px bg-[#e0e0e0] my-0.5" />}
              {room ? (
                <Link href={`${MILLER_HALL_BASE_PATH}/room/${room.roomNumber}`}>
                  <div className="flex items-center gap-3 py-[6px]">
                    <RoomBadge roomNumber={room.roomNumber} thumbnailUrl={room.thumbnailUrl} index={i} textSize="small" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-medium text-black tracking-[-0.8px] truncate">{room.title}</p>
                      <p className="text-[13px] text-[#868782] tracking-[-0.8px]">Room {room.roomNumber}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <PlaceholderRow index={i} compact />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RoomBadge({
  roomNumber,
  thumbnailUrl,
  index,
  textSize = "normal",
}: {
  roomNumber: string
  thumbnailUrl: string
  index: number
  textSize?: "normal" | "small"
}) {
  return (
    <div
      className="relative flex-shrink-0 rounded-[5px] overflow-hidden flex items-center justify-center"
      style={{ width: 57.668, height: 45, background: index % 2 === 0 ? NAVY : GOLD }}
    >
      {thumbnailUrl && (
        <img src={thumbnailUrl} alt="" className="absolute inset-0 object-cover size-full opacity-30 pointer-events-none" referrerPolicy="no-referrer" />
      )}
      <span className={`relative z-10 font-black text-white tracking-[-0.1px] ${textSize === "small" ? "text-[16px]" : "text-[18px]"}`}>
        {roomNumber}
      </span>
    </div>
  )
}

function PlaceholderRow({ index, compact }: { index: number; compact?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "py-[6px]" : "py-[14px]"} opacity-40`}>
      <div className="relative flex-shrink-0 rounded-[5px] overflow-hidden flex items-center justify-center bg-[#c8c8c8]" style={{ width: 57.668, height: 45 }}>
        <span className={`font-black text-white tracking-[-0.1px] ${compact ? "text-[14px]" : "text-[16px]"}`}>###</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-[#868782] tracking-[-0.8px] ${compact ? "text-[14px]" : "text-[17px]"}`}>Coming Soon</p>
        <p className={`text-[#868782] tracking-[-0.8px] ${compact ? "text-[12px]" : "text-[14px]"}`}>Submit your room to fill this slot</p>
      </div>
    </div>
  )
}

function FloorPlanCard({ label, color, imgUrl, className }: { label: string; color: string; imgUrl: string; className: string }) {
  return (
    <div className={`relative flex-shrink-0 overflow-hidden flex items-end ${className}`} style={{ background: color }}>
      <img src={imgUrl} alt={label} className="absolute inset-0 object-cover size-full opacity-50 pointer-events-none" referrerPolicy="no-referrer" />
      <p className="relative z-10 m-4 text-[20px] font-semibold text-white tracking-[-0.8px]">{label}</p>
    </div>
  )
}
