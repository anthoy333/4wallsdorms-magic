/**
 * Backblaze to Tile Converter
 * 
 * Converts BackblazeFile objects to Tile objects for use in MediaStrip.
 */

import type { Tile, CampusRef } from "@/app/types/mediaStrip";
import { classifyOrientation } from "./mediaOrientation";

export interface BackblazeFile {
  fileName: string;
  fileId: string;
  contentLength: number;
  contentType: string;
  uploadTimestamp: number;
  type: 'image' | 'video' | 'unknown';
  url: string;
  // Optional: dimensions if available from server-side detection
  width?: number;
  height?: number;
}

/**
 * Converts a BackblazeFile to a Tile
 * 
 * @param file - The Backblaze file to convert
 * @param options - Configuration options
 * @returns A Tile object ready for MediaStrip
 */
export function backblazeFileToTile(
  file: BackblazeFile,
  options: {
    campus?: CampusRef;
    roomNumber?: string;
    buildingId?: string;
    floorId?: string;
    priority?: number;
    colorCategory?: Tile['colorCategory'];
    // If dimensions are available, use them; otherwise orientation will be set later
    width?: number;
    height?: number;
  } = {}
): Tile {
  const fileName = file.fileName.split('/').pop() || '';
  const fileNameLower = fileName.toLowerCase();
  
  // Determine if it's a plaque
  const isPlaque = fileNameLower.includes('plaque');
  
  // Determine media kind
  const mediaKind: "IMAGE" | "VIDEO" | "PLAQUE" | null = 
    isPlaque ? "PLAQUE" : 
    file.type === 'video' ? "VIDEO" : 
    file.type === 'image' ? "IMAGE" : 
    null;

  // Extract caption from filename
  const caption = fileName
    .replace(/^sumiller\d+-/, '') // Remove prefix
    .replace(/\.(jpg|jpeg|png|mp4|mov|webm)$/i, '') // Remove extension
    .replace(/-/g, ' ') // Replace dashes with spaces
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize words

  // Determine orientation if dimensions are available
  let mediaOrientation: "LANDSCAPE" | "PORTRAIT" | "SQUAREISH" | undefined;
  if (options.width && options.height) {
    mediaOrientation = classifyOrientation(options.width, options.height);
  } else if (file.width && file.height) {
    mediaOrientation = classifyOrientation(file.width, file.height);
  }

  // Generate tile ID from file ID or filename
  const tileId = `tile-${file.fileId || fileName.replace(/[^a-zA-Z0-9]/g, '-')}`;

  // Determine priority: plaque gets priority 1, others based on options or default
  const priority = options.priority ?? (isPlaque ? 1 : undefined);

  const tile: Tile = {
    id: tileId,
    type: "MEDIA",
    size: "SMALL_TILE", // Will be set by processMediaStrip
    mediaUrl: file.url,
    mediaKind,
    mediaOrientation,
    state: "IDLE",
    isPressable: true,
    primaryAction: {
      type: "OPEN_MEDIA",
      target: file.url,
    },
    label: caption || fileName,
    subtitle: options.roomNumber ? `Room ${options.roomNumber}` : null,
    colorCategory: options.colorCategory || "DORM",
    isCover: isPlaque, // Mark plaque as potential cover
    priority,
    campus: options.campus,
    roomId: options.roomNumber,
    buildingId: options.buildingId,
    floorId: options.floorId,
  };

  return tile;
}

/**
 * Converts an array of BackblazeFiles to Tiles
 * 
 * @param files - Array of Backblaze files
 * @param options - Configuration options applied to all tiles
 * @returns Array of Tile objects
 */
export function backblazeFilesToTiles(
  files: BackblazeFile[],
  options: {
    campus?: CampusRef;
    roomNumber?: string;
    buildingId?: string;
    floorId?: string;
    colorCategory?: Tile['colorCategory'];
  } = {}
): Tile[] {
  return files
    .filter((file) => file.type === 'image' || file.type === 'video')
    .map((file, index) => 
      backblazeFileToTile(file, {
        ...options,
        priority: index + 1, // Default priority based on order
      })
    );
}

