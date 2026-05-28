/**
 * Utility to check if a room has media in Backblaze
 */

import { getMillerHallRoomPath } from './millerHallMapping'
import { getTenWestRoomPath } from './tenWestMapping'

/**
 * Checks if a room has any media files in Backblaze
 * @param roomNumber - Room number to check
 * @param dormName - Dorm name (default: "Miller")
 * @returns Promise<boolean> - true if room has media, false otherwise
 */
export async function checkRoomHasMedia(roomNumber: string, dormName: string = "Miller"): Promise<boolean> {
  try {
    let folderPath: string
    
    if (dormName === "Miller" || dormName === "Miller Hall") {
      folderPath = getMillerHallRoomPath(roomNumber)
    } else if (dormName === "10 West" || dormName === "10 west" || dormName === "Ten West") {
      folderPath = getTenWestRoomPath(roomNumber)
    } else {
      return false
    }

    const encodedPath = encodeURIComponent(folderPath)
    const response = await fetch(`/api/backblaze/list?folder=${encodedPath}`)

    if (!response.ok) {
      if (response.status === 401) {
        console.error(`Backblaze authentication failed for room ${roomNumber}. Check your BACKBLAZE_KEY_ID and BACKBLAZE_APP_KEY environment variables.`)
      } else {
        console.warn(`Failed to check media for room ${roomNumber}: ${response.status} ${response.statusText}`)
      }
      return false
    }

    const data = await response.json()
    const files = (data.files || []).filter((file: any) => {
      // Filter out empty folder markers and bathroom files (for individual rooms)
      if (file.fileName.includes('.bzEmpty') || file.contentLength === 0) {
        return false
      }
      
      const fileName = file.fileName.split('/').pop() || ''
      const fileNameLower = fileName.toLowerCase()
      
      // For individual room pages, exclude bathroom files
      if (fileNameLower.includes('bathroom') || 
          fileNameLower.includes('bath') || 
          fileNameLower.includes('toilet') ||
          fileNameLower.includes('shower')) {
        return false
      }
      
      // For 10 West, verify files match the room number pattern
      // Since files are already in the correct folder path, we just need to verify they're 10 West files
      if (dormName === "10 West" || dormName === "10 west" || dormName === "Ten West") {
        // 10 West files should start with "suwest" - if they don't, they might be from a different dorm
        // But since we're already in the correct folder, we can be more lenient
        // Only exclude if the file clearly doesn't belong (e.g., has "sumiller" prefix)
        if (fileNameLower.includes('sumiller')) {
          // This is a Miller Hall file, shouldn't be here
          return false
        }
        // If file starts with "suwest", verify it matches the room number
        const match = fileName.match(/suwest(\d+[A-Z]?)/i)
        if (match) {
          const fileRoomNumber = match[1].replace(/[A-Z]$/, '')
          const baseRoomNumber = roomNumber.replace(/[A-Z]$/, '')
          // Only include files that match the requested room number
          if (fileRoomNumber !== baseRoomNumber) {
            return false
          }
        }
        // If file doesn't match suwest pattern but is in the folder, include it anyway
        // (might be a floor plan or other room-related file)
      }
      
      // Check file type - be lenient if type isn't set
      const isImage = file.type === 'image' || 
                     /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)
      const isVideo = file.type === 'video' || 
                     /\.(mp4|mov|webm|avi)$/i.test(fileName)
      
      return isImage || isVideo
    })

    console.log(`🔍 checkRoomHasMedia: Room ${roomNumber} (${dormName}) - Found ${files.length} valid files out of ${data.files?.length || 0} total files`)
    if (files.length === 0 && data.files && data.files.length > 0) {
      console.log(`⚠️ Room ${roomNumber} has ${data.files.length} files but all were filtered out. Sample files:`, 
        data.files.slice(0, 3).map((f: any) => f.fileName.split('/').pop()))
    }
    return files.length > 0
  } catch (error) {
    console.error(`Error checking media for room ${roomNumber}:`, error)
    return false
  }
}

/**
 * Checks if an adjoining room has bathroom media
 * @param roomNumber - One room number from the pair
 * @param dormName - Dorm name (default: "Miller")
 * @returns Promise<boolean> - true if adjoining room has bathroom media
 */
export async function checkAdjoiningRoomHasMedia(roomNumber: string, dormName: string = "Miller"): Promise<boolean> {
  try {
    let folderPath: string
    
    if (dormName === "Miller" || dormName === "Miller Hall") {
      folderPath = getMillerHallRoomPath(roomNumber)
    } else if (dormName === "10 West" || dormName === "10 west" || dormName === "Ten West") {
      folderPath = getTenWestRoomPath(roomNumber)
    } else {
      return false
    }

    const encodedPath = encodeURIComponent(folderPath)
    const response = await fetch(`/api/backblaze/list?folder=${encodedPath}`)

    if (!response.ok) {
      if (response.status === 401) {
        console.error(`Backblaze authentication failed for adjoining room ${roomNumber}. Check your BACKBLAZE_KEY_ID and BACKBLAZE_APP_KEY environment variables.`)
      } else {
        console.warn(`Failed to check media for adjoining room ${roomNumber}: ${response.status} ${response.statusText}`)
      }
      return false
    }

    const data = await response.json()
    const bathroomFiles = (data.files || []).filter((file: any) => {
      // Filter out empty folder markers
      if (file.fileName.includes('.bzEmpty') || file.contentLength === 0) {
        return false
      }
      // Only include bathroom files
      const fileName = file.fileName.split('/').pop() || ''
      if (!fileName.toLowerCase().includes('bathroom')) {
        return false
      }
      return file.type === 'image' || file.type === 'video'
    })

    return bathroomFiles.length > 0
  } catch (error) {
    console.error(`Error checking bathroom media for adjoining room ${roomNumber}:`, error)
    return false
  }
}

