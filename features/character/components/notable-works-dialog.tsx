'use client'

import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface NotableWorksDialogProps {
  isOpen: boolean
  onClose: () => void
  notableWorks: string[]
  onSave: (selectedWorks: string[]) => void
}

export function NotableWorksDialog({ isOpen, onClose, notableWorks, onSave }: NotableWorksDialogProps) {
  const [selectedWorks, setSelectedWorks] = useState<string[]>([])

  const handleToggleWork = (work: string) => {
    setSelectedWorks((prev) => (prev.includes(work) ? prev.filter((w) => w !== work) : [...prev, work]))
  }

  const handleSave = () => {
    onSave(selectedWorks)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Notable Works</DialogTitle>
          <DialogDescription>Click on the works to select them. Selected works will be highlighted.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2 py-4">
          {notableWorks.map((work) => (
            <Badge
              key={work}
              variant={selectedWorks.includes(work) ? 'default' : 'outline'}
              className="cursor-pointer line-clamp-1 max-w-[350px] truncate hover:bg-primary/90 hover:text-white transition-colors"
              onClick={() => handleToggleWork(work)}
            >
              {work}
            </Badge>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
