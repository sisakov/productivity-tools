import { PomodoroTag, TagConfig } from "@/types/pomodoro"

export const DEFAULT_POMODORO_DURATION = 1500 // 25 minutes in seconds

export const STORAGE_KEY = "pomodoro_data"

export const STORAGE_VERSION = 1

export const TAG_CONFIG: Record<PomodoroTag, TagConfig> = {
  work: {
    label: "Work",
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  learn: {
    label: "Learn",
    color: "bg-green-500",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
  },
  rest: {
    label: "Rest",
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
  },
}

export const TIMER_TICK_INTERVAL = 1000 // 1 second in milliseconds
