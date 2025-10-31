import { Globe } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type WebSearchInput = {
  query: string
}

export type WebSearchOutput = {
  action?: {
    type: string
    query: string
  }
  sources?: Array<{
    type: string
    url: string
  }>
}

type ToolState = 'input-streaming' | 'input-available' | 'output-available' | 'output-error'

export function WebSearchVisualizer({
  state,
  input,
  output,
  ...props
}: {
  state?: ToolState
  input?: Partial<WebSearchInput>
  output?: WebSearchOutput
} & ComponentProps<'div'>) {
  const isSkeleton = state === 'input-streaming' || state === 'input-available'

  if (isSkeleton) {
    return (
      <div {...props} className={cn('rounded-lg border bg-fd-card p-3', props.className)}>
        <div className='mb-2 flex items-center gap-2'>
          <Globe className='size-4 text-fd-muted-foreground' />
          <span className='font-medium text-sm text-fd-card-foreground'>Web Search</span>
        </div>
        <div className='space-y-2'>
          <div className='h-4 w-32 animate-pulse rounded bg-fd-muted' />
          <div className='space-y-1.5'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-10 animate-pulse rounded border bg-fd-muted' />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!input) return null

  return (
    <div {...props} className={cn('rounded-lg border bg-fd-card p-3', props.className)}>
      <div className='mb-2 flex items-center gap-2'>
        <Globe className='size-4 text-fd-muted-foreground' />
        <span className='font-medium text-sm text-fd-card-foreground'>Web Search</span>
      </div>
      <div className='mb-3 space-y-1'>
        {input.query && (
          <div className='text-xs text-fd-muted-foreground'>
            <span className='font-medium'>Query:</span> {input.query}
          </div>
        )}
      </div>
      {output?.sources && output.sources.length > 0 && (
        <div className='space-y-2'>
          <div className='text-xs font-medium text-fd-muted-foreground'>
            Found {output.sources.length} source{output.sources.length !== 1 ? 's' : ''}
          </div>
          <div className='space-y-1.5 max-h-48 overflow-y-auto'>
            {output.sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target='_blank'
                rel='noopener noreferrer'
                className='block rounded border p-2 text-xs hover:bg-fd-accent transition-colors break-all'
              >
                <div className='text-fd-muted-foreground truncate'>{source.url}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

