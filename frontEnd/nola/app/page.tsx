import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsGrid } from "@/components/metrics-grid"
import { ActivityChart } from "@/components/activity-chart"
import { TopicsSection } from "@/components/topics-section"
import { LeaderboardSection } from "@/components/leaderboard-section"
// import { ChatbotWidget } from "@/components/chatbot-widget"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <DashboardHeader />

          <div className="mt-8 space-y-6">
            <MetricsGrid />
            <ActivityChart />
            {/* <TopicsSection /> */}
            <LeaderboardSection />
          </div>
        </main>
      </div>

      {/* Chatbot Widget */}
      {/* <ChatbotWidget /> */}
    </div>
  )
}
