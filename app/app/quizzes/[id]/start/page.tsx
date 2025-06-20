import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CallInterface } from '@/features/call/components/call-interface'
import { Display } from '@/features/call/components/chat-view'
import { getCharacter } from '@/features/character/actions'
import { getQuizQuestions } from '@/features/quiz/actions'
import { createClient } from '@/utils/supabase/server'

import { defaultMetadata } from '@/config/metadata'
import { generateQuizFirstMessage, generateQuizPrompt } from '@/lib/prompt'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Quiz Start',
  description: 'Quiz Start',
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
    return redirect('/auth/sign-in')
  }

  const userImage = user?.user_metadata.avatar_url as string

  const { data: questions, error } = await getQuizQuestions(id)

  if (error) {
    return <div>Error fetching questions</div>
  }

  if (!questions) {
    return <div>No questions found</div>
  }

  const firstMessage = generateQuizFirstMessage(character)
  const systemPrompt = generateQuizPrompt(character, questions)

  return (
    <div className="grid grid-cols-[.6fr_.4fr]">
      <CallInterface character={character} systemPrompt={systemPrompt} firstMessage={firstMessage} backHref="/app/quizzes" isQuiz />
      <Display character={character} userImage={userImage} systemPrompt={systemPrompt} firstMessage={firstMessage} />
    </div>
  )
}
