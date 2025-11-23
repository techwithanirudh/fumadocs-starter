import { Feed } from 'feed'
import { title } from '@/lib/layout.shared'
import { baseUrl } from '@/lib/metadata'
import { source } from '@/lib/source'

export async function getRSS() {
  const feed = new Feed({
    title: `${title}`,
    id: `${baseUrl}/rss.xml`,
    link: `${baseUrl}/rss.xml`,
    language: 'en',
    image: `${baseUrl}/banner.png`,
    favicon: `${baseUrl}/icon.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${title}`,
  })

  const pages = await Promise.all(
    source.getPages().map(async (page) => {
      const { lastModified } = await page.data.load()
      return {
        page,
        lastModified,
      }
    })
  )

  for (const { page, lastModified } of pages) {
    feed.addItem({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      link: `${baseUrl}${page.url}`,
      date: lastModified ? new Date(lastModified) : new Date(),
      author: [
        {
          name: title,
        },
      ],
    })
  }

  return feed.rss2()
}
