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
  category: z.enum(Object.values(CATEGORIES) as [string, ...string[]], { invalid_type_error: 'Please select a category from the list.', required_error: 'Please select a category.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(200, { message: 'Description must not exceed 200 characters.' }),
  bio: z.string().min(500, { message: 'Bio must be at least 500 characters.' }),
  // .max(15_000, { message: 'Bio must not exceed 15000 characters.' }),
  dateOfBirth: z.date({ required_error: 'Date of birth is required' }),
  dateOfDeath: z.date({ required_error: 'Date of death is required' }),
  notableWork: z.string().min(2, { message: 'Notable work must be at least 2 characters.' }),
  voiceId: z.string().min(1, { message: 'Voice ID is required' }),
})
// .refine((data) => data.dateOfDeath > data.dateOfBirth, {
//   message: 'Date of death must be after date of birth',
//   path: ['dateOfDeath'],
// })
export type CharacterFormValues = z.infer<typeof characterSchema>
export const editableCharacterSchema = characterSchema.extend(commonEditSchema.shape)
export type EditableCharacterFormValues = z.infer<typeof editableCharacterSchema>

export const questionSchema = z.object({ question: z.string().min(1, 'Question is required') })
export const quizSchema = z.object({
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
})
export type QuizFormValues = z.infer<typeof quizSchema>

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal('Communication Skills'),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal('Technical Knowledge'),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal('Problem Solving'),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal('Cultural Fit'),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal('Confidence and Clarity'),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
})
export type FeedbackFormValues = z.infer<typeof feedbackSchema>
