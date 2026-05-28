/**
 * 10 West Residence Hall Room List Generator
 * 
 * Generates room data for display on the 10 West page
 * Based on official Suffolk University directory structure
 */

import { getAllTenWestRooms, getTenWestRoomInfo } from './tenWestMapping'

export interface RoomDisplayData {
  id: number
  number: string
  type: string
  image?: string
  link: string
  isAdjoining?: boolean
  hasSharedSpace?: boolean
}

/**
 * Gets display name for room type
 */
function getRoomTypeDisplayName(type: string): string {
  switch (type) {
    case 'studio':
      return 'Studio Apartment'
    case 'standard-apartment':
      return 'Standard Apartment'
    case 'semi-private-apartment':
      return 'Semi-Private Apartment'
    case 'suite':
      return 'Suite'
    case 'duplex-apartment':
      return 'Duplex Apartment'
    default:
      return 'Apartment'
  }
}

/**
 * Gets all rooms for 10 West with display data
 * 
 * Important: In 10 West, "adjoining rooms" are called "Suites" and refer to rooms with shared spaces.
 * Only rooms with shared spaces (Suite, Standard Apartment, Semi-Private Apartment, Duplex Apartment)
 * get a shared space page. Studio Apartments do NOT get shared space pages.
 */
export function getAllTenWestRoomData(): RoomDisplayData[] {
  const allRoomNumbers = getAllTenWestRooms()
  const rooms: RoomDisplayData[] = []
  const processedSharedSpaces = new Set<string>()

  allRoomNumbers.forEach((roomNumber) => {
    const roomInfo = getTenWestRoomInfo(roomNumber)
    
    // Get display name for room type
    const typeDisplay = getRoomTypeDisplayName(roomInfo.type)

    // Always create individual room entry
    rooms.push({
      id: rooms.length + 1,
      number: roomNumber,
      type: typeDisplay,
      link: `/dorms/10-west/room/${roomNumber}`,
      isAdjoining: false,
      hasSharedSpace: roomInfo.hasSharedSpace
    })

    // If this room has a shared space (Suite, Standard Apartment, Semi-Private Apartment, Duplex Apartment),
    // also create a shared space entry (but only once per room)
    // Note: Studio Apartments do NOT get shared space pages
    // The shared space page uses the same room number but different route
    if (roomInfo.hasSharedSpace && !processedSharedSpaces.has(roomNumber)) {
      processedSharedSpaces.add(roomNumber)
      
      // Create shared space entry
      // Keep the same room type name but mark as shared space
      rooms.push({
        id: rooms.length + 1,
        number: roomNumber, // Same room number for shared space
        type: `${typeDisplay} (Shared Space)`, // Show room type with "Shared Space" suffix
        link: `/dorms/10-west/communal/shared-space/${roomNumber}`, // Shared space route
        isAdjoining: true, // Mark as shared space/adjoining
        hasSharedSpace: true
      })
    }
  })

  return rooms.sort((a, b) => {
    // Sort by room number (extract numeric part)
    // Handle both regular numbers and "4M" prefix
    const aBase = a.number.split(' ')[0] // Remove "(Shared Space)" suffix if present
    const bBase = b.number.split(' ')[0]
    
    // Extract floor numbers for comparison
    const getFloorForSort = (roomNum: string): number => {
      if (roomNum.startsWith('4M')) {
        return 4.5 // 4M comes between floor 4 and floor 5
      }
      const num = parseInt(roomNum)
      if (!isNaN(num)) {
        // For 3-digit rooms, first digit is floor
        if (roomNum.length === 3) {
          return parseInt(roomNum.charAt(0))
        }
        // For 4-digit rooms, first two digits are floor
        if (roomNum.length === 4) {
          return parseInt(roomNum.substring(0, 2))
        }
      }
      return 999 // Unknown rooms go to end
    }
    
    const aFloor = getFloorForSort(aBase)
    const bFloor = getFloorForSort(bBase)
    
    // First sort by floor
    if (aFloor !== bFloor) {
      return aFloor - bFloor
    }
    
    // If same floor, sort by room number
    // Handle 4M rooms
    if (aBase.startsWith('4M') && bBase.startsWith('4M')) {
      return aBase.localeCompare(bBase)
    }
    
    // Compare numeric rooms
    const aNum = parseInt(aBase)
    const bNum = parseInt(bBase)
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum
    }
    return aBase.localeCompare(bBase)
  })
}

/**
 * Gets room type filter categories for 10 West
 */
export function getTenWestRoomTypeFilters(): string[] {
  return ['all', 'studio-apartment', 'standard-apartment', 'semi-private-apartment', 'suite', 'duplex-apartment', 'shared-space']
}
