import { useState, useEffect, useCallback, useMemo } from "react"
import { PomodoroSession, PomodoroStorageData, DayStats, CustomTag } from "@/types/pomodoro"
import { loadData, saveData } from "@/lib/storage"
import { BUILTIN_TAGS } from "@/constants/pomodoro"
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

  const addCustomTag = useCallback((tag: CustomTag) => {
    setData((prev) => ({
      ...prev,
      customTags: [...prev.customTags, tag],
    }))
  }, [])

  const updateCustomTag = useCallback((id: string, updates: Partial<Omit<CustomTag, "id">>) => {
    setData((prev) => ({
      ...prev,
      customTags: prev.customTags.map((tag) =>
        tag.id === id ? { ...tag, ...updates } : tag
      ),
    }))
  }, [])

  const deleteCustomTag = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      customTags: prev.customTags.filter((tag) => tag.id !== id),
    }))
  }, [])

  const isTagInUse = useCallback(
    (tagId: string) => data.sessions.some((session) => session.tag === tagId),
    [data.sessions]
  )

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

      const allTagIds = [...BUILTIN_TAGS, ...(data.customTags ?? []).map((t) => t.id)]
      const byTag: Record<string, number> = Object.fromEntries(allTagIds.map((id) => [id, 0]))

      let totalDuration = 0

      completed.forEach((session) => {
        byTag[session.tag] = (byTag[session.tag] ?? 0) + 1
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
    [getSessionsByDate, data.customTags]
  )

  const getAllSessions = useMemo(() => data.sessions, [data.sessions])

  const getCompletedSessions = useMemo(
    () => data.sessions.filter((s) => s.status === "completed"),
    [data.sessions]
  )

  return {
    sessions: data.sessions,
    customTags: data.customTags ?? [],
    addSession,
    updateSession,
    deleteSession,
    addCustomTag,
    updateCustomTag,
    deleteCustomTag,
    isTagInUse,
    getSessionsByDate,
    getDayStats,
    getAllSessions,
    getCompletedSessions,
  }
}
