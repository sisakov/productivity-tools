import { Badge } from "@/components/ui/badge"
import { DayStats, CustomTag } from "@/types/pomodoro"
import { getTagConfig, getTagInlineStyles } from "@/constants/pomodoro"

interface CalendarDayProps {
  stats: DayStats
  customTags: CustomTag[]
}

export function CalendarDay({ stats, customTags }: CalendarDayProps) {
  const { completedSessions, byTag } = stats

  if (completedSessions === 0) {
    return null
  }

  // Find the tag with the most sessions
  const dominantTag = Object.entries(byTag).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0]

  const config = getTagConfig(dominantTag, customTags)
  const badgeStyle = getTagInlineStyles(config)

  return (
    <div className="flex flex-col items-center gap-1">
      <Badge
        variant="secondary"
        className={`${config.bgColor} ${config.textColor} text-xs px-1.5 py-0.5`}
        style={badgeStyle}
      >
        {completedSessions}
      </Badge>
      <div className="flex gap-0.5">
        {Object.entries(byTag).map(([tag, count]) => {
          if (count === 0) return null
          const tagConfig = getTagConfig(tag, customTags)
          const dotStyle = tagConfig.color
            ? undefined
            : { backgroundColor: tagConfig.hexColor }
          return (
            <div
              key={tag}
              className={`w-1.5 h-1.5 rounded-full ${tagConfig.color}`}
              style={dotStyle}
              title={`${tag}: ${count}`}
            />
          )
        })}
      </div>
    </div>
  )
}
