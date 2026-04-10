import { createSearchAPI } from 'fumadocs-core/search/server'
import { source } from '@/lib/source'

export const { GET } = createSearchAPI('advanced', {
  language: 'english',
  indexes: async () => {
    const pages = source.getPages()

    const results = await Promise.all(
      pages.map(async (page) => {
        if (page.data.type === 'openapi') {
          return null
        }
        const { structuredData } = await page.data.load()

        return {
          title: page.data.title ?? '',
          description: page.data.description,
          url: page.url,
          id: page.url,
          structuredData: structuredData ?? undefined,
          tag: page.path.split('/')[0],
        }
      })
    )

    return results.filter((r) => r !== null)
  },
})
