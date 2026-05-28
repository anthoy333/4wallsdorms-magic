"use client"

import { useState, useEffect } from "react"
import { getMillerHallRoomPath } from "@/app/utils/millerHallMapping"

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
 * Hook to fetch bathroom/shared space media for adjoining rooms from Backblaze
 * 
 * @param roomNumber - One of the room numbers in the adjoining pair (e.g., "201" for "201 + 202")
 * @param dormName - Dorm name (e.g., "Miller")
 * @returns { photos, loading, error }
 */
export function useBackblazeAdjoiningRoomMedia(roomNumber: string, dormName: string = "Miller") {
  const [photos, setPhotos] = useState<RoomPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true)
      setError(null)

      try {
        // Get Backblaze folder path for this room (will be the shared folder like "201 + 202")
        let folderPath: string
        
        if (dormName === "Miller" || dormName === "Miller Hall") {
          folderPath = getMillerHallRoomPath(roomNumber)
        } else {
          throw new Error(`Dorm "${dormName}" not yet mapped`)
        }

        console.log(`🔍 Fetching bathroom media for adjoining room ${roomNumber} from: ${folderPath}`)

        // Fetch files from Backblaze
        const encodedPath = encodeURIComponent(folderPath)
        const response = await fetch(`/api/backblaze/list?folder=${encodedPath}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Failed to fetch files: ${response.statusText}`)
        }

        const data = await response.json()
        console.log(`✅ Found ${data.files?.length || 0} files for adjoining room ${roomNumber}`)

        // Filter files to ONLY include bathroom files (shared space)
        const bathroomFiles = (data.files || []).filter((file: BackblazeFile) => {
          // Skip empty folder markers
          if (file.fileName.includes('.bzEmpty') || file.contentLength === 0) {
            return false
          }
          
          const fileName = file.fileName.split('/').pop() || ''
          
          // ONLY include bathroom files - these are the shared communal spaces
          if (fileName.toLowerCase().includes('bathroom')) {
            return true
          }
          
          console.log(`🚫 Filtered out non-bathroom file: ${fileName} (belongs on individual room page)`)
          return false
        })
        
        console.log(`🚿 Filtered to ${bathroomFiles.length} bathroom files for adjoining room ${roomNumber}`)

        // Convert Backblaze files to RoomPhoto format
        const roomPhotos: RoomPhoto[] = bathroomFiles
          .filter((file: BackblazeFile) => file.type === 'image' || file.type === 'video')
          .map((file: BackblazeFile) => {
            // Extract a caption from filename if possible
            const fileName = file.fileName.split('/').pop() || ''
            const caption = fileName
              .replace(/^sumiller\d+-/, '') // Remove prefix
              .replace(/\.(jpg|jpeg|png|mp4|mov|webm)$/i, '') // Remove extension
              .replace(/-/g, ' ') // Replace dashes with spaces
              .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize words

            return {
              src: file.url, // Uses /api/backblaze/file proxy
              alt: `Adjoining Room ${roomNumber} Bathroom - ${fileName}`,
              caption: caption,
              type: file.type as 'image' | 'video',
              thumbnail: file.type === 'video' ? undefined : file.url,
              // Store original filename for sorting (temporary property)
              _fileName: fileName
            } as RoomPhoto & { _fileName: string }
          })
          // Sort: Photos first (images before videos), plaque photos first within images
          .sort((a, b) => {
            // First, prioritize images over videos
            if (a.type === 'image' && b.type === 'video') return -1
            if (a.type === 'video' && b.type === 'image') return 1
            
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
        console.error(`❌ Error loading bathroom media for adjoining room ${roomNumber}:`, err)
        setError(errorMessage)
        setPhotos([])
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

