"use client"

import { useState } from "react"
import { Plus, Filter } from "lucide-react"
import { useWorkflowStore } from "@/lib/store"
import WorkflowNode from "./workflow-node"
import NodeConnections from "./node-connections"
import AddNodeModal from "./add-node-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function WorkflowEditor() {
  const { nodes, connections } = useWorkflowStore()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)

  const handleAddNode = (parentId: string) => {
    setSelectedParentId(parentId)
    setIsAddModalOpen(true)
  }

  return (
    <div className="relative bg-white rounded-lg shadow-md border border-gray-300 p-6 min-h-[600px]">
      {/* Action Box (Header Section) */}
      <div className="mb-8 p-5 bg-purple-100 rounded-lg border border-purple-400 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-purple-900">Basic Onboarding</h2>
          <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-200">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 font-medium">Who:</span>
            <div className="flex gap-2">
              <Badge className="bg-purple-100 hover:bg-purple-200 text-gray-800 px-2 py-1 rounded-md">Employees - All</Badge>
              <Badge className="bg-purple-100 hover:bg-purple-200 text-gray-800 px-2 py-1 rounded-md">Clients - All</Badge>
              <Badge className="bg-purple-100 hover:bg-purple-200 text-gray-800 px-2 py-1 rounded-md">Locations - B</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 font-medium">When:</span>
            <span className="text-sm text-gray-600">Runs automatically when a new user is added</span>
          </div>
        </div>
      </div>

      {/* Add Node Button */}
      <div className="flex justify-start mb-6">
        <Button
          variant="outline"
          onClick={() => handleAddNode(nodes.length === 0 ? "root" : nodes[0].id)}
          className="flex items-center gap-2 border-purple-500 text-purple-700 hover:bg-purple-100"
        >
          <Plus className="h-4 w-4" />
          Add Node
        </Button>
      </div>

      {/* Workflow Nodes and Connections */}
      <div className="relative workflow-canvas min-h-[500px]">
        <NodeConnections connections={connections} nodes={nodes} />

        <div className="flex flex-col items-center gap-16 relative">
          {nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
              <p>No nodes yet. Click &quot;Add Node&quot; to create your first workflow step.</p>
            </div>
          ) : (
            nodes.map((node) => (
              <WorkflowNode key={node.id} node={node} onAddNode={() => handleAddNode(node.id)} />
            ))
          )}
        </div>
      </div>

      {/* Add Node Modal */}
      <AddNodeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} parentId={selectedParentId} />
    </div>
  )
}
