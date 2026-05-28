/**
 * RoomPhoto to Tile Converter
 * 
 * Converts existing RoomPhoto objects to Tile objects for backward compatibility.
 */

import type { Tile, CampusRef } from "@/app/types/mediaStrip";
import { classifyOrientation } from "./mediaOrientation";

export interface RoomPhoto {
  src: string;
  alt: string;
  caption?: string;
  type?: 'image' | 'video';
  thumbnail?: string;
  // Optional: dimensions if available
  width?: number;
  height?: number;
}

/**
 * Converts a RoomPhoto to a Tile
 * 
 * @param photo - The RoomPhoto to convert
 * @param options - Configuration options
 * @returns A Tile object ready for MediaStrip
 */
export function roomPhotoToTile(
  photo: RoomPhoto,
  options: {
    id?: string;
    campus?: CampusRef;
    roomNumber?: string;
    buildingId?: string;
    floorId?: string;
    priority?: number;
    colorCategory?: Tile['colorCategory'];
    // If dimensions are available, use them
    width?: number;
    height?: number;
  } = {}
): Tile {
  // Generate ID if not provided
  const tileId = options.id || `tile-${photo.src.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '-') || Date.now()}`;

  // Check if it's a plaque based on filename or caption
  const isPlaque = 
    photo.alt.toLowerCase().includes('plaque') ||
    photo.caption?.toLowerCase().includes('plaque') ||
    photo.src.toLowerCase().includes('plaque');

  // Determine media kind
  const mediaKind: "IMAGE" | "VIDEO" | "PLAQUE" | null = 
    isPlaque ? "PLAQUE" : 
    photo.type === 'video' ? "VIDEO" : 
    photo.type === 'image' ? "IMAGE" : 
    null;

  // Determine orientation if dimensions are available
  let mediaOrientation: "LANDSCAPE" | "PORTRAIT" | "SQUAREISH" | undefined;
  if (options.width && options.height) {
    mediaOrientation = classifyOrientation(options.width, options.height);
  } else if (photo.width && photo.height) {
    mediaOrientation = classifyOrientation(photo.width, photo.height);
  }

  const tile: Tile = {
    id: tileId,
    type: "MEDIA",
    size: "SMALL_TILE", // Will be set by processMediaStrip
    mediaUrl: photo.src,
    mediaKind,
    mediaOrientation,
    state: "IDLE",
    isPressable: true,
    primaryAction: {
      type: "OPEN_MEDIA",
      target: photo.src,
    },
    label: photo.caption || photo.alt,
    subtitle: options.roomNumber ? `Room ${options.roomNumber}` : null,
    colorCategory: options.colorCategory || "DORM",
    isCover: isPlaque, // Mark plaque as potential cover
    priority: options.priority,
    campus: options.campus,
    roomId: options.roomNumber,
    buildingId: options.buildingId,
    floorId: options.floorId,
  };

  return tile;
}

/**
 * Converts an array of RoomPhotos to Tiles
 * 
 * @param photos - Array of RoomPhoto objects
 * @param options - Configuration options applied to all tiles
 * @returns Array of Tile objects
 */
export function roomPhotosToTiles(
  photos: RoomPhoto[],
  options: {
    campus?: CampusRef;
    roomNumber?: string;
    buildingId?: string;
    floorId?: string;
    colorCategory?: Tile['colorCategory'];
  } = {}
): Tile[] {
  return photos.map((photo, index) => 
    roomPhotoToTile(photo, {
      ...options,
      id: `tile-${index}`,
      priority: index + 1, // Default priority based on order
    })
  );
}

