'use client'
import { Airplay, Moon, Sun } from 'lucide-react'
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { type HTMLAttributes, useId, useLayoutEffect, useState } from 'react'
import { cn } from '@/lib/cn'

const themes = [
  {
    key: 'light',
    icon: Sun,
    label: 'Light theme',
  },
  {
    key: 'dark',
    icon: Moon,
    label: 'Dark theme',
  },
  {
    key: 'system',
    icon: Airplay,
    label: 'System theme',
  },
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
  const id = useId()

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  const container = cn(
    'relative isolate inline-flex items-center rounded-full p-1 ring-1 ring-border',
    className
  )

  if (mode === 'light-dark') {
    const value = mounted ? resolvedTheme : null

    return (
      <button
        className={container}
        aria-label={`Toggle Theme`}
        onClick={() => setTheme(value === 'light' ? 'dark' : 'light')}
        data-theme-toggle=''
        {...props}
      >
        {themes
          // biome-ignore lint/suspicious/useIterableCallbackReturn: we intentionally skip 'system'
          .map(({ key, icon: Icon }) => {
            const isActive = value === key

            if (key === 'system') return

            return (
              <div key={key} className='relative size-6.5 rounded-full p-1.5'>
                {isActive && (
                  <motion.div
                    layoutId={`activeTheme-${id}`}
                    className='absolute inset-0 rounded-full bg-accent'
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                    initial={false}
                  />
                )}
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
    )
  }

  const value = mounted ? theme : null

  return (
    <div className={container} data-theme-toggle='' {...props}>
      {themes.map(({ key, icon: Icon }) => {
        const isActive = value === key

        return (
          <button
            type='button'
            key={key}
            aria-label={key}
            className='relative size-6.5 rounded-full p-1.5'
            onClick={() => setTheme(key)}
          >
            {isActive && (
              <motion.div
                layoutId={`activeTheme-${id}`}
                className='absolute inset-0 rounded-full bg-accent'
                transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                initial={false}
              />
            )}
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
  )
}
