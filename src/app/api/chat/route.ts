import { createOpenAI } from '@ai-sdk/openai'
import {
  convertToModelMessages,
  InvalidToolInputError,
  NoSuchToolError,
  smoothStream,
  streamText,
  tool,
  type UIMessage,
} from 'ai'
import { env } from '@/env'
import { systemPrompt } from '@/lib/ai/prompts'
import { ProvideLinksToolSchema } from '@/lib/ai/qa-schema'

export const runtime = 'edge'

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  const {
    messages,
  }: {
    messages: Array<UIMessage>
  } = await request.json()

  const result = streamText({
    model: openai.responses('gpt-4.1-mini'),
    system: systemPrompt,
    tools: {
      provideLinks: tool({
        description:
          'Provide links to articles found using the Web Search tool. This is compulsory and MUST be called after a web search, as it gives the user context on which URLs were used to generate the response.',
        inputSchema: ProvideLinksToolSchema,
        execute: async ({ links }) => ({
          links,
        }),
      }),
      webSearch: openai.tools.webSearchPreview({
        searchContextSize: 'medium',
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
