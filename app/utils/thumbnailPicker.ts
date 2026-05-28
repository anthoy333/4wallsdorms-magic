/**
 * Thumbnail Picker Utility
 * 
 * Automatically selects the best thumbnail for a room based on available media
 * Priority order: video > image > placeholder
 * Ignores any media with "plaque" in the filename
 */

export interface MediaFile {
  fileName: string
  fileId: string
  contentType: string
  type: 'image' | 'video' | 'unknown'
  url: string
}

export interface RoomThumbnail {
  type: 'image' | 'video'
  src: string
  alt: string
}

/**
 * Picks the best thumbnail from available media files
 * @param mediaFiles - Array of media files for the room
 * @param roomNumber - Room number for alt text
 * @param roomType - Room type for alt text
 * @returns RoomThumbnail object or null if no suitable media found
 */
export function pickRoomThumbnail(
  mediaFiles: MediaFile[], 
  roomNumber: string, 
  roomType: string
): RoomThumbnail | null {
  if (!mediaFiles || mediaFiles.length === 0) {
    return null
  }

  // Filter out plaque images and unknown file types
  const validMedia = mediaFiles.filter(file => {
    const fileName = file.fileName.toLowerCase()
    const isPlaque = fileName.includes('plaque')
    const isValidType = file.type === 'image' || file.type === 'video'
    return !isPlaque && isValidType
  })

  if (validMedia.length === 0) {
    return null
  }

  // Priority 1: Look for videos first
  const videos = validMedia.filter(file => file.type === 'video')
  if (videos.length > 0) {
    const video = videos[0] // Take the first video
    return {
      type: 'video',
      src: video.url,
      alt: `Room ${roomNumber} ${roomType} - Video Tour`
    }
  }

  // Priority 2: Look for images
  const images = validMedia.filter(file => file.type === 'image')
  if (images.length > 0) {
    const image = images[0] // Take the first image
    return {
      type: 'image',
      src: image.url,
      alt: `Room ${roomNumber} ${roomType} - Photo`
    }
  }

  // No suitable media found
  return null
}

/**
 * Gets a generic placeholder thumbnail
 * @param roomNumber - Room number for alt text
 * @param roomType - Room type for alt text and image selection
 * @returns RoomThumbnail with placeholder image
 */
export function getPlaceholderThumbnail(roomNumber: string, roomType: string): RoomThumbnail {
  // Select placeholder based on room type
  let placeholderSrc = "/double-dorm-room.png" // default
  
  switch (roomType.toLowerCase()) {
    case "single":
      placeholderSrc = "/minimalist-dorm-room.png"
      break
    case "double":
      placeholderSrc = "/double-dorm-room.png"
      break
    case "triple":
      placeholderSrc = "/triple-dorm-room.png"
      break
    case "quad":
      placeholderSrc = "/quad-dorm-room.png"
      break
    case "adjoining":
      placeholderSrc = "/jack-and-jill-dorm-floorplan.png"
      break
    default:
      placeholderSrc = "/double-dorm-room.png"
  }

  return {
    type: 'image',
    src: placeholderSrc,
    alt: `Room ${roomNumber} ${roomType} - Placeholder`
  }
}

/**
 * Gets thumbnail for a room, with automatic fallback to placeholder
 * @param mediaFiles - Array of media files for the room
 * @param roomNumber - Room number
 * @param roomType - Room type
 * @returns RoomThumbnail object (never null, falls back to placeholder)
 */
export function getRoomThumbnailWithFallback(
  mediaFiles: MediaFile[], 
  roomNumber: string, 
  roomType: string
): RoomThumbnail {
  const thumbnail = pickRoomThumbnail(mediaFiles, roomNumber, roomType)
  
  if (thumbnail) {
    return thumbnail
  }
  
  // Fallback to placeholder
  return getPlaceholderThumbnail(roomNumber, roomType)
}
