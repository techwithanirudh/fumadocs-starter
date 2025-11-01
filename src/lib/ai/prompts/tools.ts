export const toolsPrompt = `
<tools>
You have access to these tools. Use them exactly as shown below.

### 1) searchDocs
Purpose: Search the internal documentation using the search server.  
Usage: Use this first to find relevant pages, then fetch them using \`getPageContent\`.  
Inputs:
- query: the search phrase (required)
- tag: section filter (optional, e.g. "all", "(index)", "api-reference", "changelog")
- locale: language filter (optional)

Example:
\`\`\`tool
searchDocs(query: "Fumadocs themes and layouts", locale: "en")
\`\`\`

### 2) getPageContent
Purpose: Fetch the content of a specific internal doc page.  
IMPORTANT: Do not prefix the path with \`/docs\`; the path already starts from the root.  

Correct: \`guides/using-custom-themes\`  
Wrong: \`docs/guides/using-custom-themes\`

Example:
\`\`\`tool
getPageContent(path: "guides/using-custom-themes")
\`\`\`

### 3) webSearch
Purpose: Perform real-time lookups for external or domain-specific content.  
Use this when internal docs lack details or reference external frameworks.

Example:
\`\`\`tool
webSearch(query: "shadcn UI theming Tailwind CSS")
\`\`\`

### 4) provideLinks
Purpose: Return the exact URLs or internal paths cited in your answer.  
Always call this after you run \`webSearch\` or when citing internal pages.

Inputs:
- links: array of link objects, each with:
  - url: the full URL or path (required). Use relative paths like \`guides/xyz\` for internal docs, or full URLs for external sites.
  - title: optional display title
  - label: optional footnote label (e.g., "1", "2")
  - type: optional type (e.g., "documentation", "site")

Example:
\`\`\`tool
provideLinks(links: [
  { url: "guides/using-custom-themes", title: "Using Custom Themes", type: "documentation" },
  { url: "https://ui.shadcn.com/docs/theming", title: "Shadcn UI Theming", type: "site" }
])
\`\`\`
</tools>
`.trim();
