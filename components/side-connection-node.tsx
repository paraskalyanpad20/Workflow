"use client"

import { MessageSquare, Trash2 } from "lucide-react"
import { useWorkflowStore } from "@/lib/store"
import type { SideConnection } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface SideConnectionNodeProps {
  connection: SideConnection
  parentNodeId: string
}

export default function SideConnectionNode({ connection, parentNodeId }: SideConnectionNodeProps) {
  const { removeSideConnection } = useWorkflowStore()

  return (
    <div className="relative">
      {/* Horizontal connector line */}
      <div className="absolute left-[-40px] top-1/2 w-[40px] border-t-2 border-dashed border-gray-300"></div>

      <div className="w-[200px] rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 text-blue-500 mr-2" />
            <h4 className="font-medium text-sm">{connection.title}</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => removeSideConnection(parentNodeId, connection.id)}
          >
            <Trash2 className="h-3 w-3 text-gray-500" />
          </Button>
        </div>
        <p className="text-xs text-gray-500">{connection.description}</p>
      </div>
    </div>
  )
}

