import { usePomodoroContext } from "@/context/PomodoroContext"
import { Progress } from "@/components/ui/progress"
import { DEFAULT_POMODORO_DURATION } from "@/constants/pomodoro"
import { TAG_CONFIG } from "@/constants/pomodoro"

export function TimerDisplay() {
  const { timerState, selectedTag } = usePomodoroContext()
  const { timeRemaining, isActive, isPaused } = timerState

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`

  const progress =
    ((DEFAULT_POMODORO_DURATION - timeRemaining) / DEFAULT_POMODORO_DURATION) * 100

  const config = TAG_CONFIG[selectedTag]

  const getStatusText = () => {
    if (!isActive) return "Ready to start"
    if (isPaused) return "Paused"
    return "Focus time!"
  }

  const statusColor = isPaused ? "text-yellow-600" : isActive ? "text-green-600" : "text-gray-600"

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <div className="text-7xl font-bold tabular-nums tracking-tight">
          {formattedTime}
        </div>
        <div className={`text-lg font-medium mt-2 ${statusColor}`}>
          {getStatusText()}
        </div>
      </div>

      {isActive && (
        <div className="w-full max-w-md">
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {isActive && (
        <div className={`px-4 py-2 rounded-full ${config.bgColor} ${config.textColor} text-sm font-medium`}>
          {config.label}
        </div>
      )}
    </div>
  )
}
