export interface SideConnection {
  id: string
  title: string
  description: string
}

export interface Node {
  id: string
  title: string
  description?: string
  type?: "start" | "welcome" | "personal" | "verification" | "onboarding" | "assets"
  actions?: string[]
  sideConnections?: SideConnection[]
}

export interface Connection {
  id: string
  source: string
  target: string
}

export interface WorkflowState {
  nodes: Node[]
  connections: Connection[]
  addNode: (nodeData: {
    title: string
    description?: string
    actions?: string[]
    parentId: string
    type?: string
  }) => void
  updateNode: (id: string, updatedNode: Node) => void
  removeNode: (id: string) => void
  addSideConnection: (nodeId: string, connectionData: { title: string; description: string }) => void
  removeSideConnection: (nodeId: string, connectionId: string) => void
}

