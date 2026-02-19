import { PomodoroStorageData } from "@/types/pomodoro"
import { STORAGE_KEY, STORAGE_VERSION } from "@/constants/pomodoro"

const DEFAULT_DATA: PomodoroStorageData = {
  version: STORAGE_VERSION,
  sessions: [],
}

/**
 * Load data from localStorage
 */
export function loadData(): PomodoroStorageData {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY)
    if (!rawData) {
      return DEFAULT_DATA
    }

    const data = JSON.parse(rawData) as PomodoroStorageData

    // Validate data structure
    if (!data || typeof data !== "object") {
      console.warn("Invalid data structure in localStorage")
      return DEFAULT_DATA
    }

    if (!Array.isArray(data.sessions)) {
      console.warn("Invalid sessions array in localStorage")
      return DEFAULT_DATA
    }

    // Migrate data if needed
    return migrateData(data)
  } catch (error) {
    console.error("Error loading data from localStorage:", error)
    return DEFAULT_DATA
  }
}

/**
 * Save data to localStorage
 */
export function saveData(data: PomodoroStorageData): boolean {
  try {
    const serialized = JSON.stringify(data)
    localStorage.setItem(STORAGE_KEY, serialized)
    return true
  } catch (error) {
    console.error("Error saving data to localStorage:", error)

    // Handle quota exceeded error
    if (error instanceof Error && error.name === "QuotaExceededError") {
      console.error("localStorage quota exceeded")
      // Could implement cleanup logic here (e.g., remove old sessions)
    }

    return false
  }
}

/**
 * Migrate data from older versions to current version
 */
export function migrateData(data: PomodoroStorageData): PomodoroStorageData {
  let migrated = { ...data }

  // Migration from version 0 (no version) to version 1
  if (!migrated.version) {
    migrated.version = STORAGE_VERSION
    console.log("Migrated data to version 1")
  }

  // Future migrations would go here
  // if (migrated.version < 2) { ... }

  return migrated
}

/**
 * Clear all data from localStorage
 */
export function clearData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Error clearing data from localStorage:", error)
  }
}

/**
 * Export data as JSON string
 */
export function exportData(): string {
  const data = loadData()
  return JSON.stringify(data, null, 2)
}

/**
 * Import data from JSON string
 */
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as PomodoroStorageData

    // Validate imported data
    if (!data || typeof data !== "object" || !Array.isArray(data.sessions)) {
      console.error("Invalid data format")
      return false
    }

    return saveData(data)
  } catch (error) {
    console.error("Error importing data:", error)
    return false
  }
}
