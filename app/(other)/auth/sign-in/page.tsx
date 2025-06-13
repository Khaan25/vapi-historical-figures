import { Metadata } from 'next'
import AuthWrapper from '@/features/auth/components/auth-wrapper'
import { SignInForm } from '@/features/auth/components/forms/sign-in-form'
import { MessageParams } from '@/types'

import { defaultMetadata } from '@/config/metadata'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Sign In',
  description: 'Sign in to Time Whisper',
}

export type SignInPageProps = {
  searchParams: Promise<MessageParams>
}

export default async function Page({ searchParams }: SignInPageProps) {
  const params = await searchParams

  return (
    <AuthWrapper>
      <SignInForm searchParams={params} />
    </AuthWrapper>
  )
}
