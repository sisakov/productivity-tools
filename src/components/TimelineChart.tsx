import { useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { eachDayOfInterval, subDays, startOfDay, endOfDay, isWithinInterval, format } from "date-fns"
import { usePomodoroContext } from "@/context/PomodoroContext"
import { BUILTIN_TAGS, getTagConfig, getTagFillColor } from "@/constants/pomodoro"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const RANGE_OPTIONS = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
] as const

type RangeDays = 7 | 30 | 90

interface ChartDataPoint {
  date: string
  [tagId: string]: number | string
}

export function TimelineChart() {
  const { sessions, customTags } = usePomodoroContext()
  const [rangeDays, setRangeDays] = useState<RangeDays>(30)

  const allTags = useMemo(
    () => [...BUILTIN_TAGS, ...customTags.map((t) => t.id)],
    [customTags]
  )

  const chartData = useMemo<ChartDataPoint[]>(() => {
    const today = new Date()
    const start = startOfDay(subDays(today, rangeDays - 1))
    const end = endOfDay(today)

    const days = eachDayOfInterval({ start, end })

    return days.map((day) => {
      const dayStart = startOfDay(day)
      const dayEnd = endOfDay(day)

      const daySessions = sessions.filter(
        (s) =>
          s.status === "completed" &&
          isWithinInterval(new Date(s.startTime), { start: dayStart, end: dayEnd })
      )

      const counts: Record<string, number> = Object.fromEntries(allTags.map((id) => [id, 0]))
      for (const s of daySessions) {
        counts[s.tag] = (counts[s.tag] ?? 0) + 1
      }

      return {
        date: format(day, "MMM d"),
        ...counts,
      }
    })
  }, [sessions, rangeDays, allTags])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-center text-2xl">Activity Timeline</CardTitle>
          <div className="flex gap-2">
            {RANGE_OPTIONS.map(({ label, days }) => (
              <Button
                key={days}
                variant={rangeDays === days ? "default" : "outline"}
                size="sm"
                onClick={() => setRangeDays(days as RangeDays)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              interval={rangeDays === 7 ? 0 : rangeDays === 30 ? 4 : 13}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value, name) => [
                value ?? 0,
                getTagConfig(String(name), customTags).label,
              ]}
            />
            <Legend
              formatter={(value) => getTagConfig(value, customTags).label}
            />
            {allTags.map((tagId) => (
              <Bar
                key={tagId}
                dataKey={tagId}
                stackId="a"
                fill={getTagFillColor(tagId, customTags)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
