"use client"

import { useState, useRef, useEffect } from "react"

interface PullTabDrawerProps {
  roomLabel: string
  children?: React.ReactNode
}

export function PullTabDrawer({ roomLabel, children }: PullTabDrawerProps) {
  const [drawerHeight, setDrawerHeight] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [startHeight, setStartHeight] = useState(0)
  const [maxHeight, setMaxHeight] = useState(1200) // Default value for SSR
  const drawerRef = useRef<HTMLDivElement>(null)
  const tabRef = useRef<HTMLDivElement>(null)

  // Back button area is approximately 80px (pt-6 pb-4 + button height)
  const backButtonAreaHeight = 80
  const minHeight = 0
  const tabHeight = 80

  // Calculate max height on client side only to avoid hydration mismatch
  useEffect(() => {
    const calculateMaxHeight = () => {
      const calculatedMaxHeight = Math.min(
        window.innerHeight * 0.9, 
        window.innerHeight - backButtonAreaHeight - 20
      )
      setMaxHeight(calculatedMaxHeight)
    }

    calculateMaxHeight()
    window.addEventListener('resize', calculateMaxHeight)

    return () => {
      window.removeEventListener('resize', calculateMaxHeight)
    }
  }, [])

  // Handle drag start
  const handleStart = (clientY: number) => {
    setIsDragging(true)
    setStartY(clientY)
    setStartHeight(drawerHeight)
  }

  // Handle drag move
  const handleMove = (clientY: number) => {
    if (!isDragging) return
    
    const deltaY = startY - clientY // Inverted because dragging up should increase height, dragging down decreases
    const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY))
    setDrawerHeight(newHeight)
  }

  // Handle drag end
  const handleEnd = () => {
    setIsDragging(false)
    
    // Snap to nearest position (collapsed or expanded)
    if (drawerHeight < maxHeight / 2) {
      setDrawerHeight(0)
    } else {
      setDrawerHeight(maxHeight)
    }
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleStart(e.clientY)
  }

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        handleMove(e.clientY)
      }
      
      const handleMouseUp = () => {
        handleEnd()
      }

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, startY, startHeight, drawerHeight, maxHeight])

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const touch = e.touches[0]
    handleStart(touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      e.preventDefault()
      e.stopPropagation()
      const touch = e.touches[0]
      handleMove(touch.clientY)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleEnd()
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40" style={{ pointerEvents: drawerHeight > 0 ? 'auto' : 'none' }}>
      {/* Drawer Container - Expands upward */}
      <div
        ref={drawerRef}
        className="bg-background border-t border-border rounded-t-2xl overflow-hidden transition-all duration-300 ease-out"
        style={{
          height: `${drawerHeight + tabHeight}px`,
          maxHeight: `${maxHeight + tabHeight}px`,
          pointerEvents: 'auto',
        }}
      >
        {/* Pull Tab - Always visible, acts as header when drawer is expanded */}
        <div
          ref={tabRef}
          className="bg-gray-100 rounded-t-2xl cursor-grab active:cursor-grabbing select-none touch-none"
          style={{ touchAction: 'none' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Tab Handle Indicator */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
          
          {/* Room Label */}
          <div className="px-6 pb-4 pt-2">
            <h3 className="text-lg font-semibold text-foreground">
              {roomLabel}
            </h3>
          </div>
        </div>

        {/* Drawer Content - Only visible when drawer is expanded */}
        {drawerHeight > 20 && (
          <div 
            className="overflow-y-auto bg-background"
            style={{ 
              height: `${drawerHeight}px`,
            }}
          >
            <div className="px-6 py-4">
              {children || (
                <div className="text-muted-foreground">
                  Drawer content goes here
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
