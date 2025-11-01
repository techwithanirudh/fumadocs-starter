import type { ComponentProps } from 'react'
import type { Document } from '@mendable/firecrawl-js'
import { cn } from '@/lib/cn'
import { Skeleton } from '@/components/ui/skeleton'

type ScrapeInput = {
  url: string
  formats?: string[]
  maxAge?: number
  onlyMainContent?: boolean
}

export type ScrapeOutput =
  | (Document & { success?: boolean })
  | { error?: string }

type ToolState =
  | 'input-streaming'
  | 'input-available'
  | 'output-available'
  | 'output-error'

export function ScrapeVisualizer({
  state,
  input,
  output,
  ...props
}: {
  state?: ToolState
  input?: Partial<ScrapeInput>
  output?: ScrapeOutput
} & ComponentProps<'div'>) {
  const isSkeleton = state === 'input-streaming' || state === 'input-available'

  if (isSkeleton) {
    return (
      <div
        {...props}
        className={cn('rounded-xl bg-fd-card p-3', props.className)}
      >
        <div className='space-y-2'>
          <Skeleton className='h-4 w-32' />
          <div className='rounded border bg-fd-muted/50 p-2'>
            <div className='space-y-2'>
              <Skeleton className='h-3 w-full' />
              <Skeleton className='h-3 w-5/6' />
              <Skeleton className='h-3 w-4/6' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!input) return null

  return (
    <div
      {...props}
      className={cn('rounded-xl bg-fd-card p-3', props.className)}
    >
      <div className='mb-3 space-y-1'>
        {input.url && (
          <div className='text-xs text-fd-muted-foreground'>
            <span className='font-medium'>URL:</span>{' '}
            <a
              href={input.url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-fd-primary hover:underline break-all'
            >
              {input.url}
            </a>
          </div>
        )}
        {input.formats && input.formats.length > 0 && (
          <div className='text-xs text-fd-muted-foreground'>
            <span className='font-medium'>Formats:</span>{' '}
            {input.formats.join(', ')}
          </div>
        )}
        {input.maxAge && (
          <div className='text-xs text-fd-muted-foreground'>
            <span className='font-medium'>Cache:</span> {input.maxAge}ms
          </div>
        )}
      </div>
      {output && 'error' in output && output.error && (
        <div className='text-xs text-fd-destructive'>{output.error}</div>
      )}
      {output &&
        !('error' in output && output.error) &&
        'markdown' in output && (
          <div className='space-y-2'>
            {output.metadata?.title && (
              <div className='text-xs font-medium text-fd-card-foreground'>
                {output.metadata.title}
              </div>
            )}
            {output.metadata?.description && (
              <div className='text-xs text-fd-muted-foreground line-clamp-2'>
                {output.metadata.description}
              </div>
            )}
            {output.metadata?.url && output.metadata.url !== input.url && (
              <div className='text-xs text-fd-muted-foreground'>
                <span className='font-medium'>Source:</span>{' '}
                <a
                  href={output.metadata.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-fd-primary hover:underline break-all'
                >
                  {output.metadata.url}
                </a>
              </div>
            )}
            {output.markdown && (
              <div className='rounded border bg-fd-muted/50 p-2 max-h-48 overflow-y-auto'>
                <pre className='whitespace-pre-wrap text-xs text-fd-muted-foreground line-clamp-10'>
                  {output.markdown}
                </pre>
              </div>
            )}
            {output.summary && (
              <div className='rounded border bg-fd-muted/50 p-2'>
                <div className='text-xs font-medium text-fd-muted-foreground mb-1'>
                  Summary
                </div>
                <div className='text-xs text-fd-muted-foreground'>
                  {output.summary}
                </div>
              </div>
            )}
            {output.links &&
              Array.isArray(output.links) &&
              output.links.length > 0 && (
                <div className='space-y-1'>
                  <div className='text-xs font-medium text-fd-muted-foreground'>
                    Found {output.links.length} link
                    {output.links.length !== 1 ? 's' : ''}
                  </div>
                  <div className='space-y-1 max-h-32 overflow-y-auto'>
                    {output.links.slice(0, 5).map((link: string, i: number) => (
                      <a
                        key={i}
                        href={link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='block rounded border p-2 text-xs hover:bg-fd-accent transition-colors break-all'
                      >
                        <div className='text-fd-primary hover:underline'>
                          {link}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            {output.screenshot && (
              <div className='rounded border bg-fd-muted/50 p-2'>
                <div className='text-xs text-fd-muted-foreground'>
                  Screenshot available
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  )
}
