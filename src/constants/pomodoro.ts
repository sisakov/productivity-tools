import type { CSSProperties } from "react"
import { TagConfig, CustomTag } from "@/types/pomodoro"

export const DEFAULT_POMODORO_DURATION = 1500 // 25 minutes in seconds

export const STORAGE_KEY = "pomodoro_data"

export const STORAGE_VERSION = 2

export const BUILTIN_TAGS = ["work", "learn", "rest"] as const

export const TAG_CONFIG: Record<string, TagConfig> = {
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

export const TAG_HEX_COLORS: Record<string, string> = {
  work: "#3b82f6",  // blue-500
  learn: "#22c55e", // green-500
  rest: "#a855f7",  // purple-500
}

export const TIMER_TICK_INTERVAL = 1000 // 1 second in milliseconds

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function getTagConfig(tagId: string, customTags: CustomTag[]): TagConfig {
  if (TAG_CONFIG[tagId]) return TAG_CONFIG[tagId]
  const custom = customTags.find((t) => t.id === tagId)
  if (custom) {
    return { label: custom.label, color: "", bgColor: "", textColor: "", hexColor: custom.hexColor }
  }
  return { label: tagId, color: "", bgColor: "", textColor: "", hexColor: "#9ca3af" }
}

export function getTagInlineStyles(config: TagConfig): CSSProperties {
  if (!config.hexColor) return {}
  return {
    backgroundColor: hexToRgba(config.hexColor, 0.15),
    color: config.hexColor,
  }
}

export function getTagFillColor(tagId: string, customTags: CustomTag[]): string {
  if (TAG_HEX_COLORS[tagId]) return TAG_HEX_COLORS[tagId]
  const custom = customTags.find((t) => t.id === tagId)
  if (custom) return custom.hexColor
  return "#9ca3af"
}
