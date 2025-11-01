import { tool } from 'ai'
import { z } from 'zod'
import { getClient, removeEmptyTopLevel, ORIGIN } from './client'

export const firecrawlExtract = tool({
  description: `Extract structured information from web pages using LLM capabilities. Supports both cloud AI and self-hosted LLM extraction.

Best for: Extracting specific structured data like prices, names, details from web pages.
Not recommended for: When you need the full content of a page (use scrape); when you're not looking for specific structured data.
Returns: Extracted structured data as defined by your schema.`,
  inputSchema: z.object({
    urls: z.array(z.string().url()).describe('Array of URLs to extract information from'),
    prompt: z.string().optional().describe('Custom prompt for the LLM extraction'),
    schema: z.record(z.string(), z.any()).optional().describe('JSON schema for structured data extraction'),
    allowExternalLinks: z.boolean().optional(),
    enableWebSearch: z.boolean().optional(),
    includeSubdomains: z.boolean().optional(),
  }),
  execute: async (args) => {
    const client = getClient()
    const a = args as Record<string, unknown>

    try {
      const extractBody = removeEmptyTopLevel({
        urls: a.urls as string[],
        prompt: a.prompt as string | undefined,
        schema: (a.schema as Record<string, unknown>) || undefined,
        allowExternalLinks: a.allowExternalLinks as boolean | undefined,
        enableWebSearch: a.enableWebSearch as boolean | undefined,
        includeSubdomains: a.includeSubdomains as boolean | undefined,
        origin: ORIGIN,
      })

      const res = await client.extract(extractBody as any)
      return res
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  },
})

