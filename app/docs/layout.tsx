import { LargeSearchToggle } from 'fumadocs-ui/components/layout/search-toggle';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { baseOptions, linkItems, logo } from '@/app/layout.config';
import { AISearchTrigger } from '@/components/fumadocs/ai';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { source } from '@/lib/source';
import 'katex/dist/katex.min.css';
import DocsBackground from '@/components/docs-background';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...baseOptions}
      tree={source.pageTree}
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
                      'bg-fd-secondary/50 bg-fd-secondary/50 text-fd-muted-foreground shadow-none dark:bg-fd-secondary/50',
                  }),
                )}
              >
                <Sparkles className='size-4' />
              </AISearchTrigger>
            </div>
          ),
        },
      }}
      nav={{
        ...baseOptions.nav,
        children: (
          <AISearchTrigger
            className={cn(
              buttonVariants({
                variant: 'secondary',
                size: 'sm',
                className:
                  '-translate-1/2 absolute top-1/2 left-1/2 gap-2 rounded-full bg-fd-secondary/50 text-fd-muted-foreground md:hidden dark:bg-fd-secondary/50',
              }),
            )}
          >
            <Sparkles className='size-4.5 fill-current' />
            Ask AI
          </AISearchTrigger>
        ),
      }}
      sidebar={{
        tabs: {
          transform(option, node) {
            const meta = source.getNodeMeta(node);
            if (!meta || !node.icon) return option;

            const color = `var(--${meta.path.split('/')[0]}-color, var(--color-fd-foreground))`;

            return {
              ...option,
              icon: (
                <div
                  className='size-full rounded-lg max-md:border max-md:bg-(--tab-color)/10 max-md:p-1.5 [&_svg]:size-full'
                  style={
                    {
                      color,
                      '--tab-color': color,
                    } as object
                  }
                >
                  {node.icon}
                </div>
              ),
            };
          },
        },
      }}
    >
      {children}
      <DocsBackground />
    </DocsLayout>
  );
}
