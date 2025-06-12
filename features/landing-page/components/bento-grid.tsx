import { ComponentProps } from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

export function BentoGrid({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto px-4', className)} {...props}>
      <div className="flex flex-col gap-4 p-6 rounded-lg bg-violet-200">
        <div>
          <h3 className="text-lg font-semibold mb-2">Speak with Legends</h3>
          <p className="text-sm text-neutral-600">Converse with iconic thinkers like Einstein, Leonardo da Vinci, and Marie Curie—brought to life through AI.</p>
        </div>
        <div className="bg-white/20 p-4 rounded-lg group-hover:scale-95 transition-transform duration-300">
          <Image
            src="/scientist.png"
            alt="Historical figure conversation"
            width={512}
            height={334}
            className="rounded-md transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row lg:flex-col min-h-full gap-6 group">
        <div className="px-6 md:px-11 py-16 md:py-20 lg:py-0 text-center relative overflow-hidden flex flex-col rounded-md h-full flex-1 justify-center group/item bg-green-100">
          <h3 className="text-lg font-semibold">Learn from the Minds that Shaped Humanity</h3>
          <p className="text-sm text-neutral-600 mt-2">Absorb timeless insights from centuries of human progress, philosophy, and discovery.</p>
          <div className="group-hover/item:md:opacity-40 flex justify-between pointer-events-none absolute xl:w-[150%] md:w-[180%] w-[140%] opacity-10 md:opacity-20 left-1/2 -translate-x-1/2 inset-x-0 transition-all duration-300">
            <Image
              className="rotating-animation transition-transform duration-500 lg:group-hover/item:rotate-[20deg]"
              src="https://glasto-astro.vercel.app/images/rounded-pattern.svg"
              width={180}
              height={180}
              alt="Historical wisdom"
            />
            <Image
              className="rotating-animation transition-transform duration-500 lg:group-hover/item:rotate-[20deg]"
              src="https://glasto-astro.vercel.app/images/rounded-pattern.svg"
              width={180}
              height={180}
              alt="Historical wisdom"
            />
          </div>
        </div>
        <div className="px-6 md:px-11 py-16 md:py-20 lg:py-0 text-center relative overflow-hidden flex flex-col rounded-md h-full flex-1 justify-center group/item bg-lime-100">
          <h3 className="text-lg font-semibold">Ask. Learn. Reflect.</h3>
          <p className="text-sm text-neutral-600 mt-2">Pose your own questions and get nuanced answers tailored to your curiosity—from the voices of history.</p>
          <div className="group-hover/item:top-[calc(100%_-_1.8rem)] absolute left-1/2 -translate-x-1/2 top-[calc(100%_-_2.5rem)] transition-all duration-300">
            <Image
              className="rotating-animation transition-transform duration-500 lg:group-hover/item:translate-y-5"
              src="https://glasto-astro.vercel.app/images/rounded-pattern-sky.svg"
              width={300}
              height={300}
              alt="Personalized interaction"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-4 p-6 rounded-lg bg-violet-200">
        <div>
          <h3 className="text-lg font-semibold mb-2">Step into the Past, One Voice at a Time</h3>
          <p className="text-sm text-neutral-600">Relive history through dynamic, lifelike dialogue with the people who shaped our world.</p>
        </div>
        <div className="flex justify-between bg-white/20 p-4 rounded-lg">
          <Image
            src="/dialog.png"
            alt="Historical conversation interface"
            width={200}
            height={240}
            className="w-full rounded-md max-h-52 object-cover object-top transition-transform duration-300 group-hover:translate-y-2"
          />
        </div>
      </div>
    </div>
  )
}

{
  /* function GradientOverlay() {
  return (
    <>
      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
    </>
  )
}

function SideGradients() {
  return (
    <>
      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black to-transparent h-full pointer-events-none" />
    </>
  )
}

function ImageGrid() {
  const images = [
    'https://strshrt.xyz/out-0%20(4).webp',
    'https://strshrt.xyz/out-0%20(6).webp',
    'https://strshrt.xyz/temp/66f179a723458c48d9625563/image_5.webp',
    'https://images.unsplash.com/photo-1517322048670-4fba75cbbb62',
    'https://strshrt.xyz/temp/66f179a723458c48d9625563/image_0.webp',
    'https://strshrt.xyz/temp/66f179a723458c48d9625563/image_4.webp',
    'https://strshrt.xyz/videos/66ead1fd79f7c20709eea927/image_0_1727101866961.webp',
    'https://images.unsplash.com/photo-1546484475-7f7bd55792da',
  ]

  return (
    <>
      <div className="flex flex-row">
        {images.slice(0, 4).map((src, i) => (
          <ImageTile key={i} src={src} rotation={[-9.25277, -3.3063, 8.93681, -5.5771][i]} />
        ))}
      </div>
      <div className="flex flex-row">
        {images.slice(4).map((src, i) => (
          <ImageTile key={i + 4} src={src} rotation={[6.53942, -3.732, 4.43044, -2.85686][i]} />
        ))}
      </div>
    </>
  )
}

function ImageTile({ src, rotation }: { src: string; rotation: number }) {
  return (
    <div
      className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
      tabIndex={0}
      style={{ transform: `rotate(${rotation}deg) translateZ(0px)` }}
    >
      <Image alt="bali images" width={500} height={500} className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0" src={src} />
    </div>
  )
} */
}
