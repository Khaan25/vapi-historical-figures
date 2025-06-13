import { Metadata } from 'next'
import AuthWrapper from '@/features/auth/components/auth-wrapper'
import { SignUpForm } from '@/features/auth/components/forms/sign-up-form'
import { MessageParams } from '@/types'

import { defaultMetadata } from '@/config/metadata'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Sign Up',
  description: 'Sign up to Time Whisper',
}

type SignUpPageProps = {
  searchParams: Promise<MessageParams>
}

export default async function Page({ searchParams }: SignUpPageProps) {
  const params = await searchParams

  return (
    <AuthWrapper>
      <SignUpForm searchParams={params} />
    </AuthWrapper>
  )
}
