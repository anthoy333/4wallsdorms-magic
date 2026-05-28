/**
 * MediaStrip Logic Utilities
 * 
 * Functions for selecting cover tiles and sorting tiles in a media strip.
 * These functions implement the core business logic for tile ordering and selection.
 */

import type { Tile, MediaStrip, ViewContext } from "@/app/types/mediaStrip";
import { setTileSizeForMedia } from "./mediaOrientation";

/**
 * Selects the cover tile from an array of tiles
 * 
 * Priority order:
 * 1. Explicit MEDIA PLAQUE tile marked as cover
 * 2. First MEDIA PLAQUE tile found
 * 3. First MEDIA tile found
 * 4. null if no media tiles exist
 * 
 * @param tiles - Array of tiles to search
 * @returns The ID of the selected cover tile, or null if none found
 */
export function selectCoverTile(tiles: Tile[]): string | null {
  // 1. First choice: explicit MEDIA PLAQUE tile marked as cover
  const explicit = tiles.find(
    (t) => t.type === "MEDIA" && t.mediaKind === "PLAQUE" && t.isCover
  );
  if (explicit) return explicit.id;

  // 2. Second choice: first MEDIA PLAQUE tile
  const firstPlaque = tiles.find(
    (t) => t.type === "MEDIA" && t.mediaKind === "PLAQUE"
  );
  if (firstPlaque) return firstPlaque.id;

  // 3. Third choice: first MEDIA tile
  const firstMedia = tiles.find((t) => t.type === "MEDIA");
  if (firstMedia) return firstMedia.id;

  // 4. If no media at all, return null
  return null;
}

/**
 * Sorts tiles for display in the media strip
 * 
 * Sorting order:
 * 1. Cover tile always first
 * 2. Priority sorting (lower numbers first)
 * 3. Original order maintained for ties
 * 
 * After sorting, also sets tile sizes for MEDIA tiles based on cover status and context.
 * 
 * @param strip - The MediaStrip to sort
 * @param context - The view context (optional, for room view uniform sizing)
 * @returns Sorted array of tiles with sizes set appropriately
 */
export function sortTilesForStrip(strip: MediaStrip, context?: ViewContext): Tile[] {
  const tiles = [...strip.tiles];
  const coverId = strip.coverTileId || selectCoverTile(tiles);

  // Update strip with selected cover ID if not already set
  if (!strip.coverTileId && coverId) {
    strip.coverTileId = coverId;
  }

  // Sort tiles
  tiles.sort((a, b) => {
    // 1. Cover tile always first
    if (a.id === coverId) return -1;
    if (b.id === coverId) return 1;

    // 2. Priority sorting if defined
    const pa = a.priority ?? 999;
    const pb = b.priority ?? 999;
    if (pa !== pb) return pa - pb;

    // 3. Fallback to original order
    return 0;
  });

  // After sorting, set sizes for MEDIA tiles
  return tiles.map((tile) => setTileSizeForMedia(tile, coverId, context));
}

/**
 * Processes a MediaStrip: selects cover, sorts tiles, and sets sizes
 * 
 * This is a convenience function that does all the processing in one call.
 * 
 * @param strip - The MediaStrip to process
 * @param context - The view context (optional, for room view uniform sizing)
 * @returns The processed MediaStrip with sorted tiles and cover selected
 */
export function processMediaStrip(strip: MediaStrip, context?: ViewContext): MediaStrip {
  const sortedTiles = sortTilesForStrip(strip, context);
  
  return {
    ...strip,
    tiles: sortedTiles,
    coverTileId: strip.coverTileId || selectCoverTile(sortedTiles),
  };
}

