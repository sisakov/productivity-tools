import { useState, useEffect, useCallback, useMemo } from "react"
import { PomodoroSession, PomodoroStorageData, DayStats, PomodoroTag } from "@/types/pomodoro"
import { loadData, saveData } from "@/lib/storage"
import { format, startOfDay } from "date-fns"

export function usePomodoroStorage() {
  const [data, setData] = useState<PomodoroStorageData>(() => loadData())

  // Auto-save to localStorage when data changes (with debouncing)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveData(data)
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [data])

  const addSession = useCallback((session: PomodoroSession) => {
    setData((prev) => ({
      ...prev,
      sessions: [...prev.sessions, session],
    }))
  }, [])

  const updateSession = useCallback(
    (sessionId: string, updates: Partial<PomodoroSession>) => {
      setData((prev) => ({
        ...prev,
        sessions: prev.sessions.map((session) =>
          session.id === sessionId ? { ...session, ...updates } : session
        ),
      }))
    },
    []
  )

  const deleteSession = useCallback((sessionId: string) => {
    setData((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((session) => session.id !== sessionId),
    }))
  }, [])

  const getSessionsByDate = useCallback(
    (date: Date): PomodoroSession[] => {
      const dateStr = format(startOfDay(date), "yyyy-MM-dd")
      return data.sessions.filter((session) => {
        const sessionDate = format(startOfDay(new Date(session.startTime)), "yyyy-MM-dd")
        return sessionDate === dateStr
      })
    },
    [data.sessions]
  )

  const getDayStats = useCallback(
    (date: Date): DayStats => {
      const sessions = getSessionsByDate(date)
      const dateStr = format(date, "yyyy-MM-dd")

      const completed = sessions.filter((s) => s.status === "completed")

      const byTag: Record<PomodoroTag, number> = {
        work: 0,
        learn: 0,
        rest: 0,
      }

      let totalDuration = 0

      completed.forEach((session) => {
        byTag[session.tag] = (byTag[session.tag] || 0) + 1
        totalDuration += session.duration
      })

      return {
        date: dateStr,
        totalSessions: sessions.length,
        completedSessions: completed.length,
        totalDuration,
        byTag,
      }
    },
    [getSessionsByDate]
  )

  const getAllSessions = useMemo(() => data.sessions, [data.sessions])

  const getCompletedSessions = useMemo(
    () => data.sessions.filter((s) => s.status === "completed"),
    [data.sessions]
  )

  return {
    sessions: data.sessions,
    addSession,
    updateSession,
    deleteSession,
    getSessionsByDate,
    getDayStats,
    getAllSessions,
    getCompletedSessions,
  }
}
