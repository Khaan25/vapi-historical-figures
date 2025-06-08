'use client'

import { useRouter } from 'next/navigation'
import { QuizFormValues, quizSchema } from '@/schema'
import { HistoricalFigure } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { addManualQuizzes } from '../actions'

interface ManualQuizProps {
  figure: HistoricalFigure
}

export function ManualQuiz({ figure }: ManualQuizProps) {
  const router = useRouter()

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      questions: [
        {
          question: '',
        },
      ],
    },
    mode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray({
    name: 'questions',
    control: form.control,
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (data: QuizFormValues) => {
    try {
      const { error } = await addManualQuizzes(data, figure.id)

      if (error) {
        toast.error(error)
        return
      }

      toast.success('Questions saved successfully!')

      router.push(`/app/quizzes/${figure.id}/start`)
    } catch (error) {
      console.error('Error saving questions:', error)
      toast.error('Failed to save questions')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-4">
              <FormField
                control={form.control}
                name={`questions.${index}.question`}
                render={({ field }) => (
                  <FormItem className="flex-1 relative">
                    <FormLabel>Question {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter a question about ${figure.name}`} disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />

                    {index > 0 && (
                      <Button type="button" variant="ghost" size="icon" className="absolute p-2 right-0.5 size-8 bottom-0.5" onClick={() => remove(index)} disabled={isSubmitting}>
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </FormItem>
                )}
              />
            </div>
          ))}

          <Button type="button" variant="outline" className="w-full" onClick={() => append({ question: '' })} disabled={isSubmitting}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Questions'
          )}
        </Button>
      </form>
    </Form>
  )
}
