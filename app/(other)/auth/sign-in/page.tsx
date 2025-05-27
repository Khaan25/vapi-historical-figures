import AuthWrapper from '@/features/auth/components/auth-wrapper'
import { Message } from '@/features/auth/components/form-message'
import { SignInForm } from '@/features/auth/components/forms/sign-in-form'

export type SignInPageProps = {
  searchParams: Message & { callbackUrl?: string }
}

export default function Page({ searchParams }: SignInPageProps) {

  return (
    <AuthWrapper>
      <SignInForm searchParams={searchParams } />
    </AuthWrapper>
  )
}
