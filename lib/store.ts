"use client"

import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"
import type { WorkflowState, Node, Connection } from "./types"

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [
    {
      id: "start-node",
      title: "Start Workflow",
      description: "This is the starting point of your workflow",
      type: "start",
      actions: [],
      sideConnections: [],
    },
  ],
  connections: [],

  addNode: ({ title, description, actions, parentId }) => {
    const newNodeId = uuidv4()

    set((state) => {
      // Create the new node
      const newNode: Node = {
        id: newNodeId,
        title,
        description,
        actions,
        type: "normal",
        sideConnections: [],
      }

      // Create a connection if there's a parent
      let newConnections = [...state.connections]
      if (parentId && parentId !== "root") {
        const newConnection: Connection = {
          id: uuidv4(),
          source: parentId,
          target: newNodeId,
        }
        newConnections = [...newConnections, newConnection]
      }

      return {
        nodes: [...state.nodes, newNode],
        connections: newConnections,
      }
    })
  },

  updateNode: (id, updatedNode) => {
    set((state) => ({
      nodes: state.nodes.map((node) => (node.id === id ? { ...node, ...updatedNode } : node)),
    }))
  },

  removeNode: (id) => {
    set((state) => {
      // Get all child nodes that need to be removed
      const nodesToRemove = new Set<string>([id])
      let foundNew = true

      // Find all descendants recursively
      while (foundNew) {
        foundNew = false
        state.connections.forEach((conn) => {
          if (nodesToRemove.has(conn.source) && !nodesToRemove.has(conn.target)) {
            nodesToRemove.add(conn.target)
            foundNew = true
          }
        })
      }

      // Filter out the nodes and their connections
      return {
        nodes: state.nodes.filter((node) => !nodesToRemove.has(node.id)),
        connections: state.connections.filter(
          (conn) => !nodesToRemove.has(conn.source) && !nodesToRemove.has(conn.target),
        ),
      }
    })
  },

  addSideConnection: (nodeId, { title, description }) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId) {
          const newSideConnection = {
            id: uuidv4(),
            title,
            description,
          }
          return {
            ...node,
            sideConnections: [...(node.sideConnections || []), newSideConnection],
          }
        }
        return node
      }),
    }))
  },

  removeSideConnection: (nodeId, connectionId) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId && node.sideConnections) {
          return {
            ...node,
            sideConnections: node.sideConnections.filter((conn) => conn.id !== connectionId),
          }
        }
        return node
      }),
    }))
  },
}))

