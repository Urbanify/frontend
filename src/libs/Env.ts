import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// Don't add NODE_ENV into T3 Env, it changes the tree-shaking behavior
export const Env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_API_URL: z.string().optional(),
    NEXT_PUBLIC_IMGBB_KEY: z.string(),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
    API_URL: z.string().url().optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    NEXT_PUBLIC_IMGBB_KEY: process.env.NEXT_PUBLIC_IMGBB_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
    API_URL: process.env.API_URL,
  },
});
