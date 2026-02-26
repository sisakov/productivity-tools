import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer"
import { PomodoroCalendar } from "@/components/calendar/PomodoroCalendar"
import { StatsDisplay } from "@/components/stats/StatsDisplay"
import { TimelineChart } from "@/components/TimelineChart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PomodoroPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <StatsDisplay />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PomodoroTimer />
          <Tabs defaultValue="calendar">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar">
              <PomodoroCalendar />
            </TabsContent>
            <TabsContent value="timeline">
              <TimelineChart />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
