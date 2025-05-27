import { resetPasswordAction } from '@/app/(other)/auth/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthWrapper from '@/features/auth/components/auth-wrapper'
import { FormMessage, Message } from '@/features/auth/components/form-message'
import { SubmitButton } from '@/features/auth/components/submit-button'

export default async function ResetPassword({ searchParams }: { searchParams: Message }) {
  return (
    <AuthWrapper>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>Please enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" action={resetPasswordAction}>
            <div className="grid gap-2">
              <Label htmlFor="password">New password</Label>
              <Input id="password" type="password" name="password" placeholder="New password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type="password" name="confirmPassword" placeholder="Confirm password" required />
            </div>
            <SubmitButton pendingText="Resetting..." className="w-full">
              Reset password
            </SubmitButton>
            <FormMessage message={searchParams} />
          </form>
        </CardContent>
      </Card>
    </AuthWrapper>
  )
}
