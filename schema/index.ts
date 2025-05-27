import { MATCHING_MECHANISMS } from '@/types'
import * as z from 'zod'

// Common image upload schema
export const imageUploadSchema = z.object({
  // Image is used to display the image that we're uploading
  // image: z.string().nullable(),
  image: z.string().min(1, 'Image is required'),
  // File is used for image upload
  // file: z.instanceof(File).nullable(),
  file: z.any().nullable(),
})

export const courseSchema = z
  .object({
    name: z.string().min(3, 'Course name must be at least 3 characters').max(50, 'Course name must be less than 50 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
    dateFrom: z.date({ required_error: 'Start date is required' }),
    dateTo: z.date({ required_error: 'End date is required' }),
    language: z.number().min(1, 'Language is required'),
  })
  .extend(imageUploadSchema.shape)
export type CourseFormValues = z.infer<typeof courseSchema>

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

export const moduleSchema = z.object({
  name: z.string().min(1, 'Module name is required'),
  date: z.date({ required_error: 'Date is required' }),
})
export type ModuleFormValues = z.infer<typeof moduleSchema>

const studentSchema = z.object({
  name: z.string().min(1, 'Student name is required'),
  email: z.string().email('Invalid email address'),
  groupId: z.string().min(1, 'Group is required'),
})
export type StudentFormValues = z.infer<typeof studentSchema>

export const studentsSchema = z.object({ students: z.array(studentSchema) })
export type StudentsFormValues = z.infer<typeof studentsSchema>

export const welcomeTextSchema = z.object({ text: z.string().min(1, 'Welcome text is required') })
export type WelcomeTextFormValues = z.infer<typeof welcomeTextSchema>

// Editable<Schema>
// Editable<OpenQuestionSchema>
export type Editable<T> = T & CommonEditValues

// -------------------------------------

export const openQuestionSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  image: z.string().nullable(),
})
export type OpenQuestionFormValues = z.infer<typeof openQuestionSchema>

export const optionSchema = z.object({
  text: z.string().min(1, 'Option text is required'),
  // Image is used to display the image that we're uploading
  image: z.string().nullable(),
  // File is used for image upload
  // file: z.instanceof(File).nullable(),
  file: z.any().nullable(),
  order: z.number(),
})
export type OptionFormValues = z.infer<typeof optionSchema>

export const mcqQuestionSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  options: z.array(optionSchema).min(2, 'At least two options are required'),
})
export type MCQFormValues = z.infer<typeof mcqQuestionSchema>

export const editableOptionSchema = commonEditSchema.extend(optionSchema.shape)
export type EditableOptionFormValues = z.infer<typeof editableOptionSchema>

export const editableMCQQuestionSchema = mcqQuestionSchema.extend(commonEditSchema.shape).extend({
  options: z.array(editableOptionSchema).min(2, 'At least two options are required'),
})
export type EditableMCQFormValues = z.infer<typeof editableMCQQuestionSchema>

export const vibecheckSchema = z.object({
  name: z.string().min(1, 'Vibecheck name is required'),
  description: z.string(),
  date: z.date({
    required_error: 'Date is required',
  }),
})
export type VibecheckFormValues = z.infer<typeof vibecheckSchema>

export const vibecheckAiSchema = z.object({ description: z.string() })
export type VibecheckAiFormValues = z.infer<typeof vibecheckAiSchema>

export const promptSchema = z.object({ prompt: z.string().min(1, 'Prompt is required') })
export type PromptFormValues = z.infer<typeof promptSchema>

export const battleCardSchema = promptSchema
export type BattleCardFormValues = PromptFormValues

export const fortuneCookieSchema = promptSchema.extend({ text: z.string().min(1, 'Text is required') })
export type FortuneCookieFormValues = z.infer<typeof fortuneCookieSchema>

export const aiRecommendationSchema = promptSchema
export type AIRecommendationFormValues = PromptFormValues

export const emojiSchema = z.object({ text: z.string().min(1, 'Emoji text is required') })
export type EmojiFormValues = z.infer<typeof emojiSchema>

export const thankYouSchema = z.object({ text: z.string().min(1, 'Thank you text is required') })
export type ThankYouFormValues = z.infer<typeof thankYouSchema>

const activityOptionSchema = z.object({
  text: z.string(),
  image_prompt: z.string().optional(),
})

const activitySchema = z.union([
  z.object({
    type: z.literal('mcq'),
    question: z.string(),
    options: z.array(activityOptionSchema),
  }),
  z.object({
    type: z.literal('open_question'),
    question: z.string(),
    image_prompt: z.string(),
  }),
  z.object({
    type: z.literal('fortune_cookie'),
    prompt: z.string(),
  }),
  z.object({
    type: z.literal('battle_card'),
    prompt: z.string(),
  }),
])

export type Activity = z.infer<typeof activitySchema>

export const vibecheckGenerationSchema = z.object({
  title: z.string(),
  description: z.string(),
  activities: z.array(activitySchema),
})

export const battleCardGenerationSchema = z.object({
  name: z.string(),
  description: z.string(),
  stats: z.array(z.object({ name: z.string(), value: z.number() })),
  image_prompt: z.string(),
})

export const fortuneCookieGenerationSchema = z.object({ message: z.string() })
export const aiRecommendationGenerationSchema = z.object({ message: z.string() })

export const quizQuestionSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  options: z.array(z.string().min(1, 'Option text is required')).min(2, 'At least two options are required'),
  correctAnswer: z.number().min(0, 'Correct answer index is required'),
})

export const quizSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  questions: z.array(quizQuestionSchema).min(1, 'At least one question is required'),
})
export type QuizFormValues = z.infer<typeof quizSchema>

export const matchingSchema = z.object({
  matchResultText: z.string().min(1, 'Match result text is required'),
  text: z.string().min(1, 'Text is required'),
  mechanism: z.enum([MATCHING_MECHANISMS.TWIN, MATCHING_MECHANISMS.OPPOSITE]),
})
export type MatchingFormValues = z.infer<typeof matchingSchema>

export const participantSchema = z.object({
  participantId: z.string().min(1, 'Please select a participant'),
})
export type ParticipantFormValues = z.infer<typeof participantSchema>
