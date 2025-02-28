"use client"

import { useState } from "react"
import {
  Building2,
  UserCheck,
  FileCheck,
  Package,
  Briefcase,
  MoreHorizontal,
  Plus,
  Trash2,
  Edit,
  FileText,
  Shield,
  Film,
  Send,
} from "lucide-react"
import { useWorkflowStore } from "@/lib/store"
import type { Node } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import EditNodeModal from "./edit-node-modal"
import SideConnectionNode from "./side-connection-node"

const nodeTypeIcons = {
  welcome: { icon: Building2, bg: "bg-blue-100", text: "text-blue-600" },
  personal: { icon: UserCheck, bg: "bg-green-100", text: "text-green-600" },
  verification: { icon: FileCheck, bg: "bg-yellow-100", text: "text-yellow-600" },
  onboarding: { icon: Package, bg: "bg-purple-100", text: "text-purple-600" },
  assets: { icon: Briefcase, bg: "bg-gray-100", text: "text-gray-600" },
  start: { icon: Send, bg: "bg-violet-100", text: "text-violet-600" },
}

// ✅ Function to return color based on action type
const getActionColor = (action: string) => {
  if (action.toLowerCase().includes("company")) return "bg-blue-50 border-blue-200 text-blue-800"
  if (action.toLowerCase().includes("document")) return "bg-orange-50 border-orange-200 text-orange-800"
  if (action.toLowerCase().includes("compliance")) return "bg-green-50 border-green-200 text-green-800"
  if (action.toLowerCase().includes("media")) return "bg-purple-50 border-purple-200 text-purple-800"
  if (action.toLowerCase().includes("whatsapp")) return "bg-green-100 border-green-300 text-green-900"
  return "bg-gray-50 border-gray-200 text-gray-800"
}

interface WorkflowNodeProps {
  node: Node
  onAddNode: () => void
}

export default function WorkflowNode({ node, onAddNode }: WorkflowNodeProps) {
  const { removeNode } = useWorkflowStore()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { icon: NodeIcon, bg, text } = nodeTypeIcons[node.type] || { icon: Building2, bg: "bg-white", text: "text-gray-600" }

  return (
    <div className="relative">
      {/* Node Container */}
      <div className={`relative w-[340px] rounded-xl border border-gray-200 shadow-md p-5 bg-white`} id={`node-${node.id}`}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            {/* Circular Icon Container */}
            <div className={`w-12 h-12 flex items-center justify-center rounded-full ${bg} shadow-sm`}>
              <NodeIcon className={`w-6 h-6 ${text}`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{node.title}</h3>
              <p className="text-sm text-gray-500">{node.description}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-5 w-5 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-md rounded-lg">
              <DropdownMenuItem onClick={() => setIsEditModalOpen(true)} className="text-gray-700">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddNode} className="text-gray-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Next Step
              </DropdownMenuItem>
              {node.type !== "start" && (
                <DropdownMenuItem onClick={() => removeNode(node.id)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Node Actions */}
        {node.actions && node.actions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Actions:</p>
            <div className="space-y-2">
              {node.actions.map((action, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 bg-amber-100 p-3 rounded-lg border border-amber-400 shadow-sm ${getActionColor(action)}`}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-200 shadow">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm">{action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Next Node Button */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-10 w-10 p-0 bg-white border-violet-400 hover:bg-violet-100 shadow-md"
            onClick={onAddNode}
          >
            <Plus className="h-5 w-5 text-violet-600" />
          </Button>
        </div>
      </div>

      {/* Edit Node Modal */}
      <EditNodeModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} node={node} />
    </div>
  )
}
