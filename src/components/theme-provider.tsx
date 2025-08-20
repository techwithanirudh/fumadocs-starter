import { applyThemeToElement } from '@/lib/theme/apply'
import { useThemeStore } from '@/lib/theme/store'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

type ThemeProviderProps = {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { themeState } = useThemeStore()
  const { resolvedTheme: mode } = useTheme()
  const [isClient, setIsClient] = useState(false)

  // Hydration guard
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const root = document.documentElement
    if (!root) return

    // applyThemeToElement will update a single <style> tag and set [data-theme]
    applyThemeToElement(themeState as any, (mode as 'dark' | 'light') ?? 'light', root)
  }, [themeState, isClient, mode])

  return <>{children}</>
}
