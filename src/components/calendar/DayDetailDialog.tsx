import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { PomodoroSession } from "@/types/pomodoro"
import { TAG_CONFIG } from "@/constants/pomodoro"
import { format } from "date-fns"

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
  if (!date) return null

  const completedSessions = sessions.filter((s) => s.status === "completed")
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
          {completedSessions.length > 0 ? (
            <>
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

              <div>
                <h3 className="text-sm font-semibold mb-2">Sessions</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {completedSessions.map((session) => {
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
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${config.color}`} />
                          <span className="text-sm font-medium">{config.label}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {startTime} - {endTime}
                        </span>
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
