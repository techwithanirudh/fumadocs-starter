import { createAPIPage } from 'fumadocs-openapi/ui'
import { openapi } from '@/lib/openapi'
import { defaultShikiOptions } from '@/lib/shiki'

export const APIPage = createAPIPage(openapi, {
  shikiOptions: defaultShikiOptions,
})
