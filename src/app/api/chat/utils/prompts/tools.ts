export const toolsPrompt = `
<tools>
You have access to these tools. Use them exactly as shown below.

### 1) searchDocs
Purpose: Search the documentation by full-text query. Returns page titles, URLs, and content.

Usage:
- Use this to find relevant pages, then fetch them using \`getPageContent\` if you need more depth.

Inputs:
- query: the search phrase (required)
- limit: maximum number of results (optional, default: 10, max: 50)

Example:
searchDocs(query: "Fumadocs themes and layouts", limit: 10)

### 2) getPageContent
Purpose: Fetch the content of a specific internal doc page.

IMPORTANT:
- Do not prefix the path with \`/docs\`; the path already starts from the root
- Correct: \`guides/using-custom-themes\`
- Wrong: \`docs/guides/using-custom-themes\`

Example:
getPageContent(path: "guides/using-custom-themes")
</tools>
`
