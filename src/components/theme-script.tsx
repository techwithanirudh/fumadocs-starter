export function ThemeScript() {
    const scriptContent = `
    (function() {
      const storageKey = "theme-store";
      const root = document.documentElement;

      let themeState = null;
      try {
        const persistedStateJSON = localStorage.getItem(storageKey);
        if (persistedStateJSON) {
          themeState = JSON.parse(persistedStateJSON)?.state?.themeState;
        }
      } catch (e) {
        console.warn("Theme initialization: Failed to read/parse localStorage:", e);
      }

      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const mode = themeState?.currentMode ?? (prefersDark ? "dark" : "light");

      const activeStyles =
        mode === "dark"
          ? themeState?.cssVars?.dark
          : themeState?.cssVars?.light;

      if (!activeStyles) {
        return;
      }

      const stylesToApply = Object.keys(activeStyles);

      for (const styleName of stylesToApply) {
        const value = activeStyles[styleName];
        if (value !== undefined) {
          root.style.setProperty(\`--\${styleName}\`, value);
        }
      }
    })();
  `

    return (
        <script
            // biome-ignore lint/security/noDangerouslySetInnerHtml: this script needs to execute immediately
            dangerouslySetInnerHTML={{ __html: scriptContent }}
            suppressHydrationWarning
        />
    )
}