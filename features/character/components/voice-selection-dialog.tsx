'use client'

import { useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import { elevenlabs } from '@/lib/elevenlabs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

import { getVoices } from '../actions'
import { VoiceListItem } from './voice-list-item'

type VoicesResponse = Awaited<ReturnType<typeof elevenlabs.voices.search>>

interface VoiceSelectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (voiceId: string) => void
}

export function VoiceSelectionDialog({ isOpen, onClose, onSelect }: VoiceSelectionDialogProps) {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<VoicesResponse>({
    queryKey: ['voices'],
    queryFn: ({ pageParam }) => getVoices({ pageToken: pageParam as string }),
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    initialPageParam: undefined,
  })

  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('')
  const [playingVoiceId, setPlayingVoiceId] = useState<string>('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Handle scroll to load more
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }
  }

  const allVoices = data?.pages.flatMap((page) => page.voices) || []

  const handleSelect = () => {
    if (selectedVoiceId) {
      onSelect(selectedVoiceId)
      onClose()
    }
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
          <DialogTitle>Select a Voice</DialogTitle>
          <DialogDescription>Choose a voice for your historical figure. Click to preview the voice.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {(error as Error).message}</div>
        ) : (
          <ScrollArea className="max-h-[600px] mt-4" onScroll={handleScroll}>
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

              {isFetchingNextPage && <div className="py-4 text-center text-sm text-subtle">Loading more voices...</div>}
            </div>
          </ScrollArea>
        )}
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedVoiceId}>
            Select Voice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
