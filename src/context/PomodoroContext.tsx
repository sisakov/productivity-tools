import React, { createContext, useContext, useState, useCallback } from "react"
import { PomodoroTag, PomodoroSession, TimerState } from "@/types/pomodoro"
import { usePomodoro } from "@/hooks/usePomodoro"
import { usePomodoroStorage } from "@/hooks/usePomodoroStorage"
import { usePomodoroStats } from "@/hooks/usePomodoroStats"
import { DEFAULT_POMODORO_DURATION } from "@/constants/pomodoro"

const FAVICON_DEFAULT = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='18' r='12' fill='%23ef4444'/><rect x='14' y='4' width='4' height='6' rx='2' fill='%2322c55e'/><ellipse cx='19' cy='6' rx='5' ry='3' fill='%2322c55e' transform='rotate(30 19 6)'/><circle cx='16' cy='11' r='1' fill='white' opacity='0.6'/><circle cx='16' cy='25' r='1' fill='white' opacity='0.6'/><circle cx='9' cy='18' r='1' fill='white' opacity='0.6'/><circle cx='23' cy='18' r='1' fill='white' opacity='0.6'/><line x1='16' y1='18' x2='16' y2='13' stroke='white' stroke-width='1.5' stroke-linecap='round'/><line x1='16' y1='18' x2='20' y2='18' stroke='white' stroke-width='1.5' stroke-linecap='round'/></svg>`

const FAVICON_DONE = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%2322c55e'/><polyline points='8,16 13,21 24,11' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>`

function setFavicon(href: string) {
  const link = document.querySelector<HTMLLinkElement>("link[rel='icon']")
  if (link) link.href = href
}

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
  completeTimer: () => void
  setSelectedTag: (tag: PomodoroTag) => void

  // Sessions data
  sessions: PomodoroSession[]
  getSessionsByDate: (date: Date) => PomodoroSession[]
  getDayStats: ReturnType<typeof usePomodoroStorage>["getDayStats"]
  deleteSession: (sessionId: string) => void
  updateSession: (sessionId: string, updates: Partial<PomodoroSession>) => void

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
      const endTime = Date.now()
      storage.updateSession(currentSession.id, {
        status: "completed",
        endTime,
      })
      setCurrentSession(null)
      setFavicon(FAVICON_DONE)
    }
  }, [currentSession, storage])

  const timer = usePomodoro({
    duration: DEFAULT_POMODORO_DURATION,
    onComplete: handleComplete,
  })

  const startTimer = useCallback(
    (tag: PomodoroTag) => {
      setFavicon(FAVICON_DEFAULT)
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
      storage.updateSession(currentSession.id, { status: "cancelled" })
      setCurrentSession(null)
    }
    timer.reset()
  }, [currentSession, storage, timer])

  const completeTimer = useCallback(() => {
    if (currentSession) {
      const actualElapsed = DEFAULT_POMODORO_DURATION - timer.timeRemaining
      storage.updateSession(currentSession.id, {
        status: "completed",
        endTime: Date.now(),
        duration: Math.max(1, actualElapsed),
      })
      setCurrentSession(null)
      setFavicon(FAVICON_DONE)
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
    completeTimer,
    setSelectedTag,
    sessions: storage.sessions,
    getSessionsByDate: storage.getSessionsByDate,
    getDayStats: storage.getDayStats,
    deleteSession: storage.deleteSession,
    updateSession: storage.updateSession,
    stats,
  }

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  )
}
