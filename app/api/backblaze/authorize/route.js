export async function GET(request) {
    const folderPath = request.nextUrl.searchParams.get("folder");
  
    const keyId = process.env.BACKBLAZE_KEY_ID;
    const appKey = process.env.BACKBLAZE_APP_KEY;
    const bucketId = process.env.BACKBLAZE_BUCKET_ID;
  
    // Validate that all required environment variables are present
    if (!keyId || !appKey || !bucketId) {
      return Response.json(
        { error: "Missing required Backblaze environment variables. Please check your .env.local file." },
        { status: 500 }
      );
    }
  
    const authString = Buffer.from(keyId + ":" + appKey).toString("base64");
  
    try {
      const authResponse = await fetch("https://api.backblazeb2.com/b2api/v3/b2_authorize_account", {
        method: "GET",
        headers: { Authorization: "Basic " + authString }
      });
  
      if (!authResponse.ok) {
        return Response.json(
          { error: "Failed to authenticate with Backblaze B2", details: await authResponse.text() },
          { status: authResponse.status }
        );
      }
  
      const authData = await authResponse.json();
      const apiUrl = authData.apiInfo.storageApi.apiUrl;
      const token = authData.authorizationToken;
  
      const listResponse = await fetch(apiUrl + "/b2api/v3/b2_list_file_names", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          bucketId: bucketId,
          prefix: folderPath || ""
        })
      });
  
      if (!listResponse.ok) {
        return Response.json(
          { error: "Failed to list files from Backblaze B2", details: await listResponse.text() },
          { status: listResponse.status }
        );
      }
  
      const listData = await listResponse.json();
      
      // Format the response to be more frontend-friendly
      const files = (listData.files || []).map(file => ({
        fileName: file.fileName,
        fileId: file.fileId,
        contentLength: file.contentLength,
        contentType: file.contentType,
        uploadTimestamp: file.uploadTimestamp,
        // Determine if it's an image or video based on content type
        type: file.contentType?.startsWith('image/') ? 'image' : 
              file.contentType?.startsWith('video/') ? 'video' : 'unknown',
        // Generate API URL for accessing the file
        url: `/api/backblaze/file?fileName=${encodeURIComponent(file.fileName)}`
      }));
      
      return Response.json({
        files: files,
        nextFileName: listData.nextFileName || null,
        hasMore: !!listData.nextFileName
      });
    } catch (error) {
      return Response.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    }
  }

