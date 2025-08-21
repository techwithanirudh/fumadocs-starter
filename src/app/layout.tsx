import { baseUrl, createMetadata } from '@/lib/metadata'
import '@/styles/globals.css'
import type { Viewport } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import { Body } from './layout.client'
import { Providers } from './providers'
import 'katex/dist/katex.css'
import { ThemeScript } from '@/components/theme-script'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata = createMetadata({
  title: {
    template: '%s | Starter Kit',
    default: 'Starter Kit',
  },
  description: 'The Next.js framework for building documentation sites',
  metadataBase: baseUrl,
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang='en'
      className={`${inter.className} dark`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />

      </head>
      <Body>
        <Providers>{children}</Providers>
      </Body>
    </html>
  )
}
