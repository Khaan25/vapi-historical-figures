import Link from 'next/link'
import AuthWrapper from '@/features/auth/components/auth-wrapper'
import { FormMessage } from '@/features/auth/components/form-message'
import { SubmitButton } from '@/features/auth/components/submit-button'
import { MessageParams } from '@/types'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forgotPasswordAction } from '@/app/(other)/auth/actions'

type ForgotPasswordPageProps = {
  searchParams: Promise<MessageParams>
}

export default async function ForgotPassword({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams

  return (
    <AuthWrapper>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>Enter your email to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" action={forgotPasswordAction}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <SubmitButton pendingText="Resetting..." className="w-full">
              Reset Password
            </SubmitButton>
            <FormMessage message={params} />
            <div className="mt-4 text-center text-sm">
              Remember your password?{' '}
              <Link href="/auth/sign-in" className="underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthWrapper>
  )
}
