import { createSearchAPI } from 'fumadocs-core/search/server'
import { source } from '@/lib/source'

export const { GET } = createSearchAPI('advanced', {
  indexes: await Promise.all(
    source.getPages().map(async (page) => {
      const { structuredData } = await page.data.load()

      return {
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        id: page.url,
        structuredData,
      }
    })
  ),
})
