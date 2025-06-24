/** biome-ignore-all lint/nursery/noNestedComponentDefinitions: new Components aren't defined, we're just passing props */
import * as path from 'node:path';
import Link from 'fumadocs-core/link';
import { getPageTreePeers } from 'fumadocs-core/server';
import { APIPage } from 'fumadocs-openapi/ui';
import * as Twoslash from 'fumadocs-twoslash/ui';
import { createGenerator } from 'fumadocs-typescript';
import { AutoTypeTable } from 'fumadocs-typescript/ui';
import { Banner } from 'fumadocs-ui/components/banner';
import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import {
  PageArticle,
  PageBreadcrumb,
  PageFooter,
  PageLastUpdate,
  PageRoot,
  PageTOC,
  PageTOCItems,
  PageTOCPopover,
  PageTOCPopoverContent,
  PageTOCPopoverItems,
  PageTOCPopoverTrigger,
  PageTOCTitle,
} from 'fumadocs-ui/layouts/docs/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ComponentProps, FC, ReactElement } from 'react';
import { Mermaid } from '@/components/mdx/mermaid';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { owner, repo } from '@/lib/github';
import { createMetadata } from '@/lib/metadata';
import { openapi, source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import { LLMCopyButton, ViewOptions } from './page.client';

const generator = createGenerator();

export const revalidate = false;

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<ReactElement> {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const { body: Mdx, toc, lastModified } = await page.data.load();

  return (
    <PageRoot
      toc={{
        toc,
        single: false,
      }}
    >
      {toc.length > 0 && (
        <PageTOCPopover>
          <PageTOCPopoverTrigger />
          <PageTOCPopoverContent>
            <PageTOCPopoverItems />
          </PageTOCPopoverContent>
        </PageTOCPopover>
      )}
      <PageArticle className='max-md:pb-16'>
        <PageBreadcrumb />
        <h1 className='font-semibold text-3xl'>{page.data.title}</h1>
        <p className='text-fd-muted-foreground text-lg'>
          {page.data.description}
        </p>
        <div className='flex flex-row items-center gap-2 border-b pb-6'>
          <LLMCopyButton slug={params.slug} />
          <ViewOptions
            markdownUrl={`${page.url}.mdx`}
            githubUrl={`https://github.com/${owner}/${repo}/blob/main/${page.path}`}
          />
        </div>
        <div className='prose flex-1 text-fd-foreground/80'>
          <Mdx
            components={getMDXComponents({
              ...Twoslash,
              a: ({ href, ...props }) => {
                const found = source.getPageByHref(href ?? '', {
                  dir: path.dirname(page.path),
                });

                if (!found) return <Link href={href} {...props} />;

                return (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Link
                        href={
                          found.hash
                            ? `${found.page.url}#${found.hash}`
                            : found.page.url
                        }
                        {...props}
                      />
                    </HoverCardTrigger>
                    <HoverCardContent className='text-sm'>
                      <p className='font-medium'>{found.page.data.title}</p>
                      <p className='text-fd-muted-foreground'>
                        {found.page.data.description}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                );
              },
              Banner,
              Mermaid,
              TypeTable,
              AutoTypeTable: (props) => (
                <AutoTypeTable generator={generator} {...props} />
              ),
              blockquote: Callout as unknown as FC<
                ComponentProps<'blockquote'>
              >,
              APIPage: (props) => (
                <APIPage {...openapi.getAPIPageProps(props)} />
              ),
              DocsCategory: ({ url }) => <DocsCategory url={url ?? page.url} />,
            })}
          />
          {page.data.index ? <DocsCategory url={page.url} /> : null}
        </div>
        {lastModified && <PageLastUpdate date={lastModified} />}
        <PageFooter />
      </PageArticle>
      {toc.length > 0 && (
        <PageTOC>
          <PageTOCTitle />
          <PageTOCItems variant='clerk' />
        </PageTOC>
      )}
    </PageRoot>
  );
}

function DocsCategory({ url }: { url: string }) {
  return (
    <Cards>
      {getPageTreePeers(source.pageTree, url).map((peer) => (
        <Card key={peer.url} title={peer.name} href={peer.url}>
          {peer.description}
        </Card>
      ))}
    </Cards>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await props.params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const description =
    page.data.description ?? 'The library for building documentation sites';

  const image = {
    url: ['/og', ...slug, 'image.png'].join('/'),
    width: 1200,
    height: 630,
  };

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
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
