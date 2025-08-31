import { LargeSearchToggle } from 'fumadocs-ui/components/layout/search-toggle'
import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import { Sparkles } from 'lucide-react'
import { AISearchTrigger } from '@/components/fumadocs/ai'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { baseOptions, linkItems, logo } from '@/lib/layout.shared'
import { source } from '@/lib/source'
import 'katex/dist/katex.min.css'
import type { CSSProperties } from 'react'
import DocsBackground from '@/components/docs-background'

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const base = baseOptions()

  return (
    <DocsLayout
      {...base}
      tree={source.pageTree}
      sidebar={{
        collapsible: false,
        tabs: {
          transform(option, node) {
            const meta = source.getNodeMeta(node)
            if (!meta || !node.icon) return option

            const segments = meta.path.split('/')
            const segment = serializeSegment(segments[0])

            const color = `var(--${segment}-color, var(--color-fd-foreground))`
            return {
              ...option,
              icon: (
                <div
                  className='size-full text-(--tab-color) max-md:border max-md:bg-(--tab-color)/10 max-md:p-1.5 [&_svg]:size-full'
                  style={{ '--tab-color': color } as CSSProperties}
                >
                  {node.icon}
                </div>
              ),
            }
          },
        },
      }}
      tabMode='navbar'
      // just icon items
      links={linkItems.filter((item) => item.type === 'icon')}
      searchToggle={{
        components: {
          lg: (
            <div className='flex gap-1.5 max-md:hidden'>
              <LargeSearchToggle className='flex-1' />
              <AISearchTrigger
                aria-label='Ask AI'
                className={cn(
                  buttonVariants({
                    variant: 'outline',
                    size: 'icon',
                    className:
                      'rounded-xl bg-fd-secondary/50 text-fd-muted-foreground shadow-none dark:bg-fd-secondary/50',
                  })
                )}
              >
                <Sparkles className='size-4' />
              </AISearchTrigger>
            </div>
          ),
        },
      }}
      nav={{
        ...base.nav,
        mode: 'top',
        title: (
          <>
            {logo}
            <span className='font-medium max-md:hidden'>Starter Kit</span>
          </>
        ),
        children: (
          <AISearchTrigger
            className={cn(
              buttonVariants({
                variant: 'secondary',
                size: 'sm',
                className:
                  '-translate-1/2 absolute top-1/2 left-1/2 gap-2 rounded-full bg-fd-secondary/50 text-fd-muted-foreground md:hidden dark:bg-fd-secondary/50',
              })
            )}
          >
            <Sparkles className='size-4.5 fill-current' />
            Ask AI
          </AISearchTrigger>
        ),
      }}
    >
      {children}
      <DocsBackground />
    </DocsLayout>
  )
}

function serializeSegment(segment: string | undefined): string {
  const raw = (segment ?? '').trim()

  // Prefer a readable kebab-case style for CSS variables
  // Convert spaces/underscores to hyphens, remove invalid chars
  const kebab = raw
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
  return kebab || 'fd'
}
