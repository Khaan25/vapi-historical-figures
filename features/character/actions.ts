'use server'

import { CharacterFormValues, characterSchema } from '@/schema'
import { Category } from '@/types'
import { createClient } from '@/utils/supabase/server'

import { elevenlabs } from '@/lib/elevenlabs'

export async function addCharacter(data: CharacterFormValues) {
  try {
    // Validate the input data
    const validatedData = characterSchema.parse(data)

    // Create Supabase client
    const supabase = await createClient()
    // Insert the data into Supabase
    const { data: character, error } = await supabase
      .from('historicalFigures')
      .insert({
        name: validatedData.name,
        imageUrl: validatedData.imageUrl,
        description: validatedData.description,
        bio: validatedData.bio,
        category: validatedData.category as Category,
        dateOfBirth: validatedData.dateOfBirth.toISOString(),
        dateOfDeath: validatedData.dateOfDeath.toISOString(),
        notableWork: validatedData.notableWork,
        voiceId: validatedData.voiceId,
      })
      .select('id')
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return character.id
  } catch (error) {
    console.error('Error adding character:', error)
    throw error
  }
}

export async function updateCharacterImage(characterId: string, imageUrl: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('historicalFigures').update({ imageUrl }).eq('id', characterId)

  if (error) {
    return { data: null, error }
  }

  return { data: imageUrl, error: null }
}

export const getCharacter = async (id: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase.from('historicalFigures').select('*').eq('id', id).single()

  if (error) {
    return null
  }

  return data
}

interface GetVoicesParams {
  pageToken?: string
  pageSize?: number
}

export const getVoices = async ({ pageToken, pageSize = 10 }: GetVoicesParams = {}) => {
  const voices = await elevenlabs.voices.search({
    nextPageToken: pageToken,
    pageSize,
  })
  return voices
}
