import {
  type InferMetaType,
  type InferPageType,
  loader,
} from 'fumadocs-core/source';
import { openapiPlugin } from 'fumadocs-openapi/server';
import {  docs } from '@/.source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { openapi } from '@/lib/openapi';
import { APIPage } from 'fumadocs-openapi/ui';

export const source = loader(docs.toFumadocsSource(), {
  baseUrl: '/docs',
  plugins: [
    lucideIconsPlugin(),
    await openapiPlugin.withPages({
      from: openapi,
      APIPage,
      baseDir: 'api-reference/(generated)',
    }),
  ],
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;