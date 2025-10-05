import * as Twoslash from 'fumadocs-twoslash/ui'
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import { Callout } from 'fumadocs-ui/components/callout'
import { TypeTable } from 'fumadocs-ui/components/type-table'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import * as icons from 'lucide-react'
import type { MDXComponents } from 'mdx/types'
import { Update, Updates } from '@/components/fumadocs/updates'
import { Mermaid } from '@/components/mdx/mermaid'

import * as FilesComponents from 'fumadocs-ui/components/files';
import * as TabsComponents from 'fumadocs-ui/components/tabs';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...(icons as unknown as MDXComponents),
    ...defaultMdxComponents,
    ...Twoslash,
    ...FilesComponents,
    ...TabsComponents,
    Accordion,
    Accordions,
    Updates,
    Update,
    Mermaid,
    TypeTable,
    Callout,
    ...components,
  }
}

declare module 'mdx/types.js' {
  // Augment the MDX types to make it understand React.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = React.JSX.Element;
    type ElementClass = React.JSX.ElementClass;
    type ElementType = React.JSX.ElementType;
    type IntrinsicElements = React.JSX.IntrinsicElements;
  }
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}