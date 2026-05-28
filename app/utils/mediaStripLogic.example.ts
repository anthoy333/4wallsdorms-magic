/**
 * MediaStrip Logic - Example Usage
 * 
 * This file demonstrates how to use the MediaStrip utilities.
 * You can use this as a reference or test file.
 */

import type { MediaStrip, Tile } from "@/app/types/mediaStrip";
import { processMediaStrip, selectCoverTile } from "./mediaStripLogic";
import { classifyOrientation, decideSizeForMedia } from "./mediaOrientation";

/**
 * Example: Creating tiles with different properties
 */
export function createExampleTiles(): Tile[] {
  return [
    // Cover tile - Plaque image (should be selected as cover)
    {
      id: "tile-1",
      type: "MEDIA",
      size: "SMALL_TILE", // Will be updated by processMediaStrip
      mediaUrl: "/images/room-201-plaque.jpg",
      mediaKind: "PLAQUE",
      mediaOrientation: "LANDSCAPE", // Plaque is usually landscape
      state: "IDLE",
      isPressable: true,
      primaryAction: {
        type: "OPEN_MEDIA",
        target: "/images/room-201-plaque.jpg",
      },
      colorCategory: "DORM",
      label: "Room 201 Plaque",
      priority: 1, // Lower number = higher priority
    },

    // Regular media tile - Landscape bedroom photo
    {
      id: "tile-2",
      type: "MEDIA",
      size: "SMALL_TILE", // Will be updated to WIDE_TILE
      mediaUrl: "/videos/room-201-bedroom.mp4",
      mediaKind: "VIDEO",
      mediaOrientation: "LANDSCAPE", // 1920x1080 = landscape
      state: "IDLE",
      isPressable: true,
      primaryAction: {
        type: "OPEN_MEDIA",
        target: "/videos/room-201-bedroom.mp4",
      },
      colorCategory: "DORM",
      label: "Bedroom Tour",
      priority: 2,
    },

    // Portrait tile - Door photo
    {
      id: "tile-3",
      type: "MEDIA",
      size: "SMALL_TILE", // Will be updated to TALL_TILE
      mediaUrl: "/images/room-201-door.jpg",
      mediaKind: "IMAGE",
      mediaOrientation: "PORTRAIT", // 1080x1920 = portrait
      state: "IDLE",
      isPressable: true,
      primaryAction: {
        type: "OPEN_MEDIA",
        target: "/images/room-201-door.jpg",
      },
      colorCategory: "DORM",
      label: "Room Door",
      priority: 3,
    },

    // Square tile - Room corner
    {
      id: "tile-4",
      type: "MEDIA",
      size: "SMALL_TILE", // Will stay SMALL_TILE
      mediaUrl: "/images/room-201-corner.jpg",
      mediaKind: "IMAGE",
      mediaOrientation: "SQUAREISH", // 1080x1080 = square
      state: "IDLE",
      isPressable: true,
      primaryAction: {
        type: "OPEN_MEDIA",
        target: "/images/room-201-corner.jpg",
      },
      colorCategory: "DORM",
      label: "Room Corner",
      priority: 4,
    },

    // Non-media tile - Info tile
    {
      id: "tile-5",
      type: "INFO",
      size: "SMALL_TILE", // Non-media tiles keep their configured size
      state: "IDLE",
      isPressable: true,
      primaryAction: {
        type: "OPEN_MODAL",
        target: "room-info",
      },
      colorCategory: "UTIL",
      label: "Room Details",
      iconName: "info",
      priority: 5,
    },
  ];
}

/**
 * Example: Processing a complete MediaStrip
 */
export function exampleProcessMediaStrip() {
  // Create a media strip with example tiles
  const strip: MediaStrip = {
    id: "room-201-strip",
    tiles: createExampleTiles(),
  };

  // Process the strip (selects cover, sorts, sets sizes)
  const processed = processMediaStrip(strip);

  console.log("Cover tile ID:", processed.coverTileId);
  console.log("Sorted tiles:", processed.tiles.map((t) => ({
    id: t.id,
    label: t.label,
    size: t.size,
    isCover: t.id === processed.coverTileId,
  })));

  return processed;
}

/**
 * Example: Classifying orientation from dimensions
 */
export function exampleClassifyOrientation() {
  // Landscape image (1920x1080)
  const landscape = classifyOrientation(1920, 1080);
  console.log("1920x1080 =", landscape); // "LANDSCAPE"

  // Portrait image (1080x1920)
  const portrait = classifyOrientation(1080, 1920);
  console.log("1080x1920 =", portrait); // "PORTRAIT"

  // Square image (1080x1080)
  const square = classifyOrientation(1080, 1080);
  console.log("1080x1080 =", square); // "SQUAREISH"

  // Slightly wide (1200x1000)
  const slightlyWide = classifyOrientation(1200, 1000);
  console.log("1200x1000 =", slightlyWide); // "SQUAREISH" (ratio 1.2, not > 1.3)

  return { landscape, portrait, square, slightlyWide };
}

/**
 * Example: Manual cover tile selection
 */
export function exampleSelectCoverTile() {
  const tiles = createExampleTiles();

  // Select cover tile (should find the plaque)
  const coverId = selectCoverTile(tiles);
  console.log("Selected cover tile:", coverId); // Should be "tile-1"

  // Find the cover tile
  const coverTile = tiles.find((t) => t.id === coverId);
  console.log("Cover tile:", coverTile?.label); // "Room 201 Plaque"

  return coverId;
}

/**
 * Example: Determining tile sizes
 */
export function exampleDetermineTileSizes() {
  const tiles = createExampleTiles();
  const coverId = selectCoverTile(tiles);

  tiles.forEach((tile) => {
    if (tile.type === "MEDIA") {
      const isCover = tile.id === coverId;
      const size = decideSizeForMedia(tile, isCover);

      console.log(`${tile.label}:`, {
        orientation: tile.mediaOrientation,
        isCover,
        size,
      });
    }
  });
}

/**
 * Example: Converting Backblaze files to Tiles
 * 
 * This shows how you might convert your existing BackblazeFile format
 * to the new Tile format.
 */
export function exampleConvertBackblazeToTiles() {
  // Simulated Backblaze file data
  const backblazeFiles = [
    {
      fileName: "Suffolk University Dorms/Miller/Floor 2/201/sumiller201-plaque.jpg",
      type: "image" as const,
      url: "/api/backblaze/file?fileName=...",
      // In real usage, you'd have dimensions from server-side detection
      // For now, we'll simulate
    },
    {
      fileName: "Suffolk University Dorms/Miller/Floor 2/201/sumiller201-bedroom.mp4",
      type: "video" as const,
      url: "/api/backblaze/file?fileName=...",
    },
  ];

  const tiles: Tile[] = backblazeFiles.map((file, index) => {
    const fileName = file.fileName.split("/").pop() || "";
    const isPlaque = fileName.toLowerCase().includes("plaque");

    // In real usage, you'd get dimensions from:
    // 1. Server-side pre-computation (Option 1)
    // 2. Client-side detection when image loads
    // For this example, we'll simulate based on filename
    let orientation: "LANDSCAPE" | "PORTRAIT" | "SQUAREISH" = "LANDSCAPE";
    if (fileName.includes("door")) orientation = "PORTRAIT";
    if (fileName.includes("corner")) orientation = "SQUAREISH";

    return {
      id: `tile-${index + 1}`,
      type: "MEDIA",
      size: "SMALL_TILE", // Will be set by processMediaStrip
      mediaUrl: file.url,
      mediaKind: isPlaque ? "PLAQUE" : file.type === "video" ? "VIDEO" : "IMAGE",
      mediaOrientation: orientation,
      state: "IDLE",
      isPressable: true,
      primaryAction: {
        type: "OPEN_MEDIA",
        target: file.url,
      },
      colorCategory: "DORM",
      label: fileName.replace(/^sumiller\d+-/, "").replace(/\.(jpg|mp4)$/i, ""),
      priority: isPlaque ? 1 : index + 2,
      roomId: "201",
      buildingId: "miller-hall",
    };
  });

  return tiles;
}

/**
 * Example: Complete workflow
 * 
 * This shows the complete workflow from raw data to processed MediaStrip
 */
export function exampleCompleteWorkflow() {
  // Step 1: Get tiles (from Backblaze, database, etc.)
  const tiles = exampleConvertBackblazeToTiles();

  // Step 2: Create MediaStrip
  const strip: MediaStrip = {
    id: "room-201-media-strip",
    tiles,
  };

  // Step 3: Process the strip
  const processed = processMediaStrip(strip);

  // Step 4: Use the processed strip
  // The tiles are now:
  // - Sorted (cover first, then by priority)
  // - Sized appropriately (HERO for cover, WIDE/TALL/SMALL based on orientation)
  // - Cover tile ID is set

  return processed;
}

/**
 * Example: Testing edge cases
 */
export function exampleEdgeCases() {
  // Empty strip
  const emptyStrip: MediaStrip = {
    id: "empty",
    tiles: [],
  };
  const emptyProcessed = processMediaStrip(emptyStrip);
  console.log("Empty strip cover:", emptyProcessed.coverTileId); // null

  // Strip with no media tiles
  const noMediaStrip: MediaStrip = {
    id: "no-media",
    tiles: [
      {
        id: "info-1",
        type: "INFO",
        size: "SMALL_TILE",
        state: "IDLE",
        isPressable: true,
        primaryAction: { type: "OPEN_MODAL", target: "info" },
      },
    ],
  };
  const noMediaProcessed = processMediaStrip(noMediaStrip);
  console.log("No media cover:", noMediaProcessed.coverTileId); // null

  // Strip with no plaque, but has media
  const noPlaqueStrip: MediaStrip = {
    id: "no-plaque",
    tiles: [
      {
        id: "video-1",
        type: "MEDIA",
        size: "SMALL_TILE",
        mediaUrl: "/video.mp4",
        mediaKind: "VIDEO",
        mediaOrientation: "LANDSCAPE",
        state: "IDLE",
        isPressable: true,
        primaryAction: { type: "OPEN_MEDIA", target: "/video.mp4" },
      },
    ],
  };
  const noPlaqueProcessed = processMediaStrip(noPlaqueStrip);
  console.log("No plaque cover:", noPlaqueProcessed.coverTileId); // "video-1" (first media)

  return {
    empty: emptyProcessed,
    noMedia: noMediaProcessed,
    noPlaque: noPlaqueProcessed,
  };
}

// Uncomment to run examples:
// exampleProcessMediaStrip();
// exampleClassifyOrientation();
// exampleSelectCoverTile();
// exampleDetermineTileSizes();
// exampleCompleteWorkflow();
// exampleEdgeCases();

