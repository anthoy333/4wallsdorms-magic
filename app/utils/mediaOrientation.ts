/**
 * Media Orientation Utilities
 * 
 * Functions for classifying media orientation and determining tile sizes
 * based on orientation and cover status.
 */

import type { MediaOrientation, TileSize, Tile, ViewContext } from "@/app/types/mediaStrip";

/**
 * Classifies media orientation based on width and height
 * 
 * @param width - Image/video width in pixels
 * @param height - Image/video height in pixels
 * @returns MediaOrientation classification
 */
export function classifyOrientation(width: number, height: number): MediaOrientation {
  const ratio = width / height;

  if (ratio > 1.3) return "LANDSCAPE";
  if (ratio < 0.8) return "PORTRAIT";
  return "SQUAREISH";
}

/**
 * Determines hero size for cover tiles
 * 
 * Cover tiles are always HERO_TILE. The layout will interpret
 * the orientation to render tall or wide based on mediaOrientation.
 * 
 * @param tile - The tile to determine size for
 * @returns Always returns "HERO_TILE" for cover media tiles
 */
export function decideHeroSizeForMedia(tile: Tile): TileSize {
  // Cover tile is always hero, orientation handled at layout level
  return "HERO_TILE";
}

/**
 * Determines tile size for media tiles based on orientation, importance, and context
 * 
 * @param tile - The media tile to size
 * @param isCover - Whether this tile is the cover tile
 * @param context - The view context (ROOM, BUILDING, etc.)
 * @returns Appropriate TileSize based on orientation, role, and context
 */
export function decideSizeForMedia(
  tile: Tile,
  isCover: boolean,
  context?: ViewContext
): TileSize {
  // Room view: all media cards same size
  if (context?.type === "ROOM") {
    return "TALL_TILE"; // Use TALL_TILE for all media in room view (same size for all)
  }

  // Other views keep hero behavior for cover
  if (isCover) {
    return decideHeroSizeForMedia(tile);
  }

  // Optionally, support important secondary media
  // This uses a type assertion to check for optional isImportantMedia flag
  const isImportantMedia = (tile as any).isImportantMedia;

  if (isImportantMedia) {
    switch (tile.mediaOrientation) {
      case "PORTRAIT":
        return "TALL_TILE";
      case "LANDSCAPE":
        return "WIDE_TILE";
      case "SQUAREISH":
      default:
        return "SMALL_TILE";
    }
  }

  // Default sizing based on orientation
  switch (tile.mediaOrientation) {
    case "LANDSCAPE":
      return "WIDE_TILE";   // wide fits landscape dorm shots

    case "PORTRAIT":
      return "TALL_TILE";   // tall fits door or vertical room views

    case "SQUAREISH":
    default:
      return "SMALL_TILE";  // compact tile for square content
  }
}

/**
 * Sets tile size for a media tile based on whether it's the cover and view context
 * 
 * This is a convenience function that determines if a tile is the cover
 * and sets its size accordingly.
 * 
 * @param tile - The tile to size
 * @param coverTileId - The ID of the cover tile
 * @param context - The view context (optional)
 * @returns The tile with updated size
 */
export function setTileSizeForMedia(
  tile: Tile,
  coverTileId: string | null,
  context?: ViewContext
): Tile {
  if (tile.type !== "MEDIA") {
    // Non-media tiles should have size set by configuration
    return tile;
  }

  const isCover = coverTileId !== null && tile.id === coverTileId;
  tile.size = decideSizeForMedia(tile, isCover, context);
  return tile;
}

