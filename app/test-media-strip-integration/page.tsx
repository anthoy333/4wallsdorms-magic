"use client"

import { useMediaStrip } from "@/app/hooks/useMediaStrip"
import { CAMPUSES } from "@/app/utils/campusHelpers"

/**
 * Quick Test Page for MediaStrip Integration
 * 
 * Visit: http://localhost:3000/test-media-strip-integration
 * 
 * This page tests the useMediaStrip hook with real Backblaze data.
 */
export default function TestMediaStripIntegrationPage() {
  // Test with a real room number
  const { strip, loading, error } = useMediaStrip({
    roomNumber: "201",
    dormName: "Miller",
    campus: CAMPUSES.suffolkUniversity,
    buildingId: "miller-hall",
    floorId: "floor-2",
    colorCategory: "DORM",
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-4">Testing MediaStrip Integration</h1>
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Loading media from Backblaze...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-4">Testing MediaStrip Integration</h1>
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
              <h2 className="text-xl font-bold text-red-800 mb-2">❌ Error</h2>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!strip) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-4">Testing MediaStrip Integration</h1>
            <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-4">
              <h2 className="text-xl font-bold text-yellow-800 mb-2">⚠️ No Media Found</h2>
              <p className="text-yellow-700">No media files found for room 201 in Miller Hall.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const coverTile = strip.tiles.find((t) => t.id === strip.coverTileId)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4">✅ MediaStrip Integration Test</h1>
          <p className="text-gray-600 mb-6">
            Testing room 201 in Miller Hall (Suffolk University)
          </p>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{strip.tiles.length}</div>
              <div className="text-sm text-gray-600">Total Tiles</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {strip.coverTileId ? "✅" : "❌"}
              </div>
              <div className="text-sm text-gray-600">Cover Selected</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {strip.tiles.filter((t) => t.size === "HERO_TILE").length}
              </div>
              <div className="text-sm text-gray-600">Hero Tiles</div>
            </div>
          </div>

          {/* Cover Tile Info */}
          {coverTile && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
              <h2 className="text-xl font-bold mb-3">🎯 Cover Tile</h2>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">ID:</span> {coverTile.id}
                </div>
                <div>
                  <span className="font-semibold">Label:</span> {coverTile.label || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Size:</span> {coverTile.size}
                </div>
                <div>
                  <span className="font-semibold">Media Kind:</span> {coverTile.mediaKind || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Orientation:</span> {coverTile.mediaOrientation || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Priority:</span> {coverTile.priority ?? "N/A"}
                </div>
              </div>
            </div>
          )}

          {/* All Tiles */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">📋 All Tiles (Sorted)</h2>
            <div className="space-y-3">
              {strip.tiles.map((tile, index) => (
                <div
                  key={tile.id}
                  className={`p-4 rounded-lg border-2 ${
                    tile.id === strip.coverTileId
                      ? "bg-blue-50 border-blue-500"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-500">#{index + 1}</span>
                        {tile.id === strip.coverTileId && (
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                            COVER
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                          {tile.size}
                        </span>
                        {tile.mediaOrientation && (
                          <span className="px-2 py-1 bg-green-200 text-green-700 text-xs rounded">
                            {tile.mediaOrientation}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="font-semibold">ID:</span> {tile.id}
                        </div>
                        <div>
                          <span className="font-semibold">Label:</span> {tile.label || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold">Type:</span> {tile.type} |{" "}
                          {tile.mediaKind || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold">Priority:</span> {tile.priority ?? "N/A"}
                        </div>
                        {tile.campus && (
                          <div>
                            <span className="font-semibold">Campus:</span> {tile.campus.slug} (
                            {tile.campus.type})
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tile Size Breakdown */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">📊 Tile Size Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">
                  {strip.tiles.filter((t) => t.size === "HERO_TILE").length}
                </div>
                <div className="text-sm text-gray-600">HERO</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">
                  {strip.tiles.filter((t) => t.size === "WIDE_TILE").length}
                </div>
                <div className="text-sm text-gray-600">WIDE</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">
                  {strip.tiles.filter((t) => t.size === "TALL_TILE").length}
                </div>
                <div className="text-sm text-gray-600">TALL</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">
                  {strip.tiles.filter((t) => t.size === "SMALL_TILE").length}
                </div>
                <div className="text-sm text-gray-600">SMALL</div>
              </div>
            </div>
          </div>

          {/* Raw Data (Collapsible) */}
          <details className="mt-6">
            <summary className="cursor-pointer text-lg font-semibold text-gray-700 hover:text-gray-900">
              🔍 View Raw Data
            </summary>
            <div className="mt-4 bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{JSON.stringify(strip, null, 2)}</pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

