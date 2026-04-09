import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import { Banner } from 'fumadocs-ui/components/banner'
import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import * as FilesComponents from 'fumadocs-ui/components/files'
import { GithubInfo } from 'fumadocs-ui/components/github-info'
import { ImageZoom } from 'fumadocs-ui/components/image-zoom'
import { InlineTOC } from 'fumadocs-ui/components/inline-toc'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import * as TabsComponents from 'fumadocs-ui/components/tabs'
import { TypeTable } from 'fumadocs-ui/components/type-table'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import * as icons from 'lucide-react'
import type { MDXComponents } from 'mdx/types'
import type { ComponentProps, FC } from 'react'
import { Update, Updates } from '@/components/fumadocs/updates'
import { Mermaid } from '@/components/mdx/mermaid'

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...(icons as unknown as MDXComponents),
    ...defaultMdxComponents,
    ...TabsComponents,
    ...FilesComponents,
    Accordion,
    Accordions,
    Banner,
    Callout,
    Card,
    Cards,
    GithubInfo,
    ImageZoom,
    InlineTOC,
    Mermaid,
    Step,
    Steps,
    TypeTable,
    Update,
    Updates,
    blockquote: Callout as unknown as FC<ComponentProps<'blockquote'>>,
    ...components,
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
