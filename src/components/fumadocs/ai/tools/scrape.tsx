import type { Document } from '@mendable/firecrawl-js'
import type { ComponentProps } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/cn'

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
          <div className='text-fd-muted-foreground text-xs'>
            <span className='font-medium'>URL:</span>{' '}
            <a
              href={input.url}
              target='_blank'
              rel='noopener noreferrer'
              className='break-all text-fd-primary hover:underline'
            >
              {input.url}
            </a>
          </div>
        )}
        {input.formats && input.formats.length > 0 && (
          <div className='text-fd-muted-foreground text-xs'>
            <span className='font-medium'>Formats:</span>{' '}
            {input.formats.join(', ')}
          </div>
        )}
        {input.maxAge && (
          <div className='text-fd-muted-foreground text-xs'>
            <span className='font-medium'>Cache:</span> {input.maxAge}ms
          </div>
        )}
      </div>
      {output && 'error' in output && output.error && (
        <div className='text-fd-destructive text-xs'>{output.error}</div>
      )}
      {output &&
        !('error' in output && output.error) &&
        'markdown' in output && (
          <div className='space-y-2'>
            {output.metadata?.title && (
              <div className='font-medium text-fd-card-foreground text-xs'>
                {output.metadata.title}
              </div>
            )}
            {output.metadata?.description && (
              <div className='line-clamp-2 text-fd-muted-foreground text-xs'>
                {output.metadata.description}
              </div>
            )}
            {output.metadata?.url && output.metadata.url !== input.url && (
              <div className='text-fd-muted-foreground text-xs'>
                <span className='font-medium'>Source:</span>{' '}
                <a
                  href={output.metadata.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='break-all text-fd-primary hover:underline'
                >
                  {output.metadata.url}
                </a>
              </div>
            )}
            {output.markdown && (
              <div className='max-h-48 overflow-y-auto rounded border bg-fd-muted/50 p-2'>
                <pre className='line-clamp-10 whitespace-pre-wrap text-fd-muted-foreground text-xs'>
                  {output.markdown}
                </pre>
              </div>
            )}
            {output.summary && (
              <div className='rounded border bg-fd-muted/50 p-2'>
                <div className='mb-1 font-medium text-fd-muted-foreground text-xs'>
                  Summary
                </div>
                <div className='text-fd-muted-foreground text-xs'>
                  {output.summary}
                </div>
              </div>
            )}
            {output.links &&
              Array.isArray(output.links) &&
              output.links.length > 0 && (
                <div className='space-y-1'>
                  <div className='font-medium text-fd-muted-foreground text-xs'>
                    Found {output.links.length} link
                    {output.links.length !== 1 ? 's' : ''}
                  </div>
                  <div className='max-h-32 space-y-1 overflow-y-auto'>
                    {output.links.slice(0, 5).map((link: string, i: number) => (
                      <a
                        key={i}
                        href={link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='block break-all rounded border p-2 text-xs transition-colors hover:bg-fd-accent'
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
                <div className='text-fd-muted-foreground text-xs'>
                  Screenshot available
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  )
}
