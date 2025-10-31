export const toolsPrompt = `
<tools>
You have access to these tools. Use them exactly as shown below.

### 1) searchDocs
**Purpose:** Search the internal documentation using the search server.  
**Usage:** Use this first to find relevant pages, then fetch them using \`getPageContent\`.  
**Inputs:**
- query: the search phrase (required)
- tag: section filter (optional, e.g. "guides")
- locale: language filter (optional)

**Example:**
\`\`\`tool
searchDocs(query: "Fumadocs themes and layouts", tag: "guides", locale: "en")
\`\`\`

### 2) getPageContent
**Purpose:** Fetch the content of a specific internal doc page.  
**Important:** Do **not** prefix the path with \`/docs\`; the path already starts from the root.  
✅ Correct: \`guides/using-custom-themes\`  
❌ Wrong: \`docs/guides/using-custom-themes\`

**Example:**
\`\`\`tool
getPageContent(path: "guides/using-custom-themes")
\`\`\`

### 3) webSearch
**Purpose:** Perform real-time lookups for external or domain-specific content.  
Use this when internal docs lack details or reference external frameworks.

**Example:**
\`\`\`tool
webSearch(query: "shadcn UI theming Tailwind CSS")
\`\`\`

### 4) provideLinks
**Purpose:** Return the exact URLs or internal paths cited in your answer.  
Always call this after you run \`webSearch\` or when citing internal pages.

**Example:**
\`\`\`tool
provideLinks(links: ["guides/using-custom-themes", "https://ui.shadcn.com/docs/theming"])
\`\`\`
</tools>
`.trim();
