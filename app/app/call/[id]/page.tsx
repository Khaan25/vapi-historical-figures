import { Metadata } from 'next'
import { CallInterface } from '@/features/call/components/call-interface'
import { Display } from '@/features/call/components/chat-view'
import { getCharacter } from '@/features/character/actions'
import { createClient } from '@/utils/supabase/server'

import { defaultMetadata } from '@/config/metadata'
import { generateCallFirstMessage, generateCallPrompt } from '@/lib/prompt'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Call',
  description: 'Call',
}

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  const character = await getCharacter(id)

  if (!character) {
    return <div>Character not found</div>
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>User not found</div>
  }

  const userImage = user?.user_metadata.avatar_url as string

  // These are the default prompts for the call
  const firstMessage = generateCallFirstMessage(character)
  const systemPrompt = generateCallPrompt(character)

  return (
    <div className="grid grid-cols-[.6fr_.4fr]">
      <CallInterface character={character} systemPrompt={systemPrompt} firstMessage={firstMessage} backHref="/app" />
      <Display character={character} userImage={userImage} systemPrompt={systemPrompt} firstMessage={firstMessage} />
    </div>
  )
}
