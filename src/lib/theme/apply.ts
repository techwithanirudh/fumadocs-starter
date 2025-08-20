type ThemeMode = 'dark' | 'light'

type ThemeState = {
  currentMode: ThemeMode
  cssVars: {
    theme: Record<string, string>
    light: Record<string, string>
    dark: Record<string, string>
  }
}

export function applyThemeToElement(
  themeState: ThemeState,
  mode: string,
  element: HTMLElement
) {
  if (!element) return

  Object.entries(themeState.cssVars.theme).forEach(([key, value]) => {
    element.style.setProperty(`--${key}`, value)
  })

  const modeVars = themeState.cssVars[mode]
  Object.entries(modeVars).forEach(([key, value]) => {
    if (key in themeState.cssVars.theme) {
      return
    }

    element.style.setProperty(`--${key}`, value)
  })
}
