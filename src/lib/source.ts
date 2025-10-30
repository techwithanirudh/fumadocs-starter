import {
  type InferMetaType,
  type InferPageType,
  loader,
  multiple,
} from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server'
import { docs } from '@/.source'
import { openapi } from '@/lib/openapi'

export const source = loader(
  multiple({
    docs: docs.toFumadocsSource(),
    openapi: await openapiSource(openapi, {
      baseDir: 'api-reference/(generated)',
    }),
  }),
  {
    baseUrl: '/docs',
    plugins: [lucideIconsPlugin(), openapiPlugin()],
  }
)

export type Page = InferPageType<typeof source>
export type Meta = InferMetaType<typeof source>
