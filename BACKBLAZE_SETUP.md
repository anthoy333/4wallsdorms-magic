# Backblaze B2 Cloud Storage Setup

This document describes the Backblaze B2 integration for loading and displaying dorm room photos and videos.

## Overview

All Backblaze B2 API calls happen **server-side only**. The frontend never directly accesses Backblaze keys or makes direct API calls. This ensures security and prevents API key exposure.

## Architecture

### Server-Side API Routes

1. **`/api/backblaze/list`** - Lists files in a Backblaze folder
   - Usage: `/api/backblaze/list?folder=University/Building/Floor/Room/`
   - Returns: `{ files: [...], hasMore: boolean, count: number }`
   - All files include secure proxy URLs via `/api/backblaze/file`

2. **`/api/backblaze/file`** - Proxies files from Backblaze (for serving media)
   - Usage: `/api/backblaze/file?fileName=path/to/file.jpg`
   - Returns: File stream with proper content-type headers
   - Works seamlessly with Next.js Image component and HTML video tags

3. **`/api/backblaze/download`** - Alternative download URL generator
   - Usage: `/api/backblaze/download?fileName=path/to/file.jpg`
   - Returns: Download URL with authorization token

### Frontend Component

**`BackblazeMediaViewer`** - React component that displays all photos and videos from a Backblaze folder
- Fetches files from `/api/backblaze/list`
- Displays images and videos in a gallery with lightbox
- Handles navigation, thumbnails, and video playback
- Fully responsive and accessible

## Environment Variables

Required in `.env.local`:

```env
BACKBLAZE_KEY_ID=your_key_id
BACKBLAZE_APP_KEY=your_app_key
BACKBLAZE_BUCKET_ID=your_bucket_id
BACKBLAZE_BUCKET_NAME=your_bucket_name
```

**Important**: `.env.local` is gitignored and never committed to the repository.

## Folder Structure

Files in Backblaze should be organized by:
```
University/Building/Floor/Room/
```

Example:
```
Suffolk University Dorms/Miller/Floor 2/201/
Suffolk University Dorms/Miller/Floor 2/201 + 202/
Suffolk University Dorms/Miller/Floor 4/405/
```

## Usage

### In a Room Page Component

```tsx
import { BackblazeMediaViewer } from "@/app/components/BackblazeMediaViewer"

export default function RoomPage() {
  const folder = "Suffolk University Dorms/Miller/Floor 2/201/"
  
  return (
    <div>
      <BackblazeMediaViewer 
        folder={folder}
        title="Room Photos & Videos"
      />
    </div>
  )
}
```

### Component Props

- `folder` (required): Backblaze folder path (e.g., "Suffolk University Dorms/Miller/Floor 2/201/")
- `title` (optional): Section title (default: "Room Media")
- `className` (optional): Additional CSS classes

## Features

✅ **Secure**: All Backblaze calls happen server-side  
✅ **Automatic**: Fetches and displays all files in a folder  
✅ **Smart**: Automatically detects images vs videos  
✅ **Responsive**: Works on all screen sizes  
✅ **Accessible**: Keyboard navigation and ARIA labels  
✅ **Performance**: Caching headers and optimized loading  
✅ **Error Handling**: Graceful error states and loading indicators  

## File Types Supported

- **Images**: JPG, PNG, WebP, GIF, etc. (any image/* content type)
- **Videos**: MP4, MOV, WebM, etc. (any video/* content type)

## Future Enhancements

This is a long-term feature. Future steps may include:
- Pagination for folders with many files
- File upload functionality
- Image optimization and thumbnails
- Video transcoding
- Metadata extraction (EXIF data, video duration, etc.)
- Search and filtering capabilities

## Security Notes

1. **Never expose Backblaze keys in frontend code**
2. **All API routes validate environment variables**
3. **File access is controlled through server-side proxy**
4. **Error messages don't leak sensitive information**

## Troubleshooting

### No files showing
- Check folder path matches Backblaze structure exactly
- Verify files exist in the Backblaze bucket
- Check browser console for API errors

### Authentication errors
- Verify all environment variables are set in `.env.local`
- Restart Next.js dev server after changing `.env.local`
- Check that keys have proper permissions in Backblaze

### Files not loading
- Verify `/api/backblaze/file` route is working
- Check network tab for 404 or 500 errors
- Ensure file names don't have special characters that need encoding

