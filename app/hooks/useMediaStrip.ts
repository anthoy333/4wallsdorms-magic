"use client"

import { useState, useEffect, useMemo } from "react"
import type { MediaStrip, Tile } from "@/app/types/mediaStrip"
import type { CampusRef, Tile, MediaStrip, ViewContext } from "@/app/types/mediaStrip"
import { processMediaStrip } from "@/app/utils/mediaStripLogic"
import { backblazeFilesToTiles, type BackblazeFile } from "@/app/utils/backblazeToTile"
import { roomPhotosToTiles } from "@/app/utils/roomPhotoToTile"
import { getMillerHallRoomPath, extractRoomNumberFromFileName } from "@/app/utils/millerHallMapping"
import { CAMPUSES } from "@/app/utils/campusHelpers"
import { useDetectMediaOrientation } from "./useDetectMediaOrientation"

interface UseMediaStripOptions {
  roomNumber: string
  dormName?: string
  campus?: CampusRef // Structured campus reference
  buildingId?: string
  floorId?: string
  colorCategory?: Tile['colorCategory']
  context?: ViewContext // View context for size determination (e.g., ROOM view)
  // Optional: if you already have Backblaze files, pass them here
  initialFiles?: BackblazeFile[]
}

/**
 * Hook to fetch room media from Backblaze and return as a processed MediaStrip
 * 
 * This hook:
 * 1. Fetches media from Backblaze (or uses provided files)
 * 2. Converts Backblaze files to Tiles
 * 3. Processes the MediaStrip (selects cover, sorts, sets sizes)
 * 4. Returns the processed MediaStrip ready for rendering
 * 
 * @param options - Configuration options
 * @returns { strip, loading, error }
 */
export function useMediaStrip(options: UseMediaStripOptions) {
  const { 
    roomNumber, 
    dormName = "Miller", 
    campus = CAMPUSES.suffolkUniversity, // Default to Suffolk University
    buildingId, 
    floorId, 
    colorCategory,
    context,
    initialFiles 
  } = options
  
  const [strip, setStrip] = useState<MediaStrip | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Detect orientation client-side if not available
  const stripWithOrientation = useDetectMediaOrientation(strip, true, context)

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true)
      setError(null)

      try {
        let files: BackblazeFile[]

        // If files are provided, use them; otherwise fetch from Backblaze
        if (initialFiles) {
          files = initialFiles
        } else {
          // Get Backblaze folder path for this room
          let folderPath: string
          
          if (dormName === "Miller" || dormName === "Miller Hall") {
            folderPath = getMillerHallRoomPath(roomNumber)
          } else {
            throw new Error(`Dorm "${dormName}" not yet mapped`)
          }

          // Fetch files from Backblaze
          const encodedPath = encodeURIComponent(folderPath)
          const response = await fetch(`/api/backblaze/list?folder=${encodedPath}`)

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `Failed to fetch files: ${response.statusText}`)
          }

          const data = await response.json()
          
          // Filter files to only include those that belong to this specific room
          files = (data.files || []).filter((file: BackblazeFile) => {
            // Skip empty folder markers
            if (file.fileName.includes('.bzEmpty') || file.contentLength === 0) {
              return false
            }
            
            // Extract room number from filename
            const fileName = file.fileName.split('/').pop() || ''
            const fileNameLower = fileName.toLowerCase()
            const fileRoomNumber = extractRoomNumberFromFileName(file.fileName)
            
            // Exclude bathroom files for individual room pages
            if (fileNameLower.includes('bathroom') || 
                fileNameLower.includes('bath') || 
                fileNameLower.includes('toilet') ||
                fileNameLower.includes('shower')) {
              return false
            }
            
            // Only include files that match the requested room number
            return fileRoomNumber === roomNumber
          })
        }

        // Convert Backblaze files to Tiles
        const tiles = backblazeFilesToTiles(files, {
          campus,
          roomNumber,
          buildingId,
          floorId,
          colorCategory,
        })

        // Create MediaStrip
        const mediaStrip: MediaStrip = {
          id: `strip-${roomNumber}-${dormName}`,
          tiles,
        }

        // Process the strip (selects cover, sorts, sets sizes)
        const processed = processMediaStrip(mediaStrip, context)

        setStrip(processed)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load media"
        console.error(`❌ Error loading media strip for room ${roomNumber}:`, err)
        setError(errorMessage)
        setStrip(null)
      } finally {
        setLoading(false)
      }
    }

    if (roomNumber) {
      fetchMedia()
    }
  }, [roomNumber, dormName, campus, buildingId, floorId, colorCategory, context, initialFiles])

  return { strip: stripWithOrientation, loading, error }
}

/**
 * Hook that returns a processed MediaStrip from existing RoomPhoto data
 * 
 * This is useful for backward compatibility with existing code that uses RoomPhoto[]
 * 
 * @param photos - Array of RoomPhoto objects
 * @param options - Configuration options
 * @returns Processed MediaStrip
 */
export function useMediaStripFromPhotos(
  photos: Array<{
    src: string
    alt: string
    caption?: string
    type?: 'image' | 'video'
    thumbnail?: string
    width?: number
    height?: number
  }>,
  options: {
    campus?: CampusRef
    roomNumber?: string
    buildingId?: string
    floorId?: string
    colorCategory?: Tile['colorCategory']
  } = {}
) {
  const strip = useMemo(() => {
    if (!photos || photos.length === 0) {
      return null
    }

    // Convert RoomPhotos to Tiles
    const tiles = roomPhotosToTiles(photos, options)

    // Create and process MediaStrip
    const mediaStrip: MediaStrip = {
      id: `strip-${options.roomNumber || 'photos'}`,
      tiles,
    }

    return processMediaStrip(mediaStrip)
  }, [photos, options.campus, options.roomNumber, options.buildingId, options.floorId, options.colorCategory])

  return { strip, loading: false, error: null }
}

