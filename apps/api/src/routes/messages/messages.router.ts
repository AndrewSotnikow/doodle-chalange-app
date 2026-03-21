import { Router } from 'express';

import { validateBody, validateQuery } from './validation.js';
import {
  createMessageSchema,
  getMessagesQuerySchema,
} from '../../schemas/schemas.js';
import { messagesController } from './messages.controller.js';

const messagesRouter = Router();

messagesRouter.post('/', validateBody(createMessageSchema), (req, res, next) =>
  messagesController.createMessage(req, res, next)
);

messagesRouter.get(
  '/',
  validateQuery(getMessagesQuerySchema),
  (req, res, next) => messagesController.getMessages(req, res, next)
);

export { messagesRouter };
