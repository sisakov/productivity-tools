import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getTagInlineStyles } from "@/constants/pomodoro"
import { CustomTag } from "@/types/pomodoro"

interface CustomTagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingTag?: CustomTag
  onSave: (label: string, hexColor: string) => void
}

export function CustomTagDialog({
  open,
  onOpenChange,
  editingTag,
  onSave,
}: CustomTagDialogProps) {
  const [label, setLabel] = useState("")
  const [hexColor, setHexColor] = useState("#3b82f6")

  useEffect(() => {
    if (open) {
      setLabel(editingTag?.label ?? "")
      setHexColor(editingTag?.hexColor ?? "#3b82f6")
    }
  }, [open, editingTag])

  const handleSave = () => {
    if (!label.trim()) return
    onSave(label.trim(), hexColor)
    onOpenChange(false)
  }

  const previewStyle = getTagInlineStyles({
    label,
    color: "",
    bgColor: "",
    textColor: "",
    hexColor,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{editingTag ? "Edit Tag" : "New Tag"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Tag name"
              className="mt-1 w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Color</label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="color"
                value={hexColor}
                onChange={(e) => setHexColor(e.target.value)}
                className="h-9 w-14 rounded cursor-pointer border"
              />
              <span className="text-sm text-muted-foreground">{hexColor}</span>
            </div>
          </div>
          {label && (
            <div>
              <label className="text-sm font-medium">Preview</label>
              <div className="mt-1">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={previewStyle}
                >
                  {label}
                </span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!label.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
