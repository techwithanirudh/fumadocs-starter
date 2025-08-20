'use client'
import { ProgressProvider } from '@bprogress/next/app'
import { RootProvider } from 'fumadocs-ui/provider'
import type { ReactNode } from 'react'
import SearchDialog from '@/components/search'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog,
      }}
    >
      <ProgressProvider
        height='2px'
        color='var(--color-primary)'
        options={{
          showSpinner: false,
        }}
        stopDelay={1000}
        delay={1000}
        startOnLoad
        shallowRouting
      >
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </ProgressProvider>
    </RootProvider>
  )
}
