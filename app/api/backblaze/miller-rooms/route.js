import { getMillerRoomsWithMedia } from "@/app/lib/discoverMillerRooms";

/**
 * GET /api/backblaze/miller-rooms
 * Returns Miller Hall rooms that have media in Backblaze (for floor page coloring / client use).
 */
export async function GET() {
  try {
    const { rooms } = await getMillerRoomsWithMedia();
    const res = Response.json({ rooms, count: rooms.length });
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );
    return res;
  } catch (err) {
    console.error("Miller rooms API error:", err);
    return Response.json(
      { error: "Discovery failed", details: err.message },
      { status: 500 }
    );
  }
}
