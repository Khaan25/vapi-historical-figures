'use client'

import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'

import { elevenlabs } from '@/lib/elevenlabs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

import { getVoices } from '../actions'
import { VoiceListItem } from './voice-list-item'

type VoicesResponse = Awaited<ReturnType<typeof elevenlabs.voices.search>>

interface VoiceSelectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (voiceId: string, name: string) => void
}

export function VoiceSelectionDialog({ isOpen, onClose, onSelect }: VoiceSelectionDialogProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('')
  const [playingVoiceId, setPlayingVoiceId] = useState<string>('')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch] = useDebounce(searchTerm, 300)

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<VoicesResponse>({
    queryKey: ['voices', debouncedSearch],
    queryFn: ({ pageParam }) => getVoices({ pageToken: pageParam as string, search: debouncedSearch }),
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    initialPageParam: undefined,
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const allVoices = data?.pages.flatMap((page) => page.voices) || []
  console.log('allVoices :', allVoices)

  const handleSelect = () => {
    if (!selectedVoiceId) return

    const selectedVoice = allVoices.find((voice) => voice.voiceId === selectedVoiceId)
    if (!selectedVoice?.voiceId || !selectedVoice?.name) return

    onSelect(selectedVoice.voiceId, selectedVoice.name)
    onClose()
  }

  const handlePlayPreview = (voiceId: string, previewUrl: string) => {
    if (playingVoiceId === voiceId) {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setPlayingVoiceId('')
    } else {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause()
      }

      // Play new audio
      const audio = new Audio(previewUrl)
      audio.onended = () => {
        setPlayingVoiceId('')
        audioRef.current = null
      }
      audio.play()
      audioRef.current = audio
      setPlayingVoiceId(voiceId)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[872px]">
        <DialogHeader>
          <DialogTitle>Select a Voice ({allVoices.length})</DialogTitle>
          <DialogDescription>Choose a voice for your historical figure. Click to preview the voice.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 mb-6">
          <Input type="search" placeholder="Search voices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {(error as Error).message}</div>
        ) : (
          <ScrollArea className="overflow-x-auto max-h-[600px]">
            <div className="space-y-2">
              {allVoices.map((voice) => (
                <VoiceListItem
                  key={voice.voiceId}
                  voice={voice}
                  selectedVoiceId={selectedVoiceId}
                  setSelectedVoiceId={setSelectedVoiceId}
                  handlePlayPreview={handlePlayPreview}
                  playingVoiceId={playingVoiceId}
                />
              ))}

              <div ref={loadMoreRef} className="h-8 w-full">
                {isFetchingNextPage && <div className="py-4 text-center text-sm text-subtle">Loading more voices...</div>}
              </div>
            </div>
          </ScrollArea>
        )}
        <DialogFooter className="mt-4 flex items-center sm:justify-between w-full">
          {selectedVoiceId && <div className="text-sm text-subtle">Selected Voice: {allVoices.find((voice) => voice.voiceId === selectedVoiceId)?.name}</div>}

          <div className="flex max-sm:flex-col items-center justify-center max-sm:w-full gap-2 sm:gap-4">
            <Button className="max-sm:w-full" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="max-sm:w-full" onClick={handleSelect} disabled={!selectedVoiceId}>
              Select Voice
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
