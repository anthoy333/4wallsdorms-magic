/**
 * 10 West Residence Hall Room Mapping
 * 
 * Based on official Suffolk University directory structure
 * Reference: https://www.suffolk.edu/student-life/housing-dining/on-campus-housing/residence-halls/10-west-street
 * 
 * Maps room numbers to Backblaze folder paths
 */

export interface RoomInfo {
  roomNumber: string
  floor: number | string // Can be number or "4M" for mezzanine
  type: 'studio' | 'standard-apartment' | 'semi-private-apartment' | 'suite' | 'duplex-apartment'
  hasSharedSpace: boolean // Whether this room has a shared space page
  subRooms?: string[] // Sub-rooms like 304A, 304B
  backblazePath: string
}

/**
 * Room type definitions from official website:
 * - Suite: 3-6 students, 2-4 bedrooms, shared bathroom, no living room (opens into common area)
 * - Standard Apartment: 2-8 students, bedroom furniture, kitchen, living room, bathroom
 * - Studio Apartment: Large open room with beds, living room furniture, and kitchen (NO shared space page)
 * - Semi-Private Apartment: 3-4 people, single/double bedrooms, some with 8.5ft walls
 * - Duplex Apartment: Two-story, 4-8 students, living room/kitchen/bedroom/bathroom on first floor
 */

// Room type mapping based on directory structure
const roomTypeMap: { [key: string]: 'studio' | 'standard-apartment' | 'semi-private-apartment' | 'suite' | 'duplex-apartment' } = {
  // Floor 2
  '211': 'standard-apartment',
  '212': 'standard-apartment',
  '213': 'standard-apartment',
  '214': 'standard-apartment',
  
  // Floor 3 - Studio Apartments (no shared space)
  '301': 'studio',
  '302': 'studio',
  '303': 'studio',
  // Floor 3 - Standard Apartments
  '304': 'standard-apartment',
  '305': 'standard-apartment',
  // Floor 3 - Semi-Private Apartments
  '306': 'semi-private-apartment',
  '307': 'semi-private-apartment',
  // Floor 3 - Standard Apartment
  '308': 'standard-apartment',
  // Floor 3 - Suites
  '311': 'suite',
  '312': 'suite',
  '313': 'suite',
  '314': 'suite',
  
  // Floor 4 - Studio Apartments (no shared space)
  '401': 'studio',
  '402': 'studio',
  '403': 'studio',
  // Floor 4 - Standard Apartments
  '404': 'standard-apartment',
  '405': 'standard-apartment',
  // Floor 4 - Semi-Private Apartments
  '406': 'semi-private-apartment',
  '407': 'semi-private-apartment',
  // Floor 4 - Standard Apartment
  '408': 'standard-apartment',
  // Floor 4 - Suites
  '411': 'suite',
  '412': 'suite',
  '413': 'suite',
  '414': 'suite',
  
  // Floor 4M - Studio Apartments (no shared space)
  '4M01': 'studio',
  '4M02': 'studio',
  '4M03': 'studio',
  // Floor 4M - Standard Apartments
  '4M04': 'standard-apartment',
  '4M05': 'standard-apartment',
  // Floor 4M - Semi-Private Apartments
  '4M06': 'semi-private-apartment',
  '4M07': 'semi-private-apartment',
  // Floor 4M - Standard Apartment
  '4M08': 'standard-apartment',
  // Floor 4M - Suites
  '4M11': 'suite',
  '4M12': 'suite',
  '4M13': 'suite',
  '4M14': 'suite',
  
  // Floor 5 - Studio Apartments (no shared space)
  '501': 'studio',
  '502': 'studio',
  '503': 'studio',
  // Floor 5 - Standard Apartments
  '504': 'standard-apartment',
  '505': 'standard-apartment',
  // Floor 5 - Semi-Private Apartments
  '506': 'semi-private-apartment',
  '507': 'semi-private-apartment',
  // Floor 5 - Standard Apartment
  '508': 'standard-apartment',
  // Floor 5 - Suites
  '511': 'suite',
  '512': 'suite',
  '513': 'suite',
  '514': 'suite',
  
  // Floor 6 - Studio Apartments (no shared space)
  '601': 'studio',
  '602': 'studio',
  '603': 'studio',
  // Floor 6 - Standard Apartments
  '604': 'standard-apartment',
  '605': 'standard-apartment',
  // Floor 6 - Semi-Private Apartments
  '606': 'semi-private-apartment',
  '607': 'semi-private-apartment',
  // Floor 6 - Standard Apartment
  '608': 'standard-apartment',
  // Floor 6 - Suites
  '611': 'suite',
  '612': 'suite',
  '613': 'suite',
  '614': 'suite',
  
  // Floor 7 - Standard Apartments
  '701': 'standard-apartment',
  '702': 'standard-apartment',
  '704': 'standard-apartment',
  '705': 'standard-apartment',
  // Floor 7 - Semi-Private Apartments
  '706': 'semi-private-apartment',
  '707': 'semi-private-apartment',
  // Floor 7 - Standard Apartment
  '708': 'standard-apartment',
  
  // Floor 8 - Duplex Apartments
  '801': 'duplex-apartment',
  '802': 'duplex-apartment',
  '803': 'duplex-apartment',
  '804': 'duplex-apartment',
  '805': 'duplex-apartment',
  '806': 'duplex-apartment',
  '807': 'duplex-apartment',
}

/**
 * Gets floor number from room number
 */
function getFloorFromRoom(roomNumber: string): number | string {
  // Handle 4M (mezzanine floor)
  if (roomNumber.startsWith('4M')) {
    return '4M'
  }
  
  // For 3-digit rooms (e.g., 301, 302)
  if (roomNumber.length === 3) {
    return parseInt(roomNumber.charAt(0))
  }
  
  // For 4-digit rooms (e.g., 1001) - not used in 10 West but handle for safety
  if (roomNumber.length === 4 && !roomNumber.startsWith('4M')) {
    return parseInt(roomNumber.substring(0, 2))
  }
  
  return 1 // Default fallback
}

/**
 * Gets room type based on room number
 */
function getRoomType(roomNumber: string): 'studio' | 'standard-apartment' | 'semi-private-apartment' | 'suite' | 'duplex-apartment' {
  // Extract base room number (remove letter suffix like A, B, C)
  const baseRoom = roomNumber.replace(/[A-Z]$/, '')
  return roomTypeMap[baseRoom] || 'standard-apartment'
}

/**
 * Checks if a room has a shared space page
 * Studio Apartments do NOT have shared space pages
 * All other types (Suite, Standard Apartment, Semi-Private Apartment, Duplex Apartment) DO have shared space pages
 */
function hasSharedSpace(roomNumber: string): boolean {
  const type = getRoomType(roomNumber)
  // Studio apartments don't have shared space pages
  return type !== 'studio'
}

/**
 * Builds Backblaze folder path for a room
 * 
 * Backblaze Structure (confirmed from actual URL):
 * - Building: Suffolk University Dorms/10 west dorm/
 * - Floor: X+floor/ (lowercase, no space, uses + instead of space)
 * - Room: ROOM/
 * 
 * Examples from actual Backblaze URLs:
 * - Room 413: Suffolk University Dorms/10 west dorm/4+floor/413/
 *   URL: https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/10+west+dorm/4+floor/413/...
 * 
 * @param roomNumber - Room number (e.g., "301", "413", "4M01")
 * @returns Backblaze folder path where files are stored
 */
export function getTenWestRoomPath(roomNumber: string): string {
  const floor = getFloorFromRoom(roomNumber)
  
  // Format floor: use "X+floor" format (lowercase, no space)
  // For 4M, use "4M+floor"
  const floorFormatted = typeof floor === 'string' ? `${floor}+floor` : `${floor}+floor`
  
  // Base path: Building/Floor
  const basePath = `Suffolk University Dorms/10 west dorm/${floorFormatted}`
  
  // Extract base room number (remove letter suffix for sub-rooms like 413A -> 413)
  const baseRoom = roomNumber.replace(/[A-Z]$/, '')
  
  // Handle individual rooms
  return `${basePath}/${baseRoom}/`
}

/**
 * Gets detailed room information
 */
export function getTenWestRoomInfo(roomNumber: string): RoomInfo {
  const floor = getFloorFromRoom(roomNumber)
  const type = getRoomType(roomNumber)
  const hasSharedSpacePage = hasSharedSpace(roomNumber)
  
  return {
    roomNumber,
    floor,
    type,
    hasSharedSpace: hasSharedSpacePage,
    backblazePath: getTenWestRoomPath(roomNumber)
  }
}

/**
 * Gets all room numbers for 10 West
 * Based on official directory structure
 */
export function getAllTenWestRooms(): string[] {
  const rooms: string[] = []
  
  // Floor 2
  rooms.push('211', '212', '213', '214')
  
  // Floor 3
  rooms.push('301', '302', '303', '304', '305', '306', '307', '308', '311', '312', '313', '314')
  
  // Floor 4
  rooms.push('401', '402', '403', '404', '405', '406', '407', '408', '411', '412', '413', '414')
  
  // Floor 4M (Mezzanine)
  rooms.push('4M01', '4M02', '4M03', '4M04', '4M05', '4M06', '4M07', '4M08', '4M11', '4M12', '4M13', '4M14')
  
  // Floor 5
  rooms.push('501', '502', '503', '504', '505', '506', '507', '508', '511', '512', '513', '514')
  
  // Floor 6
  rooms.push('601', '602', '603', '604', '605', '606', '607', '608', '611', '612', '613', '614')
  
  // Floor 7
  rooms.push('701', '702', '704', '705', '706', '707', '708')
  
  // Floor 8
  rooms.push('801', '802', '803', '804', '805', '806', '807')
  
  // Sort rooms: numeric first, then 4M rooms
  return rooms.sort((a, b) => {
    // Handle 4M rooms separately
    if (a.startsWith('4M') && b.startsWith('4M')) {
      return a.localeCompare(b)
    }
    if (a.startsWith('4M')) return 1
    if (b.startsWith('4M')) return -1
    
    // Compare numeric rooms
    const aNum = parseInt(a)
    const bNum = parseInt(b)
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum
    }
    return a.localeCompare(b)
  })
}
