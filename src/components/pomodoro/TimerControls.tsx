import { Button } from "@/components/ui/button"
import { usePomodoroContext } from "@/context/PomodoroContext"
import { Play, Pause, RotateCcw } from "lucide-react"

export function TimerControls() {
  const { timerState, selectedTag, startTimer, pauseTimer, resumeTimer, resetTimer } =
    usePomodoroContext()
  const { isActive, isPaused } = timerState

  if (!isActive) {
    return (
      <div className="flex gap-3 justify-center">
        <Button
          size="lg"
          onClick={() => startTimer(selectedTag)}
          className="px-8"
        >
          <Play className="mr-2 h-5 w-5" />
          Start
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-3 justify-center">
      {!isPaused ? (
        <Button size="lg" variant="secondary" onClick={pauseTimer} className="px-8">
          <Pause className="mr-2 h-5 w-5" />
          Pause
        </Button>
      ) : (
        <Button size="lg" onClick={resumeTimer} className="px-8">
          <Play className="mr-2 h-5 w-5" />
          Resume
        </Button>
      )}

      <Button size="lg" variant="outline" onClick={resetTimer} className="px-8">
        <RotateCcw className="mr-2 h-5 w-5" />
        Reset
      </Button>
    </div>
  )
}
