import { Button } from "@/components/ui/button"
import { PomodoroTag } from "@/types/pomodoro"
import { TAG_CONFIG } from "@/constants/pomodoro"
import { usePomodoroContext } from "@/context/PomodoroContext"
import { cn } from "@/lib/utils"

export function TaskTagSelector() {
  const { selectedTag, setSelectedTag, timerState } = usePomodoroContext()
  const isDisabled = timerState.isActive

  const tags: PomodoroTag[] = ["work", "learn", "rest"]

  return (
    <div className="flex gap-2 justify-center">
      {tags.map((tag) => {
        const config = TAG_CONFIG[tag]
        const isSelected = selectedTag === tag

        return (
          <Button
            key={tag}
            variant={isSelected ? "default" : "outline"}
            size="lg"
            onClick={() => setSelectedTag(tag)}
            disabled={isDisabled}
            className={cn(
              "px-6",
              isSelected && config.color,
              isSelected && "text-white hover:opacity-90"
            )}
          >
            {config.label}
          </Button>
        )
      })}
    </div>
  )
}
