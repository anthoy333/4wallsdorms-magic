/**
 * Server-only: discovers Miller Hall rooms that have media in Backblaze.
 * Used by the floor page and by /api/backblaze/miller-rooms.
 */

let authCache = {
  token: null,
  apiUrl: null,
  expiresAt: 0
};

async function getBackblazeAuth(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && authCache.token && authCache.expiresAt > now + 3600000) {
    return { token: authCache.token, apiUrl: authCache.apiUrl };
  }
  const keyId = process.env.BACKBLAZE_KEY_ID;
  const appKey = process.env.BACKBLAZE_APP_KEY;
  if (!keyId || !appKey) throw new Error("Missing Backblaze env vars");
  const authString = Buffer.from(keyId + ":" + appKey).toString("base64");
  const authResponse = await fetch(
    "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
    {
      method: "GET",
      headers: { Authorization: "Basic " + authString },
      cache: "no-store"
    }
  );
  if (!authResponse.ok) {
    throw new Error("Backblaze auth failed: " + (await authResponse.text()));
  }
  const authData = await authResponse.json();
  authCache = {
    token: authData.authorizationToken,
    apiUrl: authData.apiInfo.storageApi.apiUrl,
    expiresAt: now + 23 * 3600000
  };
  return { token: authCache.token, apiUrl: authCache.apiUrl };
}

const B2_BUCKET_NAME = "4wallsdorms";
const PLACEHOLDER_THUMB =
  "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg";

function toPublicUrl(fileName) {
  // Encode each path segment independently so `+` and spaces resolve correctly in the public URL.
  // Backblaze expects `file/<bucket>/<path>`, so we keep `/` separators intact.
  const encodedPath = fileName
    .split("/")
    .map((seg) => encodeURIComponent(seg).replace(/%20/g, "+"))
    .join("/");
  return `https://f005.backblazeb2.com/file/${B2_BUCKET_NAME}/${encodedPath}`;
}

function parseMillerPath(fileName) {
  const prefix = "Suffolk University Dorms/Miller/";
  if (!fileName.startsWith(prefix)) return null;
  const rest = fileName.slice(prefix.length);
  const parts = rest.split("/");
  // Supports both:
  // 1) .../Floor X/504 + 505/<file>
  // 2) .../Floor X/504 + 505/504/<file> (or /505/<file>)
  if (parts.length < 3) return null;
  const unitDir = parts[1];
  const potentialRoomSubdir = parts[2];
  const filePart = parts[parts.length - 1] || "";
  const name = filePart.toLowerCase();
  if (
    name.includes("bathroom") ||
    name.includes("bath") ||
    name.includes("toilet") ||
    name.includes("shower")
  ) {
    return null;
  }

  const unitRooms = unitDir.includes("+")
    ? unitDir.split("+").map((s) => s.trim()).filter(Boolean)
    : [unitDir.trim()];

  // If there is a per-room subfolder, only assign media to that room.
  // This supports the new structure where a shared unit folder can contain
  // only one room subfolder (e.g., "504 + 505/504/...").
  const roomSubdirMatch = potentialRoomSubdir?.trim().match(/^(\d{3,4})$/);
  const rooms = roomSubdirMatch && unitRooms.includes(roomSubdirMatch[1])
    ? [roomSubdirMatch[1]]
    : unitRooms;

  return { rooms, fileName };
}

function extractRoomNumberFromPathOrName(fileName) {
  // New structure support: .../1007 + 1008/1008/<file>
  let match = fileName.match(/\/(\d{3,4})\/[^/]+$/);
  if (match) return match[1];

  const baseName = fileName.split("/").pop() || fileName;
  // Legacy Miller naming: sumiller1008-...
  match = baseName.match(/sumiller(\d+)/i);
  if (match) return match[1];
  // Alternate naming: 1008millersuffolk...
  match = baseName.match(/^(\d{3,4})miller/i);
  if (match) return match[1];
  return null;
}

/**
 * Returns { rooms: Array<{ roomNumber, thumbnailUrl, title }> }
 * Uses Backblaze list_file_names with prefix "Suffolk University Dorms/Miller/" and pagination.
 */
export async function getMillerRoomsWithMedia() {
  const bucketId = process.env.BACKBLAZE_BUCKET_ID;
  if (!bucketId) return { rooms: [] };

  const prefix = "Suffolk University Dorms/Miller/";
  const roomToThumb = new Map();
  let nextFileName = null;

  do {
    const auth = await getBackblazeAuth(!!nextFileName);
    const body = {
      bucketId,
      prefix,
      maxFileCount: 1000
    };
    if (nextFileName) body.startFileName = nextFileName;

    let listResponse = await fetch(
      auth.apiUrl + "/b2api/v3/b2_list_file_names",
      {
        method: "POST",
        headers: {
          Authorization: auth.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
        cache: "no-store",
        next: { revalidate: 0 }
      }
    );

    if (listResponse.status === 401) {
      authCache = { token: null, apiUrl: null, expiresAt: 0 };
      const auth2 = await getBackblazeAuth(true);
      listResponse = await fetch(
        auth2.apiUrl + "/b2api/v3/b2_list_file_names",
        {
          method: "POST",
          headers: {
            Authorization: auth2.token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body),
          cache: "no-store",
          next: { revalidate: 0 }
        }
      );
    }

    if (!listResponse.ok) {
      throw new Error("Backblaze list failed: " + (await listResponse.text()));
    }

    const data = await listResponse.json();
    const files = data.files || [];

    for (const file of files) {
      if (!file.fileName || (file.contentLength === 0 && !file.contentType))
        continue;
      // Ignore Backblaze folder marker files.
      if ((file.fileName || "").toLowerCase().includes(".bzempty"))
        continue;
      const parsed = parseMillerPath(file.fileName);
      if (!parsed) continue;
      const fileNameLower = (file.fileName ?? "").toLowerCase();
      const isImage =
        (file.contentType && file.contentType.startsWith("image/")) ||
        /\.(jpe?g|png|webp|gif|bmp)$/i.test(fileNameLower);
      // If this file clearly belongs to one room in the unit, only map it there.
      const explicitRoom = extractRoomNumberFromPathOrName(file.fileName);
      const targetRooms =
        explicitRoom && parsed.rooms.includes(explicitRoom)
          ? [explicitRoom]
          : parsed.rooms;

      for (const room of targetRooms) {
        if (!roomToThumb.has(room)) {
          roomToThumb.set(room, {
            roomNumber: room,
            thumbnailUrl: isImage
              ? toPublicUrl(file.fileName)
              : PLACEHOLDER_THUMB,
            title: "Double Suite"
          });
        } else {
          const cur = roomToThumb.get(room);
          if (isImage && cur.thumbnailUrl.includes("plaque")) {
            cur.thumbnailUrl = toPublicUrl(file.fileName);
          }
        }
      }
    }

    nextFileName = data.nextFileName || null;
  } while (nextFileName);

  const rooms = Array.from(roomToThumb.values()).sort(
    (a, b) => parseInt(a.roomNumber, 10) - parseInt(b.roomNumber, 10)
  );
  return { rooms };
}
