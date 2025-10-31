import { openai } from '@ai-sdk/openai'

export const webSearch = openai.tools.webSearch({
  searchContextSize: 'medium',
})
