import React from 'react'
import { type ThemePreset, fetchThemeFromUrl } from '@/lib/theme/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangleIcon, LoaderIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  url: z
    .string()
    .min(1, { message: 'Theme URL is required' })
    .url({ message: 'Please enter a valid URL' }),
})

type ThemeImportForm = z.infer<typeof formSchema>

interface ImportThemeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onThemeImported: (preset: ThemePreset, url: string) => void
}

export function ImportThemeDialog({
  open,
  onOpenChange,
  onThemeImported,
}: ImportThemeDialogProps) {
  // Local mutation-like state
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const form = useForm<ThemeImportForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  })

  // Mutation for fetching and applying user-provided theme URLs
  const fetchAndApplyTheme = async (url: string) => {
    try {
      setError(null)
      setIsPending(true)
      new URL(url)
      const fetchedTheme = await fetchThemeFromUrl(url)

      if (fetchedTheme.error) {
        throw new Error(fetchedTheme.error)
      }

      // success
      onThemeImported(fetchedTheme.preset, fetchedTheme.url)
      form.reset()
      onOpenChange(false)
      return fetchedTheme
    } catch (e: any) {
      setError(e instanceof Error ? e : new Error(String(e)))
      throw e
    } finally {
      setIsPending(false)
    }
  }

  const onSubmit = (data: ThemeImportForm) => {
    if (data.url.trim()) {
      fetchAndApplyTheme(data.url.trim()).catch(() => {
        // error state is set inside handler
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Import Theme</DialogTitle>
          <DialogDescription>
            Enter a theme URL from{' '}
            <a
              href='https://tweakcn.com'
              // biome-ignore lint/a11y/noBlankTarget: tweakcn.com is trusted
              target='_blank'
              rel='noopener'
              className='inline-flex items-baseline gap-1 text-primary underline'
            >
              tweakcn.com
            </a>{' '}
            to apply a custom theme.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='url'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='url'
                      placeholder='https://tweakcn.com/themes/themeId'
                      disabled={isPending}
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className='flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3'>
                <AlertTriangleIcon className='mt-0.5 size-4 shrink-0 text-destructive' />
                <p className='text-destructive text-sm leading-relaxed'>
                  {error.message}
                </p>
              </div>
            )}

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? (
                  <>
                    <LoaderIcon className='size-4 animate-spin' />
                    Importing...
                  </>
                ) : (
                  'Import Theme'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
