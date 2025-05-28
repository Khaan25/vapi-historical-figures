import { BentoGrid } from '@/features/landing-page/components/bento-grid'
import { CharactersList } from '@/features/landing-page/components/characters-list'
import DraggableSection from '@/features/landing-page/components/draggable-section'
import Features from '@/features/landing-page/components/features'
import Footer from '@/features/landing-page/components/footer'
import { HeroHeader } from '@/features/landing-page/components/header'
import { Hero } from '@/features/landing-page/components/hero'

export default function Home() {
  return (
    <>
      <HeroHeader />

      <Hero />
      <DraggableSection />
      <BentoGrid />
      <CharactersList />
      <Features />
      <Footer />
    </>
  )
}
