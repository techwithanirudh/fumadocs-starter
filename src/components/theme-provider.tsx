import { applyThemeToElement } from '@/lib/theme/apply'
import { useThemeStore } from '@/lib/theme/store'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

type ThemeProviderProps = {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { themeState } = useThemeStore()
  const { resolvedTheme: mode } = useTheme();
  const [isClient, setIsClient] = useState(false)

  // Handle hydration and initialize CSS transitions
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const root = document.documentElement
    if (!root) return

    applyThemeToElement(themeState, mode, root)
  }, [themeState, isClient])

  return <>{children}</>
}
