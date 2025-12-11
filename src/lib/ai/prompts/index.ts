import { corePrompt } from './core'
import { examplesPrompt } from './examples'
import { llmsPrompt } from './llms'
import { toolsPrompt } from './tools'

export const systemPrompt = () =>
  [corePrompt, toolsPrompt, llmsPrompt, examplesPrompt]
    .filter(Boolean)
    .join('\n\n')
    .trim()
