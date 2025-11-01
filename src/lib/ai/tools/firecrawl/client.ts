import FirecrawlApp from '@mendable/firecrawl-js'
import { env } from '@/env'

const ORIGIN = 'fumadocs-starter'

function createClient(): FirecrawlApp | null {
  if (!env.FIRECRAWL_API_KEY) {
    return null
  }

  const config: { apiKey: string; apiUrl?: string } = {
    apiKey: env.FIRECRAWL_API_KEY,
  }

  if (process.env.FIRECRAWL_API_URL) {
    config.apiUrl = process.env.FIRECRAWL_API_URL
  }

  return new FirecrawlApp(config)
}

function getClient(): FirecrawlApp {
  const client = createClient()
  if (!client) {
    throw new Error('Firecrawl API key is not configured.')
  }
  return client
}

function removeEmptyTopLevel<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  const out: Partial<T> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v == null) continue
    if (typeof v === 'string' && v.trim() === '') continue
    if (Array.isArray(v) && v.length === 0) continue
    if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0)
      continue
    // @ts-expect-error dynamic assignment
    out[k] = v
  }
  return out
}

export { getClient, removeEmptyTopLevel, ORIGIN }

