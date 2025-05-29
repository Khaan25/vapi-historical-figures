import { HistoricalCharactersList } from '@/features/dashboard/components/historical-characters-list'
import { createClient } from '@/utils/supabase/client'

export default async function Dashboard() {
  const supabase = await createClient()

  const { data, error } = await supabase.from('historicalFigures').select('*').order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching historical figures:', error)
    return <div>Error loading historical figures</div>
  }

  return <HistoricalCharactersList figures={data} />
}
