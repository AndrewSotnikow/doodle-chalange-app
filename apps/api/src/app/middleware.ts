import { Application, json } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

import { CONFIG } from '../config/config.js';
import { timeoutHandler } from '../middleware/timeout.js';

const setupMiddleware = (app: Application): void => {
  app.use(helmet());
  app.use(
    cors({
      origin: CONFIG.cors.origin,
      methods: CONFIG.cors.methods,
    })
  );
  app.use(compression());
  app.use(json());
  app.use(timeoutHandler);
};

export { setupMiddleware };
