import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangleIcon, LoaderIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { fetchThemeFromUrl, type ThemePreset } from '@/lib/theme-utils'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

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
  const queryClient = useQueryClient()

  const form = useForm<ThemeImportForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  })

  // Mutation for fetching and applying user-provided theme URLs
  const fetchAndApplyThemeMutation = useMutation({
    mutationFn: async (url: string) => {
      new URL(url)
      const fetchedTheme = await fetchThemeFromUrl(url)

      if (fetchedTheme.error) {
        throw new Error(fetchedTheme.error)
      }

      return fetchedTheme
    },
    onSuccess: (fetchedTheme) => {
      onThemeImported(fetchedTheme.preset, fetchedTheme.url)
      form.reset() // Clear form on success
      onOpenChange(false) // Close modal

      // Optionally cache the successfully fetched theme
      queryClient.setQueryData(
        ['theme', 'custom', fetchedTheme.url],
        fetchedTheme
      )
    },
  })

  const onSubmit = (data: ThemeImportForm) => {
    if (data.url.trim()) {
      fetchAndApplyThemeMutation.mutate(data.url.trim())
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
                      disabled={fetchAndApplyThemeMutation.isPending}
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fetchAndApplyThemeMutation.error && (
              <div className='flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3'>
                <AlertTriangleIcon className='mt-0.5 size-4 shrink-0 text-destructive' />
                <p className='text-destructive text-sm leading-relaxed'>
                  {fetchAndApplyThemeMutation.error.message}
                </p>
              </div>
            )}

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={fetchAndApplyThemeMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={fetchAndApplyThemeMutation.isPending}
              >
                {fetchAndApplyThemeMutation.isPending ? (
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
