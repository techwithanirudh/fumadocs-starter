import { tool } from 'ai'
import { z } from 'zod'
import { getClient, removeEmptyTopLevel, ORIGIN } from './client'

const scrapeParamsSchema = z.object({
  formats: z
    .array(
      z.union([
        z.enum([
          'markdown',
          'html',
          'rawHtml',
          'screenshot',
          'links',
          'summary',
          'changeTracking',
        ]),
        z.object({
          type: z.literal('json'),
          prompt: z.string().optional(),
          schema: z.record(z.string(), z.any()).optional(),
        }),
        z.object({
          type: z.literal('screenshot'),
          fullPage: z.boolean().optional(),
          quality: z.number().optional(),
          viewport: z.object({ width: z.number(), height: z.number() }).optional(),
        }),
      ])
    )
    .optional(),
  parsers: z
    .array(
      z.union([
        z.enum(['pdf']),
        z.object({
          type: z.enum(['pdf']),
          maxPages: z.number().int().min(1).max(10000).optional(),
        }),
      ])
    )
    .optional(),
  onlyMainContent: z.boolean().optional(),
  includeTags: z.array(z.string()).optional(),
  excludeTags: z.array(z.string()).optional(),
  waitFor: z.number().optional(),
  mobile: z.boolean().optional(),
  skipTlsVerification: z.boolean().optional(),
  removeBase64Images: z.boolean().optional(),
  location: z
    .object({
      country: z.string().optional(),
      languages: z.array(z.string()).optional(),
    })
    .optional(),
  storeInCache: z.boolean().optional(),
  maxAge: z.number().optional(),
})

export const firecrawlCrawl = tool({
  description: `Starts a crawl job on a website and extracts content from all pages.

Best for: Extracting content from multiple related pages, when you need comprehensive coverage.
Not recommended for: Extracting content from a single page (use scrape); when token limits are a concern (use map + batch_scrape); when you need fast results (crawling can be slow).
Warning: Crawl responses can be very large and may exceed token limits. Limit the crawl depth and number of pages, or use map + batch_scrape for better control.
Common mistakes: Setting limit or maxDiscoveryDepth too high (causes token overflow) or too low (causes missing pages); using crawl for a single page (use scrape instead). Using a /* wildcard is not recommended.
Returns: Operation ID for status checking; use firecrawl_check_crawl_status to check progress.`,
  inputSchema: z.object({
    url: z.string().describe('The URL to crawl'),
    prompt: z.string().optional(),
    excludePaths: z.array(z.string()).optional(),
    includePaths: z.array(z.string()).optional(),
    maxDiscoveryDepth: z.number().optional(),
    sitemap: z.enum(['skip', 'include', 'only']).optional(),
    limit: z.number().optional(),
    allowExternalLinks: z.boolean().optional(),
    allowSubdomains: z.boolean().optional(),
    crawlEntireDomain: z.boolean().optional(),
    delay: z.number().optional(),
    maxConcurrency: z.number().optional(),
    deduplicateSimilarURLs: z.boolean().optional(),
    ignoreQueryParameters: z.boolean().optional(),
    scrapeOptions: scrapeParamsSchema.partial().optional(),
  }),
  execute: async (args) => {
    const client = getClient()
    const { url, ...options } = args as Record<string, unknown>
    const cleaned = removeEmptyTopLevel(options as Record<string, unknown>)

    try {
      const res = await client.crawl(url as string, {
        ...(cleaned as any),
        origin: ORIGIN,
      })

      return res
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  },
})

