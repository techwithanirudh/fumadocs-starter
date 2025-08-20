export const THEME_URLS = [
  'https://tweakcn.com/editor/theme?theme=mono',
  'https://tweakcn.com/editor/theme?theme=t3-chat',
  'https://tweakcn.com/editor/theme?theme=tangerine',
  'https://tweakcn.com/editor/theme?theme=perpetuity',
  'https://tweakcn.com/editor/theme?theme=modern-minimal',
  'https://tweakcn.com/r/themes/vintage-paper.json',
  'https://tweakcn.com/r/themes/amethyst-haze.json',
  'https://tweakcn.com/editor/theme?theme=caffeine',
  'https://tweakcn.com/editor/theme?theme=quantum-rose',
  'https://tweakcn.com/editor/theme?theme=claymorphism',
  'https://tweakcn.com/editor/theme?theme=pastel-dreams',
  'https://tweakcn.com/editor/theme?theme=supabase',
  'https://tweakcn.com/editor/theme?theme=vercel',
  'https://tweakcn.com/editor/theme?theme=cyberpunk',
]

export type ThemePreset = {
  cssVars: {
    theme: Record<string, string>
    light: Record<string, string>
    dark: Record<string, string>
  }
}

export type FetchedTheme = {
  name: string
  preset: ThemePreset
  url: string
  error?: string
  type: 'custom' | 'built-in'
}

export function convertToThemePreset(externalTheme: any): ThemePreset {
  if (externalTheme.cssVars) {
    return {
      cssVars: {
        theme: externalTheme.cssVars.theme || {},
        light: externalTheme.cssVars.light || {},
        dark: externalTheme.cssVars.dark || {},
      },
    }
  }

  throw new Error('Unsupported theme format')
}

export function getThemeName(themeData: any, url: string): string {
  if (themeData.name) {
    return themeData.name
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase())
  }

  return 'Custom Theme'
}

export async function fetchThemeFromUrl(url: string): Promise<FetchedTheme> {
  const baseUrl = 'https://tweakcn.com/r/themes/'
  // use cuid logic instead, probably also make this an api route instead of client sied
  const isBuiltInUrl = url.includes('editor/theme?theme=')
  const transformedUrl =
    url
      .replace('https://tweakcn.com/editor/theme?theme=', baseUrl)
      .replace('https://tweakcn.com/themes/', baseUrl) +
    (isBuiltInUrl ? '.json' : '')

  try {
    const response = await fetch(transformedUrl)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const themeData = await response.json()
    const themePreset = convertToThemePreset(themeData)
    const themeName = getThemeName(themeData, url)
    return {
      name: themeName,
      preset: themePreset,
      url,
      type: THEME_URLS.includes(url) ? 'built-in' : 'custom',
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to fetch theme'
    return {
      name: getThemeName({}, url),
      preset: { cssVars: { theme: {}, light: {}, dark: {} } },
      url,
      error: errorMessage,
      type: THEME_URLS.includes(url) ? 'built-in' : 'custom',
    }
  }
}

export function extractThemeColors(
  preset: ThemePreset,
  mode: 'light' | 'dark'
): string[] {
  const colors: string[] = []
  const { light, dark, theme } = preset.cssVars
  const modeVars = mode === 'light' ? light : dark

  const colorKeys = [
    'primary',
    'accent',
    'secondary',
    'background',
    'muted',
    'destructive',
    'border',
    'card',
    'popover',
  ]

  const currentVars = { ...theme, ...modeVars }

  colorKeys.forEach((key) => {
    const colorValue = currentVars[key]
    if (colorValue && colors.length < 5) {
      if (colorValue.includes('hsl')) {
        colors.push(`hsl(${colorValue})`)
      } else {
        colors.push(colorValue)
      }
    }
  })

  return colors.slice(0, 5)
}
