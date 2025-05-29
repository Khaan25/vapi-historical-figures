import { CATEGORIES } from '@/types'
import * as z from 'zod'

// Common Edit Schema (will have ID)
export const commonEditSchema = z.object({
  id: z
    .string()
    .or(z.number())
    .refine((val) => typeof val === 'string' || typeof val === 'number', {
      message: 'ID must be a string or number',
    })
    .refine((val) => Number(val) > 0, { message: 'ID must be greater than 0' }),
})
export type CommonEditValues = z.infer<typeof commonEditSchema>

// Editable<Schema>
// Editable<OpenQuestionSchema>
export type Editable<T> = T & CommonEditValues

// -------------------------------------

export const characterSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL for the image.' }),
  category: z.enum(Object.values(CATEGORIES) as [string, ...string[]], { required_error: 'Please select a category.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(200, { message: 'Description must not exceed 200 characters.' }),
  bio: z.string().min(5, { message: 'Bio must be at least 500 characters.' }).max(15000, { message: 'Bio must not exceed 2000 characters.' }),
  dateOfBirth: z.date({ required_error: 'Date of birth is required' }),
  dateOfDeath: z.date({ required_error: 'Date of death is required' }),
  notableWork: z.string().min(2, { message: 'Notable work must be at least 2 characters.' }),
})
// .refine((data) => data.dateOfDeath > data.dateOfBirth, {
//   message: 'Date of death must be after date of birth',
//   path: ['dateOfDeath'],
// })
export type CharacterFormValues = z.infer<typeof characterSchema>
export const editableCharacterSchema = characterSchema.extend(commonEditSchema.shape)
export type EditableCharacterFormValues = z.infer<typeof editableCharacterSchema>
