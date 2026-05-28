/**
 * One-off diagnostic: fetch a Backblaze image URL and report status + headers.
 * Open in browser: /api/debug-backblaze-image
 * Use this to see 403, CORS, redirects, etc. — then delete this file.
 */

const SAMPLE_IMAGE_URL =
  "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+2/201+%2B+202/sumiller201-plaque-imp-6.jpg"

export async function GET() {
  const result: Record<string, unknown> = {
    url: SAMPLE_IMAGE_URL,
    timestamp: new Date().toISOString(),
  }

  try {
    const res = await fetch(SAMPLE_IMAGE_URL, {
      method: "GET",
      headers: {
        Accept: "image/*",
        "User-Agent": "4WallsDorms-Debug/1.0",
      },
      redirect: "follow",
    })

    result.status = res.status
    result.statusText = res.statusText
    result.ok = res.ok
    result.redirected = res.redirected
    result.urlAfterRedirects = res.url

    const headers: Record<string, string> = {}
    res.headers.forEach((value, key) => {
      headers[key] = value
    })
    result.responseHeaders = headers

    const contentType = res.headers.get("content-type") ?? ""
    result.contentType = contentType
    result.isImage = contentType.startsWith("image/")

    if (res.ok) {
      const blob = await res.blob()
      result.bodySizeBytes = blob.size
    } else {
      result.bodyPreview = (await res.text()).slice(0, 500)
    }
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err)
  }

  return Response.json(result, {
    headers: { "Content-Type": "application/json" },
  })
}
