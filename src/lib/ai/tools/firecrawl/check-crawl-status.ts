import { tool } from 'ai'
import { z } from 'zod'
import { getClient } from './client'

export const firecrawlCheckCrawlStatus = tool({
  description: `Check the status of a crawl job.

Returns: Status and progress of the crawl job, including results if available.`,
  inputSchema: z.object({
    id: z.string().describe('The crawl job ID to check'),
  }),
  execute: async (args) => {
    const client = getClient()
    
    try {
      const res = await client.getCrawlStatus((args as { id: string }).id)
      return res
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  },
})

