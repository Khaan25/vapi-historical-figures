import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

type SignInUpLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  image: {
    src: string
    alt: string
  }
}

export const SignInUpLayout = ({ children, image, className, ...props }: SignInUpLayoutProps) => {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="py-0 overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          {children}

          <div className="relative hidden bg-muted md:block">
            <Image src={image.src} alt={image.alt} width={400} height={500} className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <Link href="/terms-of-service">Terms of Service</Link> and <Link href="/privacy-policy">Privacy Policy</Link>.
      </div>
    </div>
  )
}
