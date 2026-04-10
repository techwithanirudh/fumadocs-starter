import { tool, type UIMessageStreamWriter } from 'ai'
import { Document, type DocumentData } from 'flexsearch'
import { z } from 'zod'
import { source } from '@/lib/source'

interface DocEntry extends DocumentData {
  content: string
  description: string
  title: string
  url: string
}

type FlexResult = Array<{ id: string; doc: DocEntry }>

const CONTENT_LIMIT = 2000

async function buildIndex() {
  const index = new Document<DocEntry>({
    document: {
      id: 'url',
      index: ['title', 'description', 'content'],
      store: true,
    },
  })

  const pages = source.getPages().filter((p) => p.data.type !== 'openapi')

  // load in chunks to avoid overwhelming the server
  for (let i = 0; i < pages.length; i += 50) {
    await Promise.all(
      pages.slice(i, i + 50).map(async (page) => {
        index.add({
          url: page.url,
          title: page.data.title ?? '',
          description: page.data.description ?? '',
          content: await (
            page.data as { getText: (mode: string) => Promise<string> }
          ).getText('processed'),
        })
      })
    )
  }

  return index
}

const searchIndex = buildIndex()

export const createSearchDocsTool = (writer: UIMessageStreamWriter) =>
  tool({
    description: 'Search the documentation content and return relevant pages.',
    inputSchema: z.object({
      query: z.string().describe('The query to search for.'),
      limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .default(10)
        .describe('Maximum number of results (default: 10, max: 50).'),
    }),
    execute: async ({ query, limit }) => {
      const index = await searchIndex
      const raw = (await index.searchAsync(query, {
        limit,
        merge: true,
        enrich: true,
      })) as unknown as FlexResult

      const seen = new Set<string>()
      const results = raw.filter(({ id }) => !seen.has(id) && seen.add(id))

      if (results.length === 0) {
        return `No documentation found for query "${query}".`
      }

      results.forEach(({ id, doc }, index) => {
        writer.write({
          type: 'source-url',
          sourceId: `search-doc-${index}-${id}`,
          url: id,
          title: doc.title,
        })
      })

      return results
        .map(({ doc }) => {
          const content =
            doc.content.length > CONTENT_LIMIT
              ? `${doc.content.slice(0, CONTENT_LIMIT)}...`
              : doc.content
          return `**${doc.title}**\nURL: ${doc.url}\n${doc.description}\n\n${content}\n\n---`
        })
        .join('\n')
    },
  })
