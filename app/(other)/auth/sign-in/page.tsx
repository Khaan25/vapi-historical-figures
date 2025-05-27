import AuthWrapper from '@/features/auth/components/auth-wrapper'
import { SignInForm } from '@/features/auth/components/forms/sign-in-form'
import { MessageParams } from '@/types'

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
