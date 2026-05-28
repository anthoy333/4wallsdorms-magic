// Cache for Backblaze auth tokens (valid for 24 hours)
let authCache = {
  token: null,
  downloadUrl: null,
  expiresAt: 0
};

async function getBackblazeAuth(forceRefresh = false) {
  // Check if cached token is still valid (with 1 hour buffer)
  const now = Date.now();
  if (!forceRefresh && authCache.token && authCache.expiresAt > now + 3600000) {
    return {
      token: authCache.token,
      downloadUrl: authCache.downloadUrl
    };
  }

  const keyId = process.env.BACKBLAZE_KEY_ID;
  const appKey = process.env.BACKBLAZE_APP_KEY;

  if (!keyId || !appKey) {
    throw new Error("Missing BACKBLAZE_KEY_ID or BACKBLAZE_APP_KEY environment variables. Add them to Vercel → Settings → Environment Variables.");
  }

  const authString = Buffer.from(keyId + ":" + appKey).toString("base64");

  // Use cache: 'no-store' to bypass Next.js fetch cache — the module-level
  // authCache above already handles caching, and a stale Next.js fetch cache
  // can return an expired token across server restarts.
  const authResponse = await fetch("https://api.backblazeb2.com/b2api/v3/b2_authorize_account", {
    method: "GET",
    headers: { Authorization: "Basic " + authString },
    cache: "no-store"
  });

  if (!authResponse.ok) {
    throw new Error(`Failed to authenticate with Backblaze B2: ${await authResponse.text()}`);
  }

  const authData = await authResponse.json();
  
  // Cache the token (Backblaze tokens are valid for 24 hours)
  authCache = {
    token: authData.authorizationToken,
    downloadUrl: authData.apiInfo.storageApi.downloadUrl,
    expiresAt: now + (23 * 3600000) // Cache for 23 hours to be safe
  };

  return {
    token: authCache.token,
    downloadUrl: authCache.downloadUrl
  };
}

export async function GET(request) {
    // Get fileName from query params - Next.js automatically decodes it
    // But we need to handle + signs which might have been converted to spaces
    let fileName = request.nextUrl.searchParams.get("fileName");
  
    const keyId = process.env.BACKBLAZE_KEY_ID;
    const appKey = process.env.BACKBLAZE_APP_KEY;
    const bucketId = process.env.BACKBLAZE_BUCKET_ID;
    const bucketName = process.env.BACKBLAZE_BUCKET_NAME;
  
    // Validate that all required environment variables are present
    if (!keyId || !appKey || !bucketId || !bucketName) {
      return Response.json(
        { error: "Missing required Backblaze environment variables. Please check your .env.local file." },
        { status: 500 }
      );
    }
  
    // Validate fileName parameter
    if (!fileName) {
      return Response.json(
        { error: "fileName parameter is required" },
        { status: 400 }
      );
    }
    
    // Fix: URL query params convert + to spaces. Restore "room1 + room2" (actual Backblaze folder names).
    // Support both "Floor N/" and "floor N/" (e.g. floor 4).
    const floorDirPattern = '(Floor \\d+\/|floor \\d+\/)'
    fileName = fileName.replace(new RegExp(`(${floorDirPattern})(\\d+)\\s{2,}(\\d+)(\/)`, 'g'), '$1$2 + $3$4')
    fileName = fileName.replace(new RegExp(`(${floorDirPattern})(\\d+) (\\d+)(\/)`, 'g'), '$1$2 + $3$4')
    // Room numbers with spaces anywhere in path (e.g. subfolders)
    fileName = fileName.replace(/\/(\d+)\s{2,}(\d+)\//g, '/$1 + $2/')
    fileName = fileName.replace(/\/(\d+) (\d+)\//g, '/$1 + $2/')
  
    try {
      // Step 1: Get cached or fresh auth token
      let { token, downloadUrl } = await getBackblazeAuth();

      // Step 2: Download the file from Backblaze
      // Encode each path segment separately to preserve forward slashes
      const encodedFileName = fileName
        .split('/')
        .map(segment => encodeURIComponent(segment))
        .join('/');
      
      const buildFileUrl = (dlUrl) => `${dlUrl}/file/${bucketName}/${encodedFileName}`;
      console.log("🔗 Backblaze file URL (encoded):", buildFileUrl(downloadUrl));
      console.log("🔗 Original fileName:", fileName);
      
      let fileResponse = await fetch(buildFileUrl(downloadUrl), {
        method: "GET",
        headers: { Authorization: token }
      });

      // If the token expired, clear the cache, get a fresh token, and retry once
      if (fileResponse.status === 401) {
        console.log("🔄 Backblaze token expired for file, refreshing...");
        authCache = { token: null, downloadUrl: null, expiresAt: 0 };
        ({ token, downloadUrl } = await getBackblazeAuth(true));
        fileResponse = await fetch(buildFileUrl(downloadUrl), {
          method: "GET",
          headers: { Authorization: token }
        });
      }

      if (!fileResponse.ok) {
        const errorText = await fileResponse.text();
        console.error("❌ Failed to download file from Backblaze:", errorText);
        console.error("   Status:", fileResponse.status);
        console.error("   File name:", fileName);
        return Response.json(
          { error: "Failed to download file from Backblaze B2", details: errorText },
          { status: fileResponse.status }
        );
      }
      
      console.log("✅ File downloaded successfully:", fileName);
  
      // Get the file content and content type
      const fileBlob = await fileResponse.blob();
      const contentType = fileResponse.headers.get("content-type") || "application/octet-stream";
      
      // Return the file with appropriate headers
      // Use longer cache times for better performance
      return new Response(fileBlob, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800", // Cache for 24 hours, allow stale for 7 days
          "CDN-Cache-Control": "public, max-age=86400",
        },
      });
    } catch (error) {
      return Response.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    }
  }

