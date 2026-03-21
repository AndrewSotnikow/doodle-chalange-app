const DEFAULT_CONFIG = {
  api: {
    version: 'v1',
    url: 'http://localhost',
    messagesLimit: 50,
  },
  app: {
    port: 3000,
    corsOrigin: '*',
    corsMethods: 'GET,POST,OPTIONS',
    env: 'development',
  },
  database: {
    uri: 'mongodb://localhost:27017/mydb',
  },
} as const;

export { DEFAULT_CONFIG };
