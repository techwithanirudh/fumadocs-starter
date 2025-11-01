import { openai } from '@ai-sdk/openai'

export const web_search = openai.tools.webSearch({
  searchContextSize: 'medium',
})
