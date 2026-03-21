import { Request, Response, NextFunction } from 'express';

import {
  Message,
  CreateMessageBody,
  GetMessagesQuery,
} from '../../types/types.js';
import { CONFIG } from '../../config/config.js';
import { messagesService } from './messages.service.js';

const messagesController = {
  async createMessage(
    req: Request<object, Message, CreateMessageBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const newMessage = await messagesService.createMessage(req.body);

      res.status(201).json(newMessage);
    } catch (err) {
      next(err);
    }
  },

  async getMessages(
    req: Request<object, Message[], unknown, GetMessagesQuery>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { limit, after, before } = req.query;
      // Default to ascending (oldest first) when no pagination params
      // Use ascending with 'after' to get newer messages, descending with 'before' to get older messages
      const sortOrder = after ? 1 : before ? -1 : 1;
      const limitMessages = limit ?? CONFIG.api.defaultMessagesLimit;

      const messages = await messagesService.getMessages({
        sortOrder,
        limit: limitMessages,
        after,
        before,
      });

      res.status(200).json(messages);
    } catch (err) {
      next(err);
    }
  },
};

export { messagesController };
