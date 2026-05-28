/**
 * BackblazeMediaViewer Usage Example
 * 
 * This component fetches and displays all photos and videos from a Backblaze B2 folder.
 * All Backblaze API calls happen server-side through secure API routes.
 * 
 * Example Usage in a Room Page:
 */

"use client"

import { BackblazeMediaViewer } from "./BackblazeMediaViewer"
import { RoomPageTemplate } from "./RoomPageTemplate"

export default function ExampleRoomPageWithBackblaze() {
  // Example: Room 201 in Miller Hall, 2nd Floor
  // Backblaze folder structure: University/Building/Floor/Room/
  const backblazeFolder = "Suffolk University Dorms/Miller/Floor 2/201/"

  return (
    <RoomPageTemplate
      // ... other props ...
      roomTitle="Room 201"
      // ... more props ...
    >
      {/* Option 1: Use BackblazeMediaViewer as a standalone section */}
      <BackblazeMediaViewer 
        folder={backblazeFolder}
        title="Room Photos & Videos"
        className="mb-8"
      />

      {/* Option 2: Integrate with existing RoomPageTemplate photos */}
      {/* The RoomPageTemplate accepts a photos array, but you can also */}
      {/* use BackblazeMediaViewer to dynamically load from Backblaze */}
    </RoomPageTemplate>
  )
}

/**
 * Folder Structure Examples:
 * 
 * For Room 201, Floor 2, Miller Hall, Suffolk University:
 * folder="Suffolk University Dorms/Miller/Floor 2/201/"
 * 
 * For Room 405, Floor 4, Miller Hall:
 * folder="Suffolk University Dorms/Miller/Floor 4/405/"
 * 
 * For Adjoining Rooms 201-202:
 * folder="Suffolk University Dorms/Miller/Floor 2/201 + 202/"
 * 
 * Note: The folder path should match exactly how files are organized in Backblaze B2.
 * Always end folder paths with a trailing slash.
 */

