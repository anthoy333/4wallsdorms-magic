/**
 * Integration Examples
 * 
 * Shows how to use the MediaStrip system with your existing Backblaze data.
 */

import { useMediaStrip, useMediaStripFromPhotos } from "@/app/hooks/useMediaStrip"
import { backblazeFilesToTiles } from "@/app/utils/backblazeToTile"
import { roomPhotosToTiles } from "@/app/utils/roomPhotoToTile"
import { processMediaStrip } from "@/app/utils/mediaStripLogic"
import type { MediaStrip, Tile } from "@/app/types/mediaStrip"

/**
 * Example 1: Using the new useMediaStrip hook in a component
 * 
 * This is the recommended way to use MediaStrip with Backblaze data.
 */
export function ExampleUseMediaStripHook() {
  // In a React component:
  /*
  const { strip, loading, error } = useMediaStrip({
    roomNumber: "201",
    dormName: "Miller",
    buildingId: "miller-hall",
    floorId: "floor-2",
    colorCategory: "DORM",
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!strip) return <div>No media found</div>

  // Use the processed strip
  console.log("Cover tile:", strip.coverTileId)
  console.log("Tiles:", strip.tiles)
  */
}

/**
 * Example 2: Converting existing RoomPhoto data to MediaStrip
 * 
 * If you already have RoomPhoto[] from useBackblazeRoomMedia,
 * you can convert it to a MediaStrip.
 */
export function ExampleConvertRoomPhotos() {
  // If you have RoomPhoto[] from useBackblazeRoomMedia:
  /*
  const { photos } = useBackblazeRoomMedia("201", "Miller")
  
  const { strip } = useMediaStripFromPhotos(photos, {
    roomNumber: "201",
    buildingId: "miller-hall",
    colorCategory: "DORM",
  })

  // strip is now a processed MediaStrip ready to use
  */
}

/**
 * Example 3: Manual conversion from Backblaze files
 * 
 * If you have BackblazeFile[] and want to convert manually.
 */
export function ExampleManualConversion() {
  // Simulated Backblaze files
  const backblazeFiles = [
    {
      fileName: "Suffolk University Dorms/Miller/Floor 2/201/sumiller201-plaque.jpg",
      fileId: "file-123",
      contentLength: 123456,
      contentType: "image/jpeg",
      uploadTimestamp: Date.now(),
      type: "image" as const,
      url: "/api/backblaze/file?fileName=...",
    },
    {
      fileName: "Suffolk University Dorms/Miller/Floor 2/201/sumiller201-bedroom.mp4",
      fileId: "file-456",
      contentLength: 567890,
      contentType: "video/mp4",
      uploadTimestamp: Date.now(),
      type: "video" as const,
      url: "/api/backblaze/file?fileName=...",
    },
  ]

  // Convert to tiles
  const tiles = backblazeFilesToTiles(backblazeFiles, {
    roomNumber: "201",
    buildingId: "miller-hall",
    floorId: "floor-2",
    colorCategory: "DORM",
  })

  // Create and process MediaStrip
  const strip: MediaStrip = {
    id: "room-201-strip",
    tiles,
  }

  const processed = processMediaStrip(strip)

  return processed
}

/**
 * Example 4: Using with existing useBackblazeRoomMedia hook
 * 
 * Shows how to integrate with your existing hook for backward compatibility.
 */
export function ExampleWithExistingHook() {
  // You can use both hooks side by side:
  /*
  // Existing hook (still works)
  const { photos, loading, error } = useBackblazeRoomMedia("201", "Miller")
  
  // New hook (for MediaStrip)
  const { strip } = useMediaStrip({
    roomNumber: "201",
    dormName: "Miller",
  })

  // Use whichever format you need
  // - photos: for existing components that expect RoomPhoto[]
  // - strip: for new MediaStrip components
  */
}

/**
 * Example 5: Accessing processed strip data
 * 
 * Shows how to use the processed MediaStrip data.
 */
export function ExampleUsingProcessedStrip(strip: MediaStrip) {
  // Get the cover tile
  const coverTile = strip.tiles.find((t) => t.id === strip.coverTileId)
  console.log("Cover tile:", coverTile?.label)

  // Get all tiles sorted (cover first, then by priority)
  const sortedTiles = strip.tiles
  console.log("Sorted tiles:", sortedTiles.map((t) => t.label))

  // Get tiles by size
  const heroTiles = strip.tiles.filter((t) => t.size === "HERO_TILE")
  const wideTiles = strip.tiles.filter((t) => t.size === "WIDE_TILE")
  const tallTiles = strip.tiles.filter((t) => t.size === "TALL_TILE")
  const smallTiles = strip.tiles.filter((t) => t.size === "SMALL_TILE")

  // Get tiles by orientation
  const landscapeTiles = strip.tiles.filter((t) => t.mediaOrientation === "LANDSCAPE")
  const portraitTiles = strip.tiles.filter((t) => t.mediaOrientation === "PORTRAIT")

  // Get tiles by type
  const mediaTiles = strip.tiles.filter((t) => t.type === "MEDIA")
  const infoTiles = strip.tiles.filter((t) => t.type === "INFO")

  return {
    coverTile,
    sortedTiles,
    heroTiles,
    wideTiles,
    tallTiles,
    smallTiles,
    landscapeTiles,
    portraitTiles,
    mediaTiles,
    infoTiles,
  }
}

