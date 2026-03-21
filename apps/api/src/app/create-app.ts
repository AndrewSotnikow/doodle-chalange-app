import express, { Application } from 'express';

import { setupMiddleware } from './middleware.js';
import { setupRoutes } from './routes.js';
import { setupErrorHandlers } from './error.js';

const createApp = (): Application => {
  const app = express();

  setupMiddleware(app);
  setupRoutes(app);
  setupErrorHandlers(app);

  return app;
};

export { createApp };
