import type {
  Document,
  SearchData,
  SearchResultImages,
  SearchResultNews,
  SearchResultWeb,
} from '@mendable/firecrawl-js'
import type { ComponentProps } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/cn'

type SearchInput = {
  query: string
  limit?: number
  sources?: Array<{ type: 'web' | 'images' | 'news' }>
  scrapeOptions?: Record<string, unknown>
}

export type SearchOutput = SearchData | { error?: string }

type ToolState =
  | 'input-streaming'
  | 'input-available'
  | 'output-available'
  | 'output-error'

export function SearchVisualizer({
  state,
  input,
  output,
  ...props
}: {
  state?: ToolState
  input?: Partial<SearchInput>
  output?: SearchOutput
} & ComponentProps<'div'>) {
  const isSkeleton = state === 'input-streaming' || state === 'input-available'

  if (isSkeleton) {
    return (
      <div
        {...props}
        className={cn('rounded-xl bg-fd-card p-3', props.className)}
      >
        <div className='space-y-2'>
          <Skeleton className='h-4 w-24' />
          <div className='space-y-2'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='rounded border p-2'>
                <Skeleton className='mb-1 h-4 w-3/4' />
                <Skeleton className='h-3 w-full' />
              </div>
            ))}
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
        {input.query && (
          <div className='text-fd-muted-foreground text-xs'>
            <span className='font-medium'>Query:</span> {input.query}
          </div>
        )}
        {input.limit && (
          <div className='text-fd-muted-foreground text-xs'>
            <span className='font-medium'>Limit:</span> {input.limit}
          </div>
        )}
        {input.sources && input.sources.length > 0 && (
          <div className='text-fd-muted-foreground text-xs'>
            <span className='font-medium'>Sources:</span>{' '}
            {input.sources.map((s) => s.type).join(', ')}
          </div>
        )}
      </div>
      {(() => {
        if (!output) return null

        if ('error' in output && output.error) {
          return (
            <div className='text-fd-destructive text-xs'>{output.error}</div>
          )
        }

        const searchData = output as SearchData
        const allResults: Array<{
          url: string
          title?: string
          description?: string
          markdown?: string
        }> = []

        if (searchData.web && Array.isArray(searchData.web)) {
          allResults.push(
            ...searchData.web.map((item: SearchResultWeb | Document) => {
              if (
                'url' in item &&
                typeof item.url === 'string' &&
                'title' in item
              ) {
                // SearchResultWeb
                return {
                  url: (item as SearchResultWeb).url,
                  title: (item as SearchResultWeb).title,
                  description: (item as SearchResultWeb).description,
                  markdown: undefined,
                }
              }
              // Document
              const doc = item as Document
              return {
                url: doc.metadata?.url || '',
                title: doc.metadata?.title,
                description: doc.metadata?.description,
                markdown: doc.markdown,
              }
            })
          )
        }
        if (searchData.images && Array.isArray(searchData.images)) {
          allResults.push(
            ...searchData.images.map((item: SearchResultImages | Document) => {
              if (
                ('imageUrl' in item || 'url' in item) &&
                !('metadata' in item)
              ) {
                // SearchResultImages
                return {
                  url:
                    (item as SearchResultImages).url ||
                    (item as SearchResultImages).imageUrl ||
                    '',
                  title: (item as SearchResultImages).title,
                  description: undefined,
                  markdown: undefined,
                }
              }
              // Document
              const doc = item as Document
              return {
                url: doc.metadata?.url || '',
                title: doc.metadata?.title,
                description: doc.metadata?.description,
                markdown: doc.markdown,
              }
            })
          )
        }
        if (searchData.news && Array.isArray(searchData.news)) {
          allResults.push(
            ...searchData.news.map((item: SearchResultNews | Document) => {
              if (
                'url' in item &&
                typeof item.url === 'string' &&
                'title' in item &&
                !('metadata' in item)
              ) {
                // SearchResultNews
                return {
                  url: (item as SearchResultNews).url || '',
                  title: (item as SearchResultNews).title,
                  description: (item as SearchResultNews).snippet,
                  markdown: undefined,
                }
              }
              // Document
              const doc = item as Document
              return {
                url: doc.metadata?.url || '',
                title: doc.metadata?.title,
                description: doc.metadata?.description,
                markdown: doc.markdown,
              }
            })
          )
        }

        const validResults = allResults.filter(
          (result) => result.url && result.url.trim() !== ''
        )

        if (validResults.length === 0) {
          return null
        }

        return (
          <div className='space-y-2'>
            <div className='font-medium text-fd-muted-foreground text-xs'>
              Found {validResults.length} result
              {validResults.length !== 1 ? 's' : ''}
            </div>
            <div className='max-h-64 space-y-2 overflow-y-auto'>
              {validResults.slice(0, 5).map((result, i) => (
                <a
                  key={i}
                  href={result.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='block rounded border p-2 text-xs transition-colors hover:bg-fd-accent'
                >
                  <div className='font-medium text-fd-card-foreground'>
                    {result.title || result.url}
                  </div>
                  {result.description && (
                    <div className='mt-1 line-clamp-2 text-fd-muted-foreground'>
                      {result.description}
                    </div>
                  )}
                  {result.markdown && (
                    <div className='mt-1 rounded bg-fd-muted/50 p-2'>
                      <pre className='line-clamp-3 whitespace-pre-wrap text-fd-muted-foreground text-xs'>
                        {result.markdown}
                      </pre>
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
