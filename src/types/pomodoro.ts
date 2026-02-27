export type PomodoroTag = string

export type SessionStatus = "running" | "paused" | "completed" | "cancelled"

export interface CustomTag {
  id: string        // e.g. "exercise-1717000000000"
  label: string     // e.g. "Exercise"
  hexColor: string  // e.g. "#f97316"
}

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
  byTag: Record<string, number> // count by tag
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
  customTags: CustomTag[]
}

export interface TagConfig {
  label: string
  color: string
  bgColor: string
  textColor: string
  hexColor?: string
}
