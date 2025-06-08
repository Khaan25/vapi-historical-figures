import Image from 'next/image'

import { DraggableCardBody, DraggableCardContainer } from '@/components/ui/draggable-card'

const historicalFigures = [
  {
    name: 'Thomas Jefferson',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Official_Presidential_portrait_of_Thomas_Jefferson_%28by_Rembrandt_Peale%2C_1800%29.jpg/250px-Official_Presidential_portrait_of_Thomas_Jefferson_%28by_Rembrandt_Peale%2C_1800%29.jpg',
    className: 'absolute top-10 left-[20%] rotate-[-5deg]',
  },
  {
    name: 'Muhammad Ali Jinnah',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Jinnah1945c.jpg/250px-Jinnah1945c.jpg',
    className: 'absolute top-40 left-[25%] rotate-[-7deg]',
  },
  {
    name: 'Nikola Tesla',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg',
    className: 'absolute top-5 left-[40%] rotate-[8deg]',
  },
  {
    name: 'Florence Nightingale',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Florence_Nightingale_%28H_Hering_NPG_x82368%29.jpg/250px-Florence_Nightingale_%28H_Hering_NPG_x82368%29.jpg',
    className: 'absolute top-32 left-[55%] rotate-[10deg]',
  },
  {
    name: 'Marie Curie',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Marie_Curie_c1920.jpg',
    className: 'absolute top-20 right-[35%] rotate-[2deg]',
  },
  {
    name: 'Mahatma Gandhi',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg',
    className: 'absolute top-24 left-[45%] rotate-[-7deg]',
  },
  {
    name: 'Albert Einstein',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg',
    className: 'absolute top-8 left-[30%] rotate-[4deg]',
  },
]

export default function DraggableSection() {
  return (
    <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
      <p className="absolute top-1/2 mx-auto max-w-md text-balance -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl dark:text-neutral-800">
        Meet the legends. Speak their truth. Engage in meaningful conversations with history&apos;s greatest minds
      </p>
      {historicalFigures.map((item) => (
        <DraggableCardBody key={item.name} className={item.className}>
          <Image width={320} height={320} src={item.imageUrl} alt={item.name} className="pointer-events-none relative z-10 h-80 w-80 object-cover" />
          <h3 className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">{item.name}</h3>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  )
}
