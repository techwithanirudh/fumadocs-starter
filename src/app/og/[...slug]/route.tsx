import { ImageResponse } from '@takumi-rs/image-response'
import { notFound } from 'next/navigation'
import { source } from '@/lib/source'
import { getImageResponseOptions, generate as MetadataImage } from './generate'

export const revalidate = false

export async function GET(
  _req: Request,
  { params }: RouteContext<'/og/[...slug]'>
) {
  const { slug } = await params
  const page = source.getPage(slug.slice(0, -1))
  if (!page) notFound()

  return new ImageResponse(
    <MetadataImage
      title={page.data.title}
      description={page.data.description}
      tag={page.slugs[0] ?? ''}
    />,
    await getImageResponseOptions()
  )
}

export function generateStaticParams(): {
  slug: string[]
}[] {
  return source.generateParams().map((page) => ({
    ...page,
    slug: [...page.slug, 'image.webp'],
  }))
}
