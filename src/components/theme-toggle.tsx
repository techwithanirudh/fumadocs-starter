'use client'
import { Airplay, Moon, Sun } from 'lucide-react'
import { LayoutGroup, motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { type HTMLAttributes, useLayoutEffect, useState } from 'react'
import { cn } from '@/lib/cn'

const themes = [
  { key: 'light', icon: Sun, label: 'Light theme' },
  { key: 'dark', icon: Moon, label: 'Dark theme' },
  { key: 'system', icon: Airplay, label: 'System theme' },
]

export function ThemeToggle({
  className,
  mode = 'light-dark',
  ...props
}: HTMLAttributes<HTMLElement> & {
  mode?: 'light-dark' | 'light-dark-system'
}) {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  const container = cn(
    'relative isolate inline-flex items-center overflow-hidden rounded-full p-1 ring-1 ring-border',
    className
  )

  if (mode === 'light-dark') {
    const value = mounted ? resolvedTheme : null

    return (
      <LayoutGroup>
        <button
          aria-label='Toggle Theme'
          className={container}
          data-theme-toggle=''
          onClick={() => setTheme(value === 'light' ? 'dark' : 'light')}
          {...props}
        >
          {themes.map(({ key, icon: Icon }) => {
            if (key === 'system') {
              return null
            }
            const isActive = value === key
            return (
              <div className='relative size-6.5 rounded-full p-1.5' key={key}>
                {isActive && <Pill />}
                <Icon
                  className={cn(
                    'relative z-10 m-auto size-full',
                    isActive
                      ? 'text-muted-foreground'
                      : 'text-accent-foreground'
                  )}
                  fill='currentColor'
                />
              </div>
            )
          })}
        </button>
      </LayoutGroup>
    )
  }

  const value = mounted ? theme : null

  return (
    <LayoutGroup>
      <div className={container} data-theme-toggle='' {...props}>
        {themes.map(({ key, icon: Icon }) => {
          const isActive = value === key
          return (
            <button
              aria-label={key}
              className='relative size-6.5 rounded-full p-1.5'
              key={key}
              onClick={() => setTheme(key)}
              type='button'
            >
              {isActive && <Pill />}
              <Icon
                className={cn(
                  'relative z-10 m-auto size-full',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
                fill='currentColor'
              />
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}

const Pill = () => (
  <motion.div
    className='pointer-events-none absolute inset-0 z-0 rounded-full bg-accent'
    initial={false}
    layoutId='activeTheme'
    transition={{ type: 'spring', bounce: 0.1, duration: 0.5 }}
  />
)
