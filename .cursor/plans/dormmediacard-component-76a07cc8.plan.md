---
name: DormMediaCard Component Implementation
overview: ""
todos:
  - id: fbe806e3-4826-45ab-8f95-18402728ca4a
    content: Create DormMediaCard component with carousel functionality and circular navigation buttons
    status: pending
  - id: ecf0ddf0-bff8-4525-b06b-f63dd87e7153
    content: Update AboutUs component to include sample dorm room cards in a responsive grid
    status: pending
  - id: 9f739ec7-eedc-4e2c-8826-e248d7fec7de
    content: Test all interactions (hover, click, navigation, video autoplay, routing)
    status: pending
---

# DormMediaCard Component Implementation

## Overview

Create a reusable, interactive `DormMediaCard` component that displays dorm room information with an in-card media carousel. Users can hover/click to navigate through photos and videos without leaving the page.

## Implementation Steps

### 1. Create the DormMediaCard Component

**File**: `app/components/DormMediaCard.tsx`

**Key Features**:

- Accept props: roomNumber, dormName, schoolName, media array (images/videos), detailsLink
- Display room info overlay on the main image
- Hidden carousel controls by default
- On hover: show circular arrow buttons at card edges (left/right)
- Auto-play videos when navigated to (muted)
- Click anywhere on card to also activate carousel mode
- After last media item: show "More Info Available" button linking to full room page
- Use framer-motion for smooth animations
- Responsive design with Tailwind CSS

**Technical Details**:

- Use `useState` to track current media index and hover state
- Use `useRef` for video element control
- Circular navigation buttons with lucide-react icons (ChevronLeft, ChevronRight)
- Video auto-play with `muted` and `playsInline` attributes
- Handle video/image transitions smoothly

### 2. Update AboutUs Component

**File**: `app/components/AboutUs.tsx`

**Changes**:

- Import the new `DormMediaCard` component
- Add a new section below existing content titled "Explore Dorm Rooms"
- Create grid layout for 4 sample dorm cards (responsive: 1 col mobile, 2 cols tablet, 4 cols desktop)
- Use hardcoded data for Miller Hall rooms: 1005, 610, 611, 602
- Each card includes: room number, "Miller Hall", "Suffolk University", media array from existing room data, link to respective room page

**Sample Data Structure**:

```typescript
const sampleDormRooms = [
  {
    roomNumber: "1005",
    dormName: "Miller Hall",
    schoolName: "Suffolk University",
    detailsLink: "/dorms/miller-hall/room/1005",
    media: [
      { type: "video", src: "...", thumbnail: "..." },
      { type: "image", src: "...", alt: "..." },
      // ... more media
    ]
  },
  // ... 3 more rooms
]
```

### 3. TypeScript Types

Create proper TypeScript interfaces for type safety:

- `MediaItem` interface: type, src, alt?, thumbnail?
- `DormMediaCardProps` interface: roomNumber, dormName, schoolName, media, detailsLink

### 4. Styling Considerations

- Match existing project design (dark mode support via CSS variables)
- Circular buttons: white bg with shadow, positioned absolutely at 50% height
- Smooth opacity transitions for hover states
- Card aspect ratio: 3:4 portrait for consistent grid layout
- "More Info" button: primary color theme, bottom-right corner

### 5. Testing Requirements

- Navigate to home page, scroll to About Us section
- Hover over cards to see navigation arrows appear
- Click arrows to navigate through media
- Videos auto-play when reached (muted)
- Click "More Info" button to navigate to room detail page
- Test responsive behavior on different screen sizes
- Verify dark mode compatibility