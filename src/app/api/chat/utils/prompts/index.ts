import { corePrompt } from './core'
import { directivesPrompt } from './directives'
import { examplesPrompt } from './examples'
import { llmsPrompt } from './llms'
import { toolsPrompt } from './tools'

export const systemPrompt = ({ llms }: { llms: string }) =>
  [corePrompt, directivesPrompt, toolsPrompt, llmsPrompt(llms), examplesPrompt]
    .filter(Boolean)
    .join('\n\n')
    .trim()
