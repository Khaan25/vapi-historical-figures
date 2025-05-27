import Link from 'next/link'
import { MessageParams } from '@/types'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInAction } from '@/app/(other)/auth/actions'

import { FormMessage } from '../form-message'
import SignInGoogleBtn from '../sign-in-google-btn'
import { SubmitButton } from '../submit-button'
import { SignInUpLayout } from './sign-in-up-layout'

export const SignUpForm = ({ searchParams }: { searchParams: MessageParams }) => {
  const signInActionWithCallbackUrl = signInAction.bind(null, searchParams.callbackUrl ?? undefined)

  return (
    <SignInUpLayout
      image={{
        src: 'https://cdn.midjourney.com/c6963ef7-f495-479b-aa4b-26e5777abd46/0_0.png',
        alt: 'Person looking at the camera',
      }}
    >
      <form className="px-6 py-12 md:px-8" action={signInActionWithCallbackUrl}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Welcome</h1>
            <p className="text-balance text-muted-foreground">Create an Echoes of the Past account</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="name" placeholder="John Doe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="echoes@past.com" required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/forgot-password" className="ml-auto text-sm underline-offset-2 hover:underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" placeholder="• • • • • • • •" required />
          </div>
          <SubmitButton pendingText="Signing Up...">Sign up</SubmitButton>

          <FormMessage message={searchParams} />

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>

          <SignInGoogleBtn />

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </SignInUpLayout>
  )
}
