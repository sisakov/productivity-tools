import { Link } from "react-router-dom"
import { Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { usePomodoroContext } from "@/context/PomodoroContext"

function PomodoroCard() {
  const { stats } = usePomodoroContext()
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Timer className="h-6 w-6 text-red-500" />
          <CardTitle>Pomodoro Timer</CardTitle>
        </div>
        <CardDescription>
          Track focused work sessions with 25-minute intervals
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-3xl font-bold">{stats.todayStats.totalSessions}</p>
            <p className="text-xs text-muted-foreground">sessions</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Minutes</p>
            <p className="text-3xl font-bold">{stats.totalMinutes}</p>
            <p className="text-xs text-muted-foreground">total</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Streak</p>
            <p className="text-3xl font-bold">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/pomodoro">Open Timer</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PomodoroCard />
        {/* Future tools added here */}
      </div>
    </main>
  )
}
