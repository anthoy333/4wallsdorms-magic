"use client"

import { useState, useEffect } from "react"

interface BackblazeFile {
  fileName: string
  fileId: string
  contentLength: number
  contentType: string
  uploadTimestamp: number
  type: 'image' | 'video' | 'unknown'
  url: string
}

export interface FolderMedia {
  src: string
  alt: string
  caption?: string
  type: 'image' | 'video'
}

/**
 * Generic hook to fetch all media from any Backblaze folder path.
 *
 * @param folderPath - Full Backblaze folder path, e.g.
 *   "Suffolk University Dorms/Miller/Average Semi Private Bathroom/"
 */
export function useBackblazeFolder(folderPath: string) {
  const [media, setMedia] = useState<FolderMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!folderPath) return

    const fetchMedia = async () => {
      setLoading(true)
      setError(null)

      try {
        const encodedPath = encodeURIComponent(folderPath)
        const response = await fetch(`/api/backblaze/list?folder=${encodedPath}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to fetch files: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        const files: FolderMedia[] = (data.files || [])
          .filter((f: BackblazeFile) => f.type === 'image' || f.type === 'video')
          .map((f: BackblazeFile) => {
            const fileName = f.fileName.split('/').pop() || ''
            const caption = fileName
              .replace(/\.(jpg|jpeg|png|mp4|mov|webm)$/i, '')
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase())

            return {
              src: f.url,
              alt: fileName,
              caption,
              type: f.type as 'image' | 'video',
            }
          })

        setMedia(files)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load media')
        setMedia([])
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [folderPath])

  return { media, loading, error }
}
