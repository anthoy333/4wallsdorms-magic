/**
 * CampusRef Usage Examples
 * 
 * Demonstrates how to properly use CampusRef to avoid confusion between
 * campuses with similar names (e.g., Suffolk University vs Suffolk Community College).
 */

import type { CampusRef, ViewContext, Tile } from "@/app/types/mediaStrip"
import { sameCampus, createCampusRef, CAMPUSES } from "./campusHelpers"

/**
 * Example 1: Creating campus references
 * 
 * Always specify both slug AND type to avoid confusion.
 */
export function exampleCreateCampusRefs() {
  // ✅ CORRECT: Both slug and type specified
  const suffolkUniversity: CampusRef = {
    slug: "suffolk",
    type: "UNIVERSITY",
  }

  const suffolkCommunityCollege: CampusRef = {
    slug: "suffolk",
    type: "COMMUNITY_COLLEGE",
  }

  // These are DIFFERENT campuses even though they share the slug "suffolk"
  console.log(sameCampus(suffolkUniversity, suffolkCommunityCollege)) // false

  // ✅ Use helper function
  const deanCollege = createCampusRef("dean", "COLLEGE")

  // ✅ Use predefined constants
  const suffolkUni = CAMPUSES.suffolkUniversity
  const suffolkCC = CAMPUSES.suffolkCommunityCollege
}

/**
 * Example 2: Creating ViewContext with CampusRef
 */
export function exampleViewContext() {
  const context: ViewContext = {
    type: "BUILDING",
    campus: CAMPUSES.suffolkUniversity, // ✅ Use structured CampusRef
    buildingId: "miller-hall",
  }

  return context
}

/**
 * Example 3: Creating tiles with CampusRef
 */
export function exampleTilesWithCampus() {
  // ✅ CORRECT: Tile for Suffolk University
  const tileForSuffolkUni: Tile = {
    id: "miller-building-tile",
    type: "MEDIA",
    size: "SMALL_TILE",
    campus: CAMPUSES.suffolkUniversity, // ✅ Structured reference
    buildingId: "miller-hall",
    state: "IDLE",
    isPressable: true,
    primaryAction: { type: "OPEN_MEDIA", target: "/image.jpg" },
  }

  // ✅ CORRECT: Tile for Suffolk Community College (different campus!)
  const tileForSuffolkCC: Tile = {
    id: "suffolk-cc-tile",
    type: "MEDIA",
    size: "SMALL_TILE",
    campus: CAMPUSES.suffolkCommunityCollege, // ✅ Different campus reference
    buildingId: "building-a",
    state: "IDLE",
    isPressable: true,
    primaryAction: { type: "OPEN_MEDIA", target: "/image2.jpg" },
  }

  // These tiles are for DIFFERENT campuses
  console.log(sameCampus(tileForSuffolkUni.campus, tileForSuffolkCC.campus)) // false
}

/**
 * Example 4: Filtering tiles by campus (CORRECT way)
 * 
 * Always use sameCampus() for comparisons, never compare slugs directly.
 */
export function exampleFilterTilesByCampus(tiles: Tile[], context: ViewContext) {
  // ✅ CORRECT: Use sameCampus() helper
  const campusTiles = tiles.filter((tile) => 
    !tile.campus || sameCampus(tile.campus, context.campus)
  )

  // ❌ WRONG: Don't compare slugs directly
  // const wrong = tiles.filter(t => t.campus?.slug === context.campus.slug)
  // This would incorrectly match Suffolk University and Suffolk Community College!

  return campusTiles
}

/**
 * Example 5: Scoring tiles based on campus match
 */
export function exampleScoreByCampus(tile: Tile, context: ViewContext): number {
  let score = 0

  // ✅ CORRECT: Use sameCampus() for comparison
  if (tile.campus && sameCampus(tile.campus, context.campus)) {
    score += 10 // Match on campus
  }

  // ❌ WRONG: Don't do this
  // if (tile.campus?.slug === context.campus.slug) {
  //   score += 10 // This would incorrectly match different campus types!
  // }

  return score
}

/**
 * Example 6: Using in useMediaStrip hook
 */
export function exampleUseMediaStripWithCampus() {
  // ✅ CORRECT: Specify campus explicitly
  /*
  const { strip } = useMediaStrip({
    roomNumber: "201",
    dormName: "Miller",
    campus: CAMPUSES.suffolkUniversity, // ✅ Explicit campus reference
  })
  */

  // ✅ CORRECT: For Suffolk Community College
  /*
  const { strip: stripCC } = useMediaStrip({
    roomNumber: "101",
    dormName: "Building A",
    campus: CAMPUSES.suffolkCommunityCollege, // ✅ Different campus
  })
  */
}

/**
 * Example 7: Converting Backblaze files with campus
 */
export function exampleBackblazeWithCampus() {
  // ✅ CORRECT: Specify campus when converting
  /*
  import { backblazeFilesToTiles } from "@/app/utils/backblazeToTile"
  
  const tiles = backblazeFilesToTiles(files, {
    campus: CAMPUSES.suffolkUniversity, // ✅ Explicit campus
    roomNumber: "201",
    buildingId: "miller-hall",
  })
  */
}

/**
 * CRITICAL REMINDER
 * 
 * Do not assume campus names are unique. Every campus reference must include 
 * both a `slug` and a `type` using the `CampusRef` structure. All campus 
 * comparisons must go through `sameCampus(a, b)` so `Suffolk University` and 
 * `Suffolk Community College` are always treated as different campuses, even 
 * though they share the word Suffolk.
 */

