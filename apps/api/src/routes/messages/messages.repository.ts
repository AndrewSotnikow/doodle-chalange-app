import { randomUUID } from 'crypto';
import { FilterQuery } from 'mongoose';

import { INITIAL_MESSAGES } from '../../data/messages.js';
import { databaseRuntime } from '../../db/runtime.js';
import { MessageModel } from '../../models/message.model.js';
import { CreateMessageBody, MessageInternal } from '../../types/types.js';

let memoryMessages: MessageInternal[] = INITIAL_MESSAGES.map((message) => ({
  ...message,
  createdAt: new Date(message.createdAt),
}));

const filterByDate = (
  messages: MessageInternal[],
  after: string | undefined,
  before: string | undefined
): MessageInternal[] => {
  const afterDate = after ? new Date(after) : null;
  const beforeDate = before ? new Date(before) : null;

  return messages.filter((message) => {
    const createdAtTime = message.createdAt.getTime();

    if (afterDate && createdAtTime <= afterDate.getTime()) {
      return false;
    }

    if (beforeDate && createdAtTime >= beforeDate.getTime()) {
      return false;
    }

    return true;
  });
};

const sortByDate = (
  messages: MessageInternal[],
  sortOrder: 1 | -1
): MessageInternal[] => {
  return [...messages].sort(
    (left, right) =>
      (left.createdAt.getTime() - right.createdAt.getTime()) * sortOrder
  );
};

const messagesRepository = {
  async createMessage(data: CreateMessageBody): Promise<MessageInternal> {
    if (databaseRuntime.isMemory()) {
      const nextMessage: MessageInternal = {
        _id: randomUUID(),
        ...data,
        createdAt: new Date(),
      };

      memoryMessages = [...memoryMessages, nextMessage];

      return nextMessage;
    }

    return MessageModel.create({
      ...data,
      createdAt: new Date(),
    });
  },

  async getMessages({
    sortOrder = -1,
    limit,
    after,
    before,
  }: {
    sortOrder: 1 | -1;
    limit: number;
    after: string | undefined;
    before: string | undefined;
  }): Promise<MessageInternal[]> {
    if (databaseRuntime.isMemory()) {
      let messages = filterByDate(memoryMessages, after, before);
      messages = sortByDate(messages, sortOrder).slice(0, limit);

      if (before) {
        messages = messages.reverse();
      }

      return messages;
    }

    const query: FilterQuery<MessageInternal> = {};

    if (after || before) {
      const createdAtQuery: { $gt?: Date; $lt?: Date } = {};

      if (after) {
        createdAtQuery.$gt = new Date(after);
      }

      if (before) {
        createdAtQuery.$lt = new Date(before);
      }

      query.createdAt = createdAtQuery;
    }

    let messages = await MessageModel.find(query)
      .sort({ createdAt: sortOrder })
      .limit(limit)
      .lean();

    if (before) {
      messages = messages.reverse();
    }

    return messages;
  },
};

export { messagesRepository };
