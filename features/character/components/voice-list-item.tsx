'use client'

import { Voice } from '@elevenlabs/elevenlabs-js/api'
import Avatar from 'boring-avatars'
import { Pause, Play } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type VoiceListItemProps = {
  voice: Voice
  selectedVoiceId: string
  setSelectedVoiceId: (voiceId: string) => void
  handlePlayPreview: (voiceId: string, previewUrl: string) => void
  playingVoiceId: string
}

export const VoiceListItem = ({ voice, selectedVoiceId, setSelectedVoiceId, handlePlayPreview, playingVoiceId }: VoiceListItemProps) => {
  const isSelected = selectedVoiceId === voice.voiceId

  return (
    <div
      key={voice.voiceId}
      className={cn(`w-full flex items-center gap-3 p-3 hover:bg-gray-alpha-50 rounded-lg cursor-pointer`, isSelected && 'bg-accent')}
      onClick={() => setSelectedVoiceId(voice.voiceId)}
    >
      <div className="relative flex items-center justify-center bg-transparent size-10 my-1 rounded-full">
        <Avatar name={voice.name} variant="marble" />
        {voice.previewUrl && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute size-10 inset-0 hover:bg-black/60 transition-opacity rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              handlePlayPreview(voice.voiceId, voice.previewUrl!)
            }}
          >
            {playingVoiceId === voice.voiceId ? <Pause className="size-4 fill-white text-white" /> : <Play className="size-4 fill-white text-white" />}
          </Button>
        )}
      </div>

      {/* Voice Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold truncate">{voice.name}</h3>
            <p className="text-sm text-subtle line-clamp-1">{voice.description}</p>
          </div>

          {/* Language and Accent */}
          {voice.labels?.accent && voice.labels.language && (
            <div className="hidden md:block">
              <div className="text-sm flex items-center gap-2">
                {/* <img src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${voice.labels.language}.svg`} alt={voice.labels.accent} width={14} height={14} className="rounded-full" /> */}
                <span>{voice.labels.language?.toUpperCase()}</span>
                <span className="text-gray-alpha-600">•</span>
                <span className="text-gray-alpha-600 capitalize">{voice.labels.accent}</span>
              </div>
            </div>
          )}

          {/* Use Case */}
          <div className="hidden lg:block">
            <p className="text-sm truncate capitalize">{voice.labels?.useCase?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
