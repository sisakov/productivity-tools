import React, { createContext, useContext, useState, useCallback } from "react"
import { PomodoroTag, PomodoroSession, TimerState } from "@/types/pomodoro"
import { usePomodoro } from "@/hooks/usePomodoro"
import { usePomodoroStorage } from "@/hooks/usePomodoroStorage"
import { usePomodoroStats } from "@/hooks/usePomodoroStats"
import { DEFAULT_POMODORO_DURATION } from "@/constants/pomodoro"

interface PomodoroContextValue {
  // Timer state
  timerState: TimerState
  selectedTag: PomodoroTag
  currentSession: PomodoroSession | null

  // Timer actions
  startTimer: (tag: PomodoroTag) => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetTimer: () => void
  setSelectedTag: (tag: PomodoroTag) => void

  // Sessions data
  sessions: PomodoroSession[]
  getSessionsByDate: (date: Date) => PomodoroSession[]
  getDayStats: ReturnType<typeof usePomodoroStorage>["getDayStats"]

  // Statistics
  stats: ReturnType<typeof usePomodoroStats>
}

const PomodoroContext = createContext<PomodoroContextValue | null>(null)

export function usePomodoroContext() {
  const context = useContext(PomodoroContext)
  if (!context) {
    throw new Error("usePomodoroContext must be used within PomodoroProvider")
  }
  return context
}

interface PomodoroProviderProps {
  children: React.ReactNode
}

export function PomodoroProvider({ children }: PomodoroProviderProps) {
  const [selectedTag, setSelectedTag] = useState<PomodoroTag>("work")
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null)

  const storage = usePomodoroStorage()
  const stats = usePomodoroStats(storage.sessions)

  const handleComplete = useCallback(() => {
    if (currentSession) {
      // Update session as completed
      const endTime = Date.now()
      storage.updateSession(currentSession.id, {
        status: "completed",
        endTime,
      })
      setCurrentSession(null)
    }
  }, [currentSession, storage])

  const timer = usePomodoro({
    duration: DEFAULT_POMODORO_DURATION,
    onComplete: handleComplete,
  })

  const startTimer = useCallback(
    (tag: PomodoroTag) => {
      // Create new session
      const session: PomodoroSession = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        tag,
        startTime: Date.now(),
        duration: DEFAULT_POMODORO_DURATION,
        status: "running",
      }

      setCurrentSession(session)
      setSelectedTag(tag)
      storage.addSession(session)
      timer.start()
    },
    [storage, timer]
  )

  const pauseTimer = useCallback(() => {
    if (currentSession) {
      storage.updateSession(currentSession.id, { status: "paused" })
      setCurrentSession((prev) => (prev ? { ...prev, status: "paused" } : null))
    }
    timer.pause()
  }, [currentSession, storage, timer])

  const resumeTimer = useCallback(() => {
    if (currentSession) {
      storage.updateSession(currentSession.id, { status: "running" })
      setCurrentSession((prev) => (prev ? { ...prev, status: "running" } : null))
    }
    timer.resume()
  }, [currentSession, storage, timer])

  const resetTimer = useCallback(() => {
    if (currentSession) {
      // Mark session as cancelled
      storage.updateSession(currentSession.id, { status: "cancelled" })
      setCurrentSession(null)
    }
    timer.reset()
  }, [currentSession, storage, timer])

  const timerState: TimerState = {
    isActive: timer.isActive,
    isPaused: timer.isPaused,
    timeRemaining: timer.timeRemaining,
    currentSession: currentSession || undefined,
  }

  const value: PomodoroContextValue = {
    timerState,
    selectedTag,
    currentSession,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setSelectedTag,
    sessions: storage.sessions,
    getSessionsByDate: storage.getSessionsByDate,
    getDayStats: storage.getDayStats,
    stats,
  }

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  )
}
