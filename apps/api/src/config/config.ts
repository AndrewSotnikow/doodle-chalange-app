import { env } from './env.js';

// Hardcoded token for authentication, in a real world scenario this should not be hardcoded
const AUTH_TOKEN = 'super-secret-doodle-token';

export const CONFIG = {
  port: env.PORT,
  env: env.NODE_ENV,
  cors: {
    origin: env.CORS_ORIGIN,
    methods: env.CORS_METHODS.split(','),
  },
  api: {
    version: env.API_VERSION,
    url: env.API_URL,
    route: `/api/${env.API_VERSION}`,
    defaultMessagesLimit: env.DEFAULT_MESSAGES_LIMIT,
    timeoutErrorDelay: 15000,
  },
  auth: {
    token: AUTH_TOKEN,
  },
  mongodb: {
    uri: env.MONGODB_URI,
  },
} as const;
