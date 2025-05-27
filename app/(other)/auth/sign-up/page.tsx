import AuthWrapper from '@/features/auth/components/auth-wrapper'
import { Message } from '@/features/auth/components/form-message'
import { SignUpForm } from '@/features/auth/components/forms/sign-up-form'

export default function Page({ searchParams }: { searchParams: Message }) {
  return (
    <AuthWrapper>
    <SignUpForm searchParams={searchParams } />
  </AuthWrapper>
  )
}
