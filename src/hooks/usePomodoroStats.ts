import { useMemo } from "react"
import { PomodoroSession, DayStats, CustomTag } from "@/types/pomodoro"
import { BUILTIN_TAGS } from "@/constants/pomodoro"
import { format, startOfDay, subDays, isWithinInterval, startOfWeek, startOfMonth } from "date-fns"

export function usePomodoroStats(sessions: PomodoroSession[], customTags: CustomTag[]) {
  const completedSessions = useMemo(
    () => sessions.filter((s) => s.status === "completed"),
    [sessions]
  )

  const allTagIds = useMemo(
    () => [...BUILTIN_TAGS, ...customTags.map((t) => t.id)],
    [customTags]
  )

  const todayStats = useMemo(() => {
    const today = startOfDay(new Date())
    const todaySessions = completedSessions.filter((session) => {
      const sessionDate = startOfDay(new Date(session.startTime))
      return sessionDate.getTime() === today.getTime()
    })

    const byTag: Record<string, number> = Object.fromEntries(allTagIds.map((id) => [id, 0]))
    let totalDuration = 0

    todaySessions.forEach((session) => {
      byTag[session.tag] = (byTag[session.tag] ?? 0) + 1
      totalDuration += session.duration
    })

    return {
      date: format(today, "yyyy-MM-dd"),
      totalSessions: todaySessions.length,
      completedSessions: todaySessions.length,
      totalDuration,
      byTag,
    }
  }, [completedSessions, allTagIds])

  const weekStats = useMemo(() => {
    const today = new Date()
    const weekStart = startOfWeek(today)
    const weekSessions = completedSessions.filter((session) =>
      isWithinInterval(new Date(session.startTime), {
        start: weekStart,
        end: today,
      })
    )

    const byTag: Record<string, number> = Object.fromEntries(allTagIds.map((id) => [id, 0]))
    let totalDuration = 0

    weekSessions.forEach((session) => {
      byTag[session.tag] = (byTag[session.tag] ?? 0) + 1
      totalDuration += session.duration
    })

    return {
      totalSessions: weekSessions.length,
      completedSessions: weekSessions.length,
      totalDuration,
      byTag,
    }
  }, [completedSessions, allTagIds])

  const monthStats = useMemo(() => {
    const today = new Date()
    const monthStart = startOfMonth(today)
    const monthSessions = completedSessions.filter((session) =>
      isWithinInterval(new Date(session.startTime), {
        start: monthStart,
        end: today,
      })
    )

    const byTag: Record<string, number> = Object.fromEntries(allTagIds.map((id) => [id, 0]))
    let totalDuration = 0

    monthSessions.forEach((session) => {
      byTag[session.tag] = (byTag[session.tag] ?? 0) + 1
      totalDuration += session.duration
    })

    return {
      totalSessions: monthSessions.length,
      completedSessions: monthSessions.length,
      totalDuration,
      byTag,
    }
  }, [completedSessions, allTagIds])

  const getStatsByDateRange = useMemo(
    () => (startDate: Date, endDate: Date): DayStats => {
      const rangeSessions = completedSessions.filter((session) =>
        isWithinInterval(new Date(session.startTime), {
          start: startDate,
          end: endDate,
        })
      )

      const byTag: Record<string, number> = Object.fromEntries(allTagIds.map((id) => [id, 0]))
      let totalDuration = 0

      rangeSessions.forEach((session) => {
        byTag[session.tag] = (byTag[session.tag] ?? 0) + 1
        totalDuration += session.duration
      })

      return {
        date: format(startDate, "yyyy-MM-dd"),
        totalSessions: rangeSessions.length,
        completedSessions: rangeSessions.length,
        totalDuration,
        byTag,
      }
    },
    [completedSessions, allTagIds]
  )

  const currentStreak = useMemo(() => {
    if (completedSessions.length === 0) return 0

    const today = startOfDay(new Date())
    let streak = 0
    let currentDate = today

    while (true) {
      const daySessions = completedSessions.filter((session) => {
        const sessionDate = startOfDay(new Date(session.startTime))
        return sessionDate.getTime() === currentDate.getTime()
      })

      if (daySessions.length === 0) {
        // If today has no sessions, check if yesterday has any
        if (streak === 0 && currentDate.getTime() === today.getTime()) {
          currentDate = subDays(currentDate, 1)
          continue
        }
        break
      }

      streak++
      currentDate = subDays(currentDate, 1)
    }

    return streak
  }, [completedSessions])

  const totalMinutes = useMemo(
    () => Math.round(completedSessions.reduce((sum, s) => sum + s.duration, 0) / 60),
    [completedSessions]
  )

  return {
    todayStats,
    weekStats,
    monthStats,
    getStatsByDateRange,
    currentStreak,
    totalMinutes,
  }
}
