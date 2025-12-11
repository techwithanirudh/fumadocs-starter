import { categories } from '@/lib/constants'
import { source } from '@/lib/source'

export function getLLMsTxt() {
  const scanned: string[] = []
  scanned.push('# Docs')

  const map = new Map<string, string[]>()

  for (const page of source.getPages()) {
    const dir = page.path.split('/')[0]
    const list = map.get(dir) ?? []
    list.push(`- [${page.data.title}](${page.url}): ${page.data.description}`)
    map.set(dir, list)
  }

  for (const [key, value] of map) {
    scanned.push(`## ${categories[key]}`)
    scanned.push(value.join('\n'))
  }

  return scanned.join('\n\n')
}
