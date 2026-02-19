import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskTagSelector } from "./TaskTagSelector"
import { TimerDisplay } from "./TimerDisplay"
import { TimerControls } from "./TimerControls"

export function PomodoroTimer() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Pomodoro Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <TaskTagSelector />
        <TimerDisplay />
        <TimerControls />
      </CardContent>
    </Card>
  )
}
