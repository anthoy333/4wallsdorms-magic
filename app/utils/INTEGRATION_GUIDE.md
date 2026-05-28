# MediaStrip Integration Guide

## ✅ Integration Complete!

The MediaStrip system is now fully integrated with your existing Backblaze data.

## 🎓 Campus Reference System

**IMPORTANT**: The system now uses structured `CampusRef` instead of simple `campusId` strings. This prevents confusion between campuses with similar names (e.g., "Suffolk University" vs "Suffolk Community College").

### Key Points:
- ✅ Every campus reference includes both `slug` and `type`
- ✅ Always use `sameCampus(a, b)` for comparisons (never compare slugs directly)
- ✅ Use `CAMPUSES` constants or `createCampusRef()` for consistency

## Files Created

### Core Integration Files

1. **`app/utils/backblazeToTile.ts`**
   - Converts `BackblazeFile` → `Tile`
   - Functions: `backblazeFileToTile()`, `backblazeFilesToTiles()`

2. **`app/utils/roomPhotoToTile.ts`**
   - Converts `RoomPhoto` → `Tile` (for backward compatibility)
   - Functions: `roomPhotoToTile()`, `roomPhotosToTiles()`

3. **`app/hooks/useMediaStrip.ts`**
   - New hook that returns processed `MediaStrip`
   - Functions: `useMediaStrip()`, `useMediaStripFromPhotos()`

## How to Use

### Option 1: New Hook (Recommended)

```typescript
import { useMediaStrip } from "@/app/hooks/useMediaStrip"
import { CAMPUSES } from "@/app/utils/campusHelpers"

function MyComponent() {
  const { strip, loading, error } = useMediaStrip({
    roomNumber: "201",
    dormName: "Miller",
    campus: CAMPUSES.suffolkUniversity, // ✅ Structured campus reference
    buildingId: "miller-hall",
    floorId: "floor-2",
    colorCategory: "DORM",
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!strip) return <div>No media found</div>

  // strip is a processed MediaStrip with:
  // - coverTileId: selected cover tile
  // - tiles: sorted and sized tiles
  // - All ready for rendering!
}
```

### Option 2: Convert Existing RoomPhoto Data

```typescript
import { useBackblazeRoomMedia } from "@/app/hooks/useBackblazeRoomMedia"
import { useMediaStripFromPhotos } from "@/app/hooks/useMediaStrip"

function MyComponent() {
  // Use existing hook
  const { photos } = useBackblazeRoomMedia("201", "Miller")
  
  // Convert to MediaStrip
  const { strip } = useMediaStripFromPhotos(photos, {
    roomNumber: "201",
    buildingId: "miller-hall",
  })

  // Use strip for MediaStrip components
}
```

### Option 3: Manual Conversion

```typescript
import { backblazeFilesToTiles } from "@/app/utils/backblazeToTile"
import { processMediaStrip } from "@/app/utils/mediaStripLogic"

// If you have BackblazeFile[]
const tiles = backblazeFilesToTiles(files, {
  roomNumber: "201",
  colorCategory: "DORM",
})

const strip = processMediaStrip({
  id: "my-strip",
  tiles,
})
```

## What's Processed Automatically

When you use `useMediaStrip()` or `processMediaStrip()`, the system automatically:

1. ✅ **Selects cover tile** - Plaque images are prioritized
2. ✅ **Sorts tiles** - Cover first, then by priority
3. ✅ **Sets tile sizes** - Based on orientation and cover status
   - Cover tiles → `HERO_TILE`
   - Landscape media → `WIDE_TILE`
   - Portrait media → `TALL_TILE`
   - Square media → `SMALL_TILE`

## Backward Compatibility

- ✅ `useBackblazeRoomMedia` still works (returns `RoomPhoto[]`)
- ✅ Existing components using `RoomPhoto[]` continue to work
- ✅ New components can use `MediaStrip` format
- ✅ You can convert between formats as needed

## Next Steps

Now that integration is complete, you're ready for:

- **Phase 2**: Create the MediaStrip component
- **Phase 3**: Add responsive layout breakpoints
- **Phase 4**: Implement smart grouping

## Campus Reference Examples

See `app/utils/campusRef.example.ts` for detailed examples of:
- Creating campus references
- Using `sameCampus()` for comparisons
- Filtering tiles by campus
- Avoiding common mistakes

## See Also

- `app/utils/integration.example.ts` - More usage examples
- `app/utils/mediaStripLogic.example.ts` - Logic examples
- `app/utils/campusRef.example.ts` - Campus reference examples
- `app/test-media-strip/page.tsx` - Test page

