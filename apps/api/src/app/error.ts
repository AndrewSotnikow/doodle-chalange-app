import { Application } from 'express';

import { notFoundHandler, errorHandler } from '../middleware/error.js';

const setupErrorHandlers = (app: Application): void => {
  app.use(notFoundHandler);
  app.use(errorHandler);
};

export { setupErrorHandlers };
