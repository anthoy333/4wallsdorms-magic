"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import type { MediaOrientation, ViewContext } from "@/app/types/mediaStrip"
import { classifyOrientation } from "@/app/utils/mediaOrientation"
import { processMediaStrip } from "@/app/utils/mediaStripLogic"
import type { MediaStrip, Tile } from "@/app/types/mediaStrip"

/**
 * Detects media orientation by loading images/videos and reading their dimensions
 * 
 * This hook updates tiles with orientation information as media loads.
 * It's a client-side fallback when server-side dimensions aren't available.
 */
export function useDetectMediaOrientation(
  strip: MediaStrip | null,
  enabled: boolean = true,
  context?: ViewContext
): MediaStrip | null {
  const [detectedOrientations, setDetectedOrientations] = useState<
    Record<string, MediaOrientation>
  >({})
  const detectingRef = useRef<Set<string>>(new Set())

  // Detect orientation for tiles that need it
  useEffect(() => {
    if (!strip || !enabled) return

    const tilesNeedingDetection = strip.tiles.filter(
      (tile) =>
        tile.type === "MEDIA" &&
        tile.mediaUrl &&
        !tile.mediaOrientation &&
        !detectedOrientations[tile.id] &&
        !detectingRef.current.has(tile.id)
    )

    tilesNeedingDetection.forEach((tile) => {
      if (!tile.mediaUrl) return

      detectingRef.current.add(tile.id)

      const isImage = tile.mediaKind === "IMAGE" || tile.mediaKind === "PLAQUE" || !tile.mediaKind

      if (isImage) {
        const img = new Image()
        img.onload = () => {
          const orientation = classifyOrientation(img.naturalWidth, img.naturalHeight)
          setDetectedOrientations((prev) => ({
            ...prev,
            [tile.id]: orientation,
          }))
          detectingRef.current.delete(tile.id)
        }
        img.onerror = () => {
          setDetectedOrientations((prev) => ({
            ...prev,
            [tile.id]: "SQUAREISH",
          }))
          detectingRef.current.delete(tile.id)
        }
        img.src = tile.mediaUrl
      } else if (tile.mediaKind === "VIDEO") {
        const video = document.createElement("video")
        video.onloadedmetadata = () => {
          const orientation = classifyOrientation(video.videoWidth, video.videoHeight)
          setDetectedOrientations((prev) => ({
            ...prev,
            [tile.id]: orientation,
          }))
          detectingRef.current.delete(tile.id)
        }
        video.onerror = () => {
          setDetectedOrientations((prev) => ({
            ...prev,
            [tile.id]: "SQUAREISH",
          }))
          detectingRef.current.delete(tile.id)
        }
        video.src = tile.mediaUrl
        video.load()
      }
    })
  }, [strip, enabled])

  // Return updated strip with detected orientations applied
  return useMemo(() => {
    if (!strip) return null

    const hasDetections = Object.keys(detectedOrientations).length > 0
    if (!hasDetections) return strip

    const updatedTiles: Tile[] = strip.tiles.map((tile) => {
      const orientation = detectedOrientations[tile.id]
      if (orientation && tile.type === "MEDIA" && !tile.mediaOrientation) {
        return { ...tile, mediaOrientation: orientation }
      }
      return tile
    })

    const updatedStrip: MediaStrip = {
      ...strip,
      tiles: updatedTiles,
    }

    return processMediaStrip(updatedStrip, context)
  }, [strip, detectedOrientations, context])
}
