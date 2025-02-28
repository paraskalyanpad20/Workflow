"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useWorkflowStore } from "@/lib/store"
import type { Node } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EditNodeModalProps {
  isOpen: boolean
  onClose: () => void
  node: Node
}

export default function EditNodeModal({ isOpen, onClose, node }: EditNodeModalProps) {
  const { updateNode, addSideConnection } = useWorkflowStore()
  const [title, setTitle] = useState(node.title)
  const [description, setDescription] = useState(node.description || "")
  const [actions, setActions] = useState<string[]>(node.actions || [""])

  // Side connection state
  const [sideConnectionTitle, setSideConnectionTitle] = useState("")
  const [sideConnectionDescription, setSideConnectionDescription] = useState("")

  useEffect(() => {
    if (isOpen) {
      setTitle(node.title)
      setDescription(node.description || "")
      setActions(node.actions?.length ? [...node.actions] : [""])
      setSideConnectionTitle("")
      setSideConnectionDescription("")
    }
  }, [isOpen, node])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    // Filter out empty actions
    const filteredActions = actions.filter((action) => action.trim() !== "")

    updateNode(node.id, {
      ...node,
      title,
      description,
      actions: filteredActions,
    })

    onClose()
  }

  const handleActionChange = (index: number, value: string) => {
    const newActions = [...actions]
    newActions[index] = value
    setActions(newActions)
  }

  const addAction = () => {
    setActions([...actions, ""])
  }

  const removeAction = (index: number) => {
    const newActions = actions.filter((_, i) => i !== index)
    setActions(newActions.length ? newActions : [""])
  }

  const handleAddSideConnection = () => {
    if (!sideConnectionTitle.trim()) return

    addSideConnection(node.id, {
      title: sideConnectionTitle,
      description: sideConnectionDescription,
    })

    setSideConnectionTitle("")
    setSideConnectionDescription("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Workflow Step</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="main">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="main">Main Settings</TabsTrigger>
            <TabsTrigger value="side">Side Connections</TabsTrigger>
          </TabsList>

          <TabsContent value="main">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter step title"
                    required
                    disabled={node.type === "start"}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter step description"
                    rows={3}
                    disabled={node.type === "start"}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Actions</Label>
                  {actions.map((action, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={action}
                        onChange={(e) => handleActionChange(index, e.target.value)}
                        placeholder={`Action ${index + 1}`}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => removeAction(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addAction} className="mt-2">
                    Add Action
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="side">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="sideTitle">Side Connection Title</Label>
                <Input
                  id="sideTitle"
                  value={sideConnectionTitle}
                  onChange={(e) => setSideConnectionTitle(e.target.value)}
                  placeholder="E.g., WhatsApp Reminder"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sideDescription">Description</Label>
                <Textarea
                  id="sideDescription"
                  value={sideConnectionDescription}
                  onChange={(e) => setSideConnectionDescription(e.target.value)}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              <Button type="button" onClick={handleAddSideConnection} disabled={!sideConnectionTitle.trim()}>
                Add Side Connection
              </Button>

              {node.sideConnections && node.sideConnections.length > 0 && (
                <div className="mt-4">
                  <Label>Existing Side Connections</Label>
                  <div className="mt-2 space-y-2">
                    {node.sideConnections.map((connection, index) => (
                      <div key={index} className="p-3 border rounded-md bg-gray-50">
                        <p className="font-medium text-sm">{connection.title}</p>
                        <p className="text-xs text-gray-500">{connection.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

