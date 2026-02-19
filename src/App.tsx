import { PomodoroProvider } from "@/context/PomodoroContext"
import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer"
import { PomodoroCalendar } from "@/components/calendar/PomodoroCalendar"
import { StatsDisplay } from "@/components/stats/StatsDisplay"

function App() {
  return (
    <PomodoroProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-center">Pomodoro Productivity Tracker</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <StatsDisplay />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <PomodoroTimer />
              </div>

              <div className="flex flex-col">
                <PomodoroCalendar />
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-muted-foreground">
              Built with React, TypeScript, and Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    </PomodoroProvider>
  )
}

export default App
