import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const THEME_STORE_KEY = 'theme-store'

type ThemeState = {
  cssVars: {
    theme: Record<string, string>
    light: Record<string, string>
    dark: Record<string, string>
  }
  // optional arbitrary CSS string that will be appended to the generated stylesheet
  customCss?: string
}

type ThemeStore = {
  themeState: ThemeState
  setThemeState: (themeState: ThemeState) => void
  setCustomCss: (css?: string) => void
}

const DEFAULT_THEME = {
  themeState: {
    cssVars: {
      theme: {
        'font-sans': 'Outfit, sans-serif',
        'font-mono': 'monospace',
        'font-serif':
          'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
        radius: '0.5rem',
        'tracking-tighter': 'calc(var(--tracking-normal) - 0.05em)',
        'tracking-tight': 'calc(var(--tracking-normal) - 0.025em)',
        'tracking-wide': 'calc(var(--tracking-normal) + 0.025em)',
        'tracking-wider': 'calc(var(--tracking-normal) + 0.05em)',
        'tracking-widest': 'calc(var(--tracking-normal) + 0.1em)',
      },
      light: {
        background: 'oklch(0.9711 0.0074 80.7211)',
        foreground: 'oklch(0.3000 0.0358 30.2042)',
        card: 'oklch(0.9711 0.0074 80.7211)',
        'card-foreground': 'oklch(0.3000 0.0358 30.2042)',
        popover: 'oklch(0.9711 0.0074 80.7211)',
        'popover-foreground': 'oklch(0.3000 0.0358 30.2042)',
        primary: 'oklch(0.5234 0.1347 144.1672)',
        'primary-foreground': 'oklch(1.0000 0 0)',
        secondary: 'oklch(0.9571 0.0210 147.6360)',
        'secondary-foreground': 'oklch(0.4254 0.1159 144.3078)',
        muted: 'oklch(0.9370 0.0142 74.4218)',
        'muted-foreground': 'oklch(0.4495 0.0486 39.2110)',
        accent: 'oklch(0.8952 0.0504 146.0366)',
        'accent-foreground': 'oklch(0.4254 0.1159 144.3078)',
        destructive: 'oklch(0.5386 0.1937 26.7249)',
        'destructive-foreground': 'oklch(1.0000 0 0)',
        border: 'oklch(0.8805 0.0208 74.6428)',
        input: 'oklch(0.8805 0.0208 74.6428)',
        ring: 'oklch(0.5234 0.1347 144.1672)',
        'chart-1': 'oklch(0.6731 0.1624 144.2083)',
        'chart-2': 'oklch(0.5752 0.1446 144.1813)',
        'chart-3': 'oklch(0.5234 0.1347 144.1672)',
        'chart-4': 'oklch(0.4254 0.1159 144.3078)',
        'chart-5': 'oklch(0.2157 0.0453 145.7256)',
        radius: '0.5rem',
        sidebar: 'oklch(0.9370 0.0142 74.4218)',
        'sidebar-foreground': 'oklch(0.3000 0.0358 30.2042)',
        'sidebar-primary': 'oklch(0.5234 0.1347 144.1672)',
        'sidebar-primary-foreground': 'oklch(1.0000 0 0)',
        'sidebar-accent': 'oklch(0.8952 0.0504 146.0366)',
        'sidebar-accent-foreground': 'oklch(0.4254 0.1159 144.3078)',
        'sidebar-border': 'oklch(0.8805 0.0208 74.6428)',
        'sidebar-ring': 'oklch(0.5234 0.1347 144.1672)',
        'font-sans': 'Montserrat, sans-serif',
        'font-serif': 'Merriweather, serif',
        'font-mono': 'Source Code Pro, monospace',
        'shadow-color': 'oklch(0 0 0)',
        'shadow-opacity': '0.1',
        'shadow-blur': '3px',
        'shadow-spread': '0px',
        'shadow-offset-x': '0',
        'shadow-offset-y': '1px',
        'letter-spacing': '0em',
        spacing: '0.25rem',
        'shadow-2xs': '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
        'shadow-xs': '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
        'shadow-sm':
          '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
        shadow:
          '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
        'shadow-md':
          '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)',
        'shadow-lg':
          '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)',
        'shadow-xl':
          '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)',
        'shadow-2xl': '0 1px 3px 0px hsl(0 0% 0% / 0.25)',
        'tracking-normal': '0em',
      },
      dark: {
        background: 'oklch(0 0 0)',
        foreground: 'oklch(0.9288 0.0126 255.5078)',
        card: 'oklch(0.1684 0 0)',
        'card-foreground': 'oklch(0.9288 0.0126 255.5078)',
        popover: 'oklch(0.2603 0 0)',
        'popover-foreground': 'oklch(0.7348 0 0)',
        primary: 'oklch(0.4365 0.1044 156.7556)',
        'primary-foreground': 'oklch(0.9213 0.0135 167.1556)',
        secondary: 'oklch(0.2603 0 0)',
        'secondary-foreground': 'oklch(0.9851 0 0)',
        muted: 'oklch(0.2393 0 0)',
        'muted-foreground': 'oklch(0.7122 0 0)',
        accent: 'oklch(0.3132 0 0)',
        'accent-foreground': 'oklch(0.9851 0 0)',
        destructive: 'oklch(0.3123 0.0852 29.7877)',
        'destructive-foreground': 'oklch(0.9368 0.0045 34.3092)',
        border: 'oklch(0.2264 0 0)',
        input: 'oklch(0.2603 0 0)',
        ring: 'oklch(0.8003 0.1821 151.7110)',
        'chart-1': 'oklch(0.8003 0.1821 151.7110)',
        'chart-2': 'oklch(0.7137 0.1434 254.6240)',
        'chart-3': 'oklch(0.7090 0.1592 293.5412)',
        'chart-4': 'oklch(0.8369 0.1644 84.4286)',
        'chart-5': 'oklch(0.7845 0.1325 181.9120)',
        radius: '0.5rem',
        sidebar: 'oklch(0.1684 0 0)',
        'sidebar-foreground': 'oklch(0.6301 0 0)',
        'sidebar-primary': 'oklch(0.4365 0.1044 156.7556)',
        'sidebar-primary-foreground': 'oklch(0.9213 0.0135 167.1556)',
        'sidebar-accent': 'oklch(0.3132 0 0)',
        'sidebar-accent-foreground': 'oklch(0.9851 0 0)',
        'sidebar-border': 'oklch(0.2809 0 0)',
        'sidebar-ring': 'oklch(0.8003 0.1821 151.7110)',
        'font-sans': 'Outfit, sans-serif',
        'font-serif':
          'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
        'font-mono': 'monospace',
        'shadow-color': 'oklch(0 0 0)',
        'shadow-opacity': '0.1',
        'shadow-blur': '3px',
        'shadow-spread': '0px',
        'shadow-offset-x': '0',
        'shadow-offset-y': '1px',
        'letter-spacing': '0em',
        spacing: '0.25rem',
        'shadow-2xs': '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
        'shadow-xs': '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
        'shadow-sm':
          '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
        shadow:
          '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
        'shadow-md':
          '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)',
        'shadow-lg':
          '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)',
        'shadow-xl':
          '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)',
        'shadow-2xl': '0 1px 3px 0px hsl(0 0% 0% / 0.25)',
      },
    },
  },
} as const

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeState: DEFAULT_THEME.themeState,
      setThemeState: (themeState) => set({ themeState }),
      setCustomCss: (css) =>
        set((s) => ({ themeState: { ...s.themeState, customCss: css } })),
    }),
    {
      name: THEME_STORE_KEY,
      partialize: (state) => ({ themeState: state.themeState }),
    }
  )
)
