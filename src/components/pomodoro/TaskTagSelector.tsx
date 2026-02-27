import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BUILTIN_TAGS, getTagConfig } from "@/constants/pomodoro"
import { usePomodoroContext } from "@/context/PomodoroContext"
import { cn } from "@/lib/utils"
import { Settings } from "lucide-react"
import { ManageTagsDialog } from "./ManageTagsDialog"

export function TaskTagSelector() {
  const { selectedTag, setSelectedTag, timerState, customTags } = usePomodoroContext()
  const isDisabled = timerState.isActive
  const [manageOpen, setManageOpen] = useState(false)

  const allTags = [...BUILTIN_TAGS, ...customTags.map((t) => t.id)]
  const builtinSet = new Set<string>(BUILTIN_TAGS)

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {allTags.map((tag) => {
          const config = getTagConfig(tag, customTags)
          const isSelected = selectedTag === tag
          const isCustom = !builtinSet.has(tag)

          const selectedStyle =
            isSelected && isCustom ? { backgroundColor: config.hexColor, color: "white" } : {}

          return (
            <Button
              key={tag}
              variant={isSelected ? "default" : "outline"}
              size="lg"
              onClick={() => setSelectedTag(tag)}
              disabled={isDisabled}
              className={cn(
                "px-6",
                isSelected && !isCustom && config.color,
                isSelected && "text-white hover:opacity-90"
              )}
              style={selectedStyle}
            >
              {config.label}
            </Button>
          )
        })}
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setManageOpen(true)}
          disabled={isDisabled}
          className="px-3"
          title="Manage tags"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <ManageTagsDialog open={manageOpen} onOpenChange={setManageOpen} />
    </>
  )
}
