import { createOpenAI } from '@ai-sdk/openai'
import {
  convertToModelMessages,
  InvalidToolInputError,
  NoSuchToolError,
  smoothStream,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from 'ai'
import { env } from '@/env'
import { systemPrompt } from '@/lib/ai/prompts'
import { GetPageContentToolSchema, ProvideLinksToolSchema } from '@/lib/ai/qa-schema'
import { categoryMap } from '@/lib/get-llm-text'
import { source } from '@/lib/source'

export const runtime = 'edge'

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
})

function getLLMsTxt() {
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
    scanned.push(`## ${categoryMap[key]}`)
    scanned.push(value.join('\n'))
  }

  return scanned.join('\n\n')
}

export async function POST(request: Request) {
  const {
    messages,
  }: {
    messages: Array<UIMessage>
  } = await request.json()

  const result = streamText({
    model: openai('gpt-5-nano'),
    system: systemPrompt({ llms: getLLMsTxt() }),
    tools: {
      provideLinks: tool({
        description:
          'Provide links to articles found using the Web Search tool. This is compulsory and MUST be called after a web search, as it gives the user context on which URLs were used to generate the response.',
        inputSchema: ProvideLinksToolSchema,
        execute: async ({ links }) => ({
          links,
        }),
      }),
      webSearch: openai.tools.webSearch({
        searchContextSize: 'medium',
      }),
      getPageContent: tool({
        description:
          'Get the list of pages in the documentation.',
        inputSchema: GetPageContentToolSchema,
        execute: async ({ path }) => {
          const slugs = path.split('/')
          const page = source.getPage(slugs)

          if (!page) {
            return {
              success: false,
              data: 'Page not found',
            }
          }

          return {
            success: true,
            data: await page.data.getText('processed'),
          }
        },
      }),
    },
    messages: convertToModelMessages(messages, {
      ignoreIncompleteToolCalls: true,
    }),
    toolChoice: 'auto',
    experimental_transform: smoothStream({
      delayInMs: 20,
      chunking: 'line',
    }),
    stopWhen: stepCountIs(10),
    onStepFinish: async ({ toolResults }) => {
      if (env.NODE_ENV !== 'production') {
        console.log(`Step Results: ${JSON.stringify(toolResults, null, 2)}`)
      }
    },
  })

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      if (env.NODE_ENV !== 'production') {
        console.error('An error occurred:', {
          name: (error as Error).name,
          message: (error as Error).message,
        })
      }

      if (NoSuchToolError.isInstance(error)) {
        return 'The model tried to call an unknown tool.'
      } else if (InvalidToolInputError.isInstance(error)) {
        return 'The model called a tool with invalid arguments.'
      } else {
        return 'An unknown error occurred.'
      }
    },
  })
}
