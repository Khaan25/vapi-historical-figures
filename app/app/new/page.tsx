import { Metadata } from 'next'
import { AddCharacterForm } from '@/features/character/components/add-character-form'

import { defaultMetadata } from '@/config/metadata'
import { Screen } from '@/components/common/screen'
import { ScreenHeader } from '@/components/common/screen-header'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Add Historical Figure',
  description: 'Add a new historical figure to the database.',
}

export default function Home() {
  return (
    <Screen>
      <ScreenHeader title="Add Historical Figure" description="Add a new historical figure to the database." />
      <AddCharacterForm />
    </Screen>
  )
}
