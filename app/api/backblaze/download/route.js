export async function GET(request) {
    const fileName = request.nextUrl.searchParams.get("fileName");
    const bucketName = process.env.BACKBLAZE_BUCKET_NAME;
  
    const keyId = process.env.BACKBLAZE_KEY_ID;
    const appKey = process.env.BACKBLAZE_APP_KEY;
    const bucketId = process.env.BACKBLAZE_BUCKET_ID;
  
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
  
    const authString = Buffer.from(keyId + ":" + appKey).toString("base64");
  
    try {
      // Step 1: Authorize with Backblaze
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
      const downloadUrl = authData.apiInfo.storageApi.downloadUrl;
      const token = authData.authorizationToken;
  
      // Step 2: Get download authorization for the file
      // For private buckets, we need to get download authorization
      const apiUrl = authData.apiInfo.storageApi.apiUrl;
      
      const downloadAuthResponse = await fetch(apiUrl + "/b2api/v3/b2_get_download_authorization", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          bucketId: bucketId,
          fileNamePrefix: fileName,
          validDurationInSeconds: 3600 // 1 hour validity
        })
      });
  
      if (!downloadAuthResponse.ok) {
        // If download authorization fails, try direct download URL with token
        // This works for files that are accessible with the authorization token
        const directUrl = `${downloadUrl}/file/${bucketName}/${fileName}`;
        return Response.json({
          downloadUrl: directUrl,
          authorizationToken: token,
          method: "direct"
        });
      }
  
      const downloadAuthData = await downloadAuthResponse.json();
      
      // Construct the authorized download URL
      const authorizedUrl = `${downloadUrl}/file/${bucketName}/${fileName}?Authorization=${downloadAuthData.authorizationToken}`;
      
      return Response.json({
        downloadUrl: authorizedUrl,
        authorizationToken: downloadAuthData.authorizationToken,
        method: "authorized"
      });
    } catch (error) {
      return Response.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    }
  }

