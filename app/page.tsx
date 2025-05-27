import DraggableSection from '@/features/landing-page/components/draggable-section'
import Features from '@/features/landing-page/components/features'
import { Hero } from '@/features/landing-page/components/hero'

export default function Home() {
  return (
    <>
      <Hero />
      <DraggableSection />
      <Features />
    </>
  )
}
