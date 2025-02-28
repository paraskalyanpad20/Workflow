"use client"

import { useEffect, useState } from "react"
import type { Connection, Node } from "@/lib/types"
import type { JSX } from "react"

interface NodeConnectionsProps {
  connections: Connection[]
  nodes: Node[]
}

export default function NodeConnections({ connections, nodes }: NodeConnectionsProps) {
  const [lines, setLines] = useState<JSX.Element[]>([])
  
  useEffect(() => {
    const calculateLines = () => {
      const newLines: JSX.Element[] = []
      
      connections.forEach((connection, index) => {
        const sourceElement = document.getElementById(`node-${connection.source}`)
        const targetElement = document.getElementById(`node-${connection.target}`)
        
        if (sourceElement && targetElement) {
          const sourceRect = sourceElement.getBoundingClientRect()
          const targetRect = targetElement.getBoundingClientRect()
          
          const canvasRect = sourceElement.closest(".workflow-canvas")?.getBoundingClientRect() || { top: 0, left: 0 }
          
          const startX = sourceRect.left + sourceRect.width / 2 - canvasRect.left
          const startY = sourceRect.bottom - canvasRect.top
          const endX = targetRect.left + targetRect.width / 2 - canvasRect.left
          const endY = targetRect.top - canvasRect.top
          
          // Make sure the dash pattern is clearly visible
          // Adjust these values to match the exact visual in your image
          newLines.push(
            <svg
              key={`connection-${index}`}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ zIndex: -1 }}
            >
              <path
                d={`M ${startX} ${startY} C ${startX} ${startY + (endY - startY) / 2}, ${endX} ${startY + (endY - startY) / 2}, ${endX} ${endY}`}
                stroke="#8B5CF6" // Purple color matching your design
                strokeWidth="2"
                strokeDasharray="6,6" // Adjust dash pattern to match image
                strokeLinecap="round"
                fill="none"
              />
            </svg>,
          )
        }
      })
      
      setLines(newLines)
    }
    
    // Run calculation after DOM has fully rendered
    const timer = setTimeout(calculateLines, 300) // Increased timeout for better reliability
    
    // Recalculate when window is resized
    window.addEventListener("resize", calculateLines)
    
    // Also recalculate when DOM might have changed
    const observer = new MutationObserver(calculateLines)
    const canvas = document.querySelector(".workflow-canvas")
    if (canvas) {
      observer.observe(canvas, { childList: true, subtree: true })
    }
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", calculateLines)
      observer.disconnect()
    }
  }, [connections, nodes])
  
  return <>{lines}</>
}