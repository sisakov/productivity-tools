import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  month?: Date
  onMonthChange?: (date: Date) => void
  renderDay?: (date: Date) => React.ReactNode
  className?: string
}

export function Calendar({
  selected,
  onSelect,
  month: controlledMonth,
  onMonthChange,
  renderDay,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    controlledMonth || new Date()
  )

  const month = controlledMonth || currentMonth

  const handleMonthChange = (newMonth: Date) => {
    if (onMonthChange) {
      onMonthChange(newMonth)
    } else {
      setCurrentMonth(newMonth)
    }
  }

  const handlePreviousMonth = () => {
    const newMonth = new Date(month)
    newMonth.setMonth(month.getMonth() - 1)
    handleMonthChange(newMonth)
  }

  const handleNextMonth = () => {
    const newMonth = new Date(month)
    newMonth.setMonth(month.getMonth() + 1)
    handleMonthChange(newMonth)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const { daysInMonth, startingDayOfWeek, year, month: monthNum } = getDaysInMonth(month)

  const days: (Date | null)[] = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, monthNum, day))
  }

  const monthName = month.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handleDayClick = (date: Date) => {
    if (onSelect) {
      onSelect(date)
    }
  }

  const isSameDay = (date1: Date | null, date2: Date | undefined) => {
    if (!date1 || !date2) return false
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  return (
    <div className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">{monthName}</div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground p-2"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              "text-center p-2 min-h-[60px] border rounded-md",
              day ? "cursor-pointer hover:bg-accent" : "bg-muted/20",
              isSameDay(day, selected) && "bg-primary text-primary-foreground"
            )}
            onClick={() => day && handleDayClick(day)}
          >
            {day && (
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium mb-1">{day.getDate()}</div>
                {renderDay && renderDay(day)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
