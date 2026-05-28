/**
 * Miller Hall Room Mapping
 * 
 * Official Name: Nathan R. Miller Hall
 * Nickname: Miller (always use this)
 * 
 * Maps room numbers to Backblaze folder paths
 */

/** Base URL path for Miller Hall (dorms/su/suffolk-university/boston/miller-hall/Nathan-R.-Miller-Hall) */
export const MILLER_HALL_BASE_PATH = '/dorms/su/suffolk-university/boston/miller-hall/Nathan-R.-Miller-Hall'

export interface RoomInfo {
  roomNumber: string
  floor: number
  type: 'single' | 'double' | 'quad' | 'adjoining' | 'common' | 'public-bathroom'
  isAccessible?: boolean
  adjoiningRoom?: string // For adjoining rooms, the other room number
  backblazePath: string
}

/**
 * Gets floor number from room number
 */
function getFloorFromRoom(roomNumber: string): number {
  // For 3-digit rooms (e.g., 201, 504)
  if (roomNumber.length === 3) {
    return parseInt(roomNumber.charAt(0))
  }
  // For 4-digit rooms (e.g., 1001, 1509)
  if (roomNumber.length === 4) {
    return parseInt(roomNumber.substring(0, 2))
  }
  return 1 // Default fallback
}

/**
 * Checks if a room is part of an adjoining pair
 */
function isAdjoiningRoom(roomNumber: string): { isAdjoining: boolean; pair?: string } {
  // Standalone overrides — checked first before any pattern logic
  const standaloneRooms = ['207', '210']
  if (standaloneRooms.includes(roomNumber)) return { isAdjoining: false }

  const num = parseInt(roomNumber)
  
  // Pattern: rooms ending in 01-02, 03-04, 05-06, 07-08, 09-10 are adjoining
  const lastTwoDigits = num % 100
  
  if (lastTwoDigits >= 1 && lastTwoDigits <= 10) {
    if (lastTwoDigits % 2 === 1) {
      // Odd number (01, 03, 05, 07, 09) - has a pair
      const pair = String(num + 1).padStart(roomNumber.length, '0')
      return { isAdjoining: true, pair }
    } else {
      // Even number (02, 04, 06, 08, 10) - has a pair
      const pair = String(num - 1).padStart(roomNumber.length, '0')
      return { isAdjoining: true, pair }
    }
  }
  
  // Special cases for floor 2
  if (roomNumber === '201') return { isAdjoining: true, pair: '202' }
  if (roomNumber === '202') return { isAdjoining: true, pair: '201' }
  if (roomNumber === '205') return { isAdjoining: true, pair: '206' }
  if (roomNumber === '206') return { isAdjoining: true, pair: '205' }
  
  return { isAdjoining: false }
}

/**
 * Gets room type based on room number
 */
function getRoomType(roomNumber: string): 'single' | 'double' | 'quad' {
  // Quads are typically 411, 611, 811, 1011, 1211, 1411, 1611, 1811
  const quadRooms = ['411', '611', '811', '1011', '1211', '1411', '1611', '1811']
  if (quadRooms.includes(roomNumber)) {
    return 'quad'
  }
  
  // Singles are typically rooms ending in 10 (210, 410, 510, etc.)
  // But also check specific singles from the structure
  const lastTwoDigits = parseInt(roomNumber) % 100
  if (lastTwoDigits === 10) {
    return 'single'
  }
  
  // Default to double
  return 'double'
}

/**
 * Checks if room is accessible (typically rooms ending in 03-04)
 */
function isAccessibleRoom(roomNumber: string): boolean {
  const lastTwoDigits = parseInt(roomNumber) % 100
  return lastTwoDigits === 3 || lastTwoDigits === 4
}

/**
 * Builds Backblaze folder path for a room
 * 
 * ACTUAL Backblaze Structure (based on real examples):
 * - Building: Suffolk University Dorms/Miller/
 * - Floor: Floor X/
 * - Unit: XXX + YYY/ (for adjoining rooms) or XXX/ (for individual rooms)
 * - Files: Directly in the unit folder (no bedroom subfolder)
 * 
 * Examples:
 * - Room 1103: Suffolk University Dorms/Miller/Floor 11/1103 + 1104/
 * - Room 1505: Suffolk University Dorms/Miller/Floor 15/1505 + 1506/
 * - Room 207: Suffolk University Dorms/Miller/Floor 2/207/
 * 
 * File naming pattern: sumiller1505-*.mp4
 * - su = campus (Suffolk University)
 * - miller = dorm name
 * - 1505 = room number
 * 
 * @param roomNumber - Room number (e.g., "504", "201", "1103")
 * @returns Backblaze folder path where files are stored
 */
export function getMillerHallRoomPath(roomNumber: string): string {
  const floor = getFloorFromRoom(roomNumber)
  // Floor 4 folder in Backblaze is "floor 4" (lowercase); other floors use "Floor N"
  const floorFormatted = floor === 4 ? `floor ${floor}` : `Floor ${floor}`
  const adjoining = isAdjoiningRoom(roomNumber)
  
  // Base path: Building/Floor
  const basePath = `Suffolk University Dorms/Miller/${floorFormatted}`
  
  // Handle adjoining rooms (multi-room units)
  // Files are directly in the unit folder: "1103 + 1104/"
  if (adjoining.isAdjoining && adjoining.pair) {
    // Sort room numbers for consistent path (lower number first)
    const rooms = [roomNumber, adjoining.pair].sort((a, b) => parseInt(a) - parseInt(b))
    return `${basePath}/${rooms[0]} + ${rooms[1]}/`
  }
  
  // Handle individual rooms
  // Files are directly in the room folder: "207/"
  return `${basePath}/${roomNumber}/`
}

/**
 * Gets detailed room information
 */
export function getMillerHallRoomInfo(roomNumber: string): RoomInfo {
  const floor = getFloorFromRoom(roomNumber)
  const adjoining = isAdjoiningRoom(roomNumber)
  const type = getRoomType(roomNumber)
  const isAccessible = isAccessibleRoom(roomNumber)
  
  return {
    roomNumber,
    floor,
    type: type, // Preserve actual room type (single, double, quad) even if part of adjoining pair
    isAccessible,
    adjoiningRoom: adjoining.pair,
    backblazePath: getMillerHallRoomPath(roomNumber)
  }
}

/**
 * Gets all room numbers for Miller Hall
 */
export function getAllMillerHallRooms(): string[] {
  const rooms: string[] = []
  
  // Floor 2
  rooms.push('201', '202', '205', '206', '207', '210')
  
  // Floors 4-19 (pattern repeats)
  for (let floor = 4; floor <= 19; floor++) {
    // Adjoining pairs
    for (let pair = 1; pair <= 10; pair += 2) {
      const room1 = `${floor}${String(pair).padStart(2, '0')}`
      const room2 = `${floor}${String(pair + 1).padStart(2, '0')}`
      rooms.push(room1, room2)
    }
    
    // Quad rooms (on certain floors)
    if ([4, 6, 8, 10, 12, 14, 16, 18].includes(floor)) {
      rooms.push(`${floor}11`)
    }
  }
  
  return rooms.sort((a, b) => parseInt(a) - parseInt(b))
}

/**
 * Gets common area paths for a floor
 */
export function getMillerHallCommonAreaPath(floor: number, area: 'lounge' | 'study' | 'bathroom' | 'floor-plan'): string {
  const floorFormatted = `Floor ${floor}`
  const basePath = `Suffolk University Dorms/Miller/${floorFormatted}`
  
  switch (area) {
    case 'lounge':
      return `${basePath}/${floor} Common Room Lounge/`
    case 'study':
      return `${basePath}/${floor} Study Room/`
    case 'bathroom':
      return `${basePath}/${floor} Public Bathroom/`
    case 'floor-plan':
      return `${basePath}/${floor} Floor Plan/`
    default:
      return basePath
  }
}

/**
 * Gets shared space path for a multi-room unit
 * @param roomNumber - Room number in the unit
 * @param space - Type of shared space
 */
export function getMillerHallSharedSpacePath(
  roomNumber: string, 
  space: 'bathroom' | 'kitchen' | 'common-space' | 'hallways'
): string {
  const unitPath = getMillerHallRoomPath(roomNumber) // Get unit path
  const spaceNames = {
    'bathroom': 'Bathroom',
    'kitchen': 'Kitchen',
    'common-space': 'Common Space',
    'hallways': 'Hallways'
  }
  
  return `${unitPath}${spaceNames[space]}/`
}

/**
 * Extracts room number from file name
 * Supports: sumiller1505-*.mp4, 1005millersuffolk(1).jpg, 1005millersuffolk.mp4
 * @param fileName - File name (e.g., "sumiller1505-full-21-sec-empty-imp.mp4" or "1005millersuffolk(1).jpg")
 * @returns Room number (e.g., "1505") or null if pattern doesn't match
 */
export function extractRoomNumberFromFileName(fileName: string): string | null {
  // Support full Backblaze paths, room-subfolder paths, and raw file names.
  // Example: ".../504 + 505/504/IMG_1234.jpg" => "504"
  let match = fileName.match(/\/(\d{3,4})\/[^/]+$/)
  if (match) return match[1]

  // Pattern: sumiller1505-... or sumiller1103-...
  match = fileName.match(/sumiller(\d+)/)
  if (match) return match[1]
  // Pattern: 1005millersuffolk(1).jpg or 1005millersuffolk.mp4 (no "su" prefix)
  match = fileName.match(/^(\d{3,4})miller/i)
  if (match) return match[1]
  // Pattern from full path last segment if needed
  const baseName = fileName.split('/').pop() ?? fileName
  match = baseName.match(/^(\d{3,4})miller/i)
  if (match) return match[1]
  return null
}

/**
 * Returns all room numbers that share the same Backblaze folder (for adjoining pairs, both room numbers).
 * Used so both 1005 and 1006 show all media from the "1005 + 1006" folder.
 */
export function getMillerHallRoomNumbersInUnit(roomNumber: string): string[] {
  const adjoining = isAdjoiningRoom(roomNumber)
  if (adjoining.isAdjoining && adjoining.pair) {
    return [roomNumber, adjoining.pair].sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
  }
  return [roomNumber]
}

// ---------------------------------------------------------------------------
// Room page config — used by MillerHallRoomPageTemplate
// ---------------------------------------------------------------------------

export interface MillerRoomConfig {
  roomNumber: string
  dormName: string
  floor: number
  totalFloors: number
  roomsOnFloor: number
  roomPositionOnFloor: number
  roomTypeName: string        // "Double" | "Single" | "Quad"
  bedCount: number
  layoutType: string          // "Suite" | "Individual"
  layoutSubtitle: string      // "2 Rooms" | "1 Room"
  adjoiningRoomNumber?: string
  bathroomType: string        // "Shared"
  bathroomName: string        // "Bathroom"
  bathroomDescription: string // "Semi-Private" | "Floor Bathroom"
  annualCost: string          // "$19,102"
  semesterCost: string        // "$9,551"
  floorPlanUrl: string
  bathroomFolderPath: string
  studentVerified: boolean
  otherRooms: Array<{ id: string; title: string; image: string; link: string }>
}

/**
 * Returns the Backblaze URL for a floor plan image.
 * Pattern: .../Miller/Floor+N/Nfloorplanmillersuffolk.jpg (or floor+4 for floor 4 — Backblaze uses lowercase).
 */
export function getMillerHallFloorPlanUrl(floor: number): string {
  const folder = floor === 4 ? `floor+${floor}` : `Floor+${floor}`
  return `https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/${folder}/${floor}floorplanmillersuffolk.jpg`
}

/**
 * Annual and semester rates for each room type (2025-26 Suffolk University rates).
 */
export function getMillerHallRates(type: RoomInfo['type']): { annualCost: string; semesterCost: string } {
  switch (type) {
    case 'single':
      return { annualCost: '$19,928', semesterCost: '$9,964' }
    case 'quad':
      return { annualCost: '$17,480', semesterCost: '$8,740' }
    default:
      // double / adjoining
      return { annualCost: '$19,102', semesterCost: '$9,551' }
  }
}

/**
 * Converts a number to its ordinal string (1 → "1st", 5 → "5th", etc.)
 */
export function toOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

// ---------------------------------------------------------------------------
// Rooms with confirmed media in Backblaze
// ---------------------------------------------------------------------------
//
// RULES for this list:
//   1. A room may only be added here if it has at least one real photo or
//      video of the ROOM (not just a plaque) uploaded to Backblaze.
//   2. thumbnailUrl must be a direct Backblaze public URL to a representative
//      image from that room's folder.  Use the pattern:
//        https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+N/ROOM1+%2B+ROOM2/FILENAME.jpg
//   3. When you upload new media for a room, add it here so it can appear in
//      the "Other Rooms in Miller" footer on every room page.
//   4. Do NOT add a room whose only media is a plaque photo — bedroom/room
//      photos or videos are required.
//   5. For rooms not yet uploaded, use MILLER_HALL_PLACEHOLDER_THUMBNAIL as
//      the thumbnailUrl so the page can identify and skip them in featured
//      sections (New Rooms grid).
//
// ---------------------------------------------------------------------------

/**
 * Placeholder thumbnail used for rooms that are in MILLER_ROOMS_WITH_MEDIA
 * but don't yet have a real room photo uploaded to Backblaze.
 * The "New Rooms" grid excludes any entry using this URL so only cards with
 * genuine room-interior photos appear there.
 */
export const MILLER_HALL_PLACEHOLDER_THUMBNAIL =
  'https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg'
export const MILLER_ROOMS_WITH_MEDIA: Array<{
  roomNumber: string
  title: string        // Label shown on the card (e.g. "Double Suite")
  thumbnailUrl: string // Direct Backblaze URL to a representative room image
}> = [
  // ── Floor 2 ──────────────────────────────────────────────────────────────
  { roomNumber: '201', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '202', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '205', title: 'Double Suite', thumbnailUrl: 'https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller205-bedroom-empty-8.jpg' },
  { roomNumber: '206', title: 'Double Suite', thumbnailUrl: 'https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/205+%2B+206/sumiller206-bedroom-empty-8.jpg' },
  { roomNumber: '207', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },

  // ── Floor 4 ──────────────────────────────────────────────────────────────
  { roomNumber: '406', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '407', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '408', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },

  // ── Floor 5 ──────────────────────────────────────────────────────────────
  { roomNumber: '504', title: 'Double Suite', thumbnailUrl: 'https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/503+%2B+504/sumiller504-bedroom-bothbeds-messy-imp-2.jpg' },

  // ── Floor 6 ──────────────────────────────────────────────────────────────
  { roomNumber: '602', title: 'Double Suite', thumbnailUrl: 'https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/601+%2B+602/sumiller602-bedroom-imp-3.jpg' },
  { roomNumber: '608', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '610', title: 'Single',       thumbnailUrl: 'https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-2.jpg' },
  { roomNumber: '611', title: 'Quad',         thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },

  // ── Floor 7 ──────────────────────────────────────────────────────────────
  { roomNumber: '701', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '702', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },

  // ── Floor 10 ─────────────────────────────────────────────────────────────
  { roomNumber: '1005', title: 'Double Suite', thumbnailUrl: 'https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1005+%2B+1006/1005millersuffolk(1).jpg' },
  { roomNumber: '1008', title: 'Double Suite', thumbnailUrl: 'https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1007+%2B+1008/1008millersuffolk(3).jpg' },

  // ── Floor 11 ─────────────────────────────────────────────────────────────
  { roomNumber: '1101', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1102', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1103', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1104', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1105', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1106', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1107', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1108', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1109', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1110', title: 'Single',       thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },

  // ── Floor 12 ─────────────────────────────────────────────────────────────
  { roomNumber: '1201', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1202', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1203', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1204', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1205', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1206', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1207', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1208', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1209', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1210', title: 'Single',       thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1211', title: 'Quad',         thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },

  // ── Floor 13 ─────────────────────────────────────────────────────────────
  { roomNumber: '1301', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1302', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1303', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1304', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1305', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1306', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1307', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1308', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },

  // ── Floor 14 ─────────────────────────────────────────────────────────────
  { roomNumber: '1401', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1402', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1403', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1404', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1405', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1406', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1407', title: 'Double Suite', thumbnailUrl: 'https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+14/1407+%2B+1408/sumiller1407-view-empty-imp-6.jpg' },
  { roomNumber: '1408', title: 'Double Suite', thumbnailUrl: 'https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+14/1407+%2B+1408/sumiller1407-view-empty-imp-6.jpg' },
  { roomNumber: '1409', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1410', title: 'Single',       thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1411', title: 'Quad',         thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },

  // ── Floor 15 ─────────────────────────────────────────────────────────────
  { roomNumber: '1501', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1502', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1503', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1504', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1505', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1506', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1507', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1508', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
  { roomNumber: '1509', title: 'Double Suite', thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },

  // ── Floor 18 ─────────────────────────────────────────────────────────────
  { roomNumber: '1810', title: 'Single',       thumbnailUrl: MILLER_HALL_PLACEHOLDER_THUMBNAIL },
]

/**
 * Picks 3 "other rooms" from MILLER_ROOMS_WITH_MEDIA for the footer.
 *
 * Selection rules:
 *  - Never includes the current room.
 *  - Prefers rooms from different floors for visual variety.
 *  - Falls back to any remaining eligible rooms if not enough floors available.
 */
function pickOtherRooms(
  currentRoomNumber: string
): Array<{ id: string; title: string; image: string; link: string }> {
  const eligible = MILLER_ROOMS_WITH_MEDIA.filter(r => r.roomNumber !== currentRoomNumber)

  const seenFloors = new Set<number>()
  const picked: typeof eligible = []

  // First pass: one room per floor
  for (const r of eligible) {
    if (picked.length >= 3) break
    const floor = getFloorFromRoom(r.roomNumber)
    if (!seenFloors.has(floor)) {
      seenFloors.add(floor)
      picked.push(r)
    }
  }

  // Second pass: fill remaining slots if needed
  for (const r of eligible) {
    if (picked.length >= 3) break
    if (!picked.includes(r)) picked.push(r)
  }

  return picked.slice(0, 3).map(r => ({
    id: r.roomNumber,
    title: r.title,
    image: r.thumbnailUrl,
    link: `${MILLER_HALL_BASE_PATH}/room/${r.roomNumber}`,
  }))
}

/**
 * Builds the full MillerRoomConfig for a given RoomInfo.
 * Used by the dynamic room route to feed MillerHallRoomPageTemplate.
 */
export function buildMillerRoomConfig(roomInfo: RoomInfo): MillerRoomConfig {
  const { annualCost, semesterCost } = getMillerHallRates(roomInfo.type)
  const floorPlanUrl = getMillerHallFloorPlanUrl(roomInfo.floor)

  // Room type display
  let roomTypeName: string
  let bedCount: number
  switch (roomInfo.type) {
    case 'single': roomTypeName = 'Single'; bedCount = 1; break
    case 'quad':   roomTypeName = 'Quad';   bedCount = 4; break
    default:       roomTypeName = 'Double'; bedCount = 2; break
  }

  const isAdjoining = !!roomInfo.adjoiningRoom
  const layoutType = isAdjoining ? 'Suite' : 'Individual'
  const layoutSubtitle = isAdjoining ? '2 Rooms' : '1 Room'
  const bathroomDescription = isAdjoining ? 'Semi-Private' : 'Floor Bathroom'

  // Compute room position on its floor for the right-panel progress indicator
  const allRooms = getAllMillerHallRooms()
  const floorRooms = allRooms.filter(r => getFloorFromRoom(r) === roomInfo.floor)
  const roomPositionOnFloor = floorRooms.indexOf(roomInfo.roomNumber) + 1
  const roomsOnFloor = floorRooms.length

  return {
    roomNumber: roomInfo.roomNumber,
    dormName: 'Nathan R Miller Hall',
    floor: roomInfo.floor,
    totalFloors: 19,
    roomsOnFloor,
    roomPositionOnFloor,
    roomTypeName,
    bedCount,
    layoutType,
    layoutSubtitle,
    adjoiningRoomNumber: roomInfo.adjoiningRoom,
    bathroomType: 'Shared',
    bathroomName: 'Bathroom',
    bathroomDescription,
    annualCost,
    semesterCost,
    floorPlanUrl,
    bathroomFolderPath: 'Suffolk University Dorms/Miller/Average Miller Semi Private Bathroom/',
    studentVerified: true,
    otherRooms: pickOtherRooms(roomInfo.roomNumber),
  }
}

