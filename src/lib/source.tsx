import { docs } from 'fumadocs-mdx:collections/server'
import {
  type InferMetaType,
  type InferPageType,
  type LoaderPlugin,
  loader,
  multiple,
} from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server'
import { openapi } from '@/lib/openapi'

const CODE_TAG_NAME = /^<\w+ \/>$/

export const source = loader(
  multiple({
    docs: docs.toFumadocsSource(),
    openapi: await openapiSource(openapi, {
      groupBy: 'tag',
      baseDir: 'api-reference',
    }),
  }),
  {
    baseUrl: '/docs',
    plugins: [pageTreeCodeTitles(), lucideIconsPlugin(), openapiPlugin()],
  }
)

function pageTreeCodeTitles(): LoaderPlugin {
  return {
    transformPageTree: {
      file(node) {
        if (
          typeof node.name === 'string' &&
          (node.name.endsWith('()') || node.name.match(CODE_TAG_NAME))
        ) {
          return {
            ...node,
            name: (
              <code className='text-[0.8125rem]' key='0'>
                {node.name}
              </code>
            ),
          }
        }
        return node
      },
    },
  }
}

export type Page = InferPageType<typeof source>
export type Meta = InferMetaType<typeof source>
