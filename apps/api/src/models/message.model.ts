import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';

import { MessageInternal } from '../types/types.js';

const MessageSchema = new Schema<MessageInternal>(
  {
    _id: {
      type: String,
      default: () => crypto.randomUUID(),
    },
    message: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  {
    versionKey: false,
  }
);

MessageSchema.index({ createdAt: -1 });

export const MessageModel = mongoose.model<MessageInternal>(
  'Message',
  MessageSchema
);
