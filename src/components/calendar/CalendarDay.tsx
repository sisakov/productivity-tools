import { Badge } from "@/components/ui/badge"
import { DayStats } from "@/types/pomodoro"
import { TAG_CONFIG } from "@/constants/pomodoro"

interface CalendarDayProps {
  stats: DayStats
}

export function CalendarDay({ stats }: CalendarDayProps) {
  const { completedSessions, byTag } = stats

  if (completedSessions === 0) {
    return null
  }

  // Find the tag with the most sessions
  const dominantTag = Object.entries(byTag).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0] as keyof typeof TAG_CONFIG

  const config = TAG_CONFIG[dominantTag]

  return (
    <div className="flex flex-col items-center gap-1">
      <Badge
        variant="secondary"
        className={`${config.bgColor} ${config.textColor} text-xs px-1.5 py-0.5`}
      >
        {completedSessions}
      </Badge>
      <div className="flex gap-0.5">
        {Object.entries(byTag).map(([tag, count]) => {
          if (count === 0) return null
          const tagConfig = TAG_CONFIG[tag as keyof typeof TAG_CONFIG]
          return (
            <div
              key={tag}
              className={`w-1.5 h-1.5 rounded-full ${tagConfig.color}`}
              title={`${tag}: ${count}`}
            />
          )
        })}
      </div>
    </div>
  )
}
