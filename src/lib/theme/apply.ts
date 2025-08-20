type ThemeMode = 'dark' | 'light'

type ThemeState = {
  // cssVars.theme contains global vars that should apply in all modes
  cssVars: {
    theme: Record<string, string>
    light: Record<string, string>
    dark: Record<string, string>
  }
  // optional custom CSS provided by the user (plain CSS string)
  customCss?: string
}

const STYLE_ID = 'tweakcn-themes'

function ensureStyleTag(): HTMLStyleElement {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (el) return el

  el = document.createElement('style')
  el.id = STYLE_ID
  el.setAttribute('data-generated-by', 'fumadocs-theme')
  document.head.appendChild(el)
  return el
}

function serializeVars(vars: Record<string, string>) {
  return Object.entries(vars)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join('\n')
}

/**
 * Build a single stylesheet that contains :root-level variables and per-mode overrides
 */
export function buildThemeCss(themeState: ThemeState) {
  const rootVars = themeState.cssVars.theme || {}
  const lightVars = themeState.cssVars.light || {}
  const darkVars = themeState.cssVars.dark || {}

  // :root contains the shared theme vars
  const parts: string[] = []
  parts.push(`:root {\n${serializeVars(rootVars)}\n}`)

  // data-theme attributes allow switching modes without mutating inline styles
  parts.push(`\n[data-theme=\"light\"] {\n${serializeVars(lightVars)}\n}`)
  parts.push(`\n[data-theme=\"dark\"] {\n${serializeVars(darkVars)}\n}`)

  // append any custom CSS the user provided
  if (themeState.customCss) {
    parts.push(`\n/* custom theme CSS */\n${themeState.customCss}`)
  }

  return parts.join('\n')
}

/**
 * Ensure the stylesheet is present and up-to-date, then set the element's data-theme
 */
export function applyThemeToElement(themeState: ThemeState, mode: ThemeMode, element: HTMLElement) {
  if (!element || typeof document === 'undefined') return

  const style = ensureStyleTag()
  const css = buildThemeCss(themeState)
  if (style.textContent !== css) style.textContent = css

  // Use a data attribute to switch mode; consumers can target [data-theme] or rely on CSS variables
  try {
    element.dataset.theme = mode
  } catch {
    // ignore in case setting dataset fails for any reason
  }
}
