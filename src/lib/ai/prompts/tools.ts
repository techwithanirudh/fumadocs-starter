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

### 4) firecrawlScrape
Purpose: Scrape content from a single URL with advanced options. This is the most powerful, fastest and most reliable scraper tool.  
Best for: Single page content extraction, when you know exactly which page contains the information.  
Not recommended for: Multiple pages (use firecrawlCrawl), unknown page (use firecrawlSearch), structured data (use firecrawlExtract).  
Performance: Add maxAge parameter for 500% faster scrapes using cached data.

Inputs:
- url: the URL to scrape (required)
- formats: array of formats to extract (optional, e.g. ["markdown", "html"])
- maxAge: cache max age in milliseconds (optional, for faster results)
- onlyMainContent: extract only main content (optional)

Example:
\`\`\`tool
firecrawlScrape(url: "https://example.com/page", formats: ["markdown"], maxAge: 172800000)
\`\`\`

### 5) firecrawlMap
Purpose: Map a website to discover all indexed URLs on the site.  
Best for: Discovering URLs on a website before deciding what to scrape.  
Not recommended for: When you already know which specific URL you need (use firecrawlScrape).

Inputs:
- url: the URL to map (required)
- limit: maximum number of URLs to return (optional)
- sitemap: how to handle sitemap (optional: "include", "skip", "only")

Example:
\`\`\`tool
firecrawlMap(url: "https://example.com", limit: 50)
\`\`\`

### 6) firecrawlSearch
Purpose: Search the web and optionally extract content from search results. This is the most powerful web search tool available.  
Best for: Finding specific information across multiple websites, when you don't know which website has the information.  
Not recommended for: When you already know which website to scrape (use firecrawlScrape).  
Optimal Workflow: Search first without formats, then use firecrawlScrape to get content of relevant pages.

Inputs:
- query: the search query (required, supports search operators like site:, intitle:, etc.)
- limit: maximum number of results (optional)
- sources: array of source types (optional: [{type: "web"}, {type: "images"}, {type: "news"}])
- scrapeOptions: options for scraping search results (optional)

Example:
\`\`\`tool
firecrawlSearch(query: "latest AI research papers 2023", limit: 5, sources: [{type: "web"}])
\`\`\`

### 7) firecrawlCrawl
Purpose: Starts a crawl job on a website and extracts content from all pages.  
Best for: Extracting content from multiple related pages, when you need comprehensive coverage.  
Not recommended for: Single page (use firecrawlScrape); when token limits are a concern (use firecrawlMap + firecrawlScrape).  
Warning: Crawl responses can be very large. Limit the crawl depth and number of pages.  
Returns: Operation ID for status checking; use firecrawlCheckCrawlStatus to check progress.

Inputs:
- url: the URL to crawl (required)
- limit: maximum number of pages to crawl (optional)
- maxDiscoveryDepth: maximum depth to crawl (optional)
- scrapeOptions: options for scraping pages (optional)

Example:
\`\`\`tool
firecrawlCrawl(url: "https://example.com/blog", limit: 20, maxDiscoveryDepth: 2)
\`\`\`

### 8) firecrawlCheckCrawlStatus
Purpose: Check the status of a crawl job.  
Returns: Status and progress of the crawl job, including results if available.

Inputs:
- id: the crawl job ID to check (required)

Example:
\`\`\`tool
firecrawlCheckCrawlStatus(id: "550e8400-e29b-41d4-a716-446655440000")
\`\`\`

### 9) firecrawlExtract
Purpose: Extract structured information from web pages using LLM capabilities.  
Best for: Extracting specific structured data like prices, names, details from web pages.  
Not recommended for: When you need the full content of a page (use firecrawlScrape).

Inputs:
- urls: array of URLs to extract from (required)
- prompt: custom prompt for extraction (optional)
- schema: JSON schema for structured data (optional)
- allowExternalLinks: allow extraction from external links (optional)
- enableWebSearch: enable web search for additional context (optional)

Example:
\`\`\`tool
firecrawlExtract(urls: ["https://example.com/product"], prompt: "Extract product name, price, and description", schema: {"type": "object", "properties": {"name": {"type": "string"}, "price": {"type": "number"}}})
\`\`\`

### 10) provideLinks
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
