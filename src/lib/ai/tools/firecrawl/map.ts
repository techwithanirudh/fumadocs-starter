import { tool } from 'ai'
import { z } from 'zod'
import { getClient, removeEmptyTopLevel, ORIGIN } from './client'

export const firecrawlMap = tool({
  description: `Map a website to discover all indexed URLs on the site.

Best for: Discovering URLs on a website before deciding what to scrape; finding specific sections of a website.
Not recommended for: When you already know which specific URL you need (use scrape or batch_scrape); when you need the content of the pages (use scrape after mapping).
Common mistakes: Using crawl to discover URLs instead of map.
Returns: Array of URLs found on the site.`,
  inputSchema: z.object({
    url: z.string().url().describe('The URL to map'),
    search: z.string().optional(),
    sitemap: z.enum(['include', 'skip', 'only']).optional(),
    includeSubdomains: z.boolean().optional(),
    limit: z.number().optional(),
    ignoreQueryParameters: z.boolean().optional(),
  }),
  execute: async (args) => {
    const client = getClient()
    const { url, ...options } = args as { url: string } & Record<string, unknown>
    const cleaned = removeEmptyTopLevel(options as Record<string, unknown>)

    try {
      const res = await client.map(url, {
        ...cleaned,
        origin: ORIGIN,
      } as any)

      return res
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  },
})

