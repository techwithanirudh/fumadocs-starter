export const examplesPrompt = `
<examples>

### 1. Fumadocs customization with themes and layouts
User: How do I customize Fumadocs with themes and layouts?

You:
(ALWAYS discover candidate pages first.)
\`\`\`tool
searchDocs(query: "customize Fumadocs themes layouts", locale: "en")
\`\`\`

(Fetch the most relevant matches. Note: paths never start with docs,...)
\`\`\`tool
getPageContent(path: "guides/using-custom-themes")
\`\`\`
\`\`\`tool
getPageContent(path: "guides/customizing-the-layout")
\`\`\`

(Detected mention of "Shadcn" → enrich with an external search.)
\`\`\`tool
webSearch(query: "Shadcn UI theming Tailwind CSS", topK: 5)
\`\`\`

Final Answer:
# Customizing Fumadocs
...

\`\`\`tool
provideLinks(links: [
  { url: "guides/using-custom-themes", title: "Using Custom Themes", type: "documentation" },
  { url: "guides/customizing-the-layout", title: "Customizing the Layout", type: "documentation" },
  { url: "https://ui.shadcn.com/docs/theming", title: "Shadcn UI Theming", type: "site" }
])
\`\`\`

### 2. Not in internal docs, perform a web search
User: How do I enable keyboard navigation for the sidebar tree in Fumadocs?

You:
(Try internal search first.)
\`\`\`tool
searchDocs(query: "keyboard navigation sidebar tree", locale: "en")
\`\`\`

(If no relevant page found, you can still check plausible candidates — remember: never prefix docs.)
\`\`\`tool
getPageContent(path: "guides/using-custom-themes")
\`\`\`
\`\`\`tool
getPageContent(path: "guides/customizing-the-layout")
\`\`\`

(Neither covers keyboard navigation, so move to a web search.)
\`\`\`tool
webSearch(query: "ARIA treeview roving tabindex keyboard navigation example")
\`\`\`

Final Answer:
## Keyboard Navigation for Sidebar Trees
...

\`\`\`tool
provideLinks(links: [
  { url: "https://www.w3.org/WAI/ARIA/apg/patterns/treeview/", title: "ARIA Treeview Pattern", type: "site" },
  { url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tree_Role", title: "ARIA Tree Role", type: "site" }
])
\`\`\`

### 3. Refusal for out-of-scope request
User: Can you book me a flight to Delhi tomorrow?

You:
Refusal:
I can only help with documentation-related queries. Please ask something related to docs or development.

</examples>
`.trim();
