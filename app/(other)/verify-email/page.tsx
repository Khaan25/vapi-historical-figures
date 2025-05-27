import { buttonVariants } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center p-8">
      <Image src="/images/vibecheck-welcome.gif" alt="Vibecheck welcome" width={250} height={250} />

      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-md text-muted-foreground text-center">Please check your email inbox for a verification link. If you don&apos;t see it, please check your spam folder.</p>
        </div>

        <div className="flex flex-col gap-y-4 w-full mt-4">
          <Link href="/auth/sign-in" className={buttonVariants({ variant: 'outline' })}>
            Return to login
          </Link>
        </div>
      </div>
    </div>
  )
}
