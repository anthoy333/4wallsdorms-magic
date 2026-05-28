/**
 * Discovers all 10 West rooms that have media in Backblaze
 * This queries Backblaze directly to see what rooms exist with actual photos/videos
 */

interface BackblazeFile {
  fileName: string
  fileId: string
  contentLength: number
  contentType: string
  uploadTimestamp: number
  type: 'image' | 'video' | 'unknown'
  url: string
}

/**
 * Extracts room number from a Backblaze file path
 * Example: "Suffolk University Dorms/10 west dorm/4+floor/413/suwest413A-video.mp4" -> "413"
 */
function extractRoomNumberFromPath(filePath: string): string | null {
  // Pattern: .../X+floor/ROOM/...
  const match = filePath.match(/\/(\d+[M]?\d*)\//g)
  if (match && match.length >= 2) {
    // Get the last folder name before the file (should be the room number)
    const roomMatch = filePath.match(/\/(\d+[M]?\d*)\/[^\/]+$/)
    if (roomMatch) {
      return roomMatch[1]
    }
  }
  return null
}

/**
 * Gets floor number from room number for sorting
 */
function getFloorFromRoom(roomNumber: string): number {
  if (roomNumber.startsWith('4M')) {
    return 4.5 // 4M comes between floor 4 and floor 5
  }
  if (roomNumber.length === 3) {
    return parseInt(roomNumber.charAt(0))
  }
  if (roomNumber.length === 4) {
    return parseInt(roomNumber.substring(0, 2))
  }
  return 999
}

/**
 * Discovers all rooms with media in Backblaze for 10 West
 */
export async function discoverTenWestRoomsWithMedia(): Promise<string[]> {
  try {
    console.log('🔍 Discovering 10 West rooms from Backblaze...')
    
    const roomsWithMedia = new Set<string>()
    
    // First, try a specific known room to test if the API works
    console.log('🧪 Testing with known room 413...')
    const testPath = 'Suffolk University Dorms/10 west dorm/4+floor/413/'
    const testEncodedPath = encodeURIComponent(testPath)
    const testResponse = await fetch(`/api/backblaze/list?folder=${testEncodedPath}`)
    
    if (testResponse.ok) {
      const testData = await testResponse.json()
      console.log('✅ Test successful! Found files:', testData.files?.length || 0)
      if (testData.files && testData.files.length > 0) {
        console.log('📋 Sample file:', testData.files[0])
        roomsWithMedia.add('413')
      }
    } else {
      console.error('❌ Test failed:', testResponse.status, await testResponse.text())
    }
    
    // Query all floors in 10 West
    const floors = ['2+floor', '3+floor', '4+floor', '4M+floor', '5+floor', '6+floor', '7+floor', '8+floor']
    
    for (const floor of floors) {
      try {
        const folderPath = `Suffolk University Dorms/10 west dorm/${floor}/`
        const encodedPath = encodeURIComponent(folderPath)
        
        console.log(`📁 Checking floor: ${floor} at path: ${folderPath}`)
        const response = await fetch(`/api/backblaze/list?folder=${encodedPath}`)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.warn(`⚠️ Could not access floor ${floor}: ${response.status}`, errorText)
          continue
        }
        
        const data = await response.json()
        const files = (data.files || []) as BackblazeFile[]
        
        console.log(`📄 Found ${files.length} items in ${floor}`)
        
        // Log first few file names for debugging
        if (files.length > 0) {
          console.log(`📋 First 5 items from ${floor}:`, files.slice(0, 5).map(f => ({
            name: f.fileName,
            type: f.type,
            size: f.contentLength
          })))
        }
        
        // Extract room numbers from file paths
        for (const file of files) {
          // Skip empty folder markers
          if (file.contentLength === 0) {
            continue
          }
          
          // Only count actual media files
          if (file.type !== 'image' && file.type !== 'video') {
            continue
          }
          
          // Skip bathroom files (they belong to shared space pages)
          const fileNameLower = file.fileName.toLowerCase()
          if (fileNameLower.includes('bathroom') || fileNameLower.includes('bath') || 
              fileNameLower.includes('toilet') || fileNameLower.includes('shower')) {
            continue
          }
          
          // Extract room number from path
          const roomNumber = extractRoomNumberFromPath(file.fileName)
          if (roomNumber) {
            roomsWithMedia.add(roomNumber)
            console.log(`   ✅ Found room ${roomNumber} (from file: ${file.fileName.split('/').pop()})`)
          }
        }
      } catch (error) {
        console.error(`❌ Error checking floor ${floor}:`, error)
      }
    }
    
    // Convert to array and sort by floor and room number
    const roomsArray = Array.from(roomsWithMedia).sort((a, b) => {
      const aFloor = getFloorFromRoom(a)
      const bFloor = getFloorFromRoom(b)
      
      // First sort by floor
      if (aFloor !== bFloor) {
        return aFloor - bFloor
      }
      
      // If same floor, sort by room number
      if (a.startsWith('4M') && b.startsWith('4M')) {
        return a.localeCompare(b)
      }
      
      const aNum = parseInt(a)
      const bNum = parseInt(b)
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum
      }
      return a.localeCompare(b)
    })
    
    console.log(`✅ Discovered ${roomsArray.length} rooms with media:`, roomsArray)
    return roomsArray
    
  } catch (error) {
    console.error('❌ Error discovering rooms from Backblaze:', error)
    return []
  }
}

