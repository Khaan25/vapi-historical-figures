import AuthWrapper from '@/features/auth/components/auth-wrapper'
import { SignUpForm } from '@/features/auth/components/forms/sign-up-form'
import { MessageParams } from '@/types'

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
