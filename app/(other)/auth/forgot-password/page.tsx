import { forgotPasswordAction } from '@/app/(other)/auth/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormMessage, Message } from '@/features/auth/components/form-message'
import { SubmitButton } from '@/features/auth/components/submit-button'
import Link from 'next/link'

export default function ForgotPassword({ searchParams }: { searchParams: Message }) {
  return (
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
          <FormMessage message={searchParams} />
          <div className="mt-4 text-center text-sm">
            Remember your password?{' '}
            <Link href="/auth/sign-in" className="underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
