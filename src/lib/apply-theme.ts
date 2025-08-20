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
  element: HTMLElement
) {
  if (!element) return

  Object.entries(themeState.cssVars.theme).forEach(([key, value]) => {
    element.style.setProperty(`--${key}`, value)
  })

  const modeVars = themeState.cssVars[themeState.currentMode]
  Object.entries(modeVars).forEach(([key, value]) => {
    if (key in themeState.cssVars.theme) {
      return
    }

    element.style.setProperty(`--${key}`, value)
  })

  element.setAttribute('data-theme', themeState.currentMode)

  if (themeState.currentMode === 'dark') {
    element.classList.add('dark')
    element.classList.remove('light')
  } else {
    element.classList.add('light')
    element.classList.remove('dark')
  }
}
