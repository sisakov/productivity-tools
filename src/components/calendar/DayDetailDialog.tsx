import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PomodoroSession, PomodoroTag } from "@/types/pomodoro"
import { TAG_CONFIG } from "@/constants/pomodoro"
import { usePomodoroContext } from "@/context/PomodoroContext"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"

interface DayDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date | null
  sessions: PomodoroSession[]
}

export function DayDetailDialog({
  open,
  onOpenChange,
  date,
  sessions,
}: DayDetailDialogProps) {
  const { deleteSession, updateSession } = usePomodoroContext()

  if (!date) return null

  const completedSessions = sessions.filter((s) => s.status === "completed")
  const editableSessions = sessions.filter(
    (s) => s.status === "completed" || s.status === "cancelled"
  )
  const totalDuration = completedSessions.reduce((sum, s) => sum + s.duration, 0)
  const totalMinutes = Math.floor(totalDuration / 60)

  const byTag = completedSessions.reduce(
    (acc, session) => {
      acc[session.tag] = (acc[session.tag] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{format(date, "MMMM d, yyyy")}</DialogTitle>
          <DialogDescription>
            {completedSessions.length} completed session
            {completedSessions.length !== 1 ? "s" : ""} • {totalMinutes} minutes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {editableSessions.length > 0 ? (
            <>
              {completedSessions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">By Category</h3>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(byTag).map(([tag, count]) => {
                      const config = TAG_CONFIG[tag as keyof typeof TAG_CONFIG]
                      return (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className={`${config.bgColor} ${config.textColor}`}
                        >
                          {config.label}: {count}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold mb-2">Sessions</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {editableSessions.map((session) => {
                    const config = TAG_CONFIG[session.tag]
                    const startTime = format(new Date(session.startTime), "HH:mm")
                    const endTime = session.endTime
                      ? format(new Date(session.endTime), "HH:mm")
                      : "—"

                    return (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-2 rounded-md border"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${config.color}`} />
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {startTime} – {endTime}
                          </span>
                          {session.status === "cancelled" && (
                            <span className="text-xs text-muted-foreground italic">cancelled</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Select
                            value={session.tag}
                            onValueChange={(newTag: PomodoroTag) =>
                              updateSession(session.id, { tag: newTag })
                            }
                          >
                            <SelectTrigger className="h-7 w-24 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(TAG_CONFIG).map(([tagKey, tagCfg]) => (
                                <SelectItem key={tagKey} value={tagKey}>
                                  {tagCfg.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteSession(session.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No completed sessions on this day
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
