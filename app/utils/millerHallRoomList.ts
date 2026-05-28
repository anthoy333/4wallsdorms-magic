/**
 * Miller Hall Room List Generator
 * 
 * Generates room data for display on the Miller Hall page
 */

import { getAllMillerHallRooms, getMillerHallRoomInfo } from './millerHallMapping'

export interface RoomDisplayData {
  id: number
  number: string
  type: string
  image?: string
  link: string
  isAdjoining?: boolean
}

/**
 * Gets all rooms for Miller Hall with display data
 */
export function getAllMillerHallRoomData(): RoomDisplayData[] {
  const allRoomNumbers = getAllMillerHallRooms()
  const rooms: RoomDisplayData[] = []
  const processedAdjoiningPairs = new Set<string>()

  allRoomNumbers.forEach((roomNumber, index) => {
    const roomInfo = getMillerHallRoomInfo(roomNumber)
    
    // Determine room type display name for individual rooms
    let typeDisplay = 'Double'
    if (roomInfo.type === 'single') {
      typeDisplay = 'Single'
    } else if (roomInfo.type === 'quad') {
      typeDisplay = 'Quad'
    }

    // Always create individual room entry
    rooms.push({
      id: rooms.length + 1,
      number: roomNumber,
      type: typeDisplay,
      link: `/dorms/miller-hall/room/${roomNumber}`,
      isAdjoining: false
    })

    // If this room is part of an adjoining pair, also create adjoining room entry
    // (but only once per pair)
    if (roomInfo.adjoiningRoom) {
      const pair = [roomNumber, roomInfo.adjoiningRoom].sort((a, b) => parseInt(a) - parseInt(b))
      const pairKey = pair.join('-')
      
      // Only add adjoining room entry if we haven't already added it
      if (!processedAdjoiningPairs.has(pairKey)) {
        processedAdjoiningPairs.add(pairKey)
        rooms.push({
          id: rooms.length + 1,
          number: `${pair[0]} + ${pair[1]}`, // Use + for display
          type: 'Adjoining',
          link: `/dorms/miller-hall/communal/adjoining-room/${pair[0]}-${pair[1]}`, // URL uses - for routing
          isAdjoining: true
        })
      }
    }
  })

  return rooms.sort((a, b) => {
    // Sort by room number (extract numeric part)
    // Handle both '-' (for links) and '+' (for display) separators
    const aNum = parseInt(a.number.split(/[-+]/)[0].trim())
    const bNum = parseInt(b.number.split(/[-+]/)[0].trim())
    return aNum - bNum
  })
}

/**
 * Gets room type filter categories
 */
export function getRoomTypeFilters(): string[] {
  return ['all', 'single', 'double', 'quad', 'adjoining']
}

