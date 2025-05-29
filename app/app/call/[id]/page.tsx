import { CallInterface } from '@/features/call/components/call-interface'
import { Display } from '@/features/call/components/chat-view'
import { getCharacter } from '@/features/character/actions'
import { createClient } from '@/utils/supabase/server'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  const character = await getCharacter(id)

  const supabase = await createClient()

  if (!character) {
    return <div>Character not found</div>
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>User not found</div>
  }

  const userImage = user?.user_metadata.avatar_url as string

  return (
    <div className="grid grid-cols-[.6fr_.4fr]">
      <CallInterface character={character} />
      <Display character={character} userImage={userImage} />
    </div>
  )
}
