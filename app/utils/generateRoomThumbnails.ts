/**
 * Utility to generate room thumbnails from media
 * Priority: video > image > placeholder
 * Ignores files with "plaque" in filename
 */

interface MediaFile {
  fileName: string
  type: 'image' | 'video' | 'unknown'
  url: string
}

interface RoomThumbnail {
  type: 'image' | 'video'
  src: string
  alt: string
}

/**
 * Generates a thumbnail for a room based on available media
 * @param roomNumber - Room number for alt text
 * @param roomType - Room type for alt text
 * @param mediaFiles - Array of media files for the room
 * @returns RoomThumbnail object
 */
export function generateRoomThumbnail(
  roomNumber: string,
  roomType: string,
  mediaFiles: MediaFile[] = []
): RoomThumbnail {
  // Filter out plaque files
  const filteredMedia = mediaFiles.filter(file => 
    !file.fileName.toLowerCase().includes('plaque')
  )

  // Priority 1: Find first video
  const videoFile = filteredMedia.find(file => file.type === 'video')
  if (videoFile) {
    return {
      type: 'video',
      src: videoFile.url,
      alt: `Room ${roomNumber} ${roomType} video tour`
    }
  }

  // Priority 2: Find first image
  const imageFile = filteredMedia.find(file => file.type === 'image')
  if (imageFile) {
    return {
      type: 'image',
      src: imageFile.url,
      alt: `Room ${roomNumber} ${roomType} photo`
    }
  }

  // Priority 3: Use placeholder based on room type
  const placeholderImage = getRoomTypePlaceholder(roomType)
  return {
    type: 'image',
    src: placeholderImage,
    alt: `Room ${roomNumber} ${roomType} placeholder`
  }
}

/**
 * Gets appropriate placeholder image based on room type
 */
function getRoomTypePlaceholder(roomType: string): string {
  const type = roomType.toLowerCase()
  
  switch (type) {
    case 'single':
      return '/minimalist-dorm-room.png'
    case 'double':
      return '/double-dorm-room.png'
    case 'triple':
      return '/triple-dorm-room.png'
    case 'quad':
      return '/quad-dorm-room.png'
    case 'adjoining':
      return '/jack-and-jill-dorm-floorplan.png'
    default:
      return '/double-dorm-room.png'
  }
}

/**
 * Batch generate thumbnails for multiple rooms
 */
export function generateRoomThumbnails(
  rooms: Array<{
    number: string
    type: string
    mediaFiles?: MediaFile[]
  }>
): Array<RoomThumbnail> {
  return rooms.map(room => 
    generateRoomThumbnail(room.number, room.type, room.mediaFiles)
  )
}

/**
 * Fetches media files for a room from Backblaze
 * @param roomNumber - Room number (e.g., "201", "504")
 * @param dormName - Dorm name (e.g., "Miller")
 * @returns Array of MediaFile objects
 */
export async function fetchRoomMediaFiles(roomNumber: string, dormName: string = "Miller"): Promise<MediaFile[]> {
  try {
    // Get Backblaze folder path for this room
    let folderPath: string
    
    if (dormName === "Miller" || dormName === "Miller Hall") {
      const { getMillerHallRoomPath } = await import("@/app/utils/millerHallMapping")
      folderPath = getMillerHallRoomPath(roomNumber)
    } else if (dormName === "10 West" || dormName === "10 west" || dormName === "Ten West") {
      const { getTenWestRoomPath } = await import("@/app/utils/tenWestMapping")
      folderPath = getTenWestRoomPath(roomNumber)
    } else {
      // For other dorms, you'll add their mapping later
      console.warn(`Dorm "${dormName}" not yet mapped, returning empty array`)
      return []
    }

    // Fetch files from Backblaze
    const encodedPath = encodeURIComponent(folderPath)
    console.log(`📁 Fetching media for ${dormName} room ${roomNumber}: ${folderPath}`)
    const response = await fetch(`/api/backblaze/list?folder=${encodedPath}`)

    if (!response.ok) {
      try {
        const errorData = await response.json()
        console.warn(`⚠️ Failed to fetch media for room ${roomNumber} (${dormName}):`, errorData.error)
      } catch (e) {
        console.warn(`⚠️ Failed to fetch media for room ${roomNumber} (${dormName}): HTTP ${response.status}`)
      }
      return []
    }

    const data = await response.json()
    const files = (data.files || []) as Array<{
      fileName: string
      fileId: string
      contentLength: number
      contentType: string
      uploadTimestamp: number
      type: 'image' | 'video' | 'unknown'
      url: string
    }>

    // Filter out empty files and convert to MediaFile format
    const mediaFiles: MediaFile[] = files
      .filter(file => {
        // Skip empty folder markers
        if (file.fileName.includes('.bzEmpty') || file.contentLength === 0) {
          return false
        }
        
        // Filter out bathroom files (belong on shared space page)
        const fileNameLower = file.fileName.toLowerCase()
        if (fileNameLower.includes('bathroom') || 
            fileNameLower.includes('bath') || 
            fileNameLower.includes('toilet') ||
            fileNameLower.includes('shower')) {
          return false
        }
        
        // For 10 West, filter by room number in filename
        if (dormName === "10 West" || dormName === "10 west" || dormName === "Ten West") {
          const fileName = file.fileName.split('/').pop() || ''
          // 10 West pattern: "suwest413A-video(2).mp4" -> extract "413"
          const match = fileName.match(/suwest(\d+[A-Z]?)/i)
          if (match) {
            const fileRoomNumber = match[1].replace(/[A-Z]$/, '')
            const baseRoomNumber = roomNumber.replace(/[A-Z]$/, '')
            // Only include files that match the requested room number
            if (fileRoomNumber !== baseRoomNumber) {
              return false
            }
          } else {
            // If we can't extract room number, exclude the file to be safe
            return false
          }
        }
        
        // Only include image or video files
        return file.type === 'image' || file.type === 'video'
      })
      .map(file => ({
        fileName: file.fileName,
        type: file.type as 'image' | 'video',
        url: file.url
      }))

    return mediaFiles
  } catch (error) {
    console.error(`Error fetching media for room ${roomNumber}:`, error)
    return []
  }
}
