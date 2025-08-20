import { useMemo, useState, useEffect } from 'react'
import { toast } from 'sonner'

import { useThemeStore } from '@/lib/theme/store'
import {
  type FetchedTheme,
  THEME_URLS,
  type ThemePreset,
  fetchThemeFromUrl,
} from '@/lib/theme/utils'

// LocalStorage keys
const LS_CUSTOM_THEMES = 'theme.customUrls'
const LS_SELECTED_THEME_URL = 'theme.selectedUrl'

// Safe browser check
const isBrowser = typeof window !== 'undefined'

// LocalStorage helpers
function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON<T>(key: string, value: T) {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota or privacy errors
  }
}

export function useThemeManagement() {
  // Zustand store for live cssVars and mode
  const { themeState, setThemeState } = useThemeStore()

  // Local state
  const [searchQuery, setSearchQuery] = useState('')
  const [customThemeUrls, setCustomThemeUrls] = useState<string[]>(() =>
    readJSON<string[]>(LS_CUSTOM_THEMES, [])
  )
  const [selectedThemeUrl, setSelectedThemeUrl] = useState<string | null>(() =>
    readJSON<string | null>(LS_SELECTED_THEME_URL, null)
  )

  // Persist whenever these change
  useEffect(() => {
    writeJSON(LS_CUSTOM_THEMES, customThemeUrls)
  }, [customThemeUrls])

  useEffect(() => {
    writeJSON(LS_SELECTED_THEME_URL, selectedThemeUrl)
  }, [selectedThemeUrl])

  // Combine built-in and user-saved theme URLs
  const allThemeUrls = useMemo(() => {
    const set = new Set<string>(THEME_URLS)
    for (const url of customThemeUrls) set.add(url)
    return Array.from(set)
  }, [customThemeUrls])

  // Fetch themes when URLs change (lightweight replacement for react-query)
  const [fetchedThemes, setFetchedThemes] = useState<any[]>([])
  const [isLoadingThemes, setIsLoadingThemes] = useState(false)

  useEffect(() => {
    if (allThemeUrls.length === 0) {
      setFetchedThemes([])
      setIsLoadingThemes(false)
      return
    }

    let cancelled = false
    setIsLoadingThemes(true)

    Promise.all(allThemeUrls.map((u) => fetchThemeFromUrl(u)))
      .then((results) => {
        if (cancelled) return
        setFetchedThemes(results)
      })
      .catch(() => {
        if (cancelled) return
        setFetchedThemes([])
      })
      .finally(() => {
        if (cancelled) return
        setIsLoadingThemes(false)
      })

    return () => {
      cancelled = true
    }
  }, [allThemeUrls])

  // Apply a preset to the live theme state
  const applyThemePreset = (preset: ThemePreset) => {
    setThemeState({
      cssVars: preset.cssVars,
    })
  }

  // Import a new theme and persist locally
  const handleThemeImported = (preset: ThemePreset, url: string) => {
    applyThemePreset(preset)
    setSelectedThemeUrl(url)

    if (!THEME_URLS.includes(url) && !customThemeUrls.includes(url)) {
      setCustomThemeUrls((prev) => {
        const next = [...prev, url]
        toast.success('Theme imported successfully')
        return next
      })
    } else {
      toast.success('Theme applied')
    }
  }

  // Select an already fetched theme
  const handleThemeSelect = (theme: FetchedTheme) => {
    if ('error' in theme && theme.error) return
    if ('preset' in theme) {
      applyThemePreset(theme.preset)
      setSelectedThemeUrl(theme.url)
    }
  }

  // Delete a custom theme from localStorage list
  const handleThemeDelete = (url: string) => {
    if (THEME_URLS.includes(url)) return
    setCustomThemeUrls((prev) => prev.filter((u) => u !== url))
    if (selectedThemeUrl === url) {
      setSelectedThemeUrl(null)
    }
    toast.success('Theme deleted successfully')
  }

  const randomizeTheme = () => {
    const available = fetchedThemes.filter((t) => !('error' in t && t.error))
    if (available.length > 0) {
      const randomTheme =
        available[Math.floor(Math.random() * available.length)]
      handleThemeSelect(randomTheme)
    }
  }

  // Search filtering
  const filteredThemes = fetchedThemes.filter((theme) =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const customThemes = filteredThemes.filter((theme) => theme.type === 'custom')
  const builtInThemes = filteredThemes.filter(
    (theme) => theme.type === 'built-in'
  )

  return {
    // State
    themeState,
    searchQuery,
    setSearchQuery,
    selectedThemeUrl,
    setSelectedThemeUrl,
    isLoadingThemes,
    fetchedThemes,
    filteredThemes,
    customThemes,
    builtInThemes,

    // Actions
    handleThemeImported,
    handleThemeSelect,
    handleThemeDelete,
    randomizeTheme,
    applyThemePreset,
  }
}
