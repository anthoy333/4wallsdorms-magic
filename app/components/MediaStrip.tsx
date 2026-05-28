"use client"

import { useMediaStrip } from "@/app/hooks/useMediaStrip"
import { CAMPUSES } from "@/app/utils/campusHelpers"
import type { Tile, ViewContext } from "@/app/types/mediaStrip"
import Image from "next/image"

interface MediaStripProps {
  roomNumber: string
  dormName?: string
  buildingId?: string
  floorId?: string
  className?: string
  context?: ViewContext // View context (e.g., ROOM for uniform sizing)
}

/**
 * Visual MediaStrip Component
 * 
 * Displays a horizontal scrolling strip of media tiles with proper sizing
 * based on orientation and cover status.
 */
export function MediaStrip({
  roomNumber,
  dormName = "Miller",
  buildingId,
  floorId,
  className = "",
  context,
}: MediaStripProps) {
  const { strip, loading, error } = useMediaStrip({
    roomNumber,
    dormName,
    campus: CAMPUSES.suffolkUniversity,
    buildingId,
    floorId,
    colorCategory: "DORM",
    context,
  })

  const isRoomContext = context?.type === "ROOM"

  if (loading) {
    return (
      <div className={`media-strip ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading media...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`media-strip ${className}`}>
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!strip || strip.tiles.length === 0) {
    return (
      <div className={`media-strip ${className}`}>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No media found for room {roomNumber}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`media-strip hscroll ${isRoomContext ? "media-strip-room" : ""} ${className}`}
      aria-label="Media strip"
    >
      <div className="media-strip-row">
        {strip.tiles.map((tile) => (
          <MediaTile
            key={tile.id}
            tile={tile}
            isCover={tile.id === strip.coverTileId}
            isRoomContext={isRoomContext}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Individual Media Tile Component
 */
function MediaTile({
  tile,
  isCover,
  isRoomContext,
}: {
  tile: Tile
  isCover: boolean
  isRoomContext: boolean
}) {
  const sizeClass = getSizeClass(tile.size, tile.mediaOrientation, isCover, isRoomContext)

  if (tile.type !== "MEDIA" || !tile.mediaUrl) {
    return (
      <div className={`media-tile ${sizeClass} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center p-4">
          <p className="text-sm font-semibold">{tile.label || "Tile"}</p>
          {tile.subtitle && <p className="text-xs text-gray-600">{tile.subtitle}</p>}
        </div>
      </div>
    )
  }

  const isVideo = tile.mediaKind === "VIDEO"
  const isImage = tile.mediaKind === "IMAGE" || tile.mediaKind === "PLAQUE"

  return (
    <div className={`media-tile ${sizeClass} relative group`}>
      {isImage ? (
        <Image
          src={tile.mediaUrl}
          alt={tile.label || tile.subtitle || "Media"}
          fill
          className="media-cover object-cover"
          unoptimized
          sizes="(max-width: 480px) 220px, (max-width: 900px) 240px, 280px"
        />
      ) : isVideo ? (
        <video
          src={tile.mediaUrl}
          className="media-cover object-cover"
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
        />
      ) : null}

      {/* Cover Badge */}
      {isCover && (
        <span className="media-tile-badge absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
          Cover
        </span>
      )}

      {/* Size/Orientation Badge (for debugging) */}
      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {tile.size} {tile.mediaOrientation ? `• ${tile.mediaOrientation}` : ""}
      </div>

      {/* Label Overlay (optional) */}
      {tile.label && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-sm font-semibold">{tile.label}</p>
          {tile.subtitle && <p className="text-white/80 text-xs">{tile.subtitle}</p>}
        </div>
      )}
    </div>
  )
}

/**
 * Maps TileSize to CSS classes based on orientation, cover status, and context
 */
function getSizeClass(
  size: Tile["size"],
  orientation: Tile["mediaOrientation"],
  isCover: boolean,
  isRoomContext: boolean
): string {
  // Room context: all tiles use same size class (uniform cards)
  if (isRoomContext) {
    return "media-tile--room" // All tiles same size in room view
  }

  // Non-room context: use size-based classes
  if (isCover) {
    // Cover tiles are HERO - use orientation to determine width/height
    if (orientation === "PORTRAIT") {
      return "media-tile--tall-hero" // Tall hero for portrait cover
    } else if (orientation === "LANDSCAPE") {
      return "media-tile--wide-hero" // Wide hero for landscape cover
    } else {
      return "media-tile--hero" // Default hero
    }
  }

  // Non-cover tiles
  switch (size) {
    case "WIDE_TILE":
      return "media-tile--wide"
    case "TALL_TILE":
      return "media-tile--tall"
    case "HERO_TILE":
      return "media-tile--hero"
    case "SMALL_TILE":
    default:
      return "media-tile--narrow"
  }
}

