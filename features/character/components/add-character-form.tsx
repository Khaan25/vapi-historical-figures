'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { characterSchema } from '@/schema'
import { categories } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { StorageError } from '@supabase/storage-js'
import { format } from 'date-fns'
import { CalendarIcon, Info, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { EMPTY_STRING } from '@/config/constants'
import { uploadImage } from '@/lib/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dropzone, DropZoneArea, DropzoneMessage, DropzoneTrigger, useDropzone } from '@/components/ui/dropzone'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { addCharacter, updateCharacterImage } from '../actions'
import { NotableWorksDialog } from './notable-works-dialog'

export function AddCharacterForm() {
  const [isWikipediaLoading, setIsWikipediaLoading] = useState(false)
  const [wikipediaError, setWikipediaError] = useState<string | null>(null)
  const [isNotableWorksDialogOpen, setIsNotableWorksDialogOpen] = useState(false)
  const [availableNotableWorks, setAvailableNotableWorks] = useState<string[]>([])

  const form = useForm<z.infer<typeof characterSchema>>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
      description: '',
      dateOfBirth: new Date(),
      dateOfDeath: new Date(),
      notableWork: '',
      bio: '',
      category: undefined,
    },
  })

  const { isSubmitting } = form.formState

  const onDropFile = useCallback(async (file: File) => {
    if (isSubmitting) return { status: 'error' as const, error: 'Form is submitting' }

    try {
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file)
      return {
        status: 'success' as const,
        result: previewUrl,
      }
    } catch (error) {
      console.error('Error creating preview URL:', error)
      return {
        status: 'error' as const,
        error: 'Failed to create image preview',
      }
    }
  }, [])

  const dropzone = useDropzone({
    onDropFile,
    validation: {
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg'],
      },
      maxSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
    onFileUploadError: (error) => {
      toast.error(error)
    },
  })

  const avatarFile = dropzone.fileStatuses[0]?.file
  const avatarSrc = dropzone.fileStatuses[0]?.result
  const isPending = dropzone.fileStatuses[0]?.status === 'pending'

  const fetchWikipediaData = async (name: string) => {
    if (!name) return

    setIsWikipediaLoading(true)
    setWikipediaError(null)

    try {
      // Step 1: Get Wikipedia page data
      const wikiResp = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageprops|extracts|pageimages|description|categories&explaintext=true&pithumbsize=500&format=json&exsectionformat=plain&origin=*`
      )
      const wikiData = await wikiResp.json()
      const pages = wikiData.query.pages
      const page = Object.values(pages)[0] as {
        pageid: number
        title: string
        extract: string
        description?: string
        pageprops: {
          wikibase_item: string
          'wikibase-shortdesc'?: string
        }
        thumbnail?: {
          source: string
        }
      }

      if (!page || page.pageid === -1) {
        throw new Error('No Wikipedia article found for this name')
      }

      const shortDesc = page.description || page.pageprops?.['wikibase-shortdesc']
      const wikidataId = page.pageprops?.wikibase_item
      if (!wikidataId) {
        throw new Error('No Wikidata ID found for this article')
      }

      // Step 2: Fetch Wikidata entity data
      const wdResp = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`)
      const wdData = await wdResp.json()
      const entity = wdData.entities[wikidataId]
      const claims = entity.claims

      // Helper: extract date string from Wikidata time format
      function getDate(prop: string) {
        if (!claims[prop]) return null
        const timeStr = claims[prop][0].mainsnak.datavalue.value.time
        return new Date(timeStr.slice(1, 11)) // Convert "YYYY-MM-DD" to Date
      }

      // Helper: get notable works labels
      async function getNotableWorksLabels() {
        if (!claims.P800) return []
        const workIds = claims.P800.map((w: { mainsnak: { datavalue: { value: { id: string } } } }) => w.mainsnak.datavalue.value.id)
        if (workIds.length === 0) return []

        // Fetch labels for all notable works in one request
        const idsStr = workIds.join('|')
        const labelsResp = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${idsStr}&props=labels&languages=en&format=json&origin=*`)
        const labelsData = await labelsResp.json()
        return workIds.map((id: string) => labelsData.entities[id]?.labels?.en?.value).filter(Boolean)
      }

      const dateOfBirth = getDate('P569')
      const dateOfDeath = getDate('P570')
      const notableWorks = await getNotableWorksLabels()
      const imageUrl = page.thumbnail?.source

      // Update form with all the fetched data
      form.setValue('name', page.title)
      form.setValue('bio', page.extract)
      if (shortDesc) form.setValue('description', shortDesc)
      if (dateOfBirth) form.setValue('dateOfBirth', dateOfBirth)
      if (dateOfDeath) form.setValue('dateOfDeath', dateOfDeath)

      // Store notable works and open dialog if there are any
      if (notableWorks.length > 0) {
        setAvailableNotableWorks(notableWorks)
        setIsNotableWorksDialogOpen(true)
      }

      if (imageUrl) {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const filename = `${name.replace(/\s+/g, '_')}.jpg`
        const file = new File([blob], filename, { type: blob.type })

        // Automatically download the image
        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(downloadUrl)

        onDropFile(file)

        toast.success('Bio, description, dates and image updated from Wikipedia and Wikidata')
      } else {
        toast.success('Bio, description and dates updated from Wikipedia and Wikidata')
      }
    } catch (error) {
      console.error('Data fetch error:', error)
      setWikipediaError(error instanceof Error ? error.message : 'Failed to fetch data')
      toast.error(error instanceof Error ? error.message : 'Failed to fetch data')
    } finally {
      setIsWikipediaLoading(false)
    }
  }

  const handleNotableWorksSave = (selectedWorks: string[]) => {
    form.setValue('notableWork', selectedWorks.join(', '))
  }

  async function onSubmit(data: z.infer<typeof characterSchema>) {
    try {
      let imageUrl: { data: string | null; error: StorageError | null } = { data: null, error: null }

      if (avatarFile) {
        imageUrl = await uploadImage({ image: avatarFile, id: data.name })

        if (imageUrl.error) {
          toast.error('Failed to upload image. Please try again.')
          return
        }
      }

      const characterId = await addCharacter({ ...data, imageUrl: EMPTY_STRING })

      if (imageUrl.data) {
        await updateCharacterImage(characterId, imageUrl.data)
      }

      toast.success('Historical figure added successfully!')
      form.reset()
      // Clean up any object URLs to prevent memory leaks
      if (avatarSrc) {
        URL.revokeObjectURL(avatarSrc as string)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to add historical figure. Please try again.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-6">
        <div className="flex max-sm:flex-col items-center gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex items-center gap-2">
                  <FormLabel>Name</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter the exact name as it appears on Wikipedia for auto-fill</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <FormControl>
                    <Input disabled={isSubmitting || isWikipediaLoading} placeholder="Albert Einstein" className="pr-9" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    disabled={isSubmitting || isWikipediaLoading || !field.value}
                    onClick={() => fetchWikipediaData(field.value)}
                  >
                    <Sparkles className={cn('h-4 w-4', isWikipediaLoading && 'animate-spin')} />
                  </Button>
                </div>
                <FormDescription>
                  {isWikipediaLoading ? 'Fetching Wikipedia data...' : wikipediaError ? <span className="text-destructive">{wikipediaError}</span> : 'Full name of the historical figure'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger className="w-full capitalize">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="capitalize">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The primary category this figure belongs to</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Dropzone {...dropzone}>
          <div>
            <div className="flex justify-between">
              <DropzoneMessage />
            </div>

            <DropZoneArea className="w-full p-0 h-[150px]">
              <DropzoneTrigger onDrop={() => {}} className={cn('flex flex-col items-center justify-center w-full h-full bg-transparent text-sm p-0', isSubmitting && 'opacity-50 cursor-not-allowed')}>
                <div className="relative w-full h-full">
                  {avatarSrc ? (
                    <Image src={avatarSrc} width={300} height={300} alt="Uploaded avatar" className={cn('w-full h-full object-cover rounded-md', isPending && 'animate-pulse')} priority />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-md">
                      <p className="font-semibold">Upload a new avatar</p>
                      <p className="text-xs text-muted-foreground">Please select an image smaller than 10MB</p>
                    </div>
                  )}
                </div>
              </DropzoneTrigger>
            </DropZoneArea>
          </div>
        </Dropzone>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea disabled={isSubmitting} placeholder="Brief description of the historical figure" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>A brief description (max 200 characters)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <div className="relative">
                <FormControl>
                  <Textarea
                    disabled={isSubmitting || isWikipediaLoading}
                    placeholder={isWikipediaLoading ? 'Fetching from Wikipedia...' : 'Brief bio of the historical figure'}
                    className={cn('resize-none pr-8 max-h-[250px] overflow-y-auto whitespace-pre-wrap', isWikipediaLoading && 'animate-pulse')}
                    {...field}
                  />
                </FormControl>
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    if (!field.value) return
                    // Format the text: remove === sections, excessive newlines, and citation templates
                    const formattedText = field.value
                      .replace(/\\n/g, '\n')
                      // Replace multiple newlines with two for proper paragraph separation
                      .replace(/\n{2,}/g, '\n\n')
                      // Trim and fix quotes (optional)
                      .replace(/\\"/g, '"') // Fix escaped quotes
                      .replace(/([.?!])\s+/g, '$1 ') // Fix spacing after punctuation
                      .trim()

                    console.log('formattedText:', formattedText)
                    field.onChange(formattedText)
                    toast.success('Bio text formatted')
                  }}
                  className={cn('absolute top-2 size-7 right-6', (isSubmitting || isWikipediaLoading) && 'opacity-50 cursor-not-allowed')}
                  disabled={isSubmitting || isWikipediaLoading}
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
              <FormDescription>A brief bio (max 2000 characters)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button disabled={isSubmitting} variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date('1900-01-01')} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfDeath"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of death</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button disabled={isSubmitting} variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < form.getValues().dateOfBirth} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notableWork"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notable Work</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} placeholder="Theory of Relativity" {...field} />
              </FormControl>
              <FormDescription>The figure&apos;s most significant contribution or work</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <NotableWorksDialog isOpen={isNotableWorksDialogOpen} onClose={() => setIsNotableWorksDialogOpen(false)} notableWorks={availableNotableWorks} onSave={handleNotableWorksSave} />

        <Button disabled={isSubmitting} type="submit" className="w-full">
          {isSubmitting ? 'Adding...' : 'Add Historical Figure'}
        </Button>
      </form>
    </Form>
  )
}
