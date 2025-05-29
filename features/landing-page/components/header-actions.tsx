import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

import { Button } from '@/components/ui/button'

import HeaderProfile from './header-profile'

export type UserData = {
  avatar: string
  name: string
  email: string
}

export const HeaderActions = async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
        <Button asChild variant="outline" size="sm">
          <Link href="/auth/sign-in">
            <span>Login</span>
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/auth/sign-up">
            <span>Sign Up</span>
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <HeaderProfile
      user={{
        avatar: user.user_metadata.avatar_url,
        name: user.user_metadata.name,
        email: user.email || '',
      }}
    />
  )
}
