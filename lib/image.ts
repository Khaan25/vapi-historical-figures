import { createClient } from '@/utils/supabase/client'

const BUCKET_NAME = 'historical-figures-images'

export const uploadImage = async ({ image, id }: { image: File; id: string }) => {
  const supabase = createClient()

  const fileName = id
  const { error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, image, {
    upsert: true,
  })

  if (error) {
    console.error('Error uploading image:', error)
    return { data: null, error }
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)

  return { data: publicUrlData.publicUrl + `?updated=${Date.now()}`, error: null }
}

export const removeImage = async ({ optionId }: { optionId: string }) => {
  const supabase = createClient()

  const fileName = optionId
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName])

  if (error) {
    console.error('Error removing image:', error)
    return { isRemoved: false, error: error }
  }

  console.log('Image removed successfully')
  return { isRemoved: true, error: null }
}

export const getImageById = async ({ id }: { id: string }) => {
  const supabase = createClient()

  const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(id)
  return publicUrlData.publicUrl
}
