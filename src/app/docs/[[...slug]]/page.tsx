import Link from 'fumadocs-core/link'
import { findSiblings } from 'fumadocs-core/page-tree'
import { PathUtils } from 'fumadocs-core/source'
import * as Twoslash from 'fumadocs-twoslash/ui'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { TypeTable } from 'fumadocs-ui/components/type-table'
import {
  DocsPage,
  MarkdownCopyButton,
  PageLastUpdate,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/notebook/page'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { owner, repo } from '@/lib/github'
import { createMetadata, getPageImage } from '@/lib/metadata'
import { source } from '@/lib/source'
import { getMDXComponents } from '@/mdx-components'

export const revalidate = false

export default async function Page(
  props: PageProps<'/docs/[[...slug]]'>
): Promise<ReactElement> {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) {
    return notFound()
  }

  const { body: Mdx, toc, lastModified } = await page.data.load()

  return (
    <DocsPage
      footer={{
        className: 'xl:pb-6',
      }}
      full={!!(page.data._openapi)}
      tableOfContent={{
        style: 'clerk',
      }}
      toc={toc}
    >
      <div className='relative flex @sm:flex-row flex-col items-start @sm:items-center gap-2'>
        <h1 className='break-all font-semibold text-[1.75em]'>
          {page.data.title}
        </h1>

        <div className='ml-auto @sm:flex flex hidden shrink-0 flex-row items-center justify-end gap-2'>
          <MarkdownCopyButton markdownUrl={`${page.url}.mdx`} />
          <ViewOptionsPopover
            githubUrl={`https://github.com/${owner}/${repo}/blob/main/content/docs/${page.path}`}
            markdownUrl={`${page.url}.mdx`}
          />
        </div>
      </div>
      <p className='mb-2 text-fd-muted-foreground text-lg'>
        {page.data.description}
      </p>
      <div className='flex @sm:hidden items-center gap-2 pb-6'>
        <MarkdownCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptionsPopover
          githubUrl={`https://github.com/${owner}/${repo}/blob/main/content/docs/${page.path}`}
          markdownUrl={`${page.url}.mdx`}
        />
      </div>
      <div className='prose flex-1 text-fd-foreground/90'>
        <Mdx
          components={getMDXComponents({
            ...Twoslash,
            a: ({ href, ...linkProps }) => {
              const found = source.getPageByHref(href ?? '', {
                dir: PathUtils.dirname(page.path),
              })

              if (!found) {
                return <Link href={href} {...linkProps} />
              }

              return (
                <HoverCard>
                  <HoverCardTrigger
                    href={
                      found.hash
                        ? `${found.page.url}#${found.hash}`
                        : found.page.url
                    }
                    {...linkProps}
                  >
                    {linkProps.children}
                  </HoverCardTrigger>
                  <HoverCardContent className='text-sm'>
                    <p className='font-medium'>{found.page.data.title}</p>
                    <p className='text-fd-muted-foreground'>
                      {found.page.data.description}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              )
            },
            TypeTable,
            // biome-ignore lint/correctness/noNestedComponentDefinitions: this is not a new component
            DocsCategory: ({ url }) => <DocsCategory url={url ?? page.url} />,
          })}
        />
        {page.data.index ? <DocsCategory url={page.url} /> : null}
      </div>
      {lastModified && <PageLastUpdate date={lastModified} />}
    </DocsPage>
  )
}

function DocsCategory({ url }: { url: string }) {
  return (
    <Cards>
      {findSiblings(source.getPageTree(), url).map((item) => {
        if (item.type === 'separator') {
          return null
        }

        const resolvedItem = item.type === 'folder' ? item.index : item
        if (!resolvedItem) {
          return null
        }

        return (
          <Card
            href={resolvedItem.url}
            key={resolvedItem.url}
            title={resolvedItem.name}
          >
            {resolvedItem.description}
          </Card>
        )
      })}
    </Cards>
  )
}

export async function generateMetadata(
  props: PageProps<'/docs/[[...slug]]'>
): Promise<Metadata> {
  const { slug = [] } = await props.params
  const page = source.getPage(slug)
  if (!page) {
    return createMetadata({
      title: 'Not Found',
    })
  }

  const description =
    page.data.description ?? 'The library for building documentation sites'

  const image = {
    url: getPageImage(page).url,
    width: 1200,
    height: 630,
  }

  return createMetadata({
    title: page.data.title,
    description,
    openGraph: {
      url: `/docs/${page.slugs.join('/')}`,
      images: [image],
    },
    twitter: {
      images: [image],
    },
  })
}

export function generateStaticParams() {
  return source.generateParams()
}
