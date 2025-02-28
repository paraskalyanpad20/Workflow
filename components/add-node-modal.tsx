"use client"

import type React from "react"

import { useState } from "react"
import { useWorkflowStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AddNodeModalProps {
  isOpen: boolean
  onClose: () => void
  parentId: string | null
}

export default function AddNodeModal({ isOpen, onClose, parentId }: AddNodeModalProps) {
  const { addNode } = useWorkflowStore()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [actions, setActions] = useState<string[]>([""])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !parentId) return

    // Filter out empty actions
    const filteredActions = actions.filter((action) => action.trim() !== "")

    addNode({
      title,
      description,
      actions: filteredActions,
      parentId,
    })

    // Reset form
    setTitle("")
    setDescription("")
    setActions([""])
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Workflow Step</DialogTitle>
        </DialogHeader>
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
            <Button type="submit">Add Step</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

