import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePomodoroContext } from "@/context/PomodoroContext"
import { TAG_CONFIG } from "@/constants/pomodoro"

export function StatsDisplay() {
  const { stats } = usePomodoroContext()
  const { todayStats, weekStats, currentStreak } = stats

  const todayMinutes = Math.floor(todayStats.totalDuration / 60)
  const weekMinutes = Math.floor(weekStats.totalDuration / 60)

  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{todayStats.completedSessions}</div>
            <div className="text-sm text-muted-foreground mt-1">Today's Sessions</div>
            <div className="text-xs text-muted-foreground">{todayMinutes} minutes</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold">{weekStats.completedSessions}</div>
            <div className="text-sm text-muted-foreground mt-1">This Week</div>
            <div className="text-xs text-muted-foreground">{weekMinutes} minutes</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold">{currentStreak}</div>
            <div className="text-sm text-muted-foreground mt-1">Day Streak</div>
            <div className="text-xs text-muted-foreground">Keep it up!</div>
          </div>
        </div>

        {todayStats.completedSessions > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium text-center mb-2">Today's Breakdown</div>
            <div className="flex gap-2 justify-center flex-wrap">
              {Object.entries(todayStats.byTag).map(([tag, count]) => {
                if (count === 0) return null
                const config = TAG_CONFIG[tag as keyof typeof TAG_CONFIG]
                return (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className={`${config.bgColor} ${config.textColor}`}
                  >
                    {config.label}: {count}
                  </Badge>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
