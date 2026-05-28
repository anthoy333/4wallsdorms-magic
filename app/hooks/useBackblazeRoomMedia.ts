"use client"

import { useState, useEffect } from "react"
import { getMillerHallRoomPath, extractRoomNumberFromFileName, getMillerHallRoomNumbersInUnit } from "@/app/utils/millerHallMapping"

interface BackblazeFile {
  fileName: string
  fileId: string
  contentLength: number
  contentType: string
  uploadTimestamp: number
  type: 'image' | 'video' | 'unknown'
  url: string
}

interface RoomPhoto {
  src: string
  alt: string
  caption?: string
  type?: 'image' | 'video'
  thumbnail?: string
}

/**
 * Hook to fetch room media from Backblaze and convert to RoomPhoto format
 * 
 * @param roomNumber - Room number (e.g., "201", "504")
 * @param dormName - Dorm name (e.g., "Miller")
 * @returns { photos, loading, error }
 */
export function useBackblazeRoomMedia(roomNumber: string, dormName: string = "Miller") {
  const [photos, setPhotos] = useState<RoomPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true)
      setError(null)

      try {
        // Get Backblaze folder path for this room
        let folderPath: string
        
        if (dormName === "Miller" || dormName === "Miller Hall") {
          folderPath = getMillerHallRoomPath(roomNumber)
        } else if (dormName === "10 West" || dormName === "10 west" || dormName === "Ten West") {
          const { getTenWestRoomPath } = await import("@/app/utils/tenWestMapping")
          folderPath = getTenWestRoomPath(roomNumber)
        } else {
          // For other dorms, you'll add their mapping later
          throw new Error(`Dorm "${dormName}" not yet mapped`)
        }

        console.log(`🔍 Fetching media for room ${roomNumber} (${dormName}) from: ${folderPath}`)

        // Fetch files from Backblaze
        // encodeURIComponent properly encodes + as %2B, which should work
        const encodedPath = encodeURIComponent(folderPath)
        console.log(`📡 Encoded path: ${encodedPath}`)
        const response = await fetch(`/api/backblaze/list?folder=${encodedPath}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.warn(`⚠️ Backblaze API error for room ${roomNumber} (${response.status}):`, errorData)
          const detail = errorData.details || errorData.error || `HTTP ${response.status} ${response.statusText}`
          throw new Error(detail)
        }

        const data = await response.json()
        console.log(`✅ Found ${data.files?.length || 0} files for room ${roomNumber} (${dormName})`)
        if (data.files && data.files.length > 0) {
          console.log(`📋 All files before filtering:`, (data.files || []).map((f: BackblazeFile) => f.fileName.split('/').pop()))
        } else {
          console.warn(`⚠️ No files found in folder: ${folderPath}`)
        }

        // Filter files to only include those that belong to this specific room
        // For adjoining rooms (like 201 + 202), we need to check the filename
        const roomFiles = (data.files || []).filter((file: BackblazeFile) => {
          // Skip empty folder markers
          if (file.fileName.includes('.bzEmpty') || file.contentLength === 0) {
            console.log(`🚫 Filtered out empty file: ${file.fileName}`)
            return false
          }
          
          // Extract room number from filename
          const fileName = file.fileName.split('/').pop() || ''
          const fileNameLower = fileName.toLowerCase()
          
          
          // Exclude bathroom files - they belong on the shared space page, not individual room pages
          // Check for various bathroom-related terms
          if (fileNameLower.includes('bathroom') || 
              fileNameLower.includes('bath') || 
              fileNameLower.includes('toilet') ||
              fileNameLower.includes('shower')) {
            console.log(`🚫 Filtered out bathroom/shared space file: ${fileName} (belongs on shared space page)`)
            return false
          }
          
          // For 10 West, if files are in the correct folder path, they belong to that room
          // The folder path already ensures we're in the right room folder
          // So we just need to verify the filename pattern matches 10 West format
          if (dormName === "10 West" || dormName === "10 west" || dormName === "Ten West") {
            // 10 West files should start with "suwest" followed by room number
            // Pattern: "suwest413A-video(2).mp4" or "suwest413-..."
            const baseRoomNumber = roomNumber.replace(/[A-Z]$/, '')
            const match = fileName.match(/suwest(\d+[A-Z]?)/i)
            if (match) {
              const fileRoomNumber = match[1].replace(/[A-Z]$/, '')
              if (fileRoomNumber === baseRoomNumber) {
                console.log(`✅ Including 10 West file: ${fileName} (room ${fileRoomNumber} matches ${baseRoomNumber})`)
                return true
              }
            }
            // If file doesn't match pattern, exclude it
            console.log(`🚫 Filtered out 10 West file: ${fileName} (doesn't match suwest pattern)`)
            return false
          }
          
          // For Miller Hall, include files that match this room OR its adjoining pair (shared folder)
          // e.g. room 1005 and 1006 both show all media from "1005 + 1006" folder
          if (dormName === "Miller" || dormName === "Miller Hall") {
            const fileRoomNumber = extractRoomNumberFromFileName(file.fileName)
            const allowedRooms = getMillerHallRoomNumbersInUnit(roomNumber)
            const allowedSet = new Set(allowedRooms.map((r) => r.replace(/[A-Z]$/, '')))
            if (fileRoomNumber && allowedSet.has(fileRoomNumber)) {
              console.log(`✅ Including Miller file: ${fileName} (room ${fileRoomNumber} in unit ${allowedRooms.join(', ')})`)
              return true
            }
            // Include if filename contains any allowed room number (e.g. "1005millersuffolk(1).jpg")
            if (!fileRoomNumber && allowedRooms.some((r) => file.fileName.includes(r))) {
              console.log(`✅ Including Miller file: ${fileName} (filename contains room in unit ${allowedRooms.join(', ')})`)
              return true
            }
            console.log(`🚫 Filtered out Miller file: ${fileName} (room ${fileRoomNumber} not in unit ${allowedRooms.join(', ')})`)
            return false
          }
          
          // Default: include file if it's in the folder (for other dorms)
          console.log(`✅ Including file by default: ${fileName}`)
          return true
        })
        
        console.log(`📸 Filtered to ${roomFiles.length} files for room ${roomNumber}`)

        // Convert Backblaze files to RoomPhoto format
        const roomPhotos: RoomPhoto[] = roomFiles
          .filter((file: BackblazeFile) => file.type === 'image' || file.type === 'video')
          .map((file: BackblazeFile) => {
            // Extract a caption from filename if possible
            const fileName = file.fileName.split('/').pop() || ''
            let caption = fileName
            
            // Remove prefix based on dorm
            if (dormName === "Miller" || dormName === "Miller Hall") {
              caption = caption.replace(/^sumiller\d+-/, '') // Remove sumiller prefix
            } else if (dormName === "10 West" || dormName === "10 west" || dormName === "Ten West") {
              caption = caption.replace(/^suwest\d+[A-Z]?-/, '') // Remove suwest prefix (e.g., suwest413A-)
            }
            
            caption = caption
              .replace(/\.(jpg|jpeg|png|mp4|mov|webm)$/i, '') // Remove extension
              .replace(/\((\d+)\)/g, '') // Remove numbers in parentheses like (2)
              .replace(/-/g, ' ') // Replace dashes with spaces
              .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize words

            return {
              src: file.url, // Uses /api/backblaze/file proxy
              alt: `Room ${roomNumber} - ${fileName}`,
              caption: caption,
              type: file.type as 'image' | 'video',
              // For videos, we could extract a frame as thumbnail later
              thumbnail: file.type === 'video' ? undefined : file.url,
              // Store original filename for sorting (temporary property)
              _fileName: fileName
            } as RoomPhoto & { _fileName: string }
          })
          // Sort: Videos first, then photos, plaque photos first within images
          .sort((a, b) => {
            // First, prioritize videos over images
            if (a.type === 'video' && b.type === 'image') return -1
            if (a.type === 'image' && b.type === 'video') return 1
            
            // If both are images, prioritize plaque photos
            if (a.type === 'image' && b.type === 'image') {
              const aIsPlaque = (a as any)._fileName?.toLowerCase().includes('plaque') || false
              const bIsPlaque = (b as any)._fileName?.toLowerCase().includes('plaque') || false
              if (aIsPlaque && !bIsPlaque) return -1
              if (!aIsPlaque && bIsPlaque) return 1
            }
            
            // Otherwise maintain original order
            return 0
          })
          // Remove the temporary _fileName property
          .map(({ _fileName, ...photo }) => photo as RoomPhoto)

        setPhotos(roomPhotos)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load media"
        console.error(`❌ Error loading media for room ${roomNumber}:`, err)
        setError(errorMessage)
        setPhotos([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }

    if (roomNumber) {
      fetchMedia()
    }
  }, [roomNumber, dormName])

  return { photos, loading, error }
}

