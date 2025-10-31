import Link from 'fumadocs-core/link'
import { Search } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type SearchDocsInput = {
  query: string
  tag?: string
  locale?: string
}

export type SearchDocsOutput = {
  success: boolean
  data?: Array<{
    id: string
    url: string
    title?: string
    description?: string
    content?: string
    contentWithHighlights?: Array<{
      type: string
      content: string
      styles?: { highlight?: boolean }
    }>
  }>
}

type ToolState = 'input-streaming' | 'input-available' | 'output-available' | 'output-error'

export function SearchDocsVisualizer({
  state,
  input,
  output,
  ...props
}: {
  state?: ToolState
  input?: Partial<SearchDocsInput>
  output?: SearchDocsOutput
} & ComponentProps<'div'>) {
  const isSkeleton = state === 'input-streaming' || state === 'input-available'

  if (isSkeleton) {
    return (
      <div {...props} className={cn('rounded-lg border bg-fd-card p-3', props.className)}>
        <div className='mb-2 flex items-center gap-2'>
          <Search className='size-4 text-fd-muted-foreground' />
          <span className='font-medium text-sm text-fd-card-foreground'>Search Docs</span>
        </div>
        <div className='space-y-2'>
          <div className='h-4 w-24 animate-pulse rounded bg-fd-muted' />
          <div className='space-y-2'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='rounded border p-2'>
                <div className='mb-1 h-4 w-3/4 animate-pulse rounded bg-fd-muted' />
                <div className='h-3 w-full animate-pulse rounded bg-fd-muted' />
              </div>
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
        <Search className='size-4 text-fd-muted-foreground' />
        <span className='font-medium text-sm text-fd-card-foreground'>Search Docs</span>
      </div>
      <div className='mb-3 space-y-1'>
        {input.query && (
          <div className='text-xs text-fd-muted-foreground'>
            <span className='font-medium'>Query:</span> {input.query}
          </div>
        )}
        {input.tag && (
          <div className='text-xs text-fd-muted-foreground'>
            <span className='font-medium'>Tag:</span> {input.tag}
          </div>
        )}
        {input.locale && (
          <div className='text-xs text-fd-muted-foreground'>
            <span className='font-medium'>Locale:</span> {input.locale}
          </div>
        )}
      </div>
      {output?.success && output.data && output.data.length > 0 && (
        <div className='space-y-2'>
          <div className='text-xs font-medium text-fd-muted-foreground'>
            Found {output.data.length} result{output.data.length !== 1 ? 's' : ''}
          </div>
          <div className='space-y-2 max-h-48 overflow-y-auto'>
            {output.data.slice(0, 5).map((result, i) => (
              <Link
                key={i}
                href={result.url}
                className='block rounded border p-2 text-xs hover:bg-fd-accent transition-colors'
              >
                <div className='font-medium text-fd-card-foreground'>{result.title || result.id}</div>
                {result.description && (
                  <div className='mt-1 text-fd-muted-foreground line-clamp-2'>{result.description}</div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
      {output?.success === false && (
        <div className='text-xs text-fd-destructive'>Search failed</div>
      )}
    </div>
  )
}

