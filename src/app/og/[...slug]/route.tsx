import { readFileSync } from 'node:fs'
import { notFound } from 'next/navigation'
import { generateOGImage } from '@/app/og/[...slug]/generate'
import { source } from '@/lib/source'

const font = readFileSync('./src/app/og/[...slug]/fonts/Inter-Regular.ttf')
const fontSemiBold = readFileSync(
  './src/app/og/[...slug]/fonts/Inter-SemiBold.ttf'
)
const fontBold = readFileSync('./src/app/og/[...slug]/fonts/Inter-Bold.ttf')

export async function GET(
  _req: Request,
  { params }: RouteContext<'/og/[...slug]'>
) {
  const slug = (await params).slug
  const page = source.getPage(slug.slice(0, -1) ?? [])
  if (!page) notFound()

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    tag: page.slugs[0] ?? '',
    fonts: [
      {
        name: 'Inter',
        data: font,
        weight: 400,
      },
      {
        name: 'Inter',
        data: fontSemiBold,
        weight: 600,
      },
      {
        name: 'Inter',
        data: fontBold,
        weight: 700,
      },
    ],
  })
}

export function generateStaticParams(): {
  slug: string[]
}[] {
  return source.generateParams().map((page) => ({
    ...page,
    slug: [...page.slug, 'image.webp'],
  }))
}
