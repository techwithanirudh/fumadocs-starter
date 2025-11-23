import { Feed } from 'feed'
import { title } from '@/lib/layout.shared'
import { baseUrl } from '@/lib/metadata'
import { source } from '@/lib/source'

export async function getRSS() {
  const feed = new Feed({
    title: `${title}`,
    id: new URL('/rss.xml', baseUrl).toString(),
    link: new URL('/rss.xml', baseUrl).toString(),
    language: 'en',
    image: new URL('/banner.png', baseUrl).toString(),
    favicon: new URL('/icon.png', baseUrl).toString(),
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
      link: new URL(page.url, baseUrl).toString(),
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
