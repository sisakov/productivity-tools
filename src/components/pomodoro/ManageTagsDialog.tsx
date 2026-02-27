import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { usePomodoroContext } from "@/context/PomodoroContext"
import { CustomTagDialog } from "./CustomTagDialog"
import { CustomTag } from "@/types/pomodoro"
import { Pencil, Trash2 } from "lucide-react"

interface ManageTagsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageTagsDialog({ open, onOpenChange }: ManageTagsDialogProps) {
  const { customTags, addCustomTag, updateCustomTag, deleteCustomTag, isTagInUse } =
    usePomodoroContext()
  const [customTagDialogOpen, setCustomTagDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<CustomTag | undefined>()
  const [deletingTagId, setDeletingTagId] = useState<string | null>(null)

  const handleAddNew = () => {
    setEditingTag(undefined)
    setCustomTagDialogOpen(true)
  }

  const handleEdit = (tag: CustomTag) => {
    setEditingTag(tag)
    setCustomTagDialogOpen(true)
  }

  const handleDelete = (tagId: string) => {
    if (isTagInUse(tagId)) {
      setDeletingTagId(tagId)
    } else {
      deleteCustomTag(tagId)
    }
  }

  const confirmDelete = () => {
    if (deletingTagId) {
      deleteCustomTag(deletingTagId)
      setDeletingTagId(null)
    }
  }

  const handleSave = (label: string, hexColor: string) => {
    if (editingTag) {
      updateCustomTag(editingTag.id, { label, hexColor })
    } else {
      addCustomTag({
        id: `${label.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        label,
        hexColor,
      })
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {customTags.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No custom tags yet
              </p>
            ) : (
              customTags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-2 rounded-md border"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tag.hexColor }}
                    />
                    <span className="text-sm">{tag.label}</span>
                  </div>
                  {deletingTagId === tag.id ? (
                    <div className="flex items-center gap-1 text-xs text-destructive">
                      <span>In use — confirm?</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={confirmDelete}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setDeletingTagId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleEdit(tag)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(tag.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          <Button variant="outline" className="w-full" onClick={handleAddNew}>
            Add new tag
          </Button>
        </DialogContent>
      </Dialog>

      <CustomTagDialog
        open={customTagDialogOpen}
        onOpenChange={setCustomTagDialogOpen}
        editingTag={editingTag}
        onSave={handleSave}
      />
    </>
  )
}
