# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

A Pomodoro timer application built with React, TypeScript, and Tailwind CSS. Tracks productivity sessions categorized by activity type (work, learn, rest) with localStorage persistence. Deployed to GitHub Pages at https://sisakov.github.io/productivity-tools/

## Development Commands

```bash
# Start development server at http://localhost:5173
npm run dev

# Production build (TypeScript compile + Vite build)
npm run build

# Preview production build locally
npm run preview

# Lint with ESLint
npm run lint
```

## Architecture

### Three-Layer Architecture

The application follows a clean separation of concerns with three distinct layers:

**1. Context Layer** (`src/context/PomodoroContext.tsx`)
- Single `PomodoroProvider` wraps the entire app
- Orchestrates timer, storage, and statistics hooks
- Provides unified API to components via `usePomodoroContext()`
- Manages session lifecycle: creation, pausing, completion, cancellation

**2. Hooks Layer** (`src/hooks/`)
- `usePomodoro`: Timer mechanics with drift prevention using timestamps
- `usePomodoroStorage`: CRUD operations for sessions with auto-save debouncing (500ms)
- `usePomodoroStats`: Derived statistics computation (streaks, totals, averages)

**3. Storage Layer** (`src/lib/storage.ts`)
- localStorage abstraction with version migration support
- Error handling for QuotaExceededError
- Import/export functionality for data portability

### State Management Pattern

All state flows through `PomodoroContext`:
```
User Action → Component → Context → Hook → Storage → localStorage
                                     ↓
                              State Update
                                     ↓
                            Component Re-render
```

Components never directly access hooks or storage - they only use `usePomodoroContext()`.

### Timer Implementation

The timer (`usePomodoro`) uses **timestamp-based calculation** to prevent drift:
- Records `startTime` when timer begins
- Each tick calculates `timeRemaining = duration - (now - startTime - pausedTime)`
- Pause accumulates elapsed time into `pausedTime`
- Resume resets `startTime` to current time, preserving `pausedTime`

This approach ensures accuracy even if the browser throttles `setInterval` (e.g., background tabs).

### Session Lifecycle

Sessions have four states: `running | paused | completed | cancelled`

1. **Start**: Create session with `status: "running"`, call `timer.start()`
2. **Pause**: Update to `status: "paused"`, call `timer.pause()`
3. **Resume**: Update to `status: "running"`, call `timer.resume()`
4. **Complete**: Timer hits zero, auto-update to `status: "completed"`, set `endTime`
5. **Cancel/Reset**: Update to `status: "cancelled"` if user stops early

All status changes are persisted to localStorage via `updateSession()`.

### Storage Persistence

Data structure: `{ version: number, sessions: PomodoroSession[] }`

Auto-save mechanism:
- Every state change triggers `useEffect` in `usePomodoroStorage`
- 500ms debounce prevents excessive writes
- On mount, loads from localStorage with fallback to empty data

Migration support:
- `migrateData()` handles version upgrades
- Currently on version 1; future migrations can be added sequentially

### Statistics Computation

`usePomodoroStats` derives all metrics from the sessions array:
- **Current streak**: Counts consecutive days with completed sessions (stops at first gap)
- **Longest streak**: Maximum consecutive days historically
- **Today/Week/Month totals**: Filters sessions by date ranges using `date-fns`
- **By tag breakdown**: Counts completed sessions per activity type

Statistics are **computed**, not stored - they're always derived from sessions.

## Component Structure

```
App
├── PomodoroProvider (Context)
    ├── StatsDisplay (shows derived stats)
    ├── PomodoroTimer
    │   ├── TaskTagSelector (work/learn/rest picker)
    │   ├── TimerDisplay (countdown visualization)
    │   └── TimerControls (start/pause/resume/reset buttons)
    └── PomodoroCalendar
        ├── CalendarDay (each day cell with session dots)
        └── DayDetailDialog (modal showing day's sessions)
```

UI components in `src/components/ui/` are from shadcn/ui (Radix UI + Tailwind).

## Key Patterns and Conventions

### Path Aliasing
- `@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.json`)
- Use `import { X } from "@/components/X"` instead of relative paths

### Constants File
- All magic numbers and configuration in `src/constants/pomodoro.ts`
- Default duration: 1500 seconds (25 minutes)
- Storage key: `"pomodoro_data"`
- Tag configurations with colors

### Type Safety
- All types defined in `src/types/pomodoro.ts`
- No `any` types except for Web Audio API workaround in `usePomodoro`
- Session IDs: timestamp + random string for uniqueness

### Audio Notification
- Uses Web Audio API to synthesize a beep (800Hz oscillator)
- Created in `usePomodoro` hook, plays on timer completion
- Gracefully handles play errors (e.g., user hasn't interacted with page)

## GitHub Pages Deployment

The app is deployed via GitHub Actions:
- **Workflow**: `.github/workflows/deploy.yml`
- **Trigger**: Every push to `main` branch
- **Base path**: `/productivity-tools/` (configured in `vite.config.ts`)
- **Pages source**: Must be set to "GitHub Actions" (not "Deploy from a branch")

Important: The `base` configuration is critical - without it, assets will 404 on GitHub Pages. Always include the trailing slash.

Build artifacts (`dist/`) are NOT committed to git - GitHub Actions builds them on each deploy.

## Adding New Features

### Adding a New Activity Tag
1. Add tag to `PomodoroTag` union type in `src/types/pomodoro.ts`
2. Add configuration to `TAG_CONFIG` in `src/constants/pomodoro.ts` (label, colors)
3. Initialize count in `usePomodoroStats` hook's `byTag` object
4. No other changes needed - component automatically renders new tags

### Adding a New Session Field
1. Add field to `PomodoroSession` interface in `src/types/pomodoro.ts`
2. Update `addSession()` in `PomodoroContext` to include field
3. If needed, increment `STORAGE_VERSION` and add migration in `storage.ts`

### Modifying Timer Duration
Change `DEFAULT_POMODORO_DURATION` in `src/constants/pomodoro.ts` (in seconds).

To support multiple durations, pass `duration` prop to `usePomodoro` hook.

## Date Handling

Uses `date-fns` for all date operations:
- `startOfDay()` normalizes dates for comparison
- `format(date, "yyyy-MM-dd")` creates date string keys
- Sessions store timestamps (`number`) for startTime/endTime

Always use `startOfDay()` when grouping sessions by date to avoid timezone issues.
