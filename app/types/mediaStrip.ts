/**
 * MediaStrip Type Definitions
 * 
 * Framework-agnostic types for the MediaStrip system.
 * These types define the structure for tiles, media strips, and related data.
 */

// Campus type classification
export type CampusType =
  | "UNIVERSITY"
  | "COLLEGE"
  | "COMMUNITY_COLLEGE"
  | "SCHOOL"
  | "CAMPUS"; // generic catch all if needed

// Structured campus reference
export interface CampusRef {
  slug: string;     // machine friendly identifier, example: "suffolk"
  type: CampusType; // example: "UNIVERSITY" or "COMMUNITY_COLLEGE"
}

// Context types for tile selection
export type ContextType =
  | "CAMPUS"
  | "BUILDING"
  | "FLOOR"
  | "ROOM"
  | "ROOM_PATTERN";

// View context for filtering and selecting tiles
export interface ViewContext {
  type: ContextType;
  campus: CampusRef;
  buildingId?: string;
  floorId?: string;
  roomId?: string;
  roomPattern?: string; // example "*10" for rooms ending in 10
}

// What kind of content the tile represents
export type TileType = "MEDIA" | "INFO" | "FOUR_WDS" | "NAV";

// Semantically sized tiles, not exact pixels
export type TileSize =
  | "SMALL_TILE"
  | "WIDE_TILE"
  | "TALL_TILE"
  | "HERO_TILE";

// Orientation of media files
export type MediaOrientation = "LANDSCAPE" | "PORTRAIT" | "SQUAREISH";

export type TileState =
  | "LOADING"
  | "IDLE"
  | "FOCUSED"
  | "PRESSED"
  | "SELECTED"
  | "DISABLED"
  | "ERROR"
  | "VIEWED"
  | "NEW";

export type ColorCategory =
  | "FOOD"
  | "SHOPPING"
  | "DORM"
  | "CAMPUS"
  | "UTIL"
  | "BRAND";

export type TileActionType =
  | "OPEN_MEDIA"
  | "OPEN_MODAL"
  | "NAVIGATE_INTERNAL"
  | "OPEN_EXTERNAL"
  | "APPLY_FILTER";

export interface TileAction {
  type: TileActionType;
  target?: string;              // url or route name or internal id
  params?: Record<string, any>; // optional metadata
}

export interface Tile {
  id: string;

  type: TileType;
  size: TileSize;

  // Cover and importance
  isCover?: boolean;            // manual flag for cover preference
  priority?: number;            // lower number sorted earlier

  // Visual language
  colorCategory?: ColorCategory;
  iconName?: string | null;

  // Content
  label?: string;
  subtitle?: string | null;
  mediaUrl?: string | null;     // image or video url
  mediaKind?: "IMAGE" | "VIDEO" | "PLAQUE" | null;
  mediaOrientation?: MediaOrientation; // see section 3

  // Behavior
  state: TileState;
  isPressable: boolean;
  primaryAction: TileAction;
  secondaryActions?: TileAction[];

  // Context tags for grouping and routing
  campus?: CampusRef;           // replaces campusId - structured campus reference
  buildingId?: string;
  floorId?: string;
  roomId?: string;
  roomPattern?: string;         // example "*10" for rooms ending in 10

  // Analytics
  hasBeenViewed?: boolean;
  isRecommended?: boolean;
}

export interface MediaStrip {
  id: string;
  tiles: Tile[];
  activeTileId?: string | null; // tile currently focused or selected
  coverTileId?: string | null;  // chosen cover tile id
}

