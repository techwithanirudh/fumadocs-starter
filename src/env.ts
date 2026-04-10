import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  server: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    OPENAI_API_KEY: z.string().startsWith('sk-'),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.url().min(1).optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL:
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : undefined),
  },
})
