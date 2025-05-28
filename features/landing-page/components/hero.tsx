'use client'

import Image from 'next/image'
import Link from 'next/link'

import { AnimatedGroup } from '@/components/ui/animated-group'
import { Button } from '@/components/ui/button'

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

export function Hero() {
  return (
    <section className="max-w-5xl mx-auto">
      <div className="relative pt-24">
        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"></div>
        <div className="mx-auto max-w-7xl px-6">
          <div className="sm:mx-auto lg:mr-auto">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16">Converse with History&apos;s Greatest Minds</h1>
              <p className="mt-8 max-w-2xl text-pretty text-lg">
                Experience immersive conversations with historical figures through AI-powered voice interactions. Learn directly from the past in a way that&apos;s engaging, educational, and
                revolutionary.
              </p>
              <div className="mt-12 flex items-center gap-2">
                <div key={1} className="bg-foreground/10 rounded-[14px] border p-0.5">
                  <Button asChild size="lg" className="rounded-xl px-5 text-base">
                    <Link href="/app">
                      <span className="text-nowrap">Start Talking</span>
                    </Link>
                  </Button>
                </div>
                <Button key={2} asChild size="lg" variant="ghost" className="h-[42px] rounded-xl px-5 text-base">
                  <Link href="#features">
                    <span className="text-nowrap">View Features</span>
                  </Link>
                </Button>
              </div>
            </AnimatedGroup>
          </div>
        </div>
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.75,
                },
              },
            },
            ...transitionVariants,
          }}
        >
          <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
            <div aria-hidden className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%" />
            <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-7xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
              <Image
                className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                src="https://tailark.com/_next/image?url=%2Fmail2.png&w=3840&q=75"
                alt="app screen"
                width="2700"
                height="1440"
              />
              <Image
                className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                src="https://tailark.com/_next/image?url=%2Fmail2-light.png&w=3840&q=75"
                alt="app screen"
                width="2700"
                height="1440"
              />
            </div>
          </div>
        </AnimatedGroup>
      </div>
    </section>
  )
}
