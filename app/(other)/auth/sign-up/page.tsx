import AuthWrapper from '@/features/auth/components/auth-wrapper'
import { SignUpForm } from '@/features/auth/components/forms/sign-up-form'
import { MessageParams } from '@/types'

export default async function Page({ searchParams }: { searchParams: MessageParams }) {
  const params = await searchParams
  
  return (
    <AuthWrapper>
    <SignUpForm searchParams={params} />
  </AuthWrapper>
  )
}
