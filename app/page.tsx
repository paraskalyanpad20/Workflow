import WorkflowEditor from "@/components/workflow-editor"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Workflow Editor</h1>
        <WorkflowEditor />
      </div>
    </main>
  )
}

