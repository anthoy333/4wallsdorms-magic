"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Maximize2, Minimize2 } from "lucide-react"

interface SplitViewFloorPlanProps {
  floorPlanImage: string
  floorPlanAlt: string
  roomNumber: string
  roomCoordinates: {
    x: number
    y: number
    width: number
    height: number
  }
}

export function SplitViewFloorPlan({
  floorPlanImage,
  floorPlanAlt,
  roomNumber,
  roomCoordinates
}: SplitViewFloorPlanProps) {
  // State for zoom level and pan position
  const [zoom, setZoom] = useState(2.5)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 })

  // Refs for interval IDs
  const panIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const zoomedViewRef = useRef<HTMLDivElement>(null)

  // Pan the view by a fixed amount
  const handlePan = (direction: 'up' | 'down' | 'left' | 'right') => {
    const panAmount = 5
    setPanPosition(prev => {
      switch (direction) {
        case 'up':
          return { ...prev, y: prev.y + panAmount }
        case 'down':
          return { ...prev, y: prev.y - panAmount }
        case 'left':
          return { ...prev, x: prev.x + panAmount }
        case 'right':
          return { ...prev, x: prev.x - panAmount }
      }
    })
  }

  // Start continuous pan
  const startContinuousPan = (direction: 'up' | 'down' | 'left' | 'right') => {
    // Clear any existing interval
    if (panIntervalRef.current) {
      clearInterval(panIntervalRef.current)
    }
    
    // Initial pan
    handlePan(direction)
    
    // Set up continuous pan
    panIntervalRef.current = setInterval(() => {
      handlePan(direction)
    }, 50) // Adjust interval for faster/slower movement
  }

  // Stop continuous pan
  const stopContinuousPan = () => {
    if (panIntervalRef.current) {
      clearInterval(panIntervalRef.current)
      panIntervalRef.current = null
    }
  }

  // Handle mouse/touch drag events
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setDragStart({ x: clientX, y: clientY })
    setStartPanPosition({ ...panPosition })
  }

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const deltaX = clientX - dragStart.x
    const deltaY = clientY - dragStart.y

    setPanPosition({
      x: startPanPosition.x + deltaX,
      y: startPanPosition.y + deltaY
    })
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (panIntervalRef.current) {
        clearInterval(panIntervalRef.current)
      }
    }
  }, [])

  // Add and remove event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchmove', handleDragMove)
      window.addEventListener('touchend', handleDragEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchmove', handleDragMove)
      window.removeEventListener('touchend', handleDragEnd)
    }
  }, [isDragging])

  return (
    <div className="w-full space-y-4">
      <h3 className="text-xl font-semibold mb-4">Floor Plan</h3>
      
      {/* Split View Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Floor Plan */}
        <Card className="relative overflow-hidden aspect-[4/3] bg-background">
          <div className="relative w-full h-full">
            {floorPlanImage ? (
              <Image
                src={floorPlanImage}
                alt={floorPlanAlt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                Floor plan not available
              </div>
            )}
            {/* Room Highlight Overlay */}
            <div
              className="absolute bg-yellow-500/20 border-2 border-yellow-500 pointer-events-none"
              style={{
                left: `${roomCoordinates.x}%`,
                top: `${roomCoordinates.y}%`,
                width: `${roomCoordinates.width}%`,
                height: `${roomCoordinates.height}%`,
              }}
            />
          </div>
          <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-sm">
            Full Floor Plan
          </div>
        </Card>

        {/* Zoomed Room View */}
        <div className="relative">
          <Card 
            className="relative overflow-hidden aspect-[4/3] bg-background cursor-move"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            ref={zoomedViewRef}
          >
            <div 
              className="relative w-full h-full transition-transform duration-200"
              style={{
                transform: `
                  translate(${panPosition.x}px, ${panPosition.y}px) 
                  scale(${zoom})
                `,
                transformOrigin: `${roomCoordinates.x}% ${roomCoordinates.y}%`
              }}
            >
              <Image
                src={floorPlanImage}
                alt={`Room ${roomNumber} Detail View`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                draggable={false}
              />
            </div>
            <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-sm">
              Room {roomNumber} Detail
            </div>
          </Card>

          {/* Controls Overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {/* Zoom Controls */}
            <div className="flex flex-col gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-background/80"
                onClick={() => setZoom(z => Math.min(z + 0.5, 4))}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-background/80"
                onClick={() => setZoom(z => Math.max(z - 0.5, 1))}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Pan Controls */}
            <div className="grid grid-cols-3 gap-1">
              <div />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-background/80"
                onMouseDown={() => startContinuousPan('up')}
                onMouseUp={stopContinuousPan}
                onMouseLeave={stopContinuousPan}
                onTouchStart={() => startContinuousPan('up')}
                onTouchEnd={stopContinuousPan}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <div />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-background/80"
                onMouseDown={() => startContinuousPan('left')}
                onMouseUp={stopContinuousPan}
                onMouseLeave={stopContinuousPan}
                onTouchStart={() => startContinuousPan('left')}
                onTouchEnd={stopContinuousPan}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-background/80"
                onClick={() => setPanPosition({ x: 0, y: 0 })}
              >
                <div className="h-1 w-1 bg-foreground rounded-full" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-background/80"
                onMouseDown={() => startContinuousPan('right')}
                onMouseUp={stopContinuousPan}
                onMouseLeave={stopContinuousPan}
                onTouchStart={() => startContinuousPan('right')}
                onTouchEnd={stopContinuousPan}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              <div />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-background/80"
                onMouseDown={() => startContinuousPan('down')}
                onMouseUp={stopContinuousPan}
                onMouseLeave={stopContinuousPan}
                onTouchStart={() => startContinuousPan('down')}
                onTouchEnd={stopContinuousPan}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <div />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}