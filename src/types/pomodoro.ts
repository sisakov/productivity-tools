export type PomodoroTag = "work" | "learn" | "rest"

export type SessionStatus = "running" | "paused" | "completed" | "cancelled"

export interface PomodoroSession {
  id: string
  tag: PomodoroTag
  startTime: number // timestamp
  endTime?: number // timestamp
  duration: number // seconds
  status: SessionStatus
}

export interface DayStats {
  date: string // YYYY-MM-DD format
  totalSessions: number
  completedSessions: number
  totalDuration: number // seconds
  byTag: Record<PomodoroTag, number> // count by tag
}

export interface TimerState {
  isActive: boolean
  isPaused: boolean
  timeRemaining: number // seconds
  currentSession?: PomodoroSession
}

export interface PomodoroStorageData {
  version: number
  sessions: PomodoroSession[]
}

export interface TagConfig {
  label: string
  color: string
  bgColor: string
  textColor: string
}
