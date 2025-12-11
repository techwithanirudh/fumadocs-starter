import { readFile } from 'node:fs/promises'
import type { ImageResponseOptions } from '@takumi-rs/image-response'
import type { ReactNode } from 'react'
import { title as siteName } from '@/lib/layout.shared'

export type GenerateProps = {
  title: ReactNode
  description?: ReactNode
  tag?: string
}

const font = readFile('./src/app/og/[...slug]/fonts/Inter-Regular.ttf').then(
  (data) => ({
    name: 'Inter',
    data,
    weight: 400,
  })
)
const fontSemiBold = readFile(
  './src/app/og/[...slug]/fonts/Inter-SemiBold.ttf'
).then((data) => ({
  name: 'Inter',
  data,
  weight: 500,
}))
const fontBold = readFile('./src/app/og/[...slug]/fonts/Inter-Bold.ttf').then(
  (data) => ({
    name: 'Inter',
    data,
    weight: 700,
  })
)
const logo = readFile('./public/logo.svg').then((data) => ({
  src: 'logo.svg',
  data,
}))

export async function getImageResponseOptions(): Promise<ImageResponseOptions> {
  return {
    format: 'webp',
    width: 1200,
    height: 630,
    persistentImages: [await logo],
    fonts: await Promise.all([font, fontSemiBold, fontBold]),
  }
}

export function generate({ title, description, tag }: GenerateProps) {
  const primaryTextColor = 'rgb(240,240,240)'
  const primaryColor = 'rgb(123, 111, 111)'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        color: 'white',
        backgroundColor: '#0c0c0c',
        backgroundImage: `linear-gradient(to top right, ${primaryColor}, transparent)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '4rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '24px',
            marginBottom: 'auto',
            color: primaryTextColor,
          }}
        >
          {/* biome-ignore lint/correctness/useImageSize: required for OG image rendering */}
          {/* biome-ignore lint/performance/noImgElement: required for OG image rendering */}
          <img
            alt={siteName}
            src='logo.svg'
            style={{ width: 60, height: 60 }}
          />
          <span
            style={{
              fontSize: '46px',
              fontWeight: 600,
            }}
          >
            {siteName}
          </span>
        </div>
        <p
          style={{
            fontWeight: 600,
            fontSize: '26px',
            textTransform: 'uppercase',
          }}
        >
          {tag?.replace(/-/g, ' ')}
        </p>
        <span
          style={{
            fontWeight: 600,
            fontSize: '76px',
          }}
        >
          {title}
        </span>
        <p
          style={{
            fontSize: '48px',
            color: 'rgba(240,240,240,0.7)',
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}
