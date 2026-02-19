import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer"
import { PomodoroCalendar } from "@/components/calendar/PomodoroCalendar"
import { StatsDisplay } from "@/components/stats/StatsDisplay"

export function PomodoroPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <StatsDisplay />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PomodoroTimer />
          <PomodoroCalendar />
        </div>
      </div>
    </main>
  )
}
