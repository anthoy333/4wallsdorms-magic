/**
 * MediaStrip Logic - Simple Test File
 * 
 * Run this to verify the MediaStrip utilities work correctly.
 * You can run this with: npx tsx app/utils/__tests__/mediaStripLogic.test.ts
 * Or import and call these functions from your code.
 */

import type { MediaStrip, Tile } from "@/app/types/mediaStrip";
import { processMediaStrip, selectCoverTile } from "../mediaStripLogic";
import { classifyOrientation, decideSizeForMedia } from "../mediaOrientation";

/**
 * Test: Orientation Classification
 */
export function testOrientationClassification() {
  console.log("\n🧪 Testing Orientation Classification:");
  
  const tests = [
    { width: 1920, height: 1080, expected: "LANDSCAPE" },
    { width: 1080, height: 1920, expected: "PORTRAIT" },
    { width: 1080, height: 1080, expected: "SQUAREISH" },
    { width: 1200, height: 1000, expected: "SQUAREISH" }, // ratio 1.2
    { width: 1500, height: 1000, expected: "LANDSCAPE" }, // ratio 1.5
    { width: 800, height: 1200, expected: "PORTRAIT" }, // ratio 0.67
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach(({ width, height, expected }) => {
    const result = classifyOrientation(width, height);
    const passedTest = result === expected;
    
    if (passedTest) {
      console.log(`  ✅ ${width}x${height} = ${result}`);
      passed++;
    } else {
      console.log(`  ❌ ${width}x${height} = ${result} (expected ${expected})`);
      failed++;
    }
  });

  console.log(`\n  Results: ${passed} passed, ${failed} failed\n`);
  return failed === 0;
}

/**
 * Test: Cover Tile Selection
 */
export function testCoverTileSelection() {
  console.log("\n🧪 Testing Cover Tile Selection:");

  // Test 1: Plaque tile should be selected
  const tilesWithPlaque: Tile[] = [
    {
      id: "regular-1",
      type: "MEDIA",
      size: "SMALL_TILE",
      mediaKind: "IMAGE",
      state: "IDLE",
      isPressable: true,
      primaryAction: { type: "OPEN_MEDIA", target: "/img1.jpg" },
    },
    {
      id: "plaque-1",
      type: "MEDIA",
      size: "SMALL_TILE",
      mediaKind: "PLAQUE",
      state: "IDLE",
      isPressable: true,
      primaryAction: { type: "OPEN_MEDIA", target: "/plaque.jpg" },
    },
  ];

  const coverId1 = selectCoverTile(tilesWithPlaque);
  const test1Passed = coverId1 === "plaque-1";
  console.log(`  ${test1Passed ? "✅" : "❌"} Plaque selected: ${coverId1} (expected: plaque-1)`);

  // Test 2: No plaque, first media should be selected
  const tilesNoPlaque: Tile[] = [
    {
      id: "video-1",
      type: "MEDIA",
      size: "SMALL_TILE",
      mediaKind: "VIDEO",
      state: "IDLE",
      isPressable: true,
      primaryAction: { type: "OPEN_MEDIA", target: "/video.mp4" },
    },
    {
      id: "image-1",
      type: "MEDIA",
      size: "SMALL_TILE",
      mediaKind: "IMAGE",
      state: "IDLE",
      isPressable: true,
      primaryAction: { type: "OPEN_MEDIA", target: "/img.jpg" },
    },
  ];

  const coverId2 = selectCoverTile(tilesNoPlaque);
  const test2Passed = coverId2 === "video-1";
  console.log(`  ${test2Passed ? "✅" : "❌"} First media selected: ${coverId2} (expected: video-1)`);

  // Test 3: No media tiles, should return null
  const tilesNoMedia: Tile[] = [
    {
      id: "info-1",
      type: "INFO",
      size: "SMALL_TILE",
      state: "IDLE",
      isPressable: true,
      primaryAction: { type: "OPEN_MODAL", target: "info" },
    },
  ];

  const coverId3 = selectCoverTile(tilesNoMedia);
  const test3Passed = coverId3 === null;
  console.log(`  ${test3Passed ? "✅" : "❌"} No media returns null: ${coverId3}`);

  const allPassed = test1Passed && test2Passed && test3Passed;
  console.log(`\n  Results: ${allPassed ? "All passed ✅" : "Some failed ❌"}\n`);
  return allPassed;
}

/**
 * Test: Tile Sorting
 */
export function testTileSorting() {
  console.log("\n🧪 Testing Tile Sorting:");

  const strip: MediaStrip = {
    id: "test-strip",
    tiles: [
      {
        id: "tile-3",
        type: "MEDIA",
        size: "SMALL_TILE",
        mediaKind: "IMAGE",
        mediaOrientation: "LANDSCAPE",
        priority: 3,
        state: "IDLE",
        isPressable: true,
        primaryAction: { type: "OPEN_MEDIA", target: "/img3.jpg" },
      },
      {
        id: "tile-1",
        type: "MEDIA",
        size: "SMALL_TILE",
        mediaKind: "PLAQUE",
        mediaOrientation: "LANDSCAPE",
        priority: 1,
        state: "IDLE",
        isPressable: true,
        primaryAction: { type: "OPEN_MEDIA", target: "/plaque.jpg" },
      },
      {
        id: "tile-2",
        type: "MEDIA",
        size: "SMALL_TILE",
        mediaKind: "VIDEO",
        mediaOrientation: "PORTRAIT",
        priority: 2,
        state: "IDLE",
        isPressable: true,
        primaryAction: { type: "OPEN_MEDIA", target: "/video.mp4" },
      },
    ],
  };

  const processed = processMediaStrip(strip);

  // Check cover is selected
  const coverCorrect = processed.coverTileId === "tile-1";
  console.log(`  ${coverCorrect ? "✅" : "❌"} Cover selected: ${processed.coverTileId} (expected: tile-1)`);

  // Check sorting: cover first, then by priority
  const sortedIds = processed.tiles.map((t) => t.id);
  const sortCorrect = sortedIds[0] === "tile-1" && sortedIds[1] === "tile-2" && sortedIds[2] === "tile-3";
  console.log(`  ${sortCorrect ? "✅" : "❌"} Tiles sorted: [${sortedIds.join(", ")}] (expected: [tile-1, tile-2, tile-3])`);

  // Check sizes: cover should be HERO, others based on orientation
  const coverTile = processed.tiles.find((t) => t.id === "tile-1");
  const coverSizeCorrect = coverTile?.size === "HERO_TILE";
  console.log(`  ${coverSizeCorrect ? "✅" : "❌"} Cover size: ${coverTile?.size} (expected: HERO_TILE)`);

  const videoTile = processed.tiles.find((t) => t.id === "tile-2");
  const videoSizeCorrect = videoTile?.size === "TALL_TILE"; // Portrait = TALL
  console.log(`  ${videoSizeCorrect ? "✅" : "❌"} Video size: ${videoTile?.size} (expected: TALL_TILE)`);

  const imageTile = processed.tiles.find((t) => t.id === "tile-3");
  const imageSizeCorrect = imageTile?.size === "WIDE_TILE"; // Landscape = WIDE
  console.log(`  ${imageSizeCorrect ? "✅" : "❌"} Image size: ${imageTile?.size} (expected: WIDE_TILE)`);

  const allPassed = coverCorrect && sortCorrect && coverSizeCorrect && videoSizeCorrect && imageSizeCorrect;
  console.log(`\n  Results: ${allPassed ? "All passed ✅" : "Some failed ❌"}\n`);
  return allPassed;
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.log("🚀 Running MediaStrip Logic Tests\n");
  console.log("=".repeat(50));

  const results = {
    orientation: testOrientationClassification(),
    coverSelection: testCoverTileSelection(),
    sorting: testTileSorting(),
  };

  console.log("=".repeat(50));
  console.log("\n📊 Test Summary:");
  console.log(`  Orientation Classification: ${results.orientation ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`  Cover Tile Selection: ${results.coverSelection ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`  Tile Sorting & Sizing: ${results.sorting ? "✅ PASS" : "❌ FAIL"}`);

  const allPassed = Object.values(results).every((r) => r);
  console.log(`\n${allPassed ? "🎉 All tests passed!" : "⚠️  Some tests failed"}\n`);

  return allPassed;
}

// Uncomment to run tests:
// runAllTests();

