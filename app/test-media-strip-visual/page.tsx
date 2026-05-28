"use client"

import { MediaStrip } from "@/app/components/MediaStrip"
import { CAMPUSES } from "@/app/utils/campusHelpers"
import type { ViewContext } from "@/app/types/mediaStrip"

/**
 * Visual MediaStrip Test Page
 * 
 * Visit: http://localhost:3000/test-media-strip-visual
 * 
 * This page shows the MediaStrip component with real tiles rendered visually.
 */
export default function TestMediaStripVisualPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Visual MediaStrip Test</h1>
          <p className="text-gray-600 mb-6">
            Room 201 in Miller Hall - See tiles with proper sizing based on orientation
          </p>

          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold mb-2">What to look for:</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Cover tile (plaque) should be larger (HERO size)</li>
              <li>Landscape images should be wide (WIDE_TILE)</li>
              <li>Portrait images should be tall (TALL_TILE)</li>
              <li>Square images should be small (SMALL_TILE)</li>
              <li>Tiles should update sizes as images load</li>
            </ul>
          </div>
        </div>

        {/* MediaStrip Component - Room Context (Uniform Sizes) */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-2">Room 201 Media Strip (Room Context)</h2>
          <p className="text-sm text-gray-600 mb-4">
            All tiles same size - cover tile has badge but same dimensions
          </p>
          <MediaStrip
            roomNumber="201"
            dormName="Miller"
            buildingId="miller-hall"
            floorId="floor-2"
            context={{
              type: "ROOM",
              campus: CAMPUSES.suffolkUniversity,
              buildingId: "miller-hall",
              floorId: "floor-2",
              roomId: "201",
            }}
          />
        </div>

        {/* MediaStrip Component - Default Context (Variable Sizes) */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-2">Room 201 Media Strip (Default Context)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Tiles vary by orientation - cover tile is larger (HERO)
          </p>
          <MediaStrip
            roomNumber="201"
            dormName="Miller"
            buildingId="miller-hall"
            floorId="floor-2"
          />
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold mb-4">How it works:</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">1. Initial Load</h3>
              <p>Tiles start as SMALL_TILE while orientation is being detected.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Orientation Detection</h3>
              <p>
                Images/videos load in the background. Dimensions are read and orientation is
                classified (LANDSCAPE, PORTRAIT, or SQUAREISH).
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Size Update</h3>
              <p>
                Tiles automatically update to correct sizes:
                <br />• LANDSCAPE → WIDE_TILE (320px wide)
                <br />• PORTRAIT → TALL_TILE (240px wide, 400px tall)
                <br />• SQUAREISH → SMALL_TILE (280px wide)
                <br />• Cover tile → HERO_TILE (400-500px, depends on orientation)
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Hover Effects</h3>
              <p>Hover over tiles to see size and orientation info.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

