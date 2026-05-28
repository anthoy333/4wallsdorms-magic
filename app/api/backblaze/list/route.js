// Cache for Backblaze auth tokens (valid for 24 hours)
let authCache = {
  token: null,
  apiUrl: null,
  downloadUrl: null,
  expiresAt: 0
};

async function getBackblazeAuth(forceRefresh = false) {
  // Check if cached token is still valid (with 1 hour buffer)
  const now = Date.now();
  if (!forceRefresh && authCache.token && authCache.expiresAt > now + 3600000) {
    return {
      token: authCache.token,
      apiUrl: authCache.apiUrl,
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
    apiUrl: authData.apiInfo.storageApi.apiUrl,
    downloadUrl: authData.apiInfo.storageApi.downloadUrl,
    expiresAt: now + (23 * 3600000) // Cache for 23 hours to be safe
  };

  return {
    token: authCache.token,
    apiUrl: authCache.apiUrl,
    downloadUrl: authCache.downloadUrl
  };
}

/**
 * Backblaze B2 File List API Route
 * 
 * Lists files in a Backblaze B2 bucket folder.
 * All Backblaze authentication happens server-side - keys are never exposed to the frontend.
 * 
 * Usage: /api/backblaze/list?folder=University/Building/Floor/Room/
 * 
 * Returns: { files: [...], hasMore: boolean, count: number }
 */
export async function GET(request) {
    // Get folder path from URL - Next.js automatically decodes it
    // But we need to handle + signs which might have been converted to spaces
    let folderPath = request.nextUrl.searchParams.get("folder");
  
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
  
    // Validate folder parameter
    if (!folderPath) {
      return Response.json(
        { error: "folder parameter is required" },
        { status: 400 }
      );
    }
  
    // Fix: URL query params convert + to spaces. We need to detect patterns like "201   202" 
    // and convert them back to "201 + 202" (the actual folder name in Backblaze)
    // Match "Floor X/..." (capital F) and "floor X/..." (lowercase e.g. floor 4)
    const floorDirPattern = '(Floor \\d+\/|floor \\d+\/)'
    folderPath = folderPath.replace(new RegExp(`(${floorDirPattern})(\\d+)\\s{2,}(\\d+)(\/)`, 'g'), '$1$2 + $3$4')
    
    // Also handle single space between room numbers (less common but possible)
    folderPath = folderPath.replace(new RegExp(`(${floorDirPattern})(\\d+) (\\d+)(\/)`, 'g'), '$1$2 + $3$4')
    
    // Normalize folder path (ensure it ends with / if not empty)
    const normalizedFolder = folderPath.endsWith('/') ? folderPath : folderPath + '/';
    
    console.log("📁 Received folder path:", request.nextUrl.searchParams.get("folder"))
    console.log("📁 Fixed folder path:", normalizedFolder)
  
    try {
      // Step 1: Get cached or fresh auth token
      let { token, apiUrl, downloadUrl } = await getBackblazeAuth();
  
      // Step 2: List files in the specified folder
      let listResponse = await fetch(apiUrl + "/b2api/v3/b2_list_file_names", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          bucketId: bucketId,
          prefix: normalizedFolder,
          maxFileCount: 1000 // Maximum files per request
        })
      });
  
      // If the token expired, clear the cache, get a fresh token, and retry once
      if (listResponse.status === 401) {
        console.log("🔄 Backblaze token expired for list, refreshing...");
        authCache = { token: null, apiUrl: null, downloadUrl: null, expiresAt: 0 };
        ({ token, apiUrl, downloadUrl } = await getBackblazeAuth(true));
        listResponse = await fetch(apiUrl + "/b2api/v3/b2_list_file_names", {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            bucketId: bucketId,
            prefix: normalizedFolder,
            maxFileCount: 1000
          })
        });
      }

      if (!listResponse.ok) {
        const errorText = await listResponse.text();
        return Response.json(
          { error: "Failed to list files from Backblaze B2", details: errorText },
          { status: listResponse.status }
        );
      }
  
      const listData = await listResponse.json();
      
      console.log(`📦 Backblaze API response:`, {
        fileCount: listData.files?.length || 0,
        nextFileName: listData.nextFileName,
        prefix: normalizedFolder
      });
      
      // Step 3: Format the response to be frontend-friendly.
      // Files are served via direct Backblaze CDN URLs (bucket is public) so the
      // browser fetches them straight from Backblaze instead of proxying through
      // this server — dramatically faster for images and especially videos.
      const files = (listData.files || [])
        .filter(file => {
          // Filter out folder markers (files that are just directory markers)
          // Only include actual files (not empty folder markers)
          return file.contentLength > 0 || file.contentType;
        })
        .map(file => {
          // Determine file type based on content type
          const contentType = file.contentType || '';
          const fileNameLower = (file.fileName || '').toLowerCase();
          let type = 'unknown';
          if (contentType.startsWith('image/')) {
            type = 'image';
          } else if (contentType.startsWith('video/')) {
            type = 'video';
          } else if (/\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(fileNameLower)) {
            type = 'image';
          } else if (/\.(mp4|mov|webm|m4v)$/i.test(fileNameLower)) {
            type = 'video';
          }

          // Build direct CDN URL: encode each path segment separately so slashes are preserved
          const encodedPath = file.fileName
            .split('/')
            .map(segment => encodeURIComponent(segment))
            .join('/');
          
          return {
            fileName: file.fileName,
            fileId: file.fileId,
            contentLength: file.contentLength,
            contentType: file.contentType,
            uploadTimestamp: file.uploadTimestamp,
            type: type,
            url: `${downloadUrl}/file/${bucketName}/${encodedPath}`
          };
        });
      
      // Sort files: images first, then videos, then others
      files.sort((a, b) => {
        const typeOrder = { image: 0, video: 1, unknown: 2 };
        return (typeOrder[a.type] || 2) - (typeOrder[b.type] || 2);
      });
      
      const response = Response.json({
        files: files,
        nextFileName: listData.nextFileName || null,
        hasMore: !!listData.nextFileName,
        folder: normalizedFolder,
        count: files.length
      });
      
      // Cache the file list for 24 h at the CDN; serve stale for up to 7 days while revalidating
      response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
      
      return response;
    } catch (error) {
      console.error("Backblaze list error:", error);
      return Response.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    }
  }

