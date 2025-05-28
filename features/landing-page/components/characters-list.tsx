'use client'

import React from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

type Category = 'View All' | 'Scientists' | 'Artists' | 'Philosophers' | 'Leaders'

interface Character {
  id: string
  name: string
  imageUrl: string
  category: Category
  description: string
  yearsLived: string
  notableWork: string
}

const categories: Category[] = ['View All', 'Scientists', 'Artists', 'Philosophers', 'Leaders']

const characters: Character[] = [
  {
    id: '1',
    name: 'Albert Einstein',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg',
    category: 'Scientists',
    description: 'German-born theoretical physicist, widely acknowledged as one of the greatest physicists of all time.',
    yearsLived: '1879-1955',
    notableWork: 'Theory of Relativity',
  },
  {
    id: '2',
    name: 'Leonardo da Vinci',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Leonardo_self.jpg',
    category: 'Artists',
    description: 'Italian polymath of the Renaissance whose areas of interest included invention, drawing, painting, and architecture.',
    yearsLived: '1452-1519',
    notableWork: 'Mona Lisa',
  },
  {
    id: '3',
    name: 'Socrates',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Socrate_du_Louvre.jpg/250px-Socrate_du_Louvre.jpg',
    category: 'Philosophers',
    description: 'Greek philosopher credited as the founder of Western philosophy and the first moral philosopher.',
    yearsLived: '470-399 BC',
    notableWork: 'Socratic Method',
  },
  {
    id: '4',
    name: 'Isaac Newton',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/39/GodfreyKneller-IsaacNewton-1689.jpg',
    category: 'Scientists',
    description: 'English physicist and mathematician who laid the foundations of classical mechanics.',
    yearsLived: '1643-1727',
    notableWork: 'Principia Mathematica',
  },
  {
    id: '5',
    name: 'Marie Curie',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Marie_Curie_c1920.jpg',
    category: 'Scientists',
    description: 'Polish-French physicist and chemist who conducted pioneering research on radioactivity.',
    yearsLived: '1867-1934',
    notableWork: 'Discovery of Radium',
  },
  {
    id: '6',
    name: 'Plato',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Plato_Silanion_Musei_Capitolini_MC1377.jpg',
    category: 'Philosophers',
    description: 'Ancient Greek philosopher who laid the foundations of Western philosophy and science.',
    yearsLived: '428-348 BC',
    notableWork: 'The Republic',
  },
  {
    id: '7',
    name: 'Michelangelo',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Miguel_%C3%81ngel%2C_por_Daniele_da_Volterra_%28detalle%29.jpg',
    category: 'Artists',
    description: 'Italian sculptor, painter, architect and poet of the High Renaissance.',
    yearsLived: '1475-1564',
    notableWork: 'Sistine Chapel Ceiling',
  },
  {
    id: '8',
    name: 'Mahatma Gandhi',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg',
    category: 'Leaders',
    description: "Indian lawyer and anti-colonial nationalist who led India's non-violent independence movement.",
    yearsLived: '1869-1948',
    notableWork: 'Non-violent Civil Disobedience',
  },
  {
    id: '9',
    name: 'Aristotle',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Aristotle_Altemps_Inv8575.jpg',
    category: 'Philosophers',
    description: 'Greek philosopher and scientist who made significant contributions to logic, metaphysics, mathematics, and natural sciences.',
    yearsLived: '384-322 BC',
    notableWork: 'Nicomachean Ethics',
  },
  {
    id: '10',
    name: 'Charles Darwin',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Charles_Darwin_seated_crop.jpg',
    category: 'Scientists',
    description: 'English naturalist, geologist and biologist, best known for his contributions to evolutionary theory.',
    yearsLived: '1809-1882',
    notableWork: 'On the Origin of Species',
  },
]

export const CharactersList = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<Category>('View All')

  const filteredCharacters = React.useMemo(() => {
    if (selectedCategory === 'View All') return characters
    return characters.filter((char) => char.category === selectedCategory)
  }, [characters, selectedCategory])

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 py-8">
      {/* Categories */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-4 px-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'ghost'}
              className={cn('rounded-full transition-colors', selectedCategory === category ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-muted')}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
              {category !== 'View All' && <span className="ml-2 text-sm text-muted-foreground">{characters.filter((char) => char.category === category).length}</span>}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>

      {/* Characters Grid */}
      <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCharacters.map((character) => (
          <Card key={character.id} className="group relative p-0 overflow-hidden transition-all hover:shadow-lg">
            {/* Image Container */}
            <div className="aspect-[4/3] overflow-hidden">
              <Image width={400} height={300} src={character.imageUrl} alt={character.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <h3 className="text-xl font-bold mb-1">{character.name}</h3>
              <p className="text-sm mb-2">{character.yearsLived}</p>
              <p className="text-sm mb-3">{character.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{character.notableWork}</span>
                <Button variant="secondary" size="sm" className="bg-white text-black hover:bg-white/90" onClick={() => console.log(`Chat with ${character.name}`)}>
                  Chat Now
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
