import { owner, repo } from '@/lib/github'
import type { Page } from '@/lib/source'

export const categoryMap: Record<string, string> = {
  '(index)': 'Home',
  'api-reference': 'API Reference',
  changelog: 'Changelog',
}

export async function getLLMText(page: Page) {
  const slugs = page.path.split('/')
  const category = categoryMap[slugs[0]] ?? slugs[0]

  const processed = await page.data.getText('processed')
  const path = `content/docs/${page.path}`

  return `# ${category}: ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/main/${path}

${page.data.description ?? ''}
        
${processed}`
}
