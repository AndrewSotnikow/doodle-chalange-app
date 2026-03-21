import { z } from 'zod';

import { VALIDATION_CONFIG } from '../config/validation.js';

const authorSchema = z
  .string()
  .trim()
  .min(VALIDATION_CONFIG.author.minLength, {
    message: `Author must be at least ${VALIDATION_CONFIG.author.minLength.toString()} characters`,
  })
  .max(VALIDATION_CONFIG.author.maxLength, {
    message: `Author cannot exceed ${VALIDATION_CONFIG.author.maxLength.toString()} characters`,
  })
  .regex(/^[\w\s-]+$/, {
    message:
      'Author can only contain letters, numbers, spaces, hyphens, and underscores',
  });

const messageBaseSchema = {
  _id: z.string(),
  message: z
    .string()
    .trim()
    .min(VALIDATION_CONFIG.message.minLength, {
      message: 'Message cannot be empty',
    })
    .max(VALIDATION_CONFIG.message.maxLength, {
      message: `Message cannot exceed ${VALIDATION_CONFIG.message.maxLength.toString()} characters`,
    }),
  author: authorSchema,
};

const createMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(VALIDATION_CONFIG.message.minLength, {
      message: 'Message cannot be empty',
    })
    .max(VALIDATION_CONFIG.message.maxLength, {
      message: `Message cannot exceed ${VALIDATION_CONFIG.message.maxLength.toString()} characters`,
    }),
  author: authorSchema,
});

const messageInternalSchema = z.object({
  ...messageBaseSchema,
  createdAt: z.date(),
});

const messageSchema = z.object({
  ...messageBaseSchema,
  createdAt: z.string().datetime(),
});

const getMessagesQuerySchema = z
  .object({
    limit: z.coerce
      .number()
      .int({ message: 'Limit must be an integer.' })
      .min(1, { message: 'Limit must be at least 1.' })
      .max(VALIDATION_CONFIG.message.maxLimit, {
        message: `Limit cannot exceed ${VALIDATION_CONFIG.message.maxLimit.toString()}.`,
      })
      .optional(),
    after: z.string().datetime('Invalid timestamp format').optional(),
    before: z.string().datetime('Invalid timestamp format').optional(),
  })
  .refine((data) => !(data.after && data.before), {
    message: 'Cannot use both "after" and "before" parameters simultaneously.',
    path: ['before'],
  });

const apiErrorSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  name: z.string().optional(),
  stack: z.string().optional(),
});

export {
  createMessageSchema,
  messageInternalSchema,
  messageSchema,
  getMessagesQuerySchema,
  apiErrorSchema,
};
