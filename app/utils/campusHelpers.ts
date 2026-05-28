/**
 * Campus Helper Functions
 * 
 * Utilities for working with CampusRef and comparing campuses.
 * 
 * IMPORTANT: Do not assume campus names are unique. Every campus reference 
 * must include both a `slug` and a `type` using the `CampusRef` structure. 
 * All campus comparisons must go through `sameCampus(a, b)` so `Suffolk University` 
 * and `Suffolk Community College` are always treated as different campuses, 
 * even though they share the word Suffolk.
 */

import type { CampusRef } from "@/app/types/mediaStrip";

/**
 * Compares two campus references to determine if they refer to the same campus
 * 
 * This function checks both slug AND type to ensure campuses with the same
 * name but different types (e.g., "Suffolk University" vs "Suffolk Community College")
 * are treated as different campuses.
 * 
 * @param a - First campus reference (optional)
 * @param b - Second campus reference (optional)
 * @returns true if both campuses exist and have matching slug and type
 * 
 * @example
 * const suffolkUni = { slug: "suffolk", type: "UNIVERSITY" };
 * const suffolkCC = { slug: "suffolk", type: "COMMUNITY_COLLEGE" };
 * sameCampus(suffolkUni, suffolkCC); // false - different types
 * sameCampus(suffolkUni, suffolkUni); // true - same campus
 */
export function sameCampus(a?: CampusRef, b?: CampusRef): boolean {
  if (!a || !b) return false;
  return a.slug === b.slug && a.type === b.type;
}

/**
 * Creates a CampusRef from a slug and type
 * 
 * @param slug - Machine-friendly identifier (e.g., "suffolk")
 * @param type - Campus type (e.g., "UNIVERSITY")
 * @returns CampusRef object
 * 
 * @example
 * const campus = createCampusRef("suffolk", "UNIVERSITY");
 */
export function createCampusRef(slug: string, type: CampusRef["type"]): CampusRef {
  return { slug, type };
}

/**
 * Common campus references for convenience
 * 
 * Use these constants to ensure consistency across the codebase.
 */
export const CAMPUSES = {
  suffolkUniversity: createCampusRef("suffolk", "UNIVERSITY"),
  suffolkCommunityCollege: createCampusRef("suffolk", "COMMUNITY_COLLEGE"),
  deanCollege: createCampusRef("dean", "COLLEGE"),
  hussonUniversity: createCampusRef("husson", "UNIVERSITY"),
} as const;

