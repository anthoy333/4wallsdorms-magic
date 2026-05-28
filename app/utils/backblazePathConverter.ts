/**
 * Utility functions to convert room selections to Backblaze folder paths
 */

import { getMillerHallRoomPath } from './millerHallMapping'

/**
 * Converts room selection to Backblaze folder path
 * @param university - University name (e.g., "Suffolk University Dorms")
 * @param building - Building name (e.g., "Miller", "10 west dorm")
 * @param floor - Floor number or name (e.g., "2", "Floor 2")
 * @param room - Room number (e.g., "201", "504")
 * @returns Backblaze folder path
 */
export function buildBackblazeFolderPath(
  university: string,
  building: string,
  floor: string,
  room: string
): string {
  // Normalize building name to match Backblaze structure
  const buildingMap: { [key: string]: string } = {
    'Miller': 'Miller',
    'Miller Hall': 'Miller',
    'Nathan R. Miller Hall': 'Miller', // Official name maps to nickname
    '10 West': '10 west dorm',
    '10 west': '10 west dorm',
    '1 Court Street': '1 Court Street',
    'Smith Hall': 'Smith Hall',
    'Modern Theatre': 'Modern Theatre'
  };

  const normalizedBuilding = buildingMap[building] || building;
  
  // Use Miller Hall mapping if it's Miller
  if (normalizedBuilding === 'Miller') {
    // Files are directly in the unit/room folder
    return getMillerHallRoomPath(room)
  }
  
  // Format floor (handle both "2" and "Floor 2" formats)
  let floorFormatted = floor;
  if (!floor.includes('floor') && !floor.includes('Floor')) {
    floorFormatted = `Floor ${floor}`;
  }
  
  // Build path for other buildings
  return `${university}/${normalizedBuilding}/${floorFormatted}/${room}/`;
}

/**
 * Converts URL-friendly path to Backblaze folder path
 * @param urlPath - URL path like "miller-hall/room-201"
 * @returns Backblaze folder path
 */
export function convertUrlPathToBackblazeFolder(urlPath: string): string {
  const parts = urlPath.split('/');
  
  if (parts.length < 2) {
    throw new Error(`Invalid path format: ${urlPath}`);
  }
  
  const [dormName, roomPart] = parts;
  
  // Extract room number(s) from "room-201" or "room-201-202"
  const roomMatch = roomPart.match(/room-(\d+(?:-\d+)?)/);
  if (!roomMatch) {
    throw new Error(`Invalid room format: ${roomPart}`);
  }
  
  const roomNumber = roomMatch[1];
  
  // Handle Miller Hall
  if (dormName === 'miller-hall' || dormName === 'miller') {
    return getMillerHallRoomPath(roomNumber)
  }
  
  // For other dorms, use generic path
  const roomNumbers = roomNumber.split('-');
  const room = roomNumbers.length > 1 
    ? `${roomNumbers[0]} + ${roomNumbers[1]}` // Adjoining rooms
    : roomNumbers[0]; // Single room
  
  // Extract floor from room number
  const firstDigit = parseInt(roomNumbers[0].charAt(0));
  const floor = roomNumbers[0].length === 4 
    ? parseInt(roomNumbers[0].substring(0, 2))
    : firstDigit;
  
  return buildBackblazeFolderPath(
    'Suffolk University Dorms',
    dormName.replace('-', ' '),
    String(floor),
    room
  );
}

