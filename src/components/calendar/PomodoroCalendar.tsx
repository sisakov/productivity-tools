import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { CalendarDay } from "./CalendarDay"
import { DayDetailDialog } from "./DayDetailDialog"
import { usePomodoroContext } from "@/context/PomodoroContext"
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"

export function PomodoroCalendar() {
  const { getSessionsByDate, getDayStats } = usePomodoroContext()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Pre-calculate stats for the visible month
  const monthStats = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start, end })

    return days.reduce(
      (acc, day) => {
        const dateStr = format(day, "yyyy-MM-dd")
        acc[dateStr] = getDayStats(day)
        return acc
      },
      {} as Record<string, ReturnType<typeof getDayStats>>
    )
  }, [currentMonth, getDayStats])

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setDialogOpen(true)
  }

  const renderDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const stats = monthStats[dateStr]

    if (!stats || stats.completedSessions === 0) {
      return null
    }

    return <CalendarDay stats={stats} />
  }

  const selectedDateSessions = selectedDate ? getSessionsByDate(selectedDate) : []

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Activity Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            onSelect={handleDayClick}
            renderDay={renderDay}
          />
        </CardContent>
      </Card>

      <DayDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        date={selectedDate}
        sessions={selectedDateSessions}
      />
    </>
  )
}
