import { AddCharacterForm } from '@/features/character/components/add-character-form'

import { Screen } from '@/components/common/screen'
import { ScreenHeader } from '@/components/common/screen-header'

export default function Home() {
  return (
    <Screen>
      <ScreenHeader title="Add Historical Figure" description="Add a new historical figure to the database." />
      <AddCharacterForm />
    </Screen>
  )
}
