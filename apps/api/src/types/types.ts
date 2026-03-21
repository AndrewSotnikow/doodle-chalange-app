import { z } from 'zod';

import {
  messageSchema,
  messageInternalSchema,
  createMessageSchema,
  getMessagesQuerySchema,
  apiErrorSchema,
} from '../schemas/schemas.js';

type Message = z.infer<typeof messageSchema>;
type MessageInternal = z.infer<typeof messageInternalSchema>;
type CreateMessageBody = z.infer<typeof createMessageSchema>;
type GetMessagesQuery = z.infer<typeof getMessagesQuerySchema>;
type ApiError = z.infer<typeof apiErrorSchema>;

export type {
  Message,
  MessageInternal,
  CreateMessageBody,
  GetMessagesQuery,
  ApiError,
};
