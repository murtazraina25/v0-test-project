import { ConnectorDashboard } from "@/components/connector-dashboard"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Document Processing System</h1>
        <ConnectorDashboard />
      </div>
    </div>
  )
}
