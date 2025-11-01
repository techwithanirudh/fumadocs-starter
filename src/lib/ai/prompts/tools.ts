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

### 4) scrape
Purpose: Scrape content from a single URL with advanced options. This is the most powerful, fastest and most reliable scraper tool.  
Best for: Single page content extraction, when you know exactly which page contains the information.  
Not recommended for: Unknown page (use search).  
Performance: Add maxAge parameter for 500% faster scrapes using cached data.

Inputs:
- url: the URL to scrape (required)
- formats: array of formats to extract (optional, e.g. ["markdown", "html"])
- maxAge: cache max age in milliseconds (optional, for faster results)
- onlyMainContent: extract only main content (optional)

Example:
\`\`\`tool
scrape(url: "https://example.com/page", formats: ["markdown"], maxAge: 172800000)
\`\`\`

### 5) search
Purpose: Search the web and optionally extract content from search results. This is the most powerful web search tool available.  
Best for: Finding specific information across multiple websites, when you don't know which website has the information.  
Not recommended for: When you already know which website to scrape (use scrape).  
Optimal Workflow: Search first without formats, then use scrape to get content of relevant pages.

Inputs:
- query: the search query (required, supports search operators like site:, intitle:, etc.)
- limit: maximum number of results (optional)
- sources: array of source types (optional: [{type: "web"}, {type: "images"}, {type: "news"}])
- scrapeOptions: options for scraping search results (optional)

Example:
\`\`\`tool
search(query: "latest AI research papers 2023", limit: 5, sources: [{type: "web"}])
\`\`\`

### 6) provideLinks
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
`.trim()
