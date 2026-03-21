import { Application } from 'express';

import { authMiddleware } from '../middleware/auth.js';
import { messagesRouter } from '../routes/messages/messages.router.js';
import { healthRouter } from '../routes/health/health.router.js';
import { docsRouter } from '../routes/docs/docs.router.js';
import { CONFIG } from '../config/config.js';

const setupApiRoutes = (app: Application): void => {
  app.use(`${CONFIG.api.route}/messages`, authMiddleware, messagesRouter);
};

const setupUtilityRoutes = (app: Application): void => {
  // Health Check
  app.use('/health', healthRouter);
  // API Documentation
  app.use(`${CONFIG.api.route}/docs`, docsRouter);
};

const setupRoutes = (app: Application): void => {
  setupUtilityRoutes(app);
  setupApiRoutes(app);
};

export { setupRoutes };
